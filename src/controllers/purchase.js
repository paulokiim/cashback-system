const purchaseBO = require('../core/business-operation/purchase');
const transactions = require('../utils/transactions');

const create = async (req, res) => {
  const body = req.body;

  try {
    const response = await transactions.startTransaction((transaction) =>
      purchaseBO.create(body, transaction)
    );

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro ao tentar criar compra ou cashback');
  }
};

const edit = async (req, res) => {
  const body = req.body;

  try {
    const response = await transactions.startTransaction((transaction) =>
      purchaseBO.edit(body, transaction)
    );

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro ao tentar atualizar compra ou cashback');
  }
};

const remove = async (req, res) => {
  const body = req.body;

  try {
    const response = await transactions.startTransaction((transaction) =>
      purchaseBO.remove(body, transaction)
    );

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro ao tentar deletar compra ou cashback');
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
