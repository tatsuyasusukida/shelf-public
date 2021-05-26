const {Finder} = require('./Finder')
const crypto = require('crypto')

class CodeGenerator {
  constructor () {
    this.finder = new Finder()
  }

  async generateEstimateNumber (transaction) {
    const minute = 60 * 1000
    const day = 24 * 60 * minute
    const offset = process.env.TIMEZONE_OFFSET * minute
    const start = new Date(Math.floor(Date.now() / day) * day + offset)
    const end = new Date(start.getTime() + 1 * day)
    const count = await this.finder.countEstimates(start, end, transaction)
    const today = new Date(Date.now() - offset)

    return [
      ('' + today.getUTCFullYear()).padStart(4, '0'),
      ('' + (today.getUTCMonth() + 1)).padStart(2, '0'),
      ('' + today.getUTCDate()).padStart(2, '0'),
      '-',
      ('' + (count + 1)).padStart(3, '0'),
    ].join('')
  }

  async generateQuestionNumber (transaction) {
    for (let i = 0; i < 10; i += 1) {
      const number = this.generateRandomNumber()
      const args = [number, transaction]
      const question = await this.finder.findQuestionByNumber(...args)

      if (!question) {
        return number
      }
    }

    throw new Error('Question number generation failed')
  }

  async generateOrderNumber (transaction) {
    for (let i = 0; i < 10; i += 1) {
      const number = this.generateRandomNumber()
      const args = [number, transaction]
      const order = await this.finder.findOrderByNumber(...args)

      if (!order) {
        return number
      }
    }

    throw new Error('Order number generation failed')
  }

  generateRandomNumber () {
    return [
      ('' + crypto.randomInt(10000)).padStart(4, '0'),
      ('' + crypto.randomInt(10000)).padStart(4, '0'),
      ('' + crypto.randomInt(10000)).padStart(4, '0'),
    ].join('-')
  }
}

module.exports.CodeGenerator = CodeGenerator
