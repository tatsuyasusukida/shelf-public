class Validator {
  makeValidationQuestion () {
    return {
      ok: null,
      category: {
        ok: null,
        isNotEmpty: null,
      },
      name: {
        ok: null,
        isNotEmpty: null,
      },
      kana: {
        ok: null,
        isNotEmpty: null,
      },
      company: {
        ok: null,
        isNotEmpty: null,
      },
      zip: {
        ok: null,
        isNotEmpty: null,
      },
      address: {
        ok: null,
        isNotEmpty: null,
      },
      tel: {
        ok: null,
        isNotEmpty: null,
      },
      email: {
        ok: null,
        isNotEmpty: null,
      },
      content: {
        ok: null,
        isNotEmpty: null,
      },
    }
  }

  async validateQuestion (req) {
    const validation = this.makeValidationQuestion()
    const {form} = req.body

    validation.category = this.validateFieldNotEmpty(form.category)
    validation.name = this.validateFieldNotEmpty(form.name)
    validation.kana = this.validateFieldNotEmpty(form.kana)
    validation.company = this.validateFieldNotEmpty(form.company)
    validation.zip = this.validateFieldNotEmpty(form.zip)
    validation.address = this.validateFieldNotEmpty(form.address)
    validation.tel = this.validateFieldNotEmpty(form.tel)
    validation.email = this.validateFieldNotEmpty(form.email)
    validation.content = this.validateFieldNotEmpty(form.content)
    validation.ok = this.isValidRequest(validation)

    return validation
  }


  makeValidationEstimate () {
    return {
      ok: null,
      name: {
        ok: null,
        isNotEmpty: null,
      },
      title: {
        ok: null,
        isNotEmpty: null,
      },
      subscribe: {
        ok: null,
        isNotEmpty: null,
      },
      email: {
        ok: null,
        isNotEmpty: null,
      },
    }
  }

  async validateEstimate (req) {
    const validation = this.makeValidationEstimate()
    const {form} = req.body

    validation.name = this.validateFieldNotEmpty(form.name)
    validation.title = this.validateFieldNotEmpty(form.title)
    validation.subscribe = this.validateFieldNotEmpty(form.subscribe)
    validation.email = this.validateFieldNotEmpty(form.email)
    validation.ok = this.isValidRequest(validation)

    return validation
  }

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

  async validateProduct (req) {
    const validation = this.makeValidationProduct()
    const {form} = req.body

    validation.width = this.validateFieldRange(form.width, 15, 90)
    validation.height = this.validateFieldRange(form.height, 49, 200)
    validation.depth = this.validateFieldRange(form.depth, 19, 46)
    validation.row = this.validateFieldNotEmpty(form.row)
    validation.thickness = this.validateFieldNotEmpty(form.thickness)
    validation.fix = this.validateFieldNotEmpty(form.fix)
    validation.back = this.validateFieldNotEmpty(form.back)
    validation.color = this.validateFieldNotEmpty(form.color)
    validation.amount = this.validateFieldInteger(form.amount)
    validation.ok = this.isValidRequest(validation)

    return validation
  }

  validateFieldNotEmpty (value) {
    const validation = {
      ok: null,
      isNotEmpty: null,
    }

    validation.isNotEmpty = value !== ''
    validation.ok = this.isValidField(validation)

    return validation
  }

  validateFieldInteger (value) {
    const validation = {
      ok: null,
      isNotEmpty: null,
      isInteger: null,
    }

    validation.isNotEmpty = value !== ''

    if (validation.isNotEmpty) {
      validation.isInteger = /^[0-9]+$/.test(value)
    }

    validation.ok = this.isValidField(validation)

    return validation
  }

  validateFieldRange (value, min, max) {
    const validation = {
      ok: null,
      isNotEmpty: null,
      isInteger: null,
      isGreater: null,
      isLess: null,
    }

    validation.isNotEmpty = value !== ''

    if (validation.isNotEmpty) {
      validation.isInteger = /^[0-9]+$/.test(value)
    }

    if (validation.isInteger) {
      validation.isGreater = parseInt(value, 10) >= min
    }

    if (validation.isGreater) {
      validation.isLess = parseInt(value, 10) <= max
    }

    validation.ok = this.isValidField(validation)

    return validation
  }

  isValidRequest (validation) {
    return Object.keys(validation).every(key => {
      return key === 'ok' || validation[key].ok === true
    })
  }

  isValidField (validation) {
    return Object.keys(validation).every(key => {
      return key === 'ok' || validation[key] === true
    })
  }
}

module.exports.Validator = Validator
