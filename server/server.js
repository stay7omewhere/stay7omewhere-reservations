const express = require('express');
const app = express();
const path = require('path');
const db = require('./data/db.js');
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
app.use('/:id', express.static(path.join(__dirname, '../public')));

// GET '/api/listings/:id'--read property info for one property id
// returns an array with a single object including all property information in the form:
// [{pID, pMax_guests, pNightly_price, pCleaning_fee, pService_fee, pTaxes_fees, pBulkDiscount, pRequired_Week_Booking_Days, pRating, pReviews}]
app.get('/id/:id', (req, res, next) => {
  let pID = req.params.id;
  db.Properties.findAll( {
    where: {
      pID
    }
  }).then(property => {
    res.send(property);
    next();
  });
});

// GET '/api/listings/:id/bookings'--read booked dates info for one property id
// returns an array of booked dates objects in the form: {bProperty_ID, bUser_ID, bGuest_Total, Date}
app.get('/BookedDates/:bookedDates', (req, res, next) => {
  let bProperty_ID = req.params.bookedDates;
  db.Booked.findAll( {
    where: {
      bProperty_ID
    }
  }).then(property => {
    res.send(property);
    next();
  });
});

// POST '/api/bookings'--create new bookings for each of the booked dates
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, Date}, all required
app.post('/BookedDates', (req, res, next) => {
  var promises = [];
  let bookedDates = req.body.bookedDates;
  for (let i = 0; i < bookedDates.length; i++) {
    promises.push(db.Booked.create({bProperty_ID: bookedDates[i].bProperty_ID, bUser_ID: bookedDates[i].bUser_ID, bGuest_Total: bookedDates[i].bGuest_Total, Date: bookedDates[i].Date}));
  }
  Promise.all(promises);
})

// PUT '/api/bookings'-- update bookings for a particular row
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, Date}
// returns changed row as an object using the second parameter in 
// app.put('/api/bookings', (req, res, next) => {
//   let req.body.bookingsUpdates;
//   db.Properties.update(req.body.bookingsUpdates).then().catch()
// })

// DELETE '/api/bookings'-- delete bookings for a particular booking date row
// request body is JSON: {bProperty_ID, bUser_ID, bGuest_Total, Date}
// app.put('/api/bookings', (req, res, next) => {
//   let req.body.bookingsDeletion;
//   db.Properties.update(req.body.bookingsDeletion).then().catch()
// })

app.listen(3000);
