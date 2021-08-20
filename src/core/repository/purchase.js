const models = require('../model');

const { Purchase } = models;

const create = (params, transaction) => {
  return Purchase.create(params, { transaction });
};

const get = (params) => {
  return Purchase.findOne({ where: params });
};

const update = (params, where, transaction) => {
  return Purchase.update(params, { returning: true, where, transaction });
};

const getAll = (params) => {
  return Purchase.findAll({ where: params });
};

module.exports = {
  create,
  get,
  update,
  getAll,
};
