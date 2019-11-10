const { Pool, Client } = require('pg')

const pool = new Pool({
  user: process.env.USER,
  host: 'localhost',
  database: 'stay7omewhere_reservations',
  password: null,
  port: 5432,
})

const getListing = (id, callback) => {
  const text = 'select * from rooms where rID = $1';
  const values = [id];

  pool
    .query(text, values)
    .then(res => {
      callback(res.rows[0]);
    })
    .catch(e => console.error(e.stack));
}

const getBookings = (id, callback) => {
  const text = 'select * from bookings where bProperty_ID = $1';
  const values = [id];

  pool
    .query(text, values)
    .then(res => {
    callback(res.rows);
    })
    .catch(e => console.error(e.stack));
}

const insertBooking = (booking, callback) => {
  const text = `INSERT INTO bookings (bID, bProperty_ID, bUser_ID, bGuest_Total, bCheckin_Date, bCheckout_Date, bHeld_At)
    VALUES (default, $1, $2, $3, $4, $5, $6) `;
  const values = [
    booking['bProperty_ID'],
    booking['bUser_ID'],
    booking['bGuest_Total'],
    booking['bCheckin_Date'],
    booking['bCheckout_Date'],
    booking['bHeld_At']
  ];

  pool
    .query(text, values)
    .then(res => {
      console.log(res.rows);
      callback(res.rows);
    })
    .catch(e => console.error(e.stack));
}



module.exports = {
  getListing,
  getBookings,
  insertBooking
}

// getListing(9990900);