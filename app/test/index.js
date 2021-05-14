const {CodeGeneratorTest} = require('../lib/code-generator.test')
const {ConverterTest} = require('../lib/converter.test')

class Main {
  async run () {
    const testcases = [
      new CodeGeneratorTest(),
      new ConverterTest(),
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
