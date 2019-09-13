class Configuration {
    constructor(configuration) {
        if(configuration === undefined)
            configuration = {};
            
        if(configuration.constructor &&
            configuration.constructor === Configuration) {
            this._setMap(configuration.getMap());
        } else {
            if(configuration.name === undefined) {
                if(process.env.SERVER_MAP === undefined)
                    this._setMap('plate');
                else
                    this._setMap(process.env.SERVER_MAP);
            }
        }
    }
    
    getMap() {
        return this._name;
    }
    
    _setMap(name) {
        this._name = name;
    }
}

module.exports = Configuration;