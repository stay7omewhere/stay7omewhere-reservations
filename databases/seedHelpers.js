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
  }
}
