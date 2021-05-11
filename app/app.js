const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')
const nocache = require('nocache')
const winston = require('winston')
const express = require('express')
const session = require('express-session')
const proxyMiddleware = require('proxy-middleware')
const MySQLStore = require('express-mysql-session')(session)
const {Initializer} = require('./lib/initializer')
const {Validator} = require('./lib/validator')
const {ImageMaker} = require('./lib/image-maker')
const {PriceCalculator} = require('./lib/price-calculator')
const {Converter} = require('./lib/converter')
const model = require('./model')
const {Op} = require('sequelize')

class App {
  constructor () {
    this.initializer = new Initializer()
    this.validator = new Validator()
    this.imageMaker = new ImageMaker()
    this.priceCalculator = new PriceCalculator()
    this.converter = new Converter()

    this.session = session({
      cookie: {
        path: '/',
        httpOnly: true,
        secure: process.env.SESSION_SECURE === '1',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      },
      name: 'shelf_session',
      resave: false,
      rolling: true,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new MySQLStore({
        host: process.env.STORE_HOST,
        port: process.env.STORE_PORT,
        user: process.env.STORE_USER,
        password: process.env.STORE_PASSWORD,
        database: process.env.STORE_DATABASE,
      }),
    })

    this.router = express()

    this.router.set('strict routing', true)
    this.router.set('views', path.join(__dirname, 'view'))
    this.router.set('view engine', 'pug')
    this.router.set('trust proxy', true)

    this.router.use(helmet())
    this.router.use(morgan(process.env.LOG_ACCESS, {
      stream: {
        write: message => {
          winston.loggers.get('access').info(message.trim())
        },
      },
    }))

    this.router.use(this.onRequestInitialize.bind(this))

    if (process.env.PROXY === '1') {
      this.router.use('/static/', proxyMiddleware('http://127.0.0.1:8080/'))
    } else {
      this.router.use('/static/', express.static(path.join(__dirname, 'static')))
    }

    this.router.use('/render/', proxyMiddleware(process.env.URL_RENDER))

    this.router.get('/', (req, res) => res.redirect('./product/add/'))
    this.router.get('/layout/', (req, res) => res.render('layout'))
    this.router.get('/list/', (req, res) => res.render('list'))
    this.router.get('/product/add/', (req, res) => res.render('product-add'))
    this.router.use('/product/:productId([0-9]+)/', this.session, this.onRequestFindProduct.bind(this))
    this.router.get('/product/:productId([0-9]+)/edit/', (req, res) => res.render('product-edit'))
    this.router.get('/product/:productId([0-9]+)/delete/', (req, res) => res.render('product-delete'))
    this.router.get('/product/delete/finish/', (req, res) => res.render('product-delete-finish'))
    this.router.get('/estimate/', (req, res) => res.render('estimate-index'))
    this.router.get('/estimate/review/', (req, res) => res.render('estimate-review'))
    this.router.get('/estimate/finish/', (req, res) => res.render('estimate-finish'))
    this.router.get('/estimate/print/', (req, res) => res.render('estimate-print'))
    this.router.get('/order/', (req, res) => res.render('order-index'))
    this.router.get('/order/review/', (req, res) => res.render('order-review'))
    this.router.get('/order/payment/', (req, res) => res.render('order-payment'))
    this.router.get('/order/finish/', (req, res) => res.render('order-finish'))
    this.router.get('/question/', (req, res) => res.render('question-index'))
    this.router.get('/question/review/', (req, res) => res.render('question-review'))
    this.router.get('/question/finish/', (req, res) => res.render('question-finish'))

    this.router.use('/api/v1/', nocache())
    this.router.use('/api/v1/', express.json())
    this.router.get('/api/v1/list/initialize', this.session, this.onRequestApiV1ListInitialize.bind(this))
    this.router.get('/api/v1/product/add/initialize', this.onRequestApiV1ProductAddInitialize.bind(this))
    this.router.post('/api/v1/product/add/change', this.onRequestApiV1ProductAddChange.bind(this))
    this.router.post('/api/v1/product/add/validate', this.onRequestApiV1ProductAddValidate.bind(this))
    this.router.post('/api/v1/product/add/submit', this.session, this.onRequestApiV1ProductAddSubmit.bind(this))
    this.router.use('/api/v1/product/:productId([0-9]+)/', this.session, this.onRequestFindProduct.bind(this))
    this.router.get('/api/v1/product/:productId([0-9]+)/delete/initialize', this.onRequestApiV1ProductDeleteInitialize.bind(this))
    this.router.delete('/api/v1/product/:productId([0-9]+)/delete/submit', this.onRequestApiV1ProductDeleteSubmit.bind(this))
    this.router.use(this.onNotFound.bind(this))
    this.router.use(this.onInternalServerError.bind(this))
  }

