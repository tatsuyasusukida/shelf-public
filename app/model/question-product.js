module.exports = function (sequelize, DataTypes) {
  const questionProduct = sequelize.define('questionProduct', {
    date: {type: DataTypes.DATE, allowNull: false},
  })

  questionProduct.associate = function (model) {
    questionProduct.belongsTo(model.question, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
    questionProduct.belongsTo(model.product, {foreignKey: {allowNull: false}, onDelete: 'cascade'})
  }

  return questionProduct
}
