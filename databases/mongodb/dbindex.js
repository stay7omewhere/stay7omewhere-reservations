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
    rTaxes_fees: Number,
    rBulkDiscount: Number,
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
    rBookings: [bookingsSchema] // each Bookings doc will be a subdocument of a Rooms doc
})
