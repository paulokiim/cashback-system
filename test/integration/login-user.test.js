const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');
const { mockedUserForLogin, loginUserInput } = require('../fixtures/user');

const userBO = require('../../src/core/business-operation/user');

const userRepository = require('../../src/core/repository/user');

const models = require('../../src/core/model');

const { User } = models;

const request = supertest(app);

describe('PUT /login', () => {
  before(async () => {
    await User.create(mockedUserForLogin);
  });

  after(async () => {
    const destroyParams = { ...mockedUserForLogin };
    delete destroyParams.password;

    await User.destroy({ where: destroyParams });
  });

  describe('When user not found on database', () => {
    before(() => {
      sinon.stub(userRepository, 'get').returns();
    });

    after(() => {
      userRepository.get.restore();
    });

    it('Should return status 400 and user not found message', async () => {
      const { body } = await request.put('/login').send(loginUserInput);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('CPF ou Senha incorreta');
    });
  });

  describe('When userBO throws an error', () => {
    before(() => {
      sinon.stub(userBO, 'login').throws('Sequelize');
    });
    after(() => {
      userBO.login.restore();
    });
    it('Should return 500 and internal error message', async () => {
      const response = await request.put('/login').send(loginUserInput);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal('Erro Interno');
    });
  });

  describe('When user is successfully logged in', () => {
    it('Should return status 200 and jwt token', async () => {
      const { body } = await request.put('/login').send(loginUserInput);

      expect(body.status).to.equal(200);
      expect(body.data).to.have.any.keys('token');
    });
  });
});
