const Player = require('../data/player.js');
const BaseEvent = require('./baseevent.js');

class ChatEvent extends BaseEvent {
    constructor(date, sender, content) {
        super(date);
        
        if(!(sender instanceof Player))
            throw new Error('Invalid chat event: sender not a player.'); // ;)
        
        if(typeof content !== 'string')
            throw new Error('Invalid chat event: content not a string.');
            
        this._sender = sender;
        this._content = content;
    }
    
    getSender() {
        return this._sender;
    }
    
    getContent() {
        return this._content;
    }
    
    getType() {
        return 'chat';
    }
};

module.exports = ChatEvent;