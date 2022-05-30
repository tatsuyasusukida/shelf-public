module.exports = function (sequelize, DataTypes) {
  const cartProduct = sequelize.define('shelfCartProduct', {
    date: {type: DataTypes.DATE, allowNull: false},
  }, {freezeTableName: true})

  cartProduct.associate = function (model) {
    cartProduct.belongsTo(model.cart, {
      as: 'cart',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })

    cartProduct.belongsTo(model.product, {
      as: 'product',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })
  }

  return cartProduct
}
