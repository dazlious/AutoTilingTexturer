class Color {

    constructor(r = 0, g = 0, b = 0, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    compareTo(color = new Color()) {
        return color instanceof Color && this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
    }

    toString() {
        return `R${this.r}G${this.g}B${this.b}A${this.a}`;
    }

}

Color.createColorFromArray = (rgbaArray = [0, 0, 0, 0]) => {
    return new Color(rgbaArray[0], rgbaArray[1], rgbaArray[2], rgbaArray[3]);
};

module.exports = Color;
