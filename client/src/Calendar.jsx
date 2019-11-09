import React from 'react';
import CalendarDropdown from './CalendarDropdown';
import styles from '../../public/styles/calendar.module.css';
const axios = require('axios');
const moment = require('moment');
moment().format();

//calendar of available dates
//TODO: need to add changing footer notes.
class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookedDates: [],
      dayArray: new Array(42).fill(null).map(day => ({ day: null, status: 'unselected', invalidDate: false})),
      calendarVisibility: "hidden",
      currentSelection: null,
      currentMonth: moment(),
      transition: styles.fadein,
      pastDates: [],
      //maybe add a state for prevMonth currMonth div and prevMonth calendarDay div for sliding animation
      //maybe add a state for nextMonth currMonth div and prevMonth calendayDay div for sliding animation
    };

    this.updateCheckinCheckout = this.props.updateCheckinCheckout;
    this.requiredBookingDays = this.props.requiredBookingDays;
    this.getNumReservedDates = this.props.getNumReservedDates;
    this.propertyID = this.props.propertyID;
    
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.handleOutsideCalendarClick = this.handleOutsideCalendarClick.bind(this);
    this.selectDay = this.selectDay.bind(this);
    this.updateSelectionRange = this.updateSelectionRange.bind(this);
    this.populateCurrDisplayMonth = this.populateCurrDisplayMonth.bind(this);
    this.updateCurrentMonth = this.updateCurrentMonth.bind(this);
    this.monthTransitionIn = this.monthTransitionIn.bind(this);
    this.displayCheckInOutDate = this.displayCheckInOutDate.bind(this);
    this.calculateDisabledDates = this.calculateDisabledDates.bind(this);
    this.calculateDayOfMonth = this.calculateDayOfMonth.bind(this);
    this.calculateIndexOfDay = this.calculateIndexOfDay.bind(this);
    this.clearDates = this.clearDates.bind(this);
    this.calculateBookedDates = this.calculateBookedDates.bind(this);
    this.getMomentJSofIndex = this.getMomentJSofIndex.bind(this);
    this.getBookedDates = this.getBookedDates.bind(this);
    this.checkSameMonthSelection = this.checkSameMonthSelection.bind(this);
    this.checkPrevMonthCheckinNextMonthCheckout = this.checkPrevMonthCheckinNextMonthCheckout.bind(this);
    this.checkNextMonthCheckout = this.checkNextMonthCheckout.bind(this);
    this.checkPreviousMonthCheckin = this.checkPreviousMonthCheckin.bind(this);
    this.selectCheckout = this.selectCheckout.bind(this);
    this.selectCheckin = this.selectCheckin.bind(this);
    this.checkinPriorToCheckout = this.checkinPriorToCheckout.bind(this);
    this.noCheckoutOrNewCheckinAfterCheckout = this.noCheckoutOrNewCheckinAfterCheckout.bind(this);
  }

  getBookedDates() {
    // axios.get('http://3.133.54.136:3000/BookedDates/' + this.propertyID)
    axios.get(`http://localhost:3000/api/rooms/${this.propertyID}/bookings`)
    .then((res) => {
      console.log('Get BookedDates for Calendar res.data: ', res.data)
      let bookedDates = [];
      for (let i = 0; i < res.data.length; i++) {
        let date = moment(res.data[i].bcheckin_date);
        let bCheckout =  moment(res.data[i].bcheckout_date);
        // While the current date is between the checkin and checkout
        while (bCheckout.diff(date, 'days') >= 0){
          bookedDates.push(moment(date.format()));
          // After pushing the date to the list, increase the date by 1
         date = date.add(1, 'days');
        }
      }
      this.setState({
        bookedDates
      }, () => this.updateCurrentMonth());
    })
    .catch((err) => console.log(err));
  }

  calculateDisabledDates(dayArray) {
    let firstValidDay;
    if(this.state.currentMonth.month() === moment().month() && this.state.currentMonth.year() === moment().year()) {
      firstValidDay = this.calculateIndexOfDay(Number(moment().format('DD')));
    } else {
      firstValidDay = this.state.currentMonth.startOf('month').day();
    }
    for (let i = 0; i < firstValidDay; i++) {
      dayArray[i].invalidDate = true;
    }

    let lastDayIndex = this.calculateIndexOfDay(this.state.currentMonth.daysInMonth() + 1);
    for (let i = lastDayIndex; i < dayArray.length; i++) {
      dayArray[i].invalidDate = true;
    }
  }

  calculateBookedDates(dayArray) {
    let currentMonthBookedDates = this.state.bookedDates.filter(
      monthDates => (monthDates.month() === this.state.currentMonth.month()) && (monthDates.year() === this.state.currentMonth.year()));
    for (let i = 0; i < currentMonthBookedDates.length; i++) {
      dayArray[this.calculateIndexOfDay(Number(currentMonthBookedDates[i].format('DD')))].invalidDate = true;
    }
  }

  populateCurrDisplayMonth(dayArray) {
    let startDayIndex = this.state.currentMonth.startOf('month').day();
    let totalDays = this.state.currentMonth.daysInMonth();

    let day = 1;
    for(let i = 0; i < startDayIndex; i++) {
      dayArray[i].day = null;
    }
    for(let i = startDayIndex; i < totalDays + startDayIndex; i++) {
      dayArray[i].day = day;
      day++;
    }
    for(let i = totalDays + startDayIndex; i < dayArray.length; i++) {
      dayArray[i].day = null;
    }
  }

  updateCurrentMonth(amount) {
    let currentMonth = this.state.currentMonth;
    currentMonth.add(amount, 'months');

    //reset daysArray for new month
    let dayArray = new Array(42).fill(null).map(day => ({ day: null, status: 'unselected', invalidDate: false}));
    this.populateCurrDisplayMonth(dayArray);
    this.calculateDisabledDates(dayArray);
    this.calculateBookedDates(dayArray);

    if(this.props.checkinCheckout[0] !== null && 
      (this.state.currentMonth.format('MM') === moment(this.props.checkinCheckout[0]).format('MM'))
      && (this.state.currentMonth.format('YYYY') === moment(this.props.checkinCheckout[0]).format('YYYY'))) {
        //select checkin
        let checkinDay = moment(this.props.checkinCheckout[0]).format('DD');
        let checkinIndex = this.calculateIndexOfDay(checkinDay, this.props.checkinCheckout[0]);
        dayArray[checkinIndex].status = styles.selected;
    }
    if(this.props.checkinCheckout[1] !== null && 
      this.state.currentMonth.format('MM') === moment(this.props.checkinCheckout[1]).format('MM')
      && (this.state.currentMonth.format('YYYY') === moment(this.props.checkinCheckout[1]).format('YYYY'))) {
        //select checkout
        let checkoutDay = moment(this.props.checkinCheckout[1]).format('DD');
        let checkoutIndex = this.calculateIndexOfDay(checkoutDay, this.props.checkinCheckout[1]);
        dayArray[checkoutIndex].status = styles.selected;
    }

    if(this.props.checkinCheckout[0] !== null && this.props.checkinCheckout[1] !== null) {
      this.updateSelectionRange(dayArray, moment(this.props.checkinCheckout[0]), moment(this.props.checkinCheckout[1]));
    }

    this.setState({
      currentMonth,
      dayArray,
    }); 
    this.monthTransitionIn()//TODO: update this transition
  }

  selectDay(index) {
    let dayArray = JSON.parse(JSON.stringify(this.state.dayArray));
    let checkinCheckout = this.props.checkinCheckout.slice(0);
    let checkInOutDate = this.getMomentJSofIndex(index, this.state.currentMonth.format('MM'), this.state.currentMonth.format('YYYY'));

    if (this.state.currentSelection === styles.checkin) {
      this.selectCheckin(dayArray, checkInOutDate, index, checkinCheckout);
    } else {
      this.selectCheckout(dayArray, checkInOutDate, index, checkinCheckout);
    }
    
    if((checkinCheckout[0] !== null && checkinCheckout[0] !== this.props.checkinCheckout[0]) 
                                                || this.state.currentSelection === styles.checkout && checkinCheckout[1] !== this.props.checkinCheckout[1]) {
      let prevSelection = this.state.currentSelection;
      this.updateCheckinCheckout(checkinCheckout[0], checkinCheckout[1]);
      this.setState({
        dayArray,
        currentSelection: styles.checkout
      }, () => {
        if(prevSelection === styles.checkin) {
          document.getElementById(styles.checkout).focus();
        } else if(this.props.checkinCheckout[1] !== null) {
          this.toggleCalendar();
          document.getElementById(styles.checkout).blur();
        }
      });
    }
    document.getElementById(this.state.currentSelection).focus();
  }

  selectCheckin(dayArray, checkInOutDate, index, checkinCheckout) {
    if (this.props.checkinCheckout[0] !== null) {
      let checkinIndex = this.calculateIndexOfDay(Number(moment(this.props.checkinCheckout[0]).format('DD')));
      if(checkinIndex !== index) {
        dayArray[checkinIndex].status = 'unselected';
      }
    } 

    let daysBeforeBookedDate = 0;
    let counter = index;
    let year = this.state.currentMonth.format('YYYY');
    let month = this.state.currentMonth.format('MM');
    let isValidDate = false;
    var checkforBookedorCheckedInDate = this.getMomentJSofIndex(counter, month, year);
    let checkoutDate = null;
    if(this.props.checkinCheckout[1] && checkforBookedorCheckedInDate.diff(moment(this.props.checkinCheckout[1]), 'days') < 0) {
      let isvalidAndCheckoutDate = this.checkinPriorToCheckout(dayArray, checkoutDate, checkforBookedorCheckedInDate, 
                                                                counter, month, year, daysBeforeBookedDate, isValidDate, checkinCheckout, index);
      isValidDate = isvalidAndCheckoutDate[0];
      checkoutDate = isvalidAndCheckoutDate[1];
    } else {
      let isvalidAndCheckoutDate = this.noCheckoutOrNewCheckinAfterCheckout(dayArray, checkoutDate, checkforBookedorCheckedInDate, counter, 
                                                                            month, year, daysBeforeBookedDate, isValidDate, checkinCheckout, index, checkInOutDate);
      isValidDate = isvalidAndCheckoutDate[0];
      checkoutDate = isvalidAndCheckoutDate[1];
    }

    if(isValidDate) {
      checkinCheckout[0] = checkInOutDate;
      dayArray[index].status = styles.selected;
      this.updateSelectionRange(dayArray, moment(checkInOutDate), checkoutDate);
    }
  }

  noCheckoutOrNewCheckinAfterCheckout(dayArray, checkoutDate, checkforBookedorCheckedInDate, counter, 
                                  month, year, daysBeforeBookedDate, isValidDate, checkinCheckout, index, checkInOutDate) {
    while(counter <= this.requiredBookingDays + 1 + index) {
      checkforBookedorCheckedInDate = this.getMomentJSofIndex(counter, month, year);
      var isBooked = false;
      for(let i = 0; i < this.state.bookedDates.length; i++){
        if(checkforBookedorCheckedInDate.format('YYYY MM DD') === this.state.bookedDates[i].format('YYYY MM DD')) {
          isBooked = true;
          break;
        }
      }
      
      if(daysBeforeBookedDate === this.requiredBookingDays + 1) {
        isValidDate = true;
        if(this.props.checkinCheckout[1] !== null) {
          checkoutDate = moment(this.props.checkinCheckout[1]);
          if(moment(checkInOutDate) > checkoutDate) {
            checkoutDate = null;
            checkinCheckout[1] = null;
            let startDayIndex = this.state.currentMonth.startOf('month').day();
            for (let i = startDayIndex; i < index; i++) {
              dayArray[i].status = 'unselected';
            }
          }
        }
        break;
      }
      if(isBooked) {
        break;
      }

      daysBeforeBookedDate++;
      counter++;
      let lastDayIndex = this.calculateIndexOfDay(this.state.currentMonth.daysInMonth());
      if(counter - 1 === lastDayIndex) {
        let nextMonth = this.state.currentMonth.format();
        nextMonth = moment(nextMonth);
        nextMonth.add(1, 'months');
        counter = nextMonth.startOf('month').day();
        month = nextMonth.format('MM');
        year = nextMonth.format('YYYY');
      }
    }
    return [isValidDate, checkoutDate];
  }

  checkinPriorToCheckout(dayArray, checkoutDate, checkforBookedorCheckedInDate, counter, 
                          month, year, daysBeforeBookedDate, isValidDate, checkinCheckout, index) {
    let daysBeforeCheckoutDate = 0;
    var isBooked = false;
    let currentMonth = this.state.currentMonth.format();

    while(checkforBookedorCheckedInDate.format('YYYY MM DD') !== moment(this.props.checkinCheckout[1]).format('YYYY MM DD')) {
      checkforBookedorCheckedInDate = this.getMomentJSofIndex(counter, month, year);
      
      for(let i = 0; i < this.state.bookedDates.length; i++){
        if(checkforBookedorCheckedInDate.format('YYYY MM DD') === this.state.bookedDates[i].format('YYYY MM DD')) {
          isBooked = true;
          break;
        }
      }
      if(!isBooked){
        daysBeforeBookedDate++;
      }

      daysBeforeCheckoutDate++;

      counter++;
      let lastDayIndex = this.calculateIndexOfDay(this.state.currentMonth.daysInMonth());
      if(counter - 1 === lastDayIndex) {
        var nextMonth = currentMonth;
        nextMonth = moment(nextMonth);
        nextMonth.add(1, 'months');
        currentMonth = nextMonth.format();
        counter = nextMonth.startOf('month').day();
        month = nextMonth.format('MM');
        year = nextMonth.format('YYYY');
      }
    }
    if (daysBeforeBookedDate > 0 && daysBeforeBookedDate > this.requiredBookingDays) {
      isValidDate = true;
      checkoutDate = moment(this.props.checkinCheckout[1]);
      if (daysBeforeBookedDate < daysBeforeCheckoutDate) {
        checkoutDate = null;
        let unselectUpToIndex = this.calculateIndexOfDay(Number(moment(checkinCheckout[1]).format('DD')));
        if(moment(checkinCheckout[1]).startOf('month').diff(this.state.currentMonth.startOf('month'), 'months') >= 1) {
          unselectUpToIndex = this.calculateIndexOfDay(this.state.currentMonth.daysInMonth());
        }
        for (let i = index + 1; i <= unselectUpToIndex; i++) {
          dayArray[i].status = 'unselected';
        }
        checkinCheckout[1] = null;
      }
    } else if (daysBeforeBookedDate === 0) {
      isValidDate = true;
    }
    return [isValidDate, checkoutDate];
  }

  selectCheckout(dayArray, checkInOutDate, index, checkinCheckout) {
    if(moment(checkInOutDate) > moment(this.props.checkinCheckout[0])) {
      if (this.props.checkinCheckout[1] !== null) {
        let checkoutIndex = this.calculateIndexOfDay(Number(moment(this.props.checkinCheckout[1]).format('DD')));
        if(checkoutIndex !== index) {
          dayArray[checkoutIndex].status = 'unselected';
        }
      } 
      let daysBeforeBookedDate = 0;
      let counter = index;
      let year = this.state.currentMonth.format('YYYY');
      let month = this.state.currentMonth.format('MM');
      let isValidDate = false;
      var checkforBookedorCheckedInDate = this.getMomentJSofIndex(counter, month, year);
      let currentMonth = this.state.currentMonth.format();

      while (checkforBookedorCheckedInDate.format('YYYY MM DD') !== moment(this.props.checkinCheckout[0]).format('YYYY MM DD')) {
        checkforBookedorCheckedInDate = this.getMomentJSofIndex(counter, month, year);
        var isBooked = false;
        for(let i = 0; i < this.state.bookedDates.length; i++){
          if(checkforBookedorCheckedInDate.format('YYYY MM DD') === this.state.bookedDates[i].format('YYYY MM DD')) {
            isBooked = true;
            break;
          }
        }
        let isCheckedInDate = checkforBookedorCheckedInDate.format('YYYY MM DD') === moment(this.props.checkinCheckout[0]).format('YYYY MM DD');
        if(isBooked || (isCheckedInDate && daysBeforeBookedDate < this.requiredBookingDays) || (isCheckedInDate && (daysBeforeBookedDate >= this.requiredBookingDays) && !isBooked)) {
          if (isCheckedInDate && (daysBeforeBookedDate >= this.requiredBookingDays) && !isBooked) {
            isValidDate = true;
          }
          break;
        }

        daysBeforeBookedDate++;
        counter--;
        
        let firstDayIndex = this.state.currentMonth.startOf('month').day();
        if(counter + 1 === firstDayIndex) {
          let prevMonth = currentMonth;
          prevMonth = moment(prevMonth);
          prevMonth.subtract(1, 'months');
          currentMonth = prevMonth.format();
          month = prevMonth.format('MM');
          year = prevMonth.format('YYYY');
          counter = this.calculateIndexOfDay(prevMonth.daysInMonth(), year + '-' + month + '-01');
        }
      }
      if(isValidDate) {
        checkinCheckout[1] = checkInOutDate;
        dayArray[index].status = styles.selected;
      }

      let checkinDate;
      if(this.props.checkinCheckout[0] !== null) {
        checkinDate = moment(this.props.checkinCheckout[0]);
      }

      if(isValidDate) {
        this.updateSelectionRange(dayArray, checkinDate, moment(checkInOutDate));
      }
    }
  }

  updateSelectionRange(dayArray, checkinDate, checkoutDate) {
    if(checkinDate && checkoutDate) {
      let checkin = this.calculateIndexOfDay(Number(checkinDate.format('DD')));
      let checkout = this.calculateIndexOfDay(Number(checkoutDate.format('DD')));

      this.checkPreviousMonthCheckin(checkinDate, checkoutDate, dayArray, checkout);
      this.checkNextMonthCheckout(checkinDate, checkoutDate, dayArray, checkin);
      this.checkPrevMonthCheckinNextMonthCheckout(checkinDate, checkoutDate, dayArray);
      this.checkSameMonthSelection(checkinDate, checkoutDate, checkin, checkout, dayArray);
    }
  }

  checkPreviousMonthCheckin(checkinDate, checkoutDate, dayArray, checkout) {
    if((checkinDate.month() < this.state.currentMonth.month() && checkoutDate.month() === this.state.currentMonth.month() )
        || (checkinDate.year() < this.state.currentMonth.year()) && checkoutDate.month() === this.state.currentMonth.month()){
      let startIndex = this.state.currentMonth.startOf('month').day()
      for (let i = startIndex; i < checkout; i++) {
        dayArray[i].status = styles.selectionRange;
      }
      dayArray[checkout].status += ' ' + styles.checkoutSelected;
    }
  }

  checkNextMonthCheckout(checkinDate, checkoutDate, dayArray, checkin) {
    if((checkoutDate.month() > this.state.currentMonth.month() && checkinDate.month() === this.state.currentMonth.month())
        || (checkoutDate.year() > this.state.currentMonth.year() && checkinDate.month() === this.state.currentMonth.month())) {
      let startDayIndex = this.state.currentMonth.startOf('month').day();
      let totalDays = this.state.currentMonth.daysInMonth();
      let endDayIndex = startDayIndex + totalDays
      for (let i = checkin + 1; i < endDayIndex; i++) {
        dayArray[i].status = styles.selectionRange;
      }
      dayArray[checkin].status += ' ' + styles.checkinSelected;
    }
  }

  checkPrevMonthCheckinNextMonthCheckout(checkinDate, checkoutDate, dayArray) {
    if(checkinDate.startOf('month').diff(this.state.currentMonth.startOf('month'), 'days') < 0 
        && checkoutDate.startOf('month').diff(this.state.currentMonth.startOf('month'), 'days') > 0) {
      let startDayIndex = this.state.currentMonth.startOf('month').day();
      let totalDays = this.state.currentMonth.daysInMonth();
      let endDayIndex = startDayIndex + totalDays
      for (let i = startDayIndex; i < endDayIndex; i++) {
        dayArray[i].status = styles.selectionRange;
      }
    } 
  }

  checkSameMonthSelection(checkinDate, checkoutDate, checkin, checkout, dayArray) {
    if(checkoutDate.month() === this.state.currentMonth.month() && checkinDate.month() === this.state.currentMonth.month()
    && checkoutDate.year() === this.state.currentMonth.year() && checkinDate.year() === this.state.currentMonth.year()) {
      for (let i = 0; i < checkin; i++) {
        dayArray[i].status = 'unselected'
      }
      for (let i = checkin + 1; i < checkout; i++) {
        dayArray[i].status = styles.selectionRange;
      }
      for(let i = checkout + 1; i < dayArray.length; i++) {
        dayArray[i].status = 'unselected'
      }
      dayArray[checkin].status += ' ' + styles.checkinSelected;
      dayArray[checkout].status += ' ' + styles.checkoutSelected;
    }
  }

  clearDates() {
    let dayArray = JSON.parse(JSON.stringify(this.state.dayArray));
    for (let i = 0; i < 42; i++) {
      dayArray[i].status = 'unselected';
    }
    this.updateCheckinCheckout(null, null);
    this.setState({
      dayArray,
      currentSelection: styles.checkin
    }, document.getElementById(styles.checkin).focus())
  }

  //TODO: need to update so checkout doesn't get highlighted on click if 
  //check-in date not selected
  //need to remove checkout date if new checkin date is selected.
  toggleCalendar(selectType) {
    if(this.props.checkinCheckout[0] === null) {
      document.getElementById(styles.checkin).focus();
      selectType = styles.checkin;
    }
    let calendarVisibility;
    if(this.state.calendarVisibility === "hidden") {
      calendarVisibility = "visible";
    } else {
      calendarVisibility = "hidden";
    }
    this.setState({
      calendarVisibility,
      currentSelection: selectType
    }, () => this.getNumReservedDates(this.props.checkinCheckout[0], this.props.checkinCheckout[1]));
  }

  //need to change this so its only currMonth and calendarDay thats sliding.
  monthTransitionIn() {
    let transition = this.state.transition
    if(transition === styles.fadeout) {
      transition = styles.fadein;
    } else {
      transition = styles.fadeout;
    }

    this.setState({
      transition
    });
  }
  
  handleOutsideCalendarClick(e) {
    if (this.state.calendarVisibility === "visible" && !this.node.contains(e.target)) {
      this.toggleCalendar();
    }
  }

  displayCheckInOutDate(index) {
    if(this.props.checkinCheckout[index] === null) {
      if(index === 0) {
        return 'Check-in';
      } else {
        return 'Checkout';
      }
    } else {
      return moment(this.props.checkinCheckout[index]).format('L');
    }
  }

  calculateDayOfMonth(index, date = null) {
    if(date === null) {
      return index - this.state.currentMonth.startOf('month').day() + 1;
    } else {
      return Number(index) - Number(moment(date).startOf('month').day()) + 1;
    }
  }
  calculateIndexOfDay(day, date = null) {
    if (date === null) {
      return day + this.state.currentMonth.startOf('month').day() - 1; 
    } else {
      return Number(day) + Number(moment(date).startOf('month').day()) - 1;
    }
  }

  getMomentJSofIndex(index, month, year) {
    let day = this.calculateDayOfMonth(index, year + '-' + month + '-' + '01');
    if(day < 10) {
      day = '0' + day;
    }
    
    return moment(year + '-' + month + '-' + day);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideCalendarClick, false);

    this.getBookedDates();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideCalendarClick, false);
  }

  render() {
    return (
      <div className={styles.calendarSubGrid}>
        <div className={styles.calendarHeader} id={styles.calendarHeader}>
          Dates
        </div>
        <div className={styles.calendarInputs}>
          <input className={styles.checkin} id={styles.checkin} readOnly value={this.displayCheckInOutDate(0)} onClick={() => this.toggleCalendar(styles.checkin)} />
          <svg className={styles.calendarArrow} width="35px" height="35px">
            <line x1="5" x2="31" y1="17.5" y2="17.5" stroke="black" strokeWidth=".70" strokeLinecap="butt"/>
            <line x1="31" x2="24" y1="17.5" y2="10" stroke="black" strokeWidth=".70" strokeLinecap="butt"/>
            <line x1="31" x2="24" y1="17.5" y2="25" stroke="black" strokeWidth=".70" strokeLinecap="butt"/>
          </svg>
          <input className={styles.checkout} id={styles.checkout} readOnly value={this.displayCheckInOutDate(1)} onClick={() => this.toggleCalendar(styles.checkout)}/>
        </div>
        <div ref={node => this.node = node}>
          <CalendarDropdown dayArray={this.state.dayArray}
                            visibility={this.state.calendarVisibility}
                            selectDay={this.selectDay}
                            updateCurrentMonth={this.updateCurrentMonth}
                            currentMonth={this.state.currentMonth}
                            transition={this.state.transition}
                            clearDates={this.clearDates}
                            requiredBookingDays={this.requiredBookingDays}/>
        </div>
      </div>
    )
  }
}

export default Calendar;