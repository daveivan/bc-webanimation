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
    lastTransformKeyframe: number = null;

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

    set keyframes(k: Array<Keyframe>) {
        this._keyframes = k;
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
            translate: {
                x: rangeData.params.translate.x,
                y: rangeData.params.translate.y,
                z: rangeData.params.translate.z,
            },
            relativeTranslate: {
                x: rangeData.params.relativeTranslate.x,
                y: rangeData.params.relativeTranslate.y,
            },
            perspective: rangeData.params.perspective
        }
        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            var paramsLeft: Parameters = rng['l'].shape.parameters;
            var paramsRight: Parameters = rng['r'].shape.parameters;

            if (paramsLeft.top != paramsRight.top || left != this.lastTransformKeyframe) {
                params['relativePosition']['top'] = this.computeAttr(paramsLeft.relativePosition.top, paramsRight.relativePosition.top, bezier(p));
                params['top'] = Math.round(this.computeAttr(paramsLeft.top, paramsRight.top, bezier(p)));
                shape.css({ 'top': params.relativePosition.top + '%' });
                helper.css({ 'top': params.relativePosition.top + '%' });
            }
            if (paramsLeft.left != paramsRight.left || left != this.lastTransformKeyframe) {
                params['relativePosition']['left'] = this.computeAttr(paramsLeft.relativePosition.left, paramsRight.relativePosition.left, bezier(p));
                params['left'] = Math.round(this.computeAttr(paramsLeft.left, paramsRight.left, bezier(p)));
                shape.css({ 'left': params.relativePosition.left + '%' });
                helper.css({ 'left': params.relativePosition.left + '%' });
            }
            if (paramsLeft.width != paramsRight.width || left != this.lastTransformKeyframe) {
                params['relativeSize']['width'] = this.computeAttr(paramsLeft.relativeSize.width, paramsRight.relativeSize.width, bezier(p));
                params['width'] = Math.round(this.computeAttr(paramsLeft.width, paramsRight.width, bezier(p)));
                shape.css({ 'width': params.relativeSize.width + '%' });
                helper.css({ 'width': params.relativeSize.width + '%' });
            }
            if (paramsLeft.height != paramsRight.height || left != this.lastTransformKeyframe) {
                params['relativeSize']['height'] = this.computeAttr(paramsLeft.relativeSize.height, paramsRight.relativeSize.height, bezier(p));
                params['height'] = Math.round(this.computeAttr(paramsLeft.height, paramsRight.height, bezier(p)));
                shape.css({ 'height': params.relativeSize.height + '%' });
                helper.css({ 'height': params.relativeSize.height + '%' });
            }
            var isBg = false;
            if (paramsLeft.background.r != paramsRight.background.r || left != this.lastTransformKeyframe) {
                isBg = true;
                params.background.r = Math.round(this.computeAttr(paramsLeft.background.r, paramsRight.background.r, bezier(p)));
            }
            if (paramsLeft.background.g != paramsRight.background.g || left != this.lastTransformKeyframe) {
                isBg = true;
                params.background.g = Math.round(this.computeAttr(paramsLeft.background.g, paramsRight.background.g, bezier(p)));
            }
            if (paramsLeft.background.b != paramsRight.background.b || left != this.lastTransformKeyframe) {
                isBg = true;
                params.background.b = Math.round(this.computeAttr(paramsLeft.background.b, paramsRight.background.b, bezier(p)));
            }
            if (paramsLeft.background.a != paramsRight.background.a || left != this.lastTransformKeyframe) {
                isBg = true;
                params.background.a = this.computeAttr(paramsLeft.background.a, paramsRight.background.a, bezier(p));
            }

            if (isBg) {
                shape.css({ 'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')' });
            }

            if (paramsLeft.opacity != paramsRight.opacity || left != this.lastTransformKeyframe) {
                params['opacity'] = this.computeAttr(paramsLeft.opacity, paramsRight.opacity, bezier(p));
                shape.css({ 'opacity': params.opacity });
            }
            if (paramsLeft.borderRadius[0] != paramsRight.borderRadius[0] || left != this.lastTransformKeyframe) {
                params['borderRadius'][0] = Math.round(this.computeAttr(paramsLeft.borderRadius[0], paramsRight.borderRadius[0], bezier(p)));
                shape.css({ 'border-top-left-radius': params.borderRadius[0] + '%' });
            }
            if (paramsLeft.borderRadius[1] != paramsRight.borderRadius[1] || left != this.lastTransformKeyframe) {
                params['borderRadius'][1] = Math.round(this.computeAttr(paramsLeft.borderRadius[1], paramsRight.borderRadius[1], bezier(p)));
                shape.css({ 'border-top-right-radius': params.borderRadius[1] + '%' });
            }
            if (paramsLeft.borderRadius[2] != paramsRight.borderRadius[2] || left != this.lastTransformKeyframe) {
                params['borderRadius'][2] = Math.round(this.computeAttr(paramsLeft.borderRadius[2], paramsRight.borderRadius[2], bezier(p)));
                shape.css({ 'border-bottom-right-radius': params.borderRadius[2] + '%' });
            }
            if (paramsLeft.borderRadius[3] != paramsRight.borderRadius[3] || left != this.lastTransformKeyframe) {
                params['borderRadius'][3] = Math.round(this.computeAttr(paramsLeft.borderRadius[3], paramsRight.borderRadius[3], bezier(p)));
                shape.css({ 'border-bottom-left-radius': params.borderRadius[3] + '%' });
            }

            var isTransform = false;
            if (paramsLeft.rotate.x != paramsRight.rotate.x || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['rotate']['x'] = Math.round(this.computeAttr(paramsLeft.rotate.x, paramsRight.rotate.x, bezier(p)));
            }
            if (paramsLeft.rotate.y != paramsRight.rotate.y || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['rotate']['y'] = Math.round(this.computeAttr(paramsLeft.rotate.y, paramsRight.rotate.y, bezier(p)));
            }
            if (paramsLeft.rotate.z != paramsRight.rotate.z || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['rotate']['z'] = Math.round(this.computeAttr(paramsLeft.rotate.z, paramsRight.rotate.z, bezier(p)));
            }
            if (paramsLeft.skew.x != paramsRight.skew.x || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['skew']['x'] = Math.round(this.computeAttr(paramsLeft.skew.x, paramsRight.skew.x, bezier(p)));
            }
            if (paramsLeft.skew.y != paramsRight.skew.y || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['skew']['y'] = Math.round(this.computeAttr(paramsLeft.skew.y, paramsRight.skew.y, bezier(p)));
            }

            var isOrigin = false;
            if (paramsLeft.origin.x != paramsRight.origin.x || left != this.lastTransformKeyframe) {
                isOrigin = true;
                params['origin']['x'] = this.computeAttr(paramsLeft.origin.x, paramsRight.origin.x, bezier(p));
            }
            if (paramsLeft.origin.y != paramsRight.origin.y || left != this.lastTransformKeyframe) {
                isOrigin = true;
                params['origin']['y'] = this.computeAttr(paramsLeft.origin.y, paramsRight.origin.y, bezier(p));
            }
            if (paramsLeft.scale != paramsRight.scale || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['scale'] = this.computeAttr(paramsLeft.scale, paramsRight.scale, bezier(p));
            }

            if (paramsLeft.translate.x != paramsRight.translate.x || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['relativeTranslate']['x'] = this.computeAttr(paramsLeft.relativeTranslate.x, paramsRight.relativeTranslate.x, bezier(p));
                params['translate']['x'] = this.computeAttr(paramsLeft.translate.x, paramsRight.translate.x, bezier(p));
            }

            if (paramsLeft.translate.y != paramsRight.translate.y || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['relativeTranslate']['y'] = this.computeAttr(paramsLeft.relativeTranslate.y, paramsRight.relativeTranslate.y, bezier(p));
                params['translate']['y'] = this.computeAttr(paramsLeft.translate.y, paramsRight.translate.y, bezier(p));
            }

            if (paramsLeft.translate.z != paramsRight.translate.z || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['translate']['z'] = this.computeAttr(paramsLeft.translate.z, paramsRight.translate.z, bezier(p));
            }

            if (paramsLeft.perspective != paramsRight.perspective || left != this.lastTransformKeyframe) {
                isTransform = true;
                params['perspective'] = this.computeAttr(paramsLeft.perspective, paramsRight.perspective, bezier(p));
            }

            if (isOrigin) {
                shape.css({ 'transform-origin': params.origin.x + '% ' + params.origin.y + '%' });
                helper.css({ 'transform-origin': params.origin.x + '% ' + params.origin.y + '%' });
            }

            if (isTransform) {
                shape.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                helper.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
            }

            shape.removeClass('novisible');
            helper.removeClass('novisible');

            this.lastTransformKeyframe = left;
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
                'border-top-left-radius': params.borderRadius[0] + '%',
                'border-top-right-radius': params.borderRadius[1] + '%',
                'border-bottom-right-radius': params.borderRadius[2] + '%',
                'border-bottom-left-radius': params.borderRadius[3] + '%',
                'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
                'transform-origin': params.origin.x + '% ' + params.origin.y + '%',
            });

            if (showHelpers) {
                helper.css({
                    'left': params.relativePosition.left + '%',
                    'top': params.relativePosition.top + '%',
                    'width': params.relativeSize.width + '%',
                    'height': params.relativeSize.height + '%',
                    'z-index': (params.zindex + 1000),
                    'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
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

            this.lastTransformKeyframe = null;
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
            app.controlPanel.updateTranslate(params.translate);
            app.controlPanel.updatePerspective(params.perspective);
            $('.shape-helper.highlight').first().find('.origin-point').css({
                'left': params.origin.x + '%',
                'top': params.origin.y + '%',
            });
        }
    }

    getShape(position: number): IShape {
        return null;
    }

    getParameters(position: number): Parameters {
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
            translate: {
                x: rangeData.params.translate.x,
                y: rangeData.params.translate.y,
                z: rangeData.params.translate.z,
            },
            relativeTranslate: {
                x: rangeData.params.relativeTranslate.x,
                y: rangeData.params.relativeTranslate.y,
            },
            perspective: rangeData.params.perspective
        }
        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            var paramsLeft: Parameters = rng['l'].shape.parameters;
            var paramsRight: Parameters = rng['r'].shape.parameters;

            params['relativePosition']['top'] = this.computeAttr(paramsLeft.relativePosition.top, paramsRight.relativePosition.top, bezier(p));
            params['top'] = Math.round(this.computeAttr(paramsLeft.top, paramsRight.top, bezier(p)));
            params['relativePosition']['left'] = this.computeAttr(paramsLeft.relativePosition.left, paramsRight.relativePosition.left, bezier(p));
            params['left'] = Math.round(this.computeAttr(paramsLeft.left, paramsRight.left, bezier(p)));
            params['relativeSize']['width'] = this.computeAttr(paramsLeft.relativeSize.width, paramsRight.relativeSize.width, bezier(p));
            params['width'] = Math.round(this.computeAttr(paramsLeft.width, paramsRight.width, bezier(p)));
            params['relativeSize']['height'] = this.computeAttr(paramsLeft.relativeSize.height, paramsRight.relativeSize.height, bezier(p));
            params['height'] = Math.round(this.computeAttr(paramsLeft.height, paramsRight.height, bezier(p)));
            params.background.r = Math.round(this.computeAttr(paramsLeft.background.r, paramsRight.background.r, bezier(p)));
            params.background.g = Math.round(this.computeAttr(paramsLeft.background.g, paramsRight.background.g, bezier(p)));
            params.background.b = Math.round(this.computeAttr(paramsLeft.background.b, paramsRight.background.b, bezier(p)));
            params.background.a = this.computeAttr(paramsLeft.background.a, paramsRight.background.a, bezier(p));
            params['opacity'] = this.computeAttr(paramsLeft.opacity, paramsRight.opacity, bezier(p));
            params['borderRadius'][0] = Math.round(this.computeAttr(paramsLeft.borderRadius[0], paramsRight.borderRadius[0], bezier(p)));
            params['borderRadius'][1] = Math.round(this.computeAttr(paramsLeft.borderRadius[1], paramsRight.borderRadius[1], bezier(p)));
            params['borderRadius'][2] = Math.round(this.computeAttr(paramsLeft.borderRadius[2], paramsRight.borderRadius[2], bezier(p)));
            params['borderRadius'][3] = Math.round(this.computeAttr(paramsLeft.borderRadius[3], paramsRight.borderRadius[3], bezier(p)));
            params['rotate']['x'] = Math.round(this.computeAttr(paramsLeft.rotate.x, paramsRight.rotate.x, bezier(p)));
            params['rotate']['y'] = Math.round(this.computeAttr(paramsLeft.rotate.y, paramsRight.rotate.y, bezier(p)));
            params['rotate']['z'] = Math.round(this.computeAttr(paramsLeft.rotate.z, paramsRight.rotate.z, bezier(p)));
            params['skew']['x'] = Math.round(this.computeAttr(paramsLeft.skew.x, paramsRight.skew.x, bezier(p)));
            params['skew']['y'] = Math.round(this.computeAttr(paramsLeft.skew.y, paramsRight.skew.y, bezier(p)));
            params['origin']['x'] = this.computeAttr(paramsLeft.origin.x, paramsRight.origin.x, bezier(p));
            params['origin']['y'] = this.computeAttr(paramsLeft.origin.y, paramsRight.origin.y, bezier(p));
            params['scale'] = this.computeAttr(paramsLeft.scale, paramsRight.scale, bezier(p));
            params['relativeTranslate']['x'] = this.computeAttr(paramsLeft.relativeTranslate.x, paramsRight.relativeTranslate.x, bezier(p));
            params['translate']['x'] = this.computeAttr(paramsLeft.translate.x, paramsRight.translate.x, bezier(p));
            params['relativeTranslate']['y'] = this.computeAttr(paramsLeft.relativeTranslate.y, paramsRight.relativeTranslate.y, bezier(p));
            params['translate']['y'] = this.computeAttr(paramsLeft.translate.y, paramsRight.translate.y, bezier(p));
            params['translate']['z'] = this.computeAttr(paramsLeft.translate.z, paramsRight.translate.z, bezier(p));
            params['perspective'] = this.computeAttr(paramsLeft.perspective, paramsRight.perspective, bezier(p));
        }

        return params;
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

        var rng: Array<Keyframe> = new Array<Keyframe>();
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
            'width': p.relativeSize.width + '%',
            'height': p.relativeSize.height + '%',
            'top': p.relativePosition.top + '%',
            'left': p.relativePosition.left + '%',
            'background': 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')',
            'z-index': this.globalShape.parameters.zindex,
        };

        if (p.opacity != 1) {
            cssObject['opacity'] = p.opacity;
        }

        if ((p.borderRadius[0] == p.borderRadius[1]) &&
        (p.borderRadius[0] == p.borderRadius[2]) &&
        (p.borderRadius[0] == p.borderRadius[3])) {
            if (p.borderRadius[0] != 0) {
                cssObject['border-radius'] = p.borderRadius[0] + '%';
            }
        } else {
            cssObject['border-top-left-radius'] = p.borderRadius[0] + '%';
            cssObject['border-top-right-radius'] = p.borderRadius[1] + '%';
            cssObject['border-bottom-right-radius'] = p.borderRadius[2] + '%';
            cssObject['border-bottom-left-radius'] = p.borderRadius[3] + '%';
        }

        if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0 ||
            p.skew.x != 0 || p.skew.y != 0 ||
            p.scale != 1 ||
            p.translate.x != 0 || p.translate.y != 0 || p.translate.z != 0 ||
            p.perspective != 0) {
            var t: string = "";
            if (p.perspective != 0) {
                t += 'perspective(' + p.perspective + 'px) ';
            }

            if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z) {
                t += 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) ';
            }
            if (p.skew.x != 0 || p.skew.y != 0) {
                t += 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg) ';
            }
            if (p.scale != 1) {
                t += 'scale(' + p.scale + ') ';
            }

            if (p.translate.x != 0 || p.translate.y != 0 || p.translate.z) {
                t += 'translateX(' + p.relativeTranslate.x + '%) translateY(' + p.relativeTranslate.y + '%) translateZ(' + p.translate.z + 'px)';
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
            translate: false,
            origin: false,
            perspective: false,
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
            if (initP.rotate.x != p.rotate.x || initP.rotate.x != 0) change.rotate = true;
            if (initP.rotate.y != p.rotate.y || initP.rotate.y != 0) change.rotate = true;
            if (initP.rotate.z != p.rotate.z || initP.rotate.z != 0) change.rotate = true;
            if (initP.skew.x != p.skew.x || initP.skew.x != 0) change.skew = true;
            if (initP.skew.y != p.skew.y || initP.skew.y != 0) change.skew = true;
            if (initP.origin.x != p.origin.x || initP.origin.x != 50) change.origin = true;
            if (initP.origin.y != p.origin.y || initP.origin.y != 50) change.origin = true;
            if (initP.scale != p.scale || initP.scale != 1) change.scale = true;
            if (initP.translate.x != p.translate.x || initP.translate.x != 0) change.translate = true;
            if (initP.translate.y != p.translate.y || initP.translate.y != 0) change.translate = true;
            if (initP.translate.z != p.translate.z || initP.translate.z != 0) change.translate = true;
            if (p.perspective != 0) change.perspective = true;
        });

        var p: Parameters = (this.getKeyframeByTimestamp(timestamp)).shape.parameters;
        var cssObject = {};

        if (change.width) cssObject['width'] = p.relativeSize.width + '%';
        if (change.height) cssObject['height'] = p.relativeSize.height + '%';
        if (change.top) cssObject['top'] = p.relativePosition.top + '%';
        if (change.left) cssObject['left'] = p.relativePosition.left + '%';
        if (change.bg) cssObject['background'] = 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')';
        if (change.opacity) cssObject['opacity'] = p.opacity;

        if (change.radius) {
            if ((p.borderRadius[0] == p.borderRadius[1]) &&
            (p.borderRadius[0] == p.borderRadius[2]) &&
            (p.borderRadius[0] == p.borderRadius[3])) {
                cssObject['border-radius'] = p.borderRadius[0] + 'px';
            } else {
                cssObject['border-top-left-radius'] = p.borderRadius[0] + '%';
                cssObject['border-top-right-radius'] = p.borderRadius[1] + '%';
                cssObject['border-bottom-right-radius'] = p.borderRadius[2] + '%';
                cssObject['border-bottom-left-radius'] = p.borderRadius[3] + '%';
            }
        }

        if (change.rotate || change.skew || change.scale || change.translate || change.perspective) {
            var t: string = "";
            if (change.perspective) {
                t += 'perspective(' + p.perspective + 'px) ';
            }

            if (change.translate) {
                t += 'translate3d(' + p.relativeTranslate.x + '%, ' + p.relativeTranslate.y + '%, ' + p.translate.z + 'px) ';
            }
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

        if ((change.rotate || change.skew || change.scale || change.translate || change.perspective) && change.origin) {
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
                'z-index': this.globalShape.parameters.zindex,
                'opacity': params.opacity,
                'border-top-left-radius': params.borderRadius[0] + '%',
                'border-top-right-radius': params.borderRadius[1] + '%',
                'border-bottom-right-radius': params.borderRadius[2] + '%',
                'border-bottom-left-radius': params.borderRadius[3] + '%',
                'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
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
                    'top': ((params.top - 1) / container.height()) * 100 + '%',
                    'left': ((params.left - 1) / container.width()) * 100 + '%',
                    'width': ((params.width + 2) / container.width()) * 100 + '%',
                    'height': ((params.height + 2) / container.height()) * 100 + '%',
                    'z-index': this.globalShape.parameters.zindex + 1000,
                    'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
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
}