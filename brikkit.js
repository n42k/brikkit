const Brickadia = require('./brickadia.js');
const Terminal = require('./terminal.js');
const Configuration = require('./data/configuration.js');
const StateMachineJoin = require('./sm_join.js');

const PluginSystem = require('./pluginsystem.js');
const Scraper = require('./scraper.js');

const Event = require('./events/event.js');

class Brikkit {
    constructor(configuration) {
        global.Brikkit = this;
        
        configuration = new Configuration(configuration);

        this._brickadia = new Brickadia(configuration);
        if(process.env.DEV === 'TRUE')
            this._developmentMode();
        
        // make an object entry for each type of event
        this._callbacks = {};
        for(const eventKey of Object.keys(Event)) {
            const eventConstructor = Event[eventKey];
            const getType = eventConstructor.prototype.getType;
            this._callbacks[getType()] = [];
        }
        
        this._playersByName = {};
        this._playersByAddress = {};
        
        this._stateMachineJoin = new StateMachineJoin();
        
        this._scraper = new Scraper();
        this._pluginSystem = new PluginSystem();
        
        this._brickadia.on('out', line => this._handleBrickadiaLine(line));
        
        this._terminal = new Terminal();
        this._terminal.on('out', line => {
           const [cmd, ...args] = line.split(' ');
           
           if(cmd === 'cmd')
               this._brickadia.write(`${args.join(' ')}\n`);
        });
    }
    
    /* 
     * Types available:
     * 'chat': when someone sends a chat message
     *      args: (message)
     *      message: {
     *          username: "n42k",
     *          content: "Hello World!"
     *      }
     */
    on(type, callback) {
        if(this._callbacks[type] === undefined)
            throw new Error('Undefined Modkadia.on type.');
        
        this._callbacks[type].push(callback);
    }
    
    getPlayerFromUsername(username) {
        const player = this._playersByName[username];
        return player === undefined ? null : player;
    }
    
    getPlayerFromAddress(address) {
        const player = this._playersByAddress[address];
        return player === undefined ? null : player;
    }
    
    say(message) {
        const messages = message.split('\n');
        
        for(const msg of messages)
            this._brickadia.write(`Chat.Broadcast ${msg}\n`);
    }
    
    saveBricks(saveName) {
        this._brickadia.write(`Bricks.Save ${saveName}\n`);
    }
    
    loadBricks(saveName) {
        this._brickadia.write(`Bricks.Load ${saveName}\n`);
    }
    
    // DANGER: clears all bricks in the server
    clearAllBricks() {
        this._brickadia.write(`Bricks.ClearAll\n`);
    }
    
    // this disconnects all players.
    changeMap(mapName) {
        if(['Studio_Night',
            'Studio_Day',
            'Studio',
            'Plate',
            'Peaks'].indexOf(mapName) === -1)
            return;
        
        this._brickadia.write(`travel ${mapName}\n`);
    }
    
    getPlayerList() {
        const players = [];
        
        for(const username in this._playersByName) {
            const player = this._playersByName[username];
            if(player.isReady())
                players.push(player);
        }
        
        return players;
    }
    
    getScraper() {
        return this._scraper;
    }
    
    getPluginSystem() {
        return this._pluginSystem;
    }
    
    // adds callbacks to print out stdout and stderr directly from Brickadia
    _developmentMode() {
        this._brickadia.on('out', line => console.log(`bout: "${line}"`));
        this._brickadia.on('err', line => console.log(`berr: "${line}"`));
    }
    
    _handleBrickadiaLine(line) {
        const matches = /^\[(.*?)\]\[.*?\](.*?): (.*)$/.exec(line);
        
        if(matches === undefined || matches === null)
            return;
        
        const dateString = matches[1]
            .replace(':', '.')
            .replace('-', 'T')
            .replace('.', '-')
            .replace('.', '-')
            .replace('.', ':')
            .replace('.', ':');
    
        const date = new Date(dateString + 'Z');
        
        // which object generated the message
        // UE4 specific: LogConfig, LogInit, ...
        // useful for understanding the line
        const generator = matches[2];
        
        const restOfLine = matches[3];
        
        if(generator === 'LogChat') {
            const [_1, username, msg] = /^(.*?): (.*?)$/.exec(restOfLine);
            const player = this.getPlayerFromUsername(username);

            this._putEvent(new Event.ChatEvent(date, player, msg));
        } else if(generator === 'LogServerList') {
            this._stateMachineJoinHandleLine(restOfLine);
        } else if(generator === 'LogNet') {
            const closeString = 'UChannel::Close: Sending CloseBunch.';
            if(restOfLine.startsWith(closeString)) {
                const [_1, argString] = /^.*?\. .*?\. (.*)$/.exec(restOfLine);
                
                const args = argString.split(', ').map(arg => {
                    const [_, key, value] = /^(.*?): (.*?)$/.exec(arg);
                    return [key, value];
                });
                
                let closeString = null;
                for(const [key, value] of args)
                    if(key === 'Closing')
                        closeString = value;
                
                if(closeString === null)
                    return;
                
                const [_2, address] = /^.*?RemoteAddr: (.*)$/.exec(closeString);
                const player = this.getPlayerFromAddress(address);
                
                if(player === null) {
                    // must be a player that cancelled joining midway
                    console.warn('WARNING: player cancelled joining midway');
                }
                
                this._removePlayer(player);
                this._putEvent(new Event.LeaveEvent(date, player));
            }
            
            const [key, value] = restOfLine.split(': ', 2);

            if(key === 'Join succeeded') {
                const player = this.getPlayerFromUsername(value);
                
                this.getScraper().getProfile(player.getUserId(), profile => {
                    player._setProfile(profile);
                    this._putEvent(new Event.JoinEvent(date, player));
                });
                return;
            }
            
            const validKeys = [
                'Server accepting post-challenge connection from',
                'NotifyAcceptingConnection accepted from'
            ];
            
            if(validKeys.indexOf(key) !== -1)
                this._stateMachineJoinHandleLine(restOfLine);
        }
    }
    
    _putEvent(event) {
        for(const callback of this._callbacks[event.getType()])
            callback(event);
    }
    
    _addPlayer(player) {
        this._playersByName[player.getUsername()] = player;
        this._playersByAddress[player.getAddress()] = player;
    }
    
    _removePlayer(player) {
        delete this._playersByName[player.getUsername()];
        delete this._playersByAddress[player.getAddress()];
    }
    
    _stateMachineJoinHandleLine(line) {
        const player = this._stateMachineJoin.parseLine(line);
                    
        if(player === null)
            return;

        this._addPlayer(player);
    }
}

module.exports = Brikkit;