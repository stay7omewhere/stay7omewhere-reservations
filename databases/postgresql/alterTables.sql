\c stay7omewhere_reservations;

ALTER TABLE users DROP COLUMN IF EXISTS csvID;
ALTER TABLE rooms DROP COLUMN IF EXISTS csvID;
ALTER TABLE bookings DROP COLUMN IF EXISTS csvID;

ALTER TABLE bookings ADD CONSTRAINT bpropfk FOREIGN KEY (bProperty_ID) REFERENCES rooms (rID);
ALTER TABLE bookings ADD CONSTRAINT buserfk FOREIGN KEY (bUser_ID) REFERENCES users (userID);


CREATE INDEX bpropidx ON bookings (bProperty_ID);

-- CREATE INDEX bpropidx ON bookings (bUser_ID);


