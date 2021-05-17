const assert = require('assert')
const querystring = require('querystring')
const {TestBase} = require('../test/test-base')
const {Initializer} = require('./initializer')

class InitializerTest extends TestBase {
  async testMakeFormOrder () {
    const initializer = new Initializer()
    const actual = await initializer.makeFormOrder()
    const expected = {
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
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeOptionsOrder () {
    const initializer = new Initializer()
    const actual = await initializer.makeOptionsOrder()
    const expected = {
      payment: [
        {value: 'クレジットカード', text: 'クレジットカード'},
        {value: '銀行振込', text: '銀行振込'},
        {value: '代金引換', text: '代金引換'},
      ],
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeFormQuestion () {
    const initializer = new Initializer()
    const actual = await initializer.makeFormQuestion()
    const expected = {
      category: '',
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
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeOptionsQuestion () {
    const initializer = new Initializer()
    const actual = await initializer.makeOptionsQuestion()
    const expected = {
      category: [
        {value: '商品について', text: '商品について'},
        {value: '法人割引について', text: '法人割引について'},
      ],
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeFormEstimate () {
    const initializer = new Initializer()
    const actual = await initializer.makeFormEstimate()
    const expected = {
      name: '株式会社ロレムイプサム',
      title: '御中',
      subscribe: '受け取る',
      email: 'shelf@loremipsum.co.jp',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeOptionsEstimate () {
    const initializer = new Initializer()
    const actual = await initializer.makeOptionsEstimate()
    const expected = {
      title: [
        {value: '御中', text: '御中'},
        {value: '様', text: '様'},
      ],
      subscribe: [
        {value: '受け取る', text: '受け取る'},
        {value: '受け取らない', text: '受け取らない'},
      ],
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeFormProduct () {
    const initializer = new Initializer()
    const actual = await initializer.makeFormProduct()
    const expected = {
      width: '15',
      height: '49',
      depth: '19',
      row: '1',
      thickness: '17',
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: '1',
    }

    assert.deepStrictEqual(actual, expected)
  }

  async testMakeOptionsProduct () {
    const initializer = new Initializer()
    const actual = await initializer.makeOptionsProduct()
    const expected = {
      row: [
        {value: '1', text: '1枚'},
        {value: '2', text: '2枚'},
        {value: '3', text: '3枚'},
        {value: '4', text: '4枚'},
        {value: '5', text: '5枚'},
        {value: '6', text: '6枚'},
      ],
      thickness: [
        {value: '17', text: '17mm'},
        {value: '25', text: '25mm'},
      ],
      fix: [
        {value: 'ビス（固定）', text: 'ビス（固定）'},
        {value: '棚ダボ（可動）', text: '棚ダボ（可動）'},
      ],
      back: [
        {value: 'なし', text: 'なし'},
        {value: 'あり', text: 'あり'},
      ],
      color: [
        {value: 'ナチュラル', text: 'ナチュラル', background: '#c4b295'},
        {value: 'ホワイト', text: 'ホワイト', background: '#ebe5d7'},
        {value: 'ブラウン', text: 'ブラウン', background: '#573d2b'},
        {value: 'ブラック', text: 'ブラック', background: '#322e2f'},
      ],
    }

    assert.deepStrictEqual(actual, expected)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new InitializerTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.InitializerTest = InitializerTest
