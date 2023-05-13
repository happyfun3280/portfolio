class Vector2D {
    constructor(x, y) {
        this.originX = x;
        this.originY = y;

        this.x = x;
        this.y = y;

        this.a = 0;
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }

    static addVector(vec1, vec2) {
        return new Vector2D(vec1.x+vec2.x, vec1.y+vec2.y);
    }
    
    static subVector(vec1, vec2) {
        return new Vector2D(vec1.x-vec2.x, vec1.y-vec2.y);
    }
    
    static normalizeVector(vec) {
        let newVec = new Vector2D(vec.x, vec.y);
        newVec.normalizeVector();
        return newVec;
    }
    
    static multVector(vec, number) {
        let newVec = new Vector2D(vec.x, vec.y);
        newVec.multVector(number);
        return newVec;
    }

    static rotateVector(vec, angle) {
        let newVec = new Vector2D(vec.x, vec.y);
        newVec.rotateVector(angle);
        return newVec;
    }

    static setVector(vec, x, y) {
        let newVec = new Vector2D(vec.x, vec.y);
        newVec.setVector(x, y);
        return newVec;
    }

    static dotVector(vec1, vec2) {
        return vec1.x * vec2.x + vec1.y * vec2.y;
    }

    static distance(vec1, vec2) {
        return Math.sqrt(Math.pow(vec1.x-vec2.x, 2) + Math.pow(vec1.y-vec2.y, 2));
    }

    magnitude() {
        return Math.sqrt(this.x*this.x + this.y*this.y, 2);
    }

    dotVector(vec) {
        return this.x * vec.x + this.y * vec.y;
    }

    distance(vec) {
        return Math.sqrt(Math.pow(this.x-vec.x, 2) + Math.pow(this.y-vec.y, 2));
    }

    addVector(vec) {
        this.x += vec.x;
        this.y += vec.y;

        this.originX += vec.x;
        this.originY += vec.y;
    }

    subVector(vec) {
        this.x -= vec.x;
        this.y -= vec.y;

        this.originX -= vec.x;
        this.originY -= vec.y;
    }

    normalizeVector() {
        let mag = this.magnitude();
        let magOrigin = Math.sqrt(this.originX*this.originX+this.originY*this.originY);
        this.x /= mag;
        this.y /= mag;
        
        this.originX /= magOrigin;
        this.originY /= magOrigin;
    }

    multVector(number) {
        this.x *= number;
        this.y *= number;
        this.originX *= number;
        this.originY *= number;
    }

    rotateVector(angle) {
        this.a += angle;
        this.x = this.originX * Math.cos(this.a) - this.originY * Math.sin(this.a);
        this.y = this.originX * Math.sin(this.a) + this.originY * Math.cos(this.a);
    }

    setVector(x, y) {
        this.x = x;
        this.y = y;

        this.originX = x;
        this.originY = y;
    }

    print(ctx, strokeStyle="black", weight=3) {
        ctx.lineWidth = weight;
        ctx.strokeStyle = strokeStyle;

        ctx.strokeRect(this.x, this.y, 1, 1);
    }

    printVector(ctx, strokeStyle="black", weight=3) {
        ctx.lineWidth = weight;
        ctx.strokeStyle = strokeStyle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }

    printVector(ctx, x, y, strokeStyle="black", weight=3) {
        
        ctx.lineWidth = weight;
        ctx.strokeStyle = strokeStyle;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+this.x, x+this.y);
        ctx.stroke();
    }
}

class Segment2D {
    constructor(vec1, vec2) {
        this.vec1 = (Array.isArray(vec1) ? new Vector2D(vec1[0], vec1[1]) : vec1);
        this.vec2 = (Array.isArray(vec2) ? new Vector2D(vec2[0], vec2[1]) : vec2);
    }

    static translateSegment(segment, x, y) {
        let newSeg = new Segment2D([segment.vec1.x, segment.vec1.y], [segment.vec2.x, segment.vec2.y]);
        newSeg.translateSegment(x, y);
        return newSeg;
    }

    copy() {
        return new Segment2D(this.vec1.copy(), this.vec2.copy());
    }

    length() {
        return this.vec1.distance(this.vec2);
    }

    setSegment(x1, y1, x2, y2) {
        this.vec1.setVector(x1, y1);
        this.vec2.setVector(x2, y2);
    }

    translateSegment(x, y) {
        this.vec1.addVector(new Vector2D(x, y));
        this.vec2.addVector(new Vector2D(x, y));
    }

