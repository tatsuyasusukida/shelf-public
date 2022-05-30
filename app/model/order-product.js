module.exports = function (sequelize, DataTypes) {
  const orderProduct = sequelize.define('shelfOrderProduct', {
    sort: {type: DataTypes.INTEGER, allowNull: false},
  }, {freezeTableName: true})

  orderProduct.associate = function (model) {
    orderProduct.belongsTo(model.order, {
      as: 'order',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })

    orderProduct.belongsTo(model.product, {
      as: 'product',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })
  }

  return orderProduct
}
