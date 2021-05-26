const assert = require('assert')
const {TestBase} = require('../util/TestBase')
const {Converter} = require('./Converter')

class ConverterTest extends TestBase {
  async testConvertProduct () {
    const converter = new Converter()

    converter.imageMaker = {
      makeImage (product) {
        return 'image'
      }
    }

    converter.priceCalculator = {
      calculatePrice (product) {
        return 'price'
      }
    }

    const product = {
      id: 'id',
      width: 'width',
      height: 'height',
      depth: 'depth',
      row: 'row',
      thickness: 'thickness',
      fix: 'fix',
      back: 'back',
      color: 'color',
      amount: 'amount',
    }

    const number = 'number'
    const actual = await converter.convertProduct(product, number)
    const expected = {
      number: 'number',
      id: 'id',
      width: 'width',
      height: 'height',
      depth: 'depth',
      row: 'row',
      thickness: 'thickness',
      fix: 'fix',
      back: 'back',
      color: 'color',
      amount: 'amount',
      image: 'image',
      price: 'price',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testConvertEstimate () {
    const converter = new Converter()
    const estimate = {
      id: 'id',
      date: new Date(2011, 6 - 1, 1),
      number: 'number',
      name: 'name',
      title: 'title',
      subscribe: 'subscribe',
      email: 'email',
    }

    const actual = await converter.convertEstimate(estimate)
    const expected = {
      date: new Date(2011, 6 - 1, 1),
      dateText: '2011年6月1日',
      number: 'number',
      name: 'name',
      title: 'title',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testFormatNumber () {
    const converter = new Converter()
    const value = 1234
    const actual = await converter.formatNumber(value)
    const expected = '1,234'

    assert.deepStrictEqual(actual, expected)
  }

  async testConvertDate () {
    const converter = new Converter()
    const date = new Date(2011, 6 - 1, 1)
    const actual = await converter.convertDate(date)
    const expected = '2011年6月1日'

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ConverterTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ConverterTest = ConverterTest
