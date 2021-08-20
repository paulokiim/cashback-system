const md5 = require('md5');

const registerUserInput = {
  fullName: 'Cordeiro',
  documentNumber: '987987987',
  email: 'teste@gmail.com',
  password: 'paulokim',
};

const mockedUserForLogin = {
  fullName: 'Cordeiro',
  documentNumber: '123456789',
  email: 'teste1@gmail.com',
  password: md5('paulokim'),
};

const loginUserInput = {
  documentNumber: '123456789',
  password: 'paulokim',
};

const mockedUserForCreatePurchase = {
  fullName: 'Cordeiro',
  documentNumber: '0987654321',
  email: 'teste2@gmail.com',
  password: md5('paulokim'),
};

const mockedUserForEditPurchase = {
  fullName: 'Cordeiro',
  documentNumber: '000000000',
  email: 'teste3@gmail.com',
  password: md5('paulokim'),
};

const mockedUserForRemovePurchase = {
  fullName: 'Cordeiro',
  documentNumber: '111111111',
  email: 'teste4@gmail.com',
  password: md5('paulokim'),
};

const mockedUserForGetAllPurchase = {
  fullName: 'Cordeiro',
  documentNumber: '222222222',
  email: 'teste5@gmail.com',
  password: md5('paulokim'),
};

module.exports = {
  registerUserInput,
  mockedUserForLogin,
  loginUserInput,
  mockedUserForCreatePurchase,
  mockedUserForEditPurchase,
  mockedUserForRemovePurchase,
  mockedUserForGetAllPurchase,
};
