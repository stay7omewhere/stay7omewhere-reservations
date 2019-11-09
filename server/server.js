const express = require('express');
const app = express();
const path = require('path');
const db = require('../databases/index.js');
const compression = require('compression')

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
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, Date}, all required
app.post('/BookedDates', (req, res, next) => {
  // need to make sure the db is checked first
  db.Bookings.create(req.body.bookedDates).then(res.send());
  // var promises = [];
  // let bookedDates = req.body.bookedDates;
  // for (let i = 0; i < bookedDates.length; i++) {
  //   promises.push(db.Bookings.create(
  //     {
  //       bProperty_ID: bookedDates[i].bProperty_ID,
  //       bUser_ID: bookedDates[i].bUser_ID,
  //       bGuest_Total: bookedDates[i].bGuest_Total,
  //       bCheckin_Date: bookedDates[i].bCheckin_Date,
  //       bCheckout_Date: bookedDates[i].bCheckout_Date
  //     }
  //   ));
  // }
  // Promise.all(promises);
})

// PUT '/api/bookings'-- update bookings for a particular row
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, bCheckin, bCheckout}
// returns changed row as an object using the second parameter in 
// app.put('/api/bookings', (req, res, next) => {
//   let req.body.bookingsUpdates;
//   db.Rooms.update(req.body.bookingsUpdates).then().catch()
// })

// DELETE '/api/bookings'-- delete bookings for a particular booking date row
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, Date}
// app.put('/api/bookings', (req, res, next) => {
//   let req.body.bookingsDeletion;
//   db.Rooms.update(req.body.bookingsDeletion).then().catch()
// })

app.listen(3000);
