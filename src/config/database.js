const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  dialect: process.env.DB_DIALECT,
  username: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
};
