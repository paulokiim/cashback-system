const expect = require('chai').expect;
const faker = require('faker');

const purchaseRespository = require('../../src/core/repository/purchase');

const models = require('../../src/core/model');

const STATUS = require('../../src/enums/purchase-status');

const { User, Purchase } = models;

describe('#Testing Purchase repository', () => {
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
    status: STATUS.PENDING_REQUEST,
    deleted: false,
  };

  before(async () => {
    await User.create(mockedUser);
  });

  after(async () => {
    await Purchase.destroy({ where: mockedPurchase });
    await User.destroy({ where: mockedUser });
  });

  describe('When creating new purchase throws an error', () => {
    const input = {
      ...mockedPurchase,
    };
    delete input.uid;

    it('Should return an error', async () => {
      try {
        await purchaseRespository.create(input);
      } catch (error) {
        expect(error.message).to.equal(
          'null value in column "uid" of relation "purchase" violates not-null constraint'
        );
      }
    });
  });

  describe('When creating new purchase is successfull', () => {
    it('Should create a new purchase in database', async () => {
      const response = await purchaseRespository.create(mockedPurchase);

      expect(response.dataValues.uid).to.equal(mockedPurchase.uid);
      expect(response.dataValues.documentNumber).to.equal(
        mockedPurchase.documentNumber
      );
      expect(response.dataValues.code).to.equal(mockedPurchase.code);
      expect(response.dataValues.value).to.equal(mockedPurchase.value);
      expect(response.dataValues.purchaseDate).to.deep.equal(
        mockedPurchase.purchaseDate
      );
      expect(response.dataValues.status).to.equal(mockedPurchase.status);
    });
  });

  describe('When getting a purchase that doesnt exists', () => {
    const input = {
      ...mockedPurchase,
      documentNumber: 'aoisdhwoi',
    };

    it('Should return null', async () => {
      const response = await purchaseRespository.get(input);

      expect(response).to.equal(null);
    });
  });

  describe('When getting a purchase is successfull', () => {
    it('Should get a purchase in database', async () => {
      const response = await purchaseRespository.get(mockedPurchase);

      expect(response.dataValues.uid).to.equal(mockedPurchase.uid);
      expect(response.dataValues.documentNumber).to.equal(
        mockedPurchase.documentNumber
      );
      expect(response.dataValues.code).to.equal(mockedPurchase.code);
      expect(response.dataValues.value).to.equal(mockedPurchase.value);
      expect(response.dataValues.purchaseDate).to.deep.equal(
        mockedPurchase.purchaseDate
      );
      expect(response.dataValues.status).to.equal(mockedPurchase.status);
    });
  });

  describe('When updating purchase that doesnt exists', () => {
    const whereParams = {
      code: faker.datatype.string(),
    };

    it('Should return 0 rows affected', async () => {
      const [rowsAffected, [updatedPurchase]] =
        await purchaseRespository.update(mockedPurchase, whereParams);

      expect(rowsAffected).to.equal(0);
      expect(updatedPurchase).to.equal(undefined);
    });
  });

  describe('When updating purchase successfully', () => {
    it('Should return the updated purchase', async () => {
      const [rowsAffected, [updatedPurchase]] =
        await purchaseRespository.update(mockedPurchase, mockedPurchase);

      expect(rowsAffected).to.equal(1);
      expect(updatedPurchase.dataValues.uid).to.equal(mockedPurchase.uid);
      expect(updatedPurchase.dataValues.documentNumber).to.equal(
        mockedPurchase.documentNumber
      );
      expect(updatedPurchase.dataValues.code).to.equal(mockedPurchase.code);
      expect(updatedPurchase.dataValues.value).to.equal(mockedPurchase.value);
      expect(updatedPurchase.dataValues.purchaseDate).to.deep.equal(
        mockedPurchase.purchaseDate
      );
      expect(updatedPurchase.dataValues.status).to.equal(mockedPurchase.status);
    });
  });

  describe('When occurs an error trying to update purchase', () => {
    const updateParams = {
      ...mockedPurchase,
      documentNumber: null,
    };

    it('Should return error', async () => {
      try {
        await purchaseRespository.update(updateParams, mockedPurchase);
      } catch (error) {
        expect(error.message).to.equal(
          'null value in column "document_number" of relation "purchase" violates not-null constraint'
        );
      }
    });
  });

  describe('When getting all purchases and it doesnt exists', () => {
    const input = {
      ...mockedPurchase,
      documentNumber: 'aoisdhwoi',
    };

    it('Should return array with length 0', async () => {
      const response = await purchaseRespository.getAll(input);

      expect(response.length).to.equal(0);
    });
  });

  describe('When getting all purchases', () => {
    it('Should return all purchases that matched', async () => {
      const response = await purchaseRespository.getAll(mockedPurchase);

      expect(response.length).to.equal(1);
    });
  });
});
