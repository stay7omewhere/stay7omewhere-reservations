const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

const dbhelpers = {
  findOneRoomAndUpdate: function(Model, rID, rBookings, callback = () => {}) {
    Model.findOneAndUpdate({ rID }, { rBookings }, {useFindAndModify: false}, (err) => {       
      if (err) {
        console.log(`Error updating roomListing: `, err);
      } else {
        callback();
      }
    }).lean();
  },

  bulkInsert: function(Model, records, callback = () => {}) {
    Model.insertMany(records, (err, docs) => {
      if (err) {
        console.log(`Error saving model row: `, err)
      } else {
        callback();
      }
    });
  },

  userRecordFormatter: function(row) {
    return {
      _id: row.userID,
      username: row.username
    }
  },

  roomRecordFormatter: function(row) {
    return {
      _id: row.rID,
      rMax_guests: row.rMax_guests,
      rNightly_price: row.rNightly_price,
      rCleaning_fee: row.rCleaning_fee,
      rService_fee: row.rService_fee,
      rTaxes_fees: row.rTaxes_fees,
      rBulkDiscount: row.rBulkDiscount,
      rRequired_Week_Booking_Days: row.rRequired_Week_Booking_Days,
      rRating: row.rRating,
      rReviews: row.rReviews,
      rBookings: row.rBookings
    }
  },

  bookingRecordFormatter: function(row) {
    return {
      _id: row.bID,
      bProperty_ID: row.bProperty_ID,
      bUser_ID: row.bUser_ID,
      bGuest_Total: row.bGuest_Total,
      bCheckin_Date: row.bCheckin_Date,
      bCheckout_Date: row.bCheckout_Date,
      bHeld_At: row.bHeld_At,
      bReserved: row.bReserved
    }
  },

  saveCsvDataToModels: function (Model, csvFile, callback) {
    let records = [];
    //Clear the user model on server restart to reset after testing
    Model.deleteMany({})
      .then(() => {
        //create a read stream to the appropriate csv
        fs.createReadStream(path.resolve(__dirname, '../data', csvFile))
          .pipe(csv.parse({ headers: true }))
          .on('data', row => {
            let record;
            if (Model === 'User'){
              record = dbhelpers.userRecordFormatter(row);
            } else if (Model === 'Rooms') {
              record = dbhelpers.roomRecordFormatter(row);
            } else {
              record = dbhelpers.bookingRecordFormatter(row);
            }
            if (records.length === 1000) { // ***********************************change to 1000
              dbhelpers.bulkInsert(Model, records)
              records = [];
            }
            records.push(row);
          })
          .on('end', () => { dbhelpers.bulkInsert(Model, records, callback) });
      })
      .catch(err => console.log(`Error clearing the model: `, err));
  },

  bulkUpdateBookings: function (Model, Parent, csvFile, callback) {
    let currentRoomID;
    let bookings = [];
    let bookingIDS = [];
    
    //create a read stream to the appropriate csv
    fs.createReadStream(path.resolve(__dirname, '../data', csvFile))
      .pipe(csv.parse({ headers: true }))
      .on('error', (err) => console.log('Readstream error: ', err))
      .on('data', row => {
        let booking = {
          _id: row.bID,
          bProperty_ID: row.bProperty_ID,
          bUser_ID: row.bUser_ID,
          bGuest_Total: row.bGuest_Total,
          bCheckin_Date: row.bCheckin_Date,
          bCheckout_Date: row.bCheckout_Date,
          bHeld_At: row.bHeld_At,
          bReserved: row.bReserved
        }

        // if the currentRoomID is still undefined or the the bProperty_ID is not the currentRoomID
        currentRoomID = currentRoomID || row.bProperty_ID;
        // If the row's bProperty_ID no londer matches the currentRoomID
        //   Find the document with the rID to match the currentRoomId, 
        //   write all of the currentRoomBookings to the db
        if (row.bProperty_ID !== currentRoomID) {
          dbhelpers.findOneRoomAndUpdate(Parent, currentRoomID, bookingIDS)
          bookingIDS = [];
        }
        if (bookings.length === 1000) { // ***********************************change to 1000
          dbhelpers.bulkInsert(Model, bookings)
          bookings = [];
        }

        currentRoomID = row.bProperty_ID; // save currentRoomID
        bookingIDS.push(row.bID);
        bookings.push(booking); // push current booking to bookings
        
      })
      .on('end', () => { 
          dbhelpers.findOneRoomAndUpdate(Parent, currentRoomID, bookingIDS, () => {
            dbhelpers.bulkInsert(Model, bookings, callback);
          });
      });
  }
};

module.exports = dbhelpers;