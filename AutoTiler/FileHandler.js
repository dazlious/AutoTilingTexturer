let fs = require("fs-extra");
let path = require("path");
let getPixels = require("get-pixels")

class FileHandler {

    constructor(cwd = process.cwd()) {
        if (!FileHandler.instance) {
            this.cwd = cwd;
            FileHandler.instance = this;
        }
        return FileHandler.instance;
    }

    readFile(path) {
        return fs.readFileSync(path);
    }

    saveToFile(data, name, extension) {
        const exportPath = path.resolve(this.cwd, `${name}.${extension}`);
        return fs.outputFile(exportPath, data, (err) => {
            if (err) {
                console.error(err.msg);
            }
        });
    }

    readImage(path, cb) {
        getPixels(path, (err, pixels) => {
            if (err) {
                console.error(err.msg);
            }
            cb(pixels);
        });
    }

}

FileHandler.instance = null;

module.exports = FileHandler;
