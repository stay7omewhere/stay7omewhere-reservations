DROP DATABASE IF EXISTS stay7omewhere_reservations;
CREATE DATABASE stay7omewhere_reservations;

\c stay7omewhere_reservations;

CREATE TABLE users (
  userID        SERIAL,
  username      VARCHAR,

  PRIMARY KEY   (userID),
  UNIQUE        (username)
);
-- SERIAL: autoincrementing to billions

CREATE TABLE rooms (
  rID                         SERIAL,
  rMax_guests                 SMALLINT      NOT NULL  DEFAULT 2,
  rNightly_price              MONEY         NOT NULL  DEFAULT 75,
  rCleaning_fee               MONEY         NOT NULL  DEFAULT 15,
  rService_fee                MONEY         NOT NULL  DEFAULT 0.13,
  rTaxes_fees                 MONEY,
  rBulkDiscount               MONEY,
  rRequired_Week_Booking_Days SMALLINT      NOT NULL  DEFAULT 2,
  rRating                     DECIMAL(3,2)  NOT NULL  DEFAULT 5,
  rReviews                    SMALLINT      NOT NULL  DEFAULT 0,

  PRIMARY KEY (rID)
);

CREATE TABLE bookings (
  bID             SERIAL,
  bProperty_ID    INTEGER,     -- REFERENCES rooms(rID),
  bUser_ID        INTEGER,     -- REFERENCES users(userID),
  bGuest_Total    SMALLINT    NOT NULL,
  bCheckin_Date   DATE        NOT NULL,
  bCheckout_Date  DATE        NOT NULL,

  PRIMARY KEY (bID)
);

COPY users (userID, username)
    FROM '/Users/lilcare/projects/SDC/stay7omewhere-reservations/databases/data/users.csv' 
    WITH DELIMITER ',' CSV HEADER;

COPY rooms (rID, rMax_guests, rNightly_price, rCleaning_fee, rService_fee, rTaxes_fees, rBulkDiscount, rRequired_Week_Booking_Days, rRating, rReviews)
    FROM '/Users/lilcare/projects/SDC/stay7omewhere-reservations/databases/data/rooms.csv' 
    WITH DELIMITER ',' CSV HEADER NULL 'null';

COPY bookings (bID,bProperty_ID,bUser_ID,bGuest_Total,bCheckin_Date,bCheckout_Date)
    FROM '/Users/lilcare/projects/SDC/stay7omewhere-reservations/databases/data/bookings.csv' 
    WITH DELIMITER ',' CSV HEADER;
