import React from 'react';
import styles from '../../public/styles/reserve.module.css';

const ReserveModal = ({visibility, toggleReserveModal, checkinCheckout, totalGuests, postBookedDates}) => (
  <div className={styles.reserveModal} style={{visibility: visibility}}>
    <div className={styles.reserveModalDetails}>
      <span className={styles.reserveModalClose} onClick={toggleReserveModal}>&times;</span>
      <div id={styles.signUp}>
        Sign up to<button id={styles.bookReservation} onClick={() => postBookedDates(checkinCheckout[0], checkinCheckout[1], totalGuests)
        }>book</button>
      </div>
      <div id={styles.moments}>
        You're moments away from booking your stay
      </div>
      <div className={styles.reserveButtonContainers}>
        <button className={styles.ContinueSignupButtons} id={styles.facebookContinue}>
          Continue with Facebook
        </button>
        <br></br>
        <button className={styles.ContinueSignupButtons} id={styles.googleContinue}>
          Continue with Google
        </button>
      </div>
      <div id={styles.reserveModalDivider}>
        <svg className={styles.calendarArrow} width="255px" height="35px">
          <line x1="5" x2="225" y1="17.5" y2="17.5" stroke="rgb(228, 228, 228)" strokeWidth="1" strokeLinecap="butt"/>
        </svg>
        <span>or</span>
        <svg className={styles.calendarArrow} width="255px" height="35px">
          <line x1="20" x2="240" y1="17.5" y2="17.5" stroke="rgb(228, 228, 228)" strokeWidth="1" strokeLinecap="butt"/>
        </svg>
      </div>
      <div className={styles.reserveButtonContainers} id={styles.signupContainer}>
        <button className={styles.ContinueSignupButtons} id={styles.emailSignup}>
          Sign up with Email
        </button>
      </div>

      <div>
        <div id={styles.reserveModalFooter}>
          Already have an Airbnb account?
          <button id={styles.reserveModalLogin}>
          Log in
        </button>
        </div>
      </div>
    </div>
  </div>
)

export default ReserveModal;