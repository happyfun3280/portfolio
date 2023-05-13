import { WorkAbstract } from "./workAbstract.js";

import { Segment2D, Polygon2D, CastShadow2D, Object2D } from "../vector2D.js";

export default class LightAndShadowWork extends WorkAbstract {
    constructor(ctx, canvasWidth, canvasHeight) {
        super(ctx, canvasWidth, canvasHeight);
    }

    init() {
        let WIDTH = this.canvasWidth, HEIGHT = this.canvasHeight;

        this.objects = [];

        this.objects.push(new Object2D(
            "window",
            new Polygon2D([this.canvasWidth/2, this.canvasHeight/2], [
                [-WIDTH/2, -HEIGHT/2],
                [WIDTH/2, -HEIGHT/2],
                [WIDTH/2, HEIGHT/2],
                [-WIDTH/2, HEIGHT/2],
            ]),
            "white", 1, "transparent"
        ));

        this.objects.push(new Object2D(
            "box1",
            new Polygon2D([0, 0], [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
            ]),
            "white", 1, "transparent"
        ));
        
        this.objects.push(new Object2D(
            "box2",
            new Polygon2D([-this.canvasWidth/6, 0], [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
            ]),
            "white", 1, "transparent"
        ));
        
        this.objects.push(new Object2D(
            "box3",
            new Polygon2D([-this.canvasWidth/6 * 2, 0], [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
            ]),
            "white", 1, "transparent"
        ));
        
        this.objects.push(new Object2D(
            "box4",
            new Polygon2D([this.canvasWidth/6, 0], [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
            ]),
            "white", 1, "transparent"
        ));
        
        this.objects.push(new Object2D(
            "box5",
            new Polygon2D([this.canvasWidth/6 * 2, 0], [
                [-50, -50],
                [50, -50],
                [50, 50],
                [-50, 50],
            ]),
            "white", 1, "transparent"
        ));

        
        this.objects.push(new Object2D(
            "stick1",
            new Polygon2D([0, this.canvasWidth/8], [
                [-250, -10],
                [250, -10],
                [250, 10],
                [-250, 10],
            ]),
            "white", 1, "transparent"
        ));

        this.objects.push(new Object2D(
            "line1",
            new Segment2D([-this.canvasWidth/6-50, -this.canvasWidth/12], [-this.canvasWidth/6+50, -this.canvasWidth/12]),
            "white", 1, "transparent"
        ));

        this.objects.push(new Object2D(
            "line1",
            new Segment2D([-this.canvasWidth/6-50, -this.canvasWidth/12-this.canvasWidth/40], [-this.canvasWidth/6+50, -this.canvasWidth/12-this.canvasWidth/40]),
            "white", 1, "transparent"
        ));

        this.objects.push(new Object2D(
            "line1",
            new Segment2D([-this.canvasWidth/6-50, -this.canvasWidth/12-this.canvasWidth/40*2], [-this.canvasWidth/6+50, -this.canvasWidth/12-this.canvasWidth/40*2]),
            "white", 1, "transparent"
        ));

        this.objects.push(new Object2D(
            "line1",
            new Segment2D([-this.canvasWidth/6-50, -this.canvasWidth/12-this.canvasWidth/40*3], [-this.canvasWidth/6+50, -this.canvasWidth/12-this.canvasWidth/40*3]),
            "white", 1, "transparent"
        ));



        this.objects.push(new Object2D(
            "triangle1",
            new Polygon2D([-this.canvasWidth/6*2, -this.canvasWidth/10], [
                [-50, 20],
                [0, -60],
                [50, 20],
            ]),
            "white", 1, "transparent"
        ));

        this.castShadow = new CastShadow2D();
        for (let object of this.objects) {
            let obj = object.getObject();
            if (object.getName() != "window") {
                if (obj instanceof Polygon2D) {
                    obj.translateFigure(this.canvasWidth/2, this.canvasHeight/2);
                    obj.scaleFigure(this.canvasWidth/1000);
                } else if (obj instanceof Segment2D) {
                    obj.translateSegment(this.canvasWidth/2, this.canvasHeight/2);
                    obj.scaleSegment(this.canvasWidth/1000);
                }
            }
            this.castShadow.addObject(object);
        }

        this.mouseX = 0;
        this.mouseY = 0;
    }

    update() {
        super.update();
    }

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.castShadow.castShadow(this.ctx, this.canvasWidth*(1/10), 100, [ 100, 50, 50 ], this.canvasWidth, 3000);
        this.castShadow.castShadow(this.ctx, this.canvasWidth*(9/10), 100, [ 50, 50, 100 ], this.canvasWidth, 3000);
        this.castShadow.castShadow(this.ctx, this.mouseX, this.mouseY, [ 50, 100, 50 ], this.canvasWidth, 3000);

        for (let object of this.objects) {
            object.print(this.ctx);
        }
    }

    touchMoved(touch) {
        this.mouseX = touch.x;
        this.mouseY = touch.y;
    }
}