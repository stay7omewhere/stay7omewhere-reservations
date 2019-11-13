const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const unzipper = function(inpPath, outPath, callback) {
  const gunzip = zlib.createGunzip();
  const inp = fs.createReadStream(path.resolve(__dirname, 'data', inpPath));
  const out = fs.createWriteStream(path.resolve(__dirname, 'data', outPath));
    
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

unzipper('users.csv.gz', 'users.csv', () => {
  unzipper('rooms.csv.gz', 'rooms.csv', () => {
    unzipper('bookings1.csv.gz', 'bookings1.csv', () => {
      unzipper('bookings2.csv.gz', 'bookings2.csv', () => {
        unzipper('bookings3.csv.gz', 'bookings3.csv', () => {
          unzipper('bookings4.csv.gz', 'bookings4.csv', () => {
            unzipper('bookings5.csv.gz', 'bookings5.csv', () => {});
          });
        });
      });
    });
  });
});
