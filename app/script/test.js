const {CodeGeneratorTest} = require('../lib/CodeGeneratorTest')
const {ConverterTest} = require('../lib/ConverterTest')
const {ImageMakerTest} = require('../lib/ImageMakerTest')
const {InitializerTest} = require('../lib/InitializerTest')
const {PriceCalculatorTest} = require('../lib/PriceCalculatorTest')
const {ReviewMakerTest} = require('../lib/ReviewMakerTest')
const {ValidatorTest} = require('../lib/ValidatorTest')
const {ApiTest} = require('../test/ApiTest')
const {AppTest} = require('../test/AppTest')
const {UiTest} = require('../test/UiTest')

class Main {
  async run () {
    const testcases = [
      new CodeGeneratorTest(),
      new ConverterTest(),
      new ImageMakerTest(),
      new InitializerTest(),
      new PriceCalculatorTest(),
      new ReviewMakerTest(),
      new ValidatorTest(),
      new ApiTest(),
      new AppTest(),
      new UiTest(),
    ]

    for (const testcase of testcases) {
      await testcase.print()
    }
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
