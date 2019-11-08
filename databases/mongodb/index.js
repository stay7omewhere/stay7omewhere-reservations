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

let usersSchema = mongoose.Schema({
  userID: Number,
  username: String,
})

let bookingsSchema = mongoose.Schema({
  bID: Number,
  bProperty_ID: Number,
  bUser_ID: Number,
  bGuest_Total: Number,
  bCheckin_Date: Date,
  bCheckout_Date: Date,
  bHeld_At: Date,
  bReserved: {
    type: Boolean,
    default: false
  }
});
  
let roomsSchema = mongoose.Schema({
  rId: Number,
  rMax_guests: Number,
  rNightly_price: Number,
  rCleaning_fee: Number,
  rService_fee: Number,
  rTaxes_fees: {
    type: {},
    default: null
  },
  rBulkDiscount: {
    type: {},
    default: null
  },
  rRequired_Week_Booking_Days: Number,
  rRating: Number,
  rReviews: Number,
  rBookings: {
    type: [mongoose.Schema.Types.ObjectId], // each Bookings doc will be a subdocument of a Rooms doc
    default: []
  }
});

// Create User, Rooms, and Bookings models from their schemas
module.exports = {
  Users: mongoose.model('Users', usersSchema),
  Rooms: mongoose.model('Rooms', roomsSchema),
  Bookings: mongoose.model('Bookings', bookingsSchema)
}
