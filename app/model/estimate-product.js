module.exports = function (sequelize, DataTypes) {
  const estimateProduct = sequelize.define('estimateProduct', {
    date: {type: DataTypes.DATE, allowNull: false},
  })

  estimateProduct.associate = function (model) {
    estimateProduct.belongsTo(model.estimate, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
    estimateProduct.belongsTo(model.product, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
  }

  return estimateProduct
}
