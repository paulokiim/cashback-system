const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');
const { mockedUserForCreatePurchase } = require('../fixtures/user');
const { createPurchaseInput } = require('../fixtures/purchase');

const cashbackBO = require('../../src/core/business-operation/cashback');

const userRepository = require('../../src/core/repository/user');
const purchaseRepository = require('../../src/core/repository/purchase');

const models = require('../../src/core/model');
const auth = require('../../src/auth');

const { Cashback, Purchase, User } = models;

const request = supertest(app);

describe('#POST /purchase/create', () => {
  let jwtToken;
  before(async () => {
    await User.create(mockedUserForCreatePurchase);
    jwtToken = auth.createJWTToken(mockedUserForCreatePurchase.documentNumber);
  });

  after(async () => {
    const userDestroyParams = {
      ...mockedUserForCreatePurchase,
    };
    delete userDestroyParams.password;

    const purchaseDestroyParams = {
      ...createPurchaseInput,
    };

    const purchase = await purchaseRepository.get(purchaseDestroyParams);

    const { uid } = purchase;

    await Cashback.destroy({ where: { purchaseUid: uid } });
    await Purchase.destroy({ where: { uid } });
    await User.destroy({ where: userDestroyParams });
  });

  describe('When required data is missing', () => {
    let paramsMissing = {
      ...createPurchaseInput,
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

  describe('When purchase already exists', () => {
    before(() => {
      sinon.stub(purchaseRepository, 'get').returns({});
    });

    after(() => {
      purchaseRepository.get.restore();
    });

    it('Should return status 400 and purchase exists error', async () => {
      const { body } = await request
        .post('/purchase/create')
        .set('x-access-token', jwtToken)
        .send(createPurchaseInput);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Compra já está registrada');
    });
  });

  describe('When cashback is not created successfully', () => {
    before(() => {
      sinon.stub(userRepository, 'get').returns({});
      sinon.stub(cashbackBO, 'create').throws(new Error());
    });

    after(() => {
      userRepository.get.restore();
      cashbackBO.create.restore();
    });

    it('Should return status 400 and creation error', async () => {
      const response = await request
        .post('/purchase/create')
        .set('x-access-token', jwtToken)
        .send(createPurchaseInput);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal(
        'Erro ao tentar criar compra ou cashback'
      );
    });
  });

  describe('When purchase is not created successfully', () => {
    before(() => {
      sinon.stub(userRepository, 'get').returns({});
      sinon.stub(purchaseRepository, 'create').throws(new Error());
    });

    after(() => {
      userRepository.get.restore();
      purchaseRepository.create.restore();
    });

    it('Should return status 400 and creation error', async () => {
      const response = await request
        .post('/purchase/create')
        .set('x-access-token', jwtToken)
        .send(createPurchaseInput);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal(
        'Erro ao tentar criar compra ou cashback'
      );
    });
  });

  describe('When purchase is created successfully', () => {
    it('Should return status 200 and purchase and cashback', async () => {
      const { body } = await request
        .post('/purchase/create')
        .set('x-access-token', jwtToken)
        .send(createPurchaseInput);

      expect(body.status).to.equal(200);
      expect(body.data).to.have.any.keys('purchase', 'cashback');
    });
  });
});
