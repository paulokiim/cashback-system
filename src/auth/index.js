const jwt = require('jsonwebtoken');
const { SECRET_TOKEN } = require('../config');

const checkAuthentication = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided' });
  try {
    const verifiedJWT = jwt.verify(token, SECRET_TOKEN);

    if (!verifiedJWT) {
      return res
        .status(500)
        .send({ auth: false, message: 'Token not verified' });
    }

    req.body.documentNumber = verifiedJWT.data;
    next();
  } catch (error) {
    return res.status(500).send({ auth: false, message: 'Token expired' });
  }
};

const createJWTToken = (data) =>
  jwt.sign({ data }, SECRET_TOKEN, {
    expiresIn: '1800s',
  });

module.exports = {
  checkAuthentication,
  createJWTToken,
};
