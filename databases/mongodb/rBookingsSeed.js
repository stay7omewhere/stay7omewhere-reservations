const models = require('./index.js');

let start = new Date();

const findBookings = (bProperty_ID, callback) => {
  // executes, name LIKE john and only selecting the "name" and "friends" fields
  models.Bookings.find({ bProperty_ID }, '_id', (err, docs) => { 
    if (err) {
      console.log(`error finding the documents for${bProperty_ID}: `, err);
    } else {
      if (docs.length > 0) {
        // let getDocs = new Date();
        // console.log('Time to getDocs: ', getDocs - start);
        let bookingIDs = docs.map((doc) => {
          return doc['_id'];
        });
        let end = new Date();
        console.log('Time to end: ', end - start);
        console.log(`booking_ids for${bProperty_ID}: `, bookingIDs);
        
      }
    }
  });
};

//const updateRooms(rID, )
//findBookings(1);
findBookings(10);



