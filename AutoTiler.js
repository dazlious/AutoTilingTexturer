const ndarray = require('ndarray');

const FileHandler = require('./AutoTiler/FileHandler.js');
const Chunk = require('./AutoTiler/Chunk.js');
const ArgumentParser = require('./AutoTiler/ArgumentParser.js');
const ColorAggregator = require('./AutoTiler/ColorAggregator.js');

class AutoTiler {

    constructor() {
        this.init();
        this.fileHandler.readImage(this.settings.image, (imageData) => {
            // TODO: do in one
            const flatData = this.flattenImageData(imageData);
            const neighboorAwareData = this.createNeighboorMatrices(flatData);

            const chunks = this.createChunks(neighboorAwareData);
            for (const chunk of chunks) {
                chunk.doAutoTiling();
            }
        });
    }

    createNeighboorMatrices(data) {
        const [width, height] = data.shape;
        let neighboors;
        let enrichedData = new ndarray([], [width, height, 9]);
        enrichedData.step(9);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                neighboors = this.detectIdenticalNeighboors(data, x, y);
                for (let n = 0; n < neighboors.length; n++) {
                    const current = neighboors[n];
                    enrichedData.set(x, y, n, current);
                }
            }
        }
        return enrichedData;
    }

    detectIdenticalNeighboors(data, x, y) {
        const texture = data.get(x, y);
        return [
            ~~(data.get(x - 1, y - 1) === texture),
            ~~(data.get(x, y - 1) === texture),
            ~~(data.get(x + 1, y - 1) === texture),
            ~~(data.get(x - 1, y) === texture),
            data.get(x, y),
            ~~(data.get(x + 1, y) === texture),
            ~~(data.get(x - 1, y + 1) === texture),
            ~~(data.get(x, y + 1) === texture),
            ~~(data.get(x + 1, y + 1) === texture)
        ];
    }

    clamp(v = 0, min = v, max = v) {
        return Math.min(Math.max(v, min), max);
    }

    createChunks(imageData) {
        const chunks = [];
        const [xSize, ySize] = imageData.shape;

        if ((xSize % this.settings.chunksize) || (ySize % this.settings.chunksize)) {
            throw new Error(`${xSize}x${ySize} can not be divided by ${this.settings.chunksize}`);
        }
        for (let y = 0; y < ySize; y += this.settings.chunksize) {
            for (let x = 0; x < xSize; x += this.settings.chunksize) {
                chunks.push(new Chunk({
                    data: imageData.lo(x, y).hi(this.settings.chunksize, this.settings.chunksize),
                    position: [x, y],
                    size: this.settings.chunksize,
                    args: this.settings
                }));
            }
        }
        return chunks;
    }

    init() {
        this.argumentParser = new ArgumentParser();
        this.settings = this.argumentParser.getSettings();
        this.fileHandler = new FileHandler(this.settings.destination);
        this.colorAggregator = new ColorAggregator();
    }

    flattenImageData(imageData) {
        const [width, height, colorChannels] = imageData.shape;
        const flatData = ndarray(new Array(width * height), [width, height]);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = this.getColorForPosition(imageData, x, y, colorChannels);
                const colorIndex = this.colorAggregator.addColor(color);
                flatData.set(x, y, colorIndex);
            }
        }
        return flatData;
    }

    getColorForPosition(imageData, x, y, channels) {
        const color = [];
        for (let c = 0; c < channels; c++) {
            color[c] = imageData.get(x, y, c);
        }
        return color;
    }

}

const _autoTiler = new AutoTiler();
