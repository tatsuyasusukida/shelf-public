class Validator {
  makeValidationProduct () {
    return {
      ok: null,
      width: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
        isGreater: null,
        isLess: null,
      },
      height: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
        isGreater: null,
        isLess: null,
      },
      depth: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
        isGreater: null,
        isLess: null,
      },
      row: {
        ok: null,
        isNotEmpty: null,
      },
      thickness: {
        ok: null,
        isNotEmpty: null,
      },
      fix: {
        ok: null,
        isNotEmpty: null,
      },
      back: {
        ok: null,
        isNotEmpty: null,
      },
      color: {
        ok: null,
        isNotEmpty: null,
      },
      amount: {
        ok: null,
        isNotEmpty: null,
        isInteger: null,
      },
    }
  }
}

module.exports.Validator = Validator
