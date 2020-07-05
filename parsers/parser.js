const Parser = {};

Parser.JoinParser = require('./join.js');
Parser.LeaveParser = require('./leave.js');
Parser.ChatParser = require('./chat.js');
Parser.PreStartParser = require('./prestart.js');
Parser.StartParser = require('./start.js');
Parser.MapChangeParser = require('./mapchange.js');

module.exports = Parser;