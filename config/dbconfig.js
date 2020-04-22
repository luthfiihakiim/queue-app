//require('dotenv').config();

const pgp = require('pg-promise')();
//const DATABASE_URL = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const db = pgp(process.env.DATABASE_URL)

module.exports = db;
