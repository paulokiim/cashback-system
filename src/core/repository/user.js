const models = require('../model');

const { User } = models;

const create = (params) => {
  return User.create(params);
};

const get = (params) => {
  return User.findOne({ where: params });
};

module.exports = {
  create,
  get,
};
