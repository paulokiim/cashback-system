const uuid = require('uuid').v4;

const cashbackRepository = require('../repository/cashback');
const CASHBACK = require('../../enums/cashback-percentages');

const create = async (input) => {
  try {
    const { value, purchaseUid } = input;
    let cashbackPercentage;
    let cashbackValue;

    if (value <= 1000) {
      cashbackPercentage = CASHBACK.TEN_PERCENT;
      cashbackValue = CASHBACK.TEN_PERCENT * value;
    } else if (value > 1000 && value <= 1500) {
      cashbackPercentage = CASHBACK.FIFTHEEN_PERCENT;
      cashbackValue = CASHBACK.FIFTHEEN_PERCENT * value;
    } else {
      cashbackPercentage = CASHBACK.TWENTY_PERCENT;
      cashbackValue = CASHBACK.TWENTY_PERCENT * value;
    }

    const fixedValue = Number(cashbackValue.toFixed(2));

    const params = {
      uid: uuid(),
      value: fixedValue,
      percentage: cashbackPercentage,
      purchaseUid,
    };

    const response = await cashbackRepository.create(params);
    return response;
  } catch (error) {
    return 'Error trying to create cashback';
  }
};

const get = async (input) => {
  try {
    const { purchaseUid } = input;

    const whereParams = {
      purchaseUid,
    };
    const response = await cashbackRepository.get(whereParams);
    return response;
  } catch (error) {
    return 'Error trying to get cashback';
  }
};

const getMany = async (input) => {
  try {
    const { purchaseUids } = input;
    const whereParams = {
      purchaseUid: purchaseUids,
    };
    const response = await cashbackRepository.get(whereParams);
    return response;
  } catch (error) {
    return 'Error trying to get many cashbacks';
  }
};

module.exports = {
  create,
  get,
  getMany,
};
