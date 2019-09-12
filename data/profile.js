const isValidUUID = require('uuid-validate');

class Profile {
    constructor(userId, username, gender, where, lastSeen, location, userText) {
        if(username === undefined)
            throw new Error('Invalid profile: undefined username');
        
        if(userId === undefined)
            throw new Error('Invalid profile: undefined userid');
        
        if(gender === undefined)
            throw new Error('Invalid profile: undefined gender');
        
        if(where === undefined)
            throw new Error('Invalid profile: undefined where');
        
        if(lastSeen === undefined)
            throw new Error('Invalid profile: undefined lastSeen');
        
        if(location === undefined)
            throw new Error('Invalid profile: undefined location');
        
        if(userText === undefined)
            throw new Error('Invalid profile: undefined userText');
        
        
        if(typeof username !== 'string')
            throw new Error('Invalid profile: username not a string');
        
        if(typeof userId !== 'string')
            throw new Error('Invalid profile: userid not a string');
        
        if(typeof gender !== 'string' && gender !== null)
            throw new Error('Invalid profile: gender not a string/null');
        
        if(typeof where !== 'string')
            throw new Error('Invalid profile: where not a string');
        
        if(!(lastSeen instanceof Date))
            throw new Error('Invalid profile: lastSeen not a Date');
        
        if(typeof location !== 'string' && location !== null)
            throw new Error('Invalid profile: location not a string/null');
        
        if(typeof userText !== 'string' && userText !== null)
            throw new Error('Invalid profile: userText not a string/null');
       
        
        if(!isValidUUID(userId))
            throw new Error('Invalid profile: invalid userId');
        
        if(gender !== null && gender !== 'male' && gender !== 'female')
            throw new Error('Invalid profile: invalid gender');
        
        if(where !== 'ingame' && where !== 'outside')
            throw new Error('Invalid profile: invalid where');
        
        
        this._username = username;
        this._userId = userId;
        this._gender = gender;
        this._where = where;
        this._lastSeen = lastSeen;
        this._location = location;
        this._userText = userText;
    }
    
    getUsername() {
        return this._username;
    }
    
    getUserId() {
        return this._userId;
    }
    
    getGender() {
        return this._gender;
    }
    
    getWhere() {
        return this._where;
    }
    
    getLastSeen() {
        return this._lastSeen;
    }
    
    getLocation() {
        return this._location;
    }
    
    getUserText() {
        return this._userText;
    }
}

module.exports = Profile;