module.exports = {
  setJSONBody: setJSONBody,
  setID: setID
}

function setJSONBody(requestParams, context, ee, next) {
  requestParams.body = JSON.stringify({
    'bProperty_ID': 9890900,
    'bUser_ID': 500,
    'bGuest_Total': 12,
    'bCheckin_Date': '2020-03-01',
    'bCheckout_Date': '2020-03-04',
    'bHeld_At': '2019-11-12 10:44:03'
  });
  return next(); // MUST be called for the scenario to continue
}

function setID(context, events, done) {
    context.vars['id'] = Math.ceil(Math.random() * 10000000); // set the "id" variable for the virtual user
    return done();
  }
  