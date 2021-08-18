const dotenv = require('dotenv');
const dbConfigs = require('./database');

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SECRET_TOKEN: process.env.JWT_TOKEN_SECRET,
  DB_CONFIGS: dbConfigs,
};
