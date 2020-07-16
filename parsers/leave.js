const BaseParser = require('./baseparser.js');

const Player = require('../data/player.js');

class LeaveParser extends BaseParser {
    constructor(brikkit) {
        super();

        this._brikkit = brikkit;
        this._owner = null;
        this._userid = null;

        this._waitingForSuccess = {};
    }

    parse(generator, line) {
        if (generator !== 'LogNet')
            return null;

        if (!line.startsWith('UNetConnection::Close:'))
            return null;

        const ownerRegExp = /Owner: (BP_PlayerController_C_\d+)/;
        const match = line.match(ownerRegExp);
        if (!match)
            return null;

        return this._brikkit._players.find(p => p._controller === match[1]);
    }
}

module.exports = LeaveParser;