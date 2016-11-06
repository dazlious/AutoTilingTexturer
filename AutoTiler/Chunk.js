const ndarray = require('ndarray');

const ColorAggregator = require('./ColorAggregator.js');
const FileHandler = require('./FileHandler.js');

class Chunk {

    constructor(settings = {
        position: [0, 0],
        size: 128,
        data: null,
        args: {}
    }) {
        this.size = settings.size;
        this.x = settings.position[0] / this.size;
        this.y = settings.position[1] / this.size;
        this.data = settings.data;
        this.args = settings.args;
        this.fileHandler = new FileHandler();
        this.colorAggregator = new ColorAggregator();
    }

    doAutoTiling() {
        const output = this.process();
        this.writeToFile(output);
    }

    writeToFile(output) {
        let out = "";
        const [width, height] = this.data.shape;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                out += `${output.get(x, y, 0)}\t`;
            }
            out += "\n";
        }
        this.fileHandler.saveToFile(out, `${this.x}_${this.y}`, 'txt');
    }

    process() {
        const [width, height] = this.data.shape;
        const output = ndarray([], [width, height]);
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                const colorIndex = this.data.get(x, y, 4);
                const currentColor = this.colorAggregator.colors[colorIndex].toString();
                const mapping = this.args.mapIndices[currentColor];
                if (mapping) {
                    const texture = this.getRandomTexture(mapping.mapToIndex);
                    output.set(x, y, texture);
                } else {
                    console.error(`no mapping found for color ${currentColor}`);
                }
            }
        }
        return output;
    }

    getRandomTexture(arrayOfTextureIndices) {
        return arrayOfTextureIndices[Math.floor(Math.random() * arrayOfTextureIndices.length)] || arrayOfTextureIndices;
    }

}

module.exports = Chunk;
