require('newrelic');
const express = require('express');
const app = express();
const path = require('path');
const db = require('../databases/index.js');
const moment = require('moment');
const compression = require('compression');

const port = 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(compression({ filter: shouldCompress }));

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    return false;
  }

  return compression.filter(req, res);
}

app.use(express.json());

// USE '/rooms/:id'
// serves static files
app.use('/rooms/:id', express.static(path.join(__dirname, '../public')));

// GET '/api/rooms/:id'--read property info for one property id
// returns an array with a single object including all property information in the form:
// [{pID, pMax_guests, pNightly_price, pCleaning_fee, pService_fee, pTaxes_fees, pBulkDiscount, pRequired_Week_Booking_Days, pRating, pReviews}]
app.get('/api/rooms/:id', (req, res, next) => {
  let rID = req.params.id;
  db.getListing(rID, (listing) => {
    res.send(listing);
    next();
  });
});

// GET '/api/rooms/:id/bookings'--read booked dates info for one property id
// returns an array of booked dates objects in the form: {bProperty_ID, bUser_ID, bGuest_Total, Date}
app.get('/api/rooms/:id/bookings', (req, res, next) => {
  let bProperty_ID = req.params.id;
  db.getBookings(bProperty_ID, (bookings) => {
    res.send(bookings);
    next();
  });
});

// POST '/api/bookings'--create new bookings for each of the booked dates
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, reserved at, Date}, all required
app.post('/api/bookings', (req, res, next) => {
  // need to make sure the db is checked first
  let booking = req.body.booking;
  //db.Bookings.create(req.body.bookedDates).then(res.send());
  db.getBookings(booking['bProperty_ID'], (bookings) => {
    let bookedDates = new Set();
    for (let i = 0; i < bookings.length; i++) {
      let date = moment(bookings[i].bcheckin_date);
      let bCheckout = moment(bookings[i].bcheckout_date);
      // While the current date is between the checkin and checkout
      while (bCheckout.diff(date, 'days') >= 0){
        bookedDates.add(moment(date.format()).format('YYYY-MM-DD'));
        // After pushing the date to the list, increase the date by 1
        date = date.add(1, 'days');
      }
    }
    if (bookedDates.has(booking['bCheckin_Date']) || bookedDates.has(booking['bCheckout_Date'])) {
      res.status(409).send('The dates are already booked');
    } else {
      db.insertBooking(booking, (results) => {
        res.status(201).send(results);
        next();
      })
    }
  });
});


// PUT '/api/bookings'-- update bookings for a particular row
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, bCheckin, bCheckout}
// returns changed row as an object using the second parameter in 
// app.put('/api/bookings', (req, res, next) => {
//   let req.body.bookingsUpdates;
//   db.Rooms.update(req.body.bookingsUpdates).then().catch()
// })

// DELETE '/api/bookings'-- delete bookings for a particular booking date row
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, Date}
// app.delete('/api/bookings', (req, res, next) => {
//   let req.body.bookingsDeletion;
//   db.Rooms.update(req.body.bookingsDeletion).then().catch()
// });

app.listen(port, () => console.log('Now listening on port', port));
