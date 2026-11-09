/* 
This class represents the player character.
EXTENSION POINT: Any changes to
- character stats
- inventory or quest items
- the way the character fights
go here.
*/
import { config } from './config.js';

export class PlayerCharacter {
    constructor() {
        this.maxHp = 10;
        this.currentHp = 10;
        this.items = ['potion'];
        this.questItems = [];
        this.x = config.startX;
        this.y = config.startY;
    }

    takeDamage(amount) {
        this.currentHp -= amount;
    }

    healDamage(amount) {
        this.currentHp += amount;
        if(this.currentHp > this.maxHp) {
            this.currentHp = this.maxHp;
        }
    }

    inventoryFull() {
        if(this.items.length == 4) {
            return true;
        }
        else {
            return false;
        }
    }

    addItem(item) {
        this.items.push(item);
    }

    // currently the only possible item is a healing potion, so it doesn't matter which one is removed
    // EXTENSION POINT: if removing specific items, make sure not to leave holes in the array
    useItem() {
        this.items.pop();
    }

    addQuestItem(item) {
        this.questItems.push(item);
    }
}