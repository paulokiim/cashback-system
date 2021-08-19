const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');
const { registerUser } = require('../fixtures/user');
const models = require('../../src/core/model');
const userBO = require('../../src/core/business-operation/user');

const { User } = models;

const request = supertest(app);

describe('POST /register', () => {
  after(async () => {
    const destroyParams = { ...registerUser };
    delete destroyParams.password;

    await User.destroy({ where: destroyParams });
  });

  describe('When new user is created', () => {
    it('Should return status 200 and a new user', async () => {
      const { body } = await request.post('/register').send(registerUser);

      expect(body.status).to.equal(200);
      expect(body.data.fullName).to.equal(registerUser.fullName);
      expect(body.data.documentNumber).to.equal(registerUser.documentNumber);
      expect(body.data.email).to.equal(registerUser.email);
    });
  });

  describe('When same email or documentNumber was used', () => {
    it('Should return status 400 and existing user error', async () => {
      const { body } = await request.post('/register').send(registerUser);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Usuario existente');
    });
  });

  describe('When userBO throws an error', () => {
    before(() => {
      sinon.stub(userBO, 'register').throws('Sequelize');
    });
    after(() => {
      userBO.register.restore();
    });
    it('Should return 500 and internal error message', async () => {
      const response = await request.post('/register').send(registerUser);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal('Erro Interno');
    });
  });
});
