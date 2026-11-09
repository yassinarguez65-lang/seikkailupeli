
import { config } from './config.js';

export class Gui {
    constructor(game) {
        this.game = game;
        this.icons = this.preloadImages();
    }

    drawMap(map) {
        const canvas = document.getElementById(config.mapCanvas);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'lightgreen';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let row = 0; row < config.mapHeight; row++) {
            for (let column = 0; column < config.mapWidth; column++) {
                const unit = map[row][column];
                const x = column * config.squareSize;
                const y = row * config.squareSize;

                if (unit.terrain === 'forest') {
                    ctx.drawImage(this.icons.tree, x, y, config.squareSize, config.squareSize);
                } else if (unit.terrain === 'town') {
                    ctx.drawImage(this.icons.town, x, y, config.squareSize, config.squareSize);
                } else {
                    ctx.fillStyle = 'lightgreen';
                    ctx.fillRect(x, y, config.squareSize, config.squareSize);
                }

                ctx.strokeStyle = 'green';
                ctx.strokeRect(x, y, config.squareSize, config.squareSize);

                if (unit.enemy !== null) {
                    ctx.drawImage(this.icons.enemy, x, y, config.squareSize, config.squareSize);
                }
            }
        }
    }

    drawPlayer(x, y) {
        const canvas = document.getElementById(config.mapCanvas);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            this.icons.player,
            x + 5,
            y + 5,
            config.squareSize - 10,
            config.squareSize - 10
        );
    }

    drawInventory(items) {
        if (items.length > 4) return;

        const canvas = document.getElementById(config.inventoryCanvas);
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 4; i++) {
            const x = i * 50;

            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, 0, 50, 50);

            if (items[i] !== undefined) {
                if (items[i] === 'potion') {
                    ctx.drawImage(this.icons.potion, x, 0, 50, 50);
                }
            }
        }
    }

    drawNarrative(text) {
        const canvas = document.getElementById(config.narrativeCanvas);
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px Helvetica';
        ctx.fillStyle = 'black';

        const lines = this.wrapText(text);

        for (const line of lines) {
            ctx.fillText(line[0], line[1], line[2]);
        }
    }

    enableArrowKeys() {
        document.getElementById(config.upButton).disabled = false;
        document.getElementById(config.downButton).disabled = false;
        document.getElementById(config.leftButton).disabled = false;
        document.getElementById(config.rightButton).disabled = false;
    }

    disableArrowKeys() {
        document.getElementById(config.upButton).disabled = true;
        document.getElementById(config.downButton).disabled = true;
        document.getElementById(config.leftButton).disabled = true;
        document.getElementById(config.rightButton).disabled = true;
    }

    wrapText(text) {
        let canvas = document.getElementById(config.narrativeCanvas);
        let context = canvas.getContext('2d');
        let words = text.split(' ');
        let line = '';
        let testLine = '';
        let lineArray = [];

        let x = 5;
        let y = 15;

        for (let n = 0; n < words.length; n++) {
            testLine += `${words[n]} `;
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > (config.narrativeWidth - 10) && n > 0) {
                lineArray.push([line, x, y]);
                y += config.lineHeight;
                line = `${words[n]} `;
                testLine = `${words[n]} `;
            } else {
                line += `${words[n]} `;
            }

            if (n === words.length - 1) {
                lineArray.push([line, x, y]);
            }
        }

        return lineArray;
    }

    preloadImages() {
        const imageNames = ['player', 'town', 'enemy', 'tree', 'potion'];
        let loadCount = 0;
        const loadTotal = imageNames.length;
        const loadedImages = {};

        for (let i = 0; i < imageNames.length; i++) {
            let image = new Image();

            image.game = this.game;
            image.src = 'images/' + imageNames[i] + '.png';

            loadedImages[imageNames[i]] = image;

            image.onload = function () {
                loadCount++;

                if (loadCount === loadTotal) {
                    this.game.init();
                }
            };
        }

        return loadedImages;
    }
}