    scaleSegment(number) {
        let cenVec = new Vector2D((this.vec1.x+this.vec2.x)/2, (this.vec1.y+this.vec2.y)/2);
        let leftVec = Vector2D.subVector(this.vec1, cenVec);
        leftVec.multVector(number);
        let rightVec = Vector2D.subVector(this.vec2, cenVec);
        rightVec.multVector(number);
        this.vec1 = Vector2D.addVector(leftVec, cenVec);
        this.vec2 = Vector2D.addVector(rightVec, cenVec);
        console.log(this.vec1);
    }

    calculateIntersection(segment) {
        let x1 = this.vec1.x;
        let y1 = this.vec1.y;
        let x2 = this.vec2.x;
        let y2 = this.vec2.y;
        
        let x3 = segment.vec1.x;
        let y3 = segment.vec1.y;
        let x4 = segment.vec2.x;
        let y4 = segment.vec2.y;

        let _t = (x4-x3)*(y1-y3)-(y4-y3)*(x1-x3);
        let _s = (x2-x1)*(y1-y3)-(y2-y1)*(x1-x3);

        let under = (y4-y3)*(x2-x1)-(x4-x3)*(y2-y1);

        if (under == 0) {
            // if (_t == 0 && _s == 0) return false;
            return undefined;
        }

        let t = _t / under;
        let s = _s / under;

        if (t < 0 || t > 1 || s < 0 || s > 1) return undefined;

        return new Vector2D(x1+t*(x2-x1), y1+t*(y2-y1));
    }

    calculateDistanceFromVector(vec) {
        let segmentLength = this.length();

        if (segmentLength == 0) return this.vec1.distance(vec);

        let projection = Vector2D.dotVector(Vector2D.subVector(vec, this.vec1), Vector2D.subVector(this.vec2, this.vec1)) / segmentLength;

        if (projection < 0) return Vector2D.distance(vec, this.vec1);
        else if (projection > segmentLength) return Vector2D.distance(vec, this.vec2);
        else {
            return Math.abs((-1)*(vec.x-this.vec1.x)*(this.vec2.y-this.vec1.y)+(vec.y-this.vec1.y)*(this.vec2.x - this.vec1.x))/segmentLength;
        }

    }

    print(ctx, strokeStyle="black", weight=3) {
        ctx.lineWidth = weight;
        ctx.strokeStyle = strokeStyle;
        
        ctx.beginPath();
        ctx.moveTo(this.vec1.x, this.vec1.y);
        ctx.lineTo(this.vec2.x, this.vec2.y);
        ctx.stroke();
    }
}

class Polygon2D {
    constructor(centerVec, vecList) {
        this.centerVector = (Array.isArray(centerVec) ? new Vector2D(centerVec[0], centerVec[1]) : centerVec);
        this.vectors = [];
        this.segments = [];

        let firstVec = (Array.isArray(vecList[0]) ? new Vector2D(vecList[0][0], vecList[0][1]) : vecList[0]);

        this.vectors.push(firstVec);

        let prevVec = firstVec;

        for (let i = 1; i < vecList.length; i++) {
            let vec = (Array.isArray(vecList[i]) ? new Vector2D(vecList[i][0], vecList[i][1]) : vecList[i]);
            this.vectors.push(vec);
            this.segments.push(new Segment2D(prevVec, vec));
            prevVec = vec;

            if (i + 1 == vecList.length) this.segments.push(new Segment2D(vec, firstVec));
        }

        this.vecCount = this.vectors.length;
        this.segCount = this.segments.length;
    }

    copy() {
        let vecList = [];
        for (let vec of this.vectors) {
            vecList.push(vec.copy());
        }
        return new Polygon2D(this.centerVector.copy(), vecList);
    }

    moveFigure(x, y) {
        this.centerVector.setVector(x, y);
    }

    translateFigure(x, y) {
        this.centerVector.addVector(new Vector2D(x, y));
    }

    scaleFigure(number) {
        for (let i = 0; i < this.vecCount; i++) {
            this.vectors[i].multVector(number);
        }
    }

    rotateFigure(angle) {
        for (let i = 0; i < this.vecCount; i++) {
            this.vectors[i].rotateVector(angle);
        }
    }

    print(ctx, strokeStyle="black", fillStyle="transparent", weight=3) {
        ctx.lineWidth = weight;
        ctx.fillStyle = fillStyle;
        ctx.strokeStyle = strokeStyle;

        ctx.beginPath();
        let movedVec = Vector2D.addVector(this.vectors[0], this.centerVector);
        ctx.moveTo(movedVec.x, movedVec.y);
        for (let i = 1; i < this.vecCount; i++) {
            let movedVec = Vector2D.addVector(this.vectors[i], this.centerVector);
            ctx.lineTo(movedVec.x, movedVec.y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
}

class CastShadow2D {
    constructor() {
        this.objects = [];
    };

    addObject(object) {
        if (object instanceof Object2D) {
            this.objects.push(object);
        }
    }

    removeObject(object) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getIdentifer() === object.getIdentifer()) {
                this.objects.splice(i, 1);
                return;
            }
        }
    }

