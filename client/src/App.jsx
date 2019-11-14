import React from 'react';
import PropertyDetail from './PropertyDetail';
import Calendar from './Calendar';
import Guests from './Guests';
import Reserve from './Reserve';
import BookingDetail from './BookingDetail';
import GuestsLoading from './GuestsLoading';
import CalendarLoading from './CalendarLoading';
import ReserveLoading from './ReserveLoading';
import styles from '../../public/styles/app.module.css';
const moment = require('moment');
const axios = require('axios');
moment().format();

//add REPORT THIS LISTING
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      propertyInfo: {
        rMax_guests: null, 
        rNightly_price: null, 
        rBulkDiscount: null,
        rCleaning_fee: null,
        rService_fee: null,
        rTaxes_fees: null,
        rRequired_Week_Booking_Days: null, 
        rRating: null, 
        rReviews: null 
      },
      bookingDisplay: [],
      numReservedDates: null,
      totalGuests: 1,
      totalPrice: null,
      totalServiceFee: null,
      totalWeeklyDiscount: null,
      totalAmount: null,
      propertyID: window.location.href.split('/')[4],
      checkinCheckout: [null,null],
    };

    this.getNumReservedDates = this.getNumReservedDates.bind(this);
    this.getTotalGuests = this.getTotalGuests.bind(this);
    this.populateBookingDisplay = this.populateBookingDisplay.bind(this);
    this.getPropertyInfo = this.getPropertyInfo.bind(this);
    this.updateCheckinCheckout = this.updateCheckinCheckout.bind(this);
    this.postBookedDates = this.postBookedDates.bind(this);
  }


  postBookedDates(checkin, checkout, totalGuests) {
    if(checkin && checkout) {
      const bCheckin_Date = moment(checkin).format('YYYY-MM-DD');
      const bCheckout_Date = moment(checkout).format('YYYY-MM-DD');
      let booking = {
        bProperty_ID: this.state.propertyID,
        bUser_ID: 1, //hardcoded to id: 1 right now since login functionality not setup
        bGuest_Total: totalGuests,
        bCheckin_Date,
        bCheckout_Date
      };
      // let bookedDate = moment(checkin).format('YYYY-MM-DD');
      // let bookedDates = [];
      // for(let i = 0; i <= this.state.numReservedDates; i++) {
      //   bookedDates.push({
      //       bProperty_ID: this.state.propertyID,
      //       bUser_ID: 1, //hardcoded to id: 1 right now since login functionality not setup
      //       Date: bookedDate,
      //       bGuest_Total: totalGuests
      //   });
      //   bookedDate = moment(bookedDate).add(1, 'days').format('YYYY-MM-DD');
      // }
      //axios.post('http://localhost:3000/api/bookings', booking)
      // axios.post('/api/bookings', booking)
      axios.post('http://54.183.84.232:3000/api/bookings', booking)
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  getPropertyInfo() {
    // axios.get('http://localhost:3000/api/rooms/' + this.state.propertyID)
    // axios.get('/api/rooms/' + this.state.propertyID)
    axios.get('http://54.183.84.232:3000/api/rooms/' + this.state.propertyID)
      .then((res) => {
        console.log('res data /:id ', res.data)
        let propertyInfo = {
          rMax_guests: res.data['rmax_guests'],
          rNightly_price: res.data['rnightly_price'],
          rBulkDiscount: res.data['rbulkdiscount'],
          rCleaning_fee: res.data['rcleaning_fee'],
          rService_fee: res.data['rservice_fee'],
          rTaxes_fees: res.data['rtaxes_fees'],
          rRequired_Week_Booking_Days: res.data['rrequired_week_booking_days'], 
          rRating: res.data['rrating'], 
          rReviews: res.data['rreviews'] 
        };
        
        // JSON.parse(JSON.stringify(this.state.propertyInfo));
        console.log('property info: ', propertyInfo)
        for(let key in propertyInfo) {
          //data stored as money needs to have the $ sliced out, turn to number
          if(typeof propertyInfo[key] === 'string') {
            propertyInfo[key] = Number(propertyInfo[key].slice(1));
          } 
        }
        console.log('property info after fix: ', propertyInfo)
        this.setState({
          propertyInfo
        });
      })
      .catch((err) => console.log(err));
  }

  populateBookingDisplay() {                              
    let totalPrice = null;
    let totalServiceFee = null;
    let totalWeeklyDiscount = null;
    let totalAmount = null;

    let bookingDisplay = [];
    if(this.state.numReservedDates) {
      totalPrice = this.state.propertyInfo.rNightly_price * this.state.numReservedDates;
      totalServiceFee = this.state.propertyInfo.rService_fee * totalPrice;
      totalWeeklyDiscount = -(totalPrice * this.state.propertyInfo.rBulkDiscount);
      totalAmount = totalPrice + totalServiceFee + totalWeeklyDiscount + 
                    this.state.propertyInfo.rCleaning_fee + this.state.propertyInfo.rTaxes_fees;

      let possibleBookingDisplays = {
              'rNightly_price': [`$${this.state.propertyInfo.rNightly_price} x ${this.state.numReservedDates} nights`, totalPrice], 
              'rBulkDiscount' : [`${100 - (this.state.propertyInfo.rBulkDiscount * 100)}% weekly price discount`, totalWeeklyDiscount],
              'rCleaning_fee' : ['Cleaning Fee', this.state.propertyInfo.rCleaning_fee], 
              'rService_fee'  : ['Service fee', totalServiceFee], 
              'rTaxes_fees'   : ['Occupancy taxes and fees', this.state.propertyInfo.rTaxes_fees] 
            };

      for (let key in this.state.propertyInfo) {
        if (possibleBookingDisplays.hasOwnProperty(key)) {
          bookingDisplay.push( { key: possibleBookingDisplays[key][0], 
                                 value: '$' + Math.trunc(possibleBookingDisplays[key][1]),
                                 id: key});
        }
      }
    }
    this.setState({
      bookingDisplay,
      totalPrice,
      totalServiceFee,
      totalWeeklyDiscount,
      totalAmount
    });
  }

  getNumReservedDates(checkin, checkout) {
    let numReservedDates = null;
    if(checkin && checkout) {
      checkin = moment(checkin);
      checkout = moment(checkout);

      numReservedDates = checkout.diff(checkin, 'days');
    }
    this.setState({
      numReservedDates
    }, this.populateBookingDisplay);
  }

  updateCheckinCheckout(checkin, checkout) {
    let checkinCheckout = [checkin, checkout]
    this.setState({
      checkinCheckout
    });
  }

  getTotalGuests(numAdults, numChildren) {
    const totalGuests = Number(numAdults) + Number(numChildren)
    this.setState({
      totalGuests
    })
    return totalGuests;
  }

  componentDidMount() {
    this.getPropertyInfo();
    console.log('Accessing property: ', window.location.href.split('/')[4]);
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.propertyContainer}>
          <PropertyDetail pricePerNight={this.state.propertyInfo.rNightly_price}
                          starRating={this.state.propertyInfo.rRating}
                          numReviews={this.state.propertyInfo.rReviews}/>
        </div>
        <div className={styles.calendarContainer}>
          {this.state.propertyInfo.rRequired_Week_Booking_Days
            ? <Calendar requiredBookingDays={this.state.propertyInfo.rRequired_Week_Booking_Days}
                        getNumReservedDates={this.getNumReservedDates}
                        propertyID={this.state.propertyID}
                        checkinCheckout={this.state.checkinCheckout}
                        updateCheckinCheckout={this.updateCheckinCheckout}/>
            : <CalendarLoading/>}
          
        </div> 
        <div className={styles.guestsContainer}>
          {this.state.propertyInfo.rMax_guests 
            ? <Guests rMax_guests={this.state.propertyInfo.rMax_guests}
            getTotalGuests={this.getTotalGuests}/>
            : <GuestsLoading/>}
        </div>
        <div className={styles.bookingInformation}>
            {this.state.bookingDisplay.map((bookingDetail,key) => {
              if(bookingDetail.value !== '$0') {
                return <BookingDetail bookingDetail={bookingDetail} key={key}/>;
              }
            })} 
          <div className={styles.bookingTotal}>
            { this.state.bookingDisplay.length > 0 ? <span className={styles.bookingTotalKey}>Total</span> : null }
            { this.state.bookingDisplay.length > 0 ? <span className={styles.bookingTotalValue}>{'$' + Math.trunc(this.state.totalAmount)}</span> : null }                                       
          </div>
        </div>
        <div className={styles.reserveContainer}>
          {this.state.numReservedDates
          ? <Reserve numReservedDates={this.state.numReservedDates} 
                     checkinCheckout={this.state.checkinCheckout}
                     totalGuests={this.state.totalGuests}
                     postBookedDates={this.postBookedDates}/>
          : <ReserveLoading/>}
          
        </div>
        <div className={styles.footer}>
          You won't be charged yet
        </div>
      </div>
    );
  }
}

export default App;
