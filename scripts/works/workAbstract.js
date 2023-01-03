export class WorkAbstract {
    constructor(ctx, width, height) {
        this.deltaTime = 0;
        this.startTime = Date.now();
        this.endTime = Date.now();

        this.ctx = ctx;

        this.canvasWidth = width;
        this.canvasHeight = height;
    }
    

    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height; 
    }

    
    init() {}
    update() {
        this.endTime = Date.now();
        this.deltaTime = this.endTime - this.startTime;
        this.startTime = this.endTime;
    }
    draw() {}

    // event callback
    mousemove() {}
    mousedown() {}
    mouseup() {}

    // tool
    random(min, max) {
        return Math.random() * (max - min) + min;
    }
}