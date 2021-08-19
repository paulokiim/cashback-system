const axios = require('axios');

const { EXTERNAL_API, EXTERNAL_API_TOKEN } = require('../config');

const cashbackService = async (documentNumber) => {
  const response = await axios.get(`${EXTERNAL_API}/cashback`, {
    params: { cpf: documentNumber },
    headers: { token: EXTERNAL_API_TOKEN },
  });

  if (response.status === 400) {
    return 'Error';
  }
  const { data } = response;

  return { status: data.statusCode, data: data.body };
};

module.exports = cashbackService;
