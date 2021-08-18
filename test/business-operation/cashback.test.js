const expect = require('chai').expect;
const sinon = require('sinon');
const faker = require('faker');

const cashbackBO = require('../../src/core/business-operation/cashback');
const cashbackRepository = require('../../src/core/repository/cashback');
const CASHBACK = require('../../src/enums/cashback-percentages');

describe('Testing cashback business-operation', () => {
  describe('Registering new cashback', () => {
    let createCashbackStub;
    let getCashbackStub;

    const mockedInput = {
      value: faker.datatype.number(1000),
      purchaseUid: faker.datatype.uuid(),
    };

    const mockValues = {
      percentage: CASHBACK.TEN_PERCENT,
      value: CASHBACK.TEN_PERCENT * mockedInput.value,
    };

    describe('When cashback is only 10%', () => {
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
});
