const BaseParser = require('./baseparser.js');

const Player = require('../data/player.js');

/*
These lines are related to players joins:
1) [2019.09.14-17.42.21:370][423]LogServerList: UserName: n
2) [2019.09.14-17.42.21:370][423]LogServerList: UserId: 5187ba44-97d7-4c7c-94f5-89e8ba467ead
3) [2019.09.14-17.42.21:370][423]LogServerList: HandleId: d3f16cf4-5966-4015-ba01-ecb33f2266d6
4) [2019.09.14-17.42.21:458][423]LogNet: Join succeeded: n

As told by the devs of Brickadia, messages 1 to 3 are atomic.
They also appear to be because they are output in the same millisecond.

Thus, we can assume that if we receive message 1,
we will receive messages 2 and 3 right after.

Message 4 generally happens a short moment after message 3, but not immediately.
This gives time for another player to join inbetween.

Thus, our solution consists in storing the data in the first 3 messages.
Then, when message 4 is received, we match the player name with the stored data,
and return a Player.

In all other cases we return null.

Caveat: a race condition can happen if the player who joined changes his name
to something else after message 3, and another player changes his name
to theirs and joins before message 4. We assume this never happens.
*/

const USERNAME_STRING = 'UserName: ';
const USERID_STRING = 'UserId: ';
const HANDLEID_STRING = 'HandleId: ';
const JOIN_SUCCESS_STRING = 'Join succeeded: ';

class JoinParser extends BaseParser {
    constructor() {
        super();

        this._username = null;
        this._userid = null;

        this._waitingForSuccess = {};
    }

    parse(generator, line) {
        if(generator === 'LogServerList')
            return this._logServerList(line);
        else
            return this._logNet(line);
    }

    _logServerList(line) {
        if(line.startsWith(USERNAME_STRING)) {
            this._username =
                line.substring(USERNAME_STRING.length, line.length);
        } else if(line.startsWith(USERID_STRING)) {
            this._userid =
                line.substring(USERID_STRING.length, line.length);
        } else if(line.startsWith(HANDLEID_STRING)) {
            const handleId =
                line.substring(HANDLEID_STRING.length, line.length);

            this._waitingForSuccess[this._username] = {
                userid: this._userid,
                handleid: handleId
            };
        }

        return null;
    }

    _logNet(line) {
        if(!line.startsWith(JOIN_SUCCESS_STRING))
            return null;

        const username =
            line.substring(JOIN_SUCCESS_STRING.length, line.length);

        const player = this._waitingForSuccess[username];

        if(player === undefined)
            return null;

        return new Player(username, player.userid, player.handleid);
    }
}

module.exports = JoinParser;