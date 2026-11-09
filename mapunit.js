/* This class represents one square in the map grid. Figures out what methods to call based on what's in the square. */
import { config } from './config.js';
import { PlayerCharacter } from "./playercharacter.js";
import { Enemy } from './enemy.js';
import { Quest, ItemQuest } from "./quest.js";

export class MapUnit {
    /*
    - terrain: currently 'plains' or 'forest'
    - enemy: Enemy object or null (no enemy)
    - item: item name (string) or null (no item found)
    - entryText: shown when player enters this square (quests overwrite)
    - quest: Quest object or null (no quest)
    - game: reference to AdventureGame object for callbacks
    */
    constructor(terrain, enemy, item, entryText, quest, game) {
        this.terrain = terrain;
        this.enemy = enemy;
        this.item = item;
        this.entryText = entryText;
        this.quest = quest;
        this.game = game;
    }

    // Called when the player enters this grid.
    run() {
        // clear narrative window
        this.game.gui.drawNarrative("");

        // there's a quest (event)
        if(this.quest != null) {
            // disable arrow keys until the quest concludes
            this.game.gui.disableArrowKeys();
            this.quest.run();
            // quest is immediately over
            if(!this.quest.isRunning) {
                this.game.gui.enableArrowKeys();
            }
        }
        // there's a monster (can't be in the same square as quest)
        else if(this.enemy != null) {
            // EXTENSION POINT: actual fighting functionality
            this.game.player.takeDamage(4);
            if(this.game.player.currentHp <= 0) {
                this.game.gui.drawNarrative("You ran into a monster! The monster was stronger than you, and you died. Your quest is over.");
                this.game.gui.drawMap(this.game.adventureMap.map);
                this.game.gui.disableArrowKeys();
            }
            else {
                this.game.gui.drawNarrative(`You ran into a monster! A fierce fight commences, leaving the monster dead. Unfortunately, you also take some damage. Your current health is ${this.game.player.currentHp} / ${this.game.player.maxHp}.`);
                this.enemy = null;
                this.game.gui.drawMap(this.game.adventureMap.map);
                this.game.gui.drawPlayer(config.squareSize * this.game.player.x, config.squareSize * this.game.player.y);
            }
        }
        // there's an item (checking for item after monster is intentional - if you return to square after killing monster, there may be item)
        else if(this.item != null) {
            if(this.item == 'miraculous rock') {
                this.game.gui.drawNarrative("You have found the Miraculous Rock! Hurry, take it to the town!");
                this.game.player.addQuestItem('miraculous rock');
                this.item = null;
            }
            else if(this.item == 'potion') {
                this.game.gui.drawNarrative("You found a potion.");
                if(this.game.player.inventoryFull()) {
                    this.game.gui.drawNarrative("You found a potion. But unfortunately, you don't have space for it.");
                } else {
                    this.game.player.addItem('potion');
                    this.game.gui.drawInventory(this.game.player.items);
                    this.item = null;
                }

            }
        }

    }

    // user pressing OK is always redirected to the map unit and forwarded to running quest if there is one
    inputOk() {
        if(this.quest.isRunning) {
            this.quest.inputOk();
            if(!this.quest.isRunning) {
                this.game.gui.enableArrowKeys();
            }
        }
    }

    // user pressing Cancel is always redirected to the map unit and forwarded to running quest if there is one
    inputCancel() {
        if(this.quest.isRunning) {
            this.quest.inputCancel();
            if(!this.quest.isRunning) {
                this.game.gui.enableArrowKeys();
            }
        }
    }
}