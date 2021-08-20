const expect = require('chai').expect;
const sinon = require('sinon');
const faker = require('faker');

const cashbackBO = require('../../src/core/business-operation/cashback');
const cashbackRepository = require('../../src/core/repository/cashback');
const CASHBACK = require('../../src/enums/cashback-percentages');

describe('Testing cashback business-operation', () => {
  // CREATING CASHBACK
  describe('Registering new cashback', () => {
    let createCashbackStub;
    let getCashbackStub;

    describe('When cashback is only 10%', () => {
      const mockedInput = {
        value: faker.datatype.number(1000),
        purchaseUid: faker.datatype.uuid(),
      };

      const mockValues = {
        percentage: CASHBACK.TEN_PERCENT,
        value: CASHBACK.TEN_PERCENT * mockedInput.value,
      };

      before(() => {
        getCashbackStub = sinon
          .stub(cashbackRepository, 'create')
          .returns(mockValues);
      });

      after(() => {
        cashbackRepository.create.restore();
      });

      it('Should return 200 with all the datas', async () => {
        const data = await cashbackBO.create(mockedInput);

        expect(data.value).to.equal(mockedInput.value * CASHBACK.TEN_PERCENT);
        expect(data.percentage).to.equal(CASHBACK.TEN_PERCENT);
      });
    });
  });

  // EDITING CASHBACK
  describe('Editing a cashback', () => {
    let updateCashbackStub;

    describe('When cashback is updated successfully', () => {
      const mockedInput = {
        value: faker.datatype.number(1000),
        purchaseUid: faker.datatype.uuid(),
      };

      const mockCashback = {
        value: faker.datatype.number(),
        percentage: faker.datatype.number(),
      };

      before(() => {
        updateCashbackStub = sinon
          .stub(cashbackRepository, 'update')
          .returns([1, [mockCashback]]);
      });

      after(() => {
        cashbackRepository.update.restore();
      });

      it('Should return the edited cashback', async () => {
        const response = await cashbackBO.edit(mockedInput);

        expect(response.value).to.equal(mockCashback.value);
        expect(response.percentage).to.equal(mockCashback.percentage);
      });
    });
  });

  //GETTING ONE CASHBACK
  describe('Getting a cashback', () => {
    let getCashbackStub;

    describe('When cashback doesnt return successfully', () => {
      const mockedInput = {
        value: faker.datatype.number(1000),
        purchaseUid: faker.datatype.uuid(),
      };

      before(() => {
        getCashbackStub = sinon
          .stub(cashbackRepository, 'get')
          .throws('Error trying to edit cashback');
      });

      after(() => {
        cashbackRepository.get.restore();
      });

      it('Should throw error', async () => {
        const response = await cashbackBO.get(mockedInput);

        expect(response).to.equal('Error trying to get cashback');
      });
    });

    describe('When cashback return successfully', () => {
      const mockedValue = faker.datatype.number();
      const mockedInput = {
        value: mockedValue,
        purchaseUid: faker.datatype.uuid(),
      };

      const mockCashback = {
        value: mockedValue,
        percentage: faker.datatype.number(),
      };

      before(() => {
        getCashbackStub = sinon
          .stub(cashbackRepository, 'get')
          .returns(mockCashback);
      });

      after(() => {
        cashbackRepository.get.restore();
      });

      it('Should return the searched cashback', async () => {
        const response = await cashbackBO.get(mockedInput);

        expect(response.value).to.equal(mockCashback.value);
        expect(response.percentage).to.equal(mockCashback.percentage);
      });
    });
  });

  //GETTING MANY CASHBACK
  describe('Getting many cashbacks', () => {
    let getManyCashbackStub;

    describe('When cashbacks doesnt return successfully', () => {
      const mockedInput = {
        value: faker.datatype.number(1000),
        purchaseUid: faker.datatype.uuid(),
      };

      before(() => {
        getManyCashbackStub = sinon
          .stub(cashbackRepository, 'getAll')
          .throws('Error trying to get many cashbacks');
      });

      after(() => {
        cashbackRepository.getAll.restore();
      });

      it('Should throw error', async () => {
        const response = await cashbackBO.getMany(mockedInput);

        expect(response).to.equal('Error trying to get many cashbacks');
      });
    });

    describe('When cashbacks are returned successfully', () => {
      const mockedValue = faker.datatype.number();
      const mockedInput = {
        value: mockedValue,
        purchaseUid: faker.datatype.uuid(),
      };

      const mockCashback = [
        {
          value: mockedValue,
          percentage: faker.datatype.number(),
        },
      ];

      before(() => {
        getManyCashbackStub = sinon
          .stub(cashbackRepository, 'getAll')
          .returns(mockCashback);
      });

      after(() => {
        cashbackRepository.getAll.restore();
      });

      it('Should return the searched cashback', async () => {
        const response = await cashbackBO.getMany(mockedInput);

        expect(response).to.eql(mockCashback);
        expect(response).to.eql(mockCashback);
      });
    });
  });
});
