const path = require('path')
const fsExtra = require('fs-extra')
const puppeteer = require('puppeteer')

class Main {
  async run () {
    const browser = await puppeteer.launch()

    try {
      const page = await browser.newPage()

      await page.setViewport({width: 800, height: 1050, deviceScaleFactor: 2})

      const items = this.getItems()

      for (const item of items) {
        const {pathname, file} = item
        const dirname = path.join(__dirname, '../dist/img')
        const destination = path.join(dirname, file + '.png')

        await fsExtra.mkdirp(path.dirname(destination))
        await page.goto('http://127.0.0.1:3000' + pathname)
        await page.screenshot({path: destination})
      }
    } finally {
      await browser.close()
    }
  }

  getItems () {
    return [
      {pathname: '/list/', file: 'list'},
      {pathname: '/layout/', file: 'layout'},
      {pathname: '/product/add/', file: 'product-add'},
      {pathname: '/product/1234/edit/', file: 'product-edit'},
      {pathname: '/product/1234/delete/', file: 'product-delete'},
      {pathname: '/product/delete/finish/', file: 'product-delete-finish'},
      {pathname: '/question/', file: 'question-index'},
      {pathname: '/question/review/', file: 'question-review'},
      {pathname: '/question/finish/', file: 'question-finish'},
      {pathname: '/order/', file: 'order-index'},
      {pathname: '/order/review/', file: 'order-review'},
      {pathname: '/order/payment/', file: 'order-payment'},
      {pathname: '/order/finish/', file: 'order-finish'},
      {pathname: '/estimate/', file: 'estimate-index'},
      {pathname: '/estimate/review/', file: 'estimate-review'},
      {pathname: '/estimate/finish/', file: 'estimate-finish'},
      {pathname: '/estimate/print/', file: 'estimate-print'},
    ]
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}
