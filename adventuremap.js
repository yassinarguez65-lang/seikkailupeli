/* This class creates the two-dimensional array (x, y) of the map and calls whichever square (MapUnit object) the player enters. */
import { config } from './config.js';
import { MapUnit } from "./mapunit.js";
import { Quest, ItemQuest } from './quest.js';

export class AdventureMap {
    // must receive the AdventureGame object to be able to pass it to map units
    constructor(game) {
        this.game = game;
        this.map = [];

        // create map as empty plains
        for(let row = 0; row < config.mapHeight; row++) {
            this.map[row] = []
            for(let column = 0; column < config.mapWidth; column++) {
                this.map[row][column] = new MapUnit('plains', null, null, null, null, this.game);
            }
        }


        // replace empty plains with different squares where needed
        // EXTENSION POINT: any changes to the map go here. Also quests are defined here.

        // add town and corresponding quest of bringing the Miraculous Rock
        this.map[5][5].terrain = 'town';
        this.map[5][5].quest = new ItemQuest("Welcome to our little town! You are the hero who will bring us the Miraculous Rock, aren't you?", "miraculous rock", "You have found it! Can I have the Rock, please?", "I see you haven't found it yet. Come back when you do.", "Thank you! With this, our town is saved.", "Oh...I see. You don't want to help us. Come back later if you change your mind.", this.game);

        // add forests
        this.map[6][0].terrain = 'forest';
        this.map[7][0].terrain = 'forest';
        this.map[8][0].terrain = 'forest';
        this.map[9][0].terrain = 'forest';
        this.map[7][1].terrain = 'forest';
        this.map[8][1].terrain = 'forest';
        this.map[9][1].terrain = 'forest';
        this.map[7][2].terrain = 'forest';
        this.map[8][2].terrain = 'forest';
        this.map[9][2].terrain = 'forest';
        this.map[8][3].terrain = 'forest';
        this.map[9][3].terrain = 'forest';
        this.map[9][4].terrain = 'forest';

        this.map[0][7].terrain = 'forest';
        this.map[1][7].terrain = 'forest';
        this.map[2][7].terrain = 'forest';
        this.map[0][8].terrain = 'forest';
        this.map[1][8].terrain = 'forest';
        this.map[2][8].terrain = 'forest';
        this.map[0][9].terrain = 'forest';
        this.map[1][9].terrain = 'forest';

        // hide the miraculous rock
        let rockX, rockY;
        let rockHidden = false;
        while(!rockHidden) {
            rockX = Math.floor(Math.random() * config.mapWidth);
            rockY = Math.floor(Math.random() * config.mapHeight);
            if(this.map[rockX][rockY].terrain == 'forest') {
                this.map[rockX][rockY].item = 'miraculous rock';
                rockHidden = true;
            }
        }

        // add a few potions
        this.map[2][5].item = 'potion';
        this.map[6][4].item = 'potion';
        this.map[8][5].item = 'potion';
        this.map[4][9].item = 'potion';

        // This is a stub. To implement actual enemies, create new Enemy objects.
        this.map[2][0].enemy = "enemy";
        this.map[7][2].enemy = "enemy";
        this.map[4][4].enemy = "enemy";
        this.map[2][7].enemy = "enemy";
        this.map[5][9].enemy = "enemy";
        this.map[8][5].enemy = "enemy";
    }

    // this is called from AdventureGame whenever the player moves, and the map figures out which map unit to call
    enterSquare(x, y) {
        this.map[x][y].run();
    }

}