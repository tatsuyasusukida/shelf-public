class Converter {
  formatNumber (value) {
    return new Intl.NumberFormat().format(value)
  }
}

module.exports.Converter = Converter
