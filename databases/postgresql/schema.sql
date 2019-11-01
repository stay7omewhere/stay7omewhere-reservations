DROP DATABASE IF EXISTS stay7omewhere_reservations;
CREATE DATABASE stay7omewhere_reservations;

\c stay7omewhere_reservations;

CREATE TABLE users (
  userID    SERIAL,
  username  VARCHAR(25),

  PRIMARY KEY(userID),
  UNIQUE (username)
);
-- SERIAL: autoincrementing to billions

CREATE TABLE rooms (
  rID               SERIAL,
  rMax_guests       SMALLINT  NOT NULL,
  rNightly_price    MONEY     NOT NULL,
  rCleaning_fee     MONEY,
  rService_fee      MONEY,
  rTaxes_fees       MONEY,
  rBulkDiscount     MONEY,
  rRequired_Week_Booking_Days SMALLINT,
  rRating           DECIMAL(3,2),
  rReviews          SMALLINT,

  PRIMARY KEY (rID)
);

CREATE TABLE bookings (
  bID             SERIAL,
  bProperty_ID    INTEGER     REFERENCES properties(rID),
  bUser_ID        INTEGER     REFERENCES users(userID),
  bGuest_Total    SMALLINT    NOT NULL,
  bCheckin_Date   DATE        NOT NULL,
  bCheckout_Date  DATE        NOT NULL
);

-- ALTERNATIVE to DATE
-- bCheckin_Date        DATE,
-- bCheckout_Date       DATE
