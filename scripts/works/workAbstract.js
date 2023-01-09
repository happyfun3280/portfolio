export class WorkAbstract {
    constructor(ctx, width, height) {
        this.deltaTime = 0;
        this.startTime = Date.now();
        this.endTime = Date.now();

        this.ctx = ctx;

        this.canvasWidth = width;
        this.canvasHeight = height;

        this.touches = [];
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

    touchStarted(touch) {}
    touchMoved(touch) {}
    touchEnded(touch) {}

    // event callback
    touchstartCallback(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = { id: e.changedTouches[i].identifier, x: e.changedTouches[i].clientX, y: e.changedTouches[i].clientY }

            this.touchStarted(touch);

            this.touches.push(touch);
        }
    }
    touchmoveCallback(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            for (let j = 0; j < this.touches.length; j++) {
                if (e.changedTouches[i].identifier === this.touches[j].id) {
                    this.touches[j].x = e.changedTouches[i].clientX;
                    this.touches[j].y = e.changedTouches[i].clientY;
                    this.touchMoved(this.touches[j]);
                }
            }
        }
    }
    touchendCallback(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            for (let j = 0; j < this.touches.length; j++) {
                if (e.changedTouches[i].identifier === this.touches[j].id) {
                    this.touchEnded(this.touches[j]);

                    this.touches.splice(j, 1);
                }
            }
        }
    }

    mousedownCallback(e) {
        let touch = { id: -1, x: e.clientX, y: e.clientY };
        this.touchStarted(touch);
        this.touches.push(touch);
    }
    mousemoveCallback(e) {
        for (let i = 0; i < this.touches.length; i++) {
            if (this.touches[i].id === -1) {
                this.touches[i].x = e.clientX;
                this.touches[i].y = e.clientY;
                this.touchMoved(this.touches[i]);
            }
        }
    }
    
    mouseupCallback(e) {
        for (let i = 0; i < this.touches.length; i++) {
            if (this.touches[i].id === -1) {
                this.touchEnded(this.touches[i]);
                this.touches.splice(i, 1);
            }
        }
    }
}