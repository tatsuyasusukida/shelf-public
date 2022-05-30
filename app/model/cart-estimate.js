module.exports = function (sequelize, DataTypes) {
  const cartEstimate = sequelize.define('shelfCartEstimate', {
  }, {freezeTableName: true})

  cartEstimate.associate = function (model) {
    cartEstimate.belongsTo(model.cart, {
      as: 'cart',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })

    cartEstimate.belongsTo(model.estimate, {
      as: 'estimate',
      foreignKey: {allowNull: false},
      onDelete: 'cascade',
    })
  }

  return cartEstimate
}
