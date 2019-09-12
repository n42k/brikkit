class Configuration {
    constructor(configuration) {
        if(configuration === undefined)
            configuration = {};
            
        if(configuration.constructor &&
            configuration.constructor === Configuration) {
            this._setName(configuration.getName());
            this._setDescription(configuration.getDescription());
            this._setMaxPlayers(configuration.getMaxPlayers());
        } else {
            if(configuration.name === undefined) {
                if(process.env.SERVER_NAME === undefined)
                    this._setName('Brikkit Server');
                else
                    this._setName(process.env.SERVER_NAME);
            }
            
            if(configuration.description === undefined) {
                if(process.env.SERVER_DESC === undefined)
                    this._setDescription('Get Brikkit at https://github.com/n42k/brikkit');
                else
                    this._setDescription(process.env.SERVER_DESC);
            }
            
            if(configuration.maxPlayers === undefined) {
                if(process.env.MAX_PLAYERS === undefined)
                    this._setMaxPlayers(20);
                else
                    this._setMaxPlayers(parseInt(process.env.MAX_PLAYERS));
            }
        }
    }
    
    getName() {
        return this._name;
    }
    
    getDescription() {
        return this._description;
    }
    
    getMaxPlayers() {
        return this._maxPlayers;
    }
    
    _setName(name) {
        this._name = name;
    }
    
    _setDescription(description) {
        this._description = description;
    }
    
    _setMaxPlayers(maxPlayers) {
        this._maxPlayers = maxPlayers;
    }
    
}

module.exports = Configuration;