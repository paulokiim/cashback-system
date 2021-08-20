const models = require('../core/model');

const { sequelize } = models;

const startTransaction = (toExecuteFunction) =>
  sequelize.transaction(toExecuteFunction);

module.exports = {
  startTransaction,
};
