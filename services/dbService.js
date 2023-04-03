const { Pool } = require('pg');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: '1234',
  port: 5432,
};

const pool = new Pool(dbConfig);

function connect() {
  return pool.connect()
    .then(client => {
      console.log('Connected to database');
      return client;
    })
    .catch(err => console.error('Error connecting to database', err));
}


module.exports = {
  connect:connect,
  query: (text, params) => pool.query(text, params),
};
