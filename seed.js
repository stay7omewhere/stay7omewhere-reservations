const faker = require('faker');
const moment = require('moment');
moment().format();

const Promise = require('bluebird');
const db = require('./server/data/db.js');

//min to [max]
function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max-min));
}

var shouldBeDisplayed = function(value) {
  if(getRandomInt(0,2)) {
    return value; //random between 3-9   RANDOM WHETHER IT WILL SHOW UP OR NOT NULL
  } else {
    return null;
  }
}

var populateBookedDates = function(bUser_ID) {
  var startDate = moment().format(); // Gets the current date and time YYYY-MM-DDT##:##:-##:##
  var endDate   = moment().endOf('month').format(); // Gets last day of the month in form ^
  var bookedDates = [];
  for (let k = 1; k<= 100; k++) { //iterates through all 100 users
    for (let i = 0; i < 4; i++) { //iterates through 4 months
      var generatedDates = new Set();
      var bookedDatesPerMonth = getRandomInt(3, 11); 
      for (let j = 0; j < bookedDatesPerMonth; j++) { //iterates through the random bookings count
        var date = moment(faker.date.between(startDate, endDate)).format('YYYY-MM-DD');
        if(generatedDates.has(date)) {
          while(generatedDates.has(date)) {
            date = moment(faker.date.between(startDate, endDate)).format('YYYY-MM-DD');
          }
        }
        generatedDates.add(date);
        bookedDates.push({bProperty_ID: k, bUser_ID: bUser_ID, Date: date});
        console.log(bookedDates[j]);
      }
      startDate = moment().startOf('month').add(i + 1, 'months').format();
      endDate   = moment().endOf('month').add(i + 1, 'months').format();
    }
  }
  db.Booked.bulkCreate(bookedDates);
}


//users
var username = faker.name.findName();
db.Users.create({ username: username }).catch(err => console.log(err));

//booked
var records = [];
for (let i = 1; i <= 100; i++) {

  var rMax_guests = getRandomInt(4,13);
  var rNightly_price = getRandomInt(89, 326);
  var rCleaning_fee = getRandomInt(35,81); 
  var rService_fee = 0.13;  //13% pNightly_price + pCleaning_Fee
  
  var rTaxes_fees = shouldBeDisplayed(getRandomInt(3,10));
  var rBulkDiscount = shouldBeDisplayed(0.05);
  

  var rRequired_Week_Booking_Days = getRandomInt(3,8); 
  var rRating = Math.floor(Math.random() * (500 - 100) + 100) / 100;
  var rReviews = getRandomInt(5,2750);

  records.push({ rMax_guests: rMax_guests,
    rNightly_price: rNightly_price,
    rCleaning_fee: rCleaning_fee,
    rService_fee: rService_fee,
    rTaxes_fees: rTaxes_fees,
    rBulkDiscount: rBulkDiscount,
    rRequired_Week_Booking_Days: rRequired_Week_Booking_Days,
    rRating: rRating,
    rReviews: rReviews});
}

db.Rooms.bulkCreate(records).then(() => populateBookedDates(1));