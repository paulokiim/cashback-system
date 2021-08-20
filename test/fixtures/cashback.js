const uuid = require('uuid').v4;

const createCashbackInput = {
  value: 100,
  percentage: 0.1,
};

const mockedCashback = {
  uid: uuid(),
  value: 100,
  percentage: 0.1,
};

module.exports = {
  createCashbackInput,
  mockedCashback,
};
