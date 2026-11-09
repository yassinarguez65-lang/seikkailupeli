NOTE: The Javascript code uses modules. You must run the game on a server (Live Server add-on works fine).

Your task is to implement the GUI (graphical user interface) for an adventure game. All the game logic is already done.

The parts you need to code are marked with TO DO. They are found in gui.js and adventuregame.js.

There are many classes in the game:
- AdventureGame contains the game logic and registers event listeners. It's also passed as parameter to almost everyone else for callbacks.
- AdventureMap contains the map made of MapUnit object.
- Each MapUnit is one square in the map and may contain enemies (Enemy) or quest / events (Quest, ItemQuest).
- PlayerCharacter contains the player character.
- Gui takes care of all graphical interface stuff.

Pay attention to the config file (config.js). It has quite a lot of variables shared by different functions. You will need at least mapWidth (in columns),
mapHeight (in rows) and squareSize (in pixels) to draw the map.

Remember that all object variables (properties) are public. So if Gui knows AdventureGame object as game and AdventureGame the AdventureMap object as adventureMap,
you can e.g. access individual enemy in specific map square from gui with this.game.adventureMap.map[x][y].enemy. This is a common principle: if you need to access
something, check who you know who knows that something (possible with multiple someones in between).