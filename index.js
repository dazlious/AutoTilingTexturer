let Worker = require('webworker-threads').Worker;
let FileHandler = require('./fileHandler.js');
let Argv = require('yargs')
    .default({
        "cwd": process.cwd()
    })
    .demand(['source', 'cwd'])
    .argv;

class Main {

    constructor(args) {
        this.settings = this.processArguments(args);
        this.fileHandler = new FileHandler(this.settings.cwd);
        this.fileHandler.readImage(this.settings.source, (pixels) => {
            this.processImage(pixels);
            // this.fileHandler.saveToFile(pixels, 'test', 'txt');
        });
    }

    processImage(imgData) {
        const [width, height, colorChannels] = imgData.shape;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const color = [];
                for (var c = 0; c < colorChannels; c++) {
                    color[c] = imgData.get(x, y, c);
                }
                // console.log(color);
            }
        }
    }

    processArguments(args) {
        const _args = Object.assign({}, args),
            allowed = ['_', '$0'];
        Object.keys(_args)
            .filter(key => allowed.includes(key))
            .forEach(key => delete _args[key]);
        return _args;
    }

}

const main = new Main(Argv);
