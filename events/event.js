const Event = {};

Event.ChatEvent = require('./chat.js');
Event.JoinEvent = require('./join.js');
Event.PreStartEvent = require('./prestart.js');
Event.StartEvent = require('./start.js');
Event.MapChangeEvent = require('./mapchange.js');

module.exports = Event;
