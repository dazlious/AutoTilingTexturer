class Color {

    constructor(rgbaArray = [0, 0, 0, 0]) {
        this.r = rgbaArray[0];
        this.g = rgbaArray[1];
        this.b = rgbaArray[2];
        this.a = rgbaArray[3];
    }

    equals(color = new Color()) {
        return color instanceof Color && this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
    }

    toString() {
        return `R${this.r}G${this.g}B${this.b}A${this.a}`;
    }

}

module.exports = Color;
