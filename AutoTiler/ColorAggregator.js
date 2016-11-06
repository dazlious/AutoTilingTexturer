const Color = require('./Color.js');

class ColorAggregator {

    constructor() {
        if (!Color.instance) {
            this.colors = [];
            Color.instance = this;
        }
        return Color.instance;
    }

    addColor(color = [0, 0, 0, 0]) {
        const c = new Color(color);
        if (!this.exists(c)) {
            this.colors.push(c);
        }
        return this.getIndex(c);
    }

    getIndex(color) {
        return this.colors.findIndex(c => c.equals(color));
    }

    exists(color) {
        return this.colors.findIndex(c => c.equals(color)) !== -1;
    }

}

ColorAggregator.instance = undefined;

module.exports = ColorAggregator;
