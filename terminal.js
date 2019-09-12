const readline = require('readline');

class Terminal {
    constructor() {
        this._readline = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
          terminal: false
        });
        
        this._callbacks = {
            'out': []
        };

        this._readline.on('line', line => {
            for(const callback of this._callbacks['out'])
                callback(line);
        });
    }
    
    on(type, callback) {
        if(this._callbacks[type] === undefined)
            throw new Error('Undefined Terminal.on type.');
        
        this._callbacks[type].push(callback);
    }
    
    write(line) {
        console.log(line);
    }
}

module.exports = Terminal;