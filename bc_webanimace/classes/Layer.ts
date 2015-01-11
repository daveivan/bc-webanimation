class Layer {
    static counter: number = 0;
    id: number;
    name: string;
    private _order: number = 0;
    private _keyframes: Array<Keyframe>;
    private _timestamps: Array<number>;
    private _idEl: string;
    private _globalShape: IShape;

    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        this.name = name;
        this.id = ++Layer.counter;
        this._keyframes = new Array<Keyframe>();
        this._timestamps = new Array<number>();
        if (shape != null) {
            shape.id = this.id;
            this.addKeyframe(shape, 0, fn);
        }

        this.idEl = null;
        this.globalShape = shape;
    }

    get order(): number {
        return this._order;
    }

    set order(order: number) {
        this._order = order;
    }

    get idEl() {
        return this._idEl;
    }

    set idEl(id: string) {
        this._idEl = id;
    }

    get globalShape() {
        return this._globalShape;
    }

    set globalShape(shape: IShape) {
        this._globalShape = shape;
    }

    addKeyframe(shape: IShape, timestamp: number, timing_function: Bezier_points, index: number = null): Keyframe {
        var keyframe: Keyframe = new Keyframe(shape, timestamp, timing_function);
        if (index != null) {
            this._keyframes.splice(index, 0, keyframe);
        } else {
            this._keyframes.push(keyframe);
        }

        this._timestamps.push(keyframe.timestamp);
        this.sortTimestamps();
        return keyframe;
    }

    deleteKeyframe(index: number) {
        var keyframe: Keyframe = this.getKeyframe(index);
        //IE9<
        this._timestamps.splice(this._timestamps.indexOf(keyframe.timestamp), 1);
        this._keyframes.splice(index, 1);
    }

    getKeyframe(index: number): Keyframe {
        if (typeof this._keyframes[index] == 'undefined') {
            return null;
        } else {
            return this._keyframes[index];
        }
    }

    updatePosition(index: number, ms: number) {
        //if position is free
        if (this.getKeyframeByTimestamp(ms) == null) {
            this.getKeyframe(index).timestamp = ms;
            this._timestamps = [];
            this._keyframes.forEach((item: Keyframe, index: number) => {
                this._timestamps.push(item.timestamp);
            });
            this.sortTimestamps();
        }
    }

    getKeyframeByTimestamp(timestamp: number): Keyframe {
        var i: number = null;
        this._keyframes.forEach((item: Keyframe, index: number) => {
            if (item.timestamp == timestamp) {
                i = index;

            }
        });

        if (i == null) {
            return null;
        } else {
            return this._keyframes[i];   
        }
    }

    getAllKeyframes(): Array<Keyframe> {
        return this._keyframes;
    }

    sortTimestamps() {
        var tmp: Array<number> = this._timestamps.sort((n1, n2) => n1 - n2);
        this._timestamps = tmp;
    }

    public sortKeyframes() {
        var tmp: Array<Keyframe> = this._keyframes.sort((n1, n2) => n1.timestamp - n2.timestamp);
        this._keyframes = tmp;
    }

    get timestamps() {
        return this._timestamps;
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, controlPanel) {
        //find interval between position
        var rangeData = this.getRange(position);
        var left: number = rangeData.left;
        var right: number = rangeData.right;
        var rng: Array<Keyframe> = rangeData.rng;
        var params: Parameters = rangeData.params;

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            params = {
                top: Math.round(this.computeAttr(rng['l'].shape.parameters.top, rng['r'].shape.parameters.top, bezier(p))),
                left: Math.round(this.computeAttr(rng['l'].shape.parameters.left, rng['r'].shape.parameters.left, bezier(p))),
                width: Math.round(this.computeAttr(rng['l'].shape.parameters.width, rng['r'].shape.parameters.width, bezier(p))),
                height: Math.round(this.computeAttr(rng['l'].shape.parameters.height, rng['r'].shape.parameters.height, bezier(p))),
                backgroundR: Math.round(this.computeAttr(rng['l'].shape.parameters.backgroundR, rng['r'].shape.parameters.backgroundR, bezier(p))),
                backgroundG: Math.round(this.computeAttr(rng['l'].shape.parameters.backgroundG, rng['r'].shape.parameters.backgroundG, bezier(p))),
                backgroundB: Math.round(this.computeAttr(rng['l'].shape.parameters.backgroundB, rng['r'].shape.parameters.backgroundB, bezier(p))),
                backgroundA: this.computeAttr(rng['l'].shape.parameters.backgroundA, rng['r'].shape.parameters.backgroundA, bezier(p)),
                opacity: this.computeAttr(rng['l'].shape.parameters.opacity, rng['r'].shape.parameters.opacity, bezier(p)),
                borderRadius: [
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[0], rng['r'].shape.parameters.borderRadius[0], bezier(p))),
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[1], rng['r'].shape.parameters.borderRadius[1], bezier(p))),
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[2], rng['r'].shape.parameters.borderRadius[2], bezier(p))),
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[3], rng['r'].shape.parameters.borderRadius[3], bezier(p)))
                ],
                rotateX: Math.round(this.computeAttr(rng['l'].shape.parameters.rotateX, rng['r'].shape.parameters.rotateX, bezier(p))),
                rotateY: Math.round(this.computeAttr(rng['l'].shape.parameters.rotateY, rng['r'].shape.parameters.rotateY, bezier(p))),
                rotateZ: Math.round(this.computeAttr(rng['l'].shape.parameters.rotateZ, rng['r'].shape.parameters.rotateZ, bezier(p))),
                skewX: Math.round(this.computeAttr(rng['l'].shape.parameters.skewX, rng['r'].shape.parameters.skewX, bezier(p))),
                skewY: Math.round(this.computeAttr(rng['l'].shape.parameters.skewY, rng['r'].shape.parameters.skewY, bezier(p))),
                originX: this.computeAttr(rng['l'].shape.parameters.originX, rng['r'].shape.parameters.originX, bezier(p)),
                originY: this.computeAttr(rng['l'].shape.parameters.originY, rng['r'].shape.parameters.originY, bezier(p)),
            }
        }

        //set new attributes to object
        shape.css({
            'top': params.top,
            'left': params.left,
            'width': params.width,
            'height': params.height,
            'background': 'rgba(' + params.backgroundR + ',' + params.backgroundG + ',' + params.backgroundB + ',' + params.backgroundA + ')',
            'border': params.border,
            'z-index': shape.css('z-index'),
            'opacity': params.opacity,
            'border-top-left-radius': params.borderRadius[0],
            'border-top-right-radius': params.borderRadius[1],
            'border-bottom-right-radius': params.borderRadius[2],
            'border-bottom-left-radius': params.borderRadius[3],
            'transform': 'rotateX(' + params.rotateX + 'deg) rotateY(' + params.rotateY + 'deg) rotateZ(' + params.rotateZ + 'deg) skew(' + params.skewX + 'deg , ' + params.skewY + 'deg)',
            'transform-origin': params.originX + '% ' + params.originY + '%',
        });

        helper.css({
            'top': params.top - 1,
            'left': params.left - 1,
            'width': params.width + 2,
            'height': params.height + 2,
            'z-index': helper.css('z-index'),
        });

        if (this.idEl != null) {
            shape.attr('id', this.idEl);
        } else {
            shape.removeAttr('id');
        }

        if (currentLayerId == this.id) {
            controlPanel.updateDimensions({ width: params.width, height: params.height });
            controlPanel.updateOpacity(params.opacity);
            controlPanel.updateColor({ r: params.backgroundR, g: params.backgroundG, b: params.backgroundB }, params.backgroundA);
            controlPanel.updateBorderRadius(params.borderRadius);
            controlPanel.update3DRotate({ x: params.rotateX, y: params.rotateY, z: params.rotateZ });
            controlPanel.updateSkew({ x: params.skewX, y: params.skewY });
            controlPanel.updateTransformOrigin(params.originX, params.originY);
            $('.shape-helper.highlight').first().find('.origin-point').css({
                'left': params.originX + '%',
                'top': params.originY + '%',
            });
        }
    }

    getRange(position: number) {
        var params: Parameters = null;

        //find interval between position
        var left: number = null, right: number = null;
        var index: number = 0;
        for (var i: number = this.timestamps.length; i--;) {
            if (this.timestamps[i] < position && (left === null || left < this.timestamps[i])) {
                left = this.timestamps[i];
            }
            if (this.timestamps[i] >= position && (right === null || right > this.timestamps[i])) {
                right = this.timestamps[i];
                index = i;
            }
        }

        if (left === null && right === position && this.timestamps.length >= 2) {
            left = right;
            right = this.timestamps[index + 1];
        }

        var rng: Array<Keyframe> = new Array<Keyframe>();   //range
        if (left != null) {
            rng['l'] = this.getKeyframeByTimestamp(left);
            params = rng['l'].shape.parameters;
        }
        if (right != null) {
            rng['r'] = this.getKeyframeByTimestamp(right);
            params = rng['r'].shape.parameters;
        }

        return { rng: rng, left: left, right: right, params: params };
    }

    computeAttr(leftAttr: number, rightAttr: number, b: number): number {
        var value: number = null;
        var absValue: number = (Math.abs(rightAttr - leftAttr)) * b;
        if (leftAttr > rightAttr) {
            value = Number(leftAttr) - Number(absValue);
        } else {
            value = Number(leftAttr) + Number(absValue);
        }
        return (Number(value));
    }

    getInitStyles(nameElement: string) {
        var p: Parameters = (this.getKeyframeByTimestamp(this.timestamps[0])).shape.parameters;
        var cssObject: any = {
            'name': '.' + nameElement,
            'width': p.width + 'px',
            'height': p.height + 'px',
            'top': p.top + 'px',
            'left': p.left + 'px',
            'background': 'rgba(' + p.backgroundR + ',' + p.backgroundG + ',' + p.backgroundB + ',' + p.backgroundA + ')',
            'opacity': p.opacity,
            'border-top-left-radius': p.borderRadius[0] + 'px',
            'border-top-right-radius': p.borderRadius[1] + 'px',
            'border-bottom-right-radius': p.borderRadius[2] + 'px',
            'border-bottom-left-radius': p.borderRadius[3] + 'px',
            'transform': 'rotateX(' + p.rotateX + 'deg) rotateY(' + p.rotateY + 'deg) rotateZ(' + p.rotateZ + 'deg) skew(' + p.skewX + 'deg , ' + p.skewY + 'deg)',
            'transform-origin': p.originX + '% ' + p.originY + '%',
            'position': 'absolute',
        };

        return cssObject;
    }

    getKeyframeStyle(timestamp: number) {
        var p: Parameters = (this.getKeyframeByTimestamp(timestamp)).shape.parameters;
        var cssObject = {
            'width': p.width + 'px',
            'height': p.height + 'px',
            'top': p.top + 'px',
            'left': p.left + 'px',
            'background': 'rgba(' + p.backgroundR + ',' + p.backgroundG + ',' + p.backgroundB + ',' + p.backgroundA + ')',
            'opacity': p.opacity,
            'border-top-left-radius': p.borderRadius[0] + 'px',
            'border-top-right-radius': p.borderRadius[1] + 'px',
            'border-bottom-right-radius': p.borderRadius[2] + 'px',
            'border-bottom-left-radius': p.borderRadius[3] + 'px',
            'transform': 'rotateX(' + p.rotateX + 'deg) rotateY(' + p.rotateY + 'deg) rotateZ(' + p.rotateZ + 'deg) skew(' + p.skewX + 'deg , ' + p.skewY + 'deg)',
            'transform-origin': p.originX + '% ' + p.originY + '%',
        }

        return cssObject;
    }

    getObject(): string {
        return '';
    }

    toString() : string {
        return "ID: " + this.id + "Jmeno vrstvy: " + this.name + ", poradi: " + this.order;
    }
} 

class RectangleLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, shape);
    }   

    jsem() {
        console.log('jsem cverec');
    } 

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, controlPanel) {
        super.transform(position, shape, helper, currentLayerId, controlPanel);
    }

    getInitStyles(nameElement: string) {
        return super.getInitStyles(nameElement);
    }

    getKeyframeStyle(timestamp: number) {
        return super.getKeyframeStyle(timestamp);
    }

    getObject(): string {
        var object: string = '    <div class="square object' + this.id + '"></div>\n';
        if (this.idEl != null) {
            object = '    <div id="' + this.idEl + '" class="square object' + this.id + '"></div>\n';
        }
        return object;
    }
}

class ImageLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, shape);
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, controlPanel) {
        super.transform(position, shape, helper, currentLayerId, controlPanel);
    }

    jsem() {
        console.log('jsem obrázek');
    }

    getInitStyles(nameElement: string) {
        var cssObject = super.getInitStyles(nameElement);

        return cssObject;
    }

    getKeyframeStyle(timestamp: number) {
        return super.getKeyframeStyle(timestamp);
    }

    getObject(): string {
        var g: any = this.globalShape;
        var object: string = '    <img class="image object' + this.id + '" src="' + g.getSrc() + '">\n';
        if (this.idEl != null) {
            object = '    <img id="' + this.idEl + '" class="image object' + this.id + '" src="' + g.getSrc() + '">\n';
        }
        return object;
    }
}

class TextLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, shape);
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, controlPanel) {
        super.transform(position, shape, helper, currentLayerId, controlPanel);

        //find interval between position
        var rangeData = this.getRange(position);
        var left: number = rangeData.left;
        var right: number = rangeData.right;
        var rng: Array<Keyframe> = rangeData.rng;

        var fontParams: fontParameters = null;
        var g: any = this.globalShape;

        if (left != null) {
            fontParams = {
                color: rng['l'].shape.getColor(),
                size: rng['l'].shape.getSize(),
                fontFamily: g.getFamily(),
            }
        }
        if (right != null) {
            fontParams = {
                color: rng['r'].shape.getColor(),
                size: rng['r'].shape.getSize(),
                fontFamily: g.getFamily(),
            }
        }

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            fontParams = {
                color: {
                    r: Math.round(this.computeAttr(rng['l'].shape.getColor().r, rng['r'].shape.getColor().r, bezier(p))),
                    g: Math.round(this.computeAttr(rng['l'].shape.getColor().g, rng['r'].shape.getColor().g, bezier(p))),
                    b: Math.round(this.computeAttr(rng['l'].shape.getColor().b, rng['r'].shape.getColor().b, bezier(p))),
                },
                size: this.computeAttr(rng['l'].shape.getSize(), rng['r'].shape.getSize(), bezier(p)),
                fontFamily: g.getFamily()
            }
        }

        shape.css({
            'color': 'rgb(' + fontParams.color.r + ',' + fontParams.color.g + ',' + fontParams.color.b + ')',
            'font-size': fontParams.size,
            'font-family': fontParams.fontFamily,
        });

        if (currentLayerId == this.id) {
                controlPanel.updateFont(fontParams.color, fontParams.size, fontParams.fontFamily);
        }
    }

    jsem() {
        console.log('jsem text');
    }

    getInitStyles(nameElement: string) {
        var shape: any = (this.getKeyframeByTimestamp(this.timestamps[0])).shape;

        var cssObject = super.getInitStyles(nameElement);
        cssObject['display'] = 'inline';
        cssObject['font-size'] = shape.getSize() + 'px';
        cssObject['font-family'] = '"' + shape.getFamily() + '"';
        cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    }

    getKeyframeStyle(timestamp: number) {
        var shape: any = (this.getKeyframeByTimestamp(timestamp)).shape;

        var cssObject = super.getKeyframeStyle(timestamp);
        cssObject['font-size'] = shape.getSize() + 'px';
        cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    }

    getObject(): string {
        var g: any = this.globalShape;
        var object: string = '    <span class="text object' + this.id + '">' + g.getContent() + '</span>\n';
        if (this.idEl != null) {
            object = '    <span id="' + this.idEl + '" class="text object' + this.id + '">' + g.getContent() + '</span>\n';
        }
        return object;
    }
}