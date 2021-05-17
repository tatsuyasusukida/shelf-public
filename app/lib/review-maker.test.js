const assert = require('assert')
const querystring = require('querystring')
const {TestBase} = require('../test/test-base')
const {ReviewMaker} = require('./review-maker')

class ReviewMakerTest extends TestBase {
  async testMakeReviewEstimate () {
    const reviewMaker = new ReviewMaker()

    reviewMaker.finder = {
      async findCartProducts (cartId, transaction) {
        return [
          {
            product: {},
          },
         ]
      },
    }

    reviewMaker.converter = {
      convertProduct (product, i) {
        return {
          price: {
            total: 1000,
          },
        }
      },

      formatNumber (value) {
        return new Intl.NumberFormat().format(value)
      },
    }

    const req = {
      session: {
        cartId: 'cartId',
      },
      body: {
        form: {
          category: 'category',
          name: 'name',
          kana: 'kana',
          company: 'company',
          zip: 'zip',
          address: 'address',
          tel: 'tel',
          email: 'email',
          content: 'content',
        },
      },
    }

    const transaction = {}
    const actual = await reviewMaker.makeReviewEstimate(req, transaction)
    const expected = {
      products: [
        {
          price: {
            total: 1000,
          },
        },
      ],
      summary: {
        subtotal: 1000,
        subtotalText: '1,000',
        tax: 100,
        taxText: '100',
        total: 1100,
        totalText: '1,100',
      }
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeReviewQuestion () {
    const reviewMaker = new ReviewMaker()

    reviewMaker.finder = {
      async findCartProducts (cartId, transaction) {
        return [
          {
            product: {},
          },
         ]
      },
    }

    reviewMaker.converter = {
      convertProduct (product, i) {
        return {
          price: {
            total: 1000,
          },
        }
      },

      formatNumber (value) {
        return new Intl.NumberFormat().format(value)
      },
    }

    const req = {
      session: {
        cartId: 'cartId',
      },
      body: {
        form: {
          category: 'category',
          name: 'name',
          kana: 'kana',
          company: 'company',
          zip: 'zip',
          address: 'address',
          tel: 'tel',
          email: 'email',
          content: 'content',
        },
      },
    }

    const transaction = {}
    const actual = await reviewMaker.makeReviewQuestion(req, transaction)
    const expected = {
      products: [
        {
          price: {
            total: 1000,
          },
        },
      ],
      summary: {
        subtotal: 1000,
        subtotalText: '1,000',
        tax: 100,
        taxText: '100',
        total: 1100,
        totalText: '1,100',
      }
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeReviewBasic () {
    const reviewMaker = new ReviewMaker()

    reviewMaker.finder = {
      async findCartProducts (cartId, transaction) {
        return [
          {
            product: {},
          },
         ]
      },
    }

    reviewMaker.converter = {
      convertProduct (product, i) {
        return {
          price: {
            total: 1000,
          },
        }
      },

      formatNumber (value) {
        return new Intl.NumberFormat().format(value)
      },
    }

    const req = {
      session: {
        cartId: 'cartId',
      },
      body: {
        form: {
          category: 'category',
          name: 'name',
          kana: 'kana',
          company: 'company',
          zip: 'zip',
          address: 'address',
          tel: 'tel',
          email: 'email',
          content: 'content',
        },
      },
    }

    const transaction = {}
    const actual = await reviewMaker.makeReviewBasic(req, transaction)
    const expected = {
      products: [
        {
          price: {
            total: 1000,
          },
        },
      ],
      summary: {
        subtotal: 1000,
        subtotalText: '1,000',
        tax: 100,
        taxText: '100',
        total: 1100,
        totalText: '1,100',
      }
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeReviewOrder () {
    const reviewMaker = new ReviewMaker()

    reviewMaker.finder = {
      async findCartProducts (cartId, transaction) {
        return [
          {
            product: {},
          },
         ]
      },
    }

    reviewMaker.converter = {
      convertProduct (product, i) {
        return {
          price: {
            total: 1000,
          },
        }
      },

      formatNumber (value) {
        return new Intl.NumberFormat().format(value)
      },
    }

    const req = {
      session: {
        cartId: 'cartId',
      },
      body: {
        form: {
          name: 'name',
          kana: 'kana',
          company: 'company',
          zip: 'zip',
          address: 'address',
          tel: 'tel',
          email: 'email',
          memo: 'memo',
          payment: 'payment',
        },
      },
    }

    const transaction = {}
    const actual = await reviewMaker.makeReviewOrder(req, transaction)
    const expected = {
      products: [
        {
          price: {
            total: 1000,
          },
        },
      ],
      summary: {
        shipping: 0,
        shippingText: '0',
        fee: 0,
        feeText: '0',
        subtotal: 1000,
        subtotalText: '1,000',
        tax: 100,
        taxText: '100',
        total: 1100,
        totalText: '1,100',
      }
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testFindProducts () {
    const reviewMaker = new ReviewMaker()

    reviewMaker.finder = {
      async findCartProducts (cartId, transaction) {
        return [
          {
            product: {},
          },
         ]
      },
    }

    reviewMaker.converter = {
      convertProduct (product, i) {
        return {
          price: {
            total: 1000,
          },
        }
      },
    }

    const req = {
      session: {
        cartId: 'cartId',
      },
    }

    const transaction = {}
    const actual = await reviewMaker.findProducts(req, transaction)
    const expected = [
      {
        price: {
          total: 1000,
        },
      },
    ]

    assert.deepStrictEqual(actual, expected)
  }

  async testCalculateSubtotal () {
    const reviewMaker = new ReviewMaker()
    const products = [
      {
        price: {
          total: 1000,
        },
      },
    ]

    const actual = await reviewMaker.calculateSubtotal(products)
    const expected = 1000

    assert.deepStrictEqual(actual, expected)
  }

  async testCalculateTax () {
    const reviewMaker = new ReviewMaker()
    const subtotal = 1000
    const actual = await reviewMaker.calculateTax(subtotal)
    const expected = 100

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ReviewMakerTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ReviewMakerTest = ReviewMakerTest
