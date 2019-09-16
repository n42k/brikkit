const BaseEvent = require('./baseevent.js');

// TODO: make mapchange event have a field with the map name
class MapChangeEvent extends BaseEvent {
    constructor(date) {
        super(date);
    }
    
    getType() {
        return 'mapchange';
    }
};

module.exports = MapChangeEvent;