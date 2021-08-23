const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');

const { mockedUserForExternalCashback } = require('../fixtures/user');

const cashbackService = require('../../src/services/boticario-cashback');

const auth = require('../../src/auth');

const models = require('../../src/core/model');

const { User } = models;

const request = supertest(app);

describe('#GET /cashback/amount', () => {
  let jwtToken;
  let errorJwtToken;

  before(async () => {
    await User.create(mockedUserForExternalCashback);
    jwtToken = auth.createJWTToken(
      Number(mockedUserForExternalCashback.documentNumber)
    );
    errorJwtToken = auth.createJWTToken('asidjwoiqj');
  });

  after(async () => {
    const destroyParams = { ...mockedUserForExternalCashback };
    delete destroyParams.password;

    await User.destroy({ where: destroyParams });
  });

  describe('When documentNumber is invalid', () => {
    it('Should return status 400 and error message ', async () => {
      const { body } = await request
        .get('/cashback/amount')
        .set('x-access-token', errorJwtToken);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal(
        'CPF do revendedor(a) está incorreto, utilize apenas números!'
      );
    });
  });

  describe('When documentNumber is valid', () => {
    it('Should return status 200 and credit ', async () => {
      const { body } = await request
        .get('/cashback/amount')
        .set('x-access-token', jwtToken);

      expect(body.status).to.equal(200);
      expect(body.data).to.have.any.keys('credit');
    });
  });

  describe('When api is disabled', () => {
    before(() => {
      sinon.stub(cashbackService, 'getCashback').throws(new Error());
    });
    after(() => {
      cashbackService.getCashback.restore();
    });
    it('Should return status 500 and error message ', async () => {
      const response = await request
        .get('/cashback/amount')
        .set('x-access-token', jwtToken);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal('Erro na api externa');
    });
  });
});
