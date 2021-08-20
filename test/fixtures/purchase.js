const uuid = require('uuid').v4;

const STATUS = require('../../src/enums/purchase-status');

const now = new Date();

const createPurchaseInput = {
  code: 'z',
  value: 1000,
  purchaseDate: now,
  status: STATUS.PENDING_REQUEST,
  deleted: false,
};

const editPurchaseInput = {
  code: 'z',
  purchaseDate: now,
  status: STATUS.PENDING_REQUEST,
  deleted: false,
  editedValues: {
    code: 'y',
    value: 2000,
    status: STATUS.APPROVED,
  },
};

const mockedPurchaseForEdit = {
  uid: uuid(),
  code: 'z',
  value: 1000,
  purchaseDate: now,
  status: STATUS.PENDING_REQUEST,
  deleted: false,
};

const mockedPurchaseForRemove = {
  uid: uuid(),
  code: 'z',
  value: 1000,
  purchaseDate: now,
  status: STATUS.PENDING_REQUEST,
  deleted: false,
};

module.exports = {
  createPurchaseInput,
  editPurchaseInput,
  mockedPurchaseForEdit,
  mockedPurchaseForRemove,
};
