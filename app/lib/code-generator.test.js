const assert = require('assert')
const {TestBase} = require('../test/test-base')
const {CodeGenerator} = require('./code-generator')

class CodeGeneratorTest extends TestBase {
  async testGenerateEstimateNumber () {
    const codeGenerator = new CodeGenerator()

    codeGenerator.finder = {
      async countEstimates (start, end, transaction) {
        return 0
      }
    }

    const number = await codeGenerator.generateEstimateNumber()
    const pattern = /^[0-9]{8}-001$/

    assert.deepStrictEqual(pattern.test(number), true)
  }

  async testGenerateQuestionNumber () {
    const codeGenerator = new CodeGenerator()

    codeGenerator.finder = {
      async findQuestionByNumber (number, transaction) {
        return null
      }
    }

    const number = await codeGenerator.generateQuestionNumber()
    const pattern = /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/

    assert.deepStrictEqual(pattern.test(number), true)
  }

  async testGenerateOrderNumber () {
    const codeGenerator = new CodeGenerator()

    codeGenerator.finder = {
      async findOrderByNumber (number, transaction) {
        return null
      }
    }

    const number = await codeGenerator.generateOrderNumber()
    const pattern = /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/

    assert.deepStrictEqual(pattern.test(number), true)
  }
}

if (require.main === module) {
  main()
}

async function main () {
  try {
    await new CodeGeneratorTest().print()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  }
}

module.exports.CodeGeneratorTest = CodeGeneratorTest
