require('dotenv').config();
const client = process.env.DB_CLIENT || 'better-sqlite3';
// To migrate to MySQL/PostgreSQL: set DB_CLIENT=mysql2|pg, add DB_URL, install the driver. No other code changes.
module.exports = {
  client,
  connection: client === 'better-sqlite3' ? { filename: process.env.DB_FILE || './data/smimran.sqlite' } : process.env.DB_URL,
  useNullAsDefault: true,
  migrations: { directory: './src/db/migrations' },
};
