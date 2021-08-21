const cashbackService = require('../services/boticario-cashback');

const get = async (req, res) => {
  try {
    const { documentNumber } = req.body;
    const response = await cashbackService.getCashback(documentNumber);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send('Erro na api externa');
  }
};

module.exports = {
  get,
};
