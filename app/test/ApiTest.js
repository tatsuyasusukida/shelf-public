const assert = require('assert')
const {TestBase} = require('../util/TestBase')
const fetch = require('node-fetch')
const querystring = require('querystring')

class ApiTest extends TestBase {
  async testListInitialize () {
    const url = 'http://127.0.0.1:3000/api/v1/list/initialize'
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.products, 'object')
  }

  async testProductAddInitialize() {
    const url = 'http://127.0.0.1:3000/api/v1/product/add/initialize'
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.form, 'object')
    assert.strictEqual(typeof body.validation, 'object')
    assert.strictEqual(typeof body.options, 'object')
  }

  async testProductAddChange() {
    const url = 'http://127.0.0.1:3000/api/v1/product/add/change'
    const options = {
      method: 'POST',
      headers: this.makeHeaders(),
      body: this.makeBodyProduct(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
    assert.strictEqual(typeof body.image, 'object')
    assert.strictEqual(typeof body.price, 'object')
  }

  async testProductAddValidate() {
    const url = 'http://127.0.0.1:3000/api/v1/product/add/validate'
    const options = {
      method: 'POST',
      headers: this.makeHeaders(),
      body: this.makeBodyProduct(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
  }

  async testProductAddSubmit() {
    const url = 'http://127.0.0.1:3000/api/v1/product/add/submit'
    const options = {
      method: 'POST',
      headers: this.makeHeaders(),
      body: this.makeBodyProduct(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../list/')
  }

  async testProductEditInitialize() {
    const cookie = await this.createProduct()
    const [product] = await this.listProducts(cookie)

    const url = `http://127.0.0.1:3000/api/v1/product/${product.id}/edit/initialize`
    const options = {
      method: 'GET',
      headers: {cookie},
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.form, 'object')
    assert.strictEqual(typeof body.validation, 'object')
    assert.strictEqual(typeof body.options, 'object')
  }

  async testProductEditChange() {
    const cookie = await this.createProduct()
    const [product] = await this.listProducts(cookie)

    const url = `http://127.0.0.1:3000/api/v1/product/${product.id}/edit/change`
    const options = {
      method: 'PUT',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyProduct(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
    assert.strictEqual(typeof body.image, 'object')
    assert.strictEqual(typeof body.price, 'object')
  }

  async testProductEditValite() {
    const cookie = await this.createProduct()
    const [product] = await this.listProducts(cookie)

    const url = `http://127.0.0.1:3000/api/v1/product/${product.id}/edit/validate`
    const options = {
      method: 'PUT',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyProduct(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
  }

  async testProductEditSubmit() {
    const cookie = await this.createProduct()
    const [product] = await this.listProducts(cookie)

    const url = `http://127.0.0.1:3000/api/v1/product/${product.id}/edit/submit`
    const options = {
      method: 'PUT',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyProduct(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../../list/')
  }

  async testProductDeleteInitialize() {
    const cookie = await this.createProduct()
    const [product] = await this.listProducts(cookie)

    const url = `http://127.0.0.1:3000/api/v1/product/${product.id}/delete/initialize`
    const options = {
      method: 'GET',
      headers: {cookie},
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.product, 'object')
  }

  async testProductDeleteSubmit() {
    const cookie = await this.createProduct()
    const [product] = await this.listProducts(cookie)

    const url = `http://127.0.0.1:3000/api/v1/product/${product.id}/delete/submit`
    const options = {
      method: 'DELETE',
      headers: {cookie},
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(body.ok, true)
    assert.strictEqual(body.redirect, '../../delete/finish/')
  }

  async testProductEstimateInitialize() {
    const url = `http://127.0.0.1:3000/api/v1/estimate/initialize`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.form, 'object')
    assert.strictEqual(typeof body.validation, 'object')
    assert.strictEqual(typeof body.options, 'object')
  }

  async testProductEstimateValidate() {
    const url = `http://127.0.0.1:3000/api/v1/estimate/validate`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(),
      body: this.makeBodyEstimate(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
  }

  async testProductEstimateReview() {
    const cookie = await this.createProduct()
    const url = `http://127.0.0.1:3000/api/v1/estimate/review`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyEstimate(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.products, 'object')
    assert.strictEqual(typeof body.summary, 'object')
  }

  async testProductEstimateSubmit() {
    const cookie = await this.createProduct()
    const url = `http://127.0.0.1:3000/api/v1/estimate/submit`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyEstimate(),
    }

    const response = await fetch(url, options)
    const body = await response.json()
    const [pathname] = body.redirect.split('?')

    assert.strictEqual(body.ok, true)
    assert.strictEqual(pathname, './finish/')
  }

  async testProductEstimatePrintInitialize() {
    const cookie = await this.createProduct()
    const search = await this.createEstimate(cookie)
    const pathname = '/api/v1/estimate/print/initialize'
    const url = `http://127.0.0.1:3000${pathname}${search}`
    const options = {
      method: 'GET',
      headers: {cookie},
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.estimate, 'object')
    assert.strictEqual(typeof body.products, 'object')
    assert.strictEqual(typeof body.summary, 'object')
  }

  async testProductQuestionInitialize() {
    const url = `http://127.0.0.1:3000/api/v1/question/initialize`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.form, 'object')
    assert.strictEqual(typeof body.validation, 'object')
    assert.strictEqual(typeof body.options, 'object')
  }

  async testProductQuestionValidate() {
    const url = `http://127.0.0.1:3000/api/v1/question/validate`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(),
      body: this.makeBodyQuestion(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
  }

  async testProductQuestionReview() {
    const cookie = await this.createProduct()
    const url = `http://127.0.0.1:3000/api/v1/question/review`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyQuestion(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.products, 'object')
    assert.strictEqual(typeof body.summary, 'object')
  }

  async testProductQuestionSubmit() {
    const cookie = await this.createProduct()
    const url = `http://127.0.0.1:3000/api/v1/question/submit`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyQuestion(),
    }

    const response = await fetch(url, options)
    const body = await response.json()
    const [pathname] = body.redirect.split('?')

    assert.strictEqual(body.ok, true)
    assert.strictEqual(pathname, './finish/')
  }

  async testProductOrderInitialize() {
    const url = `http://127.0.0.1:3000/api/v1/order/initialize`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.form, 'object')
    assert.strictEqual(typeof body.validation, 'object')
    assert.strictEqual(typeof body.options, 'object')
  }

  async testProductOrderValidate() {
    const url = `http://127.0.0.1:3000/api/v1/order/validate`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(),
      body: this.makeBodyOrder(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.validation, 'object')
  }

  async testProductOrderReview() {
    const cookie = await this.createProduct()
    const url = `http://127.0.0.1:3000/api/v1/order/review`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyOrder(),
    }

    const response = await fetch(url, options)
    const body = await response.json()

    assert.strictEqual(typeof body.products, 'object')
    assert.strictEqual(typeof body.summary, 'object')
  }

  async testProductOrderSubmit() {
    const cookie = await this.createProduct()
    const url = `http://127.0.0.1:3000/api/v1/order/submit`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyOrder(),
    }

    const response = await fetch(url, options)
    const body = await response.json()
    const [pathname] = body.redirect.split('?')

    assert.strictEqual(body.ok, true)
    assert.strictEqual(pathname, './payment/')
  }

  async createProduct () {
    const url = 'http://127.0.0.1:3000/api/v1/product/add/submit'
    const options = {
      method: 'POST',
      headers: this.makeHeaders(),
      body: this.makeBodyProduct(),
    }

    const response = await fetch(url, options)
    const body = await response.json()
    const setCookie = response.headers.get('set-cookie')
    const cookie = setCookie.split(';')[0].trim()

    return cookie
  }

  async createEstimate(cookie) {
    const url = `http://127.0.0.1:3000/api/v1/estimate/submit`
    const options = {
      method: 'POST',
      headers: this.makeHeaders(cookie),
      body: this.makeBodyEstimate(),
    }

    const response = await fetch(url, options)
    const {redirect} = await response.json()
    const search = redirect.slice(redirect.indexOf('?'))

    return search
  }

  async listProducts (cookie) {
    const url = 'http://127.0.0.1:3000/api/v1/list/initialize'
    const options = {headers: {cookie}}
    const response = await fetch(url, options)
    const {products} = await response.json()

    return products
  }

  makeHeaders (cookie) {
    return {
      'content-type': 'application/json',
      'cookie': cookie,
    }
  }

  makeBodyProduct () {
    return JSON.stringify({
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
    })
  }

  makeBodyEstimate () {
    return JSON.stringify({
      form: {
        name: '株式会社ロレムイプサム',
        title: '御中',
        subscribe: '受け取る',
        email: 'shelf@loremipsum.co.jp',
      },
    })
  }

  makeBodyQuestion () {
    return JSON.stringify({
      form: {
        category: '商品について',
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
    })
  }

  makeBodyOrder () {
    return JSON.stringify({
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
    })
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new ApiTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.ApiTest = ApiTest
