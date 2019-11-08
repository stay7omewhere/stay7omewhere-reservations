const mongoose = require('mongoose');

const dbhelpers = require('./dbhelpers.js')

// opens a connection to the stay7omewhere_reservations database
mongoose.connect('mongodb://localhost/stay7omewhere_reservations', { useNewUrlParser: true, useUnifiedTopology: true })

// get notification once the connection occurs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`We're connected to mongoose!`)
});

// Mongoose creates ids for each document in a model.  No need to create them.

let usersSchema = mongoose.Schema({
    _id: {
        type: String,
        // unique: true,
        // required: true
    },
    username: {
        type: String,
        // unique: true,
        // required: true
    },
})

let bookingsSchema = mongoose.Schema({
  _id:{
    type: Number,
    // required: true
  },
  bProperty_ID: {
    type: Number,
    // required: true
  },
  bUser_ID: {
    type: Number,
    // required: true
  },
  bGuest_Total: {
    type: Number,
    // required: true
  },
  bCheckin_Date: {
    type: Date,
    // required: true
  },
  bCheckout_Date: {
    type: Date,
    // required: true
  },
  bHeld_At: {
    type: Date,
  },
  bReserved: {
    type: Boolean,
    default: false
  }
});

let roomsSchema = mongoose.Schema({
  _id: {
    type: Number,
    // required: true
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
    type: [Number], // each Bookings doc will be a subdocument of a Rooms doc
    default: []
  }
});

// Create User, Rooms, and Bookings models from their schemas
const User = mongoose.model('User', usersSchema);
const Rooms = mongoose.model('Rooms', roomsSchema);
const Bookings = mongoose.model('Bookings', bookingsSchema);

//Clear the user model on server restart to reset after testing
User.deleteMany({})
  .then(Rooms.deleteMany({}))
  .then(Bookings.deleteMany({}))
  .then(() => {
    dbhelpers.saveCsvDataToModels(User, 'users.csv',  () => {
      console.log('saved users to db');
      dbhelpers.saveCsvDataToModels(Rooms, 'rooms.csv',  () => {
        console.log('saved rooms to db');
        dbhelpers.bulkUpdateBookings(Bookings, Rooms, 'bookings1.csv',  () => {
          console.log('saved bookings1 to db.');
          dbhelpers.bulkUpdateBookings(Bookings, Rooms, 'bookings2.csv',  () => {
            console.log('saved bookings2 to db.');
  //         //   dbhelpers.bulkUpdateBookings(Bookings, Rooms, 'bookings3.csv',  () => {
  //         //     console.log('saved bookings3 to db.');
  //         //     dbhelpers.bulkUpdateBookings(Bookings, Rooms, 'bookings4.csv',  () => {
  //         //       console.log('saved bookings4 to db.');
  //         //       dbhelpers.bulkUpdateBookings(Bookings, Rooms, 'bookings5.csv',  () => {
  //         //         console.log('saved bookings5 to db.')
  //         //       });
  //         //     });
  //         //   });
  //         });
  //       // });
  //     // });
  //   // });
  // // })
  // // .catch(err => console.log(`Error clearing the model: `, err));

