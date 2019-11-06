const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const gzip = zlib.createGzip();

const zipper = function(inp, out, callback) {
  inp.pipe(gzip)
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

const userInp = fs.createReadStream(path.resolve(__dirname, 'data', 'users.csv'));
const userOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'users.csv.gz'));
zipper(userInp, userOut, () => {

  const roomsInp = fs.createReadStream(path.resolve(__dirname, 'data', 'rooms.csv'));
  const roomsOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'rooms.csv.gz'));
  zipper(roomsInp, roomsOut, () => {

    const bookingsInp = fs.createReadStream(path.resolve(__dirname, 'data', 'bookings.csv'));
    const bookingsOut = fs.createWriteStream(path.resolve(__dirname, 'data', 'bookings.csv.gz'));
    zipper(bookingsInp, bookingsOut, () => {console.log('gZips complete')});

  });
});
