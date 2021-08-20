const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');
const { mockedUserForRemovePurchase } = require('../fixtures/user');
const {
  mockedPurchaseForRemove,
  removePurchaseInput,
} = require('../fixtures/purchase');
const { mockedCashback } = require('../fixtures/cashback');

const purchaseRepository = require('../../src/core/repository/purchase');

const models = require('../../src/core/model');
const auth = require('../../src/auth');

const STATUS = require('../../src/enums/purchase-status');

const { Cashback, Purchase, User } = models;

const request = supertest(app);

describe('PUT /purchase/delete', () => {
  let jwtToken;
  before(async () => {
    await User.create(mockedUserForRemovePurchase);
    const purchaseParams = {
      ...mockedPurchaseForRemove,
      documentNumber: mockedUserForRemovePurchase.documentNumber,
    };

    const purchase = await Purchase.create(purchaseParams);
    const cashbackParams = {
      ...mockedCashback,
      purchaseUid: purchase.uid,
    };

    await Cashback.create(cashbackParams);
    jwtToken = auth.createJWTToken(mockedUserForRemovePurchase.documentNumber);
  });

  after(async () => {
    const userDestroyParams = {
      ...mockedUserForRemovePurchase,
    };
    delete userDestroyParams.password;

    await Cashback.destroy({
      where: { purchaseUid: mockedPurchaseForRemove.uid },
    });
    await Purchase.destroy({ where: { uid: mockedPurchaseForRemove.uid } });
    await User.destroy({ where: userDestroyParams });
  });

  describe('When required data is missing', () => {
    let paramsMissing = {
      ...removePurchaseInput,
    };

    it('Should return status 400 and data missing error', async () => {
      delete paramsMissing.code;
      const { body } = await request
        .put('/purchase/delete')
        .set('x-access-token', jwtToken)
        .send(paramsMissing);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Informe todos os dados');
    });
  });

  describe('When purchase not found', () => {
    before(() => {
      sinon.stub(purchaseRepository, 'get').returns();
    });

    after(() => {
      purchaseRepository.get.restore();
    });

    it('Should return status 400 and purchase not found error', async () => {
      const { body } = await request
        .put('/purchase/delete')
        .set('x-access-token', jwtToken)
        .send(removePurchaseInput);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Compra não foi encontrada');
    });
  });

  describe('When status is approved', () => {
    before(() => {
      sinon
        .stub(purchaseRepository, 'get')
        .returns({ status: STATUS.APPROVED, deleted: false });
    });

    after(() => {
      purchaseRepository.get.restore();
    });

    it('Should return status 400 and status approved error', async () => {
      const { body } = await request
        .put('/purchase/delete')
        .set('x-access-token', jwtToken)
        .send(removePurchaseInput);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Status já aprovado');
    });
  });

  describe('When update purchase throws error', () => {
    before(() => {
      sinon.stub(purchaseRepository, 'get').returns(mockedPurchaseForRemove);
      sinon.stub(purchaseRepository, 'update').throws(new Error());
    });

    after(() => {
      purchaseRepository.update.restore();
      purchaseRepository.get.restore();
    });

    it('Should return status 500 and couldnt delete error', async () => {
      const response = await request
        .put('/purchase/delete')
        .set('x-access-token', jwtToken)
        .send(removePurchaseInput);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal(
        'Erro ao tentar deletar compra ou cashback'
      );
    });
  });

  describe('When update cashback throws error', () => {
    before(() => {
      sinon.stub(purchaseRepository, 'get').returns(mockedPurchaseForRemove);
    });

    after(() => {
      purchaseRepository.get.restore();
    });

    it('Should return status 200 and purchase deleted', async () => {
      const { body } = await request
        .put('/purchase/delete')
        .set('x-access-token', jwtToken)
        .send(removePurchaseInput);

      expect(body.status).to.equal(200);
    });
  });
});
