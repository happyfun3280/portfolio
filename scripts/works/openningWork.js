
import { WorkAbstract } from "./workAbstract.js";
import { Timer, random, ColorRGB, ColorHSL } from "../utils.js";

export default class openningWork extends WorkAbstract {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight);
    }

    init() {
        this.outerRectCenterX = this.canvasWidth/2;
        this.outerRectCenterY = this.canvasHeight/2;

        this.innerRectCenterX = this.canvasWidth/2;
        this.innerRectCenterY = this.canvasHeight/2;

        this.outerRectWidth = Math.min(this.canvasWidth*0.7, this.canvasHeight*0.7);
        this.outerRectHeight = this.outerRectWidth;
        
        this.innerRectWidth = this.outerRectWidth/2;
        this.innerRectHeight = this.innerRectWidth;

        this.outerRect = {
            p1: { x: this.outerRectCenterX - this.outerRectWidth/2, y: this.outerRectCenterY - this.outerRectHeight/2 },
            p2: { x: this.outerRectCenterX + this.outerRectWidth/2, y: this.outerRectCenterY - this.outerRectHeight/2 },
            p3: { x: this.outerRectCenterX + this.outerRectWidth/2, y: this.outerRectCenterY + this.outerRectHeight/2 },
            p4: { x: this.outerRectCenterX - this.outerRectWidth/2, y: this.outerRectCenterY + this.outerRectHeight/2 }
        }

        this.innerRect = {
            p1: { x: this.innerRectCenterX - this.innerRectWidth/2, y: this.innerRectCenterY - this.innerRectHeight/2 },
            p2: { x: this.innerRectCenterX + this.innerRectWidth/2, y: this.innerRectCenterY - this.innerRectHeight/2 },
            p3: { x: this.innerRectCenterX + this.innerRectWidth/2, y: this.innerRectCenterY + this.innerRectHeight/2 },
            p4: { x: this.innerRectCenterX - this.innerRectWidth/2, y: this.innerRectCenterY + this.innerRectHeight/2 }
        }

        this.door = {
            width: this.outerRectWidth,
            height: this.outerRectHeight,
            x: this.outerRect.p1.x,
            originY: this.outerRect.p1.y,
            y: this.outerRect.p1.y,
            vy: 0
        }

        this.tempY = this.door.y;
        this.prevY = 0;

        this.hue = random(0, 360);
        this.saturation = random(0, 100);

        this.floorHue = random(0, 360);
        this.floorSaturation = random(70, 100);

        this.timer = new Timer(500);

        this.touchId = null;
    }

    update() {
        super.update();
        this.updateInnerRect();
        this.updateDoor();
    }

    draw() {
        this.ctx.fillStyle = new ColorRGB(230, 230, 230);
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.drawPlace();
        this.drawDoor();

        // this.drawOuterAndInnerRectLine();
        // this.drawPlaceLine();

    }

    updateInnerRect() {
        if (this.door.y < this.door.originY) return;

        if (!this.timer.isExpiredTimer(this.deltaTime)) return;

        this.hue = random(0, 255);
        this.saturation = random(0, 100);
        
        this.floorHue = random(0, 255);
        this.floorSaturation = random(0, 100);
        
        this.innerRectWidth = random(50, this.outerRectWidth/2);
        this.innerRectHeight = this.innerRectWidth;

        this.innerRectCenterX = random(this.outerRect.p1.x + this.innerRectWidth/2, this.outerRect.p2.x - this.innerRectWidth/2);
        this.innerRectCenterY = random(this.outerRect.p1.y + this.innerRectHeight/2, this.outerRect.p4.y - this.innerRectHeight/2);


        this.innerRect = {
            p1: { x: this.innerRectCenterX - this.innerRectWidth/2, y: this.innerRectCenterY - this.innerRectHeight/2 },
            p2: { x: this.innerRectCenterX + this.innerRectWidth/2, y: this.innerRectCenterY - this.innerRectHeight/2 },
            p3: { x: this.innerRectCenterX + this.innerRectWidth/2, y: this.innerRectCenterY + this.innerRectHeight/2 },
            p4: { x: this.innerRectCenterX - this.innerRectWidth/2, y: this.innerRectCenterY + this.innerRectHeight/2 }
        }
    }

    updateDoor() {
        if (this.touchId !== null) return;

        this.door.vy += 4;
        this.door.y += this.door.vy;
        if (this.door.y > this.door.originY) {
            this.door.y = this.door.originY;
            this.door.vy = -this.door.vy * 0.5;
        }
    }

    drawOuterAndInnerRectLine() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.outerRect.p1.x, this.outerRect.p1.y);
        this.ctx.lineTo(this.outerRect.p2.x, this.outerRect.p2.y);
        this.ctx.lineTo(this.outerRect.p3.x, this.outerRect.p3.y);
        this.ctx.lineTo(this.outerRect.p4.x, this.outerRect.p4.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.innerRect.p1.x, this.innerRect.p1.y);
        this.ctx.lineTo(this.innerRect.p2.x, this.innerRect.p2.y);
        this.ctx.lineTo(this.innerRect.p3.x, this.innerRect.p3.y);
        this.ctx.lineTo(this.innerRect.p4.x, this.innerRect.p4.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }
    
    drawPlaceLine() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.outerRect.p1.x, this.outerRect.p1.y);
        this.ctx.lineTo(this.innerRect.p1.x, this.innerRect.p1.y);
        this.ctx.moveTo(this.outerRect.p2.x, this.outerRect.p2.y);
        this.ctx.lineTo(this.innerRect.p2.x, this.innerRect.p2.y);
        this.ctx.moveTo(this.outerRect.p3.x, this.outerRect.p3.y);
        this.ctx.lineTo(this.innerRect.p3.x, this.innerRect.p3.y);
        this.ctx.moveTo(this.outerRect.p4.x, this.outerRect.p4.y);
        this.ctx.lineTo(this.innerRect.p4.x, this.innerRect.p4.y);
        this.ctx.closePath();
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
    }
    
    drawPlace() {

        //top
        this.ctx.beginPath();
        this.ctx.moveTo(this.outerRect.p1.x, this.outerRect.p1.y);
        this.ctx.lineTo(this.innerRect.p1.x, this.innerRect.p1.y);
        this.ctx.lineTo(this.innerRect.p2.x, this.innerRect.p2.y);
        this.ctx.lineTo(this.outerRect.p2.x, this.outerRect.p2.y);
        this.ctx.closePath();
        let gradient = this.ctx.createLinearGradient(0, this.outerRect.p1.y, 0, this.innerRect.p1.y);
        gradient.addColorStop(0, new ColorHSL(this.hue, this.saturation, 70).toString());
        gradient.addColorStop(1, new ColorHSL(this.hue, this.saturation, 10).toString());
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();

        //right
        this.ctx.beginPath();
        this.ctx.moveTo(this.outerRect.p2.x, this.outerRect.p2.y);
        this.ctx.lineTo(this.innerRect.p2.x, this.innerRect.p2.y);
        this.ctx.lineTo(this.innerRect.p3.x, this.innerRect.p3.y);
        this.ctx.lineTo(this.outerRect.p3.x, this.outerRect.p3.y);
        this.ctx.closePath();
        gradient = this.ctx.createLinearGradient(this.outerRect.p2.x, 0, this.innerRect.p2.x, 0);
        gradient.addColorStop(0, new ColorHSL(this.hue, this.saturation, 70).toString());
        gradient.addColorStop(1, new ColorHSL(this.hue, this.saturation, 10).toString());
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();

        //left
        this.ctx.beginPath();
        this.ctx.moveTo(this.outerRect.p4.x, this.outerRect.p4.y);
        this.ctx.lineTo(this.innerRect.p4.x, this.innerRect.p4.y);
        this.ctx.lineTo(this.innerRect.p1.x, this.innerRect.p1.y);
        this.ctx.lineTo(this.outerRect.p1.x, this.outerRect.p1.y);
        this.ctx.closePath();
        gradient = this.ctx.createLinearGradient(this.outerRect.p1.x, 0, this.innerRect.p1.x, 0);
        gradient.addColorStop(0, new ColorHSL(this.hue, this.saturation, 70).toString());
        gradient.addColorStop(1, new ColorHSL(this.hue, this.saturation, 10).toString());
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();

        //center
        this.ctx.beginPath();
        this.ctx.moveTo(this.innerRect.p1.x, this.innerRect.p1.y);
        this.ctx.lineTo(this.innerRect.p2.x, this.innerRect.p2.y);
        this.ctx.lineTo(this.innerRect.p3.x, this.innerRect.p3.y);
        this.ctx.lineTo(this.innerRect.p4.x, this.innerRect.p4.y);
        this.ctx.closePath();
        this.ctx.fillStyle = new ColorHSL(this.hue, this.saturation, 12).toString();
        this.ctx.fill();
        this.ctx.strokeStyle = new ColorHSL(this.hue, this.saturation, 12).toString();
        this.ctx.stroke();
        
        //bottom
        this.ctx.beginPath();
        this.ctx.moveTo(this.outerRect.p3.x, this.outerRect.p3.y);
        this.ctx.lineTo(this.innerRect.p3.x, this.innerRect.p3.y);
        this.ctx.lineTo(this.innerRect.p4.x, this.innerRect.p4.y);
        this.ctx.lineTo(this.outerRect.p4.x, this.outerRect.p4.y);
        this.ctx.closePath();
        gradient = this.ctx.createLinearGradient(0, this.outerRect.p4.y, 0, this.innerRect.p4.y);
        gradient.addColorStop(0, new ColorHSL(this.hue, this.saturation, 70).toString());
        gradient.addColorStop(1, new ColorHSL(this.floorHue, this.floorSaturation, 70).toString());
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        this.ctx.strokeStyle = gradient;
        this.ctx.stroke();
    }

    drawDoor() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.door.x, this.door.y);
        this.ctx.lineTo(this.door.x + this.door.width, this.door.y);
        this.ctx.lineTo(this.door.x + this.door.width, this.door.y + this.door.height);
        this.ctx.lineTo(this.door.x, this.door.y + this.door.height);
        this.ctx.closePath();

        this.ctx.shadowBlur = 50;
        this.ctx.shadowColor = "gray";

        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();

        this.ctx.shadowBlur = 0;

        this.ctx.beginPath();
        for (let i = 1; i < 10; i++) {
            this.ctx.moveTo(this.door.x, this.door.y + this.door.height * (i/10));
            this.ctx.lineTo(this.door.x + this.door.width, this.door.y + this.door.height * (i/10));
        
        }
        this.ctx.closePath();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'rgb(200, 200, 200)';
        this.ctx.stroke();

        this.ctx.lineWidth = 1;
    }

    touchStarted(touch) {
        if (this.touchId === null) {
            this.touchId = touch.id;
            this.prevY = touch.y;
            this.tempY = this.door.y;
        }
    }

    touchMoved(touch) {
        if (this.touchId === touch.id) {
            let delta = touch.y - this.prevY;

            this.door.y = this.tempY + delta;
            if (this.door.y > this.door.originY) {
                this.door.y = this.door.originY;
            }
            if (this.door.y < this.door.originY - this.door.height) {
                this.door.y = this.door.originY - this.door.height;
            }
        }
    }

    touchEnded(touch) {
        if (this.touchId === touch.id) {
            this.touchId = null;
        }
    }
};