const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const gzip = zlib.createGzip();

const zipper = function(inpPath, outPath) {
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
zipper('bookings.csv', 'bookings.csv.gz');
