const BaseParser = require('./baseparser.js');

/*
The following lines are related to map changes:
1) [2019.09.16-18.02.53:240][760]LogWorld: Bringing World /Game/Maps/Terrain/Peaks.Peaks up for play (max tick rate 30) at 2019.09.16-19.02.53
2) [2019.09.16-18.02.53:255][761]LogServerList: Posting server.

These lines will also happen when the server starts.
This is not related to the map change,
thus we can ignore the first time they are sent.
*/

class MapChangeParser extends BaseParser {
    constructor() {
        super();
        
        this._first = true;
        this._posted = false;
    }
    
    parse(generator, line) {
        if(generator === 'LogWorld') {
            if(!line.startsWith('Bringing World /Game/Maps/'))
                return false;
            
            this._posted = false;
            return false;
        } else if(!this._posted && generator === 'LogServerList') {
            if(line !== 'Posting server.')
                return false;
            
            this._posted = true;
            
            if(this._first) {
                this._first = false;
                return false;
            }
            
            return true;
        } else return false;
    }
}

module.exports = MapChangeParser;
