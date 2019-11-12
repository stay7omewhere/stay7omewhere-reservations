const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const gunzip = zlib.createGunzip();

const unzipper = function(inp, out, callback) {
    
  inp.pipe(gunzip)
    .on('error', () => {
    // handle error
    })
    .pipe(out)
    .on('error', () => {
    // handle error
    })
    .on('finish', () => { //'end' is called automatically when read ends
      inp.destroy();
      out.destroy();
      callback();
    })
};

const userInp = fs.createReadStream(path.resolve(__dirname, 'data', 'users.csv.gz'));
const userOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'users.csv'));
unzipper(userInp, userOut, () => {
  const roomsInp = fs.createReadStream(path.resolve(__dirname, 'data', 'rooms.csv.gz'));
  const roomsOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'rooms.csv'));
  unzipper(roomsInp, roomsOut, () => {
    const bookingsInp = fs.createReadStream(path.resolve(__dirname, 'data', 'bookings.csv.gz'));
    const bookingsOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'bookings.csv'));
    unzipper(bookingsInp, bookingsOut, () => {console.log('gUnzips complete')});
  });
});
