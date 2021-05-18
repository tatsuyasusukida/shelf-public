const path = require('path')
const querystring = require('querystring')
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
const {Finder} = require('./lib/finder')
const {CodeGenerator} = require('./lib/code-generator')
const {ReviewMaker} = require('./lib/review-maker')
const model = require('./model')

class App {
  constructor () {
    this.finder = new Finder()
    this.converter = new Converter()
    this.validator = new Validator()
    this.imageMaker = new ImageMaker()
    this.initializer = new Initializer()
    this.reviewMaker = new ReviewMaker()
    this.codeGenerator = new CodeGenerator()
    this.priceCalculator = new PriceCalculator()
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
    this.router.use('/render/', proxyMiddleware(process.env.URL_RENDER))

    if (process.env.PROXY === '1') {
      this.router.use('/static/', proxyMiddleware('http://127.0.0.1:8080/'))
    } else {
      this.router.use('/static/', express.static(path.join(__dirname, 'static')))
    }

    this.router.get('/', (req, res) => res.redirect('./product/add/'))
    this.router.get('/layout/', (req, res) => res.render('layout'))
    this.router.get('/list/', (req, res) => res.render('list'))
    this.router.get('/product/add/', (req, res) => res.render('product-add'))
    this.router.use('/product/:productId([0-9]+)/', this.session, this.onRequestFindCart.bind(this), this.onRequestFindProduct.bind(this))
    this.router.get('/product/:productId([0-9]+)/edit/', (req, res) => res.render('product-edit'))
    this.router.get('/product/:productId([0-9]+)/delete/', (req, res) => res.render('product-delete'))
    this.router.get('/product/delete/finish/', (req, res) => res.render('product-delete-finish'))
    this.router.get('/estimate/', (req, res) => res.render('estimate'))
    this.router.get('/estimate/finish/', (req, res) => res.render('estimate-finish'))
    this.router.get('/estimate/print/', (req, res) => res.render('estimate-print'))
    this.router.get('/order/', (req, res) => res.render('order'))
    this.router.get('/order/finish/', (req, res) => res.render('order-finish'))
    this.router.get('/question/', (req, res) => res.render('question'))
    this.router.get('/question/finish/', (req, res) => res.render('question-finish'))

    this.router.use('/api/v1/', nocache())
    this.router.use('/api/v1/', express.json())
    this.router.get('/api/v1/list/initialize', this.session, this.onRequestApiV1ListInitialize.bind(this))
    this.router.get('/api/v1/product/add/initialize', this.onRequestApiV1ProductAddInitialize.bind(this))
    this.router.post('/api/v1/product/add/change', this.onRequestApiV1ProductAddChange.bind(this))
    this.router.post('/api/v1/product/add/validate', this.onRequestApiV1ProductAddValidate.bind(this))
    this.router.post('/api/v1/product/add/submit', this.session, this.onRequestApiV1ProductAddSubmit.bind(this))
    this.router.use('/api/v1/product/:productId([0-9]+)/', this.session, this.onRequestFindCart.bind(this), this.onRequestFindProduct.bind(this))
    this.router.get('/api/v1/product/:productId([0-9]+)/edit/initialize', this.onRequestApiV1ProductEditInitialize.bind(this))
    this.router.put('/api/v1/product/:productId([0-9]+)/edit/change', this.onRequestApiV1ProductEditChange.bind(this))
    this.router.put('/api/v1/product/:productId([0-9]+)/edit/validate', this.onRequestApiV1ProductEditValidate.bind(this))
    this.router.put('/api/v1/product/:productId([0-9]+)/edit/submit', this.session, this.onRequestApiV1ProductEditSubmit.bind(this))
    this.router.get('/api/v1/product/:productId([0-9]+)/delete/initialize', this.onRequestApiV1ProductDeleteInitialize.bind(this))
    this.router.delete('/api/v1/product/:productId([0-9]+)/delete/submit', this.onRequestApiV1ProductDeleteSubmit.bind(this))
    this.router.get('/api/v1/estimate/initialize', this.onRequestApiV1EstimateInitialize.bind(this))
    this.router.post('/api/v1/estimate/validate', this.onRequestApiV1EstimateValidate.bind(this))
    this.router.post('/api/v1/estimate/review', this.session, this.onRequestFindCart.bind(this), this.onRequestApiV1EstimateReview.bind(this))
    this.router.post('/api/v1/estimate/submit', this.session, this.onRequestFindCart.bind(this), this.onRequestApiV1EstimateSubmit.bind(this))
    this.router.get('/api/v1/estimate/print/initialize', this.session, this.onRequestFindCart.bind(this), this.onRequestApiV1EstimatePrintInitialize.bind(this))
    this.router.get('/api/v1/order/initialize', this.onRequestApiV1OrderInitialize.bind(this))
    this.router.post('/api/v1/order/validate', this.onRequestApiV1OrderValidate.bind(this))
    this.router.post('/api/v1/order/review', this.session, this.onRequestFindCart.bind(this), this.onRequestApiV1OrderReview.bind(this))
    this.router.post('/api/v1/order/submit', this.session, this.onRequestFindCart.bind(this), this.onRequestApiV1OrderSubmit.bind(this))
    this.router.get('/api/v1/question/initialize', this.onRequestApiV1QuestionInitialize.bind(this))
    this.router.post('/api/v1/question/validate', this.onRequestApiV1QuestionValidate.bind(this))
    this.router.post('/api/v1/question/review', this.session, this.onRequestFindCart.bind(this), this.onRequestApiV1QuestionReview.bind(this))
    this.router.post('/api/v1/question/submit', this.session, this.onRequestFindCart.bind(this), this.onRequestApiV1QuestionSubmit.bind(this))

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
    res.locals.req = req
    res.locals.url = new URL(req.originalUrl, process.env.BASE_URL)

    next()
  }

