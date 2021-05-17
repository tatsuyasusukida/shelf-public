const {Finder} = require('./finder')
const {Converter} = require('./converter')

class ReviewMaker {
  constructor () {
    this.finder = new Finder()
    this.converter = new Converter()
  }

  async makeReviewOrder (req, transaction) {
    const {cartId} = req.session
    const cartProducts = await this.finder.findCartProducts(cartId)
    const products = cartProducts.map(({product}, i) => {
      return this.converter.convertProduct(product, i + 1)
    })

    const shipping = 0
    const fee = req.body.form.payment === '代金引換' ? 600 : 0
    const subtotal = shipping + fee + products.reduce((memo, product) => {
      return memo + product.price.total
    }, 0)

    const tax = Math.floor(subtotal * process.env.TAX_PERCENT / 100)
    const total = subtotal + tax
    const summary = {
      shipping,
      shippingText: this.converter.formatNumber(shipping),
      fee,
      feeText: this.converter.formatNumber(fee),
      subtotal,
      subtotalText: this.converter.formatNumber(subtotal),
      tax,
      taxText: this.converter.formatNumber(tax),
      total,
      totalText: this.converter.formatNumber(total),
    }

    return {products, summary}
  }

  async makeReviewQuestion (req, transaction) {
    const {cartId} = req.session
    const cartProducts = await this.finder.findCartProducts(cartId)
    const products = cartProducts.map(({product}, i) => {
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

    return {products, summary}
  }

  async makeReviewEstimate (req, transaction) {
    const {cartId} = req.session
    const cartProducts = await this.finder.findCartProducts(cartId)
    const products = cartProducts.map(({product}, i) => {
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

    return {products, summary}
  }
}

module.exports.ReviewMaker = ReviewMaker
