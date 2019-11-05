module.exports = {
  getRandomInt: function(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max-min));
  },
  shouldBeDisplayed: function(value) {
    if(this.getRandomInt(0,2)) {
    return value; //random between 3-9   RANDOM WHETHER IT WILL SHOW UP OR NOT NULL
    } else {
    return null;
    }
  },
  getSkewedRandomBookings: function() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.abs(Math.floor((Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ) + 0.75) * 2));
  }
}
