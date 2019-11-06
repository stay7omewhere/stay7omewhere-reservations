const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const gunzip = zlib.createGunzip();

const unzipper = function(inpPath, outPath) {
  const inp = fs.createReadStream(path.resolve(__dirname, 'data', inpPath));
  const out = fs.createWriteStream(path.resolve(__dirname, 'data', outPath));
    
  inp.pipe(gunzip)
    .on('error', () => {
    // handle error
    })
    .pipe(out)
    .on('error', () => {
    // handle error
    });
};

unzipper('users.csv.gz', 'users.csv');
unzipper('rooms.csv.gz', 'rooms.csv');
unzipper('bookings.csv.gz', 'bookings.csv');