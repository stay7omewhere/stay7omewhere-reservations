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

app.use('/:id', express.static(path.join(__dirname, '../public')));

// GET --read property info for one property id
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

// GET --read booked dates info for one property id
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

// POST --create new bookings for each of the booked dates
app.post('/BookedDates', (req, res, next) => {
  var promises = [];
  let bookedDates = req.body.bookedDates;
  for (let i = 0; i < bookedDates.length; i++) {
    promises.push(db.Booked.create({bProperty_ID: bookedDates[i].bProperty_ID, bUser_ID: bookedDates[i].bUser_ID, bGuest_Total: bookedDates[i].bGuest_Total, Date: bookedDates[i].Date}));
  }
  Promise.all(promises);
})

// app.put('/id/:id', (req, res, next) => {
//   let req.body.propertyUpdates;
//   db.Properties.update(re.body.propertyUpdates)
// })


app.listen(3000);
