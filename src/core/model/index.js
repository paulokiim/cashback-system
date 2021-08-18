const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const { DB_CONFIGS } = require('../../config');

const sequelize = new Sequelize(
  DB_CONFIGS.database,
  DB_CONFIGS.username,
  DB_CONFIGS.password,
  DB_CONFIGS
);

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
