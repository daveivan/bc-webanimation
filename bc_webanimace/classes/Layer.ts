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
    isVisibleOnWorkspace: boolean;
    isMultipleEdit: boolean;

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
        this.isVisibleOnWorkspace = true;
        this.isMultipleEdit = false;
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
        //if only one keyframe remain, set it to zero position
        if (this._keyframes.length == 1) {
            this.getKeyframe(0).timestamp = 0;
            this._timestamps[0] = 0;
        }
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

    get type() {
        return this._type;
    }

    transformOld(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application, showHelpers: boolean = true) {
        //find interval between position
        var rangeData = this.getRange(position);
        var left: number = rangeData.left;
        var right: number = rangeData.right;
        var rng: Array<Keyframe> = rangeData.rng;
        var params: Parameters = {
            top: rangeData.params.top,
            left: rangeData.params.left,
            width: rangeData.params.width,
            height: rangeData.params.height,
            background: {
                r: rangeData.params.background.r,
                g: rangeData.params.background.g,
                b: rangeData.params.background.b,
                a: rangeData.params.background.a,
            },
            opacity: rangeData.params.opacity,
            borderRadius: [
                rangeData.params.borderRadius[0],
                rangeData.params.borderRadius[1],
                rangeData.params.borderRadius[2],
                rangeData.params.borderRadius[3]
            ],
            rotate: {
                x: rangeData.params.rotate.x,
                y: rangeData.params.rotate.y,
                z: rangeData.params.rotate.z,
            },
            skew: {
                x: rangeData.params.skew.x,
                y: rangeData.params.skew.y,
            },
            origin: {
                x: rangeData.params.origin.x,
                y: rangeData.params.origin.y,
            },
            zindex: this.globalShape.parameters.zindex,
            relativeSize: {
                width: rangeData.params.relativeSize.width,
                height: rangeData.params.relativeSize.height,
            },
            relativePosition: {
                top: rangeData.params.relativePosition.top,
                left: rangeData.params.relativePosition.left,
            },
            scale: rangeData.params.scale,
        }
        var cssStyles = new Array();
        /*var isChange = {
            top: false, left: false,
            width: false, height: false,
            bgR: false, bgG: false, bgB: false, bgA: false,
            opacity: false,
            br0: false, br1: false, br2: false, br3: false,
            rotateX: false, rotateY: false, rotateZ: false,
            skewX: false, skewY: false,
            originX: false, originY: false,
        };*/
        var isChange = {
            isKeyframe: false,
            top: false, left: false,
            width: false, height: false,
            bg: false,
            opacity: false,
            br0: false, br1: false, br2: false, br3: false,
            rotate: false,
            origin: false
        };

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            isChange.isKeyframe = true;
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);
            var paramsLeft: Parameters = rng['l'].shape.parameters;
            var paramsRight: Parameters = rng['r'].shape.parameters;

            if (paramsLeft.top != paramsRight.top) {
                console.log('vypočitavam top');
                isChange.top = true;
                params['relativePosition']['top'] = this.computeAttr(paramsLeft.relativePosition.top, paramsRight.relativePosition.top, bezier(p));
                params['top'] = Math.round(this.computeAttr(paramsLeft.top, paramsRight.top, bezier(p)));
            }
            if (paramsLeft.left != paramsRight.left) {
                isChange.left = true;
                params['relativePosition']['left'] = this.computeAttr(paramsLeft.relativePosition.left, paramsRight.relativePosition.left, bezier(p));
                params['left'] = Math.round(this.computeAttr(paramsLeft.left, paramsRight.left, bezier(p)));
            }
            if (paramsLeft.width != paramsRight.width) {
                isChange.width = true;
                params['relativeSize']['width'] = this.computeAttr(paramsLeft.relativeSize.width, paramsRight.relativeSize.width, bezier(p));
                params['width'] = Math.round(this.computeAttr(paramsLeft.width, paramsRight.width, bezier(p)));
            }
            if (paramsLeft.height != paramsRight.height) {
                isChange.height = true;
                params['relativeSize']['height'] = this.computeAttr(paramsLeft.relativeSize.height, paramsRight.relativeSize.height, bezier(p));
                params['height'] = Math.round(this.computeAttr(paramsLeft.height, paramsRight.height, bezier(p)));
            }
            if (paramsLeft.background.r != paramsRight.background.r) {
                isChange.bg = true;
                params['background']['r'] = Math.round(this.computeAttr(paramsLeft.background.r, paramsRight.background.r, bezier(p)));
            }
            if (paramsLeft.background.g != paramsRight.background.g) {
                isChange.bg = true;
                params['background']['g'] = Math.round(this.computeAttr(paramsLeft.background.g, paramsRight.background.g, bezier(p)));
            }
            if (paramsLeft.background.b != paramsRight.background.b) {
                isChange.bg = true;
                params['background']['b'] = Math.round(this.computeAttr(paramsLeft.background.b, paramsRight.background.b, bezier(p)));
            }
            if (paramsLeft.background.a != paramsRight.background.a) {
                isChange.bg = true;
                params['background']['a'] = this.computeAttr(paramsLeft.background.a, paramsRight.background.a, bezier(p));
            }
            if (paramsLeft.opacity != paramsRight.opacity) {
                isChange.opacity = true;
                params['opacity'] = this.computeAttr(paramsLeft.opacity, paramsRight.opacity, bezier(p));
            }
            if (paramsLeft.borderRadius[0] != paramsRight.borderRadius[0]) {
                isChange.br0 = true;
                params['borderRadius']['0'] = Math.round(this.computeAttr(paramsLeft.borderRadius[0], paramsRight.borderRadius[0], bezier(p)));
            }
            if (paramsLeft.borderRadius[1] != paramsRight.borderRadius[1]) {
                isChange.br1 = true;
                params['borderRadius']['1'] = Math.round(this.computeAttr(paramsLeft.borderRadius[1], paramsRight.borderRadius[1], bezier(p)));
            }
            if (paramsLeft.borderRadius[2] != paramsRight.borderRadius[2]) {
                isChange.br2 = true;
                params['borderRadius']['2'] = Math.round(this.computeAttr(paramsLeft.borderRadius[2], paramsRight.borderRadius[2], bezier(p)));
            }
            if (paramsLeft.borderRadius[3] != paramsRight.borderRadius[3]) {
                isChange.br3 = true;
                params['borderRadius']['3'] = Math.round(this.computeAttr(paramsLeft.borderRadius[3], paramsRight.borderRadius[3], bezier(p)));
            }
            if (paramsLeft.rotate.x != paramsRight.rotate.x) {
                isChange.rotate = true;
                params['rotate']['x'] = Math.round(this.computeAttr(paramsLeft.rotate.x, paramsRight.rotate.x, bezier(p)));
            }
            if (paramsLeft.rotate.y != paramsRight.rotate.y) {
                isChange.rotate = true;
                params['rotate']['y'] = Math.round(this.computeAttr(paramsLeft.rotate.y, paramsRight.rotate.y, bezier(p)));
            }
            if (paramsLeft.rotate.z != paramsRight.rotate.z) {
                isChange.rotate = true;
                params['rotate']['z'] = Math.round(this.computeAttr(paramsLeft.rotate.z, paramsRight.rotate.z, bezier(p)));
            }
            if (paramsLeft.skew.x != paramsRight.skew.x) {
                isChange.rotate = true;
                params['skew']['x'] = Math.round(this.computeAttr(paramsLeft.skew.x, paramsRight.skew.x, bezier(p)));
            }
            if (paramsLeft.skew.y != paramsRight.skew.y) {
                isChange.rotate = true;
                params['skew']['y'] = Math.round(this.computeAttr(paramsLeft.skew.y, paramsRight.skew.y, bezier(p)));
            }
            if (paramsLeft.origin.x != paramsRight.origin.x) {
                isChange.origin = true;
                params['origin']['x'] = this.computeAttr(paramsLeft.origin.x, paramsRight.origin.x, bezier(p));
            }
            if (paramsLeft.origin.y != paramsRight.origin.y) {
                isChange.origin = true;
                params['origin']['y'] = this.computeAttr(paramsLeft.origin.y, paramsRight.origin.y, bezier(p));
            }
            params['zindex'] = this.globalShape.parameters.zindex;
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
                shape.css("visibility", "hidden");
                helper.css("visibility", "hidden");
            }            
        }

        //set new attributes to object
        if (isChange.top)
            cssStyles['top'] = params.relativePosition.top + "%";
        if (isChange.left)
            cssStyles['left'] = params.relativePosition.left + "%";
        if (isChange.width)
            cssStyles['width'] = params.relativeSize.width + "%";
        if (isChange.height)
            cssStyles['height'] = params.relativeSize.height + "%";
        if (isChange.bg)
            cssStyles['background'] = 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')';
        if (isChange.opacity)
            cssStyles['opacity'] = params.opacity;
        if (isChange.br0)
            cssStyles['border-top-left-radius'] = params.borderRadius[0];
        if (isChange.br1)
            cssStyles['border-top-right-radius'] = params.borderRadius[1];
        if (isChange.br2)
            cssStyles['border-bottom-right-radius'] = params.borderRadius[2];
        if (isChange.br3)
            cssStyles['border-bottom-left-radius'] = params.borderRadius[3];
        if (isChange.rotate)
            cssStyles['transform'] = 'rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)';
        if (isChange.origin)
            cssStyles['transform-origin'] = params.origin.x + '% ' + params.origin.y + '%';
        cssStyles['z-index'] = params.zindex;

        if (isChange.isKeyframe) {
            shape.css(cssStyles);
        } else {
            shape.css({
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
                'transform': 'rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
                'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
            });           
        }

        helper.css({
            'left': params.relativePosition.left + '%',
            'top': params.relativePosition.top + '%',
            'width': params.relativeSize.width + '%',
            'height': params.relativeSize.height + '%',
            'z-index': helper.css('z-index'),
            'transform': 'rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
            'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
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

    transformLepsi(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application, showHelpers: boolean = true) {
        //find interval between position
        var rangeData = this.getRange(position);
        var left: number = rangeData.left;
        var right: number = rangeData.right;
        var rng: Array<Keyframe> = rangeData.rng;
        var params: Parameters = rangeData.params;

        var topParam = params.top;
        var leftParam = params.left;
        var rTopParam = params.relativePosition.top;
        var rLeftParam = params.relativePosition.left;
        var widthParam = params.width;
        var rWidthParam = params.relativeSize.width;
        var heightParam = params.height;
        var rHeightParam = params.relativeSize.height;
        var bgParam: rgba = params.background;
        var opacityParam = params.opacity;
        var brParam: Array<number> = new Array<number>();
        brParam[0] = params.borderRadius[0];
        brParam[1] = params.borderRadius[1];
        brParam[2] = params.borderRadius[2];
        brParam[3] = params.borderRadius[3];
        var rotatexParam = params.rotate.x;
        var rotateyParam = params.rotate.y;
        var rotatezParam = params.rotate.z;
        var skewxParam = params.skew.x;
        var skewyParam = params.skew.y;
        var scaleParam = params.scale;
        var originxParam = params.origin.x;
        var originyParam = params.origin.y;

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            var paramsLeft: Parameters = rng['l'].shape.parameters;
            var paramsRight: Parameters = rng['r'].shape.parameters;

            if (paramsLeft.top != paramsRight.top) {
                rTopParam = this.computeAttr(paramsLeft.relativePosition.top, paramsRight.relativePosition.top, bezier(p));
                topParam = Math.round(this.computeAttr(paramsLeft.top, paramsRight.top, bezier(p)));
                shape.css({ 'top': rTopParam + '%' });
                helper.css({ 'top': rTopParam + '%' });
            }
            if (paramsLeft.left != paramsRight.left) {
                rLeftParam = this.computeAttr(paramsLeft.relativePosition.left, paramsRight.relativePosition.left, bezier(p));
                leftParam = Math.round(this.computeAttr(paramsLeft.left, paramsRight.left, bezier(p)));
                shape.css({ 'left': rLeftParam + '%' });
                helper.css({ 'left': rLeftParam + '%' });
            }
            if (paramsLeft.width != paramsRight.width) {
                rWidthParam = this.computeAttr(paramsLeft.relativeSize.width, paramsRight.relativeSize.width, bezier(p));
                widthParam = Math.round(this.computeAttr(paramsLeft.width, paramsRight.width, bezier(p)));
                shape.css({ 'width': rWidthParam + '%' });
                helper.css({ 'width': rWidthParam + '%' });
            }
            if (paramsLeft.height != paramsRight.height) {
                rHeightParam = this.computeAttr(paramsLeft.relativeSize.height, paramsRight.relativeSize.height, bezier(p));
                heightParam = Math.round(this.computeAttr(paramsLeft.height, paramsRight.height, bezier(p)));
                shape.css({ 'height': rHeightParam + '%' });
                helper.css({ 'height': rHeightParam + '%' });
            }
            var isBg = false;
            if (paramsLeft.background.r != paramsRight.background.r) {
                isBg = true;
                bgParam.r = Math.round(this.computeAttr(paramsLeft.background.r, paramsRight.background.r, bezier(p)));
            }
            if (paramsLeft.background.g != paramsRight.background.g) {
                isBg = true;
                bgParam.g = Math.round(this.computeAttr(paramsLeft.background.g, paramsRight.background.g, bezier(p)));
            }
            if (paramsLeft.background.b != paramsRight.background.b) {
                isBg = true;
                bgParam.b = Math.round(this.computeAttr(paramsLeft.background.b, paramsRight.background.b, bezier(p)));
            }
            if (paramsLeft.background.a != paramsRight.background.a) {
                isBg = true;
                bgParam.a = this.computeAttr(paramsLeft.background.a, paramsRight.background.a, bezier(p));
            }

            if (isBg) {
                shape.css({ 'background': 'rgba(' + bgParam.r + ',' + bgParam.g + ',' + bgParam.b + ',' + bgParam.a + ')' });
            }

            if (paramsLeft.opacity != paramsRight.opacity) {
                opacityParam = this.computeAttr(paramsLeft.opacity, paramsRight.opacity, bezier(p));
                shape.css({ 'opacity': opacityParam });
            }
            if (paramsLeft.borderRadius[0] != paramsRight.borderRadius[0]) {
                brParam[0] = Math.round(this.computeAttr(paramsLeft.borderRadius[0], paramsRight.borderRadius[0], bezier(p)));
                shape.css({ 'border-top-left-radius': brParam[0] });
            }
            if (paramsLeft.borderRadius[1] != paramsRight.borderRadius[1]) {
                brParam[1] = Math.round(this.computeAttr(paramsLeft.borderRadius[1], paramsRight.borderRadius[1], bezier(p)));
                shape.css({ 'border-top-right-radius': brParam[1] });
            }
            if (paramsLeft.borderRadius[2] != paramsRight.borderRadius[2]) {
                brParam[2] = Math.round(this.computeAttr(paramsLeft.borderRadius[2], paramsRight.borderRadius[2], bezier(p)));
                shape.css({ 'border-bottom-right-radius': brParam[2] });
            }
            if (paramsLeft.borderRadius[3] != paramsRight.borderRadius[3]) {
                brParam[3] = Math.round(this.computeAttr(paramsLeft.borderRadius[3], paramsRight.borderRadius[3], bezier(p)));
                shape.css({ 'border-bottom-left-radius': brParam[3] });
            }

            var isTransform = false;
            if (paramsLeft.rotate.x != paramsRight.rotate.x) {
                isTransform = true;
                rotatexParam = Math.round(this.computeAttr(paramsLeft.rotate.x, paramsRight.rotate.x, bezier(p)));
            }
            if (paramsLeft.rotate.y != paramsRight.rotate.y) {
                isTransform = true;
                rotateyParam = Math.round(this.computeAttr(paramsLeft.rotate.y, paramsRight.rotate.y, bezier(p)));
            }
            if (paramsLeft.rotate.z != paramsRight.rotate.z) {
                isTransform = true;
                rotatezParam = Math.round(this.computeAttr(paramsLeft.rotate.z, paramsRight.rotate.z, bezier(p)));
            }
            if (paramsLeft.skew.x != paramsRight.skew.x) {
                isTransform = true;
                skewxParam = Math.round(this.computeAttr(paramsLeft.skew.x, paramsRight.skew.x, bezier(p)));
            }
            if (paramsLeft.skew.y != paramsRight.skew.y) {
                isTransform = true;
                skewyParam = Math.round(this.computeAttr(paramsLeft.skew.y, paramsRight.skew.y, bezier(p)));
            }

            var isOrigin = false;
            if (paramsLeft.origin.x != paramsRight.origin.x) {
                isOrigin = true;
                originxParam = this.computeAttr(paramsLeft.origin.x, paramsRight.origin.x, bezier(p));
            }
            if (paramsLeft.origin.y != paramsRight.origin.y) {
                isOrigin = true;
                originyParam = this.computeAttr(paramsLeft.origin.y, paramsRight.origin.y, bezier(p));
            }
            if (paramsLeft.scale != paramsRight.scale) {
                isTransform = true;
                scaleParam = this.computeAttr(paramsLeft.scale, paramsRight.scale, bezier(p));
            }

            if (isOrigin) {
                shape.css({ 'transform-origin': originxParam + '% ' + originyParam + '%' });
                helper.css({ 'transform-origin': originxParam + '% ' + originyParam + '%' });
            }

            if (isTransform) {
                shape.css({ 'transform': 'scale(' + scaleParam + ') rotateX(' + rotatexParam + 'deg) rotateY(' + rotateyParam + 'deg) rotateZ(' + rotatezParam + 'deg) skew(' +skewxParam + 'deg , ' + skewyParam + 'deg)' });
                helper.css({ 'transform': 'scale(' + scaleParam + ') rotateX(' + rotatexParam + 'deg) rotateY(' + rotateyParam + 'deg) rotateZ(' + rotatezParam + 'deg) skew(' + skewxParam + 'deg , ' + skewyParam + 'deg)' });
            }
            shape.removeClass('novisible');
            helper.removeClass('novisible');
        } else {
            if (this._keyframes.length == 1) {
                var parent: Layer = app.timeline.getLayer(this.parent);
                if (parent) {
                    if (parent.isVisible(position, app.timeline)) {
                        shape.removeClass('novisible');
                        helper.removeClass('novisible');
                    } else {
                        shape.addClass('novisible');
                        helper.addClass('novisible');
                    }
                } else {
                    shape.removeClass('novisible');
                    helper.removeClass('novisible');
                }
            } else {
                shape.addClass('novisible');
                helper.addClass('novisible');
            }
        }

        if (this.idEl != null) {
            shape.attr('id', this.idEl);
        } else {
            shape.removeAttr('id');
        }

        if (currentLayerId == this.id) {
            //app.controlPanel.updateDimensions({ width: params.width, height: params.height });
        }
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application, showHelpers: boolean = true) {
        //find interval between position
        var rangeData = this.getRange(position);
        var left: number = rangeData.left;
        var right: number = rangeData.right;
        var rng: Array<Keyframe> = rangeData.rng;

        var params: Parameters = {
            top: rangeData.params.top,
            left: rangeData.params.left,
            width: rangeData.params.width,
            height: rangeData.params.height,
            background: {
                r: rangeData.params.background.r,
                g: rangeData.params.background.g,
                b: rangeData.params.background.b,
                a: rangeData.params.background.a,
            },
            opacity: rangeData.params.opacity,
            borderRadius: [
                rangeData.params.borderRadius[0],
                rangeData.params.borderRadius[1],
                rangeData.params.borderRadius[2],
                rangeData.params.borderRadius[3]
            ],
            rotate: {
                x: rangeData.params.rotate.x,
                y: rangeData.params.rotate.y,
                z: rangeData.params.rotate.z,
            },
            skew: {
                x: rangeData.params.skew.x,
                y: rangeData.params.skew.y,
            },
            origin: {
                x: rangeData.params.origin.x,
                y: rangeData.params.origin.y,
            },
            zindex: this.globalShape.parameters.zindex,
            relativeSize: {
                width: rangeData.params.relativeSize.width,
                height: rangeData.params.relativeSize.height,
            },
            relativePosition: {
                top: rangeData.params.relativePosition.top,
                left: rangeData.params.relativePosition.left,
            },
            scale: rangeData.params.scale,
        }
        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            var paramsLeft: Parameters = rng['l'].shape.parameters;
            var paramsRight: Parameters = rng['r'].shape.parameters;

            if (paramsLeft.top != paramsRight.top) {
                params['relativePosition']['top'] = this.computeAttr(paramsLeft.relativePosition.top, paramsRight.relativePosition.top, bezier(p));
                params['top'] = Math.round(this.computeAttr(paramsLeft.top, paramsRight.top, bezier(p)));
                shape.css({ 'top': params.relativePosition.top + '%' });
                helper.css({ 'top': params.relativePosition.top + '%' });
                //if (showHelpers) //helper.css("top", "-=1");
                    //helper.css({ 'margin': '-1px' });
            }
            if (paramsLeft.left != paramsRight.left) {
                params['relativePosition']['left'] = this.computeAttr(paramsLeft.relativePosition.left, paramsRight.relativePosition.left, bezier(p));
                params['left'] = Math.round(this.computeAttr(paramsLeft.left, paramsRight.left, bezier(p)));
                shape.css({ 'left': params.relativePosition.left + '%' });
                helper.css({ 'left': params.relativePosition.left + '%' });
                //if (showHelpers) //helper.css("left", "-=1");
                    //helper.css({ 'margin': '-1px' });
            }
            if (paramsLeft.width != paramsRight.width) {
                params['relativeSize']['width'] = this.computeAttr(paramsLeft.relativeSize.width, paramsRight.relativeSize.width, bezier(p));
                params['width'] = Math.round(this.computeAttr(paramsLeft.width, paramsRight.width, bezier(p)));
                shape.css({ 'width': params.relativeSize.width + '%' });
                helper.css({ 'width': params.relativeSize.width + '%' });
                //if (showHelpers) helper.css("width", "+=2");
            }
            if (paramsLeft.height != paramsRight.height) {
                params['relativeSize']['height'] = this.computeAttr(paramsLeft.relativeSize.height, paramsRight.relativeSize.height, bezier(p));
                params['height'] = Math.round(this.computeAttr(paramsLeft.height, paramsRight.height, bezier(p)));
                shape.css({ 'height': params.relativeSize.height + '%' });
                helper.css({ 'height': params.relativeSize.height + '%' });
                //if (showHelpers) helper.css("height", "+=2");
            }
            var isBg = false;
            if (paramsLeft.background.r != paramsRight.background.r) {
                isBg = true;
                params.background.r = Math.round(this.computeAttr(paramsLeft.background.r, paramsRight.background.r, bezier(p)));
            }
            if (paramsLeft.background.g != paramsRight.background.g) {
                isBg = true;
                params.background.g = Math.round(this.computeAttr(paramsLeft.background.g, paramsRight.background.g, bezier(p)));
            }
            if (paramsLeft.background.b != paramsRight.background.b) {
                isBg = true;
                params.background.b = Math.round(this.computeAttr(paramsLeft.background.b, paramsRight.background.b, bezier(p)));
            }
            if (paramsLeft.background.a != paramsRight.background.a) {
                isBg = true;
                params.background.a = this.computeAttr(paramsLeft.background.a, paramsRight.background.a, bezier(p));
            }

            if (isBg) {
                shape.css({ 'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')' });
            }

            if (paramsLeft.opacity != paramsRight.opacity) {
                params['opacity'] = this.computeAttr(paramsLeft.opacity, paramsRight.opacity, bezier(p));
                shape.css({ 'opacity': params.opacity });
            }
            if (paramsLeft.borderRadius[0] != paramsRight.borderRadius[0]) {
                params['borderRadius'][0] = Math.round(this.computeAttr(paramsLeft.borderRadius[0], paramsRight.borderRadius[0], bezier(p)));
                shape.css({ 'border-top-left-radius': params.borderRadius[0] });
            }
            if (paramsLeft.borderRadius[1] != paramsRight.borderRadius[1]) {
                params['borderRadius'][1] = Math.round(this.computeAttr(paramsLeft.borderRadius[1], paramsRight.borderRadius[1], bezier(p)));
                shape.css({ 'border-top-right-radius': params.borderRadius[1] });
            }
            if (paramsLeft.borderRadius[2] != paramsRight.borderRadius[2]) {
                params['borderRadius'][2] = Math.round(this.computeAttr(paramsLeft.borderRadius[2], paramsRight.borderRadius[2], bezier(p)));
                shape.css({ 'border-bottom-right-radius': params.borderRadius[2] });
            }
            if (paramsLeft.borderRadius[3] != paramsRight.borderRadius[3]) {
                params['borderRadius'][3] = Math.round(this.computeAttr(paramsLeft.borderRadius[3], paramsRight.borderRadius[3], bezier(p)));
                shape.css({ 'border-bottom-left-radius': params.borderRadius[3] });
            }

            var isTransform = false;
            if (paramsLeft.rotate.x != paramsRight.rotate.x) {
                isTransform = true;
                params['rotate']['x'] = Math.round(this.computeAttr(paramsLeft.rotate.x, paramsRight.rotate.x, bezier(p)));
            }
            if (paramsLeft.rotate.y != paramsRight.rotate.y) {
                isTransform = true;
                params['rotate']['y'] = Math.round(this.computeAttr(paramsLeft.rotate.y, paramsRight.rotate.y, bezier(p)));
            }
            if (paramsLeft.rotate.z != paramsRight.rotate.z) {
                isTransform = true;
                params['rotate']['z'] = Math.round(this.computeAttr(paramsLeft.rotate.z, paramsRight.rotate.z, bezier(p)));
            }
            if (paramsLeft.skew.x != paramsRight.skew.x) {
                isTransform = true;
                params['skew']['x'] = Math.round(this.computeAttr(paramsLeft.skew.x, paramsRight.skew.x, bezier(p)));
            }
            if (paramsLeft.skew.y != paramsRight.skew.y) {
                isTransform = true;
                params['skew']['y'] = Math.round(this.computeAttr(paramsLeft.skew.y, paramsRight.skew.y, bezier(p)));
            }

            var isOrigin = false;
            if (paramsLeft.origin.x != paramsRight.origin.x) {
                isOrigin = true;
                params['origin']['x'] = this.computeAttr(paramsLeft.origin.x, paramsRight.origin.x, bezier(p));
            }
            if (paramsLeft.origin.y != paramsRight.origin.y) {
                isOrigin = true;
                params['origin']['y'] = this.computeAttr(paramsLeft.origin.y, paramsRight.origin.y, bezier(p));
            }
            if (paramsLeft.scale != paramsRight.scale) {
                isTransform = true;
                params['scale'] = this.computeAttr(paramsLeft.scale, paramsRight.scale, bezier(p));
            }

            if (isOrigin) {
                shape.css({ 'transform-origin': params.origin.x + '% ' + params.origin.y + '%' });
                helper.css({ 'transform-origin': params.origin.x + '% ' + params.origin.y + '%' });
            }

            if (isTransform) {
                shape.css({ 'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                helper.css({ 'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
            }
            shape.removeClass('novisible');
            helper.removeClass('novisible');
        } else {
            //Apply nearest keyframe styles
            shape.css({
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
                'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
                'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
            });

            if (showHelpers) {
                helper.css({
                    'left': params.relativePosition.left + '%',
                    'top': params.relativePosition.top + '%',
                    'width': params.relativeSize.width + '%',
                    'height': params.relativeSize.height + '%',
                    'z-index': (params.zindex + 1000),
                    'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
                    'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
                });

                helper.css("left", "-=1");
                helper.css("top", "-=1");
                helper.css("width", "+=2");
                helper.css("height", "+=2");                
            }

            if (this._keyframes.length == 1) {
                var parent: Layer = app.timeline.getLayer(this.parent);
                if (parent) {
                    if (parent.isVisible(position, app.timeline)) {
                        shape.removeClass('novisible');
                        helper.removeClass('novisible');
                    } else {
                        shape.addClass('novisible');
                        helper.addClass('novisible');
                    }
                } else {
                    shape.removeClass('novisible');
                    helper.removeClass('novisible');
                }
            } else {
                shape.addClass('novisible');
                helper.addClass('novisible');
            }
        }

        shape.attr('data-opacity', params.opacity);

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
            app.controlPanel.updateScale(params.scale);
            $('.shape-helper.highlight').first().find('.origin-point').css({
                'left': params.origin.x + '%',
                'top': params.origin.y + '%',
            });
        }
    }

    transformOriginal(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application) {
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
                scale: this.computeAttr(rng['l'].shape.parameters.scale, rng['r'].shape.parameters.scale, bezier(p)),
            }
            //shape.css("visibility", "visible");  
            //helper.css("visibility", "visible");
            shape.removeClass('novisible');  
            helper.removeClass('novisible');    
        } else {
            if (this._keyframes.length == 1) {
                var parent: Layer = app.timeline.getLayer(this.parent);
                if (parent) {
                    if (parent.isVisible(position, app.timeline)) {
                        //Jen tato vetev a bez if, pokud chci napodobit CSS3 animaci
                        //shape.css("visibility", "visible");
                        //helper.css("visibility", "visible");
                        shape.removeClass('novisible');
                        helper.removeClass('novisible'); 
                    } else {
                        //shape.css("visibility", "hidden");
                        //helper.css("visibility", "hidden");
                        shape.addClass('novisible');
                        helper.addClass('novisible'); 
                    }
                } else {
                    //shape.css("visibility", "visible");
                    //helper.css("visibility", "visible");
                    shape.removeClass('novisible');
                    helper.removeClass('novisible'); 
                }
            } else {
                //shape.hide(); 
                //shape.css("visibility", "hidden");
                //helper.css("visibility", "hidden");
                shape.addClass('novisible');
                helper.addClass('novisible'); 
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
            'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
            'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
    });

        shape.attr('data-opacity', params.opacity);

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
            //'z-index': helper.css('z-index'),
            'z-index': (params.zindex + 1000),
            'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
            'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
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
            app.controlPanel.updateScale(params.scale);
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

        /*if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0 || p.skew.x != 0 || p.skew.y != 0 || p.scale != 1) {
            if ((p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0) && (p.skew.x != 0 || p.skew.y != 0) && (p.scale != 1)) {
                cssObject['transform'] = 'scale(' + p.scale + ') rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg)';
            } else if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0) {
                cssObject['transform'] = 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg)';
            } else if (p.skew.x != 0 || p.skew.y != 0) {
                cssObject['transform'] = 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg)';
            }
        }*/

        if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0 || p.skew.x != 0 || p.skew.y != 0 || p.scale != 1) {
            var t: string = "";
            if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z) {
                t += 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) ';
            }
            if (p.skew.x != 0 || p.skew.y != 0) {
                t += 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg) ';
            }
            if (p.scale != 1) {
                t += 'scale(' + p.scale + ')';
            }
            cssObject['transform'] = t;
        }

        cssObject['transform-origin'] = p.origin.x + '% ' + p.origin.y + '%';
        cssObject['-webkit-transform-origin'] = p.origin.x + '% ' + p.origin.y + '%';

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
            scale: false,
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
            if (initP.scale != p.scale) change.scale = true;
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

        if (change.rotate || change.skew || change.scale) {
            var t: string = "";
            if (change.rotate) {
                t += 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) ';
            }
            if (change.skew) {
                t += 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg) ';
            }
            if (change.scale) {
                t += 'scale(' + p.scale + ')';
            }
            cssObject['transform'] = t;
        }

        if ((change.rotate || change.skew || change.scale) && change.origin) {
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

    renderShapeCore(shape: JQuery, container: JQuery, position: number, currentScope: number, h: JQuery = null): JQuery {
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
                'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')',
                'border': params.border,
                //'z-index': params.zindex,
                'z-index': this.globalShape.parameters.zindex,
                'opacity': params.opacity,
                'border-top-left-radius': params.borderRadius[0],
                'border-top-right-radius': params.borderRadius[1],
                'border-bottom-right-radius': params.borderRadius[2],
                'border-bottom-left-radius': params.borderRadius[3],
                'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
                'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
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
                if (h == null) {
                    var helper: JQuery = $('<div>').addClass('shape-helper');
                } else {
                    var helper = h;
                }
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
                    'transform': 'scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
                    'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
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