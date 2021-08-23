const expect = require('chai').expect;
const supertest = require('supertest');
const sinon = require('sinon');

const app = require('../../src/index');
const { registerUserInput } = require('../fixtures/user');

const userBO = require('../../src/core/business-operation/user');

const userRepository = require('../../src/core/repository/user');

const models = require('../../src/core/model');

const { User } = models;

const request = supertest(app);

describe('#POST /register', () => {
  after(async () => {
    const destroyParams = { ...registerUserInput };
    delete destroyParams.password;

    await User.destroy({ where: destroyParams });
  });

  describe('When same email was used', () => {
    before(() => {
      sinon
        .stub(userRepository, 'create')
        .throws({ name: 'SequelizeUniqueConstraintError' });
    });

    after(() => {
      userRepository.create.restore();
    });

    it('Should return status 400 and email error', async () => {
      const { body } = await request.post('/register').send(registerUserInput);

      expect(body.status).to.equal(400);
      expect(body.data.message).to.equal('Email já cadastrado');
    });
  });

  describe('When same documentNumber was used', () => {
    before(() => {
      sinon.stub(userRepository, 'get').returns({});
    });

    after(() => {
      userRepository.get.restore();
    });

    it('Should return status 400 and existing user error', async () => {
      const { body } = await request.post('/register').send(registerUserInput);

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
      const response = await request.post('/register').send(registerUserInput);

      expect(response.status).to.equal(500);
      expect(response.error.text).to.equal('Erro Interno');
    });
  });

  describe('When new user is created', () => {
    it('Should return status 200 and a new user', async () => {
      const { body } = await request.post('/register').send(registerUserInput);

      console.log(body);

      expect(body.status).to.equal(200);
      expect(body.data.created).to.equal(true);
    });
  });
});
