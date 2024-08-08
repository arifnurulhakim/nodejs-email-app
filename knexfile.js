// knexfile.js
require('dotenv').config();

const dbPrefix = process.env.DB_PREFIX || '';

module.exports = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  useNullAsDefault: true
};
