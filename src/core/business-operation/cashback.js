const uuid = require('uuid').v4;

const cashbackRepository = require('../repository/cashback');
const CASHBACK = require('../../enums/cashback-percentages');

const getCashbackParams = (value) => {
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

  return {
    cashbackValue: fixedValue,
    cashbackPercentage,
  };
};

const create = async (input) => {
  try {
    const { value, purchaseUid } = input;

    const { cashbackValue, cashbackPercentage } = getCashbackParams(value);

    const params = {
      uid: uuid(),
      value: cashbackValue,
      percentage: cashbackPercentage,
      purchaseUid,
    };

    const response = await cashbackRepository.create(params);
    return response;
  } catch (error) {
    return 'Error trying to create cashback';
  }
};

const edit = async (purchaseUid, value) => {
  try {
    const whereParams = {
      purchaseUid,
    };
    const { cashbackValue, cashbackPercentage } = getCashbackParams(value);
    const updateParams = {
      value: cashbackValue,
      percentage: cashbackPercentage,
    };
    const [_, [updatedCashback]] = await cashbackRepository.update(
      updateParams,
      whereParams
    );
    return updatedCashback;
  } catch (error) {
    return 'Error trying to edit cashback';
  }
};

const get = async (purchaseUid) => {
  try {
    const whereParams = {
      purchaseUid,
    };
    const response = await cashbackRepository.get(whereParams);
    return response;
  } catch (error) {
    return 'Error trying to get many cashbacks';
  }
};

const getMany = async (purchaseUids) => {
  try {
    const whereParams = {
      purchaseUid: purchaseUids,
    };
    const response = await cashbackRepository.getAll(whereParams);
    return response;
  } catch (error) {
    return 'Error trying to get many cashbacks';
  }
};

module.exports = {
  create,
  edit,
  get,
  getMany,
};
