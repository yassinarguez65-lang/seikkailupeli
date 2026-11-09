/* This file contains the class Quest (regular quest with either a single narrative or narrative + yes/no choice) and its subclass
ItemQuest (quest that can only be completed with specific quest item). Both represents "quests" or "events" that take place in a single
map square. */
// EXTENSION POINT: add different quest templates as subclasses. E.g. accepting a quest item for delivery. Note that "quest" can only 
// exist in one square, so accepting and delivering item have to be separate quests.
export class Quest {
    /*
    - startText: text to display when player enters the square
    - inputExpected: user input expected (true or false)
    - okText: what to show when user presses OK (only if input expected)
    - cancelText: what to show when user presses Cancel (only if input expected)
    - game: reference to AdventureGame object for callbacks
    */
    constructor(startText, inputExpected, okText, cancelText, game) {
        this.completed = false;         // quest is completed and doesn't exist anymore
        this.isRunning = false;         // quest is running, player can't leave square
        this.startText = startText;
        this.inputExpected = inputExpected;
        this.okText = okText;
        this.cancelText = cancelText;
        this.game = game;
    }

    // this is called from MapUnit when the player enters square
    run() {
        if(!this.completed) {
            this.isRunning = true;

            this.game.gui.drawNarrative(this.startText);

            // if there's no input expected, the quest concludes immediately
            if(!this.inputExpected) {
                this.completed = true;
                this.isRunning = false;
            }
        }
    }

    // This is called through map unit when player presses OK button. Quest concludes.
    inputOk() {
        if(this.isRunning && this.inputExpected) {      // only handle input if it's expected
            this.game.gui.drawNarrative(this.okText);
            this.completed = true;
            this.isRunning = false;
            this.game.gui.enableArrowKeys();
        }
    }

    // This is called through map unit when player presses Cancel button. Quest is aborted and restarts when player enters the square.
    inputCancel() {
        if(this.isRunning && this.inputExpected) {          // only handle input if it's expected
            this.game.gui.drawNarrative(this.cancelText);
            this.isRunning = false;
            this.game.gui.enableArrowKeys();
        }
    }
}

export class ItemQuest extends Quest {
    /*
    - startText: text to display when player enters the square
    - requiredItem: the name of the item player must have in quest items
    - itemText: text to show if player has the item
    - noItemText: text to show if player doesn't have the item
    - okText: what to show when user presses OK to give item
    - cancelText: what to show when user presses Cancel to not give item
    - game: reference to AdventureGame object for callbacks
    */
    constructor(startText, requiredItem, itemText, noItemText, okText, cancelText, game) {
        super(startText, true, okText, cancelText, game);
        this.requiredItem = requiredItem;
        this.itemText = itemText;
        this.noItemText = noItemText;
        this.step = 0;                  // 0 - quest not started, 1 - quest intro shown, waiting for OK to continue, 2 - waiting for yes/no to give item
    }

    // this is called by the map unit when user enters the square
    run() {
        if(!this.completed) {
            this.isRunning = true;

            this.game.gui.drawNarrative(this.startText + " (Press OK to continue.)");
            this.step = 1;
        }
    }

    // This is called through map unit when user presses OK. Figure out what it was for and act accordingly.
    inputOk() {
        if(this.isRunning && this.step == 1) {
            // intro has been shown, does the player have quest item?
            if(this.game.player.questItems.includes(this.requiredItem)) {
                this.game.gui.drawNarrative(this.itemText + " (Press OK for yes, cancel for no.)");
                this.step = 2;
            }
            else {
                this.game.gui.drawNarrative(this.noItemText);
                this.isRunning = false;
                this.game.gui.enableArrowKeys();
            }
        }
        // player chooses to give quest item and quest concludes
        else if(this.isRunning && this.step == 2) {
            this.game.gui.drawNarrative(this.okText);
            this.completed = true;
            this.isRunning = false;
            this.game.gui.enableArrowKeys();
        }
    }

    // only accepted when asked to give item, aborts quest
    inputCancel() {
        if(this.isRunning && this.step == 2 ) {
            this.game.gui.drawNarrative(this.cancelText);
            this.isRunning = false;
        }
    }
}