const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');
const md5 = require('md5');

const app = require('../../src/index');
const { loginUser, registerUser } = require('../fixtures/user');
const models = require('../../src/core/model');
const userBO = require('../../src/core/business-operation/user');

const { User } = models;

const request = supertest(app);

describe('PUT /login', () => {
  describe('When user not found on database', () => {
    it('Should return status 400 and user not found message', async () => {
      const { body } = await request.put('/login').send(loginUser);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('CPF ou Senha incorreta');
    });
  });

  describe('When user is successfully logged in', () => {
    before(async () => {
      const createParams = {
        ...registerUser,
        password: md5(registerUser.password),
      };

      await User.create(createParams);
    });

    after(async () => {
      const destroyParams = { ...registerUser };
      delete destroyParams.password;

      await User.destroy({ where: destroyParams });
    });

    it('Should return status 200 and jwt token', async () => {
      const { body } = await request.put('/login').send(loginUser);

      expect(body.status).to.equal(200);
      expect(body.data).to.have.any.keys('token');
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
      const response = await request.put('/login').send(loginUser);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal('Erro Interno');
    });
  });
});
