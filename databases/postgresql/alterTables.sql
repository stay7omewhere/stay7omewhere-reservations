\c stay7omewhere_reservations;

ALTER TABLE users DROP COLUMN IF EXISTS csvID;
ALTER TABLE rooms DROP COLUMN IF EXISTS csvID;
ALTER TABLE bookings DROP COLUMN IF EXISTS csvID;

ALTER TABLE bookings ADD CONSTRAINT bpropfk FOREIGN KEY (bProperty_ID) REFERENCES rooms (rID);
ALTER TABLE bookings ADD CONSTRAINT buserfk FOREIGN KEY (bUser_ID) REFERENCES users (userID);


CREATE INDEX bpropidx ON bookings (bProperty_ID);

-- CREATE INDEX bpropidx ON bookings (bUser_ID);


SELECT daterange(bCheckin_Date, bCheckout_Date, '()')
EXCLUDE USING gist (bProperty_ID WITH =, bRange WITH &&) 
bRange ,
    

ALTER TABLE bookings ADD COLUMN bRange DATERANGE;
ALTER TABLE bookings ADD CONSTRAINT brangeex EXCLUDE USING gist (bProperty_ID WITH =, bRange WITH &&);

-- WITH RECURSIVE rBookings AS (
--     SELECT (bCheckin_Date, bCheckout_Date) FROM bookings WHERE bProperty_ID = 9890900 
-- )
--  INSERT INTO bookings (bID, bProperty_ID, bUser_ID, bGuest_Total, bCheckin_Date, bCheckout_Date, bHeld_At)  
--    VALUES (default, 9890900, 500, 12, '2020-02-01', '2020-02-04', '2019-11-07 10:44:03')
--    ON CONFLICT  
--      WHERE NOT (
--          ('2020-02-01'::date >= rBookings.bCheckin_Date AND '2020-02-01'::date <= rBookings.bCheckout_Date)
--          OR ('2020-02-04'::date >= rBookings.bCheckin_Date AND '2020-02-04'::date <= rBookings.bCheckout_Date)
--          OR ('2020-02-01'::date <= rBookings.bCheckin_Date AND '2020-02-04'::date >= rBookings.bCheckout_Date)
--      )
--  ;

-- WITH RECURSIVE rBookings(date_range) AS (
--     SELECT daterange(bCheckin_Date, bCheckout_Date, '()') 
--     WHERE bProperty_ID = 9890900    
-- )

-- INSERT INTO bookings (bID, bProperty_ID, bUser_ID, bGuest_Total, bCheckin_Date, bCheckout_Date, bHeld_At)
--     VALUES (default, 9890900, 500, 12, '2020-02-01', '2020-02-04', '2019-11-09 16:05:03')
--     ON CONFLICT (bookings.bProperty_ID) WHERE (bookings.bProperty_ID WITH =, rBookings.bRange WITH &&) DO NOTHING;


--       not({checkin} >= rBookings.bCheckin_Date AND {checkin} =< rBookings.bCheckout_Date)
--       OR not({checkout} >= rBookings.bCheckin_Date AND {checkout} <= rBookings.bCheckout_Date)
--       OR not({checkin} <= rBookings.bCheckin_Date && checkin >= rBookings.bCheckout_Date)
--     DO NOTHING
--     [ RETURNING * | output_expression [ [ AS ] output_name ] [, ...] ]

