const { Pool, Client } = require('pg')

const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  database: 'stay7omewhere_reservations',
  password: null,
  port: 5432,
})

const getListing = (id) => {
  const text = 'select * from rooms where rID = $1';
  const values = [id];

  pool
    .query(text, values)
    .then(res => {
        console.log(res.rows[0])
    })
    .catch(e => console.error(e.stack));
}

getListing(9990900);