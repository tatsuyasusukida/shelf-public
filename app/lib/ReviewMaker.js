const {Finder} = require('./finder')
const {Converter} = require('./Converter')

class ReviewMaker {
  constructor () {
    this.finder = new Finder()
    this.converter = new Converter()
  }

  async makeReviewEstimate (req, transaction) {
    return await this.makeReviewBasic(req, transaction)
  }

  async makeReviewQuestion (req, transaction) {
    return await this.makeReviewBasic(req, transaction)
  }

  async makeReviewBasic (req, transaction) {
    const products = await this.findProducts(req, transaction)
    const subtotal = this.calculateSubtotal(products)
    const tax = this.calculateTax(subtotal)
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

  async makeReviewOrder (req, transaction) {
    const products = await this.findProducts(req, transaction)
    const shipping = 0
    const fee = req.body.form.payment === '代金引換' ? 600 : 0
    const subtotal = this.calculateSubtotal(products) + shipping + fee
    const tax = this.calculateTax(subtotal)
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

  async findProducts (req, transaction) {
    const {cartId} = req.session
    const cartProducts = await this.finder.findCartProducts(cartId, transaction)
    const products = cartProducts.map(({product}, i) => {
      return this.converter.convertProduct(product, i + 1)
    })

    return products
  }

  calculateSubtotal (products) {
    return products.reduce((memo, product) => {
      return memo + product.price.total
    }, 0)
  }

  calculateTax (subtotal) {
    return Math.floor(subtotal * process.env.TAX_PERCENT / 100)
  }
}

module.exports.ReviewMaker = ReviewMaker
