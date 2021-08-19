const dotenv = require('dotenv');
const dbConfigs = require('./database');

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SECRET_TOKEN: process.env.JWT_TOKEN_SECRET,
  EXTERNAL_API: process.env.EXTERNAL_API,
  EXTERNAL_API_TOKEN: process.env.EXTERNAL_API_TOKEN,
  DB_CONFIGS: dbConfigs,
};
