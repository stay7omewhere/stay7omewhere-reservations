const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const zipper = function(inpPath, outPath, callback) {
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
    })
    .on('finish', () => { //'end' is called automatically when read ends
      inp.destroy();
      out.destroy();
      callback();
    })
};

zipper('users.csv', 'users.csv.gz', () => {
  zipper('rooms.csv', 'rooms.csv.gz', () => {
    zipper('bookings1.csv', 'bookings1.csv.gz', () => {
      zipper('bookings3.csv', 'bookings3.csv.gz', () => {
        zipper('bookings2.csv', 'bookings2.csv.gz', () => {
          zipper('bookings4.csv', 'bookings4.csv.gz', () => {
            zipper('bookings5.csv', 'bookings5.csv.gz', () => {});
          });
        });
      });
    });
  });
});

