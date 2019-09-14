require('dotenv').config({
    path: 'brikkit.conf'
});

const fs = require('fs');
const { execSync } = require('child_process');

execSync(`mkdir -p logs`);
execSync(`mkdir -p conf`);
execSync(`mkdir -p saved`);
execSync(`mkdir -p plugins`);

const dateString = (new Date()).toISOString();
const logFile = `logs/log_${dateString}.txt`;
let stream = fs.createWriteStream(logFile, {flags:'a'});

const oldConsoleLog = console.log;
console.log = (msg) => {
    oldConsoleLog(msg);

    if(process.env.LOG === 'FALSE')
        return;

    stream.write(msg + '\n');
}

stream.on('error', err => {throw err});
stream.on('open', fd => {

    const Brikkit = new (require('./brikkit.js'))({}, stream);
    Brikkit.getPluginSystem().loadAllPlugins();
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

process.on('uncaughtException', err => {
    console.log(' --- SERVER END --- ');
    console.log(err.stack);
    
    fs.appendFileSync(logFile, err.stack);
    process.exit();
});