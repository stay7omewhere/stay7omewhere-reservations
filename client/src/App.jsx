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
        pMax_guests: null, 
        pNightly_price: null, 
        pBulkDiscount: null,
        pCleaning_fee: null,
        pService_fee: null,
        pTaxes_fees: null,
        pRequired_Week_Booking_Days: null, 
        pRating: null, 
        pReviews: null 
      },
      bookingDisplay: [],
      numReservedDates: null,
      totalGuests: 1,
      totalPrice: null,
      totalServiceFee: null,
      totalWeeklyDiscount: null,
      totalAmount: null,
      propertyID: window.location.href.split('/')[3],
      checkinCheckout: [null,null],
    };

    this.getNumReservedDates = this.getNumReservedDates.bind(this);
    this.getTotalGuests = this.getTotalGuests.bind(this);
    this.populateBookingDisplay = this.populateBookingDisplay.bind(this);
    this.getPropertyInfo = this.getPropertyInfo.bind(this);
    this.updateCheckinCheckout = this.updateCheckinCheckout.bind(this);
    this.postBookedDates = this.postBookedDates.bind(this);
  }


  postBookedDates(checkin, checkout) {
    if(checkin && checkout) {
      let bookedDate = moment(checkin).format('YYYY-MM-DD');
      let bookedDates = [];
      for(let i = 0; i <= this.state.numReservedDates; i++) {
        bookedDates.push({
            bProperty_ID: this.state.propertyID,
            bUser_ID: 1, //hardcoded to id: 1 right now since login functionality not setup
            Date: bookedDate,
        });
        bookedDate = moment(bookedDate).add(1, 'days').format('YYYY-MM-DD');
      }
      //axios.post('http://3.133.54.136:3000/BookedDates', {
      axios.post('http://localhost:3000/BookedDates', {
        bookedDates
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  getPropertyInfo() {
    // axios.get('http://3.133.54.136:3000/id/' + this.state.propertyID)
    axios.get('http://localhost:3000/id/' + this.state.propertyID)
      .then((res) => {
        let propertyInfo = JSON.parse(JSON.stringify(this.state.propertyInfo));
        for(let key in propertyInfo) {
          if(typeof res.data[0][key] === 'string') {
            propertyInfo[key] = Number(res.data[0][key]);
          } else {
            propertyInfo[key] = res.data[0][key];
          }
        }
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
      totalPrice = this.state.propertyInfo.pNightly_price * this.state.numReservedDates;
      totalServiceFee = this.state.propertyInfo.pService_fee * totalPrice;
      totalWeeklyDiscount = -(totalPrice * this.state.propertyInfo.pBulkDiscount);
      totalAmount = totalPrice + totalServiceFee + totalWeeklyDiscount + 
                    this.state.propertyInfo.pCleaning_fee + this.state.propertyInfo.pTaxes_fees;

      let possibleBookingDisplays = {
              'pNightly_price': [`$${this.state.propertyInfo.pNightly_price} x ${this.state.numReservedDates} nights`, totalPrice], 
              'pBulkDiscount' : [`${100 - (this.state.propertyInfo.pBulkDiscount * 100)}% weekly price discount`, totalWeeklyDiscount],
              'pCleaning_fee' : ['Cleaning Fee', this.state.propertyInfo.pCleaning_fee], 
              'pService_fee'  : ['Service fee', totalServiceFee], 
              'pTaxes_fees'   : ['Occupancy taxes and fees', this.state.propertyInfo.pTaxes_fees] 
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
    return Number(numAdults) + Number(numChildren);
  }

  componentDidMount() {
    this.getPropertyInfo();
    console.log(window.location.href.split('/')[3]);
  }

  render() {
    return(
      <div className={styles.container}>
        <div className={styles.propertyContainer}>
          <PropertyDetail pricePerNight={this.state.propertyInfo.pNightly_price}
                          starRating={this.state.propertyInfo.pRating}
                          numReviews={this.state.propertyInfo.pReviews}/>
        </div>
        <div className={styles.calendarContainer}>
          {this.state.propertyInfo.pRequired_Week_Booking_Days
            ? <Calendar requiredBookingDays={this.state.propertyInfo.pRequired_Week_Booking_Days}
                        getNumReservedDates={this.getNumReservedDates}
                        propertyID={this.state.propertyID}
                        checkinCheckout={this.state.checkinCheckout}
                        updateCheckinCheckout={this.updateCheckinCheckout}/>
            : <CalendarLoading/>}
          
        </div> 
        <div className={styles.guestsContainer}>
          {this.state.propertyInfo.pMax_guests 
            ? <Guests pMax_guests={this.state.propertyInfo.pMax_guests}
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
