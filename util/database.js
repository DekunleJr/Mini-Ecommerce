const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.NODE_ENV === 'test' ? 'sqlite::memory:' : process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.NODE_ENV === 'test' ? undefined : process.env.DB_HOST,
    dialect: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres',
    logging: process.env.NODE_ENV === 'test' ? false : console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

module.exports = sequelize;