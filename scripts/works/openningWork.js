
import { WorkAbstract } from "./workAbstract.js";

export default class openningWork extends WorkAbstract {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight);

        this.intervalX = this.canvasWidth / 4;
        this.intervalY = this.canvasHeight / 3;

        this.red = Math.random() * 210 + 100;
        this.green = Math.random() * 210 + 100;
        this.blue = Math.random() * 210 + 100;

        this.red_ = Math.random() * 255;
        this.green_ = Math.random() * 255;
        this.blue_ = Math.random() * 255;

        this.door = {
            y: this.canvasHeight,
            vy: 0,
            ay: 10
        };

        this.mouseY = 0;
        this.mouseInterval = 0;
        this.clicked = false;

        this.time = 0;
        this.timeLimit = 500;
    }

    init() {
        
    }

    update() {
        super.update();
        
        if (!this.clicked) {
            if (this.mouseInterval !== 0) {
                this.door.y -= this.mouseInterval;
                this.mouseInterval = 0;
            }
    
            this.door.vy += this.door.ay;
            this.door.y += this.door.vy;
    
            if (this.door.y >= this.canvasHeight) {
                this.door.y = this.canvasHeight;
                this.door.vy = -this.door.vy*0.5;
    
                this.time += this.deltaTime;
                if (this.time > this.timeLimit) {
                    this.intervalX = Math.random() * 0.1 * this.canvasWidth + this.canvasWidth * 0.3;
                    this.intervalY = Math.random() * 0.1 * this.canvasHeight + this.canvasHeight * 0.3;
                    this.red = Math.random() * 210 + 100;
                    this.green = Math.random() * 210 + 100;
                    this.blue = Math.random() * 210 + 100;
    
                    this.red_ = Math.random() * 255;
                    this.green_ = Math.random() * 255;
                    this.blue_ = Math.random() * 255;
                    this.time = 0;
                }
            }
        }
    }

    draw() {
        let red = this.red;
        let green = this.green;
        let blue = this.blue;
        let interval = 100;

        this.ctx.beginPath();
        this.ctx.fillStyle = `rgb(${red-interval+10}, ${green-interval+10}, ${blue-interval+10})`;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.closePath();

        //top
        this.ctx.beginPath();
        let gradient = this.ctx.createLinearGradient(0, 0, 0, this.intervalY);
        gradient.addColorStop(0, `rgb(${red-interval+40}, ${green-interval+40}, ${blue-interval+40})`);
        gradient.addColorStop(1, `rgb(${red-interval}, ${green-interval}, ${blue-interval})`);
        this.ctx.fillStyle = gradient;
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvasWidth, 0);
        this.ctx.lineTo(this.canvasWidth - this.intervalX, this.intervalY);
        this.ctx.lineTo(this.intervalX, this.intervalY);
        this.ctx.fill();
        this.ctx.closePath();
        
        //left
        this.ctx.beginPath();
        gradient = this.ctx.createLinearGradient(0, 0, this.intervalX, 0);
        gradient.addColorStop(0, `rgb(${red-interval+25}, ${green-interval+25}, ${blue-interval+25})`);
        gradient.addColorStop(1, `rgb(${red-interval}, ${green-interval}, ${blue-interval})`);
        this.ctx.fillStyle = gradient;
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.intervalX, this.intervalY);
        this.ctx.lineTo(this.intervalX, this.canvasHeight - this.intervalY);
        this.ctx.lineTo(0, this.canvasHeight);
        this.ctx.fill();
        this.ctx.closePath();
        
        //bottom
        this.ctx.beginPath();
        gradient = this.ctx.createLinearGradient(0, this.canvasHeight, 0, this.canvasHeight - this.intervalY);
        gradient.addColorStop(0, `rgb(${red}, ${green}, ${blue})`);
        gradient.addColorStop(1, `rgb(${this.red_}, ${this.green_}, ${this.blue_})`);
        this.ctx.fillStyle = gradient;
        this.ctx.moveTo(0, this.canvasHeight);
        this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
        this.ctx.lineTo(this.canvasWidth - this.intervalX, this.canvasHeight - this.intervalY);
        this.ctx.lineTo(this.intervalX, this.canvasHeight - this.intervalY);
        this.ctx.fill();
        this.ctx.closePath();

        //right
        this.ctx.beginPath();
        gradient = this.ctx.createLinearGradient(this.canvasWidth, 0, this.canvasWidth - this.intervalX, 0);
        gradient.addColorStop(0, `rgb(${red-interval+20}, ${green-interval+20}, ${blue-interval+20})`);
        gradient.addColorStop(1, `rgb(${red-interval}, ${green-interval}, ${blue-interval})`);
        this.ctx.fillStyle = gradient;
        this.ctx.moveTo(this.canvasWidth, 0);
        this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
        this.ctx.lineTo(this.canvasWidth - this.intervalX, this.canvasHeight - this.intervalY);
        this.ctx.lineTo(this.canvasWidth - this.intervalX, this.intervalY);
        this.ctx.fill();
        this.ctx.closePath();


        this.ctx.beginPath();
        this.ctx.fillStyle = `rgb(214, 214, 214)`;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.door.y - this.mouseInterval);
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgb(0, 0, 0)`;
        this.ctx.lineWidth = 40;
        this.ctx.moveTo(0, this.door.y - this.mouseInterval);
        this.ctx.lineTo(this.canvasWidth, this.door.y - this.mouseInterval);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.lineWidth = 10;
        for (let i = 1; i < 10; i++) {
            this.ctx.moveTo(0, this.door.y - this.mouseInterval - this.canvasHeight * (i/10));
            this.ctx.lineTo(this.canvasWidth, this.door.y - this.mouseInterval - this.canvasHeight * (i/10));
        }
        this.ctx.stroke();
        this.ctx.closePath();

        for (let i = 1; i < 10; i++) {
            this.ctx.beginPath();

            let y = this.door.y - this.mouseInterval - this.canvasHeight * (i/10);
            gradient = this.ctx.createLinearGradient(0, y + 3.5, 0, y + 20);
            gradient.addColorStop(0, `rgb(173, 173, 173)`);
            gradient.addColorStop(1, `rgb(214, 214, 214)`);
            this.ctx.fillStyle = gradient;
    
            this.ctx.fillRect(0, y + 3.5, this.canvasWidth, 20);

            this.ctx.closePath();
        }
    }
    
    mousedown(e) {
        this.clicked = true;
        this.mouseY = e.clientY;
        this.time = 0;
    }

    mousemove(e) {
        if (this.clicked)
            if (this.mouseY - e.clientY > 0)
                this.mouseInterval = this.mouseY - e.clientY;
    }

    mouseup(e) {
        this.clicked = false;
    }
};