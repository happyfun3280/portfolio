import { WorkAbstract } from "./workAbstract.js";

export default class ButtonWork extends WorkAbstract {
    constructor(ctx, width, height) {
        super(ctx, width, height);
    }


    init() {
        this.btnList = [];

        this.btnWidth = this.canvasWidth/(5*this.canvasWidth/this.canvasHeight);
        this.btnHeight = this.btnWidth*0.6;
        this.btnGap = this.btnWidth*0.15;
        this.btnTimeLimit = 2000;
        this.btnLength = this.btnHeight;

        this.redColor = 250;
        this.greenColor = 100;
        this.blueColor = 250;
        this.initButtons();
    }

    update() {
        super.update();
        this.updateButtons();
    }

    draw() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawButtons();    
    }

    touchMoved(touch) {

        let mouseX = touch.x;
        let mouseY = touch.y;
        
        for (let btn of this.btnList) {
            if (btn.pushed) continue;
            let distance = Math.sqrt(Math.pow(btn.x - mouseX, 2) + Math.pow(btn.y - mouseY, 2));
            if (distance < ((this.btnWidth < this.btnHeight) ? this.btnWidth : this.btnHeight)) {
                btn.pushed = true;
            }
        }
    }
    
    initButtons() {

    this.btnList = [];

    let curX = -(this.btnWidth/2+this.btnGap/2);
    let curY = -this.btnHeight/2;
    let line = 0;

    while (true) {
        this.btnList.push({
            x: curX,
            y: curY,
            originX: curX,
            originY: curY,
            
            pushed: false,
            scene: 0,
            t: 0,
            tLimit: 0,
        });

        curX += this.btnWidth + this.btnGap;

        if (curX - this.btnWidth/2 > this.canvasWidth) {
            line++;
            if (line % 2 == 0) {
                curX = -(this.btnWidth/2+this.btnGap/2);
            } else {
                curX = 0;
            }
            curY += this.btnHeight/2 + this.btnGap/4;
            if (curY - this.btnHeight/2 > this.canvasHeight) {
                break;
            }
        }
    }

    }

    updateButtons() {
        for (let i = 0; i < this.btnList.length; i++) {
            let btn = this.btnList[i];
            
            if (!btn.pushed) continue;

            btn.t += this.deltaTime;

            switch (btn.scene) {
            case 0:
                if (btn.t > btn.tLimit) {
                    btn.t = 0;
                    btn.tLimit = this.btnTimeLimit;
                    btn.scene++;
                }
                break;
            case 1:
                if (btn.t > btn.tLimit) {
                    btn.t = 0;
                    btn.tLimit = this.btnTimeLimit;
                    btn.scene++;
                } else {
                    btn.y = btn.originY + this.btnLength * btn.t / btn.tLimit;
                }
                break;
            case 2:
                if (btn.t > btn.tLimit) {
                    btn.t = 0;
                    btn.tLimit = this.btnTimeLimit;
                    btn.scene++;
                } else {
                    btn.y = btn.originY + this.btnLength;
                }
                break;
            case 3:
                if (btn.t > btn.tLimit) {
                    btn.t = 0;
                    btn.tLimit = 1000;
                    btn.scene++;
                } else {
                    btn.y = btn.originY + this.btnLength * (1 - btn.t / btn.tLimit);
                }
                break;
            }

            if (btn.scene === 4) {
                btn.pushed = false;
                btn.t = 0;
                btn.tLimit = 0;
                btn.scene = 0;

                btn.x = btn.originX;
                btn.y = btn.originY;
            }
        }
    }

    drawButtons() {

        for (let i = 0; i < this.btnList.length; i++) {
            let btn = this.btnList[i];
            
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgb(${this.redColor*(1-i/this.btnList.length)}, ${this.greenColor*(i/this.btnList.length)}, ${this.blueColor*(i/this.btnList.length)})`;
            this.ctx.moveTo(btn.x - this.btnWidth/2, btn.y);
            this.ctx.lineTo(btn.x, btn.y - this.btnHeight/2);
            this.ctx.lineTo(btn.x + this.btnWidth/2, btn.y);
            this.ctx.lineTo(btn.x, btn.y + this.btnHeight/2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = `rgb(${this.redColor*(1-i/this.btnList.length)}, ${this.greenColor*(i/this.btnList.length)}, ${this.blueColor*(i/this.btnList.length)})`;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.fillStyle = `rgb(${this.redColor*(1-i/this.btnList.length)*0.7}, ${this.greenColor*(i/this.btnList.length)*0.7}, ${this.blueColor*(i/this.btnList.length)*0.7})`;
            this.ctx.moveTo(btn.x - this.btnWidth/2, btn.y);
            this.ctx.lineTo(btn.originX - this.btnWidth/2, btn.originY + this.btnLength);
            this.ctx.lineTo(btn.originX, btn.originY + this.btnHeight/2 + this.btnLength);
            this.ctx.lineTo(btn.x, btn.y + this.btnHeight/2);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgb(${this.redColor*(1-i/this.btnList.length)*0.5}, ${this.greenColor*(i/this.btnList.length)*0.5}, ${this.blueColor*(i/this.btnList.length)*0.5})`;
            this.ctx.moveTo(btn.x + this.btnWidth/2, btn.y);
            this.ctx.lineTo(btn.originX + this.btnWidth/2, btn.originY + this.btnLength);
            this.ctx.lineTo(btn.originX, btn.originY + this.btnHeight/2 + this.btnLength);
            this.ctx.lineTo(btn.x, btn.y + this.btnHeight/2);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
};