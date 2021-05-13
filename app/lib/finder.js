const {Op} = require('sequelize')
const model = require('../model')

class Finder {
  async findCart (cartId, transaction) {
    return await model.cart.findOne({
      where: {
        id: {[Op.eq]: cartId},
      },
      transaction,
    })
  }

  async findProduct (productId, transaction) {
    return await model.product.findOne({
      where: {
        id: {[Op.eq]: productId},
      },
      transaction,
    })
  }

  async findCartProduct (cartId, productId, transaction) {
    return await model.cartProduct.findOne({
      where: {
        cartId: {[Op.eq]: cartId},
        productId: {[Op.eq]: productId},
      },
      transaction,
    })
  }

  async findCartProducts (cartId, transaction) {
    return await model.cartProduct.findAll({
      where: {
        cartId: {[Op.eq]: cartId},
      },
      order: [['date', 'asc']],
      include: [model.product],
      transaction,
    })
  }

  async findEstimate (estimateId, transaction) {
    return await model.estimate.findOne({
      where: {
        id: {[Op.eq]: estimateId},
      },
      transaction,
    })
  }

  async findCartEstimate (cartId, estimateId, transaction) {
    return await model.cartEstimate.findOne({
      where: {
        cartId: {[Op.eq]: cartId},
        estimateId: {[Op.eq]: estimateId},
      },
      transaction,
    })
  }

  async findEstimateProducts (estimateId, transaction) {
    return await model.estimateProduct.findAll({
      where: {
        estimateId: {[Op.eq]: estimateId},
      },
      order: [['sort', 'asc']],
      include: [model.product],
      transaction,
    })
  }

  async findEstimateByNumber (number, transaction) {
    return await model.estimate.findOne({
      where: {
        number: {[Op.eq]: number},
      },
      transaction,
    })
  }

  async findOrderByNumber (number, transaction) {
    return await model.order.findOne({
      where: {
        number: {[Op.eq]: number},
      },
      transaction,
    })
  }

  async findQuestionByNumber (number, transaction) {
    return await model.question.findOne({
      where: {
        number: {[Op.eq]: number},
      },
      transaction,
    })
  }

  async countEstimates (start, end, transaction) {
    return await model.estimate.count({
      where: {
        date: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },
      transaction,
    })
  }
}

module.exports.Finder = Finder
