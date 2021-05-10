const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')
const nocache = require('nocache')
const winston = require('winston')
const express = require('express')
const proxyMiddleware = require('proxy-middleware')
const {Initializer} = require('./lib/initializer')
const {Validator} = require('./lib/validator')
const {ImageMaker} = require('./lib/image-maker')
const {PriceCalculator} = require('./lib/price-calculator')

class App {
  constructor () {
    this.initializer = new Initializer()
    this.validator = new Validator()
    this.imageMaker = new ImageMaker()
    this.priceCalculator = new PriceCalculator()

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
    this.router.get('/api/v1/product/add/initialize', this.onRequestApiV1ProductAddInitialize.bind(this))
    this.router.post('/api/v1/product/add/change', this.onRequestApiV1ProductAddChange.bind(this))

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
    res.locals.env = process.env

    next()
  }

  onRequestProductImageFront (req, res, next) {

  }

  onRequestProductImageFront (req, res, next) {
    
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
        image = this.imageMaker.makeImage(req)
        price = this.priceCalculator.calculatePrice(req)
      }

      res.send({validation, image, price})
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
