const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');

const { mockedUserForGetAllPurchase } = require('../fixtures/user');
const { mockedPurchaseForGetAll } = require('../fixtures/purchase');
const { mockedCashbackForGetAll } = require('../fixtures/cashback');

const cashbackRepository = require('../../src/core/repository/cashback');
const purchaseRepository = require('../../src/core/repository/purchase');

const auth = require('../../src/auth');

const models = require('../../src/core/model');

const { User, Purchase, Cashback } = models;

const request = supertest(app);

describe('GET /purchase/list', () => {
  let jwtToken;

  before(async () => {
    await User.create(mockedUserForGetAllPurchase);
    const purchaseParams = {
      ...mockedPurchaseForGetAll,
      documentNumber: mockedUserForGetAllPurchase.documentNumber,
    };

    const purchase = await Purchase.create(purchaseParams);
    const cashbackParams = {
      ...mockedCashbackForGetAll,
      purchaseUid: purchase.uid,
    };

    await Cashback.create(cashbackParams);
    jwtToken = auth.createJWTToken(mockedUserForGetAllPurchase.documentNumber);
  });

  after(async () => {
    const userDestroyParams = {
      ...mockedUserForGetAllPurchase,
    };
    delete userDestroyParams.password;

    await Cashback.destroy({
      where: { purchaseUid: mockedPurchaseForGetAll.uid },
    });
    await Purchase.destroy({ where: { uid: mockedPurchaseForGetAll.uid } });
    await User.destroy({ where: userDestroyParams });
  });

  describe('When cant get cashbacks', () => {
    before(() => {
      sinon
        .stub(purchaseRepository, 'getAll')
        .returns([{ uid: 'asioehaiowh' }]);
      sinon.stub(cashbackRepository, 'getAll').throws(new Error());
    });

    after(() => {
      cashbackRepository.getAll.restore();
      purchaseRepository.getAll.restore();
    });

    it('Should return 400 and cant get cashbacks error', async () => {
      const { body } = await request
        .get('/purchase/list')
        .set('x-access-token', jwtToken)
        .send();

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Erro ao tentar buscar os cashbacks');
    });
  });

  describe('When cant get purchases', () => {
    before(() => {
      sinon.stub(purchaseRepository, 'getAll').throws(new Error());
    });

    after(() => {
      purchaseRepository.getAll.restore();
    });

    it('Should return 500 and cant get purchase error', async () => {
      const response = await request
        .get('/purchase/list')
        .set('x-access-token', jwtToken)
        .send();

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal(
        'Erro ao tentar buscar todas as compras'
      );
    });
  });

  describe('When length of cashbacks and purchases are different', () => {
    before(() => {
      sinon
        .stub(purchaseRepository, 'getAll')
        .returns([{ uid: 'asioehaiowh' }]);
      sinon.stub(cashbackRepository, 'getAll').returns([]);
    });

    after(() => {
      cashbackRepository.getAll.restore();
      purchaseRepository.getAll.restore();
    });

    it('Should return 400 and cant get cashbacks error', async () => {
      const { body } = await request
        .get('/purchase/list')
        .set('x-access-token', jwtToken)
        .send();

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Quantidade de dados incorreto');
    });
  });

  describe('When datas are returned successfully', () => {
    it('Should return 200 and an array', async () => {
      const { body } = await request
        .get('/purchase/list')
        .set('x-access-token', jwtToken)
        .send();

      expect(body.status).to.equal(200);
      // expect(body.data).to.equal('Quantidade de dados incorreto');
    });
  });
});
