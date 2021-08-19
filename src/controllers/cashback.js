const cashbackService = require('../services/boticario-cashback');

const get = async (req, res) => {
  try {
    const body = req.body;
    const response = await cashbackService(body);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {
  get,
};
