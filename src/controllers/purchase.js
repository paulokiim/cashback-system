const purchaseBO = require('../core/business-operation/purchase');

const create = async (req, res) => {
  const body = req.body;

  try {
    const response = await purchaseBO.create(body);

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro Interno');
  }
};

const edit = async (req, res) => {
  const body = req.body;

  try {
    const response = await purchaseBO.edit(body);

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro Interno');
  }
};

const remove = async (req, res) => {
  const body = req.body;

  try {
    const response = await purchaseBO.remove(body);

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro Interno');
  }
};

const getAll = async (req, res) => {
  const body = req.body;

  try {
    const response = await purchaseBO.getAll(body);

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro Interno');
  }
};

module.exports = {
  create,
  edit,
  remove,
  getAll,
};
