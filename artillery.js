module.exports = {
  setJSONBody: setJSONBody,
  setID: setID
}

function setJSONBody(requestParams, context, ee, next) {
  requestParams.body = {
    booking: {
        bProperty_ID: Math.ceil(Math.random() * 10000000),
        bUser_ID: Math.ceil(Math.random() * 10000000),
        bGuest_Total: 6,
        bCheckin_Date: '2020-03-01',
        bCheckout_Date: '2020-03-04',
        bHeld_At: '2019-11-12 10:44:03'
    }
  };
  return next(); // MUST be called for the scenario to continue
}

function setID(context, events, done) {
    const random = Math.ceil(Math.random() * 10000000)
    context.vars.id = random; // set the "id" variable for the virtual user  
    return done();
  }
  