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

        // this is not "UNetConnection" because the UNetConnection line does not occur on kick/ban
        if (!line.startsWith('UChannel::Close:'))
            return null;

        const ownerRegExp = /Owner: (BP_PlayerController_C_\d+)/;
        const match = line.match(ownerRegExp);
        if (!match)
            return null;

        const player = this._brikkit._players.find(p => p._controller === match[1]);
        return player !== undefined ? player : null;
    }
}

module.exports = LeaveParser;