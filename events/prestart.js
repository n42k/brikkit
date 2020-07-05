const BaseEvent = require('./baseevent.js');

class PreStartEvent extends BaseEvent {
    constructor(date) {
        super(date);
    }
    
    getType() {
        return 'prestart';
    }
};

module.exports = PreStartEvent;