  onListening () {
    winston.loggers.get('info').info(`Listening on ${process.env.PORT}`)
  }

  onRequest (req, res) {
    this.router(req, res)
  }

  onRequestInitialize (req, res, next) {
    req.locals = {}
    res.locals.env = process.env

    next()
  }

  async onRequestFindProduct (req, res, next) {
    try {
      const product = await model.product.findOne({
        where: {
          id: {[Op.eq]: req.params.productId},
        },
      })

      if (!product) {
        res.status(404).end()
        return
      }

      if (!req.session.cartId) {
        res.status(403).end()
        return
      }

      const cartProduct = model.cartProduct.findOne({
        where: {
          cartId: {[Op.eq]: req.session.cartId},
          productId: {[Op.eq]: product.id},
        },
      })

      if (!cartProduct) {
        res.status(403).end()
        return
      }

      req.locals.product = product

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ListInitialize (req, res, next) {
    try {
      let products = []

      if (req.session.cartId) {
        const cartProducts = await model.cartProduct.findAll({
          where: {
            cartId: {[Op.eq]: req.session.cartId},
          },
          order: [['date', 'asc']],
          include: [model.product],
        })

        products = cartProducts.map((cartProduct, i) => {
          const {product} = cartProduct
          const number = i + 1

          return this.converter.convertProduct(product, number)
        })
      }

      res.send({products})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductAddInitialize (req, res, next) {
    try {
      const form = this.initializer.makeFormProduct()
      const validation = this.validator.makeValidationProduct()
      const options = this.initializer.makeOptionsProduct()

      res.send({form, validation, options})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductAddChange (req, res, next) {
    try {
      const validation = await this.validator.validateProduct(req)
      let image = null
      let price = null

      if (validation.ok) {
        image = this.imageMaker.makeImage(req.body.form)
        price = this.priceCalculator.calculatePrice(req.body.form)
      }

      res.send({validation, image, price})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductAddValidate (req, res, next) {
    try {
      const validation = await this.validator.validateProduct(req)

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductAddSubmit (req, res, next) {
    try {
      const validation = await this.validator.validateProduct(req)

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      await model.sequelize.transaction(async (transaction) => {
        let cartId = req.session.cartId

        if (!req.session.cartId) {
          const cart = await model.cart.create({}, {transaction})
          cartId = cart.id
        }

        const product = await model.product.create({
          width: req.body.form.width,
          height: req.body.form.height,
          depth: req.body.form.depth,
          row: req.body.form.row,
          thickness: req.body.form.thickness,
          fix: req.body.form.fix,
          back: req.body.form.back,
          color: req.body.form.color,
          amount: req.body.form.amount,
        }, {transaction})

        await model.cartProduct.create({
          date: new Date(),
          cartId,
          productId: product.id,
        }, {transaction})

        const ok = true
        const redirect = '../../list/'

        req.session.cartId = cartId
        res.send({ok, redirect})
      })
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductDeleteInitialize (req, res, next) {
    try {
      const product = this.converter.convertProduct(req.locals.product)

      res.send({product})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductDeleteSubmit (req, res, next) {
    try {
      await model.sequelize.transaction(async (transaction) => {
        await req.locals.product.destroy({transaction})

        const ok = true
        const redirect = '../../delete/finish/'

        res.send({ok, redirect})
      })
    } catch (err) {
      next(err)
    }
  }

  onNotFound (req, res) {
    res.status(404).end()
  }

  onInternalServerError (err, req, res, next) {
    res.status(500).end()
    this.onError(err)
  }

  onError (err) {
    winston.loggers.get('error').error(err.message)
    winston.loggers.get('debug').debug(err.stack)
  }
}

module.exports.App = App
