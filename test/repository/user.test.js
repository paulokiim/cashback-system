const expect = require('chai').expect;
const faker = require('faker');

const userRepository = require('../../src/core/repository/user');

const models = require('../../src/core/model');

const { User } = models;

describe('#Testing user repository', () => {
  const mockedUser = {
    fullName: faker.datatype.string(),
    documentNumber: faker.datatype.string(),
    email: faker.internet.email(),
    password: faker.datatype.string(),
  };

  after(async () => {
    await User.destroy({ where: mockedUser });
  });

  describe('When creating new user throws an error', () => {
    const input = {
      ...mockedUser,
    };
    delete input.password;

    it('Should return an error', async () => {
      try {
        await userRepository.create(input);
      } catch (error) {
        expect(error.message).to.equal(
          'null value in column "password" of relation "users" violates not-null constraint'
        );
      }
    });
  });

  describe('When creating new user is successfull', () => {
    it('Should create a new user in database', async () => {
      const response = await userRepository.create(mockedUser);

      expect(response.dataValues.fullName).to.equal(mockedUser.fullName);
      expect(response.dataValues.documentNumber).to.equal(
        mockedUser.documentNumber
      );
      expect(response.dataValues.email).to.equal(mockedUser.email);
      expect(response.dataValues.password).to.equal(mockedUser.password);
    });
  });

  describe('When getting a user that doesnt exists', () => {
    const input = {
      ...mockedUser,
      password: 'aoisdhwoi',
    };

    it('Should return null', async () => {
      const response = await userRepository.get(input);

      expect(response).to.equal(null);
    });
  });

  describe('When getting a user is successfull', () => {
    it('Should get a user in database', async () => {
      const response = await userRepository.get(mockedUser);

      expect(response.dataValues.fullName).to.equal(mockedUser.fullName);
      expect(response.dataValues.documentNumber).to.equal(
        mockedUser.documentNumber
      );
      expect(response.dataValues.email).to.equal(mockedUser.email);
      expect(response.dataValues.password).to.equal(mockedUser.password);
    });
  });
});
