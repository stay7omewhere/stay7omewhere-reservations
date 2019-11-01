DROP DATABASE IF EXISTS reservations;
CREATE DATABASE reservations;

use reservations

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS bookings;


CREATE TABLE users (
  userID int AUTO_INCREMENT,
  username VARCHAR(25),

  PRIMARY KEY (userID)
);

CREATE TABLE rooms (
  rID int AUTO_INCREMENT,
  rMax_guests int,
  rNightly_price DECIMAL(10,2),
  rCleaning_fee DECIMAL(10,2),
  rService_fee DECIMAL(10,2),
  rTaxes_fees DECIMAL(10,2),
  rBulkDiscount DECIMAL(3,2),
  rRequired_Week_Booking_Days int,
  rRating DECIMAL(3,2),
  rReviews int,

  PRIMARY KEY (rID)
);


CREATE TABLE bookings (
  bID int AUTO_INCREMENT,
  bProperty_ID int,
  bUser_ID int,
  bGuest_Total int,
  bCheckin_Date VARCHAR(30),
  bCheckout_Date VARCHAR(30),

  PRIMARY KEY (bID),

  FOREIGN KEY(bProperty_ID)
    REFERENCES rooms(rID),

  FOREIGN KEY (bUser_ID)
    REFERENCES users(userID)
);

