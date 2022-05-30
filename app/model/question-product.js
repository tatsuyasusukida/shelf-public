module.exports = function (sequelize, DataTypes) {
  const questionProduct = sequelize.define('shelfQuestionProduct', {
    sort: {type: DataTypes.INTEGER, allowNull: false},
  }, {freezeTableName: true})

  questionProduct.associate = function (model) {
    questionProduct.belongsTo(model.question, {
      as: 'question',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })

    questionProduct.belongsTo(model.product, {
      as: 'product',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })
  }

  return questionProduct
}
