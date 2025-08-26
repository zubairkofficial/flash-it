require('dotenv').config();

const mustString = (v) => (v === undefined || v === null) ? '' : String(v);

module.exports = {
  development: {
    username: mustString(process.env.DB_USER || 'postgres'),
    password: mustString(process.env.DB_PASSWORD || ''), // ensure a string
    database: mustString(process.env.DB_NAME || 'flash_it_dev'),
    host: mustString(process.env.DB_HOST || '127.0.0.1'),
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
     },
};
