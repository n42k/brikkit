const BaseParser = require('./baseparser.js');

/*
This line is related to server prestart:
[2019.09.16-18.03.53:047][551]LogServerList: Posting server.

The server will have prestarted the first time this line is output
*/

class PreStartParser extends BaseParser {
    constructor() {
        super();
        
        this._started = false;
    }
    
    parse(generator, line) {
        if(this._started)
            return false;
        
        if(generator !== 'LogServerList')
            return false;
        
        if(line === 'Posting server.')
            return false;
        
        this._started = true;
        return true;
    }
}

module.exports = PreStartParser;
