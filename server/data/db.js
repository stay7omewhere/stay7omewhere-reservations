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

const Properties = sequelize.define('properties', {
  // attributes
  pID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  pMax_guests: {
    type: Sequelize.INTEGER
  },
  pNightly_price: {
    type: Sequelize.DECIMAL(10, 2)
  },
  pCleaning_fee: {
    type: Sequelize.DECIMAL(10, 2)
  },
  pService_fee: {
    type: Sequelize.DECIMAL(10, 2)
  },
  pTaxes_fees: {
    type: Sequelize.DECIMAL(10, 2)
  },
  pBulkDiscount: {
    type: Sequelize.DECIMAL(3, 2)
  },
  pRequired_Week_Booking_Days: {
    type: Sequelize.INTEGER
  },
  pRating: {
    type: Sequelize.DECIMAL(3,2)
  },
  pReviews: {
    type: Sequelize.INTEGER
  }
}, {
  // options
  timestamps: false
});


const Booked = sequelize.define('booked', {
  // attributes
  bID: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  bProperty_ID: {
    type: Sequelize.INTEGER,
    references: {
      model: Properties,
      key: 'pID'
    }
  },
  bUser_ID: {
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'userID'
    }
  },
  Date: {
    type: Sequelize.DATE
  }
}, {
  // options
  timestamps: false,
  freezeTableName: true
});


exports.Users = Users;
exports.Properties = Properties;
exports.Booked = Booked;