  async onRequestFindCart (req, res, next) {
    try {
      if (!req.session || !req.session.cartId) {
        res.status(400).end()
        return
      }

      const cart = await this.finder.findCart(req.session.cartId)

      if (!cart) {
        res.status(400).end()
        return
      }

      next()
    } catch (err) {
      next(err)
    }
  }

  async onRequestFindProduct (req, res, next) {
    try {
      const product = await this.finder.findProduct(req.params.productId)

      if (!product) {
        res.status(404).end()
        return
      }

      const args = [req.session.cartId, product.id]
      const cartProduct = await this.finder.findCartProduct(...args)

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
        const cartProducts = await this.finder.findCartProducts(req.session.cartId)

        products = cartProducts.map(({product}, i) => {
          return this.converter.convertProduct(product, i + 1)
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
        const cartId = await this.findOrCreateCartId(req, transaction)
        const args = [req.body.form, transaction]
        const product = await this.createProduct(...args)

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

  async findOrCreateCartId (req, transaction) {
    if (req.session.cartId) {
      const args = [req.session.cartId, transaction]
      const cart = await this.finder.findCart(...args)

      if (cart) {
        return cart.id
      }
    }

    const cart = await model.cart.create({}, {transaction})
    return cart.id
  }

  async onRequestApiV1ProductEditInitialize (req, res, next) {
    try {
      const form = this.initializer.makeFormProduct()
      const validation = this.validator.makeValidationProduct()
      const options = this.initializer.makeOptionsProduct()

      form.width = '' + req.locals.product.width
      form.height = '' + req.locals.product.height
      form.depth = '' + req.locals.product.depth
      form.row = '' + req.locals.product.row
      form.thickness = '' + req.locals.product.thickness
      form.fix = '' + req.locals.product.fix
      form.back = '' + req.locals.product.back
      form.color = '' + req.locals.product.color
      form.amount = '' + req.locals.product.amount

      res.send({form, validation, options})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductEditChange (req, res, next) {
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

  async onRequestApiV1ProductEditValidate (req, res, next) {
    try {
      const validation = await this.validator.validateProduct(req)

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1ProductEditSubmit (req, res, next) {
    try {
      const validation = await this.validator.validateProduct(req)

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      await model.sequelize.transaction(async (transaction) => {
        req.locals.product.width = req.body.form.width
        req.locals.product.height = req.body.form.height
        req.locals.product.depth = req.body.form.depth
        req.locals.product.row = req.body.form.row
        req.locals.product.thickness = req.body.form.thickness
        req.locals.product.fix = req.body.form.fix
        req.locals.product.back = req.body.form.back
        req.locals.product.color = req.body.form.color
        req.locals.product.amount = req.body.form.amount

        await req.locals.product.save({transaction})

        const ok = true
        const redirect = '../../../list/'

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

  async onRequestApiV1EstimateInitialize (req, res, next) {
    try {
      const form = this.initializer.makeFormEstimate()
      const validation = this.validator.makeValidationEstimate()
      const options = this.initializer.makeOptionsEstimate()

      res.send({form, validation, options})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1EstimateValidate (req, res, next) {
    try {
      const validation = await this.validator.validateEstimate(req)

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1EstimateReview (req, res, next) {
    try {
      res.send(await this.reviewMaker.makeReviewEstimate(req))
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1EstimateSubmit (req, res, next) {
    try {
      const validation = await this.validator.validateEstimate(req)

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      await model.sequelize.transaction(async (transaction) => {
        const args = [req.session.cartId, transaction]
        const cartProducts = await this.finder.findCartProducts(...args)

        if (cartProducts.length === 0) {
          res.status(400).end()
          return
        }

        if (process.env.DEMO_IS_ENABLED === '1') {
          req.body.form.name = '株式会社ロレムイプサム'
          req.body.form.email = 'shelf@loremipsum.co.jp' 
        }

        const {summary} = await this.reviewMaker.makeReviewEstimate(req, transaction)
        const estimate = await model.estimate.create({
          date: new Date(),
          number: await this.codeGenerator.generateEstimateNumber(transaction),
          name: req.body.form.name,
          title: req.body.form.title,
          subscribe: req.body.form.subscribe,
          email: req.body.form.email,
          price: summary.total,
        }, {transaction})

        await model.cartEstimate.create({
          cartId: req.session.cartId,
          estimateId: estimate.id,
        }, {transaction})

        for (const cartProduct of cartProducts) {
          const args = [cartProduct.product, transaction]
          const product = await this.createProduct(...args)

          await model.estimateProduct.create({
            sort: cartProducts.indexOf(cartProduct) + 1,
            estimateId: estimate.id,
            productId: product.id,
          }, {transaction})
        }

        const ok = true
        const redirect = './finish/?estimateId=' + estimate.id

        res.send({ok, redirect})
      })
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1EstimatePrintInitialize (req, res, next) {
    try {
      const estimate = await this.finder.findEstimate(req.query.estimateId)

      if (!estimate) {
        res.status(404).end()
        return
      }

      const args = [req.session.cartId, estimate.id]
      const cartEstimate = await this.finder.findCartEstimate(...args)

      if (!cartEstimate) {
        res.status(403).end()
        return
      }

      const estimateProducts = await this.finder.findEstimateProducts(estimate.id)
      const products = estimateProducts.map(({product}, i) => {
        return this.converter.convertProduct(product, i + 1)
      })

      const subtotal = products.reduce((memo, product) => {
        return memo + product.price.total
      }, 0)

      const tax = Math.floor(subtotal * process.env.TAX_PERCENT / 100)
      const total = subtotal + tax
      const summary = {
        subtotal,
        subtotalText: this.converter.formatNumber(subtotal),
        tax,
        taxText: this.converter.formatNumber(tax),
        total,
        totalText: this.converter.formatNumber(total),
      }

      res.send({
        estimate: this.converter.convertEstimate(estimate),
        products,
        summary,
      })
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1OrderInitialize (req, res, next) {
    try {
      const form = this.initializer.makeFormOrder()
      const validation = this.validator.makeValidationOrder()
      const options = this.initializer.makeOptionsOrder()

      res.send({form, validation, options})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1OrderValidate (req, res, next) {
    try {
      const validation = await this.validator.validateOrder(req)

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1OrderReview (req, res, next) {
    try {
      res.send(await this.reviewMaker.makeReviewOrder(req))
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1OrderSubmit (req, res, next) {
    try {
      const validation = await this.validator.validateOrder(req)

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      await model.sequelize.transaction(async (transaction) => {
        const args = [req.session.cartId, transaction]
        const cartProducts = await this.finder.findCartProducts(...args)

        if (cartProducts.length === 0) {
          res.status(400).end()
          return
        }

        if (process.env.DEMO_IS_ENABLED === '1') {
          req.body.form.name = 'ここに氏名が入ります'
          req.body.form.kana = 'ここにフリガナが入ります'
          req.body.form.company = '株式会社ロレムイプサム'
          req.body.form.zip = '9402039'
          req.body.form.address = '新潟県長岡市関原南4丁目3934番地'
          req.body.form.tel = '0258945233'
          req.body.form.email = 'shelf@loremipsum.co.jp'
          req.body.form.content = [
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
          ].join('\n')
        }

        const {summary} = await this.reviewMaker.makeReviewOrder(req, transaction)
        const order = await model.order.create({
          date: new Date(),
          number: await this.codeGenerator.generateOrderNumber(transaction),
          name: req.body.form.name,
          kana: req.body.form.kana,
          company: req.body.form.company,
          zip: req.body.form.zip,
          address: req.body.form.address,
          tel: req.body.form.tel,
          email: req.body.form.email,
          memo: req.body.form.memo,
          payment: req.body.form.payment,
          price: summary.total,
        }, {transaction})

        const products = []

        for (const cartProduct of cartProducts) {
          const args = [cartProduct.product, transaction]
          const product = await this.createProduct(...args)

          await model.orderProduct.create({
            sort: cartProducts.indexOf(cartProduct) + 1,
            orderId: order.id,
            productId: product.id,
          }, {transaction})
        }

        const ok = true
        const isCreditCard = order.payment === 'クレジットカード'
        const pathname = isCreditCard ? './payment/' : './finish/'
        const redirect = pathname + '?' + querystring.stringify({
          number: order.number,
        })

        res.send({ok, redirect})
      })
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1QuestionInitialize (req, res, next) {
    try {
      const form = this.initializer.makeFormQuestion()
      const validation = this.validator.makeValidationQuestion()
      const options = this.initializer.makeOptionsQuestion()

      if (req.query.category === 'product') {
        form.category = '商品について'
      } else if (req.query.category === 'discount') {
        form.category = '法人割引について'
      }

      res.send({form, validation, options})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1QuestionValidate (req, res, next) {
    try {
      const validation = await this.validator.validateQuestion(req)

      res.send({validation})
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1QuestionReview (req, res, next) {
    try {
      res.send(await this.reviewMaker.makeReviewQuestion(req))
    } catch (err) {
      next(err)
    }
  }

  async onRequestApiV1QuestionSubmit (req, res, next) {
    try {
      const validation = await this.validator.validateQuestion(req)

      if (!validation.ok) {
        res.status(400).end()
        return
      }

      await model.sequelize.transaction(async (transaction) => {
        const args = [req.session.cartId, transaction]
        const cartProducts = await this.finder.findCartProducts(...args)

        if (cartProducts.length === 0) {
          res.status(400).end()
          return
        }

        if (process.env.DEMO_IS_ENABLED === '1') {
          req.body.form.name = 'ここに氏名が入ります'
          req.body.form.kana = 'ここにフリガナが入ります'
          req.body.form.company = '株式会社ロレムイプサム'
          req.body.form.zip = '9402039'
          req.body.form.address = '新潟県長岡市関原南4丁目3934番地'
          req.body.form.tel = '0258945233'
          req.body.form.email = 'shelf@loremipsum.co.jp'
          req.body.form.content = [
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
          ].join('\n')
        }

        const {summary} = await this.reviewMaker.makeReviewQuestion(req, transaction)
        const question = await model.question.create({
          date: new Date(),
          number: await this.codeGenerator.generateQuestionNumber(transaction),
          name: req.body.form.name,
          kana: req.body.form.kana,
          company: req.body.form.company,
          zip: req.body.form.zip,
          address: req.body.form.address,
          tel: req.body.form.tel,
          email: req.body.form.email,
          content: req.body.form.content,
          price: summary.total,
        }, {transaction})

        const products = []

        for (const cartProduct of cartProducts) {
          const args = [cartProduct.product, transaction]
          const product = await this.createProduct(...args)

          await model.questionProduct.create({
            sort: cartProducts.indexOf(cartProduct) + 1,
            questionId: question.id,
            productId: product.id,
          }, {transaction})
        }

        const ok = true
        const redirect = './finish/?' + querystring.stringify({
          number: question.number,
        })

        res.send({ok, redirect})
      })
    } catch (err) {
      next(err)
    }
  }

  async createProduct (form, transaction) {
    return await model.product.create({
      width: form.width,
      height: form.height,
      depth: form.depth,
      row: form.row,
      thickness: form.thickness,
      fix: form.fix,
      back: form.back,
      color: form.color,
      amount: form.amount,
    }, {transaction})
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
