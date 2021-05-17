const {CodeGeneratorTest} = require('../lib/code-generator.test')
const {ConverterTest} = require('../lib/converter.test')
const {ImageMakerTest} = require('../lib/image-maker.test')
const {InitializerTest} = require('../lib/initializer.test')

class Main {
  async run () {
    const testcases = [
      new CodeGeneratorTest(),
      new ConverterTest(),
      new ImageMakerTest(),
      new InitializerTest(),
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
