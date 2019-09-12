class BaseEvent {
    constructor(date) {
        if(!(date instanceof Date))
            throw new Error('Invalid event: date is not a date.');
        
        this._date = date;
    }
    
    getType() {
        throw new Error('getType not implemented in event');
    }
    
    getDate() {
        return this._date;
    }
}

module.exports = BaseEvent;