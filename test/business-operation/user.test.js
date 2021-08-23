const expect = require('chai').expect;
const sinon = require('sinon');
const faker = require('faker');

const userBO = require('../../src/core/business-operation/user');
const userRepository = require('../../src/core/repository/user');
const auth = require('../../src/auth');

describe('Testing user business-operation', () => {
  const mockValues = {
    uid: faker.datatype.uuid(),
    fullName: faker.name.findName(),
    password: faker.datatype.string(),
    email: faker.internet.email(),
    documentNumber: faker.datatype.string(),
  };

  describe('Registering new user', () => {
    describe('When user doenst exist', () => {
      before(() => {
        sinon.stub(userRepository, 'create').returns(mockValues);
      });

      after(() => {
        userRepository.create.restore();
      });

      it('Should return 200', async () => {
        const { status, data } = await userBO.register(mockValues);

        expect(status).to.equal(200);
        expect(data.fullName).to.equal(mockValues.fullName);
        expect(data.documentNumber).to.equal(mockValues.documentNumber);
        expect(data.email).to.equal(mockValues.email);
      });
    });

    describe('When user already exists', () => {
      before(() => {
        sinon.stub(userRepository, 'get').returns(mockValues);
      });

      after(() => {
        userRepository.get.restore();
      });

      it('Should return 400', async () => {
        const { status } = await userBO.register(mockValues);

        expect(status).to.equal(400);
      });
    });
  });

  describe('Login user', () => {
    describe('When successfull login', () => {
      let jwtToken;

      before(() => {
        sinon.stub(userRepository, 'get').returns(mockValues);
        jwtToken = auth.createJWTToken(mockValues.documentNumber);
      });

      after(() => {
        userRepository.get.restore();
      });

      it('Should return status 200 and jwt token', async () => {
        const { status, data } = await userBO.login(mockValues);

        expect(status).to.equal(200);
        expect(data.token).to.equal(jwtToken);
      });
    });

    describe('When user doenst exist', () => {
      before(() => {
        sinon.stub(userRepository, 'get').returns();
      });

      after(() => {
        userRepository.get.restore();
      });

      it('Should return status 400 and user not found error', async () => {
        const { status, data } = await userBO.login(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('CPF ou Senha incorreta');
      });
    });

    describe('When jwt token was not created', () => {
      before(() => {
        sinon.stub(userRepository, 'get').returns({});
        sinon.stub(auth, 'createJWTToken').returns();
      });

      after(() => {
        userRepository.get.restore();
        auth.createJWTToken.restore();
      });

      it('Should return status 400 and jwt token error', async () => {
        const { status, data } = await userBO.login(mockValues);

        expect(status).to.equal(400);
        expect(data.message).to.equal('Não foi possível criar um token');
      });
    });
  });
});
