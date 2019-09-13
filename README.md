# Welcome to Brikkit!
Brikkit is an **unofficial** plugin system for Brickadia, which now supports both Windows and Linux for hosting servers. It is still in its very early stages, and is limited to what you can do with the console of a dedicated Brickadia server. Many types of plugins can be built, from an auto saver, to a plugin that generates a map of the world. Interested already? Host your own Brikkit server by following the instructions below!

## User Manual
This manual will set you up with your own Brikkit server.

### Windows Manual
Follow the instructions in [this repository](https://github.com/n42k/brikkit_docker) to install Brikkit for Windows.

### Linux Manual
I assume you are using Ubuntu 18.04 LTS. Firstly, you need to install the required packages:
`# apt install expect wget pv tar unzip xz-utils`

Then, download and extract the latest [Brikkit binary](https://github.com/n42k/brikkit/releases), placing it in a convenient place. Configure the server by editing the `brikkit.conf` file. Finally, run `$ ./brikkit`, and the server should start. You should be able to connect to your server at this point through the server list if you have forwarded your ports correctly, otherwise try connecting to `127.0.0.1`.

### Post-Installation
To install plugins, take a look at the [plugin list](https://github.com/n42k/brikkit_plugins). After choosing the plugins you wish to install, download them from the link given, and paste the *.zip* files in the *plugins* folder.

If you run through any problem, feel free to create an issue in the *Issues* tab of this repository.

## Contributing
As an user of Brikkit, you are already contributing to Brikkit by performing much needed tests! Make sure to share any issues or ideas you might have in the *Issues* tab of this repository.

Furthermore, you can implement plugins yourself that other people can use, or contribute to Brikkit itself by forking and making a pull request (based on an already created issue, or not).

You may also contribute in other ways:
* Recommend Brikkit to your friends.
* Aid people in troubleshooting their Brikkit server, modding or developing Brikkit further.
* Improve the documentation (which, at the moment, is this document).

## Plugin Developer Manual
To create plugins for Brickadia using Brikkit, you must first know JavaScript. If you do not know it already, I suggest starting with [Eloquent Javascript](https://eloquentjavascript.net), which is, in my opinion, a good book to learn JavaScript from, and free to read online.

### Creating your first plugin
Now we will create your first plugin! Create a directory in the *plugins* folder, you can call it `hello world`, for instance. In that directory, create a file named `index.js` and put the following code in it:

```
// when a chat event is received
global.Brikkit.on('chat', evt => {
	// if the player said "!hello"
	if(evt.getContent() === '!hello') {
		// broadcast the message "Hello World!"
		global.Brikkit.say('Hello World!'); 
	}
});
```

And it is done! This plugin will broadcast to all players the message "Hello World!" every time a player says "!hello". Simply start the server and join it to try it out. To discover what else you can use in your plugins, go to the final section of this document, *Plugin API docs*.

### Publishing your plugin
The first step in publishing your plugin is checking that it works as you intended. Only after that you can move onto publishing it. To convert your plugin into a package you can send to your friends for them to install, simply zip the contents of your plugin directory (not the directory itself), so that the files in the plugin folder are at the root of the *.zip* file. After that is done, you can transfer the file to your friends and they can use your plugin by putting the *.zip* file inside the plugins directory!

To get a plugin published officially on the Brikkit repository, however, it **has to** be an useful plugin that adds value to a server, and not just a random experiment. It **must** be released under the MIT license, a free software license that is ideal for small programs, which is the case of plugins. To do this, add a file named `LICENSE` to your plugin, and put the following text in it, making sure to replace `<YEAR>` and `<COPYRIGHT HOLDER>` with the current year and your name:

> Copyright \<YEAR> \<COPYRIGHT HOLDER>
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Make sure to understand the terms of the license and what it means for the software you are publishing. If you do not agree with these terms, you are free to not publish plugins on the official repository.

After this step is done, create a git repository inside the directory of the plugin you wish to publish: `git init`, add all essential files: `git add index.js LICENSE.md` (and any other files that are required for the plugin to run), and commit your files: `git commit -m "First commit"`. Then, using GitHub, create a repository for your plugin, and push your local git repository there. To conclude this part, create a *.zip* file of the essential files of your plugin, and [create a release](https://help.github.com/en/articles/creating-releases), making sure to attach the *.zip* file that you just created as a binary.

The hardest parts have been done. Finally, create an issue in [this repository](https://github.com/n42k/brikkit_plugins), with the template below. Your plugin will then be considered for inclusion into the official repository.
```
Tags: simple, chat
Description: this plugin says "Hello World!" whenever someone says "!hello"
Release: <LINK TO YOUR RELEASE>
```
Thank you very much for contributing to Brikkit!

### Saving and loading data

There are four main directories in a Brikkit installation: `brickadia`, `plugins`, `conf` and `saved`. Brickadia itself is stored in the first one, whereas plugins are stored in the second. The `conf` directory is used to store configuration files (you can see an example of this in the [autosaver plugin](https://github.com/n42k/brikkit_autosaver). On the other hand, `saved` is used to store data between runs of the game, such as how much money each player has. You are free to use any format you deem appropriate in both cases, such as JSON or sqlite3. If you require higher performance, you can also save data to a proper database, but that will require users to install it in order to use your plugin.

### Using third party libraries

If you wish to use third party libraries in your plugins, if you are on Windows, it is extremely highly recommended that you use the Windows Subsystem for Linux to execute the following steps.

Install nodejs and npm: `# apt install nodejs npm`. Move into your plugin directory, and start a npm project there: `$ npm init -y`. Edit the created `package.json` file so that the license is MIT.

I will give an example of using the `is-odd` library. Install the library inside your plugin directory: `$ npm install is-odd --save` Use it in `index.js`:
```
const  isOdd  =  require('is-odd');
console.log(isOdd('3')); // will print true when you start the server
```
To test the third party library, simply run the server: `$ ./brikkit`. It should output `true` at the very beginning assuming this is the only plugin you have.

To package this plugin, zip everything in the folder (including `node_modules`) and send it to your friends! Alternatively, to publish it, push the `package.json` and `package-lock.json` files to the git repository, and create a release with the *.zip* file as described at the beginning of this paragraph.

## Brikkit Developer Manual

First install the required packages: `# apt install unbuffer wget pv tar unzip nodejs npm make`, then fork and clone your fork, create a `brikkit.conf` file with your Brickadia credentials and wanted server configuration in the root of the project's directory. Afterwards, inside the directory, get the required npm packages (`$ npm update`) and install pkg: `# npm install -g pkg`. Finally, run `$ node server` to start a Brikkit server. You should be able to connect to it using the server list or `127.0.0.1` if you have not forwarded your ports.

You can treat this as a normal Brikkit installation, you can make a `plugins` directory and start testing plugins there, while modifying the Brikkit core. To create a debug binary, you can run `$ make debug` or, to create a release binary, run `$ make`.

Before developing a feature, see if it is already described in Issues, if not, it is best to describe it there, for approval, before you start creating any code. To implement the feature, create a new branch in your fork, implement your new feature there, and then create a pull request, merging your branch with the master branch of the main repository.

### Documentation

Brikkit is organized as follows:

| Directory | Purpose |
|-----------|---------|
| /         | Contains mainly glue code between Brikkit and its components |
| /data     | Contains the data objects described in the Plugin API docs |
| /events   | Contains the various events described in the Plugin API docs |

The files in the root directory have the following responsibilities:

| File | Responsibility |
|-----------|---------|
| /Makefile | Describes how to make the binary |
| /brickadia.js | Glue code for starting and interacting with the Brickadia server |
| /brikkit.conf.default | The default brikkit.conf, used for the release build |
| /brikkit.js | The heart of the Brikkit server: all components are centered here, communicating with each other. |
| /package-lock.json & /package.json | Manages the dependencies that are required to run Brikkit |
| /pluginsystem.js | Implements the plugin system that Brikkit uses, allowing loading of directories and zip files |
| /scraper.js | Implements the scrapper that allows loading users' profiles |
| /server.js | Initial file, where execution begins. Loads configuration values from brikkit.conf and creates a Brikkit server. |
| /sm_join.js | The state machine that is responsible for correctly interpreting when a player joins. |
| /brickadia.js | Glue code for interacting with the terminal |

To see the output of the underlying Brickadia server, you can write `DEV=TRUE` in the `brikkit.conf` file, which is very useful for debugging. Do take a look at the section below for a specific description of each event, how you can interact with the Brickadia server, and the various data objects that are available for you to use.

## Plugin API docs
### Events
There are 3 kinds of events available: chat, join, and leave.

#### Chat Event
Is called when a player sends a message to chat.
##### Usage
`global.Brikkit.on('chat', evt => ...`
##### Fields
| Field | Description | Getter |
|-------|-------------|--------|
| Date | Date object containing the date the event happened on Brickadia. | evt.getDate() |
| Sender | Player object with details of the sender | evt.getSender() |
| Content | Content of the message | evt.getContent() |
| Type | Type of the event ("chat") | evt.getType() |

#### Join Event
Is called when a player joins the server.
##### Usage
`global.Brikkit.on('join', evt => ...`
##### Fields
| Field | Description | Getter |
|-------|-------------|--------|
| Date | Date object containing the date the event happened on Brickadia. | evt.getDate() |
| Player | Player object with details of the player who joined | evt.getPlayer() |
| Type | Type of the event ("join") | evt.getType() |

#### Leave Event
Is called when a player joins the server.
##### Usage
`global.Brikkit.on('leave', evt => ...`
##### Fields
| Field | Description | Getter |
|-------|-------------|--------|
| Date | Date object containing the date the event happened on Brickadia. | evt.getDate() |
| Player | Player object with details of the player who left | evt.getPlayer() |
| Type | Type of the event ("join") | evt.getType() |

### Server Interface
These commands interface with the server, allowing you to interact with it. Only the commands that were deemed useful were added to this list.

#### Say
Broadcasts a message to the whole server.
##### Usage
`global.Brikkit.say('hello world!');`

#### Save Bricks
Saves the bricks in the server to a file.
##### Usage
`global.Brikkit.saveBricks('seattle');`

#### Load Bricks
Loads the bricks from a file to the server.
##### Usage
`global.Brikkit.loadBricks('seattle');`

#### Clear All Bricks
DANGER: clears all bricks in the server.
##### Usage
`global.Brikkit.clearAllBricks();`

#### Change Map
Changes the map the server is running on. Will disconnect all players.
##### Usage
`global.Brikkit.changeMap('Studio');`
The maps available are: `Studio_Night`, `Studio_Day`, `Studio`, `Plate`, `Peaks`.

#### Get Player List
Returns an array of all the players currently in the server.
##### Usage
`global.Brikkit.getPlayerList()`

#### Get Player From Username
Finds a player object by their username.
##### Usage
`global.Brikkit.getPlayerFromUsername(username);`

#### Get Plugin System
Returns the plugin system of the server, allowing you to load mods on the fly. Do not load plugins twice!
##### Usage
```
const pluginSystem = global.Brikkit.getPluginSystem(address);
pluginSystem.loadPlugin('example.zip'); // loads a plugin from a zip
pluginSystem.loadPlugin('hello world'); // loads a plugin from a directory
```
#### Get Scraper
Returns the Brikkit scrapper, allowing you to scrape user profiles based on the user id.
##### Usage
```
const scraper = global.Brikkit.getScraper();
scraper.getProfile('402ff04c-a0f8-4d07-9471-801889fa0fb2', profile => {
	console.log(`Hello ${profile.getUsername()}!`);
});
```
### Objects
The join and leave events return a Player object, which must be further queried to retrieve more information. Details about these kinds of objects are available here.

#### Player Object
| Field | Description | Getter |
|-------|-------------|--------|
| Username | The user name of the player | getUsername() |
| UserID | The user id of the player | getUserId() |
| HandleId | The handle id of the player (similar to user id, but is only valid for a single play session) | getHandleId() |
| IP | The IP of the player | getIp() |
| Port | The port of the player | getPort() |
| Profile | The profile object of the player (as described below) | getProfile() |

#### Profile Object
| Field | Description | Getter |
|-------|-------------|--------|
| Username | The user name of the player | getUsername() |
| UserID | The user id of the player | getUserId() |
| Gender | The gender of the player ('male', 'female' or null, if there is no gender selected) | getGender() |
| Where | Whether the player is ingame or in real life (can be 'ingame' or 'outside') | getWhere() |
| Last Seen | Date object representing when the player was last seen | getLastSeen() |
| Location | The location of the player | getLocation() |
| User Text | The user text of the player | getUserText() |
