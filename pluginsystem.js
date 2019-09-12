const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const tmp = require('tmp');
tmp.setGracefulCleanup();

class PluginSystem {
    constructor() {
        this._plugins = {};
    }
    
    getAvailablePlugins() {
        return fs.readdirSync('plugins');
    }
    
    loadPlugin(plugin) {
        if(plugin.endsWith('zip'))
            this._loadPluginZip(plugin);
        else
            this._loadPluginDirectory(plugin);
    }
    
    loadAllPlugins() {
        const pluginPaths = this.getAvailablePlugins()
            .map(plugin => path.parse(plugin));
        
        // if 2 plugins have the same name (/example/ and /example.zip),
        // let's give priority to the ones that are in a directory
        // for this, we create a mapping of a bare plugin name (example)
        // and the best [that we found so far] filename
        const pluginNameMap = {};
        
        pluginPaths.forEach(plugin => {
            if(plugin.name in pluginNameMap) {
                // if the plugin is already in the map, we gotta compare them
                const otherPlugin = pluginNameMap[plugin.name];
                
                // if the other plugin is a zip, the current plugin is
                // a directory, thus we prefer it to the other
                if(otherPlugin.ext === 'zip')
                    pluginNameMap[plugin.name] = plugin;
                else // otherwise we prefer the other plugin
                    pluginNameMap[plugin.name] = otherPlugin;
            } else // if the plugin isn't in the mapping, simply add it
                pluginNameMap[plugin.name] = plugin;
        });
        
        Object.values(pluginNameMap).forEach(pluginPath => this.loadPlugin(pluginPath.base));
    }
    
    _loadPluginZip(plugin) {
        const path = tmp.dirSync().name;
        execSync(`unzip ./plugins/${plugin} -d ${path}`);
        require(`${path}/index.js`);
    }
    
    _loadPluginDirectory(plugin) {
        require(`${process.cwd()}/plugins/${plugin}/index.js`);
    }
}

module.exports = PluginSystem;