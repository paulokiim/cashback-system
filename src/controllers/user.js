const userBO = require('../core/business-operation/user');

const register = async (req, res) => {
  const body = req.body;

  try {
    const response = await userBO.register(body);

    return res.status(response.status).send(response);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .send({ status: 400, data: { message: 'Email já cadastrado' } });
    }
    return res.status(500).send('Erro Interno');
  }
};

const login = async (req, res) => {
  const body = req.body;

  try {
    const response = await userBO.login(body);

    return res.status(response.status).send(response);
  } catch (error) {
    return res.status(500).send('Erro Interno');
  }
};

module.exports = {
  register,
  login,
};
