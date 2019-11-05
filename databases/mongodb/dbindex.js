const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

// opens a connection to the stay7omewhere_reservations database
mongoose.connect('mongodb://localhost/stay7omewhere_reservations', { useNewUrlParser: true });

// get notification once the connection occurs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`We're connected to mongoose!`)
});

// Mongoose creates ids for each document in a model.  No need to create them

let usersSchema = mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
})

let bookingsSchema = mongoose.Schema({
    bUser_ID: {
        type: Number,
        required: true
    }, // references userID for each Users document
    bGuest_Total: {
        type: Number,
        required: true
    },
    bCheckin_Date: {
        type: Date,
        required: true
    },
    bCheckout_Date: {
        type: Date,
        required: true
    }
});

let roomsSchema = mongoose.Schema({
    rID: {
        type: Number,
        required: true
    },
    rMax_guests: {
        type: Number,
        default: 2
    },
    rNightly_price: {
        type: Number,
        default: 75
    },
    rCleaning_fee: {
        type: Number,
        default: 15
    },
    rService_fee: {
        type: Number,
        default: .13
    },
    rTaxes_fees: {
        type: {},
        default: null
    },
    rBulkDiscount: {
        type: {},
        default: null
    },
    rRequired_Week_Booking_Days: {
        type: Number,
        default: 2
    },
    rRating: {
        type: Number,
        default: 5
    },
    rReviews: {
        type: Number,
        default: 0
    },
    rBookings: {
        type: [bookingsSchema], // each Bookings doc will be a subdocument of a Rooms doc
        default: []
    }
});

let saveCsvDataToModels = function (Model, csvFile, handler, callback) {
    //Clear the user model on server restart to reset after testing
    Model.deleteMany({})
      .then(results => {
        console.log(`Cleared the model`);

        //create a read stream to the appropriate csv
        fs.createReadStream(path.resolve(__dirname, '../data', csvFile))
          .pipe(csv.parse({ headers: true }))
          .on('data', row => {
            if (handler) {
              handler(row, (err) => {
                if (err) {
                  console.log(`Error updating model row: `, err)
                }
              })
            } else {
              Model.create(row, (err) => {
                if (err) {
                  console.log(`Error saving model row: `, err)
                } 
              });
            }
        })
      })
      .then(callback)
      .catch(err => console.log(`Error clearing the model: `, err));
}

// Create User, Rooms, and Bookings models from their schemas
const User = mongoose.model('User', usersSchema);
const Rooms = mongoose.model('Rooms', roomsSchema);
const Bookings = mongoose.model('Bookings', bookingsSchema);

// Create Bookings subdocuments to save in Rooms.rBookings
// data paramter: the specific {row} from the csv with the bookings shape
const subDocumentHandler = function(data, callback) {
  // Get the bookingId
  let query = data.bProperty_ID
  // Create the update object to push into the Rooms.rBookings array
  let update = {
      $push: {rBookings: {
          bUser_ID: data.bUser_ID,
          bGuest_Total: data.bGuest_Total,
          bCheckin_Date: data.bCheckin_Date,
          bCheckout_Date: data.bCheckout_Date
      }}
  }
  // Find the rooms Model with that query bID and update with bUser_ID, bGuest_Total, bCheckin_Date, bCheckout_Date
  Rooms.findOneAndUpdate(query, update, callback);
}


saveCsvDataToModels(User, 'users.csv', null,  () => {
  saveCsvDataToModels(Rooms, 'rooms.csv', null,  () => {
    saveCsvDataToModels(Bookings, 'bookings.csv', subDocumentHandler,  () => console.log('saved users and rooms to db.'));
  });
});
