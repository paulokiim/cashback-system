const models = require('../model');

const { Cashback } = models;

const create = (params) => {
  return Cashback.create(params);
};

const get = (params) => {
  return Cashback.findOne({ where: params });
};

const getAll = (params) => {
  return Cashback.findAll({ where: params });
};

const update = (params, where) => {
  return Cashback.update(params, { returning: true, where });
};

const destroy = (params) => {
  return Cashback.destroy({ where: params });
};

module.exports = {
  create,
  get,
  getAll,
  update,
  destroy,
};
