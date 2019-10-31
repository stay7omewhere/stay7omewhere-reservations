DROP DATABASE IF EXISTS stay7omewhere_reservations;
CREATE DATABASE stay7omewhere_reservations;

\c stay7omewhere_reservations;

CREATE TABLE users (
  userID    SERIAL,
  username  VARCHAR(25),

  PRIMARY KEY(userID)
);
-- SERIAL: autoincrementing to billions

CREATE TABLE properties (
  pID               SERIAL,
  pMax_guests       SMALLINT,
  pNightly_price    MONEY,
  pCleaning_fee     MONEY,
  pService_fee      MONEY,
  pTaxes_fees       MONEY,
  pBulkDiscount     MONEY,
  pRequired_Week_Booking_Days SMALLINT,
  pRating           DECIMAL(3,2),
  pReviews          SMALLINT,

  PRIMARY KEY (pID)
);

CREATE TABLE booked (
  bID           SERIAL,
  bProperty_ID  SERIAL      REFERENCES properties(pID),
  bUser_ID      SERIAL      REFERENCES users(userID),
  bGuest_Total  SMALLINT,
  Date          DATE
);
