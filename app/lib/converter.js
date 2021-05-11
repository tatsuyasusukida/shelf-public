const {ImageMaker} = require('./image-maker')
const {PriceCalculator} = require('./price-calculator')

class Converter {
  formatNumber (value) {
    return new Intl.NumberFormat().format(value)
  }

  convertProduct (product, number) {
    const imageMaker = new ImageMaker()
    const priceCalculator = new PriceCalculator()

    const image = imageMaker.makeImage(product)
    const price = priceCalculator.calculatePrice(product)

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
}

module.exports.Converter = Converter
