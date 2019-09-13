const Event = {};

Event.ChatEvent = require('./chat.js');
Event.JoinEvent = require('./join.js');
Event.LeaveEvent = require('./leave.js');
Event.StartEvent = require('./start.js');

module.exports = Event;
