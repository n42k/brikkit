const BaseParser = require('./baseparser.js');

/*
The following lines are related to server start:
1) [2019.09.16-18.02.53:240][760]LogWorld: Bringing World /Game/Maps/Terrain/Peaks.Peaks up for play (max tick rate 30) at 2019.09.16-19.02.53
2) [2019.09.16-18.02.53:255][761]LogServerList: Posting server.

The Brikkit server will only start after it changed map the first time
*/

class StartParser extends BaseParser {
    constructor() {
        super();
        
        this._first = true;
        this._posted = false;
    }
    
    parse(generator, line) {
        if(!this._first)
            return false;
        
        if(generator === 'LogWorld') {
            if(!line.startsWith('Bringing World /Game/Maps/'))
                return false;
            
            this._posted = false;
            return false;
        } else if(!this._posted && generator === 'LogServerList') {
            if(line !== 'Posting server.')
                return false;
            
            this._posted = true;
            this._first = false;
            return true;
        } else return false;
    }
}

module.exports = StartParser;
