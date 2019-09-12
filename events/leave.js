const BaseEvent = require('./baseevent.js');

const Player = require('../data/player.js');

class LeaveEvent extends BaseEvent {
    constructor(date, player) {
        super(date);
        
        if(!(player instanceof Player))
            throw new Error('Invalid leave event: player not a player.'); // ;)
            
        this._player = player;
    }
    
    getPlayer() {
        return this._player;
    }
    
    getType() {
        return 'leave';
    }
};

module.exports = LeaveEvent;