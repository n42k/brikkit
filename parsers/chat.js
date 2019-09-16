const BaseParser = require('./baseparser.js');

const Player = require('../data/player.js');

/*
This line is related to player messages:
[2019.09.14-18.34.41:930][443]LogChat: n: hello
*/

class ChatParser extends BaseParser {
    parse(generator, line) {
        if(generator !== 'LogChat')
            return null;
        
        const [username, ...messageParts] = line.split(': ');
        const message = messageParts.join(': ');
        return [username, message];
    }
}

module.exports = ChatParser;