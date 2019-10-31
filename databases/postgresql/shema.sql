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
  rMax_guests       SMALLINT,
  rNightly_price    MONEY,
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
  bID           SERIAL,
  bProperty_ID  INTEGER      REFERENCES properties(rID),
  bUser_ID      INTEGER      REFERENCES users(userID),
  bGuest_Total  SMALLINT,
  date          DATE
);

-- ALTERNATIVE to DATE
-- bCheckin_Date        DATE,
-- bCheckout_Date       DATE
