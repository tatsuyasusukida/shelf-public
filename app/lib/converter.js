const {ImageMaker} = require('./image-maker')
const {PriceCalculator} = require('./price-calculator')

class Converter {
  constructor () {
    this.imageMaker = new ImageMaker()
    this.priceCalculator = new PriceCalculator()
  }

  convertProduct (product, number) {
    const image = this.imageMaker.makeImage(product)
    const price = this.priceCalculator.calculatePrice(product)

    return {
      number,
      id: product.id,
      width: product.width,
      height: product.height,
      depth: product.depth,
      row: product.row,
      thickness: product.thickness,
      fix: product.fix,
      back: product.back,
      color: product.color,
      amount: product.amount,
      image,
      price,
    }
  }

  convertEstimate (estimate) {
    return {
      date: estimate.date,
      dateText: this.convertDate(estimate.date),
      number: estimate.number,
      name: estimate.name,
      title: estimate.title,
    }
  }

  formatNumber (value) {
    return new Intl.NumberFormat().format(value)
  }

  convertDate (date) {
    const minute = 60 * 1000
    const offset = process.env.TIMEZONE_OFFSET * minute
    const offsetDate = new Date(date.getTime() - offset)
    const year = offsetDate.getUTCFullYear()
    const month = offsetDate.getUTCMonth() + 1
    const day = offsetDate.getUTCDate()

    return `${year}年${month}月${day}日`
  }
}

module.exports.Converter = Converter
