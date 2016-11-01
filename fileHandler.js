let fs = require("fs-extra");
let path = require("path");
let getPixels = require("get-pixels")

class FileHandler {

    constructor(cwd = process.cwd()) {
        this.cwd = cwd;
    }

    readFile(path) {
        return fs.readFileSync(path);
    }

    saveToFile(data, name, extension) {
        const exportPath = path.resolve(this.cwd, `${name}.${extension}`);
        return fs.outputFileSync(exportPath, JSON.stringify(data));
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

module.exports = FileHandler;
