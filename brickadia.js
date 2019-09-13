/* Represents a brickadia server */

const fs = require('fs');
const readline = require('readline');
const { spawn, execSync } = require('child_process');

const PROGRAM_PATH =
    'brickadia/Brickadia/Binaries/Linux/BrickadiaServer-Linux-Shipping';

const CONFIG_PATH = 'brickadia/Brickadia/Saved/Config/LinuxServer';
const GAME_SERVER_SETTINGS = CONFIG_PATH + '/ServerSettings.ini';

const BRICKADIA_FILENAME = 'Brickadia_Alpha4_CL3414_Linux.tar.xz';

const BRICKADIA_URL = 'https://static.brickadia.com/builds/CL3414/' +
        BRICKADIA_FILENAME;

class Brickadia {
    constructor(configuration) {
        this._getBrickadiaIfNeeded();
        
        this._saveConfiguration(configuration);
        
        if(process.env.EMAIL === undefined ||
            process.env.PASSWORD === undefined ||
            process.env.PORT === undefined) {
            throw new Error('Email or password are not set!');
        }
        
        // get user email and password, and server port based on env vars
        const userArg = `-User="${process.env.EMAIL}"`;
        const passwordArg = `-Password="${process.env.PASSWORD}"`;
        const portArg = `-port="${process.env.PORT}"`;

        // start brickadia with aforementioned arguments
        // note that the unbuffer program is required,
        // otherwise the io will eventually stop
        this._spawn = spawn('unbuffer',
            ['-p', PROGRAM_PATH, 'BrickadiaServer',
                '-NotInstalled', '-log', userArg, passwordArg]);
        this._spawn.stdin.setEncoding('utf8');
        
        this._callbacks = {
            close: [],
            exit: [],
            out: [],
            err: []
        };
        
        this._spawn.on('close', code => {
            for(const callback of this._callbacks['close'])
                callback(code);
        });

        this._spawn.on('exit', code => {
            for(const callback of this._callbacks['exit'])
                callback(code);
        });

        const errRl = readline.createInterface({
          input: this._spawn.stderr,
          terminal: false
        });

        errRl.on('line', line => {
            for(const callback of this._callbacks['err'])
                callback(line);
        });

        const outRl = readline.createInterface({
          input: this._spawn.stdout,
          terminal: false
        });

        outRl.on('line', line => {
            for(const callback of this._callbacks['out'])
                callback(line);
        });
        
        const sp = this._spawn;
        process.on('SIGINT', () => {
            sp.kill();
            process.exit();
        });
        
        process.on('uncaughtException', err => {
            sp.kill();
            throw err;
        });
    }
    
    /* 
     * Types available:
     * 'close': on normal brickadia close
     *      args: code
     * 'exit': on abnormal brickadia termination
     *      args: code
     * 'out': on anything being written to stdout
     *      args: line
     * 'err': on anything being written to stderr
     *      args: line
     */
    on(type, callback) {
        if(this._callbacks[type] === undefined)
            throw new Error('Undefined Brickadia.on type.');
        
        this._callbacks[type].push(callback);
    }
    
    write(line) {
        this._spawn.stdin.write(line);
    }
    
    _saveConfiguration(configuration) {
        execSync(`mkdir -p ${CONFIG_PATH}`);
        
        // copy the configuration
        const conf = JSON.parse(JSON.stringify(configuration));
        
        fs.writeFileSync(GAME_SERVER_SETTINGS,
`[Server__BP_ServerSettings_General_C BP_ServerSettings_General_C]
MaxSelectedBricks=1000
MaxPlacedBricks=1000
SelectionTimeout=2.000000
PlaceTimeout=2.000000
ServerName=${configuration.getName()}
ServerDescription=${configuration.getDescription()}
ServerPassword=
MaxPlayers=${configuration.getMaxPlayers()}
bPubliclyListed=True
WelcomeMessage="<color=\\"0055ff\\">Welcome to <b>{2}</>, {1}.</>"
bGlobalRulesetSelfDamage=True
bGlobalRulesetPhysicsDamage=False`);
    }
    
    _getBrickadiaIfNeeded() {
        if(fs.existsSync('brickadia') &&
            fs.existsSync(PROGRAM_PATH) &&
            !fs.existsSync(BRICKADIA_FILENAME))
            return;
        
        execSync(`rm -f ${BRICKADIA_FILENAME}`);
        execSync(`wget ${BRICKADIA_URL}`, {
            stdio: [null, process.stdout, process.stderr]});
        execSync(`rm -rf brickadia/*`);
        execSync(`pv ${BRICKADIA_FILENAME} | tar xJp -C brickadia`, {
            stdio: [null, process.stdout, process.stderr]});
        execSync(`rm ${BRICKADIA_FILENAME}`);
    }
}

module.exports = Brickadia;
