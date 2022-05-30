module.exports = function (sequelize, DataTypes) {
  const estimateProduct = sequelize.define('shelfEstimateProduct', {
    sort: {type: DataTypes.INTEGER, allowNull: false},
  }, {freezeTableName: true})

  estimateProduct.associate = function (model) {
    estimateProduct.belongsTo(model.estimate, {
      as: 'estimate',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })

    estimateProduct.belongsTo(model.product, {
      as: 'product',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })
  }

  return estimateProduct
}
