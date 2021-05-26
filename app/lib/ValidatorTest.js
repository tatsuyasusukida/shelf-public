const assert = require('assert')
const {TestBase} = require('../util/TestBase')
const {Validator} = require('./Validator')

class ValidatorTest extends TestBase {
  async testMakeValidationOrder () {
    const validator = new Validator()
    const actual = await validator.makeValidationOrder()
    const expected = {
      ok: null,
      name: {
        ok: null,
        isNotEmpty: null,
      },
      kana: {
        ok: null,
        isNotEmpty: null,
      },
      company: {
        ok: null,
        isNotEmpty: null,
      },
      zip: {
        ok: null,
        isNotEmpty: null,
      },
      address: {
        ok: null,
        isNotEmpty: null,
      },
      tel: {
        ok: null,
        isNotEmpty: null,
      },
      email: {
        ok: null,
        isNotEmpty: null,
      },
      payment: {
        ok: null,
        isNotEmpty: null,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateOrder () {
    const validator = new Validator()
    const req = {
      body: {
        form: {
          name: 'ここに氏名が入ります',
          kana: 'ここにフリガナが入ります',
          company: '株式会社ロレムイプサム',
          zip: '9402039',
          address: '新潟県長岡市関原南4丁目3934番地',
          tel: '0258945233',
          email: 'shelf@loremipsum.co.jp',
          memo: [
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
          ].join('\n'),
          payment: 'クレジットカード',
        },
      },
    }

    const actual = await validator.validateOrder(req)
    const expected = {
      ok: true,
      name: {
        ok: true,
        isNotEmpty: true,
      },
      kana: {
        ok: true,
        isNotEmpty: true,
      },
      company: {
        ok: true,
        isNotEmpty: true,
      },
      zip: {
        ok: true,
        isNotEmpty: true,
      },
      address: {
        ok: true,
        isNotEmpty: true,
      },
      tel: {
        ok: true,
        isNotEmpty: true,
      },
      email: {
        ok: true,
        isNotEmpty: true,
      },
      payment: {
        ok: true,
        isNotEmpty: true,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeValidationQuestion () {
    const validator = new Validator()
    const actual = await validator.makeValidationQuestion()
    const expected = {
      ok: null,
      category: {
        ok: null,
        isNotEmpty: null,
      },
      name: {
        ok: null,
        isNotEmpty: null,
      },
      kana: {
        ok: null,
        isNotEmpty: null,
      },
      company: {
        ok: null,
        isNotEmpty: null,
      },
      zip: {
        ok: null,
        isNotEmpty: null,
      },
      address: {
        ok: null,
        isNotEmpty: null,
      },
      tel: {
        ok: null,
        isNotEmpty: null,
      },
      email: {
        ok: null,
        isNotEmpty: null,
      },
      content: {
        ok: null,
        isNotEmpty: null,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateQuestion () {
    const validator = new Validator()
    const req = {
      body: {
        form: {
          category: 'category',
          name: 'ここに氏名が入ります',
          kana: 'ここにフリガナが入ります',
          company: '株式会社ロレムイプサム',
          zip: '9402039',
          address: '新潟県長岡市関原南4丁目3934番地',
          tel: '0258945233',
          email: 'shelf@loremipsum.co.jp',
          content: [
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
            'ここにテキストが入ります。',
          ].join('\n'),
        },
      },
    }

    const actual = await validator.validateQuestion(req)
    const expected = {
      ok: true,
      category: {
        ok: true,
        isNotEmpty: true,
      },
      name: {
        ok: true,
        isNotEmpty: true,
      },
      kana: {
        ok: true,
        isNotEmpty: true,
      },
      company: {
        ok: true,
        isNotEmpty: true,
      },
      zip: {
        ok: true,
        isNotEmpty: true,
      },
      address: {
        ok: true,
        isNotEmpty: true,
      },
      tel: {
        ok: true,
        isNotEmpty: true,
      },
      email: {
        ok: true,
        isNotEmpty: true,
      },
      content: {
        ok: true,
        isNotEmpty: true,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeValidationEstimate () {
    const validator = new Validator()
    const actual = await validator.makeValidationEstimate()
    const expected = {
      ok: null,
      name: {
        ok: null,
        isNotEmpty: null,
      },
      title: {
        ok: null,
        isNotEmpty: null,
      },
      subscribe: {
        ok: null,
        isNotEmpty: null,
      },
      email: {
        ok: null,
        isNotEmpty: null,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateEstimate () {
    const validator = new Validator()
    const req = {
      body: {
        form: {
          name: '株式会社ロレムイプサム',
          title: '御中',
          subscribe: '受け取る',
          email: 'shelf@loremipsum.co.jp',
        },
      },
    }

    const actual = await validator.validateEstimate(req)
    const expected = {
      ok: true,
      name: {
        ok: true,
        isNotEmpty: true,
      },
      title: {
        ok: true,
        isNotEmpty: true,
      },
      subscribe: {
        ok: true,
        isNotEmpty: true,
      },
      email: {
        ok: true,
        isNotEmpty: true,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeValidationProduct () {
    const validator = new Validator()
    const actual = await validator.makeValidationProduct()
    const expected = {
      ok: null,
      width: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
        isGreater: null,
        isLess: null,
      },
      height: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
        isGreater: null,
        isLess: null,
      },
      depth: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
        isGreater: null,
        isLess: null,
      },
      row: {
        ok: null,
        isNotEmpty: null,
      },
      thickness: {
        ok: null,
        isNotEmpty: null,
      },
      fix: {
        ok: null,
        isNotEmpty: null,
      },
      back: {
        ok: null,
        isNotEmpty: null,
      },
      color: {
        ok: null,
        isNotEmpty: null,
      },
      amount: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateProduct () {
    const validator = new Validator()
    const req = {
      body: {
        form: {
          width: '15',
          height: '49',
          depth: '19',
          row: '1',
          thickness: '17',
          fix: 'ビス（固定）',
          back: 'なし',
          color: 'ナチュラル',
          amount: '1',
        },
      },
    }

    const actual = await validator.validateProduct(req)
    const expected = {
      ok: true,
      width: {
        ok: true,
        isNotEmpty: true,
        isInteger: true,
        isGreater: true,
        isLess: true,
      },
      height: {
        ok: true,
        isNotEmpty: true,
        isInteger: true,
        isGreater: true,
        isLess: true,
      },
      depth: {
        ok: true,
        isNotEmpty: true,
        isInteger: true,
        isGreater: true,
        isLess: true,
      },
      row: {
        ok: true,
        isNotEmpty: true,
      },
      thickness: {
        ok: true,
        isNotEmpty: true,
      },
      fix: {
        ok: true,
        isNotEmpty: true,
      },
      back: {
        ok: true,
        isNotEmpty: true,
      },
      color: {
        ok: true,
        isNotEmpty: true,
      },
      amount: {
        ok: true,
        isNotEmpty: true,
        isInteger: true,
      },
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateFieldNotEmpty () {
    const validator = new Validator()
    const value = 'not empty'
    const actual = await validator.validateFieldNotEmpty(value)
    const expected = {
      ok: true,
      isNotEmpty: true,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateFieldInteger () {
    const validator = new Validator()
    const value = '1234'
    const actual = await validator.validateFieldInteger(value)
    const expected = {
      ok: true,
      isNotEmpty: true,
      isInteger: true,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testValidateFieldRange () {
    const validator = new Validator()
    const value = '50'
    const min = 10
    const max = 100
    const actual = await validator.validateFieldRange(value, min, max)
    const expected = {
      ok: true,
      isNotEmpty: true,
      isInteger: true,
      isGreater: true,
      isLess: true,
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testIsValidRequest () {
    const validator = new Validator()
    const validation = {
      ok: null,
      field1: {ok: true},
      field2: {ok: true},
      field3: {ok: true},
    }

    const actual = await validator.isValidRequest(validation)
    const expected = true

    assert.deepStrictEqual(actual, expected)
  }

  async testIsValidField () {
    const validator = new Validator()
    const validationField = {
      ok: null,
      isNotEmpty: true,
      isInteger: true,
    }

    const actual = await validator.isValidField(validationField)
    const expected = true

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ValidatorTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ValidatorTest = ValidatorTest
