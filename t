[1mdiff --git a/README.md b/README.md[m
[1mindex 418b2f4..b6c6069 100644[m
[1m--- a/README.md[m
[1m+++ b/README.md[m
[36m@@ -37,11 +37,11 @@[m [mNow we will create your first plugin! Create a directory in the *plugins* folder[m
 ```[m
 // when a chat event is received[m
 global.Brikkit.on('chat', evt => {[m
[31m-	// if the player said "!hello"[m
[31m-	if(evt.getContent() === '!hello') {[m
[31m-		// broadcast the message "Hello World!"[m
[31m-		global.Brikkit.say('Hello World!'); [m
[31m-	}[m
[32m+[m[32m  // if the player said "!hello"[m
[32m+[m[32m  if(evt.getContent() === '!hello') {[m
[32m+[m[32m    // broadcast the message "Hello World!"[m
[32m+[m[32m    global.Brikkit.say('Hello World!');[m
[32m+[m[32m  }[m
 });[m
 ```[m
 [m
[36m@@ -53,11 +53,11 @@[m [mThe first step in publishing your plugin is checking that it works as you intend[m
 To get a plugin published officially on the Brikkit repository, however, it **has to** be an useful plugin that adds value to a server, and not just a random experiment. It **must** be released under the MIT license, a free software license that is ideal for small programs, which is the case of plugins. To do this, add a file named `LICENSE` to your plugin, and put the following text in it, making sure to replace `<YEAR>` and `<COPYRIGHT HOLDER>` with the current year and your name:[m
 [m
 > Copyright \<YEAR> \<COPYRIGHT HOLDER>[m
[31m-> [m
[32m+[m[32m>[m
 > Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:[m
 >[m
 > The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.[m
[31m-> [m
[32m+[m[32m>[m
 > THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.[m
 [m
 Make sure to understand the terms of the license and what it means for the software you are publishing. If you do not agree with these terms, you are free to not publish plugins on the official repository.[m
[36m@@ -154,7 +154,7 @@[m [mIs called when a player joins the server.[m
 | Type | Type of the event ("join") | evt.getType() |[m
 [m
 #### Leave Event[m
[31m-Is called when a player joins the server.[m
[32m+[m[32mIs called when a player leaves the server.[m
 ##### Usage[m
 `global.Brikkit.on('leave', evt => ...`[m
 ##### Fields[m
[36m@@ -162,7 +162,7 @@[m [mIs called when a player joins the server.[m
 |-------|-------------|--------|[m
 | Date | Date object containing the date the event happened on Brickadia. | evt.getDate() |[m
 | Player | Player object with details of the player who left | evt.getPlayer() |[m
[31m-| Type | Type of the event ("join") | evt.getType() |[m
[32m+[m[32m| Type | Type of the event ("leave") | evt.getType() |[m
 [m
 ### Server Interface[m
 These commands interface with the server, allowing you to interact with it. Only the commands that were deemed useful were added to this list.[m
[36m@@ -182,14 +182,24 @@[m [mLoads the bricks from a file to the server.[m
 ##### Usage[m
 `global.Brikkit.loadBricks('seattle');`[m
 [m
[32m+[m[32m#### Load Bricks[m
[32m+[m[32mLoads the bricks from a file to the server.[m
[32m+[m[32m##### Usage[m
[32m+[m[32m`global.Brikkit.loadBricks('seattle');`[m
[32m+[m
[32m+[m[32m#### Get players on the server[m
[32m+[m[32mLoads the bricks from a file to the server.[m
[32m+[m[32m##### Usage[m
[32m+[m[32m`global.Brikkit.getPlayers();`[m
[32m+[m
 #### Get Saves[m
 Get all builds that were saved as an unordered array, without the `.brs` extension.[m
 ##### Usage[m
 ```[m
 global.Brikkit.getSaves(saves => {[m
[31m-	// loads the first save if it exists[m
[31m-	if(saves.length > 0)[m
[31m-		global.Brikkit.loadBricks(saves[0]);[m
[32m+[m[32m  // loads the first save if it exists[m
[32m+[m[32m  if(saves.length > 0)[m
[32m+[m[32m    global.Brikkit.loadBricks(saves[0]);[m
 });[m
 ```[m
 [m
[36m@@ -223,18 +233,21 @@[m [mReturns the Brikkit scrapper, allowing you to scrape user profiles based on the[m
 ```[m
 const scraper = global.Brikkit.getScraper();[m
 scraper.getProfile('402ff04c-a0f8-4d07-9471-801889fa0fb2', profile => {[m
[31m-	console.log(`Hello ${profile.getUsername()}!`);[m
[32m+[m[32m  console.log(`Hello ${profile.getUsername()}!`);[m
 });[m
 ```[m
 ### Objects[m
 The join and leave events return a Player object, which must be further queried to retrieve more information. Details about these kinds of objects are available here.[m
 [m
 #### Player Object[m
[31m-| Field | Description | Getter |[m
[31m-|-------|-------------|--------|[m
[31m-| Username | The user name of the player | getUsername() |[m
[31m-| UserID | The user id of the player | getUserId() |[m
[31m-| HandleId | The handle id of the player (similar to user id, but is only valid for a single play session) | getHandleId() |[m
[32m+[m[32m| Field | Description | Getter | Type |[m
[32m+[m[32m|-------|-------------|--------|------|[m
[32m+[m[32m| Username | The user name of the player | getUsername() | string |[m
[32m+[m[32m| UserID | The user id of the player | getUserId() | string |[m
[32m+[m[32m| HandleId | The handle id of the player (similar to user id, but is only valid for a single play session) | getHandleId() | string |[m
[32m+[m[32m| Controller | The controller of the player | getController() | Promise<string> |[m
[32m+[m[32m| Connected | The player connection status | isConnected() | boolean |[m
[32m+[m[32m| Position | The player player position | getPosition() | Promise<[Number, Number, Number]> |[m
 [m
 #### Profile Object[m
 | Field | Description | Getter |[m
