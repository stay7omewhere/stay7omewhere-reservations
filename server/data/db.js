const sqlInfo = require('../config/sqlConfig.js');

const path = require('path')
const Sequelize = require('sequelize');


// Option 1: Passing parameters separately
const sequelize = new Sequelize('reservations', 'root', sqlInfo.SQL_PASSWORD, {
  // host: 'database',
  host: 'localhost',
  dialect: 'mysql'
});


const Users = sequelize.define('users', {
  // attributes
  userID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING
    // allowNull defaults to true
  }
}, {
  timestamps: false
  // options
});

const Rooms = sequelize.define('rooms', {
  // attributes
  rID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  rMax_guests: {
    type: Sequelize.INTEGER
  },
  rNightly_price: {
    type: Sequelize.DECIMAL(10, 2)
  },
  rCleaning_fee: {
    type: Sequelize.DECIMAL(10, 2)
  },
  rService_fee: {
    type: Sequelize.DECIMAL(10, 2)
  },
  rTaxes_fees: {
    type: Sequelize.DECIMAL(10, 2)
  },
  rBulkDiscount: {
    type: Sequelize.DECIMAL(3, 2)
  },
  rRequired_Week_Booking_Days: {
    type: Sequelize.INTEGER
  },
  rRating: {
    type: Sequelize.DECIMAL(3,2)
  },
  rReviews: {
    type: Sequelize.INTEGER
  }
}, {
  // options
  timestamps: false
});


const Bookings = sequelize.define('bookings', {
  // attributes
  bID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  bProperty_ID: {
    type: Sequelize.INTEGER,
    references: {
      model: Rooms,
      key: 'rID'
    }
  },
  bUser_ID: {
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'userID'
    }
  },
  bGuest_Total: {
    type: Sequelize.INTEGER,
  },
  bCheckin_Date: {
    type: Sequelize.DATE
  },
  bCheckout_Date: {
    type: Sequelize.DATE
  }
}, {
  // options
  timestamps: false,
  freezeTableName: true
});


exports.Users = Users;
exports.Rooms = Rooms;
exports.Booked = Bookings;
