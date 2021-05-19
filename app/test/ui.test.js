const assert = require('assert')
const {TestBase} = require('../test/test-base')
const puppeteer = require('puppeteer')

class UiTest extends TestBase {
  constructor () {
    super()
    this.params = {
      baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3000',
      timeout: parseInt(process.env.TIMEOUT || '1000', 10),
    }
  }

  async launchBrowser () {
    return await puppeteer.launch({
      headless: process.env.IS_HEADLESS !== '0',
    })    
  }

  async testOrder () {
    const browser = await this.launchBrowser()
    const {baseUrl, timeout} = this.params

    try {
      const page = await browser.newPage()

      await Promise.all([
        page.waitForNavigation(baseUrl + '/product/add/', {timeout}),
        page.goto(baseUrl + '/'),
      ])

      await page.waitForSelector('button[type=submit]', {timeout})

      await Promise.all([
        page.waitForNavigation(baseUrl + '/list/', {timeout}),
        page.$eval('button[type=submit]', el => el.click()),
      ])

      await page.waitForSelector('a[href="../order/"]', {timeout})

      await Promise.all([
        page.waitForNavigation(baseUrl + '/order/', {timeout}),
        page.$eval('a[href="../order/"]', el => el.click()),
      ])

      await page.waitForSelector('#buttonNext', {timeout})

      await Promise.all([
        page.waitForSelector('#buttonSubmit', {timeout}),
        page.$eval('#buttonNext', el => el.click()),
      ])

      await Promise.all([
        page.waitForNavigation(baseUrl + '/order/payment/', {timeout}),
        page.$eval('#buttonSubmit', el => el.click()),
      ])

      await page.waitForSelector('a', {timeout})

      await Promise.all([
        page.waitForNavigation(baseUrl + '/order/finish/', {timeout}),
        page.$eval('a', el => el.click()),
      ])
    } finally {
      await browser.close()
    }
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new UiTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.UiTest = UiTest
