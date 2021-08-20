const models = require('../model');

const { Cashback } = models;

const create = (params, transaction) => {
  return Cashback.create(params, { transaction });
};

const get = (params) => {
  return Cashback.findOne({ where: params });
};

const getAll = (params) => {
  return Cashback.findAll({ where: params });
};

const update = (params, where, transaction) => {
  return Cashback.update(params, { returning: true, where, transaction });
};

module.exports = {
  create,
  get,
  getAll,
  update,
};
