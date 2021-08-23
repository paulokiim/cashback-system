const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');
const { mockedUserForEditPurchase } = require('../fixtures/user');
const {
  mockedPurchaseForEdit,
  editPurchaseInput,
} = require('../fixtures/purchase');
const { mockedCashback } = require('../fixtures/cashback');

const cashbackBO = require('../../src/core/business-operation/cashback');

const purchaseRepository = require('../../src/core/repository/purchase');

const models = require('../../src/core/model');
const auth = require('../../src/auth');

const STATUS = require('../../src/enums/purchase-status');

const { Cashback, Purchase, User } = models;

const request = supertest(app);

describe('#PUT /purchase/edit', () => {
  let jwtToken;
  before(async () => {
    await User.create(mockedUserForEditPurchase);
    const purchaseParams = {
      ...mockedPurchaseForEdit,
      documentNumber: mockedUserForEditPurchase.documentNumber,
    };

    const purchase = await Purchase.create(purchaseParams);
    const cashbackParams = {
      ...mockedCashback,
      purchaseUid: purchase.uid,
    };

    await Cashback.create(cashbackParams);
    jwtToken = auth.createJWTToken(mockedUserForEditPurchase.documentNumber);
  });

  after(async () => {
    const userDestroyParams = {
      ...mockedUserForEditPurchase,
    };
    delete userDestroyParams.password;

    await Cashback.destroy({
      where: { purchaseUid: mockedPurchaseForEdit.uid },
    });
    await Purchase.destroy({ where: { uid: mockedPurchaseForEdit.uid } });
    await User.destroy({ where: userDestroyParams });
  });

  describe('When required data is missing', () => {
    let paramsMissing = {
      ...editPurchaseInput,
    };

    it('Should return status 400 and data missing error', async () => {
      delete paramsMissing.code;
      const { body } = await request
        .put('/purchase/edit')
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
        .put('/purchase/edit')
        .set('x-access-token', jwtToken)
        .send(editPurchaseInput);

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
        .put('/purchase/edit')
        .set('x-access-token', jwtToken)
        .send(editPurchaseInput);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Status já aprovado');
    });
  });

  describe('When update purchase throws error', () => {
    before(() => {
      sinon.stub(purchaseRepository, 'get').returns(mockedPurchaseForEdit);
      sinon.stub(purchaseRepository, 'update').throws(new Error());
    });

    after(() => {
      purchaseRepository.update.restore();
      purchaseRepository.get.restore();
    });

    it('Should return status 500 and couldnt edit error', async () => {
      const response = await request
        .put('/purchase/edit')
        .set('x-access-token', jwtToken)
        .send(editPurchaseInput);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal(
        'Erro ao tentar atualizar compra ou cashback'
      );
    });
  });

  describe('When update cashback throws error', () => {
    before(() => {
      sinon.stub(purchaseRepository, 'get').returns(mockedPurchaseForEdit);
      sinon.stub(cashbackBO, 'edit').throws(new Error());
    });

    after(() => {
      cashbackBO.edit.restore();
      purchaseRepository.get.restore();
    });

    it('Should return status 500 and couldnt edit error', async () => {
      const response = await request
        .put('/purchase/edit')
        .set('x-access-token', jwtToken)
        .send(editPurchaseInput);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal(
        'Erro ao tentar atualizar compra ou cashback'
      );
    });
  });

  describe('When purchase is updated successfully', () => {
    it('Should return status 200 and purchase updated', async () => {
      const { body } = await request
        .put('/purchase/edit')
        .set('x-access-token', jwtToken)
        .send(editPurchaseInput);

      expect(body.status).to.equal(200);
      expect(body.data).to.have.any.keys('purchase', 'cashback');
    });
  });
});