    castShadow(ctx, srcX, srcY, color, size, range) {
        let srcVec = new Vector2D(srcX, srcY);

        let segments = [];
        let vectors = [];

        for (let i = 0; i < this.objects.length; i++) {
            let object = this.objects[i].getObject();
            if (object instanceof Segment2D) {
                let leftVec = Vector2D.subVector(object.vec1, srcVec); 
                leftVec.normalizeVector();
                leftVec.multVector(range);
                let rightVec = Vector2D.subVector(object.vec2, srcVec);
                rightVec.normalizeVector();
                rightVec.multVector(range);

                vectors.push(Vector2D.rotateVector(leftVec, -0.0001));
                vectors.push(Vector2D.rotateVector(leftVec, 0.0001));
                vectors.push(leftVec);
                vectors.push(Vector2D.rotateVector(rightVec, -0.0001));
                vectors.push(Vector2D.rotateVector(rightVec, 0.0001));
                vectors.push(rightVec);

                segments.push(object);
            } else if (object instanceof Polygon2D) {
                for (let j = 0; j < object.vecCount; j++) {
                    let vec = Vector2D.subVector(object.vectors[j], srcVec);
                    vec.addVector(object.centerVector);

                    vec.normalizeVector();
                    vec.multVector(range);

                    vectors.push(Vector2D.rotateVector(vec, -0.001));
                    vectors.push(Vector2D.rotateVector(vec, 0.001));
                    vectors.push(vec);
                }
                for (let j = 0; j < object.segCount; j++) {
                    let seg = Segment2D.translateSegment(object.segments[j], object.centerVector.x, object.centerVector.y);
                    segments.push(seg);
                }
            }
        }
        

        let result = [];

        for (let rayVec of vectors) {
            let raySegment = new Segment2D(Vector2D.addVector(rayVec, srcVec), srcVec);
            let nearestCrossedVec = undefined;
            let distance = Number.MAX_VALUE;
            for (let i = 0; i < segments.length; i++) {
                let intersectionVec = raySegment.calculateIntersection(segments[i]);
                if (intersectionVec !== undefined) {
                    let dist = Vector2D.distance(srcVec, intersectionVec);
                    if (dist < distance) {
                        nearestCrossedVec = intersectionVec;
                        distance = dist;
                    }
                }
            }

            if (nearestCrossedVec === undefined) {
                result.push({ deg: Math.atan2(rayVec.y, rayVec.x), vec: Vector2D.addVector(rayVec, srcVec) });
            } else {
                result.push({ deg: Math.atan2(rayVec.y, rayVec.x), vec: nearestCrossedVec });
            }

        }

        result.sort(function (a, b) {
            return a.deg - b.deg;
        })


        /*
        ctx.strokeStyle = "blue";

        ctx.beginPath();
        for (let i = 0; i < result.length; i++) {
            ctx.moveTo(srcVec.x, srcVec.y);
            ctx.lineTo(result[i].vec.x, result[i].vec.y);
        }

        ctx.stroke();
        */
        ctx.globalCompositeOperation = "lighter";
        let gradient = ctx.createRadialGradient(srcVec.x, srcVec.y, 1, srcVec.x, srcVec.y, size);
        gradient.addColorStop(0, `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        gradient.addColorStop(1, `rgb(0, 0, 0)`);

        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.moveTo(result[result.length-1].vec.x, result[result.length-1].vec.y);

        for (let i = 0; i < result.length; i++) {
            ctx.lineTo(result[i].vec.x, result[i].vec.y);
        }

        ctx.closePath();

        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
    }
}

class Object2D {
    static idCounter = 0;

    constructor(name, object, strokeStyle = "black", lineWidth = 1, fillStyle = "transparent") {
        this.name = name;
        this.object = object;
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.lineWidth = lineWidth;
        this.identifier = Object2D.idCounter++;
    }

    getName() {
        return this.name;
    }

    getIdentifer() {
        return this.identifier;
    }

    getObject() {
        return this.object; 
    }

    print(ctx) {
        if (this.object instanceof Vector2D) {
            this.object.print(ctx, this.strokeStyle, this.lineWidth);
        } else if (this.object instanceof Segment2D) {
            this.object.print(ctx, this.strokeStyle, this.lineWidth);
        } else if (this.object instanceof Polygon2D) {
            this.object.print(ctx, this.strokeStyle, this.fillStyle, this.lineWidth);
        }
    }
}

export { Vector2D, Segment2D, Polygon2D, CastShadow2D, Object2D };