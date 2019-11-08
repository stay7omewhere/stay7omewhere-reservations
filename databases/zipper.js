const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const zipper = function(inpPath, outPath) {
  const gzip = zlib.createGzip();
  const inp = fs.createReadStream(path.resolve(__dirname, 'data', inpPath));
  const out = fs.createWriteStream(path.resolve(__dirname, 'data', outPath));
    
  inp.pipe(gzip)
    .on('error', () => {
    // handle error
    })
    .pipe(out)
    .on('error', () => {
    // handle error
    });
};

zipper('users.csv', 'users.csv.gz');
zipper('rooms.csv', 'rooms.csv.gz');
zipper('bookings1.csv', 'bookings1.csv.gz');
zipper('bookings2.csv', 'bookings2.csv.gz');
zipper('bookings3.csv', 'bookings3.csv.gz');
zipper('bookings4.csv', 'bookings4.csv.gz');
zipper('bookings5.csv', 'bookings5.csv.gz');
