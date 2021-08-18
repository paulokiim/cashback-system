const models = require('../model');

const { Cashback } = models;

const create = (params) => {
  return Cashback.create(params);
};

const get = (params) => {
  return Cashback.findOne({ where: params });
};

const destroy = (params) => {
  return Cashback.destroy({ where: params });
};

module.exports = {
  create,
  get,
  destroy,
};
