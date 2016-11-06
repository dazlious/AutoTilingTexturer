const Argv = require('yargs');
const Fs = require("fs-extra");

class ArgumentParser {

    constructor() {
        this.initArgumentOptions();
    }

    initArgumentOptions() {
        this.args = Argv
        .config('config', (configPath) => {
            let t = JSON.parse(Fs.readFileSync(configPath, 'utf-8'));
            return t;
        })
        .option('destination', {
            nargs: 1,
            description: 'current working directory',
            required: true,
            type: 'string',
            normalize: true
        })
        .option('chunksize', {
            nargs: 1,
            description: 'size of chunks',
            default: 128,
            type: 'number'
        })
        .option('image', {
            nargs: 1,
            description: 'source image',
            required: true,
            type: 'string',
            normalize: true
        })
        .epilog('Copyright 2016 by dazlious')
        .argv;
    }

    getSettings() {
        const _args = Object.assign({}, this.args),
            deleteKeys = ['_', '$0'];
        Object.keys(_args)
            .filter(key => deleteKeys.includes(key))
            .forEach(key => delete _args[key]);
        return _args;
    }

}

module.exports = ArgumentParser;
