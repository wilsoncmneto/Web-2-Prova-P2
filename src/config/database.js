'use strict';
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';
const defaultPort = dialect === 'postgres' ? 5432 : 3306;

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || defaultPort),
  dialect,
  logging: false,
};

module.exports = {
  development: baseConfig,
  test: {
    ...baseConfig,
    database: `${process.env.DB_NAME || 'api_p1'}_test`,
  },
  production: baseConfig,
};
