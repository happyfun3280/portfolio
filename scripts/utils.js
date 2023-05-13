function random(min, max) {
    return Math.random() * (max - min) + min;
}

class Timer {
    constructor(timelimit) {
        this.t = 0;
        this.tLimit = timelimit;
    }

    setTimeLimit(timelimit) {
        this.tLimit = timelimit;
    }

    isExpiredTimer(deltatime) {
        this.t += deltatime;
        if (this.t >= this.tLimit) {
            this.t = 0;
            return true;
        }
        return false;
    }
}

class ColorRGB {
    constructor(red, green, blue, alpha) {
        this.red = red;
        this.green = green;
        this.blue = blue;

        this.alpha = 1; 
        this.hasAlpha = false;
        if (alpha !== undefined) {
            this.alpha = alpha;
            this.hasAlpha = true;
        }
    }

    setRed(red) {
        this.red = red;
    }

    setGreen(green) {
        this.green = green;
    }

    setBlue(blue) {
        this.blue = blue;
    }

    setAlpha(alpha) {
        this.hasAlpha = true;
        this.alpha = alpha;
    }

    getRed() {
        return this.red;
    }

    getGreen() {
        return this.green;
    }

    getBlue() {
        return this.blue;
    }
    
    getAlpha() {
        return this.alpha;
    }

    convertToHSL() {
        let r = this.red / 255;
        let g = this.green / 255;
        let b = this.blue / 255;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let delta = max - min;
        let hue, saturation, lightness;
        let segment, shift;

        lightness = (max + min) / 2;


        if (delta == 0) {
            saturation = hue = 0;
        } else {
            switch (max) {
                case r:
                    segment = (g - b) / delta;
                    shift = 0;
                    if (segment < 0) {
                        shift = 6;
                    }
                    hue = segment + shift;
                    break;
                case g:
                    segment = (b - r) / delta;
                    shift = 2;
                    hue = segment + shift;
                    break;
                case b:
                    segment = (r - g) / delta;
                    shift = 4;
                    hue = segment + shift;
                    break;
            }
            hue = hue * 60;

            saturation = delta / (1 - Math.abs(2 * lightness - 1));
        }

        return new ColorHSL(hue, saturation * 100, lightness * 100, this.alpha);

    }

    toString() {
        if (this.alpha) {
            return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
        } else {
            return `rgb(${this.red},${this.green},${this.blue})`;
        }
    }
}

class ColorHSL {
    constructor(hue, saturation, lightness, alpha) {
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
        
        this.alpha = 1;
        this.hasAlpha = false;
        if (alpha !== undefined) {
            this.alpha = alpha;
            this.hasAlpha = true;
        }
    }

    setHue(hue) {
        this.hue = hue;
    }

    setSaturation(saturation) {
        this.saturation = saturation;
    }

    setLightness(lightness) {
        this.lightness = lightness;
    }

    setAlpha(alpha) {
        this.hasAlpha = true;
        this.alpha = alpha;
    }

    getHue() {
        return this.hue;
    }
    
    getSaturation() {
        return this.saturation;
    }

    getLightness() {
        return this.lightness;
    }

    getAlpha() {
        return this.alpha;
    }

    convertToRGB() {
        let h = this.hue;
        let s = this.saturation / 100;
        let l = this. lightness / 100;
    
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c / 2;
    
        let rgb = { r: 0, g: 0, b: 0 };
    
        if (0 <= h && h < 60) {
            rgb = { r: c, g: x, b: 0 };
        } else if (h < 120) {
            rgb = { r: x, g: c, b: 0 };
        } else if (h < 180) {
            rgb = { r: 0, g: c, b: x };
        } else if (h < 240) {
            rgb = { r: 0, g: x, b: c };
        } else if (h < 300) {
            rgb = { r: x, g: 0, b: c };
        } else if (h < 360) {
            rgb = { r: c, g: 0, b: x };
        }
    
        return new ColorRGB((rgb.r + m) * 255, (rgb.g + m) * 255, (rgb.b + m) * 255, this.alpha);
    }

    toString() {
        if (this.alpha) {
            return `hsla(${this.hue},${this.saturation}%,${this.lightness}%,${this.alpha})`;
        } else {
            return `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`;
        }
    }
}

export { Timer, random, ColorRGB, ColorHSL };