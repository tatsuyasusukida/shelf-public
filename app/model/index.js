'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const winston = require('winston');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectOptions: {
    socketPath: process.env.DB_SOCKET,
  },
  logging: message => winston.loggers.get('query').info(message),
  logQueryParameters: true
};
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[toModelName(file)] = model;
  });

function toModelName (file) {
  return path.basename(file, path.extname(file))
    .split('-')
    .map((piece, i) => {
      if (i === 0) {
        return piece
      } else {
        return piece[0].toUpperCase() + piece.slice(1)
      }
    })
    .join('')
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
