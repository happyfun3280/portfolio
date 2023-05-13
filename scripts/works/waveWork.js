import { WorkAbstract } from "./workAbstract.js";

export default class WaveWork extends WorkAbstract {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight);
    }

    init() {
        this.stars = [];
        for (let i = 0; i < this.canvasWidth/2; i++) {
            this.stars.push({ x: Math.random() * this.canvasWidth, y: Math.random() * this.canvasHeight * (3/4), s: Math.random() * 2 });
        }

        this.shipShape = [
            [ -10, -20 ],
            [ 0, 0 ],
            [ 100, 0 ],
            [ 120, -20 ],
            [ 50, -20 ],
            [ 50, -30 ],
            [ 0, -30 ],
            [ 0, -20 ]
        ];
        this.shadowShape = [];
        this.rotatedShipShape = [];
        this.rotatedShadowShape = [];


        for (let vertex of this.shipShape) {
            this.shadowShape.push([vertex[0], -vertex[1]]);
        }

        this.waveSpeed = 0;

        this.shipX = this.canvasWidth*(1/4);

        this.touchId = null;

        this.layers = [
            [
                { T: 10000, A: 50, V: 0.04, X: 0 },
                { T: 5000, A: 30, V: 0.05, X: 0 },
                { T: 1000, A: 30, V: 0.05, X: 0 },
            ],
            [
                { T: 10000, A: 40, V: 0.03, X: 0 },
                { T: 5000, A: 30, V: 0.02, X: 0 },
                { T: 1000, A: 30, V: 0.1, X: 0 },
            ],
            [
                { T: 10000, A: 30, V: 0.05, X: 0 },
                { T: 5000, A: 30, V: -0.01, X: 0 },
                { T: 1000, A: 30, V: 0.02, X: 0 },
            ],
            [
                { T: 10000, A: 20, V: -0.05, X: 0 },
                { T: 5000, A: 30, V: -0.05, X: 0 },
                { T: 1000, A: 30, V: -0.01, X: 0 },
            ],
            [
                { T: 10000, A: 10, V: 0.01, X: 0 },
                { T: 5000, A: 30, V: 0.03, X: 0 },
                { T: 1000, A: 30, V: 0.05, X: 0 },
            ],
        ];
    }

    update() {
        super.update();

        if (this.waveSpeed > 0) {
            this.waveSpeed -= 0.001;

            if (this.waveSpeed < 0) this.waveSpeed = 0;
        }

        for (let waves of this.layers) {
            for (let wave of waves) {
                wave.X += wave.V*(1/2) + this.waveSpeed;
            }
        }

        let waves = this.layers[this.layers.length-1];
        let x1 = this.shipX;
        let y1 = 0;
        let x2 = this.shipX + this.shipShape[2][0];
        let y2 = 0;
        for (let wave of waves) {
            y1 += wave.A * Math.sin((Math.PI/wave.T) * x1 + wave.X);
            y2 += wave.A * Math.sin((Math.PI/wave.T) * x2 + wave.X);
        }

        let deg = Math.atan2(y2-y1, x2-x1);
        
        this.rotatedShipShape = [];
        for (let vertex of this.shipShape) {
            this.rotatedShipShape.push([
                x1 + vertex[0]*Math.cos(deg) - vertex[1]*Math.sin(deg),
                y1 + this.canvasHeight*(2/3) + vertex[0]*Math.sin(deg) + vertex[1]*Math.cos(deg)
            ]);
        }

        this.rotatedShadowShape = [];
        for (let vertex of this.shadowShape) {
            this.rotatedShadowShape.push([
                x1 + vertex[0]*Math.cos(deg) - vertex[1]*Math.sin(deg),
                y1 + this.canvasHeight*(2/3) + vertex[0]*Math.sin(deg) + vertex[1]*Math.cos(deg)
            ]);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawLightSky();
        this.drawStars();
        this.drawWaves();
        this.drawShip();
    }

    touchStarted(touch) {
        if (this.waveSpeed < 0.3) this.waveSpeed += 0.02;

    }

    drawLightSky() {
        let gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, "rgb(10, 20, 50)");
        gradient.addColorStop(0.3, "rgb(20, 30, 100)");
        gradient.addColorStop(1, "rgb(100, 100, 120)");
    
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvasWidth, 0);
        this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
        this.ctx.lineTo(0, this.canvasHeight);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawStars() {
        this.ctx.strokeStyle = "white";
        for (let i = 0; i < this.stars.length; i++) {
            this.ctx.lineWidth = this.stars[i].s;
            this.ctx.strokeRect(this.stars[i].x, this.stars[i].y, 1, 1);
        }
    }

    drawWaves() {
        for (let i = 0; i < this.layers.length; i++) {
            let waves = this.layers[i];
            this.ctx.fillStyle = `rgba(0, 0, ${150+100*(i+1)/this.layers.length}, 0.7)`;

            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvasHeight/2);
            for (let x = 0; x < this.canvasWidth + 50; x += 50) {
                let total = 0;
                for (let wave of waves) {
                    total += wave.A * Math.sin((Math.PI/wave.T) * x + wave.X);
                }
    
                this.ctx.lineTo(x, this.canvasHeight*(2/3) +  + total); 
            }
            this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
            this.ctx.lineTo(0, this.canvasHeight);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    drawShip() {
        let gradient = this.ctx.createLinearGradient(
            this.rotatedShipShape[1][0], this.rotatedShipShape[1][1],
            this.rotatedShipShape[6][0], this.rotatedShipShape[6][1]);

        gradient.addColorStop(0, "rgb(0, 0, 0)");
        gradient.addColorStop(1, "rgb(90, 50, 30)");
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(this.rotatedShipShape[0][0], this.rotatedShipShape[0][1]);
        for (let n = 1; n < this.rotatedShipShape.length; n++) {
            this.ctx.lineTo(this.rotatedShipShape[n][0], this.rotatedShipShape[n][1]);
        }
        this.ctx.closePath();
        this.ctx.fill();

        gradient = this.ctx.createLinearGradient(
            this.rotatedShadowShape[1][0], this.rotatedShadowShape[1][1],
            this.rotatedShadowShape[6][0], this.rotatedShadowShape[6][1]);

        gradient.addColorStop(0, "rgb(0, 0, 0, 0.5)");
        gradient.addColorStop(1, "transparent");

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(this.rotatedShadowShape[0][0], this.rotatedShadowShape[0][1]);
        for (let n = 1; n < this.rotatedShadowShape.length; n++) {   
            this.ctx.lineTo(this.rotatedShadowShape[n][0], this.rotatedShadowShape[n][1]);
        }
        this.ctx.closePath();
        this.ctx.fill();


    }
}