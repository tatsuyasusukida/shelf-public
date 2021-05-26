const assert = require('assert')
const {TestBase} = require('../util/TestBase')
const fetch = require('node-fetch')
const querystring = require('querystring')

class AppTest extends TestBase {
  async testStatus () {
    const cookie = await this.createProduct()
    const [product] = await this.listProducts(cookie)

    await this._testStatus302('http://127.0.0.1:3000/')
    await this._testStatus200('http://127.0.0.1:3000/layout/')
    await this._testStatus200('http://127.0.0.1:3000/list/')
    await this._testStatus200('http://127.0.0.1:3000/product/add/')
    await this._testStatus200(`http://127.0.0.1:3000/product/${product.id}/edit/`, cookie)
    await this._testStatus200(`http://127.0.0.1:3000/product/${product.id}/delete/`, cookie)
    await this._testStatus200('http://127.0.0.1:3000/product/delete/finish/')
    await this._testStatus200('http://127.0.0.1:3000/estimate/')
    await this._testStatus200('http://127.0.0.1:3000/estimate/finish/')
    await this._testStatus200('http://127.0.0.1:3000/estimate/print/')
    await this._testStatus200('http://127.0.0.1:3000/order/')
    await this._testStatus200('http://127.0.0.1:3000/order/finish/')
    await this._testStatus200('http://127.0.0.1:3000/question/')
    await this._testStatus200('http://127.0.0.1:3000/question/finish/')

    await this._testStatus200('http://127.0.0.1:3000/static/css/bootstrap.min.css')
    await this._testStatus200('http://127.0.0.1:3000/static/css/bootstrap-reboot.min.css')
    await this._testStatus200('http://127.0.0.1:3000/static/css/bootstrap-grid.min.css')
    await this._testStatus200('http://127.0.0.1:3000/static/css/bootstrap-utilities.min.css')
    await this._testStatus200('http://127.0.0.1:3000/static/css/bootstrap-icons.css')
    await this._testStatus200('http://127.0.0.1:3000/static/css/screen.css')
    await this._testStatus200('http://127.0.0.1:3000/static/css/print.css')

    const search = '?' + querystring.stringify({
      width: '15',
      height: '49',
      depth: '19',
      row: '1',
      thickness: '17',
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: '1',
    })

    await this._testStatus200('http://127.0.0.1:3000/render/front.svg' + search)
    await this._testStatus200('http://127.0.0.1:3000/render/side.svg' + search)
  }

  async createProduct () {
    const url = 'http://127.0.0.1:3000/api/v1/product/add/submit'
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    }

    const response = await fetch(url, options)
    const body = await response.json()
    const setCookie = response.headers.get('set-cookie')
    const cookie = setCookie.split(';')[0].trim()

    return cookie
  }

  async listProducts (cookie) {
    const url = 'http://127.0.0.1:3000/api/v1/list/initialize'
    const options = {headers: {cookie}}
    const response = await fetch(url, options)
    const {products} = await response.json()

    return products
  }

  async _testStatus200 (url, cookie) {
    const options = cookie ? {headers: {cookie}} : {}
    const response = await fetch(url, options)

    assert.deepStrictEqual(response.status, 200)
  }

  async _testStatus302 (url) {
    const options = {redirect: 'manual'}
    const response = await fetch(url, options)

    assert.deepStrictEqual(response.status, 302)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new AppTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.AppTest = AppTest
