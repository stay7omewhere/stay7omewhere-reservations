const faker = require('faker');
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const seed = require('./seedHelpers.js')

const writeUsers = fs.createWriteStream(path.resolve(__dirname, 'data', 'users.csv'));
writeUsers.write('userID,username\n', 'utf8');

function writeTenMillionUsers(writer, encoding, callback) {
  let i = 100; //10000000;
  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      const username = faker.internet.userName();
      const data = `${id},${username}\n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
    // see if we should continue, or wait
    // don't pass the callback, because we're not done yet.
       ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
      if (i > 0) {
    // had to stop early!
    // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
}

writeTenMillionUsers(writeUsers, 'utf-8', () => {
  writeUsers.end();
});

const writeRooms = fs.createWriteStream(path.resolve(__dirname, 'data', 'rooms.csv'));
writeRooms.write('rID,rMax_guests,rNightly_price,rCleaning_fee,rService_fee,rTaxes_fees,rBulkDiscount,rRequired_Week_Booking_Days,rRating,rReviews\n', 'utf8');

function writeTenMillionRooms(writer, encoding, callback) {
  let i = 100; //10000000;
  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      let rMax_guests = seed.getRandomInt(4,13);
      let rNightly_price = seed.getRandomInt(89, 326);
      let rCleaning_fee = seed.getRandomInt(35,81); 
      let rService_fee = 0.13;  //13% pNightly_price + pCleaning_Fee
      let rTaxes_fees = seed.shouldBeDisplayed(seed.getRandomInt(3,10));
      let rBulkDiscount = seed.shouldBeDisplayed(0.05);
      let rRequired_Week_Booking_Days = seed.getRandomInt(3,8); 
      let rRating = Math.floor(Math.random() * (500 - 100) + 100) / 100;
      let rReviews = seed.getRandomInt(5,2750);
      let data = `${id},${rMax_guests},${rNightly_price},${rCleaning_fee},${rService_fee},${rTaxes_fees},${rBulkDiscount},${rRequired_Week_Booking_Days},${rRating},${rReviews}\n`;
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
    // see if we should continue, or wait
    // don't pass the callback, because we're not done yet.
       ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
      if (i > 0) {
      // had to stop early!
      // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
}
  
writeTenMillionRooms(writeRooms, 'utf-8', () => {
  writeRooms.end();
});

const writeBookings = fs.createWriteStream(path.resolve(__dirname, 'data', 'bookings.csv'));
writeBookings.write('bID,bProperty_ID,bUser_ID,bGuest_Total,bCheckin_Date,bCheckout_Date\n', 'utf8');

function writeTenMillionBookings(writer, encoding, callback) {
  let k = 100; //10000000;
  let id = 0;
  let startDate = moment().format(); // Gets the current date and time YYYY-MM-DDT##:##:-##:##
  let endMoment = moment().endOf('month');
  let endDate = endMoment.format(); // Gets last day of the month in form ^
  
  function write() {
    let ok = true;

    do {
      k -= 1;

      for (let i = 0; i < 4; i++) {
        let generatedDates = new Set();
        let bookingsPerMonth = seed.getRandomInt(3, 11);

        for (let j = 0; j < bookingsPerMonth; j++) { //iterates through the random bookings count
          let checkinMoment = moment(faker.date.between(startDate, endDate))//.format('YYYY-MM-DD');
          let randomStay = seed.getRandomInt(2, 7);
          let checkoutMoment = checkinMoment.add(randomStay, 'days')//.format('YYYY-MM-DD');
          if (moment.max(checkoutMoment, endMoment) === checkinMoment) {
            checkoutMoment = endMoment;
          }
        let checkin = checkinMoment.format('YYYY-MM-DD');
        let checkout = checkoutMoment.format('YYYY-MM-DD');

        if ( !( generatedDates.has(checkin) || generatedDates.has(checkout) ) ) {
            id += 1;
            let stayLength = checkoutMoment.diff(checkinMoment, 'days');
            
            for (let l = 0; l <= stayLength; l++) {
              let date = checkinMoment.add(l, 'days').format('YYYY-MM-DD');
              generatedDates.add(date);
            }
            let bProperty_ID = k + 1;
            let bUser_ID = Math.ceil(Math.random() * 10000000);
            let bGuest_Total = seed.getRandomInt(3, 11);
            let data = `${id},${bProperty_ID},${bUser_ID},${bGuest_Total},${checkin},${checkout}\n`;
            
            if (k === 0) {
              writer.write(data, encoding, callback);
            } else {
              // see if we should continue, or wait
              // don't pass the callback, because we're not done yet.
              ok = writer.write(data, encoding);
            }
          }
        }
        startDate = moment().startOf('month').add(i + 1, 'months').format();
        endMoment = moment().endOf('month').add(i + 1, 'months')
        endDate = endMoment.format();
      }
    } while (k > 0 && ok);
      if (k > 0) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
}

writeTenMillionBookings(writeBookings, 'utf-8', () => {
  writeBookings.end();
});

// const gzip = zlib.createGzip();
// const inp = fs.createReadStream('users.csv');
// const out = fs.createWriteStream('users.csv.gz');
  
// inp.pipe(gzip)
//   .on('error', () => {
//     // handle error
//   })
//   .pipe(out)
//   .on('error', () => {
//     // handle error
//   });