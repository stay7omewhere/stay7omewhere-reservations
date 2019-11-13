\c stay7omewhere_reservations;

ALTER TABLE users DROP COLUMN IF EXISTS csvID;
ALTER TABLE rooms DROP COLUMN IF EXISTS csvID;
ALTER TABLE bookings DROP COLUMN IF EXISTS csvID;

ALTER TABLE bookings ADD CONSTRAINT bpropfk FOREIGN KEY (bProperty_ID) REFERENCES rooms (rID);
ALTER TABLE bookings ADD CONSTRAINT buserfk FOREIGN KEY (bUser_ID) REFERENCES users (userID);


CREATE INDEX bpropidx ON bookings (bProperty_ID);

CREATE EXTENSION btree_gist;
 
ALTER TABLE bookings
 ADD CONSTRAINT unique_checkin_checkout_range
   EXCLUDE  USING gist
   ( bProperty_ID WITH =,
     daterange(bCheckin_Date, bCheckout_Date, '()') WITH &&   -- this is the crucial
   );

-- CREATE INDEX bpropidx ON bookings (bUser_ID);
