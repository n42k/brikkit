const BaseEvent = require('./baseevent.js');

const Player = require('../data/player.js');

class JoinEvent extends BaseEvent {
    constructor(date, player) {
        super(date);
        
        if(!(player instanceof Player))
            throw new Error('Invalid join event: player not a player.'); // ;)
            
        this._player = player;
    }
    
    getPlayer() {
        return this._player;
    }
    
    getType() {
        return 'join';
    }
};

module.exports = JoinEvent;