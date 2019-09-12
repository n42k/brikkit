const Player = require('./data/player.js');

/*
 * Usage:
 * As each line related to the player join is received,
 * call parseLine with it. This will either return null,
 * if it still needs more information, or a fully fledged Player.
 * No other return values are possible.
 */
class StateMachineJoin {
    constructor() {
        this._reset();
    }
    
    parseLine(line) {
        if(line === 'RegisterServer called, but auth not ready. Deferring.' ||
                line === 'ABRGameSession::HandleAuthComplete' ||
                line === 'ABRGameSession::StartPostingServer' ||
                line === 'Starting periodic server posting.' ||
                line === 'Posting server.' ||
                line === 'Auth digest valid.' ||
                line === 'Auth payload valid. Result:')
            return null; // ignore this line, it's not useful
        
        const [_, key, value] = /^(.*?): (.*)$/.exec(line);
        
        if(key === 'NotifyAcceptingConnection accepted from') {
            this._reset();
            return null;
        }
        
        this._lines.push(line);
        this._lines.push('\n');
        
        
        let raceCondition = false;
        if(this._ip === null || this._port === null) {
            if(key === 'Server accepting post-challenge connection from')
                [this._ip, this._port] = parseAddress(value);
            else
                raceCondition = true;
        } else if(this._username === null) {
            if(key === 'UserName')
                this._username = value;
            else
                raceCondition = true;
        } else if(this._userid === null) {
            if(key === 'UserId')
                this._userid = value;
            else
                raceCondition = true;
        } else if(this._handleid === null) {
            if(key === 'HandleId')
                this._handleid = value;
            else
                raceCondition = true;
        }
        
        if(raceCondition) {
            const err = `Race condition on joining game due to line "${line}"

Lines:
${this._lines.join('')}
Details:
this._ip = ${this._ip}
this._port = ${this._port}
this._username = ${this._username}
this._userid = ${this._userid}
this._handleid = ${this._handleid}`;
                                
            throw new Error(err);
        }
        
        if(this._ip === null ||
            this._port === null ||
            this._username === null ||
            this._userid === null ||
            this._handleid === null) {
            return null;
        }
        
        return new Player(this._username, this._userid,
            this._handleid, this._ip, this._port);
    }
    
    _reset() {
        this._ip = null;
        this._port = null;
        this._username = null;
        this._userid = null;
        this._handleid = null;
        this._lines = [];
    }
}

function parseAddress(address) {
    const [ip, port] = address.split(':', 2);
    
    const portInteger = parseInt(port);
    
    if(portInteger !== portInteger)
        throw new Error('Invalid port when parsing address');
    
    return [ip, portInteger];
}

module.exports = StateMachineJoin;