
import { config } from './config.js';
import { PlayerCharacter } from "./playercharacter.js";
import { AdventureMap } from './adventuremap.js';
import { Gui } from './gui.js';

export class AdventureGame {
    constructor() {
        this.player = new PlayerCharacter();
        this.gui = new Gui(this);
        this.adventureMap = new AdventureMap(this);

        this.initialized = false;
        this.moving = false;
        this.step = 0;
        this.targetX = 0;
        this.targetY = 0;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.gui.drawMap(this.adventureMap.map);
        this.gui.drawPlayer(
            config.squareSize * this.player.x,
            config.squareSize * this.player.y
        );
        this.gui.drawInventory(this.player.items);

        this.gui.drawNarrative(
            "You have entered this land in search of the Miraculous Rock. Your only clue is that it's buried under a tree."
        );

        document.getElementById(config.upButton)
            .addEventListener('click', () => this.movePlayerUp());

        document.getElementById(config.downButton)
            .addEventListener('click', () => this.movePlayerDown());

        document.getElementById(config.leftButton)
            .addEventListener('click', () => this.movePlayerLeft());

        document.getElementById(config.rightButton)
            .addEventListener('click', () => this.movePlayerRight());

        document.getElementById(config.okButton)
            .addEventListener('click', () =>
                this.adventureMap.map[this.player.x][this.player.y].inputOk()
            );

        document.getElementById(config.cancelButton)
            .addEventListener('click', () =>
                this.adventureMap.map[this.player.x][this.player.y].inputCancel()
            );

        document.getElementById(config.inventoryCanvas)
            .addEventListener('click', (e) => {
                const rect = e.target.getBoundingClientRect();
                const slot = Math.floor((e.clientX - rect.left) / 50);
                const selectedItem = this.player.items[slot];

                if (selectedItem === 'potion') {
                    this.player.useItem();
                    this.player.healDamage(6);

                    this.gui.drawInventory(this.player.items);
                    this.gui.drawNarrative(
                        `You use a healing potion. Your current health is ${this.player.currentHp} / ${this.player.maxHp}.`
                    );
                }
            });
    }

    movePlayerUp() {
        this.playerTakeStep(this.player.x, this.player.y - 1);
    }

    movePlayerDown() {
        this.playerTakeStep(this.player.x, this.player.y + 1);
    }

    movePlayerLeft() {
        this.playerTakeStep(this.player.x - 1, this.player.y);
    }

    movePlayerRight() {
        this.playerTakeStep(this.player.x + 1, this.player.y);
    }

    playerTakeStep(targetX, targetY) {
        if (this.moving) return;

        if (
            targetX < 0 ||
            targetY < 0 ||
            targetX >= config.mapHeight ||
            targetY >= config.mapWidth
        ) {
            return;
        }

        this.moving = true;
        this.step = 0;
        this.targetX = targetX;
        this.targetY = targetY;

        const startX = this.player.x * config.squareSize;
        const startY = this.player.y * config.squareSize;

        const animate = () => {
            this.step++;

            const progress = this.step / 10;
            const x = startX + (targetX - this.player.x) * config.squareSize * progress;
            const y = startY + (targetY - this.player.y) * config.squareSize * progress;

            this.gui.drawMap(this.adventureMap.map);
            this.gui.drawPlayer(x, y);

            if (this.step < 10) {
                setTimeout(animate, 30);
            } else {
                this.player.x = targetX;
                this.player.y = targetY;
                this.moving = false;

                this.gui.drawMap(this.adventureMap.map);
                this.gui.drawPlayer(
                    this.player.x * config.squareSize,
                    this.player.y * config.squareSize
                );

                this.gui.drawInventory(this.player.items);
                this.adventureMap.enterSquare(this.player.x, this.player.y);
            }
        };

        animate();
    }
}

new AdventureGame();
