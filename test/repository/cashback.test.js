const expect = require('chai').expect;
const faker = require('faker');

const cashbackRepository = require('../../src/core/repository/cashback');

const models = require('../../src/core/model');

const { Cashback, User, Purchase } = models;

describe('#Testing Cashback repository', () => {
  const mockedUser = {
    fullName: faker.datatype.string(),
    documentNumber: faker.datatype.string(),
    email: faker.internet.email(),
    password: faker.datatype.string(),
  };

  const mockedPurchase = {
    uid: faker.datatype.uuid(),
    code: faker.datatype.string(),
    value: faker.datatype.number(),
    purchaseDate: faker.datatype.datetime(),
    documentNumber: mockedUser.documentNumber,
    status: faker.datatype.string(),
    deleted: false,
  };

  const mockedCashback = {
    uid: faker.datatype.uuid(),
    value: faker.datatype.number(),
    percentage: faker.datatype.number(),
    purchaseUid: mockedPurchase.uid,
  };

  before(async () => {
    await User.create(mockedUser);
    await Purchase.create(mockedPurchase);
  });

  after(async () => {
    await Cashback.destroy({ where: mockedCashback });
    await Purchase.destroy({ where: mockedPurchase });
    await User.destroy({ where: mockedUser });
  });

  describe('When creating new cashback throws an error', () => {
    const input = {
      ...mockedCashback,
    };
    delete input.purchaseUid;

    it('Should return an error', async () => {
      try {
        await cashbackRepository.create(input);
      } catch (error) {
        expect(error.message).to.equal(
          'null value in column "purchase_uid" of relation "cashback" violates not-null constraint'
        );
      }
    });
  });

  describe('When creating new cashback is successfull', () => {
    it('Should create a new cashback in database', async () => {
      const response = await cashbackRepository.create(mockedCashback);

      expect(response.dataValues.value).to.equal(mockedCashback.value);
      expect(response.dataValues.percentage).to.equal(
        mockedCashback.percentage
      );
      expect(response.dataValues.purchaseUid).to.equal(
        mockedCashback.purchaseUid
      );
    });
  });

  describe('When getting a cashback that doesnt exists', () => {
    const input = {
      ...mockedCashback,
      uid: faker.datatype.uuid(),
    };

    it('Should return null', async () => {
      const response = await cashbackRepository.get(input);

      expect(response).to.equal(null);
    });
  });

  describe('When getting a cashback is successfull', () => {
    it('Should get a cashback in database', async () => {
      const response = await cashbackRepository.get(mockedCashback);

      expect(response.dataValues.value).to.equal(mockedCashback.value);
      expect(response.dataValues.percentage).to.equal(
        mockedCashback.percentage
      );
      expect(response.dataValues.purchaseUid).to.equal(
        mockedCashback.purchaseUid
      );
    });
  });

  describe('When updating cashback that doesnt exists', () => {
    const whereParams = {
      uid: faker.datatype.uuid(),
    };

    it('Should return 0 rows affected', async () => {
      const [rowsAffected, [updatedCashback]] = await cashbackRepository.update(
        mockedCashback,
        whereParams
      );

      expect(rowsAffected).to.equal(0);
      expect(updatedCashback).to.equal(undefined);
    });
  });

  describe('When updating cashback successfully', () => {
    it('Should return the updated cashback', async () => {
      const [rowsAffected, [updatedCashback]] = await cashbackRepository.update(
        mockedCashback,
        mockedCashback
      );

      expect(rowsAffected).to.equal(1);
      expect(updatedCashback.dataValues.uid).to.equal(mockedCashback.uid);
      expect(updatedCashback.dataValues.documentNumber).to.equal(
        mockedCashback.documentNumber
      );
      expect(updatedCashback.dataValues.code).to.equal(mockedCashback.code);
      expect(updatedCashback.dataValues.value).to.equal(mockedCashback.value);
      expect(updatedCashback.dataValues.purchaseDate).to.deep.equal(
        mockedCashback.purchaseDate
      );
      expect(updatedCashback.dataValues.status).to.equal(mockedCashback.status);
    });
  });

  describe('When occurs an error trying to update cashback', () => {
    const updateParams = {
      ...mockedCashback,
      purchaseUid: null,
    };

    it('Should return error', async () => {
      try {
        await cashbackRepository.update(updateParams, mockedCashback);
      } catch (error) {
        expect(error.message).to.equal(
          'null value in column "purchase_uid" of relation "cashback" violates not-null constraint'
        );
      }
    });
  });

  describe('When getting all cashbacks and it doesnt exists', () => {
    const input = {
      ...mockedCashback,
      purchaseUid: faker.datatype.uuid(),
    };

    it('Should return array with length 0', async () => {
      const response = await cashbackRepository.getAll(input);

      expect(response.length).to.equal(0);
    });
  });

  describe('When getting all cashbacks', () => {
    it('Should return all cashbacks that matched', async () => {
      const response = await cashbackRepository.getAll(mockedCashback);

      expect(response.length).to.equal(1);
    });
  });
});
