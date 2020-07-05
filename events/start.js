const BaseEvent = require('./baseevent.js');

class StartEvent extends BaseEvent {
    constructor(date) {
        super(date);
    }
    
    getType() {
        return 'start';
    }
};

module.exports = StartEvent;