const net = require('net');
const isValidUUID = require('uuid-validate');

class Player {
    constructor(username, userId, handleId) {
        if(username === undefined)
            throw new Error('Invalid player: undefined username');
        
        if(userId === undefined)
            throw new Error('Invalid player: undefined userId');
        
        if(handleId === undefined)
            throw new Error('Invalid player: undefined handleId');
        
        if(typeof username !== 'string')
            throw new Error('Invalid player: username not a string');
        
        if(typeof userId !== 'string')
            throw new Error('Invalid player: userId not a string');
        
        if(typeof handleId !== 'string')
            throw new Error('Invalid player: handleId not a string');
        
        if(!isValidUUID(userId))
            throw new Error('Invalid player: bad userId ("' + userId + '")');
        
        if(!isValidUUID(handleId))
            throw new Error('Invalid player: bad handleId ("' + handleId + '")');
        
        this._username = username;
        this._userId = userId;
        this._handleId = handleId;
    }
    
    getUsername() {
        return this._username;
    }
    
    getUserId() {
        return this._userId;
    }
    
    getHandleId() {
        return this._handleId;
    }
}

module.exports = Player;