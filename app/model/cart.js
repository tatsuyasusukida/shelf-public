module.exports = function (sequelize, DataTypes) {
  const cart = sequelize.define('shelfCart', {
  }, {freezeTableName: true})

  return cart
}
