class PriceCalculator {
  calculatePrice (req) {
    return {
      unit: 20000,
      unitText: '20,000',
      total: 20000,
      totalText: '20,000',
    }
  }
}

module.exports.PriceCalculator = PriceCalculator
