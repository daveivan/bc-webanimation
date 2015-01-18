var Layer = (function () {
    function Layer(name, fn, shape) {
        if (typeof shape === "undefined") { shape = null; }
        this._order = 0;
        this._parent = null;
        this.nesting = 0;
        this.name = name;
        this.id = ++Layer.counter;
        this._keyframes = new Array();
        this._timestamps = new Array();
        if (shape != null) {
            shape.id = this.id;
            this.addKeyframe(shape, 0, fn);
        }

        this.idEl = null;
        this.globalShape = shape;
    }
    Object.defineProperty(Layer.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (order) {
            this._order = order;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Layer.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (id) {
            this._parent = id;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Layer.prototype, "idEl", {
        get: function () {
            return this._idEl;
        },
        set: function (id) {
            this._idEl = id;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Layer.prototype, "globalShape", {
        get: function () {
            return this._globalShape;
        },
        set: function (shape) {
            this._globalShape = shape;
        },
        enumerable: true,
        configurable: true
    });


    Layer.prototype.addKeyframe = function (shape, timestamp, timing_function, index) {
        if (typeof index === "undefined") { index = null; }
        var keyframe = new Keyframe(shape, timestamp, timing_function);
        if (index != null) {
            this._keyframes.splice(index, 0, keyframe);
        } else {
            this._keyframes.push(keyframe);
        }

        this._timestamps.push(keyframe.timestamp);
        this.sortTimestamps();
        return keyframe;
    };

    Layer.prototype.deleteKeyframe = function (index) {
        var keyframe = this.getKeyframe(index);

        //IE9<
        this._timestamps.splice(this._timestamps.indexOf(keyframe.timestamp), 1);
        this._keyframes.splice(index, 1);
    };

    Layer.prototype.getKeyframe = function (index) {
        if (typeof this._keyframes[index] == 'undefined') {
            return null;
        } else {
            return this._keyframes[index];
        }
    };

    Layer.prototype.updatePosition = function (index, ms) {
        var _this = this;
        //if position is free
        if (this.getKeyframeByTimestamp(ms) == null) {
            this.getKeyframe(index).timestamp = ms;
            this._timestamps = [];
            this._keyframes.forEach(function (item, index) {
                _this._timestamps.push(item.timestamp);
            });
            this.sortTimestamps();
        }
    };

    Layer.prototype.getKeyframeByTimestamp = function (timestamp) {
        var i = null;
        this._keyframes.forEach(function (item, index) {
            if (item.timestamp == timestamp) {
                i = index;
            }
        });

        if (i == null) {
            return null;
        } else {
            return this._keyframes[i];
        }
    };

    Layer.prototype.getAllKeyframes = function () {
        return this._keyframes;
    };

    Layer.prototype.sortTimestamps = function () {
        var tmp = this._timestamps.sort(function (n1, n2) {
            return n1 - n2;
        });
        this._timestamps = tmp;
    };

    Layer.prototype.sortKeyframes = function () {
        var tmp = this._keyframes.sort(function (n1, n2) {
            return n1.timestamp - n2.timestamp;
        });
        this._keyframes = tmp;
    };

    Object.defineProperty(Layer.prototype, "timestamps", {
        get: function () {
            return this._timestamps;
        },
        enumerable: true,
        configurable: true
    });

    Layer.prototype.transform = function (position, shape, helper, currentLayerId, controlPanel) {
        //find interval between position
        var rangeData = this.getRange(position);
        var left = rangeData.left;
        var right = rangeData.right;
        var rng = rangeData.rng;
        var params = rangeData.params;

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p = (position - left) / (right - left);

            params = {
                top: Math.round(this.computeAttr(rng['l'].shape.parameters.top, rng['r'].shape.parameters.top, bezier(p))),
                left: Math.round(this.computeAttr(rng['l'].shape.parameters.left, rng['r'].shape.parameters.left, bezier(p))),
                width: Math.round(this.computeAttr(rng['l'].shape.parameters.width, rng['r'].shape.parameters.width, bezier(p))),
                height: Math.round(this.computeAttr(rng['l'].shape.parameters.height, rng['r'].shape.parameters.height, bezier(p))),
                background: {
                    r: Math.round(this.computeAttr(rng['l'].shape.parameters.background.r, rng['r'].shape.parameters.background.r, bezier(p))),
                    g: Math.round(this.computeAttr(rng['l'].shape.parameters.background.g, rng['r'].shape.parameters.background.g, bezier(p))),
                    b: Math.round(this.computeAttr(rng['l'].shape.parameters.background.b, rng['r'].shape.parameters.background.b, bezier(p))),
                    a: this.computeAttr(rng['l'].shape.parameters.background.a, rng['r'].shape.parameters.background.a, bezier(p))
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
                    z: Math.round(this.computeAttr(rng['l'].shape.parameters.rotate.z, rng['r'].shape.parameters.rotate.z, bezier(p)))
                },
                skew: {
                    x: Math.round(this.computeAttr(rng['l'].shape.parameters.skew.x, rng['r'].shape.parameters.skew.x, bezier(p))),
                    y: Math.round(this.computeAttr(rng['l'].shape.parameters.skew.y, rng['r'].shape.parameters.skew.y, bezier(p)))
                },
                origin: {
                    x: this.computeAttr(rng['l'].shape.parameters.origin.x, rng['r'].shape.parameters.origin.x, bezier(p)),
                    y: this.computeAttr(rng['l'].shape.parameters.origin.y, rng['r'].shape.parameters.origin.y, bezier(p))
                },
                zindex: rng['l'].shape.parameters.zindex
            };
        }

        //set new attributes to object
        shape.css({
            'top': params.top,
            'left': params.left,
            'width': params.width,
            'height': params.height,
            'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')',
            'border': params.border,
            'z-index': params.zindex,
            'opacity': params.opacity,
            'border-top-left-radius': params.borderRadius[0],
            'border-top-right-radius': params.borderRadius[1],
            'border-bottom-right-radius': params.borderRadius[2],
            'border-bottom-left-radius': params.borderRadius[3],
            'transform': 'rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)',
            'transform-origin': params.origin.x + '% ' + params.origin.y + '%'
        });

        helper.css({
            'top': params.top - 1,
            'left': params.left - 1,
            'width': params.width + 2,
            'height': params.height + 2,
            'z-index': helper.css('z-index')
        });

        if (this.idEl != null) {
            shape.attr('id', this.idEl);
        } else {
            shape.removeAttr('id');
        }

        if (currentLayerId == this.id) {
            controlPanel.updateDimensions({ width: params.width, height: params.height });
            controlPanel.updateOpacity(params.opacity);
            controlPanel.updateColor({ r: params.background.r, g: params.background.g, b: params.background.b }, params.background.a);
            controlPanel.updateBorderRadius(params.borderRadius);
            controlPanel.update3DRotate({ x: params.rotate.x, y: params.rotate.y, z: params.rotate.z });
            controlPanel.updateSkew({ x: params.skew.x, y: params.skew.y });
            controlPanel.updateTransformOrigin(params.origin.x, params.origin.y);
            $('.shape-helper.highlight').first().find('.origin-point').css({
                'left': params.origin.x + '%',
                'top': params.origin.y + '%'
            });
        }
    };

    Layer.prototype.getRange = function (position) {
        var params = null;

        //find interval between position
        var left = null, right = null;
        var index = 0;
        for (var i = this.timestamps.length; i--;) {
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

        var rng = new Array();
        if (left != null) {
            rng['l'] = this.getKeyframeByTimestamp(left);
            params = rng['l'].shape.parameters;
        }
        if (right != null) {
            rng['r'] = this.getKeyframeByTimestamp(right);
            params = rng['r'].shape.parameters;
        }

        return { rng: rng, left: left, right: right, params: params };
    };

    Layer.prototype.computeAttr = function (leftAttr, rightAttr, b) {
        var value = null;
        var absValue = (Math.abs(rightAttr - leftAttr)) * b;
        if (leftAttr > rightAttr) {
            value = Number(leftAttr) - Number(absValue);
        } else {
            value = Number(leftAttr) + Number(absValue);
        }
        return (Number(value));
    };

    Layer.prototype.getInitStyles = function (nameElement) {
        var p = (this.getKeyframeByTimestamp(this.timestamps[0])).shape.parameters;
        var cssObject = {
            'name': '.' + nameElement,
            'position': 'absolute',
            'width': p.width + 'px',
            'height': p.height + 'px',
            'top': p.top + 'px',
            'left': p.left + 'px',
            'background': 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')'
        };

        if (p.opacity != 1) {
            cssObject['opacity'] = p.opacity;
        }

        if ((p.borderRadius[0] == p.borderRadius[1]) && (p.borderRadius[0] == p.borderRadius[2]) && (p.borderRadius[0] == p.borderRadius[3])) {
            if (p.borderRadius[0] != 0) {
                cssObject['border-radius'] = p.borderRadius[0] + 'px';
            }
        } else {
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
    };

    Layer.prototype.getKeyframeStyle = function (timestamp) {
        //check, if parameters ís changing
        var change = {
            width: false,
            height: false,
            top: false,
            left: false,
            bg: false,
            opacity: false,
            radius: false,
            rotate: false,
            skew: false,
            origin: false
        };
        var initP = (this.getKeyframeByTimestamp(this.timestamps[0])).shape.parameters;
        this.getAllKeyframes().forEach(function (k, i) {
            var p = k.shape.parameters;
            if (initP.width != p.width)
                change.width = true;
            if (initP.height != p.height)
                change.height = true;
            if (initP.top != p.top)
                change.top = true;
            if (initP.left != p.left)
                change.left = true;
            if (initP.background.r != p.background.r)
                change.bg = true;
            if (initP.background.g != p.background.g)
                change.bg = true;
            if (initP.background.b != p.background.b)
                change.bg = true;
            if (initP.background.a != p.background.a)
                change.bg = true;
            if (initP.opacity != p.opacity)
                change.opacity = true;
            if (initP.borderRadius[0] != p.borderRadius[0])
                change.radius = true;
            if (initP.borderRadius[1] != p.borderRadius[1])
                change.radius = true;
            if (initP.borderRadius[2] != p.borderRadius[2])
                change.radius = true;
            if (initP.borderRadius[3] != p.borderRadius[3])
                change.radius = true;
            if (initP.rotate.x != p.rotate.x)
                change.rotate = true;
            if (initP.rotate.y != p.rotate.y)
                change.rotate = true;
            if (initP.rotate.z != p.rotate.z)
                change.rotate = true;
            if (initP.skew.x != p.skew.x)
                change.skew = true;
            if (initP.skew.y != p.skew.y)
                change.skew = true;
            if (initP.origin.x != p.origin.x)
                change.origin = true;
            if (initP.origin.y != p.origin.y)
                change.origin = true;
        });

        var p = (this.getKeyframeByTimestamp(timestamp)).shape.parameters;
        var cssObject = {};

        if (change.width)
            cssObject['width'] = p.width + 'px';
        if (change.height)
            cssObject['height'] = p.height + 'px';
        if (change.top)
            cssObject['top'] = p.top + 'px';
        if (change.left)
            cssObject['left'] = p.left + 'px';
        if (change.bg)
            cssObject['background'] = 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')';
        if (change.opacity)
            cssObject['opacity'] = p.opacity;
        if (change.radius) {
            if ((p.borderRadius[0] == p.borderRadius[1]) && (p.borderRadius[0] == p.borderRadius[2]) && (p.borderRadius[0] == p.borderRadius[3])) {
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
            if (change.origin)
                cssObject["transform-origin"] = p.origin.x + '% ' + p.origin.y + '%';
        }

        return cssObject;
    };

    Layer.prototype.getObject = function () {
        return '';
    };

    Layer.prototype.renderShape = function (container, position, currentScope) {
        return null;
    };

    Layer.prototype.renderShapeCore = function (shape, container, position, currentScope) {
        //get keyframe by pointer position
        var keyframe = this.getKeyframeByTimestamp(position);

        //if no keyframe, get init keyframe
        if (keyframe == null) {
            keyframe = this.getKeyframe(0);
        }
        if (keyframe != null) {
            var params = keyframe.shape.parameters;
            var css = {
                'top': params.top,
                'left': params.left,
                'width': params.width,
                'height': params.height,
                'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.a + ',' + params.background.a + ')',
                'border': params.border,
                'z-index': params.zindex,
                'opacity': params.opacity,
                'border-top-left-radius': params.borderRadius[0],
                'border-top-right-radius': params.borderRadius[1],
                'border-bottom-right-radius': params.borderRadius[2],
                'border-bottom-left-radius': params.borderRadius[3]
            };
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
                var helper = $('<div>').addClass('shape-helper');
                helper.append($('<div>').addClass('origin-point'));
                if (this.idEl) {
                    var helpername = $('<div>').addClass('helpername').html('<p>' + this.name + '<span class="div-id">#' + this.idEl + '</span></p>');
                } else {
                    var helpername = $('<div>').addClass('helpername').html('<p>' + this.name + '</p>');
                }
                helper.css({
                    'top': params.top - 1,
                    'left': params.left - 1,
                    'width': params.width + 2,
                    'height': params.height + 2,
                    'z-index': params.zindex + 1000
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
    };

    Layer.prototype.toString = function () {
        return "ID: " + this.id + "Jmeno vrstvy: " + this.name + ", poradi: " + this.order;
    };
    Layer.counter = 0;
    return Layer;
})();
///<reference path="Layer.ts" />
var Timeline = (function () {
    function Timeline(app, timelineContainer) {
        var _this = this;
        this.pointerPosition = 0;
        //width of one keyframe in px
        this.keyframeWidth = 15;
        //init number of keyframes
        this.keyframeCount = 100;
        //minimum free frames, when exceed, append another
        this.expandTimelineBound = 10;
        //convert frame to time
        this.miliSecPerFrame = 100;
        this.groupKeyframes = 5;
        this._repeat = false;
        this.deleteLayerEl = $('<a class="delete-layer" href="#">Smazat vrstvu/y <i class="fa fa-trash"></i></a>');
        this.repeatEl = $('<label><input type="checkbox" class="repeat">Opakovat celou animaci</label>');
        this.deleteKeyframeEl = $('<a>').addClass('delete-keyframe').html('Smazat keyframe <i class="fa fa-trash"></i>').attr('href', '#');
        this.layersEl = $('<div id="layers"></div>');
        this.timelineHeadEl = $('<div class="layers-head"></div>');
        this.layersWrapperEl = $('<div class="layers-wrapper"></div>');
        this.fixedWidthEl = $('<div class="fix-width"></div>');
        this.keyframesEl = $('<div class="keyframes"></div>');
        this.timelineFooterEl = $('<div class="timeline-footer"></div>');
        this.layersFooterEl = $('<div class="layers-footer"></div>');
        this.keyframesFooterEl = $('<div class="keyframes-footer"></div>');
        this.keyframesTableEl = $('<table><thead></thead><tbody></tbody>');
        this.pointerEl = $('<div class="pointer"><div class="pointer-top"></div></div>');
        this.app = app;
        this.timelineContainer = timelineContainer;
        this.layers = new Array();
        this.groupedLayers = new Array();
        this.groupedLayers[0] = new Array();

        this.renderTimeline();

        this.buildBreadcrumb(null);

        this.deleteLayerEl.on('click', function (event) {
            _this.deleteLayers(event);
            return false;
        });

        this.deleteKeyframeEl.on('click', function (event) {
            _this.onDeleteKeyframe(event);
        });

        this.layersWrapperEl.scroll(function (event) {
            _this.onScroll(event);
        });

        this.layersEl.on('mousedown', function (event, ui) {
            _this.onClickLayer(event, ui);
        });

        this.repeatEl.on('change', function (event) {
            _this._repeat = _this.repeatEl.find('input').is(':checked');
        });

        $(document).on('mousedown', 'td', function (event) {
            _this.onClickRow(event);
        });

        $(document).on('dblclick', 'td', function (event) {
            _this.onCreateKeyframe(event);
        });

        $(document).on('mousedown', '.keyframes > table', function (event) {
            _this.onClickTable(event);
        });

        this.keyframesTableEl.on('click', '.keyframe', function (event) {
            _this.keyframesTableEl.find('.keyframe').removeClass('selected');
            _this.keyframesTableEl.find('.timing-function').removeClass('selected');
            $(event.target).addClass('selected');
            $(event.target).next('.timing-function').addClass('selected');
            _this.app.workspace.updateBezierCurve(_this.getLayer($(event.target).data('layer')));
        });

        this.keyframesTableEl.on('click', '.timing-function p', function (event) {
            var keyframeEl = $(event.target).parent('.timing-function').prev('.keyframe');

            _this.keyframesTableEl.find('.keyframe').removeClass('selected');
            _this.keyframesTableEl.find('.timing-function').removeClass('selected');
            $(event.target).parent('.timing-function').addClass('selected');
            keyframeEl.addClass('selected');
            var k = _this.getLayer(parseInt(keyframeEl.data('layer'))).getKeyframe(parseInt(keyframeEl.data('index')));
            _this.app.workspace.updateBezierCurveByKeyframe(k);
        });

        this.timelineContainer.ready(function (event) {
            _this.onReady(event);
        });
    }
    Timeline.prototype.renderTimeline = function () {
        $(this.timelineHeadEl).append(this.repeatEl);
        $(this.timelineContainer).append(this.timelineHeadEl);
        $(this.fixedWidthEl).append(this.layersEl);
        $(this.fixedWidthEl).append(this.keyframesEl);
        $(this.layersFooterEl).append(this.deleteLayerEl);
        $(this.layersFooterEl).append(this.deleteKeyframeEl);
        $(this.timelineFooterEl).append(this.layersFooterEl);
        $(this.timelineFooterEl).append(this.keyframesFooterEl);
        $(this.fixedWidthEl).append(this.timelineFooterEl);
        $(this.layersWrapperEl).append(this.fixedWidthEl);
        $(this.timelineContainer).append(this.layersWrapperEl);
        this.renderHeader();
        $(this.keyframesTableEl).append(this.pointerEl);
        $(this.keyframesEl).append(this.keyframesTableEl);
        this.fixedWidthEl.width((this.keyframeWidth) * this.keyframeCount + 350 + 15);
        this.pointerEl.css('left', this.pointerPosition);

        this.renderLayers();
    };

    Timeline.prototype.renderRow = function (id, selector) {
        if (typeof selector === "undefined") { selector = null; }
        var trEl = $('<tr>').addClass('layer-row').attr('data-id', id);

        if (selector != null) {
            trEl.attr('class', selector);
        }

        for (var i = 0; i < this.keyframeCount; i++) {
            var tdEl = $('<td>').attr('class', i);

            //every n-th highlighted
            if ((i + 1) % this.groupKeyframes == 0) {
                tdEl.addClass('highlight');
            }

            tdEl.appendTo(trEl);
        }

        this.keyframesTableEl.find('tbody').append(trEl);
    };

    Timeline.prototype.renderKeyframes = function (id) {
        var _this = this;
        var rowEl = this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]');
        rowEl.find('td.keyframes-list').remove();
        rowEl.find('.range').remove();
        var keyframesTdEl = $('<td>').addClass('keyframes-list');

        this.getLayer(id).sortKeyframes();
        var keyframes = this.getLayer(id).getAllKeyframes();
        if (keyframes.length > 1) {
            var minValue = keyframes[0].timestamp, maxValue = keyframes[0].timestamp;

            keyframes.forEach(function (keyframe, index) {
                keyframesTdEl.append($('<div>').addClass('keyframe').attr('data-layer', id).attr('data-index', index).css({
                    'left': _this.milisecToPx(keyframe.timestamp) - 5
                }));

                if (index != (keyframes.length - 1)) {
                    keyframesTdEl.append($('<div>').addClass('timing-function').html('<p>(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')</p>').css({
                        'left': _this.milisecToPx(keyframe.timestamp) + 5,
                        'width': _this.milisecToPx(keyframes[index + 1].timestamp - keyframe.timestamp) - 10
                    }));
                }
                if (keyframe.timestamp < minValue)
                    minValue = keyframe.timestamp;
                if (keyframe.timestamp > maxValue)
                    maxValue = keyframe.timestamp;
            });

            keyframesTdEl.append($('<div>').addClass('range').css({
                'left': this.milisecToPx(minValue),
                'width': this.milisecToPx(maxValue - minValue)
            }));

            rowEl.prepend(keyframesTdEl);
        }

        $('.keyframe').draggable({
            axis: "x",
            grid: [this.keyframeWidth, this.keyframeWidth],
            containment: 'tr',
            stop: function (event, ui) {
                //update positon of keyframe
                var ms = _this.pxToMilisec((Math.round(ui.position.left / _this.keyframeWidth) * _this.keyframeWidth));
                var layerID = $(event.target).data('layer');
                var keyframeID = $(event.target).data('index');

                _this.getLayer(layerID).updatePosition(keyframeID, ms);

                console.log(_this.getLayer(layerID).timestamps);
                _this.renderKeyframes(layerID);
            },
            drag: function (event, ui) {
                if (ui.position.left < 11) {
                    console.log($('.keyframe').draggable("option", "grid", [10, 10]));
                } else {
                    $('.keyframe').draggable("option", "grid", [_this.keyframeWidth, _this.keyframeWidth]);
                }
            }
        });
    };

    Timeline.prototype.renderLayers = function () {
        var _this = this;
        console.log('Rendering layers...');

        //remove layers list
        this.layersEl.empty();
        this.keyframesTableEl.find('tbody').empty();

        var isEmpty = true;

        //render new layers list from array
        this.layers.forEach(function (item, index) {
            if (_this.app.workspace.scope == item.parent) {
                var layerItem = $('<div>').addClass('layer').attr('id', index).attr('data-id', item.id);
                layerItem.append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(item.name));
                if (item.idEl) {
                    layerItem.append($('<span>').addClass('div-id').html('#' + item.idEl));
                }
                _this.layersEl.append(layerItem);

                //and render frames fot this layer
                _this.renderRow(item.id);

                //render keyframes
                _this.renderKeyframes(item.id);
                isEmpty = false;
            }
        });

        //if array layers is empty, insert default layer
        if (this.layers.length == 0 || isEmpty) {
            this.renderRow(0, 'disabled');
            this.layersEl.append($('<div>').addClass('layer disabled').html('Vložte novou vrstvu'));
        }

        //add jeditable plugin
        var me = this;
        $('.editable').editable(function (value, settings) {
            me.onChangeName($(this).attr('id'), value);
            me.app.workspace.renderShapes();
            me.app.workspace.highlightShape([$(this).closest('.layer').data('id')]);
            me.app.workspace.transformShapes();
            return (value);
        }, {
            width: 150,
            onblur: 'submit',
            event: 'dblclick'
        });
    };

    Timeline.prototype.selectLayer = function (id, idKeyframe) {
        if (typeof idKeyframe === "undefined") { idKeyframe = null; }
        //select layer by ID
        this.keyframesTableEl.find('tbody tr').removeClass('selected');
        this.layersEl.find('.layer').removeClass('selected');
        if (id != null) {
            this.layersEl.find('[data-id="' + id + '"]').addClass('selected');
            this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');

            if (idKeyframe != null) {
                (this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]')).find('.keyframe[data-index="' + idKeyframe + '"]').addClass('selected');
                (this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]')).find('.keyframe[data-index="' + idKeyframe + '"]').next('.timing-function').addClass('selected');
            }

            //highlight shape
            this.app.workspace.highlightShape([id]);
        } else {
            this.app.workspace.highlightShape(null);
        }
    };

    Timeline.prototype.renderHeader = function () {
        var head = $('<tr class="first"></tr>');
        var numCells = this.keyframeCount / this.groupKeyframes;

        var milisec = 0;
        for (var i = 0; i < numCells; i++) {
            milisec += this.miliSecPerFrame * this.groupKeyframes;
            head.append('<th colspan="' + this.groupKeyframes + '">' + milisec / 1000 + ' s</th>');
        }

        this.keyframesTableEl.find('thead').append(head);
    };

    Timeline.prototype.addLayer = function (layer) {
        this.keyframesTableEl.find('tbody tr.disabled').remove();
        this.layers.push(layer);
        if (layer.parent == null) {
            (this.groupedLayers[0]).push(layer);
        } else {
            if (!this.groupedLayers[layer.parent]) {
                this.groupedLayers[layer.parent] = new Array();
            }
            (this.groupedLayers[layer.parent]).push(layer);
        }
        layer.order = this.layers.length;
        this.renderLayers();

        this.selectLayer(layer.id);
        this.layersWrapperEl.stop(true, true).animate({ scrollTop: this.layersWrapperEl[0].scrollHeight - 50 }, 300);
        this.layersWrapperEl.perfectScrollbar('update');

        return layer.id;
    };

    Timeline.prototype.deleteLayer = function (index) {
        var deletedLayer = this.layers[index];
        this.layers.splice(index, 1);

        for (var i = this.layers.length - 1; i >= 0; i--) {
            if (this.layers[i].parent == deletedLayer.id) {
                this.deleteLayer(i);
            }
        }
    };

    Timeline.prototype.deleteLayers = function (e) {
        console.log('Deleting layers...');

        //iteration from end of array of selected layers
        var selectedLayers = this.layersEl.find('div.layer.selected').get();
        for (var i = selectedLayers.length - 1; i >= 0; i--) {
            //this.layers.splice(parseInt($(selectedLayers[i]).attr('id')), 1);
            this.deleteLayer(parseInt($(selectedLayers[i]).attr('id')));
        }

        //render layers
        this.renderLayers();

        //render workspace
        this.app.workspace.renderShapes();
        this.app.workspace.transformShapes();

        //scroll to last layer
        this.selectLayer(this.layersEl.find('.layer').last().data('id'));
        this.layersWrapperEl.scrollTop(this.layersWrapperEl.scrollTop() - (this.layersEl.find('.layer').outerHeight() * selectedLayers.length));
        this.layersWrapperEl.perfectScrollbar('update');
        //this.scrollTo(this.layersEl.find('.layer').last().data('id'));
    };

    Timeline.prototype.sort = function (e, ui) {
        var _this = this;
        var order = $(e.target).sortable('toArray');
        var firstSelectedEl = $(this.layersEl.find('.selected').get(0));

        var outOfScopeLayers = new Array();
        this.layers.forEach(function (layer, index) {
            if (layer.parent != _this.app.workspace.scope) {
                outOfScopeLayers.push(layer);
            }
        });

        var tmpLayers = new Array();
        order.forEach(function (value, index) {
            var layer = _this.layers[parseInt(value)];
            tmpLayers.push(layer);

            //TODO - update z-index podle poradi (brat v potaz keyframe nebo aktualizace do global shape?)
            var keyframe = layer.getKeyframeByTimestamp(_this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(_this.app.workspace.getCurrentShape(layer.id), _this.pxToMilisec(), _this.app.workspace.bezier);
                _this.renderKeyframes(layer.id);
            }
            keyframe.shape.setZindex(index);
        });

        this.layers = outOfScopeLayers.concat(tmpLayers);

        //render layers
        this.renderLayers();

        //render shapes
        this.app.workspace.renderShapes();
        this.app.workspace.transformShapes();
        this.selectLayer(firstSelectedEl.data('id'));
    };

    Timeline.prototype.onClickLayer = function (e, ui) {
        //select row by selected layer
        var id = parseInt($(e.target).closest('.layer').data('id'));
        if (!isNaN(id)) {
            this.keyframesTableEl.find('tbody tr').removeClass('selected');
            this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');

            //highlight selected shapes
            var selectedLayersID = this.layersEl.find('.selected').map(function () {
                return $(this).data('id');
            }).get();
            this.app.workspace.highlightShape(selectedLayersID);
        }
    };

    Timeline.prototype.onClickRow = function (e) {
        //select layer by selected row
        var tr = $(e.target).closest('tr');
        if (!tr.hasClass('disabled')) {
            this.selectLayer(tr.data('id'));
        }
    };

    Timeline.prototype.onScroll = function (e) {
        var posX = this.layersWrapperEl.scrollLeft();
        var posY = this.layersWrapperEl.scrollTop();
        this.layersEl.css('left', posX);
        $('.first').css('top', posY);
        this.layersFooterEl.css('left', posX);
        this.keyframesFooterEl.css('left', posX);
        this.timelineFooterEl.css('bottom', 0 - posY);
        this.pointerEl.find('.pointer-top').css('top', posY);
    };

    Timeline.prototype.onReady = function (e) {
        var _this = this;
        this.layersEl.multisortable({
            items: '> div.layer:not(.disabled)',
            axis: 'y', delay: 150,
            scroll: true,
            stop: function (e) {
                _this.sort(e, null);
            }
        });
        this.layersEl.sortable("option", "cancel", "span.editable");
        this.layersWrapperEl.perfectScrollbar();

        this.pointerEl.draggable({
            axis: 'x',
            containment: 'parent',
            handle: '.pointer-top',
            start: function (event, ui) {
                _this.keyframesTableEl.find('.keyframe').removeClass('selected');
                _this.keyframesTableEl.find('.timing-function').removeClass('selected');
            },
            drag: function (event, ui) {
                _this.pointerPosition = ui.position.left + 1;
                _this.app.workspace.transformShapes();
            },
            stop: function (event, ui) {
                var posX = Math.round(ui.position.left / _this.keyframeWidth) * _this.keyframeWidth;
                _this.pointerPosition = posX;
                _this.pointerEl.css('left', _this.pointerPosition - 1);
                _this.app.workspace.transformShapes();
            }
        });
    };

    Timeline.prototype.onClickTable = function (e) {
        if (!$(e.target).hasClass('pointer')) {
            this.keyframesTableEl.find('.keyframe').removeClass('selected');
            this.keyframesTableEl.find('.timing-function').removeClass('selected');
            var n = $(e.target).parents('table');
            var posX = e.pageX - $(n).offset().left;
            posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
            this.pointerPosition = posX;
            this.pointerEl.css('left', this.pointerPosition - 1);
            this.app.workspace.transformShapes();
        }
    };

    Timeline.prototype.onChangeName = function (id, name) {
        this.layers[id].name = name;
    };

    Timeline.prototype.scrollTo = function (id) {
        var scrollTo = this.layersEl.find('[data-id="' + id + '"]').offset().top - this.layersEl.offset().top;
        this.layersWrapperEl.stop(true, true).animate({ scrollTop: scrollTo }, 300);
        this.layersWrapperEl.perfectScrollbar('update');
    };

    Timeline.prototype.getLayer = function (id) {
        var layer = null;

        this.layers.forEach(function (item, index) {
            if (item.id == id) {
                layer = item;
            }
        });

        return layer;
    };

    Timeline.prototype.onCreateKeyframe = function (e) {
        console.log('Creating keyframe...');

        //nejblizsi tr -> vytanout data-id -> najit layer podle id ->vlozit novy keyframe (pouzit  position, nejprve prevest na ms, pouzit shape z workspace)
        var id = parseInt($(e.target).closest('tr.selected').data('id'));
        if ($.isNumeric(id)) {
            var layer = this.getLayer(id);
            var ms = this.pxToMilisec(this.pointerPosition);
            if (layer.getKeyframeByTimestamp(ms) === null) {
                layer.addKeyframe(this.app.workspace.getCurrentShape(id), ms, this.app.workspace.getBezier());

                //for check
                layer.getAllKeyframes().forEach(function (item, index) {
                    console.log(item);
                });

                //for check
                this.renderKeyframes(id);
            }
        }
    };

    Timeline.prototype.pxToMilisec = function (px) {
        if (typeof px === "undefined") { px = null; }
        if (px == null) {
            return ((this.pointerPosition / this.keyframeWidth) * this.miliSecPerFrame);
        } else {
            return ((px / this.keyframeWidth) * this.miliSecPerFrame);
        }
    };

    Timeline.prototype.milisecToPx = function (ms) {
        return ((ms / this.miliSecPerFrame) * this.keyframeWidth);
    };

    Timeline.prototype.onDeleteKeyframe = function (e) {
        console.log('Deleting keyframe...');
        var keyframeEl = this.keyframesTableEl.find('tbody .keyframe.selected');

        if (keyframeEl.length) {
            this.getLayer(keyframeEl.data('layer')).deleteKeyframe(keyframeEl.data('index'));

            this.renderKeyframes(keyframeEl.data('layer'));
            this.app.workspace.transformShapes();
        }
    };

    Object.defineProperty(Timeline.prototype, "repeat", {
        get: function () {
            return this._repeat;
        },
        enumerable: true,
        configurable: true
    });

    Timeline.prototype.getSelectedKeyframeID = function (idLayer) {
        var el = (this.keyframesTableEl.find('tr.layer-row[data-id="' + idLayer + '"]')).find('.keyframe.selected');
        return el.data('index');
    };

    Timeline.prototype.buildBreadcrumb = function (scope) {
        console.log('building breadcrumb');
        $('.breadcrumb').remove();
        var container = $('<div>').addClass('breadcrumb');
        var currentLayer = this.getLayer(scope);
        console.log(currentLayer);
        if (currentLayer) {
            container.append($('<span>').html('<a href="#" class="set-scope" data-id=' + currentLayer.id + '>' + currentLayer.name + '</a>'));
            this.getParent(currentLayer.parent, container);
        }
        container.prepend($('<span>').html('<a href="#" class="set-scope">Hlavní plátno</a>'));
        this.keyframesFooterEl.append(container);
    };

    Timeline.prototype.getParent = function (parent, container) {
        var layer = null;
        layer = this.getLayer(parent);
        if (layer) {
            container.prepend($('<span>').html('<a href="#" class="set-scope" data-id=' + layer.id + '>' + layer.name + '</a>'));
            this.getParent(layer.parent, container);
        }
        return layer;
    };
    return Timeline;
})();
var Shape = (function () {
    function Shape(params) {
        this._parameters = params;
    }
    Object.defineProperty(Shape.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Shape.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });


    Shape.prototype.setBorder = function (border) {
        this._parameters.border = border;
    };

    Shape.prototype.setZindex = function (zindex) {
        this._parameters.zindex = zindex;
    };

    Shape.prototype.setPosition = function (pos) {
        this._parameters.top = pos.top;
        this._parameters.left = pos.left;
    };

    Shape.prototype.setDimensions = function (d) {
        this._parameters.width = d.width;
        this._parameters.height = d.height;
    };

    Shape.prototype.setBackground = function (c) {
        this.parameters.background = c;
    };

    Shape.prototype.setOpacity = function (o) {
        this.parameters.opacity = o;
    };

    Shape.prototype.setX = function (x) {
        this._parameters.width = x;
    };

    Shape.prototype.setY = function (y) {
        this._parameters.height = y;
    };

    Shape.prototype.setBorderRadiusTopLeft = function (val) {
        this._parameters.borderRadius[0] = val;
    };

    Shape.prototype.setBorderRadiusTopRight = function (val) {
        this._parameters.borderRadius[1] = val;
    };

    Shape.prototype.setBorderRadiusBottomRight = function (val) {
        this._parameters.borderRadius[2] = val;
    };

    Shape.prototype.setBorderRadiusBottomLeft = function (val) {
        this._parameters.borderRadius[3] = val;
    };

    Shape.prototype.setRotateX = function (val) {
        this._parameters.rotate.x = val;
    };

    Shape.prototype.setRotateY = function (val) {
        this._parameters.rotate.y = val;
    };

    Shape.prototype.setRotateZ = function (val) {
        this._parameters.rotate.z = val;
    };

    Shape.prototype.setSkewX = function (val) {
        this._parameters.skew.x = val;
    };

    Shape.prototype.setSkewY = function (val) {
        this._parameters.skew.y = val;
    };

    Shape.prototype.setOriginX = function (val) {
        this._parameters.origin.x = val;
    };

    Shape.prototype.setOriginY = function (val) {
        this._parameters.origin.y = val;
    };
    return Shape;
})();
///<reference path="Shape.ts" />
var Workspace = (function () {
    function Workspace(app, workspaceContainer, workspaceWrapper) {
        var _this = this;
        this.createdLayer = false;
        this._workspaceSize = { width: 800, height: 360 };
        this._scope = null;
        this.workspaceOverlay = $('<div>').addClass('workspace-overlay');
        this.uploadArea = $('<div>').addClass('upload-area').html('<p>Sem přetáhněte obrázek</p>');
        this.uploadBtn = $('<input type="file"></input>').addClass('pick-image');
        this.app = app;
        this.workspaceContainer = workspaceContainer;
        this.workspaceContainerOriginal = workspaceContainer;
        this.workspaceWrapper = workspaceWrapper;
        this.uploadArea.append(($('<p>').addClass('perex').html('nebo vyberte soubor ')).append(this.uploadBtn));
        this.workspaceOverlay.append(this.uploadArea);

        this.workspaceContainer.css(this._workspaceSize);

        this.workspaceWrapper.on('mousedown', function (event) {
            //if ($(event.target).is('#workspace')) {
            if (_this.app.controlPanel.Mode == 1 /* CREATE_DIV */) {
                _this.onDrawSquare(event);
            }
            //}
        });

        this.workspaceWrapper.on('dblclick', function (event) {
            if (_this.app.controlPanel.Mode == 3 /* TEXT */) {
                //if mode is TEXT, create text field
                _this.onCreateText(event);
            } else if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                //if mode is SELECT, check if dblclick is in container -> set scope
                var layer = _this.app.timeline.getLayer($(event.target).data('id'));
                if (layer instanceof RectangleLayer) {
                    _this.setScope(layer.id);
                }
            }
        });

        this.workspaceWrapper.on('mousedown', function (e) {
            //for deselect layer
            if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                if (!$(e.target).hasClass('shape-helper') && !$(e.target).hasClass('origin-point')) {
                    _this.app.timeline.selectLayer(null);
                }
            }
        });

        this.workspaceWrapper.on('mouseup', function (event) {
            if (_this.createdLayer) {
                var shape = new Rectangle(_this.shapeParams);
                var layer = new RectangleLayer('Vrstva ' + (Layer.counter + 1), _this.getBezier(), shape);
                var parent = _this.workspaceContainer.data('id') ? _this.workspaceContainer.data('id') : null;
                layer.parent = parent;
                if (layer.parent) {
                    layer.nesting = (_this.app.timeline.getLayer(layer.parent).nesting + 1);
                }
                var idLayer = _this.app.timeline.addLayer(layer);

                //this.renderShapes();
                _this.workspaceWrapper.find('.tmp-shape').remove();
                _this.renderSingleShape(idLayer);
                _this.transformShapes();
                _this.highlightShape([idLayer]);
                _this.createdLayer = false;
            }
        });

        this.workspaceContainer.on('mousedown', '.shape-helper', function (event) {
            _this.createdLayer = false;
            if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                var id = $(event.target).closest('.shape-helper').data('id');
                _this.app.timeline.selectLayer(id);
                _this.app.timeline.scrollTo(id);
            }
        });

        //fix for draggable origin point
        /*this.workspaceContainer.on('click', '.shape-helper', (event: JQueryEventObject) => {
        if (this.app.controlPanel.Mode == Mode.SELECT) {
        var id: number = $(event.target).closest('.shape-helper').data('id');
        this.app.timeline.selectLayer(id);
        this.app.timeline.scrollTo(id);
        }
        });*/
        this.workspaceContainer.on('mouseover', '.shape-helper', function (event) {
            if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                $(event.target).find('.helpername').show();
            }
        });

        this.workspaceContainer.on('mouseout', '.shape-helper', function (event) {
            if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                $(event.target).find('.helpername').hide();
            }
        });

        $(document).ready(function () {
            $(document).on('click', '.breadcrumb span:last-child .set-scope', function (e) {
                console.log('prevent');
                e.preventDefault();
                return false;
            });
            $(document).on('click', '.breadcrumb span:not(:last-child) .set-scope', function (e) {
                var scope = null;
                var layer = _this.app.timeline.getLayer($(e.target).data('id'));
                if (layer) {
                    scope = layer.id;
                }
                _this.setScope(scope);
            });
        });
    }
    Workspace.prototype.onDrawSquare = function (e) {
        var _this = this;
        var new_object = $('<div>').addClass('shape-helper tmp-shape');
        console.log(e);
        var click_y = e.pageY - this.workspaceContainer.offset().top;
        var click_x = e.pageX - this.workspaceContainer.offset().left;
        console.log(this.workspaceContainer.offset().top);
        console.log(this.workspaceContainer.offset().left);
        new_object.css({
            'top': click_y,
            'left': click_x,
            //'background': this.getRandomColor(),
            'background': 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')',
            'z-index': this.app.timeline.layers.length,
            'opacity': this.opacity
        });

        //new_object.appendTo(this.workspaceContainer);
        this.workspaceWrapper.on('mousemove', function (event) {
            _this.onChangeSizeSquare(event, click_y, click_x, new_object);
        }).on('mouseup', function (event) {
            _this.workspaceWrapper.off('mousemove');
        });
    };

    Workspace.prototype.onChangeSizeSquare = function (e, click_y, click_x, new_object) {
        var move_x = e.pageX - this.workspaceContainer.offset().left;
        var move_y = e.pageY - this.workspaceContainer.offset().top;
        var width = Math.abs(move_x - click_x);
        var height = Math.abs(move_y - click_y);
        var new_x, new_y;

        new_x = (move_x < click_x) ? (click_x - width) : click_x;
        new_y = (move_y < click_y) ? (click_y - height) : click_y;

        //var c = $.color.extract(new_object, 'background-color');
        var barva = parseCSSColor(new_object.css('background-color'));
        var c = {
            r: barva[0],
            g: barva[1],
            b: barva[2],
            a: barva[3]
        };
        var params = {
            top: new_y,
            left: new_x,
            width: width,
            height: height,
            background: c,
            opacity: new_object.css('opacity'),
            zindex: this.app.timeline.layers.length,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: { x: 50, y: 50 }
        };

        new_object.css({
            'width': width,
            'height': height,
            'top': new_y,
            'left': new_x,
            'z-index': this.app.timeline.layers.length
        });
        this.shapeParams = params;

        if (width > 5 && height > 5) {
            new_object.appendTo(this.workspaceContainer);
            this.app.controlPanel.updateDimensions({ width: width, height: height });
            this.createdLayer = true;
        } else {
            new_object.remove();
            this.createdLayer = false;
        }
    };

    Workspace.prototype.getTransformAttr = function (idLayer, attr) {
        var currentTimestamp = this.app.timeline.pxToMilisec();
        var layer = this.app.timeline.getLayer(idLayer);
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(currentTimestamp);
            if (keyframe == null) {
                keyframe = layer.getKeyframe(0);
            }
            var timestamps = layer.timestamps;

            var left = null;
            var right = null;
            var index = 0;
            for (var i = timestamps.length; i--;) {
                if (timestamps[i] < currentTimestamp && (left === null || left < timestamps[i])) {
                    left = timestamps[i];
                }
                if (timestamps[i] >= currentTimestamp && (right === null || right > timestamps[i])) {
                    right = timestamps[i];
                    index = i;
                }
            }
            ;

            if (left === null && right === currentTimestamp && timestamps.length >= 2) {
                left = right;
                right = timestamps[index + 1];
            }

            var params = null;
            var interval = new Array();
            if (left != null) {
                interval['left'] = layer.getKeyframeByTimestamp(left);
                params = interval['left'].shape.parameters;
            }
            if (right != null) {
                interval['right'] = layer.getKeyframeByTimestamp(right);
                params = interval['right'].shape.parameters;
            }

            if (Object.keys(interval).length == 2) {
                //var bezier = BezierEasing(0.25, 0.1, 0.0, 1.0);
                var fn = interval['right'].timing_function;
                var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
                var p = (currentTimestamp - left) / (right - left);

                params = {
                    top: this.computeParameter(interval['left'].shape.parameters.top, interval['right'].shape.parameters.top, bezier(p)),
                    left: this.computeParameter(interval['left'].shape.parameters.left, interval['right'].shape.parameters.left, bezier(p)),
                    width: this.computeParameter(interval['left'].shape.parameters.width, interval['right'].shape.parameters.width, bezier(p)),
                    height: this.computeParameter(interval['left'].shape.parameters.height, interval['right'].shape.parameters.height, bezier(p)),
                    background: {
                        r: this.computeParameter(interval['left'].shape.parameters.background.r, interval['right'].shape.parameters.background.r, bezier(p)),
                        g: this.computeParameter(interval['left'].shape.parameters.background.g, interval['right'].shape.parameters.background.g, bezier(p)),
                        b: this.computeParameter(interval['left'].shape.parameters.background.b, interval['right'].shape.parameters.background.b, bezier(p)),
                        a: this.computeOpacity(interval['left'].shape.parameters.background.a, interval['right'].shape.parameters.background.a, bezier(p))
                    },
                    opacity: this.computeOpacity(interval['left'].shape.parameters.opacity, interval['right'].shape.parameters.opacity, bezier(p)),
                    borderRadius: [
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[0], interval['right'].shape.parameters.borderRadius[0], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[1], interval['right'].shape.parameters.borderRadius[1], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[2], interval['right'].shape.parameters.borderRadius[2], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[3], interval['right'].shape.parameters.borderRadius[3], bezier(p))
                    ],
                    rotate: {
                        x: this.computeParameter(interval['left'].shape.parameters.rotate.x, interval['right'].shape.parameters.rotate.x, bezier(p)),
                        y: this.computeParameter(interval['left'].shape.parameters.rotate.y, interval['right'].shape.parameters.rotate.y, bezier(p)),
                        z: this.computeParameter(interval['left'].shape.parameters.rotate.z, interval['right'].shape.parameters.rotate.z, bezier(p))
                    },
                    skew: {
                        x: this.computeParameter(interval['left'].shape.parameters.skew.x, interval['right'].shape.parameters.skew.x, bezier(p)),
                        y: this.computeParameter(interval['left'].shape.parameters.skew.y, interval['right'].shape.parameters.skew.y, bezier(p))
                    },
                    origin: {
                        x: this.computeOpacity(interval['left'].shape.parameters.origin.x, interval['right'].shape.parameters.origin.x, bezier(p)),
                        y: this.computeOpacity(interval['left'].shape.parameters.origin.y, interval['right'].shape.parameters.origin.y, bezier(p))
                    },
                    zindex: interval['left'].shape.parameters.zindex
                };
            }

            return params[attr];
        } else {
            return null;
        }
    };

    Workspace.prototype.transformShapes = function () {
        var _this = this;
        var currentTimestamp = this.app.timeline.pxToMilisec();
        var layers = this.app.timeline.layers;
        layers.forEach(function (layer, index) {
            var shape = _this.workspaceWrapper.find('.shape[data-id="' + layer.id + '"]');
            var helper = _this.workspaceWrapper.find('.shape-helper[data-id="' + layer.id + '"]');
            var currentLayerId = _this.workspaceWrapper.find('.shape-helper.highlight').first().data('id');

            layer.transform(currentTimestamp, shape, helper, currentLayerId, _this.app.controlPanel);
        });
    };

    Workspace.prototype.computeParameter = function (leftParam, rightParam, b) {
        var value = null;
        var absValue = Math.round((Math.abs(rightParam - leftParam)) * b);
        if (leftParam > rightParam) {
            value = leftParam - absValue;
        } else {
            value = leftParam + absValue;
        }
        return value;
    };

    Workspace.prototype.computeOpacity = function (leftParam, rightParam, b) {
        var value = null;
        var absValue = (Math.abs(rightParam - leftParam)) * b;
        if (leftParam > rightParam) {
            value = Number(leftParam) - Number(absValue);
        } else {
            value = Number(leftParam) + Number(absValue);
        }
        return (Number(value));
    };

    Workspace.prototype.renderShapes = function (scope) {
        var _this = this;
        if (typeof scope === "undefined") { scope = null; }
        $('#workspace').empty();
        var existing = false;
        var scopedLayer = this.app.timeline.getLayer(scope);
        var nesting = 0;
        if (scopedLayer) {
            nesting = scopedLayer.nesting;
        }

        for (var n = nesting; ; n++) {
            existing = false;
            var container;
            if (n == 0) {
                container = $('#workspace');
            }
            this.app.timeline.layers.forEach(function (layer, index) {
                if (layer.nesting == n) {
                    existing = true;
                    var parentLayer = _this.app.timeline.getLayer(layer.parent);
                    if (parentLayer) {
                        container = _this.workspaceWrapper.find('.shape[data-id="' + parentLayer.id + '"]');
                    }
                    layer.renderShape(container, _this.app.timeline.pxToMilisec(), _this.scope);
                }
            });
            if (!existing) {
                break;
            }
        }
        this.dragResize();
        this.onChangeMode();
        if (this.scope) {
            this.workspaceContainer = this.workspaceWrapper.find('.square' + '[data-id="' + this.scope + '"]').addClass('scope');
            this.workspaceContainer.parents('.square').addClass('scope');
        } else {
            this.workspaceContainer = $('#workspace');
        }
    };

    Workspace.prototype.renderSingleShape = function (id) {
        var shapeEl = $('#workspace').find('.shape[data-id="' + id + '"]');
        var container = this.workspaceContainer;
        if (shapeEl.length) {
            container = shapeEl.parent();
        }

        var layer = this.app.timeline.getLayer(id);
        if (layer) {
            layer.renderShape(container, this.app.timeline.pxToMilisec(), this.scope);
        }

        this.dragResize();
        this.onChangeMode();
        if (this.scope) {
            this.workspaceContainer = this.workspaceWrapper.find('.square' + '[data-id="' + this.scope + '"]').addClass('scope');
            this.workspaceContainer.parents('.square').addClass('scope');
        } else {
            this.workspaceContainer = $('#workspace');
        }
    };

    Workspace.prototype.renderShapesOld = function () {
        var _this = this;
        console.log('Rendering workspace..');
        var layers = this.app.timeline.layers;
        this.workspaceContainer.empty();

        layers.forEach(function (item, index) {
            var shape = $('<div>').addClass('shape square');
            var helper = $('<div>').addClass('shape-helper');
            helper.append($('<div>').addClass('origin-point'));
            if (item.idEl) {
                var helpername = $('<div>').addClass('helpername').html('<p>' + item.name + '<span class="div-id">#' + item.idEl + '</span></p>');
            } else {
                var helpername = $('<div>').addClass('helpername').html('<p>' + item.name + '</p>');
            }

            //get keyframe by pointer position
            var keyframe = item.getKeyframeByTimestamp(_this.app.timeline.pxToMilisec());

            //if no keyframe, take get init keyframe
            if (keyframe == null) {
                keyframe = item.getKeyframe(0);
            }
            if (keyframe != null) {
                if (keyframe.shape instanceof Img) {
                    shape = $('<img>').addClass('shape image');
                }

                if (keyframe.shape instanceof TextField) {
                    var l = item;
                    shape = $('<span>').addClass('shape froala text').html(l.globalShape.getContent());
                }

                var params = keyframe.shape.parameters;
                var css = {
                    'top': params.top,
                    'left': params.left,
                    'width': params.width,
                    'height': params.height,
                    'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')',
                    'border': params.border,
                    'z-index': params.zindex,
                    'opacity': params.opacity,
                    'border-top-left-radius': params.borderRadius[0],
                    'border-top-right-radius': params.borderRadius[1],
                    'border-bottom-right-radius': params.borderRadius[2],
                    'border-bottom-left-radius': params.borderRadius[3]
                };
                shape.css(css);
                if (item.idEl) {
                    shape.attr('id', item.idEl);
                }
                helper.css({
                    'top': params.top - 1,
                    'left': params.left - 1,
                    'width': params.width + 2,
                    'height': params.height + 2,
                    'z-index': params.zindex + 1000
                });

                if (keyframe.shape instanceof Img) {
                    var img = keyframe.shape;
                    shape.attr('src', img.getSrc());
                }

                if (keyframe.shape instanceof TextField) {
                    var text = keyframe.shape;
                    shape.css({
                        'color': 'rgba(' + text.getColor().r + ',' + text.getColor().g + ',' + text.getColor().b + ')',
                        'font-size': text.getSize(),
                        'font-family': text.getFamily()
                    });
                    shape.froala({
                        inlineMode: true,
                        paragraphy: false,
                        allowedTags: [],
                        buttons: [],
                        placeholder: 'Zadejte text...'
                    });

                    shape.on('editable.contentChanged', function (e, editor) {
                        _this.onChangeText(shape.data('id'), editor.trackHTML);
                    });
                }

                shape.attr('data-id', keyframe.shape.id);
                helper.attr('data-id', keyframe.shape.id);
                helpername.appendTo(helper);
                shape.appendTo(_this.workspaceContainer);
                helper.appendTo(_this.workspaceContainer);
            }
        });

        this.dragResize();
        this.onChangeMode();
    };

    Workspace.prototype.dragResize = function () {
        var _this = this;
        $('.origin-point').draggable();

        //hook draging on shapes
        $('.shape-helper').draggable({
            scroll: false,
            drag: function (event, ui) {
                console.log('dragging helper');
                var id = $(event.target).data('id');
                _this.workspaceContainer.find('.shape[data-id="' + id + '"]').css({
                    'top': ui.position.top + 1,
                    'left': ui.position.left + 1
                });
            },
            stop: function (event, ui) {
                var layer = _this.app.timeline.getLayer($(event.target).data('id'));
                var keyframe = layer.getKeyframeByTimestamp(_this.app.timeline.pxToMilisec());
                if (keyframe == null) {
                    //keyframe = layer.getKeyframe(0);
                    layer.addKeyframe(_this.getCurrentShape(layer.id), _this.app.timeline.pxToMilisec(), _this.bezier);
                    _this.app.timeline.renderKeyframes(layer.id);
                } else {
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1
                    });
                }

                _this.transformShapes();
                _this.app.timeline.selectLayer(layer.id);
                $('.workspace-wrapper').perfectScrollbar('update');
            }
        });

        //resizable shape
        $('.shape-helper').resizable({
            handles: 'all',
            autohide: true,
            resize: function (event, ui) {
                var id = $(event.target).data('id');
                var shape = _this.workspaceContainer.find('.shape[data-id="' + id + '"]');
                shape.css({
                    'top': ui.position.top + 1,
                    'left': ui.position.left + 1,
                    'width': $(event.target).width(),
                    'height': $(event.target).height()
                });
                _this.app.controlPanel.updateDimensions({ width: $(event.target).width(), height: $(event.target).height() });
            },
            stop: function (event, ui) {
                var layer = _this.app.timeline.getLayer($(event.target).data('id'));
                var keyframe = layer.getKeyframeByTimestamp(_this.app.timeline.pxToMilisec());
                if (keyframe == null) {
                    layer.addKeyframe(_this.getCurrentShape(layer.id), _this.app.timeline.pxToMilisec(), _this.bezier);
                    _this.app.timeline.renderKeyframes(layer.id);
                } else {
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1
                    });
                    keyframe.shape.setDimensions({
                        width: $(event.target).width(),
                        height: $(event.target).height()
                    });
                }

                _this.transformShapes();
                _this.app.timeline.selectLayer(layer.id);
            }
        });
    };

    Workspace.prototype.highlightShape = function (arrayID) {
        var _this = this;
        //var originPoint: JQuery = $('<div>').addClass('origin-point');
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        this.workspaceContainer.find('.shape-helper').find('.origin-point').hide();
        if (arrayID != null) {
            arrayID.forEach(function (id, index) {
                _this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').addClass('highlight');

                //last selected shape(if selected more then one)
                if (index == (arrayID.length - 1)) {
                    var shape = _this.getCurrentShape(id);
                    if (shape) {
                        _this.app.controlPanel.updateDimensions({ width: shape.parameters.width, height: shape.parameters.height });
                        _this.app.controlPanel.updateOpacity(shape.parameters.opacity);
                        _this.app.controlPanel.updateColor({ r: shape.parameters.background.r, g: shape.parameters.background.g, b: shape.parameters.background.b }, shape.parameters.background.a);
                        _this.app.controlPanel.updateBorderRadius(shape.parameters.borderRadius);
                        _this.app.controlPanel.updateIdEl(_this.app.timeline.getLayer(id).idEl);
                        _this.app.controlPanel.update3DRotate({ x: shape.parameters.rotate.x, y: shape.parameters.rotate.y, z: shape.parameters.rotate.z });
                        _this.app.controlPanel.updateTransformOrigin(shape.parameters.origin.x, shape.parameters.origin.y);

                        (_this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]')).find('.origin-point').css({
                            'left': shape.parameters.origin.x + '%',
                            'top': shape.parameters.origin.y + '%'
                        });

                        if (shape instanceof TextField) {
                            var text = shape;
                            var layer = _this.app.timeline.getLayer(id);
                            _this.app.controlPanel.updateFont(text.getColor(), text.getSize(), layer.globalShape.getFamily());
                        }

                        if (_this.app.controlPanel.originMode) {
                            (_this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]')).find('.origin-point').show();
                            console.log('is origin mode');
                            $('.origin-point').draggable('option', {
                                drag: function (event, ui) {
                                    var xPercent = ui.position.left / shape.parameters.width * 100;
                                    var yPercent = ui.position.top / shape.parameters.height * 100;
                                    xPercent = Math.round(xPercent * 100) / 100;
                                    yPercent = Math.round(yPercent * 100) / 100;

                                    _this.app.controlPanel.updateTransformOrigin(xPercent, yPercent);
                                },
                                stop: function (event, ui) {
                                    var xPercent = ui.position.left / shape.parameters.width * 100;
                                    var yPercent = ui.position.top / shape.parameters.height * 100;
                                    xPercent = Math.round(xPercent * 100) / 100;
                                    yPercent = Math.round(yPercent * 100) / 100;

                                    _this.setTransformOrigin('x', xPercent);
                                    _this.setTransformOrigin('y', yPercent);
                                }
                            });
                        }
                    }
                }
            });
        } else {
            this.app.controlPanel.updateDimensions({ width: null, height: null });
            this.app.controlPanel.updateIdEl(null);
        }
    };

    Workspace.prototype.getCurrentShape = function (id) {
        var shapeEl = this.workspaceContainer.find('.shape[data-id="' + id + '"]');
        if (shapeEl.length) {
            //var c = $.color.extract(shapeEl, 'background-color');
            var barva = parseCSSColor(shapeEl.css('background-color'));
            var c = {
                r: barva[0],
                g: barva[1],
                b: barva[2],
                a: barva[3]
            };
            var params = {
                top: this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().top + 1,
                left: this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().left + 1,
                width: shapeEl.width(),
                height: shapeEl.height(),
                background: c,
                opacity: parseFloat(shapeEl.css('opacity')),
                zindex: parseInt(shapeEl.css('z-index')),
                borderRadius: [
                    parseInt(shapeEl.css('border-top-left-radius')),
                    parseInt(shapeEl.css('border-top-right-radius')),
                    parseInt(shapeEl.css('border-bottom-right-radius')),
                    parseInt(shapeEl.css('border-bottom-left-radius'))
                ],
                rotate: {
                    x: this.getTransformAttr(id, 'rotate').x,
                    y: this.getTransformAttr(id, 'rotate').y,
                    z: this.getTransformAttr(id, 'rotate').z
                },
                skew: {
                    x: this.getTransformAttr(id, 'skew').x,
                    y: this.getTransformAttr(id, 'skew').y
                },
                origin: {
                    x: this.getTransformAttr(id, 'origin').x,
                    y: this.getTransformAttr(id, 'origin').y
                }
            };

            //if background is transparent
            if (c.a == 0) {
                params['background']['r'] = this.color.r;
                params['background']['g'] = this.color.g;
                params['background']['b'] = this.color.b;
            }

            if (this.app.timeline.getLayer(id).globalShape instanceof Img) {
                var shape = new Img(params, shapeEl.attr('src'));
            } else if (this.app.timeline.getLayer(id).globalShape instanceof TextField) {
                var color = {
                    r: this.getPartOfRGBA(shapeEl.css('color'), 'r'),
                    g: this.getPartOfRGBA(shapeEl.css('color'), 'g'),
                    b: this.getPartOfRGBA(shapeEl.css('color'), 'b')
                };
                var size = parseFloat(shapeEl.css('font-size'));
                var font = shapeEl.css('font-family');
                var shape = new TextField(params, shapeEl.html().toString(), color, size, font);
            } else {
                var shape = new Rectangle(params);
            }
            shape.id = id;

            return shape;
        } else {
            return null;
        }
    };

    Workspace.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    Workspace.prototype.convertHex = function (hex, opacity) {
        hex = hex.replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    };

    Workspace.prototype.convertPartColor = function (hex, part) {
        hex = hex.replace('#', '');
        if (part == 'r') {
            var value = parseInt(hex.substring(0, 2), 16);
        } else if (part == 'g') {
            var value = parseInt(hex.substring(2, 4), 16);
        } else if (part == 'b') {
            var value = parseInt(hex.substring(4, 6), 16);
        }

        return value;
    };

    Workspace.prototype.getPartOfRGBA = function (rgb, part) {
        var parts = rgb.match(/\d+/g);
        if (part == 'r') {
            return parseInt(parts[0]);
        } else if (part == 'g') {
            return parseInt(parts[1]);
        } else if (part == 'b') {
            return parseInt(parts[2]);
        } else if (part == 'a') {
            return parseInt(parts[3]);
        }
    };

    Workspace.prototype.parseRotation = function (style, index) {
        var s = style.split(';');
        var t = s[s.length - 2];
        var x = t.match(/\(.*?\)/g)[index];
        x = x.substr(1, x.length - 2);
        return parseInt(x.replace('deg', ''));
    };

    Workspace.prototype.setColor = function (c, alpha) {
        this.color = {
            r: c.r,
            g: c.g,
            b: c.b,
            a: alpha
        };
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            keyframe.shape.setBackground(this.color);

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setFont = function (params, newKeyframe) {
        if (typeof newKeyframe === "undefined") { newKeyframe = true; }
        this.fontParameters = params;
        var layer = this.getHighlightedLayer();
        if (layer && layer.getKeyframe(0).shape instanceof TextField) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null && newKeyframe) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }

            if (keyframe != null) {
                var textField = keyframe.shape;
                textField.setFont(this.fontParameters);
            }
            var l = layer;
            l.globalShape.setFamily(this.fontParameters.fontFamily);

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setOpacity = function (opacity) {
        this.opacity = opacity;
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            keyframe.shape.setOpacity(opacity);

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setDimension = function (axis, dimension) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            if (axis === 'x') {
                keyframe.shape.setX(dimension);
            } else if (axis === 'y') {
                keyframe.shape.setY(dimension);
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setBorderRadius = function (type, value) {
        console.log('Setting border radius');
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            if (type === 'tl') {
                keyframe.shape.setBorderRadiusTopLeft(value);
            } else if (type === 'tr') {
                keyframe.shape.setBorderRadiusTopRight(value);
            } else if (type === 'bl') {
                keyframe.shape.setBorderRadiusBottomLeft(value);
            } else if (type === 'br') {
                keyframe.shape.setBorderRadiusBottomRight(value);
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.set3DRotate = function (type, value) {
        console.log('setting rotate');
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            if (type === 'x') {
                keyframe.shape.setRotateX(value);
            } else if (type === 'y') {
                keyframe.shape.setRotateY(value);
            } else if (type === 'z') {
                keyframe.shape.setRotateZ(value);
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setTransformOrigin = function (type, value) {
        console.log('setting transform-origin');
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            if (type === 'x') {
                keyframe.shape.setOriginX(value);
            } else if (type === 'y') {
                keyframe.shape.setOriginY(value);
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setSkew = function (type, value) {
        console.log('setting skew');
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            if (type === 'x') {
                keyframe.shape.setSkewX(value);
                console.log(value);
            } else if (type === 'y') {
                keyframe.shape.setSkewY(value);
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setBezier = function (fn) {
        this.bezier = fn;
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframeID = this.app.timeline.getSelectedKeyframeID(layer.id);
            var keyframe = layer.getKeyframe(keyframeID);
            if (keyframe != null) {
                keyframe.timing_function = this.bezier;
                this.app.timeline.renderKeyframes(layer.id);
                this.app.timeline.selectLayer(layer.id, keyframeID);
            }
        }
    };

    Workspace.prototype.updateBezierCurve = function (layer) {
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe) {
                this.app.controlPanel.updateBezierCurve(keyframe.timing_function);
            }
        }
    };

    Workspace.prototype.updateBezierCurveByKeyframe = function (keyframe) {
        if (keyframe) {
            this.app.controlPanel.updateBezierCurve(keyframe.timing_function);
        }
    };

    Workspace.prototype.setIdEl = function (id) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var webalizeID = this.webalize(id);

            if (!this.isEmpty(webalizeID)) {
                var unique = true;
                this.app.timeline.layers.forEach(function (item, index) {
                    if (item.idEl === webalizeID) {
                        unique = false;
                    }
                });
                if (unique) {
                    layer.idEl = this.webalize(id);
                }
            } else {
                layer.idEl = null;
            }

            //this.renderShapes();
            this.renderSingleShape(layer.id);
            this.transformShapes();
            this.app.timeline.renderLayers();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.isEmpty = function (str) {
        return (!str || 0 === str.length);
    };

    Workspace.prototype.webalize = function (s) {
        var nodiac = { 'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z' };
        s = s.toLowerCase();
        var s2 = "";
        for (var i = 0; i < s.length; i++) {
            s2 += (typeof nodiac[s.charAt(i)] != 'undefined' ? nodiac[s.charAt(i)] : s.charAt(i));
        }

        return s2.replace(/[^a-z0-9_]+/g, '-').replace(/^-|-$/g, '');
    };

    Object.defineProperty(Workspace.prototype, "workspaceSize", {
        get: function () {
            return this._workspaceSize;
        },
        enumerable: true,
        configurable: true
    });

    Workspace.prototype.setWorkspaceDimension = function (x, y) {
        var newDimension;
        if (x != null) {
            newDimension = {
                width: x,
                height: this._workspaceSize.height
            };
        }

        if (y != null) {
            newDimension = {
                width: this._workspaceSize.width,
                height: y
            };
        }

        this._workspaceSize = newDimension;
        $('#workspace').css(this._workspaceSize);
        $('.workspace-wrapper').perfectScrollbar('update');
    };

    Workspace.prototype.getBezier = function () {
        return this.bezier;
    };

    Workspace.prototype.setOriginVisible = function () {
        this.highlightShape([this.workspaceContainer.find('.shape-helper.highlight').first().data('id')]);
    };

    Workspace.prototype.getHighlightedLayer = function () {
        var layer = this.app.timeline.getLayer(this.workspaceContainer.find('.shape-helper.highlight').first().data('id'));
        if (layer) {
            return layer;
        } else {
            return null;
        }
    };

    Workspace.prototype.insertMode = function (active) {
        var _this = this;
        if (typeof active === "undefined") { active = true; }
        if (active) {
            this.workspaceWrapper.append(this.workspaceOverlay);
            this.workspaceOverlay.css({
                'height': this.workspaceWrapper.outerHeight(),
                'width': this.workspaceWrapper.outerWidth()
            });

            $('.upload-area > p').on('dragenter', function (event) {
                console.log('vp');
                $('.upload-area').addClass('over');
            });

            this.uploadArea.on('dragenter', function (event) {
                console.log('enter');
                $(event.target).addClass('over');
            });

            this.uploadArea.on('dragleave', function (event) {
                $(event.target).removeClass('over');
            });

            this.uploadArea.on('dragover', function (event) {
                console.log('over');
                event.preventDefault();
            });

            this.uploadArea.on('drop', function (event) {
                console.log('upload');
                event.stopPropagation();
                event.preventDefault();
                var files = event.originalEvent.dataTransfer.files;
                _this.uploadImage(files);
            });

            this.uploadBtn.on('change', function (event) {
                console.log('pick image');
                _this.uploadImage(event.target.files);
            });
        } else {
            $('.insert-image').removeClass('active');
            this.workspaceOverlay.remove();
        }
    };

    Workspace.prototype.uploadImage = function (files) {
        var _this = this;
        var image = files[0];
        if (image.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = (function (theFile) {
                return function (e) {
                    var img = new Image();
                    img.onload = function () {
                        var p = {
                            top: 0,
                            left: 0,
                            width: img.width,
                            height: img.height,
                            background: { r: 255, g: 255, b: 255, a: 0 },
                            opacity: 1,
                            borderRadius: [0, 0, 0, 0],
                            rotate: { x: 0, y: 0, z: 0 },
                            skew: { x: 0, y: 0 },
                            origin: { x: 50, y: 50 },
                            zindex: _this.app.timeline.layers.length
                        };
                        var image = new Img(p, e.target.result);
                        var layer = new ImageLayer('Vrstva ' + (Layer.counter + 1), _this.getBezier(), image);
                        var parent = _this.workspaceContainer.data('id') ? _this.workspaceContainer.data('id') : null;
                        layer.parent = parent;
                        if (layer.parent) {
                            layer.nesting = (_this.app.timeline.getLayer(layer.parent).nesting + 1);
                        }
                        var idLayer = _this.app.timeline.addLayer(layer);

                        //this.renderShapes();
                        _this.renderSingleShape(idLayer);
                        _this.transformShapes();
                        _this.highlightShape([idLayer]);

                        _this.uploadBtn.val('');

                        _this.app.controlPanel.Mode = 0 /* SELECT */;
                        $('.tool-btn.select').addClass('active');
                        _this.onChangeMode();
                    };

                    img.src = e.target.result;
                    //create image layer
                };
            })(image);

            reader.readAsDataURL(image);
        }

        this.insertMode(false);
    };

    Workspace.prototype.onCreateText = function (e) {
        console.log('creating textfield');

        var params = {
            top: e.pageY - this.workspaceContainer.offset().top - 10,
            left: e.pageX - this.workspaceContainer.offset().left - 5,
            width: 150,
            height: 75,
            background: { r: 255, g: 255, b: 255, a: 0 },
            opacity: 1,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: { x: 50, y: 50 },
            zindex: this.app.timeline.layers.length
        };

        var shape = new TextField(params, null, this.fontParameters.color, this.fontParameters.size, this.fontParameters.fontFamily);
        var layer = new TextLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), shape);
        var parent = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
        layer.parent = parent;
        if (layer.parent) {
            layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
        }
        var idLayer = this.app.timeline.addLayer(layer);

        //this.renderShapes();
        this.renderSingleShape(layer.id);
        this.transformShapes();
        this.highlightShape([idLayer]);
        this.onChangeMode();
    };

    Workspace.prototype.onChangeText = function (id, text) {
        console.log(text);
        var shape = this.app.timeline.getLayer(id).globalShape;
        shape.setContent(text);
    };

    Workspace.prototype.onChangeMode = function () {
        var _this = this;
        console.log('onChangeMode');
        var mode = this.app.controlPanel.Mode;
        if (mode == 0 /* SELECT */) {
            $('.shape-helper').draggable('enable');
            $('.origin-point').draggable('enable');
            $('.shape-helper').resizable('enable');
        } else {
            $('.shape-helper').draggable('disable');
            $('.origin-point').draggable('disable');
            $('.shape-helper').resizable('disable');
        }

        if (mode == 2 /* IMAGE */) {
            this.insertMode(true);
        } else {
            this.insertMode(false);
        }

        if (mode == 3 /* TEXT */) {
            $('.workspace-wrapper').addClass('text-mode');
            $('.froala').froala('enable');
            $('.froala').removeClass('nonedit');
            this.workspaceContainer.find('.shape.text').each(function (index, el) {
                $(el).css({
                    'z-index': parseInt(_this.workspaceContainer.find('.shape-helper' + '[data-id="' + $(el).data('id') + '"]').css('z-index')) + 1
                });
            });
        } else {
            $('.workspace-wrapper').removeClass('text-mode');
            $('.froala').froala('disable');
            $('.froala').addClass('nonedit');
            this.workspaceContainer.find('.shape.text').each(function (index, el) {
                var keyframe = _this.app.timeline.getLayer($(el).data('id')).getKeyframe(0);
                $(el).css({
                    'z-index': keyframe.shape.parameters.zindex
                });
            });
            var sel;
            if (window.getSelection) {
                sel = window.getSelection();
            } else {
                sel = document.selection;
            }
            if (sel) {
                if (sel.removeAllRanges) {
                    sel.removeAllRanges();
                } else if (sel.empty) {
                    sel.empty();
                }
            }
        }
    };

    Workspace.prototype.setScope = function (id) {
        this._scope = id;
        $('.overlay-scope').remove();

        if (this.scope != null) {
            var overlayEl = $('<div>').addClass('overlay-scope').css({
                'top': this.workspaceWrapper.scrollTop()
            });
            this.workspaceWrapper.append(overlayEl);
            $('.workspace-wrapper').perfectScrollbar('destroy');
        } else {
            this.workspaceContainer = this.workspaceContainerOriginal;
            $('.workspace-wrapper').perfectScrollbar({ includePadding: true });
        }
        this.app.timeline.buildBreadcrumb(this.scope);

        //this.dragResize(); <- nefunguje
        this.app.timeline.renderLayers();
        this.renderShapes();
        this.transformShapes();
        this.app.timeline.selectLayer(null);
    };

    Object.defineProperty(Workspace.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        enumerable: true,
        configurable: true
    });
    return Workspace;
})();
///<reference path="Workspace.ts" />
var ControlPanel = (function () {
    function ControlPanel(app, container) {
        var _this = this;
        this._mode = 0 /* SELECT */;
        this.initColor = { r: 44, g: 208, b: 219 };
        this.initOrigin = [50, 50];
        this.initFontSize = 16;
        this.initTextColor = { r: 0, g: 0, b: 0 };
        this.isOriginVisible = false;
        this.fontFamily = ['Segoe UI', 'Georgia', 'Times', 'Arial', 'Calibri', 'Verdana', 'serif', 'sans-serif'];
        this.toolPanelEl = $('<div>').addClass('tool-panel');
        this.selectToolEl = $('<a>').attr('href', '#').addClass('tool-btn').addClass('select').addClass('tooltip').html('<i class="fa fa-location-arrow fa-flip-horizontal"></i>').attr('title', 'Nástroj pro výběr');
        this.createDivToolEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('create-div').html('<i class="fa fa-stop"></i>').attr('title', 'Nástroj Nový DIV');
        this.generateCodeEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('generate-code').html('<i class="fa fa-code"></i>').attr('title', 'Vygenerovat kód');
        this.insertImageEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('insert-image').html('<i class="fa fa-file-image-o"></i>').attr('title', 'Vložit obrázek');
        this.insertTextEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip insert-text').html('<i class="fa fa-font"</i>').attr('title', 'Vložit text');
        this.controlPanelEl = $('<div>').addClass('control-panel');
        this.bgPickerEl = $('<input type="text" id="picker"></input>');
        this.bgOpacityEl = $('<input>').attr('id', 'bgopacity').addClass('number');
        this.bgOpacitySliderEl = $('<div>').addClass('bgopacity-slider');
        this.itemControlEl = $('<div>').addClass('control-item');
        this.opacityEl = $('<input>').attr('id', 'opacity-input');
        this.opacitySliderEl = $('<div>').addClass('opacity-slider');
        this.dimensionXEl = $('<input type="text"></input').attr('id', 'dimension-x');
        this.dimensionYEl = $('<input type="text"></input').attr('id', 'dimension-y');
        this.borderRadiusTLEl = $('<input type="text"></input').attr('id', 'radius-tl').addClass('border-radius-input').attr('data-type', 'tl');
        this.borderRadiusTREl = $('<input type="text"></input').attr('id', 'radius-tr').addClass('border-radius-input').attr('data-type', 'tr');
        this.borderRadiusBLEl = $('<input type="text"></input').attr('id', 'radius-bl').addClass('border-radius-input').attr('data-type', 'bl');
        this.borderRadiusBREl = $('<input type="text"></input').attr('id', 'radius-br').addClass('border-radius-input').attr('data-type', 'br');
        this.borderRadiusHelperEl = $('<div>').addClass('border-radius-helper');
        this.graph = $('<div>').addClass('graph');
        this.point0 = $('<a>').addClass('point p0').attr('href', '#');
        this.point1 = $('<a>').addClass('point p1').attr('href', '#');
        this.point2 = $('<a>').addClass('point p2').attr('href', '#');
        this.point3 = $('<a>').addClass('point p3').attr('href', '#');
        this.canvas = $('<canvas id="bezierCurve" width="200" height="200"></canvas>');
        this.workspaceWidthEl = $('<input type="text"></input>').attr('id', 'workspace-y').addClass('number');
        this.workspaceHeightEl = $('<input type="text"></input>').attr('id', 'workspace-x').addClass('number');
        this.idEl = $('<input type="text"></input>').attr('id', 'id-el');
        this.rotateXEl = $('<input>').attr('id', 'rx').addClass('number rotate');
        this.rotateXSliderEl = $('<div>').addClass('rotate-slider').attr('id', 'rx');
        this.rotateYEl = $('<input>').attr('id', 'ry').addClass('number rotate');
        this.rotateYSliderEl = $('<div>').addClass('rotate-slider').attr('id', 'ry');
        this.rotateZEl = $('<input>').attr('id', 'rz').addClass('number rotate');
        this.rotateZSliderEl = $('<div>').addClass('rotate-slider').attr('id', 'rz');
        this.skewXEl = $('<input>').attr('id', 'skewx').addClass('number skew');
        this.skewXSliderEl = $('<div>').addClass('skew-slider').attr('id', 'skewx');
        this.skewYEl = $('<input>').attr('id', 'skewy').addClass('number skew');
        this.skewYSliderEl = $('<div>').addClass('skew-slider').attr('id', 'skewy');
        this.transformOriginVisibleEl = $('<input>').attr('type', 'checkbox').attr('id', 'visible').prop('checked', false);
        this.transformOriginXEl = $('<input>').attr('id', 'originx').addClass('number origin');
        this.transformOriginYEl = $('<input>').attr('id', 'originy').addClass('number origin');
        this.fontColorEl = $('<input>').attr('type', 'text').attr('id', 'text-color').addClass('font-attr');
        this.fontSizeEl = $('<input>').attr('type', 'text').attr('id', 'text-size').addClass('number font-attr');
        this.fontFamilyEl = $('<select>').attr('id', 'text-family').addClass('font-attr');
        this.app = app;
        this.containerEl = container;

        this.toolPanelEl.append(this.selectToolEl);
        this.toolPanelEl.append(this.createDivToolEl);
        this.toolPanelEl.append(this.insertImageEl);
        this.toolPanelEl.append(this.insertTextEl);
        this.toolPanelEl.append(this.generateCodeEl);
        this.containerEl.append(this.toolPanelEl);

        //Workspace dimensions
        var workspaceXY = this.itemControlEl.clone();
        workspaceXY.html('<h2>Rozměry plátna</h2>');
        var row = $('<div>').addClass('row');
        var w = $('<div>').html('width: ').addClass('group half');
        w.append(this.workspaceWidthEl.val(this.app.workspace.workspaceSize.width.toString()));
        w.append(' px');
        row.append(w);
        var h = $('<div>').html('height: ').addClass('group half last');
        h.append(this.workspaceHeightEl.val(this.app.workspace.workspaceSize.height.toString()));
        h.append((' px'));
        row.append(h);
        workspaceXY.append(row);
        this.controlPanelEl.append(workspaceXY);

        var idElement = this.itemControlEl.clone();
        idElement.html('<h2>ID elementu</h2>');
        var row = $('<div>').addClass('row');
        var g = $('<div>').html('#').addClass('group full');
        g.append(this.idEl);
        row.append(g);
        idElement.append(row);
        this.controlPanelEl.append(idElement);

        //Bezier curve
        var curve = this.itemControlEl.clone();
        curve.html('<h2>Časový průběh animace</h2>');
        this.graph.append(this.point0);
        this.graph.append(this.point1);
        this.graph.append(this.point2);
        this.graph.append(this.point3);
        this.graph.append(this.canvas);
        curve.append(this.graph);
        curve.append($('<span>').addClass('cubic-bezier').html('cubic-bezier(<span id="p0">0</span>, <span id="p1">0</span>, <span id="p2">0</span>, <span id="p3">0</span>)'));
        this.controlPanelEl.append(curve);

        //background
        var newItem = this.itemControlEl.clone();
        newItem.html('<h2>Barva pozadí elementu</h2>');
        var row = $('<div>').addClass('row');
        var s = $('<div>').html('#').addClass('group quarter');
        s.append(this.bgPickerEl.val($.colpick.rgbToHex(this.initColor)));
        row.append(s);
        var a = $('<div>').html('alpha opacity:<br>').addClass('group quarter-3');
        this.bgOpacityEl.val('1');
        a.append(this.bgOpacitySliderEl);
        a.append(this.bgOpacityEl);
        row.append(a);
        newItem.append(row);
        this.controlPanelEl.append(newItem);

        //opacity
        var opacity = this.itemControlEl.clone();
        opacity.html('<h2>Průhlednost elementu</h2>');
        this.opacityEl.val('1');
        opacity.append(this.opacitySliderEl);
        opacity.append(this.opacityEl);
        this.controlPanelEl.append(opacity);

        //dimensions
        var dim = this.itemControlEl.clone();
        dim.html('<h2>Rozměry elementu</h2>');
        var row = $('<div>').addClass('row');
        var w = $('<div>').html('width: ').addClass('group half');
        w.append(this.dimensionXEl);
        w.append(' px');
        row.append(w);
        var h = $('<div>').html('height: ').addClass('group half last');
        h.append(this.dimensionYEl);
        h.append(' px');
        row.append(h);
        dim.append(row);
        this.controlPanelEl.append(dim);

        //border-radius
        var radius = this.itemControlEl.clone();
        radius.html('<h2>Border-radius</h2>');
        this.borderRadiusHelperEl.append(this.borderRadiusTLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusTREl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBREl.val('0'));
        radius.append(this.borderRadiusHelperEl);
        this.controlPanelEl.append(radius);

        //Font
        var font = this.itemControlEl.clone();
        this.fontSizeEl.val(this.initFontSize.toString());
        this.fontColorEl.val($.colpick.rgbToHex(this.initTextColor));
        font.html('<h2>Text</h2>');
        var row = $('<div>').addClass('row');
        this.fontFamily.forEach(function (val, index) {
            _this.fontFamilyEl.append($("<option>").attr('value', val).text(val));
        });
        var family = $('<div>').html('font-family: ').addClass('group full font-family last');
        family.append(this.fontFamilyEl);
        row.append(family);
        var color = $('<div>').html('color: #').addClass('group quarter-3');
        color.append(this.fontColorEl);
        row.append(color);
        var size = $('<div>').html('size: ').addClass('group quarter last');
        size.append(this.fontSizeEl);
        size.append(' px');
        row.append(size);
        font.append(row);

        this.controlPanelEl.append(font);

        //Transform-origin
        this.transformOriginXEl.val(this.initOrigin[0].toString());
        this.transformOriginYEl.val(this.initOrigin[1].toString());
        var origin = this.itemControlEl.clone();
        origin.html('<h2>Transform-origin</h2>').addClass('control-origin');
        var row = $('<div>').addClass('row');
        var visibleLabel = $('<label>').html('Zobrazit polohu na plátně');
        visibleLabel.prepend(this.transformOriginVisibleEl);
        row.append(visibleLabel);
        var x = $('<div>').html('poz. x: ').addClass('group half');
        x.append(this.transformOriginXEl);
        x.append(' %');
        row.append(x);
        var y = $('<div>').html('poz. y: ').addClass('group half last');
        y.append(this.transformOriginYEl);
        y.append(' %');
        row.append(y);
        origin.append(row);

        this.controlPanelEl.append(origin);

        //3D Rotate
        var rotate = this.itemControlEl.clone();
        rotate.html('<h2>3D rotace</h2>').addClass('control-rotate');
        var x = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.rotateXSliderEl);
        x.append(this.rotateXEl);
        x.append(' deg');
        rotate.append(x);
        var y = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.rotateYSliderEl);
        y.append(this.rotateYEl);
        y.append(' deg');
        rotate.append(y);
        var z = $('<span>').html('<p>z:</p>').addClass('group-form');
        z.append(this.rotateZSliderEl);
        z.append(this.rotateZEl);
        z.append(' deg');
        rotate.append(z);
        this.controlPanelEl.append(rotate);

        //skew
        var skew = this.itemControlEl.clone();
        skew.html('<h2>Zkosení</h2>').addClass('control-rotate');
        var x = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.skewXSliderEl);
        x.append(this.skewXEl);
        x.append(' deg');
        skew.append(x);
        var y = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.skewYSliderEl);
        y.append(this.skewYEl);
        y.append(' deg');
        skew.append(y);
        this.controlPanelEl.append(skew);

        this.containerEl.append(this.controlPanelEl);

        $(window).resize(function () {
            _this.setHeight();
            _this.controlPanelEl.perfectScrollbar('update');
            $('.workspace-wrapper').perfectScrollbar('update');
        });

        this.colorPicker = this.bgPickerEl.colpick({
            layout: 'hex',
            submit: 0,
            color: this.initColor,
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                $(el).css('border-color', '#' + hex);
                if (!bySetColor)
                    $(el).val(hex);
                if (!bySetColor) {
                    _this.app.workspace.setColor(rgb, parseFloat(_this.bgOpacityEl.val()));
                }
            }
        }).on('change', function (e) {
            _this.colorPicker.colpickSetColor($(e.target).val());
            _this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()), parseFloat(_this.bgOpacityEl.val()));
        });
        this.app.workspace.setColor(this.initColor, parseFloat(this.bgOpacityEl.val()));

        this.textColorPicker = this.fontColorEl.colpick({
            layout: 'hex',
            submit: 0,
            color: this.initTextColor,
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                $(el).css('border-color', '#' + hex);
                if (!bySetColor)
                    $(el).val(hex);
                if (!bySetColor) {
                    //this.app.workspace.setColor(rgb);
                    _this.app.workspace.setFont({
                        color: rgb,
                        fontFamily: _this.fontFamilyEl.val(),
                        size: parseFloat(_this.fontSizeEl.val())
                    });
                }
            }
        }).on('change', function (e) {
            _this.textColorPicker.colpickSetColor($(e.target).val());

            //this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()));
            _this.app.workspace.setFont({
                color: $.colpick.hexToRgb($(e.target).val()),
                fontFamily: _this.fontFamilyEl.val(),
                size: parseFloat(_this.fontSizeEl.val())
            });
        });
        this.app.workspace.setFont({
            color: this.initTextColor,
            fontFamily: this.fontFamily[0],
            size: this.initFontSize
        });

        this.opacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 1,
            slide: function (event, ui) {
                _this.opacityEl.val(ui.value).change();
            }
        });

        this.bgOpacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 1,
            slide: function (event, ui) {
                _this.bgOpacityEl.val(ui.value).change();
            }
        });

        this.ctx = this.canvas.get(0).getContext('2d');

        //init coordinates
        this.point1.css({ top: '100px', left: '100px' });
        this.point2.css({ top: '50px', left: '50px' });

        var options = {
            containment: 'parent',
            drag: function (event, ui) {
                _this.renderWrap(_this.ctx);
            },
            stop: function (event, ui) {
                _this.app.workspace.setBezier(_this.renderWrap(_this.ctx));
            }
        };

        this.point1.draggable(options);

        this.point2.draggable(options);

        this.opacityEl.on('change', function (e) {
            _this.opacitySliderEl.slider('value', $(e.target).val());
            _this.app.workspace.setOpacity($(e.target).val());
        });

        this.bgOpacityEl.on('change', function (e) {
            console.log('alhpa');
            _this.bgOpacitySliderEl.slider('value', $(e.target).val());
            _this.app.workspace.setColor($.colpick.hexToRgb(_this.bgPickerEl.val()), parseFloat(_this.bgOpacityEl.val()));
        });

        this.dimensionXEl.on('change', function (event) {
            _this.app.workspace.setDimension('x', parseInt($(event.target).val()));
        });

        this.dimensionYEl.on('change', function (event) {
            _this.app.workspace.setDimension('y', parseInt($(event.target).val()));
        });

        this.workspaceHeightEl.on('change', function (event) {
            _this.app.workspace.setWorkspaceDimension(null, parseInt($(event.target).val()));
        });

        this.workspaceWidthEl.on('change', function (event) {
            _this.app.workspace.setWorkspaceDimension(parseInt($(event.target).val()), null);
        });

        this.rotateXEl.on('change', function (event) {
            _this.rotateXSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.set3DRotate('x', parseInt($(event.target).val()));
        });

        this.rotateYEl.on('change', function (event) {
            _this.rotateYSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.set3DRotate('y', parseInt($(event.target).val()));
        });

        this.rotateZEl.on('change', function (event) {
            _this.rotateZSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.set3DRotate('z', parseInt($(event.target).val()));
        });

        this.skewXEl.on('change', function (event) {
            _this.skewXSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.setSkew('x', parseInt($(event.target).val()));
        });

        this.skewYEl.on('change', function (event) {
            _this.skewYSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.setSkew('y', parseInt($(event.target).val()));
        });

        this.idEl.on('change', function (event) {
            _this.app.workspace.setIdEl($(event.target).val().toString());
        });

        this.idEl.on('keyup', function (event) {
            if (event.which == 13) {
                $(event.target).trigger('change');
            }
        });

        this.transformOriginVisibleEl.on('change', function (event) {
            console.log($(event.target).is(':checked'));
            if ($(event.target).is(':checked')) {
                _this.isOriginVisible = true;
            } else {
                _this.isOriginVisible = false;
            }
            _this.app.workspace.setOriginVisible();
        });

        this.transformOriginXEl.on('change', function (event) {
            _this.app.workspace.setTransformOrigin('x', $(event.target).val());
        });

        this.transformOriginYEl.on('change', function (event) {
            _this.app.workspace.setTransformOrigin('y', $(event.target).val());
        });

        $(document).on('keyup', '.rotate', function (event) {
            if (event.which == 13) {
                $(event.target).trigger('change');
            }
        });

        $(document).on('change', '.border-radius-input', function (e) {
            _this.app.workspace.setBorderRadius($(e.target).data('type'), parseInt($(e.target).val()));
        });

        $(document).on('keyup', '.border-radius-input', function (e) {
            if (e.which == 13) {
                $(e.target).trigger('change');
            }
        });

        this.fontColorEl.on('change', function (e) {
            _this.app.workspace.setFont({
                color: $.colpick.hexToRgb(_this.fontColorEl.val()),
                fontFamily: _this.fontFamilyEl.val(),
                size: parseFloat(_this.fontSizeEl.val())
            });
        });

        this.fontSizeEl.on('change', function (e) {
            _this.app.workspace.setFont({
                color: $.colpick.hexToRgb(_this.fontColorEl.val()),
                fontFamily: _this.fontFamilyEl.val(),
                size: parseFloat(_this.fontSizeEl.val())
            });
        });

        this.fontFamilyEl.on('change', function (e) {
            _this.app.workspace.setFont({
                color: $.colpick.hexToRgb(_this.fontColorEl.val()),
                fontFamily: _this.fontFamilyEl.val(),
                size: parseFloat(_this.fontSizeEl.val())
            }, false);
        });

        this.selectToolEl.on('click', function (event) {
            _this._mode = 0 /* SELECT */;
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            _this.app.workspace.onChangeMode();
        });

        this.createDivToolEl.on('click', function (event) {
            _this._mode = 1 /* CREATE_DIV */;
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            _this.app.workspace.onChangeMode();
        });

        this.insertImageEl.on('click', function (event) {
            $('.workspace-wrapper').removeClass('text-mode');
            if ($(event.target).closest('a').hasClass('active')) {
                $(event.target).closest('a').removeClass('active');
                _this.selectToolEl.trigger('click');
            } else {
                _this._mode = 2 /* IMAGE */;
                $('.tool-btn').removeClass('active');
                $(event.target).closest('a').addClass('active');
            }
            _this.app.workspace.onChangeMode();
        });

        this.insertTextEl.on('click', function (event) {
            _this._mode = 3 /* TEXT */;
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            _this.app.workspace.onChangeMode();
        });

        this.generateCodeEl.on('click', function (event) {
            var generator = new GenerateCode(_this.app, _this.app.timeline.layers);
            _this.app.workspace.insertMode(false);
            generator.generate();
        });

        $(document).ready(function () {
            _this.selectToolEl.trigger('click');
            _this.ctx = _this.canvas.get(0).getContext('2d');
            _this.renderWrap(_this.ctx);
            _this.controlPanelEl.perfectScrollbar();
            _this.app.workspace.setBezier(_this.renderWrap(_this.ctx));

            $('.rotate-slider').slider({
                min: -180,
                max: 180,
                step: 1,
                value: 0,
                slide: function (event, ui) {
                    $('input#' + $(event.target).attr('id')).val(ui.value).change();
                }
            });

            $('.rotate').val('0');

            $('.skew-slider').slider({
                min: -90,
                max: 90,
                step: 1,
                value: 0,
                slide: function (event, ui) {
                    $('input#' + $(event.target).attr('id')).val(ui.value).change();
                }
            });

            $('.skew').val('0');
        });
    }
    ControlPanel.prototype.updateDimensions = function (d) {
        this.dimensionXEl.val(d.width ? d.width.toString() : null);
        this.dimensionYEl.val(d.height ? d.height.toString() : null);
    };

    ControlPanel.prototype.updateOpacity = function (opacity) {
        this.opacitySliderEl.slider('option', 'value', Number(opacity));
        this.opacityEl.val(opacity.toString());
    };

    ControlPanel.prototype.updateColor = function (color, alpha) {
        this.colorPicker.colpickSetColor(color, false);
        this.bgPickerEl.val($.colpick.rgbToHex(color));
        this.bgOpacityEl.val(alpha.toFixed(2).toString());
        this.bgOpacitySliderEl.slider('option', 'value', Number(alpha));
    };

    ControlPanel.prototype.updateBorderRadius = function (bradius) {
        this.borderRadiusTLEl.val(bradius[0].toString());
        this.borderRadiusTREl.val(bradius[1].toString());
        this.borderRadiusBLEl.val(bradius[3].toString());
        this.borderRadiusBREl.val(bradius[2].toString());
    };

    ControlPanel.prototype.updateFont = function (color, size, family) {
        this.textColorPicker.colpickSetColor(color, false);
        this.fontColorEl.val($.colpick.rgbToHex(color));
        this.fontSizeEl.val(size.toString());
        this.fontFamilyEl.val(family);
    };

    ControlPanel.prototype.setHeight = function () {
        this.containerEl.css('height', ($(window).height() - this.app.timelineEl.height()) + 'px');
    };

    ControlPanel.prototype.renderWrap = function (ctx) {
        var p1 = this.point1.position(), p2 = this.point2.position();
        return this.renderLines(ctx, {
            x: p1.left,
            y: p1.top
        }, {
            x: p2.left,
            y: p2.top
        });
    };

    ControlPanel.prototype.renderLines = function (ctx, p1, p2) {
        ctx.clearRect(0, 0, 200, 200);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#333";
        ctx.moveTo(0, 200);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, 200, 0);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.moveTo(0, 200);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        ctx.moveTo(200, 0);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();

        //compute
        var fn = {
            p0: Number(((p1.x) / 200).toFixed(2)),
            p1: Number((1 - (p1.y) / 200).toFixed(2)),
            p2: Number(((p2.x) / 200).toFixed(2)),
            p3: Number((1 - (p2.y) / 200).toFixed(2))
        };

        $('#p0').html(fn.p0.toString());
        $('#p1').html(fn.p1.toString());
        $('#p2').html(fn.p2.toString());
        $('#p3').html(fn.p3.toString());

        return fn;
    };

    ControlPanel.prototype.updateBezierCurve = function (fn) {
        this.point1.css({
            'left': fn.p0 * 200,
            'top': (1 - fn.p1) * 200
        });

        this.point2.css({
            'left': fn.p2 * 200,
            'top': (1 - fn.p3) * 200
        });

        this.renderWrap(this.ctx);
    };

    ControlPanel.prototype.updateIdEl = function (id) {
        this.idEl.val(id);
    };

    ControlPanel.prototype.update3DRotate = function (rotate) {
        if (rotate.x != null) {
            this.rotateXSliderEl.slider('option', 'value', Number(rotate.x));
            this.rotateXEl.val(rotate.x.toString());
        }
        if (rotate.y != null) {
            this.rotateYSliderEl.slider('option', 'value', Number(rotate.y));
            this.rotateYEl.val(rotate.y.toString());
        }
        if (rotate.z != null) {
            this.rotateZSliderEl.slider('option', 'value', Number(rotate.z));
            this.rotateZEl.val(rotate.z.toString());
        }
    };

    ControlPanel.prototype.updateSkew = function (skew) {
        if (skew.x != null) {
            this.skewXSliderEl.slider('option', 'value', Number(skew.x));
            this.skewXEl.val(skew.x.toString());
        }
        if (skew.y != null) {
            this.skewYSliderEl.slider('option', 'value', Number(skew.y));
            this.skewYEl.val(skew.y.toString());
        }
    };

    ControlPanel.prototype.updateTransformOrigin = function (top, left) {
        this.transformOriginXEl.val(top.toString());
        this.transformOriginYEl.val(left.toString());
    };

    Object.defineProperty(ControlPanel.prototype, "Mode", {
        /*get Mode (){
        if (this.selectToolEl.hasClass('active')) {
        return Mode.SELECT;
        } else if (this.createDivToolEl.hasClass('active')) {
        return Mode.CREATE_DIV;
        } else if (this.insertImageEl.hasClass('active')) {
        return Mode.IMAGE;
        } else if (this.insertTextEl.hasClass('active')) {
        return Mode.TEXT;
        } else {
        return null;
        }
        }*/
        get: function () {
            return this._mode;
        },
        set: function (mode) {
            this._mode = mode;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(ControlPanel.prototype, "originMode", {
        get: function () {
            if (this.isOriginVisible == true) {
                return true;
            } else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    return ControlPanel;
})();
///<reference path="../assets/jquery/jquery.d.ts" />
///<reference path="../assets/jqueryui/jqueryui.d.ts" />
///<reference path="../assets/bezier-easing/index.d.ts" />
///<reference path="../assets/tooltipster/jquery.tooltipster.d.ts" />
///<reference path="Timeline.ts" />
///<reference path="Workspace.ts" />
///<reference path="ControlPanel.ts" />
var Application = (function () {
    function Application() {
        this.timelineEl = $('<div>').attr('id', 'timeline');
        this.workspaceWrapperEl = $('<div>').addClass('workspace-wrapper');
        this.workspaceEl = $('<div>').attr('id', 'workspace');
        this.topContainerEl = $('<div>').attr('id', 'top-container');
        console.log('Start Application');
        this.timeline = new Timeline(this, this.timelineEl);
        this.workspace = new Workspace(this, this.workspaceEl, this.workspaceWrapperEl);
        this.controlPanel = new ControlPanel(this, this.topContainerEl);

        $('body').append(this.topContainerEl);
        $('body').append(this.timelineEl);

        this.controlPanel.setHeight();

        this.topContainerEl.append(this.workspaceWrapperEl.append(this.workspaceEl));

        var pole = new Array();
        pole[0] = ['ahoj'];
        pole[3] = ['zdar', 'hoy'];

        //pole[0].push('jo');
        pole[2] = ['nove'].concat(pole[2]);
    }
    return Application;
})();

$(document).ready(function () {
    console.log('DOM Loaded');
    new Application();
    $('.tooltip').tooltipster({ position: 'right' });
    $('.workspace-wrapper').perfectScrollbar({ includePadding: true });
});
var GenerateCode = (function () {
    function GenerateCode(app, l) {
        var _this = this;
        this.dialogEl = $('<div>').attr('id', 'dialog').html('<p></p>').attr('title', 'Výsledný kód animace');
        this.codeWrapperEl = $('<div>').attr('id', 'code');
        this.arrayMax = Function.prototype.apply.bind(Math.max, null);
        this.arrayMin = Function.prototype.apply.bind(Math.min, null);
        this.app = app;
        this.layers = l;

        $('body').find(this.dialogEl).remove();
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            autoOpen: false,
            draggable: false,
            height: 600,
            width: 900,
            resizable: false,
            modal: true,
            closeOnEscape: true,
            close: function (event, ui) {
                _this.dialogEl.remove();
            }
        });
    }
    GenerateCode.prototype.generate = function () {
        var _this = this;
        console.log('generate code');
        this.dialogEl.dialog('open');

        var html = '<!DOCTYPE html>\n<html lang="cs">\n<head>\n  <meta charset="UTF-8">\n  <title></title>\n';
        html += '  <style>\n';
        html += this.generateCss();
        html += '  </style>\n</head>\n';
        html += '<body>\n';
        html += this.generateObjects();
        html += '\n</body>\n</html>';
        console.log(html);

        html = html.replace(/[<>]/g, function (m) {
            return { '<': '&lt;', '>': '&gt;' }[m];
        });
        var pre = $('<pre>').addClass('prettyprint').attr('id', 'code');
        this.dialogEl.append(pre.html(html));

        prettyPrint();

        $(pre).on('dblclick', function () {
            _this.selectText('code');
        });
    };

    GenerateCode.prototype.generateCss = function () {
        var css = '';
        css += this.gCss({
            'name': '#workspace',
            'width': this.app.workspace.workspaceSize.width + 'px',
            'height': this.app.workspace.workspaceSize.height + 'px',
            'border': '1px dotted #ededed',
            'overflow': 'hidden',
            'position': 'relative',
            'margin': '0 auto'
        });

        css += this.gCss({
            'name': '.square',
            'overflow': 'hidden'
        });

        css += this.objectCss();

        return css;
    };

    GenerateCode.prototype.generateObjectsTmp = function () {
        var shapes = $('#workspace').clone();
        shapes.find('.shape-helper').remove();
        shapes.find('.shape').removeAttr('style');
        shapes.removeAttr('style');

        var markup = '  <div id="workspace">\n';
        shapes.find('.shape').each(function (index) {
            markup += '    ' + ($(this).addClass('object' + $(this).data('id')).prop('outerHTML')) + '\n';
        });
        markup += '  </div>';
        return markup;
    };

    /*generateObjects() {
    var markup: string = '  <div id="workspace">\n';
    this.layers.forEach((layer: Layer, index: number) => {
    markup += layer.getObject();
    });
    markup += '  </div>';
    return markup;
    }*/
    GenerateCode.prototype.generateObjects = function () {
        var _this = this;
        var markup = '  <div id="workspace">\n';
        this.layers.forEach(function (layer, index) {
            if (layer.nesting == 0) {
                //if layer is root
                markup += layer.getObject();
                markup += _this.getChildsObject(layer.id);
                if (layer instanceof RectangleLayer)
                    markup += '    </div>\n';
                else if (layer instanceof TextLayer)
                    markup += '</span>\n';
            }
        });
        markup += '  </div>';
        return markup;
    };
    GenerateCode.prototype.getChildsObject = function (parent) {
        var _this = this;
        var value = '';
        this.layers.forEach(function (layer, index) {
            if (layer.parent == parent) {
                value += layer.getObject();

                if (layer instanceof RectangleLayer) {
                    value += _this.getChildsObject(layer.id);
                    value += (Array(layer.nesting + 1).join('  ') + '    </div>\n');
                } else if (layer instanceof TextLayer) {
                    value += '</span>\n';
                } else if (layer instanceof ImageLayer) {
                }
            }
        });

        return value;
    };

    GenerateCode.prototype.objectCss = function () {
        var _this = this;
        var css = '';
        var keyframesCss = '';

        //if infinite animation, find absolute maximum
        if (this.app.timeline.repeat) {
            var absoluteMax = 0;
            this.layers.forEach(function (item, index) {
                var tmp = _this.arrayMax(item.timestamps);
                if (tmp > absoluteMax)
                    absoluteMax = tmp;
            });
        }

        this.layers.forEach(function (item, index) {
            var percents = new Array();
            var min = _this.arrayMin(item.timestamps);
            var max = _this.arrayMax(item.timestamps);
            if (_this.app.timeline.repeat) {
                var duration = absoluteMax;
            } else {
                var duration = max - min;
            }

            var nameElement = 'object' + item.id;

            //1. init style for object
            var cssObject = item.getInitStyles(nameElement);

            if (_this.app.timeline.repeat) {
                cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
                cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
            } else {
                if (duration != 0) {
                    cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + (item.timestamps[0] / 1000) + 's forwards';
                    cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + (item.timestamps[0] / 1000) + 's forwards';
                }
            }

            css += _this.gCss(cssObject);

            //2. if keyframes > 1, generate it
            if (item.timestamps.length > 1) {
                cssObject = {};
                cssObject['name'] = nameElement;

                item.timestamps.forEach(function (timestamp, i) {
                    var keyframe = item.getKeyframeByTimestamp(timestamp);
                    if (_this.app.timeline.repeat) {
                        var part = ((keyframe.timestamp) / duration);
                    } else {
                        var part = ((keyframe.timestamp - min) / duration);
                    }
                    var percent = (part * 100).toString() + '%';

                    //if infinite animation and not 100% append it to last keyframe
                    if (_this.app.timeline.repeat && i == item.timestamps.length - 1 && part != 1) {
                        percent += ' ,100%';
                    }

                    //if infinite animation and set delay, append delay to first keyframe
                    if (_this.app.timeline.repeat && i == 0 && part != 0) {
                        percent += ', 0%';
                    }
                    percents.push(percent);
                    cssObject[percent] = item.getKeyframeStyle(timestamp);

                    if (i != item.timestamps.length - 1) {
                        cssObject[percent]['-webkit-animation-timing-function'] = 'cubic-bezier(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')';
                        cssObject[percent]['animation-timing-function'] = 'cubic-bezier(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')';
                    }
                });

                keyframesCss += _this.gKeyframes(cssObject);
            }
        });

        return (keyframesCss + css);
    };

    GenerateCode.prototype.gKeyframes = function (frameData) {
        if (frameData.length) {
            for (var i = 0; i < frameData.length; i++) {
                var frame = frameData[i];
                return this.gKeyframe(frame);
            }
        } else {
            return this.gKeyframe(frameData);
        }
    };

    GenerateCode.prototype.gCss = function (cssData) {
        var elName = cssData.name || "";
        var css = "    " + elName + " {\n";

        for (var key in cssData) {
            if (key !== "name") {
                css += "      " + key + ": " + cssData[key] + ";\n";
            }
        }

        css += "    }\n";

        return css;
    };

    GenerateCode.prototype.gKeyframe = function (frameData) {
        var frameName = frameData.name || "";
        var css = '';
        var prefix = ['-webkit-keyframes', 'keyframes'];
        $.each(prefix, function (index, value) {
            css += "    @" + value + " " + frameName + " {\n";

            for (var key in frameData) {
                if (key !== "name") {
                    css += "      " + key + " {\n";

                    for (var property in frameData[key]) {
                        css += "        " + property + ":" + frameData[key][property] + ";\n";
                    }

                    css += "      }\n";
                }
            }

            css += "    }\n";
        });

        return css;
    };

    GenerateCode.prototype.selectText = function (element) {
        var doc = document;
        var text = doc.getElementById(element);
        var range, selection;

        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    return GenerateCode;
})();
var Mode;
(function (Mode) {
    Mode[Mode["SELECT"] = 0] = "SELECT";
    Mode[Mode["CREATE_DIV"] = 1] = "CREATE_DIV";
    Mode[Mode["IMAGE"] = 2] = "IMAGE";
    Mode[Mode["TEXT"] = 3] = "TEXT";
})(Mode || (Mode = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ImageLayer = (function (_super) {
    __extends(ImageLayer, _super);
    function ImageLayer(name, fn, shape) {
        if (typeof shape === "undefined") { shape = null; }
        _super.call(this, name, fn, shape);
    }
    ImageLayer.prototype.transform = function (position, shape, helper, currentLayerId, controlPanel) {
        _super.prototype.transform.call(this, position, shape, helper, currentLayerId, controlPanel);
    };

    ImageLayer.prototype.jsem = function () {
        console.log('jsem obrázek');
    };

    ImageLayer.prototype.getInitStyles = function (nameElement) {
        var cssObject = _super.prototype.getInitStyles.call(this, nameElement);

        return cssObject;
    };

    ImageLayer.prototype.getKeyframeStyle = function (timestamp) {
        return _super.prototype.getKeyframeStyle.call(this, timestamp);
    };

    ImageLayer.prototype.getObject = function () {
        var g = this.globalShape;
        var object = Array(this.nesting + 1).join('  ') + '    <img class="image object' + this.id + '" src="' + g.getSrc() + '">\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <img id="' + this.idEl + '" class="image object' + this.id + '" src="' + g.getSrc() + '">\n';
        }
        return object;
    };

    ImageLayer.prototype.renderShape = function (container, position, currentScope) {
        var shape = $('<img>').addClass('shape image');

        var imgShape = this.globalShape;
        shape.attr('src', imgShape.getSrc());

        shape = _super.prototype.renderShapeCore.call(this, shape, container, position, currentScope);

        return shape;
    };
    return ImageLayer;
})(Layer);
var Img = (function (_super) {
    __extends(Img, _super);
    function Img(params, src) {
        _super.call(this, params);
        this._src = src;
    }
    Img.prototype.getSrc = function () {
        return this._src;
    };
    return Img;
})(Shape);
var Keyframe = (function () {
    function Keyframe(shape, timestamp, timing_function) {
        this._shape = shape;
        this._timestamp = timestamp;
        this._timing_function = timing_function;
    }
    Object.defineProperty(Keyframe.prototype, "shape", {
        /*get id() {
        return this._id;
        }
        
        set id(id: number) {
        this._id = id;
        }*/
        get: function () {
            return this._shape;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Keyframe.prototype, "timestamp", {
        get: function () {
            return this._timestamp;
        },
        set: function (ms) {
            this._timestamp = ms;
        },
        enumerable: true,
        configurable: true
    });


    Object.defineProperty(Keyframe.prototype, "timing_function", {
        get: function () {
            return this._timing_function;
        },
        set: function (val) {
            this._timing_function = val;
        },
        enumerable: true,
        configurable: true
    });

    return Keyframe;
})();
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(params) {
        _super.call(this, params);
    }
    return Rectangle;
})(Shape);
var RectangleLayer = (function (_super) {
    __extends(RectangleLayer, _super);
    function RectangleLayer(name, fn, shape) {
        if (typeof shape === "undefined") { shape = null; }
        _super.call(this, name, fn, shape);
    }
    RectangleLayer.prototype.jsem = function () {
        console.log('jsem cverec');
    };

    RectangleLayer.prototype.transform = function (position, shape, helper, currentLayerId, controlPanel) {
        _super.prototype.transform.call(this, position, shape, helper, currentLayerId, controlPanel);
    };

    RectangleLayer.prototype.getInitStyles = function (nameElement) {
        return _super.prototype.getInitStyles.call(this, nameElement);
    };

    RectangleLayer.prototype.getKeyframeStyle = function (timestamp) {
        return _super.prototype.getKeyframeStyle.call(this, timestamp);
    };

    /*getObject(): string {
    var object: string = '    <div class="square object' + this.id + '">\n';
    if (this.idEl != null) {
    object = '    <div id="' + this.idEl + '" class="square object' + this.id + '">\n';
    }
    object += this.getChildsObject(this.id, object);
    object += '    </div>\n';
    return object;
    }*/
    RectangleLayer.prototype.getObject = function () {
        var object = Array(this.nesting + 1).join('  ') + '    <div class="square object' + this.id + '">\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <div id="' + this.idEl + '" class="square object' + this.id + '">\n';
        }
        return object;
    };

    RectangleLayer.prototype.renderShape = function (container, position, currentScope) {
        var shape = $('<div>').addClass('shape square');
        shape = _super.prototype.renderShapeCore.call(this, shape, container, position, currentScope);

        return shape;
    };
    return RectangleLayer;
})(Layer);
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(params, content, color, size, family) {
        _super.call(this, params);
        this._content = content;
        this.color = color;
        this.size = size;
        this.family = family;
    }
    TextField.prototype.getContent = function () {
        return this._content;
    };

    TextField.prototype.getColor = function () {
        return this.color;
    };

    TextField.prototype.getSize = function () {
        return this.size;
    };

    TextField.prototype.getFamily = function () {
        return this.family;
    };

    TextField.prototype.setFont = function (p) {
        this.color = p.color;
        this.size = p.size;
    };

    TextField.prototype.setContent = function (text) {
        this._content = text;
    };

    TextField.prototype.setFamily = function (family) {
        this.family = family;
    };
    return TextField;
})(Shape);
var TextLayer = (function (_super) {
    __extends(TextLayer, _super);
    function TextLayer(name, fn, shape) {
        if (typeof shape === "undefined") { shape = null; }
        _super.call(this, name, fn, shape);
    }
    TextLayer.prototype.transform = function (position, shape, helper, currentLayerId, controlPanel) {
        _super.prototype.transform.call(this, position, shape, helper, currentLayerId, controlPanel);

        //find interval between position
        var rangeData = this.getRange(position);
        var left = rangeData.left;
        var right = rangeData.right;
        var rng = rangeData.rng;

        var fontParams = null;
        var g = this.globalShape;

        if (left != null) {
            fontParams = {
                color: rng['l'].shape.getColor(),
                size: rng['l'].shape.getSize(),
                fontFamily: g.getFamily()
            };
        }
        if (right != null) {
            fontParams = {
                color: rng['r'].shape.getColor(),
                size: rng['r'].shape.getSize(),
                fontFamily: g.getFamily()
            };
        }

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p = (position - left) / (right - left);

            fontParams = {
                color: {
                    r: Math.round(this.computeAttr(rng['l'].shape.getColor().r, rng['r'].shape.getColor().r, bezier(p))),
                    g: Math.round(this.computeAttr(rng['l'].shape.getColor().g, rng['r'].shape.getColor().g, bezier(p))),
                    b: Math.round(this.computeAttr(rng['l'].shape.getColor().b, rng['r'].shape.getColor().b, bezier(p)))
                },
                size: this.computeAttr(rng['l'].shape.getSize(), rng['r'].shape.getSize(), bezier(p)),
                fontFamily: g.getFamily()
            };
        }

        shape.css({
            'color': 'rgb(' + fontParams.color.r + ',' + fontParams.color.g + ',' + fontParams.color.b + ')',
            'font-size': fontParams.size,
            'font-family': fontParams.fontFamily
        });

        if (currentLayerId == this.id) {
            controlPanel.updateFont(fontParams.color, fontParams.size, fontParams.fontFamily);
        }
    };

    TextLayer.prototype.jsem = function () {
        console.log('jsem text');
    };

    TextLayer.prototype.getInitStyles = function (nameElement) {
        var shape = (this.getKeyframeByTimestamp(this.timestamps[0])).shape;

        var cssObject = _super.prototype.getInitStyles.call(this, nameElement);
        cssObject['display'] = 'inline';
        cssObject['font-size'] = shape.getSize() + 'px';
        cssObject['font-family'] = '"' + shape.getFamily() + '"';
        cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    };

    TextLayer.prototype.getKeyframeStyle = function (timestamp) {
        var shape = (this.getKeyframeByTimestamp(timestamp)).shape;

        var cssObject = _super.prototype.getKeyframeStyle.call(this, timestamp);

        //check if parameters is changing
        var initShape = (this.getKeyframeByTimestamp(this.timestamps[0])).shape;
        var change = {
            size: false,
            color: false
        };
        this.getAllKeyframes().forEach(function (k, i) {
            var s = k.shape;
            if (initShape.getSize() != s.getSize())
                change.size = true;
            if (initShape.color.r != s.color.r)
                change.color = true;
            if (initShape.color.g != s.color.g)
                change.color = true;
            if (initShape.color.b != s.color.b)
                change.color = true;
        });
        if (change.size)
            cssObject['font-size'] = shape.getSize() + 'px';
        if (change.color)
            cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    };

    TextLayer.prototype.getObject = function () {
        var g = this.globalShape;
        var object = Array(this.nesting + 1).join('  ') + '    <span class="text object' + this.id + '">' + g.getContent();
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <span id="' + this.idEl + '" class="text object' + this.id + '">' + g.getContent();
        }
        return object;
    };

    TextLayer.prototype.renderShape = function (container, position, currentScope) {
        var _this = this;
        var layer = this.globalShape;
        var shape = $('<span>').addClass('shape froala text').html(layer.getContent());

        var globalTextShape = this.globalShape;
        var keyframe = this.getKeyframeByTimestamp(position);

        //if no keyframe, get init keyframe
        if (keyframe == null) {
            keyframe = this.getKeyframe(0);
        }
        var textShape = keyframe.shape;
        shape.css({
            'color': 'rgba(' + textShape.getColor().r + ',' + textShape.getColor().g + ',' + textShape.getColor().b + ')',
            'font-size': textShape.getSize(),
            'font-family': globalTextShape.getFamily()
        });
        shape.froala({
            inlineMode: true,
            paragraphy: false,
            allowedTags: [],
            buttons: [],
            placeholder: 'Zadejte text...'
        });

        shape.on('editable.contentChanged', function (e, editor) {
            var globalTextShape = _this.globalShape;
            globalTextShape.setContent(editor.trackHTML);
        });

        shape = _super.prototype.renderShapeCore.call(this, shape, container, position, currentScope);

        return shape;
    };
    return TextLayer;
})(Layer);
//# sourceMappingURL=app.js.map
