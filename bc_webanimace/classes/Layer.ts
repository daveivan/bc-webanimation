class Layer {
    static counter: number = 0;
    id: number;
    name: string;
    private _order: number = 0;
    private _keyframes: Array<Keyframe>;
    private _timestamps: Array<number>;
    private _idEl: string;
    private _globalShape: IShape;
    private _parent: number = null;
    private _type: Type = null;
    nesting: number = 0;

    constructor(name: string, fn: Bezier_points, type: Type, shape: IShape = null) {
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
        this._type = type;
    }

    get order(): number {
        return this._order;
    }

    set order(order: number) {
        this._order = order;
    }

    get parent() {
        return this._parent;
    }

    set parent(id: number) {
        this._parent = id;
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

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application) {
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
                background: {
                    r: Math.round(this.computeAttr(rng['l'].shape.parameters.background.r, rng['r'].shape.parameters.background.r, bezier(p))),
                    g: Math.round(this.computeAttr(rng['l'].shape.parameters.background.g, rng['r'].shape.parameters.background.g, bezier(p))),
                    b: Math.round(this.computeAttr(rng['l'].shape.parameters.background.b, rng['r'].shape.parameters.background.b, bezier(p))),
                    a: this.computeAttr(rng['l'].shape.parameters.background.a, rng['r'].shape.parameters.background.a, bezier(p)),
                },
                opacity: this.computeAttr(rng['l'].shape.parameters.opacity, rng['r'].shape.parameters.opacity, bezier(p)),
                borderRadius: [
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[0], rng['r'].shape.parameters.borderRadius[0], bezier(p))),
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[1], rng['r'].shape.parameters.borderRadius[1], bezier(p))),
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[2], rng['r'].shape.parameters.borderRadius[2], bezier(p))),
                    Math.round(this.computeAttr(rng['l'].shape.parameters.borderRadius[3], rng['r'].shape.parameters.borderRadius[3], bezier(p)))
                ],
                rotate: {
                    x: Math.round(this.computeAttr(rng['l'].shape.parameters.rotate.x, rng['r'].shape.parameters.rotate.x, bezier(p))),
                    y: Math.round(this.computeAttr(rng['l'].shape.parameters.rotate.y, rng['r'].shape.parameters.rotate.y, bezier(p))),
                    z: Math.round(this.computeAttr(rng['l'].shape.parameters.rotate.z, rng['r'].shape.parameters.rotate.z, bezier(p))),
                },
                skew: {
                    x: Math.round(this.computeAttr(rng['l'].shape.parameters.skew.x, rng['r'].shape.parameters.skew.x, bezier(p))),
                    y: Math.round(this.computeAttr(rng['l'].shape.parameters.skew.y, rng['r'].shape.parameters.skew.y, bezier(p))),
                },
                origin: {
                    x: this.computeAttr(rng['l'].shape.parameters.origin.x, rng['r'].shape.parameters.origin.x, bezier(p)),
                    y: this.computeAttr(rng['l'].shape.parameters.origin.y, rng['r'].shape.parameters.origin.y, bezier(p)),
                },
                //zindex: rng['l'].shape.parameters.zindex,
                zindex: this.globalShape.parameters.zindex,
                relativeSize: {
                    width: this.computeAttr(rng['l'].shape.parameters.relativeSize.width, rng['r'].shape.parameters.relativeSize.width, bezier(p)),
                    height: this.computeAttr(rng['l'].shape.parameters.relativeSize.height, rng['r'].shape.parameters.relativeSize.height, bezier(p)),
                },
                relativePosition: {
                    top: this.computeAttr(rng['l'].shape.parameters.relativePosition.top, rng['r'].shape.parameters.relativePosition.top, bezier(p)),
                    left: this.computeAttr(rng['l'].shape.parameters.relativePosition.left, rng['r'].shape.parameters.relativePosition.left, bezier(p)),
                },
            }
            shape.css("visibility", "visible");  
            helper.css("visibility", "visible");
        } else {
            if (this._keyframes.length == 1) {
                var parent: Layer = app.timeline.getLayer(this.parent);
                if (parent) {
                    if (parent.isVisible(position, app.timeline)) {
                        shape.css("visibility", "visible");
                        helper.css("visibility", "visible");
                    } else {
                        shape.css("visibility", "hidden");
                        helper.css("visibility", "hidden");
                    }
                } else {
                    shape.css("visibility", "visible");
                    helper.css("visibility", "visible");
                }
            } else {
                //shape.hide(); 
                shape.css("visibility", "hidden");
                helper.css("visibility", "hidden");
                //shape.find('.shape').css('visibility', 'hidden');
            }
        }

        //set new attributes to object
        var parentWidth: number = shape.parent().width();
        var parentHeight: number = shape.parent().height();

        shape.css({
            /*'top': (params.top / parentHeight) * 100 + '%',
            'left': (params.left / parentWidth) * 100 + '%',
            'width': (params.width / parentWidth) * 100 + '%',
            'height': (params.height / parentHeight) * 100 + '%',*/
            'left': params.relativePosition.left + '%',
            'top': params.relativePosition.top + '%',
            'width': params.relativeSize.width + '%',
            'height': params.relativeSize.height + '%',
            'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')',
            'border': params.border,
            'z-index': params.zindex,
            'opacity': params.opacity,
            'border-top-left-radius': params.borderRadius[0],
            'border-top-right-radius': params.borderRadius[1],
            'border-bottom-right-radius': params.borderRadius[2],
            'border-bottom-left-radius': params.borderRadius[3],
            /*'border-top-left-radius': (params.borderRadius[0] / rng['r'].shape.parameters.width) * 100 + '%',
            'border-top-right-radius': (params.borderRadius[1] / rng['r'].shape.parameters.width) * 100 + '%',
            'border-bottom-right-radius': (params.borderRadius[2] / rng['r'].shape.parameters.width) * 100 + '%',
            'border-bottom-left-radius': (params.borderRadius[3] / rng['r'].shape.parameters.width) * 100 + '%',*/
            'transform': 'rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
            'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
        });

        /*helper.css({
            'top': ((params.top - 1) / parentHeight) * 100 + '%',
            'left': ((params.left - 1) / parentWidth) * 100 + '%',
            'width': ((params.width + 2) / parentWidth) * 100 + '%',
            'height': ((params.height + 2) / parentHeight) * 100 + '%',
            'z-index': helper.css('z-index'),
        });*/
        helper.css({
            'left': params.relativePosition.left + '%',
            'top': params.relativePosition.top + '%',
            'width': params.relativeSize.width + '%',
            'height': params.relativeSize.height + '%',
            'z-index': helper.css('z-index'),
        });
        helper.css("left", "-=1");
        helper.css("top", "-=1");
        helper.css("width", "+=2");
        helper.css("height", "+=2");

        if (this.idEl != null) {
            shape.attr('id', this.idEl);
        } else {
            shape.removeAttr('id');
        }

        if (currentLayerId == this.id) {
            app.controlPanel.updateDimensions({ width: params.width, height: params.height });
            app.controlPanel.updateOpacity(params.opacity);
            app.controlPanel.updateColor({ r: params.background.r, g: params.background.g, b: params.background.b }, params.background.a);
            app.controlPanel.updateBorderRadius(params.borderRadius);
            app.controlPanel.update3DRotate({ x: params.rotate.x, y: params.rotate.y, z: params.rotate.z });
            app.controlPanel.updateSkew({ x: params.skew.x, y: params.skew.y });
            app.controlPanel.updateTransformOrigin(params.origin.x, params.origin.y);
            $('.shape-helper.highlight').first().find('.origin-point').css({
                'left': params.origin.x + '%',
                'top': params.origin.y + '%',
            });
        }
    }

    isVisible(position: number, timeline) {
        //find interval between position
        var rangeData = this.getRange(position);
        var rng: Array<Keyframe> = rangeData.rng;
        if (Object.keys(rng).length == 2) {
            return true;
        } else {
            if (this._keyframes.length == 1) {
                //return true;
                var parent: Layer = timeline.getLayer(this.parent);
                if (parent) {
                    return parent.isVisible(position, timeline);
                } else {
                    return true;
                }
            } else {
                return false;
            }
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

        //fix if position == right and left is null
        if (left === null && right === position && this.timestamps.length >= 2) {
            left = right;
            right = this.timestamps[index + 1];
        }

        //for animatable z-index
        /*if (right === position) {
            left = right;
            right = null;
        }*/

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

    getInitStyles(nameElement: string, workspaceSize: Dimensions) {
        var p: Parameters = (this.getKeyframeByTimestamp(this.timestamps[0])).shape.parameters;
        var cssObject: any = {
            'name': '.' + nameElement,
            'position': 'absolute',
            /*'width': (p.width / workspaceSize.width) * 100 + '%',
            'height': (p.height / workspaceSize.height) * 100 + '%',
            'top': (p.top / workspaceSize.height) * 100 + '%',
            'left': (p.left / workspaceSize.width) * 100 + '%',*/
            'width': p.relativeSize.width + '%',
            'height': p.relativeSize.height + '%',
            'top': p.relativePosition.top + '%',
            'left': p.relativePosition.left + '%',
            'background': 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')',
            //'z-index': p.zindex,
            'z-index': this.globalShape.parameters.zindex,
    };

        if (p.opacity != 1) {
            cssObject['opacity'] = p.opacity;
        }

        if ((p.borderRadius[0] == p.borderRadius[1]) &&
        (p.borderRadius[0] == p.borderRadius[2]) &&
        (p.borderRadius[0] == p.borderRadius[3])) {
            if (p.borderRadius[0] != 0) {
                cssObject['border-radius'] = p.borderRadius[0] + 'px';
                //cssObject['border-radius'] = (p.borderRadius[0] / p.width) * 100 + '%';
            }
        } else {
            /*cssObject['border-top-left-radius'] = (p.borderRadius[0] / p.width) * 100 + '%';
            cssObject['border-top-right-radius'] = (p.borderRadius[1] / p.width) * 100 + '%';
            cssObject['border-bottom-right-radius'] = (p.borderRadius[2] / p.width) * 100 + '%';
            cssObject['border-bottom-left-radius'] = (p.borderRadius[3] / p.width) * 100 + '%';*/
            cssObject['border-top-left-radius'] = p.borderRadius[0] + 'px';
            cssObject['border-top-right-radius'] = p.borderRadius[1] + 'px';
            cssObject['border-bottom-right-radius'] = p.borderRadius[2] + 'px';
            cssObject['border-bottom-left-radius'] = p.borderRadius[3] + 'px';
        }

        if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0 || p.skew.x != 0 || p.skew.y != 0) {
            if ((p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0) && (p.skew.x != 0 || p.skew.y != 0)) {
                cssObject['transform'] = 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg)';
            } else if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0) {
                cssObject['transform'] = 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg)';
            } else if (p.skew.x != 0 || p.skew.y != 0) {
                cssObject['transform'] = 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg)';
            }

            if (p.origin.x != 50 && p.origin.y != 50) {
                cssObject['transform-origin'] = p.origin.x + '% ' + p.origin.y + '%';
            }
        }

        return cssObject;
    }

    getKeyframeStyle(timestamp: number, workspaceSize: Dimensions) {
        //check, if parameters ís changing
        var change: repeatParams = {
            width: false,
            height: false,
            top: false,
            left: false,
            bg: false,
            opacity: false,
            radius: false,
            rotate: false,
            skew: false,
            origin: false,
        }
        var initP: Parameters = (this.getKeyframeByTimestamp(this.timestamps[0])).shape.parameters;
        this.getAllKeyframes().forEach((k: Keyframe, i: number) => {
            var p: Parameters = k.shape.parameters;
            if (initP.width != p.width) change.width = true;
            if (initP.height != p.height) change.height = true;
            if (initP.top != p.top) change.top = true;
            if (initP.left != p.left) change.left = true;
            if (initP.background.r != p.background.r) change.bg = true;
            if (initP.background.g != p.background.g) change.bg = true;
            if (initP.background.b != p.background.b) change.bg = true;
            if (initP.background.a != p.background.a) change.bg = true;
            if (initP.opacity != p.opacity) change.opacity = true;
            if (initP.borderRadius[0] != p.borderRadius[0]) change.radius = true;
            if (initP.borderRadius[1] != p.borderRadius[1]) change.radius = true;
            if (initP.borderRadius[2] != p.borderRadius[2]) change.radius = true;
            if (initP.borderRadius[3] != p.borderRadius[3]) change.radius = true;
            if (initP.rotate.x != p.rotate.x) change.rotate = true;
            if (initP.rotate.y != p.rotate.y) change.rotate = true;
            if (initP.rotate.z != p.rotate.z) change.rotate = true;
            if (initP.skew.x != p.skew.x) change.skew = true;
            if (initP.skew.y != p.skew.y) change.skew = true;
            if (initP.origin.x != p.origin.x) change.origin = true;
            if (initP.origin.y != p.origin.y) change.origin = true;
        });

        var p: Parameters = (this.getKeyframeByTimestamp(timestamp)).shape.parameters;
        var cssObject = {};

        /*if (change.width) cssObject['width'] = (p.width / workspaceSize.width) * 100 + '%';
        if (change.height) cssObject['height'] = (p.height / workspaceSize.height) * 100 + '%';
        if (change.top) cssObject['top'] = (p.top / workspaceSize.height) * 100 + '%';
        if (change.left) cssObject['left'] = (p.left / workspaceSize.width) * 100 + '%';*/
        if (change.width) cssObject['width'] = p.relativeSize.width + '%';
        if (change.height) cssObject['height'] = p.relativeSize.height + '%';
        if (change.top) cssObject['top'] = p.relativePosition.top + '%';
        if (change.left) cssObject['left'] = p.relativePosition.left + '%';
        if (change.bg) cssObject['background'] = 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')';
        if (change.opacity) cssObject['opacity'] = p.opacity;
        /*if (change.radius) {
            if ((p.borderRadius[0] == p.borderRadius[1]) &&
            (p.borderRadius[0] == p.borderRadius[2]) &&
            (p.borderRadius[0] == p.borderRadius[3])) {
                cssObject['border-radius'] = (p.borderRadius[0] / p.width) * 100 + '%';
            } else {
                cssObject['border-top-left-radius'] = (p.borderRadius[0] / p.width) * 100 + '%';
                cssObject['border-top-right-radius'] = (p.borderRadius[1] / p.width) * 100 + '%';
                cssObject['border-bottom-right-radius'] = (p.borderRadius[2] / p.width) * 100 + '%';
                cssObject['border-bottom-left-radius'] = (p.borderRadius[3] / p.width) * 100 + '%';              
            }
        }*/
        if (change.radius) {
            if ((p.borderRadius[0] == p.borderRadius[1]) &&
            (p.borderRadius[0] == p.borderRadius[2]) &&
            (p.borderRadius[0] == p.borderRadius[3])) {
                cssObject['border-radius'] = p.borderRadius[0] + 'px';
            } else {
                cssObject['border-top-left-radius'] = p.borderRadius[0] + 'px';
                cssObject['border-top-right-radius'] = p.borderRadius[1] + 'px';
                cssObject['border-bottom-right-radius'] = p.borderRadius[2] + 'px';
                cssObject['border-bottom-left-radius'] = p.borderRadius[3] + 'px';        
            }
        }
        if (change.rotate && change.skew) {
            cssObject['transform'] = 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg)';
        } else if (change.rotate) {
            cssObject['transform'] = 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg)';
        } else if (change.skew) {
            cssObject['transform'] = 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg)';
        }

        if (change.rotate && change.skew) {
            if (change.origin) cssObject["transform-origin"] = p.origin.x + '% ' + p.origin.y + '%';
        }

        cssObject["visibility"] = 'visible';
        return cssObject;
    }

    getObject(): string {
        return '';
    }

    renderShape(container: JQuery, position: number, currentScope: number): JQuery {
        return null;
    }

    renderShapeCore(shape: JQuery, container: JQuery, position: number, currentScope: number): JQuery {
        //get keyframe by pointer position
        var keyframe: Keyframe = this.getKeyframeByTimestamp(position);

        //if no keyframe, get init keyframe
        if (keyframe == null) {
            keyframe = this.getKeyframe(0);
        }
        if (keyframe != null) {
            var params: Parameters = keyframe.shape.parameters;

            var relativeTop: number = (params.top / container.height()) * 100;
            var relativeLeft: number = (params.left / container.width()) * 100;
            var relativeWidth: number = (params.width / container.width()) * 100;
            var relativeHeight: number = (params.height / container.height()) * 100;

            var css = {
                'top': relativeTop + '%',
                'left': relativeLeft + '%',
                'width': relativeWidth + '%',
                'height': relativeHeight + '%',
                'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.a + ',' + params.background.a + ')',
                'border': params.border,
                //'z-index': params.zindex,
                'z-index': this.globalShape.parameters.zindex,
                'opacity': params.opacity,
                'border-top-left-radius': params.borderRadius[0],
                'border-top-right-radius': params.borderRadius[1],
                'border-bottom-right-radius': params.borderRadius[2],
                'border-bottom-left-radius': params.borderRadius[3],
            }
            shape.css(css);

            if (this.idEl) {
                shape.attr('id', this.idEl);
            }

            shape.attr('data-id', keyframe.shape.id); 

            if (container.find('.shape[data-id="' + this.id + '"]').length) {
                container.find('.shape[data-id="' + this.id + '"]').remove();
            }

            shape.appendTo(container);

            //if current scope is rendered scope, show helpers
            if (currentScope == this.parent) {
                var helper: JQuery = $('<div>').addClass('shape-helper');
                helper.append($('<div>').addClass('origin-point'));
                if (this.idEl) {
                    var helpername: JQuery = $('<div>').addClass('helpername').html('<p>' + this.name + '<span class="div-id">#' + this.idEl + '</span></p>');
                } else {
                    var helpername: JQuery = $('<div>').addClass('helpername').html('<p>' + this.name + '</p>');
                }
                helper.css({
                    'top': ((params.top-1) / container.height()) * 100 + '%',
                    'left': ((params.left - 1) / container.width()) * 100 + '%',
                    'width': ((params.width + 2) / container.width()) * 100 + '%',
                    'height': ((params.height + 2) / container.height()) * 100 + '%',
                    //'z-index': params.zindex + 1000,
                    'z-index': this.globalShape.parameters.zindex + 1000,
                });

                helper.attr('data-id', keyframe.shape.id);
                helpername.appendTo(helper);
                if (container.find('.shape-helper[data-id="' + this.id + '"]').length) {
                    container.find('.shape-helper[data-id="' + this.id + '"]').remove();
                }
                helper.appendTo(container);
            }
        }

        return shape;
    }

    toString() : string {
        return "ID: " + this.id + "Jmeno vrstvy: " + this.name + ", poradi: " + this.order;
    }
}