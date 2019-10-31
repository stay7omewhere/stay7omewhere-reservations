DROP DATABASE IF EXISTS reservations;
CREATE DATABASE reservations;

use reservations

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS booked;


CREATE TABLE users (
  userID int AUTO_INCREMENT,
  username VARCHAR(25),
  PRIMARY KEY (userID)
);

CREATE TABLE properties (
  pID int AUTO_INCREMENT,
  pMax_guests int,
  pNightly_price DECIMAL(10,2),
  pCleaning_fee DECIMAL(10,2),
  pService_fee DECIMAL(10,2),
  pTaxes_fees DECIMAL(10,2),
  pBulkDiscount DECIMAL(3,2),
  pRequired_Week_Booking_Days int,
  pRating DECIMAL(3,2),
  pReviews int,

  PRIMARY KEY (pID)
);


CREATE TABLE booked (
  bID int AUTO_INCREMENT,
  bProperty_ID int,
  bUser_ID int,
  bGuest_Total int,
  Date VARCHAR(30),

  PRIMARY KEY (bID),

  FOREIGN KEY(bProperty_ID)
    REFERENCES properties(pID),

  FOREIGN KEY (bUser_ID)
    REFERENCES users(userID)
)