var mongoose = require('mongoose');

// opens a connection to the stay7omewhere_reservations database
mongoose.connect('mongodb://localhost/stay7omewhere_reservations', {useMongoClient: true});

// get notification once the connection occurs
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`We're connected to mongoose!`)
});

// Mongoose creates ids for each document in a model.  No need to create them

let usersSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
})

let bookingsSchema = mongoose.Schema({
    bUser_ID: Number, // references Mongoose created id for each Users document
    bGuest_Total: Number,
    bDates: [Date]
});

let roomsSchema = mongoose.Schema({
    rMax_guests: Number,
    rNightly_price: Number,
    rCleaning_fee: Number,
    rService_fee: Number,
    rTaxes_fees: Number,
    rBulkDiscount: Number,
    rRequired_Week_Booking_Days: Number,
    rRating: Number,
    rReviews: Number,
    rBookings: [bookingsSchema] // each Bookings doc will be a subdocument of a Rooms doc
})
