const Worker = require('webworker-threads').Worker;

const FileHandler = require('./fileHandler.js');
const ArgumentParser = require('./argumentParser.js');
const Color = require('./color.js');

class Main {

    constructor() {
        this.init();
        this.fileHandler.readImage(this.settings.source, (pixels) => {
            this.processImage(pixels);
            // this.fileHandler.saveToFile(pixels, 'test', 'txt');
        });
    }

    init() {
        this.argumentParser = new ArgumentParser();
        this.settings = this.argumentParser.getSettings();
        this.fileHandler = new FileHandler(this.settings.dir);
    }

    processImage(imgData) {
        const [width, height, colorChannels] = imgData.shape;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = [];
                for (var c = 0; c < colorChannels; c++) {
                    color[c] = imgData.get(x, y, c);
                }
                const existsInMap = this.settings.mapIndices[Color.createColorFromArray(color).toString()];
                if (existsInMap) {
                    console.log(existsInMap.mapToIndex);
                }
                // Color.createColorFromArray(color).compareTo(new Color(255, 0, 0, 255));
            }
        }
    }

}

const main = new Main();
