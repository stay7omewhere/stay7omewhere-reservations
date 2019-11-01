# reservation-system

## Description
implementing calendar reservation system
The reservations components for a restaurant reservations service.

## Related Projects
  - https://github.com/stay7omewhere/calendar
  - https://github.com/stay7omewhere/photo-gallery
  - https://github.com/stay7omewhere/recommendations

## Table of Contents
1. [Requirements](#requirements)

## Requirements
- Node v8.15.x
- MongoDB v5.7.x
- npm v6.4.x

## API Routes

USE '/rooms/:id' --serves static files

GET '/api/rooms/:id' --read property info for one property id
- request body is empty
- returns an array with a single object including all property information in the form:
   [
     {
       pID,
       pMax_guests,
       pNightly_price,
       pCleaning_fee,
       pService_fee,
       pTaxes_fees,
       pBulkDiscount,
       pRequired_Week_Booking_Days,
       pRating,
       pReviews
      }
    ]

GET '/api/rooms/:id/bookings' --read booked dates info for one property id
- request body is empty
- returns an array of booked dates objects in the form: 
    {
      bProperty_ID,
      bUser_ID,
      bGuest_Total,
      Date
    }

POST '/api/bookings' --create new bookings for each of the booked dates
- request body is JSON in the form below (all properties required): 
    {
      bProperty_ID,
      bUser_ID,
      bGuest_Total,
      bCheckin_Date,
      bCheckout_Date
    }
- returns completed status code

PUT '/api/bookings' --update bookings for a particular booking date row
- request body is JSON, also returns updated row in the same form (only bID required):
    {
      bID,
      bGuest_Total,
      bCheckin_Date,
      bCheckout_Date
    }
- returns completed status code

DELETE '/api/bookings/:id' --delete a particular booking
- request body is empty
- returns completed status code

### Installing Dependencies
From within the root directory


1. Install project dependencies
```javascript
npm install
```

2. To create MySQL database
```javascript
MySql -u root -p <./server/data/schema.sql
enter password
```

3. To seed the MySQL database
```javascript
npm run seed-database
```

4. To create a client bundle
```javascript
npm run react-dev
```

5. To start the server
```javascript
npm start
```

6. Go to `localhost:3000/:propertyID/` i.e. localhost:3000/2


