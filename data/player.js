const net = require('net');
const isValidUUID = require('uuid-validate');

class Player {
    constructor(username, userId, handleId, ip, port) {
        if(username === undefined)
            throw new Error('Invalid player: undefined username');
        
        if(userId === undefined)
            throw new Error('Invalid player: undefined userId');
        
        if(handleId === undefined)
            throw new Error('Invalid player: undefined handleId');
        
        if(ip === undefined)
            throw new Error('Invalid player: undefined ip');
        
        if(port === undefined)
            throw new Error('Invalid player: undefined port');
        
        
        if(typeof username !== 'string')
            throw new Error('Invalid player: username not a string');
        
        if(typeof userId !== 'string')
            throw new Error('Invalid player: userId not a string');
        
        if(typeof handleId !== 'string')
            throw new Error('Invalid player: handleId not a string');
        
        if(typeof ip !== 'string')
            throw new Error('Invalid player: ip not a string')
        
        if(typeof port !== 'number')
            throw new Error('Invalid player: port not a number');
        
        
        if(!isValidUUID(userId))
            throw new Error('Invalid profile: bad userId');
        
        if(!net.isIP(ip))
            throw new Error('Invalid player: invalid ip address');
        
        if(port < 1 || port > 65335)
            throw new Error('Invalid player: invalid port');
        
        
        this._username = username;
        this._userId = userId;
        this._handleId = handleId;
        this._ip = ip;
        this._port = port;
        this._profile = null;
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
    
    getIp() {
        return this._ip;
    }
    
    getPort() {
        return this._port;
    }
    
    getAddress() {
        return this._ip + ':' + this._port;
    }
    
    isReady() {
        return this._profile !== null;
    }
    
    getProfile() {
        return this._profile;
    }
    
    _setProfile(profile) {
        this._profile = profile;
    }
}

module.exports = Player;