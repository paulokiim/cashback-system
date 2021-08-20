const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');
const md5 = require('md5');

const app = require('../../src/index');
const { loginUser, registerUser } = require('../fixtures/user');
const { createPurchase } = require('../fixtures/purchase');
const models = require('../../src/core/model');
const purchaseBO = require('../../src/core/business-operation/purchase');
const userRepository = require('../../src/core/repository/user');
const auth = require('../../src/auth');

const { Purchase, User } = models;

const request = supertest(app);

describe('POST /purchase/create', () => {
  let jwtToken;
  before(async () => {
    await User.create(registerUser);
    jwtToken = auth.createJWTToken(registerUser.documentNumber);
  });

  after(async () => {
    const destroyParams = {
      ...registerUser,
    };
    delete destroyParams.password;

    await User.destroy({ where: destroyParams });
  });

  describe('When required data is missing', () => {
    let paramsMissing = {
      ...createPurchase,
    };

    it('Should return status 400 and data missing error', async () => {
      delete paramsMissing.code;
      const { body } = await request
        .post('/purchase/create')
        .set('x-access-token', jwtToken)
        .send(paramsMissing);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Informe todos os dados');
    });
  });

  describe('When user was not found', () => {
    let paramsMissing = {
      ...createPurchase,
    };

    before(() => {
      sinon.stub(userRepository, 'get').returns();
    });

    after(() => {
      userRepository.get.restore();
    });

    it('Should return status 400 and user not found error', async () => {
      const { body } = await request
        .post('/purchase/create')
        .set('x-access-token', jwtToken)
        .send(paramsMissing);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Usuário não encontrado');
    });
  });
});
