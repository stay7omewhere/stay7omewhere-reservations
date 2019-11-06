const faker = require('faker');
const moment = require('moment');

const seedHelpers = {
  psuedoRandomRoomInfoID: 0,
  userRowFormatter: function(id) {
    const username = faker.internet.userName();
    return `${id},${username}\n`;
  },
  roomRowFormatter: function (id) {
    const pseudos = {
      MaxGuests: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      NightlyPrice: [89, 100, 105, 150, 189, 205, 235, 289, 300, 325],
      CleaningFee: [35, 45, 55, 65, 75, 81, 40, 80, 59, 49],
      TaxesFees: [null, 3, null, 5, null, null, null, null, 8, 10],
      BulkDiscount: [0.05, null, null, null, 0.05, null, null, null, 0.05, null],
      RequiredDays: [3, 3, 3, 4, 4, 5, 5, 6, 7, 3],
      Rating: [2.7, 3.5, 3.6, 3.7, 4.1, 4.5, 4.6, 4.7, 4.8, 4.9],
      Review: [15, 63, 71, 89, 157, 186, 203, 879, 1017, 5203]
    };

    const rMax_guests = pseudos.MaxGuests[seedHelpers.pseudoRandomID];
    const rNightly_price = pseudos.NightlyPrice[seedHelpers.pseudoRandomID];
    const rCleaning_fee = pseudos.CleaningFee[seedHelpers.pseudoRandomID]; 
    const rService_fee = 0.13;  //13% pNightly_price + pCleaning_Fee
    const rTaxes_fees = pseudos.TaxesFees[seedHelpers.pseudoRandomID];
    const rBulkDiscount = pseudos.BulkDiscount[seedHelpers.pseudoRandomID];
    const rRequired_Week_Booking_Days = pseudos.RequiredDays[seedHelpers.pseudoRandomID]; 
    const rRating = pseudos.Rating[seedHelpers.pseudoRandomID];
    const rReviews = pseudos.Review[seedHelpers.pseudoRandomID];
      
    const data = `${id},${rMax_guests},${rNightly_price},${rCleaning_fee},${rService_fee},${rTaxes_fees},${rBulkDiscount},${rRequired_Week_Booking_Days},${rRating},${rReviews}\n`;
    seedHelpers.pseudoRandomID = (seedHelpers.pseudoRandomID === 9) ? 0 : seedHelpers.pseudoRandomID += 1;
    return data;
  },
  verifyDatesInSet: function(set, checkinMoment, checkoutMoment) {
    const stayLength = checkoutMoment.diff(checkinMoment, 'days');
    for (let i = 0; i <= stayLength; i ++) {
      let currentMoment = moment(checkinMoment).add(i, 'days');
      let date = currentMoment.format('YYYY-MM-DD')
      if (set.has(date)) {
        return false; // return false if set has any date in stay
      } else {
        set.add(date);
      }
    }
    return true; // return true if no date showed up in set;
  }
}

module.exports = seedHelpers;