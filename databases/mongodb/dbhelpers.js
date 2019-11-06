const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

const dbhelpers = {
  findOneRoomAndUpdate: function(Model, rID, rBookings, callback) {
    Model.findOneAndUpdate({ rID }, { rBookings }, (err) => {       
      if (err) {
        console.log(`Error updating roomListing: `, err);
      } else {
        console.log('saved all bookings for ', rID);
        if (callback) {
          callback();
        }
      }
    }).lean();
  },
  saveCsvDataToModels: function (Model, csvFile, callback) {
    //Clear the user model on server restart to reset after testing
    Model.deleteMany({})
      .then(() => {
        //create a read stream to the appropriate csv
        fs.createReadStream(path.resolve(__dirname, '../data', csvFile))

          .pipe(csv.parse({ headers: true }))
          .on('data', row => {

            Model.create(row, (err) => {
              if (err) {
                console.log(`Error saving model row: `, err)
              } 
            });

          })
          .on('end', callback)

      })

      .catch(err => console.log(`Error clearing the model: `, err));

  },
  bulkUpdateBookings: function (Model, Parent, csvFile, callback) {
    let currentRoomID;
    let currentRoomBookings = [];
    
    //create a read stream to the appropriate csv
    fs.createReadStream(path.resolve(__dirname, '../data', csvFile))

      .pipe(csv.parse({ headers: true }))
      .on('error', (err) => console.log('Readstream error: ', err))
      .on('data', row => {
        // if the currentRoomID is still undefined or the the bProperty_ID is not the currentRoomID
        currentRoomID = currentRoomID || row.bProperty_ID;
        // If the row's bProperty_ID no londer matches the currentRoomID
        //   Find the document with the rID to match the currentRoomId, 
        //   write all of the currentRoomBookings to the db
        if (row.bProperty_ID !== currentRoomID) {
          dbhelpers.findOneRoomAndUpdate(Parent, currentRoomID, currentRoomBookings)
          currentRoomBookings = [];
        }

        currentRoomID = row.bProperty_ID; // save currentRoomID
        currentRoomBookings.push(row); // push current booking to currentRoomBookings
        
      })
      .on('end', () => { 
          dbhelpers.findOneRoomAndUpdate(Parent, currentRoomID, currentRoomBookings, callback) 
      });
  }
};

module.exports = dbhelpers;