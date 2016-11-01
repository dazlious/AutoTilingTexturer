const Argv = require('yargs');
const Fs = require("fs-extra");

const Color = require("./color.js");

class ArgumentParser {

    constructor() {
        this.initArgumentOptions();
    }

    initArgumentOptions() {
        this.args = Argv
        .option('d', {
            alias: 'directory',
            nargs: 1,
            description: 'current working directory',
            required: true,
            type: 'string',
            normalize: true
        })
        .option('s', {
            alias: 'source',
            nargs: 1,
            description: 'source image',
            required: true,
            type: 'string',
            normalize: true
        })
        .config('settings', (configPath) => {
            return JSON.parse(Fs.readFileSync(configPath, 'utf-8'));
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
