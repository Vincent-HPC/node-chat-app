// Jan 1st 1970 00:00:00 am
// Be stored in UTC which means it's time zone independent
// Now these timestamps inside of javascript they're stored in "milliseconds.""
// Althought Unix inside of a regular UNIX timestamps they're actually stored in seconds.
//
// 1000 --> Jan 1st 1970 00:00:01 am

var moment = require('moment');

var date = moment();
date.add(1000, 'year').subtract(1, 'months');
console.log(date.format('MMM Do, YYYY'));
// pass inside of here is patterns which means that we have access
//  to a specific set of values we use to output certain things.


var someTimestamp = moment().valueOf();
console.log(someTimestamp);


var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'));
