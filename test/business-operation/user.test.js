const expect = require('chai').expect;
const sinon = require('sinon');
const faker = require('faker');

const userBO = require('../../src/core/business-operation/user');
const userRepository = require('../../src/core/repository/user');
const { createJWTToken } = require('../../src/auth');

describe('Testing user business-operation', () => {
  describe('Registering new user', () => {
    let createUserStub;
    let getUserStub;

    const mockValues = {
      uid: faker.datatype.uuid(),
      fullName: faker.name.findName(),
      password: faker.datatype.string(),
      email: faker.internet.email(),
      documentNumber: faker.datatype.string(),
    };

    describe('When user doenst exist', () => {
      before(() => {
        createUserStub = sinon
          .stub(userRepository, 'create')
          .returns(mockValues);
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
        getUserStub = sinon.stub(userRepository, 'get').returns(mockValues);
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
    let getUserStub;

    const mockValues = {
      password: faker.datatype.string(),
      documentNumber: faker.datatype.string(),
    };

    describe('Successfull login', () => {
      const jwtToken = createJWTToken(mockValues.documentNumber);

      before(() => {
        getUserStub = sinon.stub(userRepository, 'get').returns(mockValues);
      });

      after(() => {
        userRepository.get.restore();
      });

      it('Should return jwt token and status 200', async () => {
        const { status, data } = await userBO.login(mockValues);

        expect(status).to.equal(200);
        expect(data.token).to.equal(jwtToken);
      });
    });
  });
});
