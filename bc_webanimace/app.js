var Animations = (function () {
    function Animations() {
    }
    Animations.animations = [
        {
            name: 'bliknutí',
            keyframes: [
                {
                    timestamp: [0, 500, 1000],
                    parameters: {
                        opacity: 1
                    }
                },
                {
                    timestamp: [250, 750],
                    parameters: {
                        opacity: 0
                    }
                }
            ]
        },
        {
            name: 'skákání',
            keyframes: [
                {
                    timestamp: [0, 400, 1060, 1600, 2000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1.000 },
                    parameters: {
                        translatey: 0,
                        originx: 50,
                        originy: 100
                    }
                },
                {
                    timestamp: [800, 860],
                    bezier: { p0: 0.755, p1: 0.050, p2: 0.855, p3: 0.060 },
                    parameters: {
                        translatey: -30,
                        originx: 50,
                        originy: 100
                    }
                },
                {
                    timestamp: [1400],
                    bezier: { p0: 0.755, p1: 0.050, p2: 0.855, p3: 0.060 },
                    parameters: {
                        translatey: -15,
                        originx: 50,
                        originy: 100
                    }
                },
                {
                    timestamp: [1800],
                    parameters: {
                        translatey: -4,
                        originx: 50,
                        originy: 100
                    }
                }
            ]
        },
        {
            name: 'puls',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        scale: 1
                    }
                },
                {
                    timestamp: [500],
                    parameters: {
                        scale: 1.05
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        scale: 1
                    }
                }
            ]
        },
        {
            name: 'chvění',
            keyframes: [
                {
                    timestamp: [0, 1000],
                    parameters: {
                        translatex: 0
                    }
                },
                {
                    timestamp: [100, 300, 500, 700, 900],
                    parameters: {
                        translatex: -10
                    }
                },
                {
                    timestamp: [200, 400, 600, 800],
                    parameters: {
                        translatex: 10
                    }
                }
            ]
        },
        {
            name: 'houpání',
            keyframes: [
                {
                    timestamp: [200],
                    parameters: {
                        rotatez: 15,
                        originx: 50,
                        originy: 0
                    }
                },
                {
                    timestamp: [400],
                    parameters: {
                        rotatez: -10,
                        originx: 50,
                        originy: 0
                    }
                },
                {
                    timestamp: [600],
                    parameters: {
                        rotatez: 5,
                        originx: 50,
                        originy: 0
                    }
                },
                {
                    timestamp: [800],
                    parameters: {
                        rotatez: -5,
                        originx: 50,
                        originy: 0
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        rotatez: 0,
                        originx: 50,
                        originy: 0
                    }
                }
            ]
        },
        {
            name: 'tadáá',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        scale: 1
                    }
                },
                {
                    timestamp: [100, 200],
                    parameters: {
                        scale: 0.9,
                        rotatez: -3
                    }
                },
                {
                    timestamp: [300, 500, 700, 900],
                    parameters: {
                        scale: 1.1,
                        rotatez: 3
                    }
                },
                {
                    timestamp: [400, 600, 800],
                    parameters: {
                        scale: 1.1,
                        rotatez: -3
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        scale: 1
                    }
                }
            ]
        },
        {
            name: 'spadnutí',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.42, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        originx: 0,
                        originy: 0
                    }
                },
                {
                    timestamp: [600, 1800],
                    bezier: { p0: 0.42, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        originx: 0,
                        originy: 0,
                        rotatez: 80
                    }
                },
                {
                    timestamp: [1200, 2400],
                    bezier: { p0: 0.42, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        originx: 0,
                        originy: 0,
                        rotatez: 60,
                        opacity: 1
                    }
                },
                {
                    timestamp: [3000],
                    parameters: {
                        rotatez: -3,
                        opacity: 0,
                        translatey: 700
                    }
                }
            ]
        },
        {
            name: 'otočení a zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        opacity: 1,
                        perspective: 400
                    }
                },
                {
                    timestamp: [300],
                    parameters: {
                        opacity: 1,
                        rotatey: -15,
                        perspective: 400
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 0,
                        rotatey: 90,
                        perspective: 400
                    }
                }
            ]
        },
        {
            name: 'otočení a zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        rotatex: 90,
                        perspective: 400,
                        opacity: 0
                    }
                },
                {
                    timestamp: [400],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        rotatex: -40,
                        perspective: 400
                    }
                },
                {
                    timestamp: [600],
                    parameters: {
                        opacity: 1,
                        rotatex: 20,
                        perspective: 400
                    }
                },
                {
                    timestamp: [800],
                    parameters: {
                        opacity: 1,
                        rotatex: -10,
                        perspective: 400
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 1,
                        perspective: 400,
                        rotatex: 0
                    }
                }
            ]
        },
        {
            name: 'zoom zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        opacity: 1,
                        scale: 1,
                        translatey: 0
                    }
                }, {
                    timestamp: [400],
                    bezier: { p0: 0.55, p1: 0.055, p2: 0.675, p3: 0.190 },
                    parameters: {
                        opacity: 1,
                        scale: 0.475,
                        translatey: -60
                    }
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.175, p1: 0.885, p2: 0.320, p3: 1 },
                    parameters: {
                        scale: 0.1,
                        translatey: 200,
                        originx: 50,
                        originy: 100,
                        opacity: 0
                    }
                }
            ]
        },
        {
            name: 'kolísání',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        translatex: 0,
                        rotatez: 0
                    }
                }, {
                    timestamp: [300],
                    parameters: {
                        translatex: -50,
                        rotatez: -5
                    }
                },
                {
                    timestamp: [600],
                    parameters: {
                        translatex: 40,
                        rotatez: 3
                    }
                },
                {
                    timestamp: [900],
                    parameters: {
                        translatex: -30,
                        rotatez: -3
                    }
                },
                {
                    timestamp: [1200],
                    parameters: {
                        translatex: 20,
                        rotatez: 2
                    }
                },
                {
                    timestamp: [1500],
                    parameters: {
                        translatex: -10,
                        rotatez: -1
                    }
                },
                {
                    timestamp: [2000],
                    parameters: {
                        translatex: 0,
                        rotatez: 0
                    }
                }
            ]
        },
        {
            name: 'poskočení a zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 0.3,
                        opacity: 0
                    }
                }, {
                    timestamp: [200],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 1.1,
                        opacity: 1
                    }
                },
                {
                    timestamp: [400],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 0.9,
                        opacity: 1
                    }
                },
                {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 1.03,
                        opacity: 1
                    }
                },
                {
                    timestamp: [800],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 0.97,
                        opacity: 1
                    }
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 1,
                        opacity: 1
                    }
                }
            ]
        },
        {
            name: 'poskočení a zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -3000,
                        opacity: 0
                    }
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 25,
                        opacity: 1
                    }
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -10,
                        opacity: 1
                    }
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -5,
                        opacity: 1
                    }
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 0,
                        opacity: 1
                    }
                }
            ]
        },
        {
            name: 'poskočení a zobrazení zdola',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 1000,
                        opacity: 0
                    }
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -20,
                        opacity: 1
                    }
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 10,
                        opacity: 1
                    }
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -5,
                        opacity: 1
                    }
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 0,
                        opacity: 1
                    }
                }
            ]
        },
        {
            name: 'poskočení a zobrazení zleva',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -1000,
                        opacity: 0
                    }
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 25,
                        opacity: 1
                    }
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -10,
                        opacity: 1
                    }
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 5,
                        opacity: 1
                    }
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 0,
                        opacity: 1
                    }
                }
            ]
        },
        {
            name: 'poskočení a zobrazení zprava',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 1000,
                        opacity: 0
                    }
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -25,
                        opacity: 1
                    }
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 10,
                        opacity: 1
                    }
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -5,
                        opacity: 1
                    }
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 0,
                        opacity: 1
                    }
                }
            ]
        },
        {
            name: 'poskočení a zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        scale: 1,
                        opacity: 1
                    }
                },
                {
                    timestamp: [200],
                    parameters: {
                        scale: 0.9,
                        opacity: 1
                    }
                }, {
                    timestamp: [500, 550],
                    parameters: {
                        scale: 1.1,
                        opacity: 1
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        scale: 0.3,
                        opacity: 0
                    }
                }
            ]
        },
        {
            name: 'otočka',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: -360,
                        translatez: 0,
                        scale: 1
                    }
                },
                {
                    timestamp: [600],
                    bezier: { p0: 0, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: -190,
                        translatez: 150,
                        scale: 1
                    }
                }, {
                    timestamp: [1000],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: -170,
                        translatez: 150,
                        scale: 1
                    }
                },
                {
                    timestamp: [1600],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: 0,
                        translatez: 0,
                        scale: 0.95
                    }
                },
                {
                    timestamp: [2000],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: 0,
                        translatez: 0,
                        scale: 1
                    }
                }
            ]
        },
        {
            name: 'rychlost světla zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 0,
                        translatex: 1000,
                        skewx: -30
                    }
                },
                {
                    timestamp: [600],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 1,
                        skewx: 20,
                        translatex: 15
                    }
                }, {
                    timestamp: [800],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 1,
                        skewx: -10,
                        translatex: 5
                    }
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 1,
                        skewx: 0,
                        translatex: 0
                    }
                }
            ]
        },
        {
            name: 'rychlost světla zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        opacity: 1
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 0,
                        translatex: 500,
                        skewx: 30
                    }
                }
            ]
        },
        {
            name: 'zoom zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.55, p1: 0.055, p2: 0.675, p3: 0.190 },
                    parameters: {
                        opacity: 0,
                        scale: 0.1,
                        translatey: -1000
                    }
                },
                {
                    timestamp: [600],
                    bezier: { p0: 0.175, p1: 0.885, p2: 0.320, p3: 1 },
                    parameters: {
                        opacity: 1,
                        scale: 0.475,
                        translatey: 60
                    }
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 1,
                        scale: 1,
                        translatey: 0
                    }
                }
            ]
        }
    ];
    return Animations;
})();
var Layer = (function () {
    function Layer(name, fn, type, shape) {
        if (typeof shape === "undefined") { shape = null; }
        this._order = 0;
        this._parent = null;
        this._type = null;
        this.nesting = 0;
        this.lastTransformKeyframe = null;
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
        this._type = type;
        this.isVisibleOnWorkspace = true;
        this.isMultipleEdit = false;
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

        //if only one keyframe remain, set it to zero position
        if (this._keyframes.length == 1) {
            this.getKeyframe(0).timestamp = 0;
            this._timestamps[0] = 0;
        }
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

    Object.defineProperty(Layer.prototype, "keyframes", {
        set: function (k) {
            this._keyframes = k;
        },
        enumerable: true,
        configurable: true
    });

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

    Object.defineProperty(Layer.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });

    Layer.prototype.transform = function (position, shape, helper, currentLayerId, app, showHelpers) {
        if (typeof showHelpers === "undefined") { showHelpers = true; }
        //find interval between position
        var rangeData = this.getRange(position);
        var left = rangeData.left;
        var right = rangeData.right;
        var rng = rangeData.rng;

        var params = {
            top: rangeData.params.top,
            left: rangeData.params.left,
            width: rangeData.params.width,
            height: rangeData.params.height,
            background: {
                r: rangeData.params.background.r,
                g: rangeData.params.background.g,
                b: rangeData.params.background.b,
                a: rangeData.params.background.a
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
                z: rangeData.params.rotate.z
            },
            skew: {
                x: rangeData.params.skew.x,
                y: rangeData.params.skew.y
            },
            origin: {
                x: rangeData.params.origin.x,
                y: rangeData.params.origin.y
            },
            zindex: this.globalShape.parameters.zindex,
            relativeSize: {
                width: rangeData.params.relativeSize.width,
                height: rangeData.params.relativeSize.height
            },
            relativePosition: {
                top: rangeData.params.relativePosition.top,
                left: rangeData.params.relativePosition.left
            },
            scale: rangeData.params.scale,
            translate: {
                x: rangeData.params.translate.x,
                y: rangeData.params.translate.y,
                z: rangeData.params.translate.z
            },
            relativeTranslate: {
                x: rangeData.params.relativeTranslate.x,
                y: rangeData.params.relativeTranslate.y
            },
            perspective: rangeData.params.perspective
        };

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p = (position - left) / (right - left);

            var paramsLeft = rng['l'].shape.parameters;
            var paramsRight = rng['r'].shape.parameters;

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
                if (params.perspective == 0) {
                    //fix for Mozilla Firefox
                    shape.css({ 'transform': 'translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                    helper.css({ 'transform': 'translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                } else {
                    shape.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                    helper.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                }
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
                'transform-origin': params.origin.x + '% ' + params.origin.y + '%'
            });

            //fix for mozilla firefox
            if (params.perspective == 0) {
                shape.css({ 'transform': 'translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
            } else {
                shape.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
            }

            if (showHelpers) {
                helper.css({
                    'left': params.relativePosition.left + '%',
                    'top': params.relativePosition.top + '%',
                    'width': params.relativeSize.width + '%',
                    'height': params.relativeSize.height + '%',
                    'z-index': (params.zindex + 1000),
                    'transform-origin': params.origin.x + '% ' + params.origin.y + '%'
                });

                //fix for mozilla firefox
                if (params.perspective == 0) {
                    helper.css({ 'transform': 'translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                } else {
                    helper.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                }

                helper.css("left", "-=1");
                helper.css("top", "-=1");
                helper.css("width", "+=2");
                helper.css("height", "+=2");
            }

            if (this._keyframes.length == 1) {
                var parent = app.timeline.getLayer(this.parent);
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
                'top': params.origin.y + '%'
            });
        }
    };

    Layer.prototype.getShape = function (position) {
        return null;
    };

    Layer.prototype.getParameters = function (position) {
        //find interval between position
        var rangeData = this.getRange(position);
        var left = rangeData.left;
        var right = rangeData.right;
        var rng = rangeData.rng;

        var params = {
            top: rangeData.params.top,
            left: rangeData.params.left,
            width: rangeData.params.width,
            height: rangeData.params.height,
            background: {
                r: rangeData.params.background.r,
                g: rangeData.params.background.g,
                b: rangeData.params.background.b,
                a: rangeData.params.background.a
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
                z: rangeData.params.rotate.z
            },
            skew: {
                x: rangeData.params.skew.x,
                y: rangeData.params.skew.y
            },
            origin: {
                x: rangeData.params.origin.x,
                y: rangeData.params.origin.y
            },
            zindex: this.globalShape.parameters.zindex,
            relativeSize: {
                width: rangeData.params.relativeSize.width,
                height: rangeData.params.relativeSize.height
            },
            relativePosition: {
                top: rangeData.params.relativePosition.top,
                left: rangeData.params.relativePosition.left
            },
            scale: rangeData.params.scale,
            translate: {
                x: rangeData.params.translate.x,
                y: rangeData.params.translate.y,
                z: rangeData.params.translate.z
            },
            relativeTranslate: {
                x: rangeData.params.relativeTranslate.x,
                y: rangeData.params.relativeTranslate.y
            },
            perspective: rangeData.params.perspective
        };

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p = (position - left) / (right - left);

            var paramsLeft = rng['l'].shape.parameters;
            var paramsRight = rng['r'].shape.parameters;

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
    };

    Layer.prototype.isVisible = function (position, timeline) {
        //find interval between position
        var rangeData = this.getRange(position);
        var rng = rangeData.rng;
        if (Object.keys(rng).length == 2) {
            return true;
        } else {
            if (this._keyframes.length == 1) {
                //return true;
                var parent = timeline.getLayer(this.parent);
                if (parent) {
                    return parent.isVisible(position, timeline);
                } else {
                    return true;
                }
            } else {
                return false;
            }
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

        //fix if position == right and left is null
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

    Layer.prototype.getInitStyles = function (nameElement, workspaceSize) {
        var p = (this.getKeyframeByTimestamp(this.timestamps[0])).shape.parameters;
        var cssObject = {
            'name': '.' + nameElement,
            'position': 'absolute',
            'width': p.relativeSize.width + '%',
            'height': p.relativeSize.height + '%',
            'top': p.relativePosition.top + '%',
            'left': p.relativePosition.left + '%',
            'background': 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')',
            'z-index': this.globalShape.parameters.zindex
        };

        if (p.opacity != 1) {
            cssObject['opacity'] = p.opacity;
        }

        if ((p.borderRadius[0] == p.borderRadius[1]) && (p.borderRadius[0] == p.borderRadius[2]) && (p.borderRadius[0] == p.borderRadius[3])) {
            if (p.borderRadius[0] != 0) {
                cssObject['border-radius'] = p.borderRadius[0] + '%';
            }
        } else {
            cssObject['border-top-left-radius'] = p.borderRadius[0] + '%';
            cssObject['border-top-right-radius'] = p.borderRadius[1] + '%';
            cssObject['border-bottom-right-radius'] = p.borderRadius[2] + '%';
            cssObject['border-bottom-left-radius'] = p.borderRadius[3] + '%';
        }

        if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z != 0 || p.skew.x != 0 || p.skew.y != 0 || p.scale != 1 || p.translate.x != 0 || p.translate.y != 0 || p.translate.z != 0 || p.perspective != 0) {
            var t = "";
            if (p.perspective != 0) {
                t += 'perspective(' + p.perspective + 'px) ';
            }

            if (p.translate.x != 0 || p.translate.y != 0 || p.translate.z) {
                t += 'translate3d(' + p.relativeTranslate.x + '%, ' + p.relativeTranslate.y + '%, ' + p.translate.z + 'px) ';
            }

            if (p.scale != 1) {
                t += 'scale(' + p.scale + ') ';
            }

            if (p.rotate.x != 0 || p.rotate.y != 0 || p.rotate.z) {
                t += 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) ';
            }
            if (p.skew.x != 0 || p.skew.y != 0) {
                t += 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg) ';
            }

            cssObject['transform'] = t;
        }

        cssObject['transform-origin'] = p.origin.x + '% ' + p.origin.y + '%';
        cssObject['-webkit-transform-origin'] = p.origin.x + '% ' + p.origin.y + '%';

        return cssObject;
    };

    Layer.prototype.getKeyframeStyle = function (timestamp, workspaceSize) {
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
            scale: false,
            translate: false,
            origin: false,
            perspective: false
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
            if (initP.rotate.x != p.rotate.x || initP.rotate.x != 0)
                change.rotate = true;
            if (initP.rotate.y != p.rotate.y || initP.rotate.y != 0)
                change.rotate = true;
            if (initP.rotate.z != p.rotate.z || initP.rotate.z != 0)
                change.rotate = true;
            if (initP.skew.x != p.skew.x || initP.skew.x != 0)
                change.skew = true;
            if (initP.skew.y != p.skew.y || initP.skew.y != 0)
                change.skew = true;
            if (initP.origin.x != p.origin.x || initP.origin.x != 50)
                change.origin = true;
            if (initP.origin.y != p.origin.y || initP.origin.y != 50)
                change.origin = true;
            if (initP.scale != p.scale || initP.scale != 1)
                change.scale = true;
            if (initP.translate.x != p.translate.x || initP.translate.x != 0)
                change.translate = true;
            if (initP.translate.y != p.translate.y || initP.translate.y != 0)
                change.translate = true;
            if (initP.translate.z != p.translate.z || initP.translate.z != 0)
                change.translate = true;
            if (p.perspective != 0)
                change.perspective = true;
        });

        var p = (this.getKeyframeByTimestamp(timestamp)).shape.parameters;
        var cssObject = {};

        if (change.width)
            cssObject['width'] = p.relativeSize.width + '%';
        if (change.height)
            cssObject['height'] = p.relativeSize.height + '%';
        if (change.top)
            cssObject['top'] = p.relativePosition.top + '%';
        if (change.left)
            cssObject['left'] = p.relativePosition.left + '%';
        if (change.bg)
            cssObject['background'] = 'rgba(' + p.background.r + ',' + p.background.g + ',' + p.background.b + ',' + p.background.a + ')';
        if (change.opacity)
            cssObject['opacity'] = p.opacity;

        if (change.radius) {
            if ((p.borderRadius[0] == p.borderRadius[1]) && (p.borderRadius[0] == p.borderRadius[2]) && (p.borderRadius[0] == p.borderRadius[3])) {
                cssObject['border-radius'] = p.borderRadius[0] + 'px';
            } else {
                cssObject['border-top-left-radius'] = p.borderRadius[0] + '%';
                cssObject['border-top-right-radius'] = p.borderRadius[1] + '%';
                cssObject['border-bottom-right-radius'] = p.borderRadius[2] + '%';
                cssObject['border-bottom-left-radius'] = p.borderRadius[3] + '%';
            }
        }

        if (change.rotate || change.skew || change.scale || change.translate || change.perspective) {
            var t = "";
            if (change.perspective) {
                if (p.perspective != 0) {
                    //fix for mozilla firefox
                    t += 'perspective(' + p.perspective + 'px) ';
                }
            }

            if (change.translate) {
                t += 'translate3d(' + p.relativeTranslate.x + '%, ' + p.relativeTranslate.y + '%, ' + p.translate.z + 'px) ';
            }

            if (change.scale) {
                t += 'scale(' + p.scale + ')';
            }

            if (change.rotate) {
                t += 'rotateX(' + p.rotate.x + 'deg) rotateY(' + p.rotate.y + 'deg) rotateZ(' + p.rotate.z + 'deg) ';
            }
            if (change.skew) {
                t += 'skew(' + p.skew.x + 'deg , ' + p.skew.y + 'deg) ';
            }

            cssObject['transform'] = t;
        }

        if ((change.rotate || change.skew || change.scale || change.translate || change.perspective) && change.origin) {
            if (change.origin)
                cssObject["transform-origin"] = p.origin.x + '% ' + p.origin.y + '%';
        }

        cssObject["visibility"] = 'visible';
        return cssObject;
    };

    Layer.prototype.getObject = function () {
        return '';
    };

    Layer.prototype.renderShape = function (container, position, currentScope) {
        return null;
    };

    Layer.prototype.renderShapeCore = function (shape, container, position, currentScope, h) {
        if (typeof h === "undefined") { h = null; }
        //get keyframe by pointer position
        var keyframe = this.getKeyframeByTimestamp(position);

        //if no keyframe, get init keyframe
        if (keyframe == null) {
            keyframe = this.getKeyframe(0);
        }
        if (keyframe != null) {
            var params = keyframe.shape.parameters;

            var relativeTop = (params.top / container.height()) * 100;
            var relativeLeft = (params.left / container.width()) * 100;
            var relativeWidth = (params.width / container.width()) * 100;
            var relativeHeight = (params.height / container.height()) * 100;

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
                'transform-origin': params.origin.x + '% ' + params.origin.y + '%'
            };
            shape.css(css);

            if (params.perspective == 0) {
                //fix for mozilla firefox
                shape.css({ 'transform': 'translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
            } else {
                shape.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
            }

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
                    var helper = $('<div>').addClass('shape-helper');
                } else {
                    var helper = h;
                }
                helper.append($('<div>').addClass('origin-point'));
                if (this.idEl) {
                    var helpername = $('<div>').addClass('helpername').html('<p>' + this.name + '<span class="div-id">#' + this.idEl + '</span></p>');
                } else {
                    var helpername = $('<div>').addClass('helpername').html('<p>' + this.name + '</p>');
                }
                helper.css({
                    'top': ((params.top - 1) / container.height()) * 100 + '%',
                    'left': ((params.left - 1) / container.width()) * 100 + '%',
                    'width': ((params.width + 2) / container.width()) * 100 + '%',
                    'height': ((params.height + 2) / container.height()) * 100 + '%',
                    'z-index': this.globalShape.parameters.zindex + 1000,
                    'transform-origin': params.origin.x + '% ' + params.origin.y + '%'
                });

                if (params.perspective == 0) {
                    //fix for mozilla firefox
                    helper.css({ 'transform': 'translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                } else {
                    helper.css({ 'transform': 'perspective(' + params.perspective + 'px) translateX(' + params.relativeTranslate.x + '%) translateY(' + params.relativeTranslate.y + '%) translateZ(' + params.translate.z + 'px) scale(' + params.scale + ') rotateX(' + params.rotate.x + 'deg) rotateY(' + params.rotate.y + 'deg) rotateZ(' + params.rotate.z + 'deg) skew(' + params.skew.x + 'deg , ' + params.skew.y + 'deg)' });
                }

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
    Layer.counter = 0;
    return Layer;
})();
///<reference path="Layer/Layer.ts" />
var Timeline = (function () {
    function Timeline(app, timelineContainer) {
        var _this = this;
        this.pointerPosition = 0;
        //width of one keyframe in px
        this.keyframeWidth = 15;
        //init number of keyframes
        this.keyframeCount = 100;
        //minimum free frames, when exceed, append another
        this.expandTimelineBound = 5;
        //convert frame to time
        this.miliSecPerFrame = 100;
        this.groupKeyframes = 5;
        this.playMode = 1 /* STOP */;
        this.copyKeyframe = null;
        this.allowedTimes = [10, 25, 50, 100, 200, 500];
        this._repeat = false;
        this.absoluteMax = 0;
        this.arrayMax = Function.prototype.apply.bind(Math.max, null);
        this.deleteLayerEl = $('<a class="delete-layer disabled" href="#">Smazat vrstvu/y <i class="fa fa-trash"></i></a>');
        this.repeatEl = $('<label for="repeat" class="repeat-label">Opakovat celou animaci <i class="fa fa-repeat"></i><input type="checkbox" id="repeat"></label>');
        this.repeatIconEl = $('<div>').addClass('repeat-icon').html('<i class="fa fa-undo"></i>');
        this.deleteKeyframeEl = $('<a>').addClass('delete-keyframe').addClass('disabled').html('Smazat keyframe <i class="fa fa-trash"></i>').attr('href', '#');
        this.layersEl = $('<div id="layers"></div>');
        this.timelineHeadEl = $('<div class="layers-head"></div>');
        this.layersWrapperEl = $('<div class="layers-wrapper"></div>');
        this.fixedWidthEl = $('<div class="fix-width"></div>');
        this.keyframesEl = $('<div class="keyframes"></div>');
        this.timelineFooterEl = $('<div class="timeline-footer"></div>');
        this.layersFooterEl = $('<div class="layers-footer"></div>');
        this.keyframesFooterEl = $('<div class="keyframes-footer"></div>');
        this.keyframesTableEl = $('<table><thead></thead><tbody></tbody>');
        this.pointerEl = $('<div class="pointer"><div class="pointer-top-wrapper"><div class="pointer-top"></div></div></div>');
        this.deleteConfirmEl = $('<div>').attr('id', 'delete-confirm').css({ 'display': 'none' });
        this.playEl = $('<a class="animation-btn play-animation tooltip-top" href="#" title="Přehrát animaci"><i class="fa fa-play"></i></a>');
        this.stopEl = $('<a class="animation-btn stop-animation tooltip-top indent" href="#" title="Zastavit animaci"><i class="fa fa-stop"></i></a>');
        this.pauseEl = $('<a class="animation-btn pause-animation tooltip-top" href="#" title="Pozastavit animaci"><i class="fa fa-pause"></i></a>');
        this.timelineScaleMinus = $('<a class="scale-timeline tooltip-top animation-btn" href="#" title="Zmenšit měřítko časové osy"><i class="fa fa-search-minus"></i></a>');
        this.timelineScalePlus = $('<a class="scale-timeline tooltip-top animation-btn indent" href="#" title="Zvětšit měřítko časové osy"><i class="fa fa-search-plus"></i></a>');
        this.contextMenuEl = $('<div>').addClass('context-menu');
        this.menuCreateKeyframe = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-plus"></i> Nový snímek');
        this.menuCreateKeyframeOriginal = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-plus"></i> Nový snímek z aktuální podoby');
        this.menuDeleteKeyframe = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-trash"></i> Smazat snímek');
        this.menuCopyKeyframe = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-copy"></i> Kopírovat snímek');
        this.menuPasteKeyframe = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-paste"></i> Vložit snímek ze schránky');
        this.menuReplaceKeyframe = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-paste"></i> Nahradit snímkem ze schránky');
        this.menuRenameLayer = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-pencil"></i> Přejmenovat vrstvu');
        this.menuDeleteLayer = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-trash"></i> Smazat vrstvu');
        this.app = app;
        this.timelineContainer = timelineContainer;
        this.layers = new Array();
        this.groupedLayers = new Array();
        this.groupedLayers[0] = new Array();

        this.renderTimeline();

        this.buildBreadcrumb(null);

        $(document).on('mousedown', function (e) {
            //hide context menu
            if (!$(e.target).parents().hasClass('context-menu')) {
                _this.contextMenuEl.removeClass('active');
                _this.contextMenuEl.remove();
            }
        });

        this.deleteLayerEl.on('click', function (event) {
            if (!_this.deleteLayerEl.hasClass('disabled')) {
                _this.deleteLayers(event);
            }
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

        $('body').on('click', '.action.visibility', function (e) {
            _this.setVisibility($(e.target).closest('a.action').data('layer'), $(e.target).closest('a.action'));
        });

        $('body').on('click', '.action.multiple', function (e) {
            _this.setMultiply($(e.target).closest('a.action').data('layer'), $(e.target).closest('a.action'));
        });

        $('body').on('change', '#repeat', function (event) {
            _this._repeat = $('#repeat').is(':checked');
            _this.renderAnimationRange();
        });

        this.keyframesEl.on('click', function (event) {
            if ($(event.target).hasClass('keyframes')) {
                _this.app.controlPanel.displayMainPanel(false, 'bezier');
            }
        });

        this.playEl.on('click', function (event) {
            _this.playMode = 0 /* PLAY */;
            $('.shape-helper').hide();
            _this.showPause();
            _this.runTimeline();
            var int = _this.miliSecPerFrame / (_this.keyframeWidth / 2);
        });

        this.stopEl.on('click', function (event) {
            _this.playMode = 1 /* STOP */;
            $('.shape-helper').show();
            _this.showPlay();
            $('tr.first').removeClass('to-background');
            cancelAnimationFrame(_this.playInterval);
            _this.stop = new Date();
            _this.pointerPosition = 0;
            _this.pointerEl.css('left', _this.pointerPosition - 1);
            _this.app.workspace.transformShapes();
        });

        this.pauseEl.on('click', function (event) {
            $('.shape-helper').show();
            _this.playMode = 2 /* PAUSE */;
            _this.showPlay();
            $('tr.first').removeClass('to-background');
            cancelAnimationFrame(_this.playInterval);
            _this.app.workspace.transformShapes();
        });

        this.timelineScaleMinus.on('click', function (e) {
            if ($(e.target).hasClass('disabled')) {
                return false;
            }
            var currentIndex = _this.allowedTimes.indexOf(_this.miliSecPerFrame);
            if (currentIndex > 0) {
                _this.miliSecPerFrame = _this.allowedTimes[currentIndex - 1];
            }

            _this.renderHeader();
            _this.layers.forEach(function (l, i) {
                _this.renderKeyframes(l.id);
            });

            if (_this.miliSecPerFrame == _this.allowedTimes[0]) {
                _this.timelineScaleMinus.addClass('disabled');
            } else {
                _this.timelineScaleMinus.removeClass('disabled');
            }
            if (_this.miliSecPerFrame == _this.allowedTimes[_this.allowedTimes.length - 1]) {
                _this.timelineScalePlus.addClass('disabled');
            } else {
                _this.timelineScalePlus.removeClass('disabled');
            }
        });

        this.timelineScalePlus.on('click', function (e) {
            if ($(e.target).hasClass('disabled')) {
                return false;
            }
            var currentIndex = _this.allowedTimes.indexOf(_this.miliSecPerFrame);
            if (currentIndex < _this.allowedTimes.length - 1) {
                _this.miliSecPerFrame = _this.allowedTimes[currentIndex + 1];
            }

            _this.renderHeader();
            _this.layers.forEach(function (l, i) {
                _this.renderKeyframes(l.id);
            });

            if (_this.miliSecPerFrame == _this.allowedTimes[0]) {
                _this.timelineScaleMinus.addClass('disabled');
            } else {
                _this.timelineScaleMinus.removeClass('disabled');
            }
            if (_this.miliSecPerFrame == _this.allowedTimes[_this.allowedTimes.length - 1]) {
                _this.timelineScalePlus.addClass('disabled');
            } else {
                _this.timelineScalePlus.removeClass('disabled');
            }
        });

        $(document).on('mousedown', 'td', function (event) {
            _this.onClickRow(event);
        });

        $(document).on('dblclick', 'td', function (event) {
            _this.onCreateKeyframe(event);
        });

        $(document).on('mousedown', '.keyframes > table > tbody', function (event) {
            _this.onClickTable(event);
        });

        $(document).on('mousedown', '.keyframes > table > thead', function (event) {
            _this.onClickChangePosition(event);
        });

        $(document).on('contextmenu', '#layers > .layer', function (e) {
            if (!$(e.target).hasClass('disabled')) {
                _this.contextMenuEl.empty();

                _this.contextMenuEl.append('<ul></ul>');
                _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuRenameLayer.attr('data-id', $(e.target).closest('.layer').data('id'))));
                _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuDeleteLayer.attr('data-id', $(e.target).closest('.layer').data('id'))));

                _this.contextMenuEl.appendTo($('body'));
                _this.contextMenuEl.css({
                    'top': e.pageY - $('body').offset().top,
                    'left': e.pageX - $('body').offset().left
                });
                _this.contextMenuEl.focus();

                _this.menuRenameLayer.on('click', function (event) {
                    $(e.target).closest('.layer').find('.editable').trigger('dblclick');
                    _this.contextMenuEl.remove();
                });

                _this.menuDeleteLayer.on('click', function (event) {
                    var id = parseInt($(event.target).data('id'));
                    var index = _this.getLayerIndex(id);
                    _this.deleteOneLayer(index);
                    _this.contextMenuEl.remove();
                });

                _this.contextMenuEl.addClass('active');
                e.preventDefault();
                return false;
            }
        });

        $(document).on('contextmenu', '.keyframes > table > tbody', function (e) {
            if (!$(e.target).closest('tr').hasClass('disabled')) {
                if (!$(e.target).hasClass('keyframe')) {
                    _this.contextMenuEl.empty();

                    _this.contextMenuEl.append('<ul></ul>');
                    _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuCreateKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));
                    _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuCreateKeyframeOriginal.attr('data-id', $(e.target).closest('tr').data('id'))));
                    _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuPasteKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));

                    if (_this.copyKeyframe != null && _this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                        _this.menuPasteKeyframe.removeClass('disabled');
                    } else {
                        _this.menuPasteKeyframe.addClass('disabled');
                    }

                    _this.contextMenuEl.appendTo($('body'));
                    _this.contextMenuEl.css({
                        'top': e.pageY - $('body').offset().top,
                        'left': e.pageX - $('body').offset().left
                    });
                    _this.contextMenuEl.focus();

                    _this.menuCreateKeyframe.on('click', function (event) {
                        var idLayer = parseInt($(event.target).data('id'));
                        var n = $('body').find('.keyframes > table');
                        var posX = e.pageX - $(n).offset().left;
                        posX = Math.round(posX / _this.keyframeWidth) * _this.keyframeWidth;
                        var position = _this.pxToMilisec(posX);
                        _this.createKeyframe(idLayer, position);
                        _this.contextMenuEl.remove();
                    });

                    _this.menuCreateKeyframeOriginal.on('click', function (event) {
                        var idLayer = parseInt($(event.target).data('id'));
                        var n = $('body').find('.keyframes > table');
                        var posX = e.pageX - $(n).offset().left;
                        posX = Math.round(posX / _this.keyframeWidth) * _this.keyframeWidth;
                        var position = _this.pxToMilisec(posX);
                        _this.createKeyframe(idLayer, position, true);
                        _this.contextMenuEl.remove();
                    });

                    _this.menuPasteKeyframe.on('click', function (event) {
                        if (!$(event.target).hasClass('disabled')) {
                            if (_this.copyKeyframe != null && _this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                                var n = $('body').find('.keyframes > table');
                                var posX = e.pageX - $(n).offset().left;
                                posX = Math.round(posX / _this.keyframeWidth) * _this.keyframeWidth;
                                var position = _this.pxToMilisec(posX);

                                _this.pasteKeyframe(position);
                            } else {
                                alert('Klíčový snímek je možné zkopírovat jen v rámci vrstvy.');
                            }
                        }
                        _this.copyKeyframe = null;
                        _this.app.workspace.transformShapes();
                        _this.contextMenuEl.remove();
                    });

                    _this.contextMenuEl.addClass('active');
                    e.preventDefault();
                    return false;
                } else {
                    //context menu for keyframe
                    _this.contextMenuEl.empty();

                    _this.contextMenuEl.append('<ul></ul>');

                    //data-id = idLayer
                    _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuDeleteKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));
                    _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuCopyKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));
                    _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuReplaceKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));

                    if (_this.copyKeyframe != null && _this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                        _this.menuReplaceKeyframe.removeClass('disabled');
                    } else {
                        _this.menuReplaceKeyframe.addClass('disabled');
                    }

                    _this.contextMenuEl.appendTo($('body'));
                    _this.contextMenuEl.css({
                        'top': e.pageY - $('body').offset().top,
                        'left': e.pageX - $('body').offset().left
                    });
                    _this.contextMenuEl.focus();

                    _this.menuDeleteKeyframe.on('click', function (event) {
                        $(e.target).addClass('selected');
                        $(e.target).next('.timing-function').addClass('selected');
                        _this.onDeleteKeyframe(e);
                    });

                    _this.menuCopyKeyframe.on('click', function (event) {
                        var idLayer = $(event.target).data('id');
                        var indexKeyframe = $(e.target).data('index');
                        _this.copyKeyframe = { layer: idLayer, keyframe: indexKeyframe };
                        _this.contextMenuEl.remove();
                    });

                    _this.menuReplaceKeyframe.on('click', function (event) {
                        if (!$(event.target).hasClass('disabled')) {
                            if (_this.copyKeyframe != null && _this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                                var n = $('body').find('.keyframes > table');
                                var posX = e.pageX - $(n).offset().left;
                                posX = Math.round(posX / _this.keyframeWidth) * _this.keyframeWidth;
                                var position = _this.pxToMilisec(posX);

                                _this.pasteKeyframe(position);
                            } else {
                                alert('Klíčový snímek je možné zkopírovat jen v rámci vrstvy.');
                            }
                        }
                        _this.copyKeyframe = null;
                        _this.app.workspace.transformShapes();
                        _this.contextMenuEl.remove();
                    });

                    _this.contextMenuEl.addClass('active');
                    e.preventDefault();
                    return false;
                }
            }
        });

        this.keyframesTableEl.on('mouseup', '.keyframe', function (event) {
            _this.keyframesTableEl.find('.keyframe').removeClass('selected');
            _this.keyframesTableEl.find('.timing-function').removeClass('selected');
            $(event.target).addClass('selected');
            $(event.target).next('.timing-function').addClass('selected');
            _this.app.workspace.updateBezierCurve(_this.getLayer($(event.target).data('layer')));
            _this.onClickChangePosition(event);
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
    Timeline.prototype.insertAnimationSet = function (animation) {
        var _this = this;
        var currentLayerId = this.layersEl.find('.selected').first().data('id');
        var layer = this.getLayer(currentLayerId);
        if (!layer) {
            alert('Vyberte nějakou vrstvu');
        } else {
            var keyframes = layer.getAllKeyframes();

            //if layer has keyframe, delete it except first
            var allow = true;
            if (keyframes.length > 1) {
                allow = confirm('Aplikovat na vrstvu animaci? Stávající snímky budou smazány!');
                if (allow) {
                    for (var i = keyframes.length - 1; i > 0; i--) {
                        layer.deleteKeyframe(i);
                    }

                    var zeroK = layer.getKeyframe(0);
                    zeroK.shape.setScale(1);
                    zeroK.shape.setTranslateX(0);
                    zeroK.shape.setTranslateY(0);
                    zeroK.shape.setTranslateZ(0);
                    zeroK.shape.setRelativeTranslateX(0);
                    zeroK.shape.setRelativeTranslateY(0);
                    zeroK.shape.setOpacity(1);
                    zeroK.shape.setPerspective(0);
                }
            }

            if (allow) {
                //iterate keyframes
                animation.keyframes.forEach(function (k, i) {
                    //iterate timestamps
                    k.timestamp.forEach(function (t, it) {
                        //create keyframe by copying
                        _this.copyKeyframe = { layer: layer.id, keyframe: 0 };
                        var newKeyframe = null;
                        if (t == 0) {
                            newKeyframe = layer.getKeyframe(0);
                        } else {
                            newKeyframe = _this.pasteKeyframe(t);
                        }

                        //insert bezier
                        if (k.bezier) {
                            newKeyframe.timing_function = k.bezier;
                        }

                        for (var name in k.parameters) {
                            newKeyframe.shape.setParameterByName(name, k.parameters[name]);
                        }

                        _this.copyKeyframe = null;
                    });
                });

                this.renderLayers();
            }
        }
    };

    Timeline.prototype.pasteKeyframe = function (position) {
        var layer = this.getLayer(this.copyKeyframe.layer);
        if (layer) {
            var k = layer.getKeyframe(this.copyKeyframe.keyframe);
            if (k) {
                var p = {
                    top: k.shape.parameters.top,
                    left: k.shape.parameters.left,
                    width: k.shape.parameters.width,
                    height: k.shape.parameters.height,
                    relativePosition: {
                        top: k.shape.parameters.relativePosition.top,
                        left: k.shape.parameters.relativePosition.left
                    },
                    relativeSize: {
                        width: k.shape.parameters.relativeSize.width,
                        height: k.shape.parameters.relativeSize.height
                    },
                    background: k.shape.parameters.background,
                    opacity: k.shape.parameters.opacity,
                    zindex: k.shape.parameters.zindex,
                    borderRadius: [
                        k.shape.parameters.borderRadius[0],
                        k.shape.parameters.borderRadius[1],
                        k.shape.parameters.borderRadius[2],
                        k.shape.parameters.borderRadius[3]
                    ],
                    rotate: {
                        x: k.shape.parameters.rotate.x,
                        y: k.shape.parameters.rotate.y,
                        z: k.shape.parameters.rotate.z
                    },
                    skew: {
                        x: k.shape.parameters.skew.x,
                        y: k.shape.parameters.skew.y
                    },
                    origin: {
                        x: k.shape.parameters.origin.x,
                        y: k.shape.parameters.origin.y
                    },
                    scale: k.shape.parameters.scale,
                    translate: {
                        x: k.shape.parameters.translate.x,
                        y: k.shape.parameters.translate.y,
                        z: k.shape.parameters.translate.z
                    },
                    relativeTranslate: {
                        x: k.shape.parameters.relativeTranslate.x,
                        y: k.shape.parameters.relativeTranslate.y
                    },
                    perspective: k.shape.parameters.perspective
                };

                var tf = { p0: k.timing_function.p0, p1: k.timing_function.p1, p2: k.timing_function.p2, p3: k.timing_function.p3 };

                if (layer.type == 0 /* DIV */) {
                    var shape = new Rectangle(p);
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, tf);
                } else if (layer.type == 3 /* IMAGE */) {
                    var shape = new Img(p, layer.globalShape.getSrc());
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, tf);
                } else if (layer.type == 2 /* SVG */) {
                    var shape = new Svg(p, null);
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, tf);
                } else if (layer.type == 1 /* TEXT */) {
                    var g = layer.globalShape;
                    var shape = new TextField(p, g.getContent(), k.shape.getColor(), k.shape.getSize(), g.getFamily());
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, tf);
                }

                shape.id = layer.id;

                if (newKeyframe == null) {
                    var currentKeyframe = layer.getKeyframeByTimestamp(position);
                    if (currentKeyframe) {
                        if (confirm('Stávající snímek na pozici ' + position / 1000 + ' s bude nahrazen.')) {
                            currentKeyframe.shape = shape;
                            currentKeyframe.timing_function = k.timing_function;
                        }
                    }

                    return currentKeyframe;
                } else {
                    return newKeyframe;
                }
            }
            return null;
        }
        return null;
    };

    Timeline.prototype.showPause = function () {
        $('.play-animation').hide();
        $('.pause-animation').show();
        $('tr.first').removeClass('to-background');
    };

    Timeline.prototype.showPlay = function () {
        $('.pause-animation').hide();
        $('.play-animation').show();
    };

    Timeline.prototype.runTimeline = function () {
        var _this = this;
        if (this.playMode == 2 /* PAUSE */) {
            return false;
        }
        $('tr.first').addClass('to-background');
        cancelAnimationFrame(this.playInterval);

        //find absolute maximum
        var arrayMax = Function.prototype.apply.bind(Math.max, null);
        var absoluteMax = 0;
        this.layers.forEach(function (item, index) {
            var tmp = arrayMax(item.timestamps);
            if (tmp > absoluteMax)
                absoluteMax = tmp;
        });
        var absoluteMaxPx = this.milisecToPx(absoluteMax);

        if (absoluteMax == 0) {
            this.playMode = 1 /* STOP */;
            $('.shape-helper').show();
            this.showPlay();
            $('tr.first').removeClass('to-background');
            return false;
        }

        var time;
        this.start = new Date();
        var draw = function () {
            _this.playInterval = requestAnimationFrame(draw);
            var now = new Date().getTime();
            var dt = now - (time || now);

            time = now;
            _this.pointerPosition += (absoluteMaxPx / absoluteMax) * dt;
            if (_this.pointerPosition >= absoluteMaxPx) {
                cancelAnimationFrame(_this.playInterval);
                if (_this.repeat) {
                    _this.pointerPosition = 0;
                    _this.pointerEl.css('left', _this.pointerPosition - 1);
                    _this.app.workspace.transformShapes(false);
                    draw();
                } else {
                    $('tr.first').removeClass('to-background');
                    _this.pointerPosition = 0;
                    _this.pointerEl.css('left', _this.pointerPosition - 1);
                    _this.showPlay();
                    $('.shape-helper').show();
                }
            }

            _this.pointerEl.css('left', _this.pointerPosition - 1);
            _this.app.workspace.transformShapes(false);
        };
        draw();
        return true;
    };

    Timeline.prototype.renderTimeline = function () {
        var _this = this;
        $('body').append(this.deleteConfirmEl);
        var wrapperRepeat = $('<div>').addClass('wrapper-repeat');
        wrapperRepeat.append(this.repeatEl);
        $(this.timelineHeadEl).append(wrapperRepeat);
        var wrapperPlay = $('<div>').addClass('wrapper-play');
        wrapperPlay.append(this.playEl);
        wrapperPlay.append(this.pauseEl);
        wrapperPlay.append(this.stopEl);
        $(this.timelineHeadEl).append(wrapperPlay);
        var wrapperScale = $('<div>').addClass('wrapper-scale');
        wrapperScale.append(this.timelineScaleMinus);
        wrapperScale.append(this.timelineScalePlus);
        $(this.timelineHeadEl).append(wrapperScale);
        $(this.timelineContainer).append(this.timelineHeadEl);
        $(this.fixedWidthEl).append(this.layersEl);
        $(this.fixedWidthEl).append(this.keyframesEl);
        $(this.layersFooterEl).append(this.deleteLayerEl);
        $(this.layersFooterEl).append(this.deleteKeyframeEl);

        $(this.layersFooterEl).append($('<a href="#" class="performanceTest">Perf. test</a>').on('click', function (e) {
            _this.app.workspace.performanceTest(5);
        }));

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
        var existTrEl = this.keyframesTableEl.find('.layer-row').first().clone();
        if (existTrEl.length != 0) {
            existTrEl.removeClass();
            existTrEl.addClass('layer-row').attr('data-id', id);
            if (selector != null) {
                existTrEl.attr('class', selector);
            }

            this.keyframesTableEl.find('tbody').append(existTrEl);
        } else {
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
        }
    };

    Timeline.prototype.expandFrames = function () {
        var trEl = $('body').find('.keyframes > table > tbody > tr');

        for (var i = 0; i < 10; i++) {
            var tdEl = $('<td>').attr('class', i + this.keyframeCount);

            //every n-th highlighted
            if ((i + 1) % this.groupKeyframes == 0) {
                tdEl.addClass('highlight');
            }

            tdEl.appendTo(trEl);
        }

        this.keyframeCount += 10;
        this.fixedWidthEl.width((this.keyframeWidth) * this.keyframeCount + 350 + 15);
    };

    Timeline.prototype.renderAnimationRange = function () {
        var _this = this;
        this.keyframesTableEl.find('.range').remove();
        if (this.repeat) {
            //if repeat animation, find absolute maximum
            var absMax = 0;
            var arrayMax = Function.prototype.apply.bind(Math.max, null);
            this.layers.forEach(function (item, index) {
                var tmp = arrayMax(item.timestamps);
                if (tmp > absMax)
                    absMax = tmp;
            });
            this.layers.forEach(function (item, index) {
                item.sortKeyframes();
                var keyframes = item.getAllKeyframes();
                if (keyframes.length > 1) {
                    var minValue = keyframes[0].timestamp, maxValue = keyframes[0].timestamp;

                    keyframes.forEach(function (keyframe, i) {
                        if (keyframe.timestamp < minValue)
                            minValue = keyframe.timestamp;
                        if (keyframe.timestamp > maxValue)
                            maxValue = keyframe.timestamp;
                    });

                    if (maxValue != absMax) {
                        var keyframesTdEl = _this.keyframesTableEl.find('tbody tr' + '[data-id="' + item.id + '"] > .keyframes-list');
                        keyframesTdEl.prepend($('<div>').addClass('range').css({
                            'left': _this.milisecToPx(minValue),
                            'width': _this.milisecToPx(absMax - minValue) + 3
                        }));
                    }
                }
            });

            $('tr.first').append(this.repeatIconEl);
            this.repeatIconEl.css({ 'left': this.milisecToPx(absMax) - 5 });
        } else {
            this.repeatIconEl.remove();
        }
    };

    Timeline.prototype.renderKeyframes = function (id, isAll) {
        var _this = this;
        if (typeof isAll === "undefined") { isAll = false; }
        var rowEl = this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]');
        rowEl.find('td.keyframes-list').remove();
        var keyframesTdEl = $('<td>').addClass('keyframes-list');

        this.getLayer(id).sortKeyframes();
        var keyframes = this.getLayer(id).getAllKeyframes();
        if (keyframes.length > 1) {
            keyframes.forEach(function (keyframe, index) {
                keyframesTdEl.append($('<div>').addClass('keyframe').attr('data-layer', id).attr('data-index', index).css({
                    'left': _this.milisecToPx(keyframe.timestamp) - 5
                }));

                if (index != (keyframes.length - 1)) {
                    keyframesTdEl.append($('<div>').addClass('timing-function').html('<p class="tooltip-bottom" title="Kliknutím editujte časovou funkci">(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')</p>').css({
                        'left': _this.milisecToPx(keyframe.timestamp) + 5,
                        'width': _this.milisecToPx(keyframes[index + 1].timestamp - keyframe.timestamp) - 10
                    }));
                }
            });

            rowEl.prepend(keyframesTdEl);
        }
        if (!isAll) {
            this.renderAnimationRange();
        }

        var c = keyframes[keyframes.length - 1].timestamp / this.miliSecPerFrame;
        var renderHeaderNeeded = false;
        while (c > (this.keyframeCount - this.expandTimelineBound)) {
            renderHeaderNeeded = true;
            this.expandFrames();
        }

        if (renderHeaderNeeded) {
            this.renderHeader();
        }

        $('.keyframe').draggable({
            axis: "x",
            containment: 'tr',
            stop: function (event, ui) {
                //update positon of keyframe
                var ms = _this.pxToMilisec((Math.round(ui.position.left / _this.keyframeWidth) * _this.keyframeWidth));
                var layerID = $(event.target).data('layer');
                var keyframeID = $(event.target).data('index');

                var layer = _this.getLayer(layerID);

                var err1 = false;
                var err2 = false;
                if (layer.parent != null) {
                    var parentLayer = _this.getLayer(layer.parent);
                    var maxTimestamp = _this.arrayMax(parentLayer.timestamps);
                    if (ms > maxTimestamp && maxTimestamp != 0) {
                        err1 = true;
                    }
                }
                var mt = _this.arrayMax(layer.timestamps);
                var maxPosition = _this.checkChildTimestamps(layer, mt);
                var secondMax = 0;
                layer.getAllKeyframes().forEach(function (item, index) {
                    if (item.timestamp > secondMax && item.timestamp != mt) {
                        secondMax = item.timestamp;
                    }
                });

                if ((mt == layer.getKeyframe(keyframeID).timestamp) && (secondMax < maxPosition && ms < maxPosition && maxPosition != 0)) {
                    err2 = true;
                }

                if (err1) {
                    alert('Doba animace je omezena animací nadřazeného prvku na ' + maxTimestamp / 1000 + 's. Snímek nebude přesunut.');
                } else if (err2) {
                    alert('Nelze přesunout snímek, protože výsledná animace by byla kratší než animace vnořených elementů. Upravte dobu animací vnořených elementů.');
                } else {
                    layer.updatePosition(keyframeID, ms);
                }

                _this.renderKeyframes(layerID);
            }
        });
        $('.tooltip-bottom').tooltipster({ position: 'bottom' });
    };

    Timeline.prototype.renderLayers = function () {
        var _this = this;
        //remove layers list
        this.layersEl.empty();
        this.keyframesTableEl.find('tbody').empty();

        var isEmpty = true;

        //render new layers list from array
        this.layers.forEach(function (item, index) {
            if (_this.app.workspace.scope == item.parent) {
                var layerItem = $('<div>').addClass('layer').attr('id', index).attr('data-id', item.id);
                var textLayerContainer = $('<div>').addClass('textlayer-container');
                layerItem.append($('<span>').addClass('handle').html('<i class="fa fa-arrows-v"></i>'));
                textLayerContainer.append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(item.name));
                layerItem.append(textLayerContainer);
                var visibleEl = $('<a>').attr('data-layer', item.id).addClass('action tooltip-right visibility').attr('title', 'Viditelnost').html('<i class="fa fa-eye"></i>').attr('href', '#');
                var multipleEditEl = $('<a>').attr('data-layer', item.id).addClass('action tooltip-right multiple').attr('title', 'Hromadná editace snímků').html('<i class="fa fa-chain-broken"></i>').attr('href', '#');
                layerItem.append(($('<span>').addClass('layer-actions')).append(multipleEditEl).append(visibleEl));

                if (item.idEl) {
                    textLayerContainer.append($('<span>').addClass('div-id').html('#' + item.idEl));
                }
                _this.layersEl.append(layerItem);

                //and render frames for this layer
                _this.renderRow(item.id);

                //render keyframes
                _this.renderKeyframes(item.id, true);
                isEmpty = false;

                $('.tooltip-right').tooltipster({ position: 'right' });
                _this.setVisibility(item.id, visibleEl, false);
                _this.setMultiply(item.id, multipleEditEl, false);
            }
        });

        this.renderAnimationRange();

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
            event: 'dblclick',
            cssClass: 'editable-input'
        });
    };

    Timeline.prototype.renderSingleLayer = function (layer, index) {
        if (this.app.workspace.scope == layer.parent) {
            var layerItem = $('<div>').addClass('layer').attr('id', index).attr('data-id', layer.id);
            var textLayerContainer = $('<div>').addClass('textlayer-container');
            layerItem.append($('<span>').addClass('handle').html('<i class="fa fa-arrows-v"></i>'));
            textLayerContainer.append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(layer.name));
            layerItem.append(textLayerContainer);
            var visibleEl = $('<a>').attr('data-layer', layer.id).addClass('action tooltip-right visibility').attr('title', 'Viditelnost').html('<i class="fa fa-eye"></i>').attr('href', '#');
            var multipleEditEl = $('<a>').attr('data-layer', layer.id).addClass('action tooltip-right multiple').attr('title', 'Hromadná editace snímků').html('<i class="fa fa-chain-broken"></i>').attr('href', '#');
            layerItem.append(($('<span>').addClass('layer-actions')).append(multipleEditEl).append(visibleEl));

            if (layer.idEl) {
                textLayerContainer.append($('<span>').addClass('div-id').html('#' + layer.idEl));
            }
            this.layersEl.append(layerItem);

            //and render frames for this layer
            this.renderRow(layer.id);

            //render keyframes
            this.renderKeyframes(layer.id, true);

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
                event: 'dblclick',
                cssClass: 'editable-input'
            });

            $('.tooltip-right').tooltipster({ position: 'right' });
            this.setVisibility(layer.id, visibleEl, false);
            this.setMultiply(layer.id, multipleEditEl, false);
        }
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

        this.keyframesTableEl.find('thead').empty().append(head);
    };

    Timeline.prototype.addLayer = function (layer) {
        this.keyframesTableEl.find('tbody tr.disabled').remove();
        this.layersEl.find('.layer.disabled').remove();
        var index = this.layers.push(layer);

        layer.order = this.layers.length;

        this.renderSingleLayer(layer, index - 1);

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

    Timeline.prototype.deleteOneLayer = function (index) {
        var _this = this;
        this.deleteConfirmEl.attr('title', 'Vymazat vybrané vrstvy?').html('Opravu chcete vymazat vybrané vrstvy. Objekty v těchto vrstvách budou smazány také!');
        this.deleteConfirmEl.dialog({
            dialogClass: 'delete-confirm',
            resizable: false,
            buttons: {
                "Smazat": function () {
                    _this.deleteLayer(index);

                    //render layers
                    _this.renderLayers();

                    //render workspace
                    _this.app.workspace.renderShapes();
                    _this.app.workspace.transformShapes();

                    //scroll to last layer
                    _this.selectLayer(_this.layersEl.find('.layer').last().data('id'));
                    _this.layersWrapperEl.scrollTop(_this.layersWrapperEl.scrollTop() - (_this.layersEl.find('.layer').outerHeight()));
                    _this.layersWrapperEl.perfectScrollbar('update');
                    _this.deleteConfirmEl.dialog("destroy");
                },
                Cancel: function () {
                    $(this).dialog("destroy");
                }
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');
    };

    Timeline.prototype.deleteLayers = function (e) {
        var _this = this;
        //iteration from end of array of selected layers
        var selectedLayers = this.layersEl.find('div.layer.selected').get();

        if (selectedLayers.length) {
            this.deleteConfirmEl.attr('title', 'Vymazat vybrané vrstvy?').html('Opravu chcete vymazat vybrané vrstvy. Objekty v těchto vrstvách budou smazány také!');
            this.deleteConfirmEl.dialog({
                dialogClass: 'delete-confirm',
                resizable: false,
                buttons: {
                    "Smazat": function () {
                        for (var i = selectedLayers.length - 1; i >= 0; i--) {
                            _this.deleteLayer(parseInt($(selectedLayers[i]).attr('id')));
                        }

                        //render layers
                        _this.renderLayers();

                        //render workspace
                        _this.app.workspace.renderShapes();
                        _this.app.workspace.transformShapes();

                        //scroll to last layer
                        _this.selectLayer(_this.layersEl.find('.layer').last().data('id'));
                        _this.layersWrapperEl.scrollTop(_this.layersWrapperEl.scrollTop() - (_this.layersEl.find('.layer').outerHeight() * selectedLayers.length));
                        _this.layersWrapperEl.perfectScrollbar('update');
                        _this.deleteConfirmEl.dialog("destroy");
                    },
                    Cancel: function () {
                        $(this).dialog("destroy");
                    }
                }
            });
            $('.ui-dialog-titlebar-close').empty().append('X');
        }
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

            layer.globalShape.setZindex(index);
        });

        this.layers = outOfScopeLayers.concat(tmpLayers);

        //render layers
        this.renderLayers();

        //render shapes
        this.app.workspace.renderShapes();
        this.app.workspace.transformShapes();
        this.selectLayer(firstSelectedEl.data('id'));
    };

    //on click name layer
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
        this.pointerEl.find('.pointer-top-wrapper').css('top', posY + 18);
    };

    Timeline.prototype.onReady = function (e) {
        var _this = this;
        this.layersEl.multisortable({
            items: '> div.layer:not(.disabled)',
            handle: '.handle',
            axis: 'y',
            delay: 150,
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
            handle: '.pointer-top-wrapper',
            start: function (event, ui) {
                _this.app.controlPanel.displayMainPanel(false, 'bezier');
                $('.shape-helper').hide();
            },
            drag: function (event, ui) {
                _this.pointerPosition = ui.position.left + 1;
                _this.app.workspace.transformShapes(false);
            },
            stop: function (event, ui) {
                var posX = Math.round(ui.position.left / _this.keyframeWidth) * _this.keyframeWidth;
                _this.pointerPosition = posX;
                _this.pointerEl.css('left', _this.pointerPosition - 1);
                $('.shape-helper').show();
                _this.app.workspace.transformShapes();
            }
        });

        this.showPlay();
    };

    Timeline.prototype.onClickTable = function (e) {
        this.app.controlPanel.displayMainPanel(false, 'bezier');
    };

    Timeline.prototype.onClickChangePosition = function (e) {
        if (!$(e.target).hasClass('pointer')) {
            if (!$(e.target).hasClass('keyframe')) {
                this.app.controlPanel.displayMainPanel(false, 'bezier');
            } else {
                if (!$(e.target).is(':last-child')) {
                    this.app.controlPanel.displayMainPanel(true, 'bezier');
                } else {
                    this.app.controlPanel.displayMainPanel(false, 'bezier');
                    $('.delete-keyframe').removeClass('disabled');
                    $(e.target).addClass('selected');
                }
            }
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

    Timeline.prototype.getLayerIndex = function (id) {
        var index = null;

        this.layers.forEach(function (item, i) {
            if (item.id == id) {
                index = i;
            }
        });

        return index;
    };

    Timeline.prototype.onCreateKeyframe = function (e) {
        var idLayer = parseInt($(e.target).closest('tr.selected').data('id'));
        var n = $('body').find('.keyframes > table');
        var posX = e.pageX - $(n).offset().left;
        posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
        var position = this.pxToMilisec(posX);

        this.createKeyframe(idLayer, position);
    };

    Timeline.prototype.createKeyframe = function (idLayer, position, currentView) {
        if (typeof currentView === "undefined") { currentView = false; }
        if ($.isNumeric(idLayer)) {
            var layer = this.getLayer(idLayer);

            if (currentView) {
                var shape = this.app.workspace.getCurrentShape(idLayer);
            } else {
                var shape = this.app.workspace.getCurrentShape(idLayer, position);
            }

            this.app.workspace.addKeyframe(layer, shape, position, this.app.workspace.getBezier());

            this.app.workspace.transformShapes();
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
        var _this = this;
        if (this.deleteKeyframeEl.hasClass('disabled')) {
            e.preventDefault();
            return false;
        }
        this.deleteConfirmEl.attr('title', 'Vymazat keframe?').html('Opravu chcete vymazat vybráný klíčový snímek?');
        this.deleteConfirmEl.dialog({
            dialogClass: 'delete-confirm',
            resizable: false,
            buttons: {
                "Smazat": function () {
                    var keyframeEl = _this.keyframesTableEl.find('tbody .keyframe.selected');

                    if (keyframeEl.length) {
                        var layer = _this.getLayer(keyframeEl.data('layer'));

                        var k = layer.getKeyframe(keyframeEl.data('index'));
                        if (layer.getAllKeyframes().length > 2) {
                            var maxPosition = _this.checkChildTimestamps(layer, _this.arrayMax(layer.timestamps));
                            if (k.timestamp > maxPosition && maxPosition != 0) {
                                alert('Nelze smazat snímek, protože výsledná animace by byla kratší než animace vnořených elementů. Upravte dobu animací vnořených elementů.');
                            } else {
                                layer.deleteKeyframe(keyframeEl.data('index'));
                            }
                        } else {
                            layer.deleteKeyframe(keyframeEl.data('index'));
                        }

                        _this.renderKeyframes(keyframeEl.data('layer'));
                        _this.app.workspace.transformShapes();
                        _this.app.controlPanel.displayMainPanel(false, 'bezier');
                    }
                    _this.deleteConfirmEl.dialog("destroy");
                },
                Cancel: function () {
                    $(this).dialog("destroy");
                }
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');
    };

    Timeline.prototype.checkChildTimestamps = function (layer, limit, maxTimestamp) {
        var _this = this;
        if (typeof maxTimestamp === "undefined") { maxTimestamp = 0; }
        var ret = maxTimestamp;
        this.layers.forEach(function (child, index) {
            if (child.parent == layer.id) {
                var localMax = _this.arrayMax(child.timestamps);

                var tmp = _this.checkChildTimestamps(child, limit, localMax);
                if (tmp > ret)
                    ret = tmp;
            }
        });
        return ret;
    };

    Timeline.prototype.setVisibility = function (idLayer, link, change) {
        if (typeof change === "undefined") { change = true; }
        var layer = this.getLayer(idLayer);
        if (layer) {
            if (change) {
                if (layer.isVisibleOnWorkspace) {
                    link.html('<i class="fa fa-eye-slash"></i>');
                    link.tooltipster('content', 'Viditelnost: Zobrazit');
                    link.addClass('invisible');
                    layer.isVisibleOnWorkspace = false;
                } else {
                    link.html('<i class="fa fa-eye"></i>');
                    link.removeClass('invisible');
                    link.tooltipster('content', 'Viditelnost: Schovat');
                    layer.isVisibleOnWorkspace = true;
                }
            } else {
                //only update current state
                if (layer.isVisibleOnWorkspace) {
                    link.html('<i class="fa fa-eye"></i>');
                    link.removeClass('invisible');
                    link.tooltipster('content', 'Viditelnost: Schovat');
                } else {
                    link.html('<i class="fa fa-eye-slash"></i>');
                    link.tooltipster('content', 'Viditelnost: Zobrazit');
                    link.addClass('invisible');
                }
            }
            this.app.workspace.transformShapes();
        }
    };

    Timeline.prototype.setMultiply = function (idLayer, link, change) {
        if (typeof change === "undefined") { change = true; }
        var layer = this.getLayer(idLayer);
        if (layer) {
            if (change) {
                if (layer.isMultipleEdit) {
                    link.html('<i class="fa fa-chain-broken"></i>');
                    link.tooltipster('content', 'Hromadná editace snímků - Vypnuta');
                    link.removeClass('ismultiple');
                    layer.isMultipleEdit = false;
                } else {
                    link.html('<i class="fa fa-chain"></i>');
                    link.addClass('ismultiple');
                    link.tooltipster('content', 'Hromadná editace snímků - Zapnuta');
                    layer.isMultipleEdit = true;
                }
            } else {
                //only update current state
                if (layer.isMultipleEdit) {
                    link.html('<i class="fa fa-chain"></i>');
                    link.addClass('ismultiple');
                    link.tooltipster('content', 'Hromadná editace snímků - Zapnuta');
                } else {
                    link.html('<i class="fa fa-chain-broken"></i>');
                    link.tooltipster('content', 'Hromadná editace snímků - Vypnuta');
                    link.removeClass('ismultiple');
                }
            }
        }
    };

    Object.defineProperty(Timeline.prototype, "repeat", {
        get: function () {
            return this._repeat;
        },
        set: function (r) {
            this._repeat = r;
            if (this._repeat) {
                $('#repeat').prop('checked', true);
            } else {
                $('#repeat').prop('checked', false);
            }

            $('#repeat').change();
        },
        enumerable: true,
        configurable: true
    });


    Timeline.prototype.getSelectedKeyframeID = function (idLayer) {
        var el = (this.keyframesTableEl.find('tr.layer-row[data-id="' + idLayer + '"]')).find('.keyframe.selected');
        return el.data('index');
    };

    Timeline.prototype.buildBreadcrumb = function (scope) {
        $('.breadcrumb').remove();
        var container = $('<div>').addClass('breadcrumb');
        var currentLayer = this.getLayer(scope);
        if (currentLayer) {
            container.append($('<span>').addClass('scope-item').html('<a href="#" class="set-scope" data-id=' + currentLayer.id + '>' + currentLayer.name + '</a>'));
            this.getParent(currentLayer.parent, container);
        }
        container.prepend($('<span>').addClass('scope-item').html('<a href="#" class="set-scope">Hlavní plátno</a>'));
        container.prepend($('<span>').addClass('b-title').html('Úroveň zanoření: '));
        this.keyframesFooterEl.append(container);
    };

    Timeline.prototype.getParent = function (parent, container) {
        var layer = null;
        layer = this.getLayer(parent);
        if (layer) {
            container.prepend($('<span>').addClass('scope-item').html('<a href="#" class="set-scope" data-id=' + layer.id + '>' + layer.name + '</a>'));
            this.getParent(layer.parent, container);
        }
        return layer;
    };

    Timeline.prototype.getSortedArray = function () {
        return this.layersEl.sortable('toArray');
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

    Shape.prototype.setRelativePosition = function (pos) {
        this._parameters.relativePosition.top = pos.top;
        this._parameters.relativePosition.left = pos.left;
    };

    Shape.prototype.setDimensions = function (d) {
        this._parameters.width = d.width;
        this._parameters.height = d.height;
    };

    Shape.prototype.setRelativeDimensions = function (d) {
        this._parameters.relativeSize.width = d.width;
        this._parameters.relativeSize.height = d.height;
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

    Shape.prototype.setRelativeX = function (x) {
        this._parameters.relativeSize.width = x;
    };

    Shape.prototype.setRelativeY = function (y) {
        this._parameters.relativeSize.height = y;
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

    Shape.prototype.setBorderRadius = function (val) {
        this.setBorderRadiusBottomLeft(val);
        this.setBorderRadiusBottomRight(val);
        this.setBorderRadiusTopLeft(val);
        this.setBorderRadiusTopRight(val);
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

    Shape.prototype.setScale = function (val) {
        this._parameters.scale = val;
    };

    Shape.prototype.setTranslateX = function (val) {
        this._parameters.translate.x = val;
    };

    Shape.prototype.setTranslateY = function (val) {
        this._parameters.translate.y = val;
    };

    Shape.prototype.setTranslateZ = function (val) {
        this._parameters.translate.z = val;
    };

    Shape.prototype.setRelativeTranslateX = function (val) {
        this._parameters.relativeTranslate.x = val;
    };

    Shape.prototype.setRelativeTranslateY = function (val) {
        this._parameters.relativeTranslate.y = val;
    };

    Shape.prototype.setPerspective = function (val) {
        this._parameters.perspective = val;
    };

    Shape.prototype.setParameterByName = function (name, val) {
        if (name == 'opacity') {
            this.setOpacity(val);
        } else if (name == 'rotatey') {
            this.setRotateY(val);
        } else if (name == 'rotatez') {
            this.setRotateZ(val);
        } else if (name == 'rotatex') {
            this.setRotateX(val);
        } else if (name == 'translatey') {
            this.setTranslateY(val);
            this.setRelativeTranslateY((val / this.parameters.height) * 100);
        } else if (name == 'translatex') {
            this.setTranslateX(val);
            this.setRelativeTranslateX((val / this.parameters.width) * 100);
        } else if (name == 'translatez') {
            this.setTranslateZ(val);
        } else if (name == 'scale') {
            this.setScale(val);
        } else if (name == 'originx') {
            this.setOriginX(val);
        } else if (name == 'originy') {
            this.setOriginY(val);
        } else if (name == 'perspective') {
            this.setPerspective(val);
        } else if (name == 'skewx') {
            this.setSkewX(val);
        } else if (name == 'skewy') {
            this.setSkewY(val);
        }
    };
    return Shape;
})();
///<reference path="Object/Shape.ts" />
var Workspace = (function () {
    function Workspace(app, workspaceContainer, workspaceWrapper) {
        var _this = this;
        this.createdLayer = false;
        this._workspaceSize = { width: 800, height: 360 };
        this._scope = null;
        this.movedLayer = null;
        this.workspaceOverlay = $('<div>').addClass('workspace-overlay');
        this.scopeOverlay = $('<div>').addClass('overlay-scope overlay-clickable');
        this.uploadAreaWrapper = $('<div>');
        this.uploadArea = $('<div>').addClass('upload-area bigger').html('Sem přetáhněte obrázek nebo klikněte pro výběr souboru');
        this.uploadBtn = $('<input type="file"></input>').css('display', 'none');
        this.svgTextArea = $('<div>').addClass('svg-area');
        this.svgInsertBtn = $('<a>').addClass('btn svg-btn').attr('href', '#').html('Vložit SVG z textového pole');
        this.svgUploadArea = $('<div>').addClass('upload-area').html('Sem přetáhněte SVG obrázek nebo klikněte');
        this.svgUploadInput = $('<input type="file"></input>').addClass('svgfile').css('display', 'none');
        this.svgText = $('<textarea>');
        this.loadAreaWrapper = $('<div>');
        this.loadArea = $('<div>').addClass('upload-area bigger').html('Sem přetáhněte uložený projekt v souboru JSON nebo klikněte pro výběr souboru.');
        this.loadBtn = $('<input type="file"></input>').css('display', 'none');
        this.contextMenuEl = $('<div>').addClass('context-menu');
        this.menuItemDelete = $('<a>').addClass('menu-item menu-delete').attr('href', '#').html('<i class="fa fa-trash"></i> Smazat objekt');
        this.menuItemToBackground = $('<a>').addClass('menu-item menu-tobackground').attr('href', '#').html('<i class="fa fa-long-arrow-down"></i> Níže do pozadí');
        this.menuItemToForeground = $('<a>').addClass('menu-item menu-toforeground').attr('href', '#').html('<i class="fa fa-long-arrow-up"></i> Výše do popředí');
        this.menuItemDuplicate = $('<a>').addClass('menu-item menu-duplicate').attr('href', '#').html('<i class="fa fa-files-o"></i> Duplikovat objekt');
        this.menuItemMoveTo = $('<a>').addClass('menu-item menu-moveto').attr('href', '#').html('<i class="fa fa-file"></i> Přesunout do...');
        this.menuItemMoveHere = $('<a>').addClass('menu-item menu-movehere').attr('href', '#').html('<i class="fa fa-file-o"></i> ...Přesunout tady');
        this.menuItemMoveCancel = $('<a>').addClass('menu-item menu-movecancel').attr('href', '#').html('<i class="fa fa-times"></i> Zrušit přesun');
        this.menuSetScope = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-level-down"></i> Zanořit');
        this.dialogEl = $('<div>').attr('id', 'dialog');
        this.tooltip = $('<span>').addClass('tooltip-text').html('Dvojklikem umístětě textové pole');
        this.loadDemoPanel = $('<div>').addClass('demo-panel').html('<span>Přejete si načíst ukázkový projekt?</span>');
        this.loadDemoYes = $('<a>').addClass('btn demo-btn yes').attr('href', '#').html('Ano');
        this.loadDemoNo = $('<a>').addClass('btn demo-btn no').attr('href', '#').html('Ne, zavřít panel');
        this.app = app;
        this.workspaceContainer = workspaceContainer;
        this.workspaceContainerOriginal = workspaceContainer;
        this.workspaceWrapper = workspaceWrapper;
        this.uploadAreaWrapper.append(this.uploadArea);
        this.uploadAreaWrapper.append(this.uploadBtn);
        this.loadAreaWrapper.append(this.loadArea);
        this.loadAreaWrapper.append(this.loadBtn);
        this.svgTextArea.append('nahrát SVG ze souboru');
        this.svgTextArea.append(this.svgUploadArea);
        this.svgTextArea.append(this.svgUploadInput);
        this.svgTextArea.append('nebo vložte XML kód');
        this.svgTextArea.append(this.svgText);
        this.svgTextArea.append(this.svgInsertBtn);

        this.workspaceContainer.css(this._workspaceSize);

        this.loadDemoPanel.append(this.loadDemoYes);
        this.loadDemoPanel.append(this.loadDemoNo);
        this.loadDemoPanel.append($('<span class="small" > Načtení může chvíli trvat </span>'));
        $('body').prepend(this.loadDemoPanel);

        this.loadDemoNo.on('click', function (e) {
            _this.loadDemoPanel.slideUp("slow");
        });

        this.loadDemoYes.on('click', function (e) {
            //load banner.json
            $.ajax({
                url: 'demo.json',
                dataType: 'text',
                beforeSend: function () {
                    _this.loadDemoPanel.find('.small').html('Nahrávám...');
                },
                success: function (data) {
                    _this.parseJson(data);
                    _this.loadDemoPanel.slideUp("slow");
                },
                error: function () {
                    _this.loadDemoPanel.find('.small').html('Chyba. Nelze načíst projekt.');
                }
            });
        });

        $(document).on('mousedown', function (e) {
            //hide context menu
            if (!$(e.target).parents().hasClass('context-menu')) {
                _this.contextMenuEl.removeClass('active');
                _this.contextMenuEl.remove();
            }
        });

        this.workspaceWrapper.on('mousedown', function (event) {
            if (_this.app.controlPanel.Mode == 1 /* CREATE_DIV */) {
                _this.onDrawSquare(event);
            }

            if (!$(event.target).hasClass('shape-helper') && !$(event.target).closest('.text').length) {
                _this.app.controlPanel.displayMainPanel(false, 'font');
            } else if ($(event.target).closest('.text').length) {
                _this.app.controlPanel.displayMainPanel(true, 'font');
            }

            _this.app.controlPanel.displayMainPanel(false, 'bezier');
        });

        $('html').on('keyup', function (e) {
            if (e.keyCode == 46) {
                var originTag = $(e.target).prop("tagName").toLowerCase();
                if (originTag === 'body' || originTag != 'input') {
                    if ($('body').find('.keyframe.selected').length != 0) {
                        _this.app.timeline.onDeleteKeyframe(e);
                    } else {
                        _this.app.timeline.deleteLayers(e);
                    }
                }
            }
        });

        this.workspaceWrapper.on('dblclick', function (event) {
            if (_this.app.controlPanel.Mode == 3 /* TEXT */) {
                //if mode is TEXT, create text field
                _this.onCreateText(event);
            } else if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                //if mode is SELECT, check if dblclick is in container -> set scope
                var layer = _this.app.timeline.getLayer($(event.target).data('id'));
                if (layer instanceof RectangleLayer && $(event.target).hasClass('shape-helper')) {
                    _this.setScope(layer.id);
                }
            }
        });

        this.workspaceWrapper.on('mousedown', function (e) {
            //for deselect layer
            if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                if (!$(e.target).parents().hasClass('context-menu') && !$(e.target).hasClass('shape-helper') && !$(e.target).hasClass('origin-point') && !$(e.target).hasClass('ui-resizable-handle')) {
                    _this.app.timeline.selectLayer(null);
                }
            }
        });

        this.workspaceContainer.on('contextmenu', function (event) {
            if (!$(event.target).hasClass('shape-helper')) {
                _this.contextMenuEl.empty();

                if (_this.movedLayer != null) {
                    _this.menuItemMoveHere.removeClass('disabled');
                    _this.menuItemMoveCancel.removeClass('disabled');
                } else {
                    _this.menuItemMoveHere.addClass('disabled');
                    _this.menuItemMoveCancel.addClass('disabled');
                }
                if (_this.movedLayer != null && _this.movedLayer.id === parseInt($(event.target).closest('.shape-helper').data('id'))) {
                    _this.menuItemMoveHere.addClass('disabled');
                }

                //context menu items
                var targetID = $(event.target).data('id');
                if (!targetID) {
                    targetID = 0;
                }
                _this.contextMenuEl.append('<ul></ul>');
                _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemMoveHere.attr('data-id', targetID)));
                _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemMoveCancel.attr('data-id', targetID)));

                _this.contextMenuEl.appendTo($('body'));
                _this.contextMenuEl.css({
                    'top': event.pageY - $('body').offset().top,
                    'left': event.pageX - $('body').offset().left
                });
                _this.contextMenuEl.focus();

                _this.contextMenuEl.addClass('active');

                _this.menuItemMoveCancel.on('click', function (e) {
                    if ($(e.target).hasClass('disabled')) {
                        e.preventDefault();
                        return false;
                    }
                    _this.movedLayer = null;
                    _this.contextMenuEl.remove();
                });

                _this.menuItemMoveHere.on('click', function (e) {
                    if ($(e.target).hasClass('disabled')) {
                        e.preventDefault();
                        return false;
                    }

                    var destID = parseInt($(e.target).data('id'));
                    if (destID == 0) {
                        if (_this.movedLayer) {
                            _this.movedLayer.parent = null;

                            _this.updateNesting(_this.movedLayer);
                        }
                    } else {
                        var destLayer = _this.app.timeline.getLayer(destID);
                        if (_this.movedLayer) {
                            _this.movedLayer.parent = destLayer.id;

                            _this.updateNesting(_this.movedLayer);
                        }
                    }

                    _this.renderShapes();
                    _this.transformShapes();
                    _this.app.timeline.renderLayers();
                    _this.contextMenuEl.remove();
                    _this.movedLayer = null;
                    _this.highlightShape([destID]);
                });

                event.preventDefault();
                return false;
            }
        });

        this.workspaceWrapper.on('contextmenu', '.shape-helper', function (event) {
            _this.contextMenuEl.empty();

            var scopedLayers = new Array();
            var outOfScopeLayers = new Array();
            _this.app.timeline.layers.forEach(function (layer, index) {
                if (layer.parent == _this.scope) {
                    scopedLayers.push(layer);
                } else {
                    outOfScopeLayers.push(layer);
                }
            });
            if (parseInt($(event.target).closest('.shape-helper').data('id')) === scopedLayers[0].id) {
                _this.menuItemToBackground.addClass('disabled');
            } else {
                _this.menuItemToBackground.removeClass('disabled');
            }

            if (parseInt($(event.target).closest('.shape-helper').data('id')) === scopedLayers[scopedLayers.length - 1].id) {
                _this.menuItemToForeground.addClass('disabled');
            } else {
                _this.menuItemToForeground.removeClass('disabled');
            }

            if (_this.movedLayer != null) {
                _this.menuItemMoveHere.removeClass('disabled');
                _this.menuItemMoveCancel.removeClass('disabled');
            } else {
                _this.menuItemMoveHere.addClass('disabled');
                _this.menuItemMoveCancel.addClass('disabled');
            }
            if (_this.movedLayer != null && _this.movedLayer.id === parseInt($(event.target).closest('.shape-helper').data('id'))) {
                _this.menuItemMoveHere.addClass('disabled');
            }

            //context menu items
            var targetID = $(event.target).closest('.shape-helper').data('id');
            _this.contextMenuEl.append('<ul></ul>');
            _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemToForeground.attr('data-id', targetID)));
            _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemToBackground.attr('data-id', targetID)));
            _this.contextMenuEl.find('ul').append($('<li class="separator"></li>'));
            _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemMoveTo.attr('data-id', targetID)));
            _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemMoveHere.attr('data-id', targetID)));
            _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemMoveCancel.attr('data-id', targetID)));
            _this.contextMenuEl.find('ul').append($('<li class="separator"></li>'));
            _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemDuplicate.attr('data-id', targetID)));
            _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuItemDelete.attr('data-id', targetID)));
            if ($(event.target).hasClass('square-helper')) {
                _this.contextMenuEl.find('ul').append($('<li class="separator"></li>'));
                _this.contextMenuEl.find('ul').append($('<li></li>').append(_this.menuSetScope.attr('data-id', targetID)));

                _this.menuSetScope.on('click', function (e) {
                    _this.setScope(parseInt($(e.target).data('id')));
                    _this.contextMenuEl.remove();
                });
            }

            _this.contextMenuEl.appendTo($('body'));
            _this.contextMenuEl.css({
                'top': event.pageY - $('body').offset().top,
                'left': event.pageX - $('body').offset().left
            });
            _this.contextMenuEl.focus();

            _this.contextMenuEl.addClass('active');

            _this.menuItemDelete.on('click', function (e) {
                var id = parseInt($(e.target).data('id'));
                var index = _this.app.timeline.getLayerIndex(id);
                _this.app.timeline.deleteOneLayer(index);

                _this.contextMenuEl.removeClass('active');
                _this.contextMenuEl.remove();
            });

            _this.menuItemToBackground.on('click', function (e) {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }
                var id = parseInt($(e.target).data('id'));
                var layer = _this.app.timeline.getLayer(id);

                scopedLayers.forEach(function (layer, index) {
                    if (layer.id == id && index > 0) {
                        var tmp = scopedLayers[index - 1];
                        scopedLayers[index - 1] = layer;
                        scopedLayers[index] = tmp;
                        scopedLayers[index - 1].globalShape.setZindex(index - 1);
                        scopedLayers[index].globalShape.setZindex(index);
                    } else {
                        layer.globalShape.setZindex(index);
                    }
                });

                _this.app.timeline.layers = outOfScopeLayers.concat(scopedLayers);

                //render layers
                _this.app.timeline.renderLayers();

                //render shapes
                _this.renderShapes();
                _this.transformShapes();
                _this.app.timeline.selectLayer(id);
                _this.contextMenuEl.remove();
            });

            _this.menuItemToForeground.on('click', function (e) {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }
                var id = parseInt($(e.target).data('id'));
                var layer = _this.app.timeline.getLayer(id);

                scopedLayers.forEach(function (layer, index) {
                    if (layer.id == id && index < (scopedLayers.length - 1)) {
                        var tmp = scopedLayers[index + 1];
                        scopedLayers[index + 1] = layer;
                        scopedLayers[index] = tmp;
                        scopedLayers[index + 1].globalShape.setZindex(index + 1);
                        scopedLayers[index].globalShape.setZindex(index);
                    } else {
                        layer.globalShape.setZindex(index);
                    }
                });

                _this.app.timeline.layers = outOfScopeLayers.concat(scopedLayers);

                //render layers
                _this.app.timeline.renderLayers();

                //render shapes
                _this.renderShapes();
                _this.transformShapes();
                _this.app.timeline.selectLayer(id);
                _this.contextMenuEl.remove();
            });

            _this.menuItemDuplicate.on('click', function (e) {
                var l = _this.app.timeline.getLayer(parseInt($(e.target).data('id')));
                if (l) {
                    var idNewLayer = _this.makeCopy(l);
                    _this.renderShapes();
                    _this.transformShapes();
                    _this.contextMenuEl.remove();
                    _this.highlightShape([idNewLayer]);
                }
            });

            _this.menuItemMoveTo.on('click', function (e) {
                var l = _this.app.timeline.getLayer(parseInt($(e.target).data('id')));
                if (l) {
                    _this.movedLayer = l;
                }
                _this.contextMenuEl.remove();
            });

            _this.menuItemMoveCancel.on('click', function (e) {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }
                _this.movedLayer = null;
                _this.contextMenuEl.remove();
            });

            _this.menuItemMoveHere.on('click', function (e) {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }

                var destID = parseInt($(e.target).data('id'));
                var destLayer = _this.app.timeline.getLayer(destID);
                if (_this.movedLayer) {
                    _this.movedLayer.parent = destLayer.id;
                    _this.updateNesting(_this.movedLayer);
                }

                _this.renderShapes();
                _this.transformShapes();
                _this.app.timeline.renderLayers();
                _this.contextMenuEl.remove();
                _this.movedLayer = null;
                _this.highlightShape([destID]);
            });

            event.preventDefault();
            return false;
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
                _this.workspaceWrapper.find('.tmp-shape').remove();
                _this.renderSingleShape(idLayer);
                _this.transformShapes();
                _this.highlightShape([idLayer]);
                _this.createdLayer = false;
                _this.app.controlPanel.Mode = 0 /* SELECT */;
                $('.tool-btn').removeClass('active');
                $('.tool-btn.select').addClass('active');
                _this.onChangeMode();
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

        this.workspaceContainer.on('mouseover', '.shape-helper, .ui-resizable-handle', function (event) {
            if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                $(event.target).closest('.shape-helper').find('.helpername').show();
            }
        });

        this.workspaceContainer.on('mouseout', '.shape-helper, .ui-resizable-handle', function (event) {
            if (_this.app.controlPanel.Mode == 0 /* SELECT */) {
                $(event.target).closest('.shape-helper').find('.helpername').hide();
            }
        });

        $(document).ready(function () {
            _this.app.controlPanel.displayMainPanel(false, 'font');
            $(document).on('click', '.breadcrumb span:last-child .set-scope', function (e) {
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

            _this.workspaceWrapper.on('dblclick', '.overlay-clickable', function (e) {
                var scopedLayer = _this.app.timeline.getLayer(_this._scope);
                _this.setScope(scopedLayer.parent);
            });
        });
    }
    Workspace.prototype.updateNesting = function (l) {
        var _this = this;
        var parentLayer = this.app.timeline.getLayer(l.parent);
        if (parentLayer) {
            l.nesting = (parentLayer.nesting + 1);
        } else {
            l.nesting = 0;
        }
        this.app.timeline.layers.forEach(function (layer, i) {
            if (layer.parent == l.id) {
                _this.updateNesting(layer);
            }
        });
    };

    Workspace.prototype.onDrawSquare = function (e) {
        var _this = this;
        var new_object = $('<div>').addClass('shape-helper rect tmp-shape');
        var click_y = e.pageY - this.workspaceContainer.offset().top;
        var click_x = e.pageX - this.workspaceContainer.offset().left;
        new_object.css({
            'top': click_y,
            'left': click_x,
            'background': 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')',
            'z-index': this.app.timeline.layers.length,
            'opacity': this.opacity
        });

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
            relativePosition: {
                top: (new_y / this.workspaceContainer.height()) * 100,
                left: (new_x / this.workspaceContainer.width()) * 100
            },
            relativeSize: {
                width: (width / this.workspaceContainer.width()) * 100,
                height: (height / this.workspaceContainer.height()) * 100
            },
            background: c,
            opacity: new_object.css('opacity'),
            zindex: this.app.timeline.layers.length,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: { x: 50, y: 50 },
            scale: 1,
            translate: { x: 0, y: 0, z: 0 },
            relativeTranslate: { x: 0, y: 0 },
            perspective: 0
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

    Workspace.prototype.transformShapes = function (showHelpers) {
        var _this = this;
        if (typeof showHelpers === "undefined") { showHelpers = true; }
        var currentTimestamp = this.app.timeline.pxToMilisec();
        var layers = this.app.timeline.layers;
        layers.forEach(function (layer, index) {
            var shape = _this.workspaceWrapper.find('.shape[data-id="' + layer.id + '"]');
            var helper = _this.workspaceWrapper.find('.shape-helper[data-id="' + layer.id + '"]');

            if (layer.isVisibleOnWorkspace) {
                shape.show();
                if (showHelpers) {
                    helper.show();
                }
                if (layer.id == _this.scope) {
                    helper = _this.workspaceContainer.parent().find('.base-fff');
                }

                var currentLayerId = _this.workspaceWrapper.find('.shape-helper.highlight').first().data('id');

                layer.transform(currentTimestamp, shape, helper, currentLayerId, _this.app, showHelpers);
            } else {
                shape.hide();
                helper.hide();
            }
        });
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

            this.workspaceContainer.parents('.square').append($('<div>').addClass('overlay-clickable'));
            this.workspaceContainer.closest('.square').css({
                'outline': '3px solid #f08080'
            });

            //white-base for container with transparent background
            this.workspaceContainer.parent().append($('<div>').addClass('base-fff').css({
                'background-color': '#fff',
                'width': (this.workspaceContainer.width() / this.workspaceContainer.parent().width()) * 100 + '%',
                'height': (this.workspaceContainer.height() / this.workspaceContainer.parent().height()) * 100 + '%',
                'position': 'absolute',
                'z-index': '10001',
                'top': this.workspaceContainer.position().top,
                'left': this.workspaceContainer.position().left
            }));

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

    Workspace.prototype.renderSingleShapeWithChildren = function (id) {
        var _this = this;
        var shapeEl = $('#workspace').find('.shape[data-id="' + id + '"]');
        var container = this.workspaceContainer;
        if (shapeEl.length) {
            container = shapeEl.parent();
        }

        var layer = this.app.timeline.getLayer(id);
        if (layer) {
            var shape = layer.renderShape(container, this.app.timeline.pxToMilisec(), this.scope);

            this.app.timeline.layers.forEach(function (l, index) {
                if (l.parent == layer.id) {
                    _this.recursiveRenderShape(l.id, shape);
                }
            });
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

    Workspace.prototype.recursiveRenderShape = function (id, container) {
        var _this = this;
        var layer = this.app.timeline.getLayer(id);
        if (layer) {
            var shape = layer.renderShape(container, this.app.timeline.pxToMilisec(), this.scope);

            this.app.timeline.layers.forEach(function (l, index) {
                if (l.parent == layer.id) {
                    _this.recursiveRenderShape(l.id, shape);
                }
            });
        }
    };

    Workspace.prototype.dragResize = function () {
        var _this = this;
        $('.origin-point').draggable();

        //hook draging on shapes
        $('.shape-helper').draggable({
            scroll: false,
            drag: function (event, ui) {
                var id = $(event.target).data('id');
                _this.workspaceContainer.find('.shape[data-id="' + id + '"]').css({
                    'top': ui.position.top + 1,
                    'left': ui.position.left + 1
                });
            },
            stop: function (event, ui) {
                var layer = _this.app.timeline.getLayer($(event.target).data('id'));
                var keyframe = layer.getKeyframeByTimestamp(_this.app.timeline.pxToMilisec());
                var currentShape = _this.getCurrentShape(layer.id);
                if (keyframe == null) {
                    if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                        keyframe = _this.addKeyframe(layer, currentShape, _this.app.timeline.pxToMilisec(), _this.bezier);
                    }
                }

                if (keyframe) {
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1
                    });
                    keyframe.shape.setRelativePosition({
                        top: ((ui.position.top + 1) / _this.workspaceContainer.height()) * 100,
                        left: ((ui.position.left + 1) / _this.workspaceContainer.width()) * 100
                    });

                    if (layer.isMultipleEdit) {
                        layer.getAllKeyframes().forEach(function (k, index) {
                            k.shape.setPosition({
                                top: ui.position.top + 1,
                                left: ui.position.left + 1
                            });
                            k.shape.setRelativePosition({
                                top: ((ui.position.top + 1) / _this.workspaceContainer.height()) * 100,
                                left: ((ui.position.left + 1) / _this.workspaceContainer.width()) * 100
                            });
                        });
                        _this.renderSingleShapeWithChildren(layer.id);
                    }
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
                    if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                        keyframe = _this.addKeyframe(layer, _this.getCurrentShape(layer.id), _this.app.timeline.pxToMilisec(), _this.bezier);
                    }
                }
                if (keyframe) {
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1
                    });
                    keyframe.shape.setRelativePosition({
                        top: ((ui.position.top + 1) / _this.workspaceContainer.height()) * 100,
                        left: ((ui.position.left + 1) / _this.workspaceContainer.width()) * 100
                    });
                    keyframe.shape.setDimensions({
                        width: $(event.target).width(),
                        height: $(event.target).height()
                    });
                    keyframe.shape.setRelativeDimensions({
                        width: (($(event.target).width()) / _this.workspaceContainer.width()) * 100,
                        height: (($(event.target).height()) / _this.workspaceContainer.height()) * 100
                    });

                    if (layer.isMultipleEdit) {
                        layer.getAllKeyframes().forEach(function (k, index) {
                            k.shape.setPosition({
                                top: ui.position.top + 1,
                                left: ui.position.left + 1
                            });
                            k.shape.setRelativePosition({
                                top: ((ui.position.top + 1) / _this.workspaceContainer.height()) * 100,
                                left: ((ui.position.left + 1) / _this.workspaceContainer.width()) * 100
                            });
                            k.shape.setDimensions({
                                width: $(event.target).width(),
                                height: $(event.target).height()
                            });
                            k.shape.setRelativeDimensions({
                                width: (($(event.target).width()) / _this.workspaceContainer.width()) * 100,
                                height: (($(event.target).height()) / _this.workspaceContainer.height()) * 100
                            });
                        });
                        _this.renderSingleShapeWithChildren(layer.id);
                    }
                }

                _this.transformShapes();
                _this.app.timeline.selectLayer(layer.id);
            }
        });
    };

    Workspace.prototype.highlightShape = function (arrayID) {
        var _this = this;
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        this.workspaceContainer.find('.shape-helper').find('.origin-point').hide();

        if (arrayID != null) {
            $('.delete-layer').removeClass('disabled');
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
                        _this.app.controlPanel.updateSkew(shape.parameters.skew);
                        _this.app.controlPanel.updateScale(shape.parameters.scale);
                        _this.app.controlPanel.updateTranslate(shape.parameters.translate);
                        _this.app.controlPanel.updatePerspective(shape.parameters.perspective);

                        //TODO - všechny update!!
                        (_this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]')).find('.origin-point').css({
                            'left': shape.parameters.origin.x + '%',
                            'top': shape.parameters.origin.y + '%'
                        });

                        if (shape instanceof TextField) {
                            var text = shape;
                            var layer = _this.app.timeline.getLayer(id);
                            _this.app.controlPanel.displayMainPanel(true, 'font');
                            _this.app.controlPanel.updateFont(text.getColor(), text.getSize(), layer.globalShape.getFamily());
                        } else {
                            _this.app.controlPanel.displayMainPanel(false, 'font');
                        }

                        if (_this.app.controlPanel.originMode) {
                            (_this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]')).find('.origin-point').show();
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
            $('.delete-layer').addClass('disabled');
        }
    };

    Workspace.prototype.getCurrentShape = function (id, timestamp) {
        if (typeof timestamp === "undefined") { timestamp = null; }
        var layer = this.app.timeline.getLayer(id);
        if (layer) {
            var t = timestamp;
            if (timestamp == null) {
                t = this.app.timeline.pxToMilisec();
            }

            var shape = layer.getShape(t);
            shape.id = id;
            return shape;
        } else {
            return null;
        }
    };

    Workspace.prototype.setColor = function (c, alpha) {
        var _this = this;
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
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                keyframe.shape.setBackground(this.color);

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        k.shape.setBackground(_this.color);
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setFont = function (params, newKeyframe) {
        var _this = this;
        if (typeof newKeyframe === "undefined") { newKeyframe = true; }
        this.fontParameters = params;
        var layer = this.getHighlightedLayer();
        if (layer && layer.getKeyframe(0).shape instanceof TextField) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null && newKeyframe) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }

            if (keyframe != null) {
                var textField = keyframe.shape;
                textField.setFont(this.fontParameters);

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        var textField = k.shape;
                        textField.setFont(_this.fontParameters);
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
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
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                keyframe.shape.setOpacity(opacity);

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        k.shape.setOpacity(opacity);
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setScale = function (scale) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                keyframe.shape.setScale(scale);
                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        k.shape.setScale(scale);
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setDimension = function (axis, dimension) {
        var _this = this;
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                if (axis === 'x') {
                    if (layer.isMultipleEdit) {
                        layer.getAllKeyframes().forEach(function (k, index) {
                            k.shape.setX(dimension);
                            k.shape.setRelativeX((dimension / _this.workspaceContainer.width()) * 100);
                        });

                        this.renderSingleShapeWithChildren(layer.id);
                    } else {
                        keyframe.shape.setX(dimension);
                        keyframe.shape.setRelativeX((dimension / this.workspaceContainer.width()) * 100);
                    }
                } else if (axis === 'y') {
                    keyframe.shape.setY(dimension);
                    keyframe.shape.setRelativeY((dimension / this.workspaceContainer.height()) * 100);

                    if (layer.isMultipleEdit) {
                        layer.getAllKeyframes().forEach(function (k, index) {
                            k.shape.setY(dimension);
                            k.shape.setRelativeY((dimension / _this.workspaceContainer.height()) * 100);
                        });

                        this.renderSingleShapeWithChildren(layer.id);
                    }
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setBorderRadius = function (type, value) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                if (type === 'tl') {
                    keyframe.shape.setBorderRadiusTopLeft(value);
                } else if (type === 'tr') {
                    keyframe.shape.setBorderRadiusTopRight(value);
                } else if (type === 'bl') {
                    keyframe.shape.setBorderRadiusBottomLeft(value);
                } else if (type === 'br') {
                    keyframe.shape.setBorderRadiusBottomRight(value);
                } else if (type === 'all') {
                    keyframe.shape.setBorderRadius(value);
                }

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        if (type === 'tl') {
                            k.shape.setBorderRadiusTopLeft(value);
                        } else if (type === 'tr') {
                            k.shape.setBorderRadiusTopRight(value);
                        } else if (type === 'bl') {
                            k.shape.setBorderRadiusBottomLeft(value);
                        } else if (type === 'br') {
                            k.shape.setBorderRadiusBottomRight(value);
                        } else if (type === 'all') {
                            k.shape.setBorderRadius(value);
                        }
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.set3DRotate = function (type, value) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                if (type === 'x') {
                    keyframe.shape.setRotateX(value);
                } else if (type === 'y') {
                    keyframe.shape.setRotateY(value);
                } else if (type === 'z') {
                    keyframe.shape.setRotateZ(value);
                }

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        if (type === 'x') {
                            k.shape.setRotateX(value);
                        } else if (type === 'y') {
                            k.shape.setRotateY(value);
                        } else if (type === 'z') {
                            k.shape.setRotateZ(value);
                        }
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setPerspective = function (p) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                keyframe.shape.setPerspective(p);

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        k.shape.setPerspective(p);
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setTranslate = function (type, value) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                if (type === 'x') {
                    keyframe.shape.setTranslateX(value);
                    keyframe.shape.setRelativeTranslateX((value / keyframe.shape.parameters.width) * 100);
                } else if (type === 'y') {
                    keyframe.shape.setTranslateY(value);
                    keyframe.shape.setRelativeTranslateY((value / keyframe.shape.parameters.height) * 100);
                } else if (type === 'z') {
                    keyframe.shape.setTranslateZ(value);
                }

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        if (type === 'x') {
                            k.shape.setTranslateX(value);
                            k.shape.setRelativeTranslateX((value / keyframe.shape.parameters.width) * 100);
                        } else if (type === 'y') {
                            k.shape.setTranslateY(value);
                            k.shape.setRelativeTranslateY((value / keyframe.shape.parameters.height) * 100);
                        } else if (type === 'z') {
                            k.shape.setTranslateZ(value);
                        }
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setTransformOrigin = function (type, value) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }

            if (keyframe != null) {
                if (type === 'x') {
                    keyframe.shape.setOriginX(value);
                } else if (type === 'y') {
                    keyframe.shape.setOriginY(value);
                }

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        if (type === 'x') {
                            k.shape.setOriginX(value);
                        } else if (type === 'y') {
                            k.shape.setOriginY(value);
                        }
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setSkew = function (type, value) {
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                if (confirm('Chcete z nového nastavení elementu vytvořit na aktuální pozici nový snímek?')) {
                    keyframe = this.addKeyframe(layer, this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                }
            }
            if (keyframe != null) {
                if (type === 'x') {
                    keyframe.shape.setSkewX(value);
                } else if (type === 'y') {
                    keyframe.shape.setSkewY(value);
                }

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        if (type === 'x') {
                            k.shape.setSkewX(value);
                        } else if (type === 'y') {
                            k.shape.setSkewY(value);
                        }
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }
            }

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setBezier = function (fn) {
        var _this = this;
        this.bezier = fn;
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframeID = this.app.timeline.getSelectedKeyframeID(layer.id);
            var keyframe = layer.getKeyframe(keyframeID);
            if (keyframe != null) {
                keyframe.timing_function = this.bezier;

                if (layer.isMultipleEdit) {
                    layer.getAllKeyframes().forEach(function (k, index) {
                        k.timing_function = _this.bezier;
                    });

                    this.renderSingleShapeWithChildren(layer.id);
                }

                this.app.timeline.renderKeyframes(layer.id);
                this.app.timeline.selectLayer(layer.id, keyframeID);
            }
        }
    };

    Workspace.prototype.updateBezierCurve = function (layer) {
        this.app.controlPanel.displayMainPanel(true, 'bezier');
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe) {
                this.app.controlPanel.updateBezierCurve(keyframe.timing_function);
            }
        }
    };

    Workspace.prototype.updateBezierCurveByKeyframe = function (keyframe) {
        this.app.controlPanel.displayMainPanel(true, 'bezier');
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

            this.renderSingleShapeWithChildren(layer.id);
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
        if (x != null && y != null) {
            newDimension = {
                width: x,
                height: y
            };
        } else if (x != null) {
            newDimension = {
                width: x,
                height: this._workspaceSize.height
            };
        } else if (y != null) {
            newDimension = {
                width: this._workspaceSize.width,
                height: y
            };
        }

        this._workspaceSize = newDimension;
        $('#workspace').css(this._workspaceSize);
        $('.workspace-wrapper').perfectScrollbar('update');
        this.transformShapes();
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

    Workspace.prototype.loadMode = function () {
        var _this = this;
        this.dialogEl.empty();
        $('body').find(this.dialogEl).remove();
        this.dialogEl.append(this.loadAreaWrapper);
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            title: 'Nahrát projekt ze souboru',
            autoOpen: true,
            draggable: false,
            width: 550,
            resizable: false,
            modal: true,
            closeOnEscape: true,
            close: function (event, ui) {
                _this.dialogEl.remove();
                _this.app.controlPanel.Mode = 0 /* SELECT */;
                _this.onChangeMode();
                $('.tool-btn').removeClass('active');
                $('.tool-btn.select').addClass('active');
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');

        this.loadArea.on('dragenter', function (event) {
            $(event.target).addClass('over');
        });

        this.loadArea.on('dragleave', function (event) {
            $(event.target).removeClass('over');
        });

        this.loadArea.on('dragover', function (event) {
            event.preventDefault();
        });

        this.loadArea.on('drop', function (event) {
            event.stopPropagation();
            event.preventDefault();
            var files = event.originalEvent.dataTransfer.files;
            _this.uploadFile(files);
            $(event.target).removeClass('over');
        });

        this.loadBtn.on('change', function (event) {
            _this.uploadFile(event.target.files);
        });

        this.loadArea.on('click', function (event) {
            _this.loadBtn.click();
        });
    };

    Workspace.prototype.uploadFile = function (files) {
        var _this = this;
        var file = files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
            if (file.name.split('.').pop() == 'json') {
                _this.parseJson(e.target.result);
            } else {
                $('#message-dialog').attr('title', 'Chyba').html('Vložený soubor není typu .json. Vložte správný soubor.');
                $("#message-dialog").dialog({
                    dialogClass: 'message-dialog',
                    modal: false,
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                        }
                    }
                });
                $('.ui-dialog-titlebar-close').empty().append('X');
            }
            _this.loadBtn.val('');

            _this.dialogEl.remove();
            _this.app.controlPanel.Mode = 0 /* SELECT */;
            $('.tool-btn').removeClass('active');
            $('.tool-btn.select').addClass('active');
            _this.onChangeMode();
        };

        reader.readAsText(file);
    };

    Workspace.prototype.parseJson = function (data) {
        var newLayers = new Array();
        var maxCount = 0;

        //parse fron JSON
        var workspaceSize = JSON.parse(data)[0];
        var repeatAnimation = JSON.parse(data)[1];
        var objLayers = JSON.parse(data)[2];
        this.setWorkspaceDimension(parseInt(workspaceSize.x), parseInt(workspaceSize.y));
        this.app.controlPanel.updateWorkspaceDimension(this._workspaceSize);
        this.app.timeline.repeat = repeatAnimation;

        objLayers.forEach(function (obj, i) {
            if (obj._type == 0 /* DIV */) {
                var newLayer = RectangleLayer.parseJson(obj);
            } else if (obj._type == 1 /* TEXT */) {
                var newLayer = TextLayer.parseJson(obj);
            } else if (obj._type == 3 /* IMAGE */) {
                var newLayer = ImageLayer.parseJson(obj);
            } else if (obj._type == 2 /* SVG */) {
                var newLayer = SvgLayer.parseJson(obj);
            }

            newLayers.push(newLayer);
            if (maxCount < newLayer.id) {
                maxCount = newLayer.id;
            }
        });

        Layer.counter = maxCount;
        this.app.timeline.layers = newLayers;
        this.renderShapes();
        this.app.timeline.renderLayers();
        this.transformShapes();
        this.highlightShape(null);
    };

    Workspace.prototype.svgMode = function () {
        var _this = this;
        this.dialogEl.empty();
        $('body').find(this.dialogEl).remove();
        this.dialogEl.append(this.svgTextArea);
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            title: 'Vložit SVG z kódu',
            autoOpen: true,
            draggable: false,
            height: 440,
            width: 550,
            resizable: false,
            modal: true,
            closeOnEscape: true,
            close: function (event, ui) {
                _this.dialogEl.remove();
                _this.app.controlPanel.Mode = 0 /* SELECT */;
                _this.onChangeMode();
                $('.tool-btn').removeClass('active');
                $('.tool-btn.select').addClass('active');
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');

        this.svgUploadArea.on('dragenter', function (event) {
            $(event.target).addClass('over');
        });

        this.svgUploadArea.on('dragleave', function (event) {
            $(event.target).removeClass('over');
        });

        this.svgUploadArea.on('dragover', function (event) {
            event.preventDefault();
        });

        this.svgUploadArea.on('drop', function (event) {
            event.stopPropagation();
            event.preventDefault();
            var files = event.originalEvent.dataTransfer.files;
            _this.uploadSvgFile(files);
            $(event.target).removeClass('over');
        });

        this.svgUploadInput.on('change', function (event) {
            _this.uploadSvgFile(event.target.files);
        });

        this.svgUploadArea.on('click', function (event) {
            _this.svgUploadInput.click();
        });

        this.svgInsertBtn.on('click', function (e) {
            var xmlString = _this.svgText.val();
            _this.saveSvgText(xmlString);
        });
    };

    Workspace.prototype.saveSvgText = function (svg) {
        var xmlString = svg;
        var parser = new DOMParser();
        var doc;
        try  {
            doc = parser.parseFromString(xmlString, "image/svg+xml");
        } catch (e) {
            alert('Nevalidní kód');
            return false;
        }

        var isError;
        try  {
            isError = true;
            isError = this.isParseError(doc);
        } catch (e) {
            //is IE
            isError = false;
        }

        if (!isError) {
            var width = 150;
            var height = 150;

            for (var j = 0; j < doc.childNodes.length; j++) {
                var child = doc.childNodes[j];
                if (child.nodeName === 'svg' && child.attributes) {
                    for (var i = 0; i < child.attributes.length; i++) {
                        var attr = child.attributes[i];
                        if (attr.name == 'viewBox') {
                            var view = attr.value.match(/-?[\d\.]+/g);
                            width = parseFloat(view[2]);
                            height = parseFloat(view[3]);
                        }
                    }
                }
            }

            var p = {
                top: 0,
                left: 0,
                width: width,
                height: height,
                relativeSize: { width: ((width / this.workspaceContainer.width()) * 100), height: ((height / this.workspaceContainer.height()) * 100) },
                relativePosition: { top: 0, left: 0 },
                background: { r: 255, g: 255, b: 255, a: 0 },
                opacity: 1,
                borderRadius: [0, 0, 0, 0],
                rotate: { x: 0, y: 0, z: 0 },
                skew: { x: 0, y: 0 },
                origin: { x: 50, y: 50 },
                zindex: this.app.timeline.layers.length,
                scale: 1,
                translate: { x: 0, y: 0, z: 0 },
                relativeTranslate: { x: 0, y: 0 },
                perspective: 0
            };

            var svgShape = new Svg(p, xmlString);
            var layer = new SvgLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), svgShape);
            var parent = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
            layer.parent = parent;
            if (layer.parent) {
                layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
            }
            var idLayer = this.app.timeline.addLayer(layer);
            this.renderSingleShape(idLayer);
            this.transformShapes();
            this.highlightShape([idLayer]);

            this.dialogEl.remove();
            this.app.controlPanel.Mode = 0 /* SELECT */;
            this.svgText.val('');
            $('.tool-btn').removeClass('active');
            $('.tool-btn.select').addClass('active');
            this.onChangeMode();
        } else {
            alert('Nevalidní kód');
        }
    };

    Workspace.prototype.imageMode = function () {
        var _this = this;
        this.dialogEl.empty();
        $('body').find(this.dialogEl).remove();
        this.dialogEl.append(this.uploadAreaWrapper);
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            title: 'Nahrát obrázek',
            autoOpen: true,
            draggable: false,
            width: 550,
            resizable: false,
            modal: true,
            closeOnEscape: true,
            close: function (event, ui) {
                _this.dialogEl.remove();
                _this.app.controlPanel.Mode = 0 /* SELECT */;
                _this.onChangeMode();
                $('.tool-btn').removeClass('active');
                $('.tool-btn.select').addClass('active');
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');

        this.uploadArea.on('dragenter', function (event) {
            $(event.target).addClass('over');
        });

        this.uploadArea.on('dragleave', function (event) {
            $(event.target).removeClass('over');
        });

        this.uploadArea.on('dragover', function (event) {
            event.preventDefault();
        });

        this.uploadArea.on('drop', function (event) {
            event.stopPropagation();
            event.preventDefault();
            var files = event.originalEvent.dataTransfer.files;
            _this.uploadImage(files);
            $(event.target).removeClass('over');
        });

        this.uploadBtn.on('change', function (event) {
            _this.uploadImage(event.target.files);
        });

        this.uploadArea.on('click', function (event) {
            _this.uploadBtn.click();
        });
    };

    Workspace.prototype.uploadSvgFile = function (files) {
        var _this = this;
        var file = files[0];
        if (file.type.match('image/svg.*')) {
            var reader = new FileReader();
            reader.onload = function (e) {
                _this.saveSvgText(e.target.result);
            };

            reader.readAsText(file);
        } else {
            alert('Nesprávný formát souboru');
        }
    };

    Workspace.prototype.uploadImage = function (files) {
        var _this = this;
        var file = files[0];
        if (file.type.match('image.*')) {
            var img = new Image();
            var reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
                img.onload = function (ev) {
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var MAX_WIDTH = $('#workspace').width();
                    var MAX_HEIGHT = $('#workspace').height();
                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    var dataurl = canvas.toDataURL();
                    var p = {
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                        relativeSize: { width: ((width / _this.workspaceContainer.width()) * 100), height: ((height / _this.workspaceContainer.height()) * 100) },
                        relativePosition: { top: 0, left: 0 },
                        background: { r: 255, g: 255, b: 255, a: 0 },
                        opacity: 1,
                        borderRadius: [0, 0, 0, 0],
                        rotate: { x: 0, y: 0, z: 0 },
                        skew: { x: 0, y: 0 },
                        origin: { x: 50, y: 50 },
                        zindex: _this.app.timeline.layers.length,
                        scale: 1,
                        translate: { x: 0, y: 0, z: 0 },
                        relativeTranslate: { x: 0, y: 0 },
                        perspective: 0
                    };
                    var image = new Img(p, dataurl);
                    var layer = new ImageLayer('Vrstva ' + (Layer.counter + 1), _this.getBezier(), image);
                    var parent = _this.workspaceContainer.data('id') ? _this.workspaceContainer.data('id') : null;
                    layer.parent = parent;
                    if (layer.parent) {
                        layer.nesting = (_this.app.timeline.getLayer(layer.parent).nesting + 1);
                    }
                    var idLayer = _this.app.timeline.addLayer(layer);
                    _this.renderSingleShape(idLayer);
                    _this.transformShapes();
                    _this.highlightShape([idLayer]);
                };
            };

            reader.readAsDataURL(file);
        } else {
            $('#message-dialog').attr('title', 'Chyba').html('Vložený obrázek má nepodporovaný formát. Vložte soubor typu .jpg, .png nebo .gif');
            $("#message-dialog").dialog({
                dialogClass: 'message-dialog',
                modal: false,
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                    }
                }
            });
            $('.ui-dialog-titlebar-close').empty().append('X');
        }
        this.uploadBtn.val('');

        this.dialogEl.remove();
        this.app.controlPanel.Mode = 0 /* SELECT */;
        $('.tool-btn').removeClass('active');
        $('.tool-btn.select').addClass('active');
        this.onChangeMode();
    };

    Workspace.prototype.onCreateText = function (e) {
        var top = e.pageY - this.workspaceContainer.offset().top - 10;
        var left = e.pageX - this.workspaceContainer.offset().left - 5;
        var width = 150;
        var height = 75;

        var params = {
            top: top,
            left: left,
            width: width,
            height: height,
            relativeSize: { width: ((width / this.workspaceContainer.width()) * 100), height: ((height / this.workspaceContainer.height()) * 100) },
            relativePosition: { top: ((top / this.workspaceContainer.height()) * 100), left: ((left / this.workspaceContainer.width()) * 100) },
            background: { r: 255, g: 255, b: 255, a: 0 },
            opacity: 1,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: { x: 50, y: 50 },
            zindex: this.app.timeline.layers.length,
            scale: 1,
            translate: { x: 0, y: 0, z: 0 },
            relativeTranslate: { x: 0, y: 0 },
            perspective: 0
        };

        var shape = new TextField(params, null, this.fontParameters.color, this.fontParameters.size, this.fontParameters.fontFamily);
        var layer = new TextLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), shape);
        var parent = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
        layer.parent = parent;
        if (layer.parent) {
            layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
        }
        var idLayer = this.app.timeline.addLayer(layer);
        this.renderSingleShape(layer.id);
        this.transformShapes();
        this.highlightShape([idLayer]);
        this.tooltip.remove();
        this.onChangeMode();
    };

    Workspace.prototype.onChangeText = function (id, text) {
        var shape = this.app.timeline.getLayer(id).globalShape;
        shape.setContent(text);
    };

    Workspace.prototype.onChangeMode = function () {
        var _this = this;
        var mode = this.app.controlPanel.Mode;
        if (mode == 1 /* CREATE_DIV */) {
            $('.workspace-wrapper').addClass('insert-mode');
        } else {
            $('.workspace-wrapper').removeClass('insert-mode');
        }

        if (mode == 0 /* SELECT */) {
            $('.shape-helper').draggable('enable');
            $('.origin-point').draggable('enable');
            $('.shape-helper').resizable('enable');
        } else {
            $('.shape-helper').draggable('disable');
            $('.origin-point').draggable('disable');
            $('.shape-helper').resizable('disable');
        }

        if (mode == 2 /* IMAGE */ || mode == 4 /* SVG */ || mode == 5 /* LOAD */) {
            if (mode == 2 /* IMAGE */) {
                this.imageMode();
            } else if (mode == 4 /* SVG */) {
                this.svgMode();
            } else if (mode == 5 /* LOAD */) {
                this.loadMode();
            }
        }

        if (mode == 3 /* TEXT */) {
            $('.workspace-wrapper').addClass('text-mode');
            $('.froala').froala('enable');
            $('.froala').removeClass('nonedit');
            if (this.workspaceContainer.find('.shape.text').length == 0) {
                $('.workspace-wrapper').mousemove(function (e) {
                    _this.tooltip.css({
                        'top': e.pageY - _this.workspaceWrapper.offset().top - 20,
                        'left': e.pageX - _this.workspaceWrapper.offset().left + 10
                    });
                });

                this.workspaceWrapper.mouseenter(function (e) {
                    _this.workspaceWrapper.append(_this.tooltip);
                });
                this.workspaceWrapper.mouseleave(function (e) {
                    _this.tooltip.remove();
                });
            } else {
                this.tooltip.remove();
                this.workspaceWrapper.unbind('mouseenter').unbind('mouseleave');
            }
            this.workspaceContainer.find('.shape.text').each(function (index, el) {
                $(el).css({
                    'z-index': parseInt(_this.workspaceContainer.find('.shape-helper' + '[data-id="' + $(el).data('id') + '"]').css('z-index')) + 1
                });
            });
        } else {
            this.tooltip.remove();
            this.workspaceWrapper.unbind('mouseenter').unbind('mouseleave');
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

    Workspace.prototype.addKeyframe = function (layer, shape, timestamp, timing_function) {
        if (layer.parent != null) {
            var arrayMax = Function.prototype.apply.bind(Math.max, null);
            var parentLayer = this.app.timeline.getLayer(layer.parent);
            var maxTimestamp = arrayMax(parentLayer.timestamps);
            if (timestamp > maxTimestamp && maxTimestamp != 0) {
                timestamp = maxTimestamp;
                alert('Doba animace je omezena animací nadřazeného prvku na ' + maxTimestamp / 1000 + 's. Snímek bude posunut na tuto pozici.');
            }
        }

        if (layer.getKeyframeByTimestamp(timestamp) === null) {
            var newKeyframe = layer.addKeyframe(shape, timestamp, this.app.workspace.getBezier());
            this.app.timeline.renderKeyframes(layer.id);
            return newKeyframe;
        } else {
            return null;
        }
    };

    Workspace.prototype.setScope = function (id) {
        this._scope = id;
        this.scopeOverlay.remove();

        if (this.scope != null) {
            this.scopeOverlay.css({
                'top': this.workspaceWrapper.scrollTop()
            });
            this.workspaceWrapper.prepend(this.scopeOverlay);

            $('.workspace-wrapper').perfectScrollbar('destroy');
        } else {
            this.workspaceContainer = this.workspaceContainerOriginal;
            $('.workspace-wrapper').perfectScrollbar({ includePadding: true });
        }
        this.app.timeline.buildBreadcrumb(this.scope);
        this.app.timeline.renderLayers();
        this.renderShapes();
        if (this.scope) {
            this.app.timeline.getLayer(this.scope).lastTransformKeyframe = null;
        }

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

    Workspace.prototype.isParseError = function (parsedDocument) {
        var parser = new DOMParser(), errorneousParse = parser.parseFromString('<', 'text/xml'), parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

        if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
            return parsedDocument.getElementsByTagName("parsererror").length > 0;
        }

        return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
    };

    Workspace.prototype.makeCopy = function (l, idParent) {
        if (typeof idParent === "undefined") { idParent = null; }
        var shape = this.getCurrentShape(l.id);
        if (l.parent == null) {
            shape.setPosition({
                top: shape.parameters.top + 50,
                left: shape.parameters.left + 50
            });
            shape.setRelativePosition({
                top: ((shape.parameters.top) / this.workspaceContainer.height()) * 100,
                left: ((shape.parameters.left) / this.workspaceContainer.width()) * 100
            });
        }
        if (shape instanceof Rectangle) {
            var layer = new RectangleLayer(l.name + ' - kopie', this.getBezier(), shape);
        } else if (shape instanceof TextField) {
            var layer = new TextLayer(l.name + ' - kopie', this.getBezier(), shape);
        } else if (shape instanceof Svg) {
            shape.setSrc(l.globalShape.getSrc(), l.globalShape.base64);
            var layer = new SvgLayer(l.name + ' - kopie', this.getBezier(), shape);
        } else if (shape instanceof Img) {
            var layer = new ImageLayer(l.name + ' - kopie', this.getBezier(), shape);
        }
        if (idParent == null) {
            layer.parent = l.parent;
        } else {
            layer.parent = idParent;
        }
        if (layer.parent) {
            layer.nesting = l.nesting;
        }
        var idLayer = this.app.timeline.addLayer(layer);
        shape.id = idLayer;

        for (var i = this.app.timeline.layers.length - 1; i >= 0; i--) {
            if (this.app.timeline.layers[i].parent == l.id) {
                this.makeCopy(this.app.timeline.layers[i], idLayer);
            }
        }

        return idLayer;
    };

    Workspace.prototype.insertLayerFromGallery = function (svg) {
        var layer = new SvgLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), svg);
        var parent = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
        layer.parent = parent;
        if (layer.parent) {
            layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
        }
        var idLayer = this.app.timeline.addLayer(layer);
        this.renderSingleShape(idLayer);
        this.transformShapes();
        this.highlightShape([idLayer]);
    };

    Workspace.prototype.performanceTest = function (n) {
        if (typeof n === "undefined") { n = 5; }
        function rand(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for (var i = 0; i < n; i++) {
            var diameter = rand(10, 30);
            var params = {
                top: 0,
                left: 0,
                width: diameter,
                height: diameter,
                relativePosition: {
                    top: (0 / this.workspaceContainer.height()) * 100,
                    left: (0 / this.workspaceContainer.width()) * 100
                },
                relativeSize: {
                    width: (diameter / this.workspaceContainer.width()) * 100,
                    height: (diameter / this.workspaceContainer.height()) * 100
                },
                background: { r: rand(1, 254), g: rand(1, 254), b: rand(1, 254), a: 1 },
                opacity: 1,
                zindex: this.app.timeline.layers.length,
                borderRadius: [50, 50, 50, 50],
                rotate: { x: 0, y: 0, z: 0 },
                skew: { x: 0, y: 0 },
                origin: { x: 50, y: 50 },
                scale: 1,
                translate: { x: 0, y: 0, z: 0 },
                relativeTranslate: { x: 0, y: 0 },
                perspective: 0
            };

            var shape = new Rectangle(params);
            var layer = new RectangleLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), shape);
            var idLayer = this.app.timeline.addLayer(layer);
            var t = rand(0, this._workspaceSize.height);
            var l = rand(0, this._workspaceSize.width);
            var paramsNew = {
                top: t,
                left: l,
                width: diameter,
                height: diameter,
                relativePosition: {
                    top: (t / this.workspaceContainer.height()) * 100,
                    left: (l / this.workspaceContainer.width()) * 100
                },
                relativeSize: {
                    width: (diameter / this.workspaceContainer.width()) * 100,
                    height: (diameter / this.workspaceContainer.height()) * 100
                },
                background: { r: rand(1, 254), g: rand(1, 254), b: rand(1, 254), a: 1 },
                opacity: 1,
                zindex: this.app.timeline.layers.length,
                borderRadius: [50, 50, 50, 50],
                rotate: { x: 0, y: 0, z: 0 },
                skew: { x: 0, y: 0 },
                origin: { x: 50, y: 50 },
                scale: 1,
                translate: { x: 0, y: 0, z: 0 },
                relativeTranslate: { x: 0, y: 0 },
                perspective: 0
            };

            layer.addKeyframe(new Rectangle(paramsNew), 4000, this.getBezier());
            this.app.timeline.renderKeyframes(layer.id);
            this.renderSingleShape(layer.id);
        }
        this.transformShapes();
    };
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
        this.isLockedBorderRadius = true;
        this.fontFamily = ['Segoe UI', 'Georgia', 'Times', 'Arial', 'Calibri', 'Verdana', 'serif', 'sans-serif'];
        this.toolPanelEl = $('<div>').addClass('tool-panel');
        this.aboutDialogEl = $('<div>').attr('id', 'dialog').html('<p></p>').attr('title', 'Informace o aplikaci');
        this.newProjectEl = $('<a>').attr('href', '#').addClass('tool-btn').addClass('new').addClass('tooltip').html('<i class="fa fa-eraser"></i>').attr('title', 'Nový projekt');
        this.selectToolEl = $('<a>').attr('href', '#').addClass('tool-btn').addClass('select').addClass('tooltip').html('<i class="fa fa-location-arrow fa-flip-horizontal"></i>').attr('title', 'Nástroj pro výběr');
        this.createDivToolEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('create-div').html('<i class="fa fa-stop"></i>').attr('title', 'Nový kontejner');
        this.generateCodeEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('generate-code').html('<i class="fa fa-download"></i>').attr('title', 'Vygenerovat kód');
        this.insertImageEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('insert-image').html('<i class="fa fa-file-image-o"></i>').attr('title', 'Vložit obrázek');
        this.insertTextEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip insert-text').html('<i class="fa fa-font"</i>').attr('title', 'Vložit text');
        this.insertSVGEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip insert-svg').html('<i class="fa fa-file-code-o"></i>').attr('title', 'Vložit kód s SVG');
        this.saveEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip save').html('<i class="fa fa-floppy-o"></i>').attr('title', 'Uložit projekt');
        this.loadEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip load').html('<i class="fa fa-file-text-o"></i>').attr('title', 'Načíst projekt ze souboru');
        this.svgGalleryEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip svg-gallery').html('<i class="fa fa-smile-o"></i>').attr('title', 'SVG galerie');
        this.aboutEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip about').html('<i class="fa fa-info-circle"></i>').attr('title', 'O aplikaci');
        this.controlPanelEl = $('<div>').addClass('control-panel');
        this.bgPickerEl = $('<input type="text" id="picker"></input>');
        this.bgOpacityEl = $('<input>').attr('id', 'bgopacity').addClass('number');
        this.bgOpacitySliderEl = $('<div>').addClass('bgopacity-slider');
        this.mainPanel = $('<div>').addClass('main-panel');
        this.itemControlEl = $('<div>').addClass('control-item');
        this.opacityEl = $('<input>').attr('id', 'opacity-input');
        this.opacitySliderEl = $('<div>').addClass('opacity-slider');
        this.dimensionXEl = $('<input type="text"></input').attr('id', 'dimension-x');
        this.dimensionYEl = $('<input type="text"></input').attr('id', 'dimension-y');
        this.borderRadiusTLEl = $('<input type="text"></input').attr('id', 'radius-tl').addClass('border-radius-input').attr('data-type', 'tl');
        this.borderRadiusTREl = $('<input type="text"></input').attr('id', 'radius-tr').addClass('border-radius-input').attr('data-type', 'tr');
        this.borderRadiusBLEl = $('<input type="text"></input').attr('id', 'radius-bl').addClass('border-radius-input').attr('data-type', 'bl');
        this.borderRadiusBREl = $('<input type="text"></input').attr('id', 'radius-br').addClass('border-radius-input').attr('data-type', 'br');
        this.borderRadiusSwitch = $('<span>').addClass('border-radius-switch locked tooltip').html('<a href="#"><i class="fa fa-lock"></i></a>').attr('title', 'Budou všechny okraje stejné?');
        this.borderRadiusHelperEl = $('<div>').addClass('border-radius-helper');
        this.graph = $('<div>').addClass('graph');
        this.point0 = $('<a>').addClass('point p0').attr('href', '#');
        this.point1 = $('<a>').addClass('point p1').attr('href', '#');
        this.point2 = $('<a>').addClass('point p2').attr('href', '#');
        this.point3 = $('<a>').addClass('point p3').attr('href', '#');
        this.canvas = $('<canvas id="bezierCurve" width="200" height="200"></canvas>');
        this.workspaceWidthEl = $('<input type="text"></input>').attr('id', 'workspace-y').addClass('number');
        this.workspaceHeightEl = $('<input type="text"></input>').attr('id', 'workspace-x').addClass('number');
        this.animationSetSelectEl = $('<select>').attr('id', 'animation-type').addClass('animation-select');
        this.animationSetSubmitEl = $('<a>').attr('href', '#').html('Vložit').addClass('btn animationset-btn');
        this.idEl = $('<input type="text"></input>').attr('id', 'id-el');
        this.scaleEl = $('<input>').attr('id', 'scale-input');
        this.scaleSliderEl = $('<div>').addClass('scale-slider');
        this.translateXEl = $('<input>').attr('id', 'translatex').addClass('translate');
        this.translateXSliderEl = $('<div>').addClass('translate-slider').attr('id', 'translatex');
        this.translateYEl = $('<input>').attr('id', 'translatey').addClass('translate');
        this.translateYSliderEl = $('<div>').addClass('translate-slider').attr('id', 'translatey');
        this.translateZEl = $('<input>').attr('id', 'translatez').addClass('translate');
        this.translateZSliderEl = $('<div>').addClass('translate-slider').attr('id', 'translatez');
        this.rotateXEl = $('<input>').attr('id', 'rx').addClass('number rotate');
        this.rotateXSliderEl = $('<div>').addClass('rotate-slider').attr('id', 'rx');
        this.rotateYEl = $('<input>').attr('id', 'ry').addClass('number rotate');
        this.rotateYSliderEl = $('<div>').addClass('rotate-slider').attr('id', 'ry');
        this.rotateZEl = $('<input>').attr('id', 'rz').addClass('number rotate');
        this.rotateZSliderEl = $('<div>').addClass('rotate-slider').attr('id', 'rz');
        this.perspectiveEl = $('<input>').attr('id', 'perspective').addClass('number rotate');
        this.perspectiveSliderEl = $('<div>').addClass('perspective-slider').attr('id', 'perspective');
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

        this.toolPanelEl.append(this.newProjectEl);
        this.toolPanelEl.append(this.loadEl);
        this.toolPanelEl.append(this.saveEl);
        this.toolPanelEl.append(this.generateCodeEl);
        this.toolPanelEl.append($('<div>').addClass('deliminer'));
        this.toolPanelEl.append(this.selectToolEl);
        this.toolPanelEl.append(this.createDivToolEl);
        this.toolPanelEl.append(this.insertImageEl);
        this.toolPanelEl.append(this.insertTextEl);
        this.toolPanelEl.append(this.insertSVGEl);
        this.toolPanelEl.append(this.svgGalleryEl);
        this.toolPanelEl.append($('<div>').addClass('deliminer'));
        this.toolPanelEl.append(this.aboutEl);
        this.containerEl.append(this.toolPanelEl);

        this.controlPanelEl.append(this.mainPanel);
        this.controlPanelEl.append($('<div>').addClass('clearfix'));

        //Animation set
        var ans = Animations.animations;
        ans.forEach(function (v, i) {
            _this.animationSetSelectEl.append($("<option>").attr('value', i).text(v.name));
        });

        var animation = this.itemControlEl.clone();
        animation.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Hotové animace k použití</h2></a>');
        var row = $('<div>').addClass('row tooltip-delay').attr('title', 'Vloží vybranou animaci, která se skládá ze setu klíčových snímků. Animace se aplikuje na právě vybranou vrstvu a nahradí stávající klíčové snímky.');
        row.append(this.animationSetSelectEl);
        row.append(this.animationSetSubmitEl);
        var expand = $('<div>').addClass('expand').css({ 'margin-top': '5px' });
        expand.append(row);
        animation.append(expand);
        this.controlPanelEl.append(animation);

        //Workspace dimensions
        var workspaceXY = this.itemControlEl.clone();
        workspaceXY.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Rozměry hlavního plátna</h2></a>');
        var row = $('<div>').addClass('row');
        var w = $('<div>').html('width: ').addClass('group half');
        w.append(this.workspaceWidthEl.val(this.app.workspace.workspaceSize.width.toString()));
        w.append(' px');
        row.append(w);
        var h = $('<div>').html('height: ').addClass('group half last');
        h.append(this.workspaceHeightEl.val(this.app.workspace.workspaceSize.height.toString()));
        h.append((' px'));
        row.append(h);
        var expand = $('<div>').addClass('expand');
        expand.append(row);
        workspaceXY.append(expand);
        this.controlPanelEl.append(workspaceXY);

        var idElement = this.itemControlEl.clone();
        idElement.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Nastavit ID elementu</h2></a>');
        var row = $('<div>').addClass('row');
        var g = $('<div>').html('#').addClass('group full');
        g.append(this.idEl);
        row.append(g);
        var expand = $('<div>').addClass('expand');
        expand.append(row);
        idElement.append(expand);
        this.controlPanelEl.append(idElement);

        //Bezier curve
        var curve = this.itemControlEl.clone();
        curve.html('<a href="#" class="expand-link tooltip-delay" title="cubic-bezier()"><i class="fa fa-caret-right"></i><h2>Časový průběh animace</h2></a>');
        this.graph.append(this.point0);
        this.graph.append(this.point1);
        this.graph.append(this.point2);
        this.graph.append(this.point3);
        this.graph.append(this.canvas);
        var expand = $('<div>').addClass('expand init-visible expand-bezier');

        expand.append(this.graph);
        expand.append($('<span>').addClass('cubic-bezier').html('cubic-bezier(<span id="p0">0</span>, <span id="p1">0</span>, <span id="p2">0</span>, <span id="p3">0</span>)'));
        curve.append(expand);

        this.curve = curve;
        this.mainPanel.append(curve);

        //background
        var newItem = this.itemControlEl.clone();
        newItem.html('<a href="#" class="expand-link tooltip-delay" title="background-color"><i class="fa fa-caret-right"></i><h2>Barva pozadí elementu</h2></a>');
        var row = $('<div>').addClass('row');
        var s = $('<div>').html('#').addClass('group quarter');
        s.append(this.bgPickerEl.val($.colpick.rgbToHex(this.initColor)));
        row.append(s);
        var a = $('<div>').html('alpha opacity:<br>').addClass('group quarter-3');
        this.bgOpacityEl.val('0');
        a.append(this.bgOpacitySliderEl);
        a.append(this.bgOpacityEl);
        row.append(a);
        var expand = $('<div>').addClass('expand init-visible');
        expand.append(row);
        newItem.append(expand);
        this.controlPanelEl.append(newItem);

        //opacity
        var opacity = this.itemControlEl.clone();
        opacity.html('<a href="#" class="expand-link tooltip-delay" title="opacity"><i class="fa fa-caret-right"></i><h2>Průhlednost elementu</h2></a>');
        this.opacityEl.val('1');
        var expand = $('<div>').addClass('expand');
        expand.append(this.opacitySliderEl);
        expand.append(this.opacityEl);
        opacity.append(expand);
        this.controlPanelEl.append(opacity);

        //dimensions
        var dim = this.itemControlEl.clone();
        dim.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Rozměry elementu</h2></a>');
        var row = $('<div>').addClass('row');
        var w = $('<div>').html('width: ').addClass('group half');
        w.append(this.dimensionXEl);
        w.append(' px');
        row.append(w);
        var h = $('<div>').html('height: ').addClass('group half last');
        h.append(this.dimensionYEl);
        h.append(' px');
        row.append(h);
        var expand = $('<div>').addClass('expand');
        expand.append(row);
        dim.append(expand);
        this.controlPanelEl.append(dim);

        //border-radius
        var radius = this.itemControlEl.clone();
        radius.html('<a href="#" class="expand-link tooltip-delay" title="border-radius"><i class="fa fa-caret-right"></i><h2>Zaoblení rohů</h2></a>');
        var rlWrapper = $('<div>').attr('id', 'radius-tl-wrapper').append(this.borderRadiusTLEl.val('0'));
        this.borderRadiusHelperEl.append(rlWrapper.append('%'));
        var trWrapper = $('<div>').attr('id', 'radius-tr-wrapper').append(this.borderRadiusTREl.val('0'));
        this.borderRadiusHelperEl.append(trWrapper.append('%'));
        var blWrapper = $('<div>').attr('id', 'radius-bl-wrapper').append(this.borderRadiusBLEl.val('0'));
        this.borderRadiusHelperEl.append(blWrapper.append('%'));
        var brWrapper = $('<div>').attr('id', 'radius-br-wrapper').append(this.borderRadiusBREl.val('0'));
        this.borderRadiusHelperEl.append(brWrapper.append('%'));
        this.borderRadiusHelperEl.append(this.borderRadiusSwitch);
        var expand = $('<div>').addClass('expand');
        expand.append(this.borderRadiusHelperEl);
        radius.append(expand);
        this.controlPanelEl.append(radius);

        //Font
        var font = this.itemControlEl.clone();
        this.fontSizeEl.val(this.initFontSize.toString());
        this.fontColorEl.val($.colpick.rgbToHex(this.initTextColor));
        font.html('<a href="#" class="expand-link tooltip-delay" title="font-size, font-family, color"><i class="fa fa-caret-right"></i><h2>Nastavení vlastností textu</h2></a>');
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
        var expand = $('<div>').addClass('expand init-visible');
        expand.append(row);
        font.append(expand);

        this.font = font;
        this.mainPanel.append(font);

        //opacity
        var scale = this.itemControlEl.clone();
        scale.html('<a href="#" class="expand-link tooltip-delay" title="scale()"><i class="fa fa-caret-right"></i><h2>Změna měřítka</h2></a>');
        this.scaleEl.val('1');
        var expand = $('<div>').addClass('expand');
        expand.append(this.scaleSliderEl);
        expand.append(this.scaleEl);
        scale.append(expand);
        this.controlPanelEl.append(scale);

        //Transform-origin
        this.transformOriginXEl.val(this.initOrigin[0].toString());
        this.transformOriginYEl.val(this.initOrigin[1].toString());
        var origin = this.itemControlEl.clone();
        origin.html('<a href="#" class="expand-link tooltip-delay" title="transform-origin"><i class="fa fa-caret-right"></i><h2>Původ transformace</h2></a>').addClass('control-origin');
        var row = $('<div>').addClass('row');
        var visibleLabel = $('<label>').html('Zobrazit polohu na plátně').addClass('tooltip').attr('title', 'Poloha bodu umístění transform-origin se zobrazí spolu s elementem. Táhnutím bodu lze transform-origin měnit.');
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
        var expand = $('<div>').addClass('expand');
        expand.append(row);
        origin.append(expand);

        this.controlPanelEl.append(origin);

        //3D Rotate
        var rotate = this.itemControlEl.clone();
        rotate.html('<a href="#" class="expand-link tooltip-delay" title="rotate()"><i class="fa fa-caret-right"></i><h2>Rotace</h2></a>').addClass('control-rotate');
        var expand = $('<div>').addClass('expand');
        var x = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.rotateXSliderEl);
        x.append(this.rotateXEl);
        x.append(' deg');
        expand.append(x);
        var y = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.rotateYSliderEl);
        y.append(this.rotateYEl);
        y.append(' deg');
        expand.append(y);
        var z = $('<span>').html('<p>z:</p>').addClass('group-form');
        z.append(this.rotateZSliderEl);
        z.append(this.rotateZEl);
        z.append(' deg');
        expand.append(z);
        rotate.append(expand);
        this.controlPanelEl.append(rotate);

        //Perspective
        var perspective = this.itemControlEl.clone();
        perspective.html('<a href="#" class="expand-link tooltip-delay" title="perspective()"><i class="fa fa-caret-right"></i><h2>Perspektiva</h2></a>').addClass('control-rotate');
        var expand = $('<div>').addClass('expand');
        var x = $('<span>').addClass('group-form');
        x.append(this.perspectiveSliderEl);
        x.append(this.perspectiveEl);
        x.append(' px');
        expand.append(x);
        perspective.append(expand);
        this.controlPanelEl.append(perspective);

        //skew
        var skew = this.itemControlEl.clone();
        skew.html('<a href="#" class="expand-link tooltip-delay" title="skew()"><i class="fa fa-caret-right"></i><h2>Zkosení</h2></a>').addClass('control-rotate');
        var expand = $('<div>').addClass('expand');
        var x = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.skewXSliderEl);
        x.append(this.skewXEl);
        x.append(' deg');
        expand.append(x);
        var y = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.skewYSliderEl);
        y.append(this.skewYEl);
        y.append(' deg');
        expand.append(y);
        skew.append(expand);
        this.controlPanelEl.append(skew);

        //translate
        var translate = this.itemControlEl.clone();
        translate.html('<a href="#" class="expand-link tooltip-delay" title="translate()"><i class="fa fa-caret-right"></i><h2>Posun</h2></a>').addClass('control-rotate');
        var expand = $('<div>').addClass('expand');
        var x = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.translateXSliderEl);
        x.append(this.translateXEl);
        x.append(' px');
        expand.append(x);
        var y = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.translateYSliderEl);
        y.append(this.translateYEl);
        y.append(' px');
        expand.append(y);
        var z = $('<span>').html('<p>z:</p>').addClass('group-form');
        z.append(this.translateZSliderEl);
        z.append(this.translateZEl);
        z.append(' px');
        expand.append(z);
        translate.append(expand);
        this.controlPanelEl.append(translate);

        this.containerEl.append(this.controlPanelEl);

        $(window).resize(function () {
            _this.setHeight();
            _this.controlPanelEl.perfectScrollbar('update');
            $('.workspace-wrapper').perfectScrollbar('update');
        });

        this.colorPicker = this.bgPickerEl.colpick({
            layout: 'hex',
            submit: true,
            color: this.initColor,
            onSubmit: function (hsb, hex, rgb, el, bySetColor) {
                $(el).colpickHide();
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
            submit: true,
            color: this.initTextColor,
            onSubmit: function (hsb, hex, rgb, el, bySetColor) {
                $(el).colpickHide();
                $(el).css('border-color', '#' + hex);
                if (!bySetColor)
                    $(el).val(hex);
                if (!bySetColor) {
                    _this.app.workspace.setFont({
                        color: rgb,
                        fontFamily: _this.fontFamilyEl.val(),
                        size: parseFloat(_this.fontSizeEl.val())
                    });
                }
            }
        }).on('change', function (e) {
            _this.textColorPicker.colpickSetColor($(e.target).val());
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

        this.scaleSliderEl.slider({
            min: 0,
            max: 2,
            step: 0.1,
            value: 1,
            slide: function (event, ui) {
                _this.scaleEl.val(ui.value).change();
            }
        });

        this.bgOpacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 0,
            slide: function (event, ui) {
                _this.bgOpacityEl.val(ui.value).change();
            }
        });

        this.perspectiveSliderEl.slider({
            min: 0,
            max: 500,
            step: 1,
            value: 0,
            slide: function (event, ui) {
                _this.perspectiveEl.val(ui.value).change();
            }
        });

        this.ctx = this.canvas.get(0).getContext('2d');

        //init coordinates
        this.point1.css({ top: '180px', left: '50px' });
        this.point2.css({ top: '0px', left: '50px' });

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

        this.perspectiveEl.on('change', function (e) {
            var v = $(e.target).val();
            if (v < 0) {
                v = 0;
            }
            _this.perspectiveSliderEl.slider('value', v);
            _this.app.workspace.setPerspective(v);
        });

        this.scaleEl.on('change', function (e) {
            _this.scaleSliderEl.slider('value', $(e.target).val());
            _this.app.workspace.setScale($(e.target).val());
        });

        this.bgOpacityEl.on('change', function (e) {
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

        this.translateXEl.on('change', function (event) {
            _this.translateXSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.setTranslate('x', parseInt($(event.target).val()));
        });

        this.translateYEl.on('change', function (event) {
            _this.translateYSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.setTranslate('y', parseInt($(event.target).val()));
        });

        this.translateZEl.on('change', function (event) {
            _this.translateZSliderEl.slider('value', $(event.target).val());
            _this.app.workspace.setTranslate('z', parseInt($(event.target).val()));
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
            if (_this.isLockedBorderRadius == true) {
                _this.app.workspace.setBorderRadius('all', parseInt($(e.target).val()));
            } else {
                _this.app.workspace.setBorderRadius($(e.target).data('type'), parseInt($(e.target).val()));
            }
        });

        $(document).on('keyup', '.border-radius-input', function (e) {
            if (e.which == 13) {
                $(e.target).trigger('change');
            }
            if (_this.isLockedBorderRadius == true) {
                $('.border-radius-input').val($(e.target).val());
            }
        });

        $(document).on('click', '.border-radius-switch a', function (e) {
            if (_this.isLockedBorderRadius == true) {
                _this.isLockedBorderRadius = false;
                _this.borderRadiusSwitch.removeClass('locked').addClass('unlocked');
                _this.borderRadiusSwitch.find('i').removeClass('fa-lock').addClass('fa-unlock');
            } else {
                _this.isLockedBorderRadius = true;
                _this.borderRadiusSwitch.removeClass('unlocked').addClass('locked');
                _this.borderRadiusSwitch.find('i').removeClass('fa-unlock').addClass('fa-lock');
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

        this.animationSetSubmitEl.on('click', function (e) {
            _this.app.timeline.insertAnimationSet(Animations.animations[_this.animationSetSelectEl.val()]);
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

        this.newProjectEl.on('click', function (event) {
            if (confirm('Stávající projekt bude smazán. Opravdu si přejete vytvořit nový projekt?')) {
                if (_this.app.timeline.layers.length > 0) {
                    if (confirm('Přejete si před vytvořením nového projektu uložit stávající projekt?')) {
                        _this.saveEl.click();
                    }
                    _this.app.timeline.layers = new Array();
                    Layer.counter = 0;
                    _this.app.workspace.setWorkspaceDimension(800, 360);
                    _this.app.timeline.renderLayers();
                    _this.app.workspace.renderShapes();
                }
            }
        });

        this.loadEl.on('click', function (event) {
            if ($(event.target).closest('a').hasClass('active')) {
                $(event.target).closest('a').removeClass('active');
                _this.selectToolEl.trigger('click');
            } else {
                _this._mode = 5 /* LOAD */;
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

        this.insertSVGEl.on('click', function (event) {
            if ($(event.target).closest('a').hasClass('active')) {
                $(event.target).closest('a').removeClass('active');
                _this.selectToolEl.trigger('click');
            } else {
                _this._mode = 4 /* SVG */;
                $('.tool-btn').removeClass('active');
                $(event.target).closest('a').addClass('active');
            }
            _this.app.workspace.onChangeMode();
        });

        this.svgGalleryEl.on('click', function (event) {
            var svgGallery = new SvgGallery(_this.app);
        });

        this.aboutEl.on('click', function (e) {
            _this.aboutDialogEl.dialog({
                draggable: false,
                height: 400,
                width: 700,
                resizable: true,
                modal: true,
                closeOnEscape: true,
                close: function (event, ui) {
                    _this.aboutDialogEl.remove();
                }
            });
            $('.ui-dialog-titlebar-close').empty().append('X');
        });

        this.generateCodeEl.on('click', function (event) {
            var generator = new GenerateCode(_this.app, _this.app.timeline.layers);
            generator.generate();
        });

        this.saveEl.on('click', function (event) {
            var arr = new Array();
            arr.push({ x: _this.app.workspace.workspaceSize.width, y: _this.app.workspace.workspaceSize.height });
            arr.push(_this.app.timeline.repeat);
            arr.push(_this.app.timeline.layers);
            var toSave = JSON.stringify(arr);

            if (_this.app.timeline.layers.length > 0) {
                var blob = new Blob([toSave], { type: "application/json;charset=utf-8" });
                var now = new Date();
                var datetime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                datetime += '_' + now.getHours() + '.' + now.getMinutes();

                saveAs(blob, "animation_project_" + datetime + ".json");
            }
        });

        $(document).ready(function () {
            _this.selectToolEl.trigger('click');
            $('.expand').hide();
            $('.expand.init-visible').show();
            $('a.expand-link').on('click', function (e) {
                if ($(e.target).parents('.control-item').find('.expand').is(':visible')) {
                    $(this).find('i').addClass('fa-caret-right');
                    $(this).find('i').removeClass('fa-caret-down');
                } else {
                    $(this).find('i').removeClass('fa-caret-right');
                    $(this).find('i').addClass('fa-caret-down');
                }
                $(e.target).parents('.control-item').find('.expand').slideToggle(100);
                return false;
            });
            _this.ctx = _this.canvas.get(0).getContext('2d');
            _this.renderWrap(_this.ctx);
            _this.controlPanelEl.perfectScrollbar();
            _this.app.workspace.setBezier(_this.renderWrap(_this.ctx));
            _this.displayMainPanel(false, 'bezier');

            $('.rotate-slider').slider({
                min: -180,
                max: 180,
                step: 1,
                value: 0,
                slide: function (event, ui) {
                    $('input#' + $(event.target).attr('id')).val(ui.value).change();
                }
            });

            $('.translate-slider').slider({
                min: -100,
                max: 100,
                step: 1,
                value: 0,
                slide: function (event, ui) {
                    $('input#' + $(event.target).attr('id')).val(ui.value).change();
                }
            });

            $('.translate').val('0');

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

    ControlPanel.prototype.updatePerspective = function (p) {
        this.perspectiveSliderEl.slider('option', 'value', Number(p));
        this.perspectiveEl.val(p.toString());
    };

    ControlPanel.prototype.updateScale = function (scale) {
        this.scaleSliderEl.slider('option', 'value', Number(scale));
        this.scaleEl.val(scale.toString());
    };

    ControlPanel.prototype.updateColor = function (color, alpha) {
        this.colorPicker.colpickSetColor(color, false);
        this.bgPickerEl.val($.colpick.rgbToHex(color));
        this.bgPickerEl.css({ 'border-color': 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')' });
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
        this.textColorPicker.css({ 'border-color': 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')' });
        this.fontSizeEl.val(size.toString());
        this.fontFamilyEl.val(family);
    };

    ControlPanel.prototype.updateWorkspaceDimension = function (d) {
        this.workspaceHeightEl.val(d.height.toString());
        this.workspaceWidthEl.val(d.width.toString());
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
        $('.expand-bezier').show();
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

    ControlPanel.prototype.updateTranslate = function (translate) {
        if (translate.x != null) {
            this.translateXSliderEl.slider('option', 'value', Number(translate.x));
            this.translateXEl.val(translate.x.toString());
        }

        if (translate.y != null) {
            this.translateYSliderEl.slider('option', 'value', Number(translate.y));
            this.translateYEl.val(translate.y.toString());
        }

        if (translate.z != null) {
            this.translateZSliderEl.slider('option', 'value', Number(translate.z));
            this.translateZEl.val(translate.z.toString());
        }
    };

    ControlPanel.prototype.updateTransformOrigin = function (top, left) {
        this.transformOriginXEl.val(top.toString());
        this.transformOriginYEl.val(left.toString());
    };

    ControlPanel.prototype.displayMainPanel = function (visible, type) {
        var object;

        if (type === 'bezier' && visible == true) {
            this.curve.show();
            $('.delete-keyframe').removeClass('disabled');
        } else if (type === "bezier" && visible != true) {
            this.curve.hide();
            $('.delete-keyframe').addClass('disabled');
            $('.timing-function').removeClass('selected');
            $('.keyframe').removeClass('selected');
        }

        if (type === 'font' && visible == true) {
            this.font.show();
        } else if (type === "font" && visible != true) {
            this.font.hide();
        }

        if (this.font.is(':visible') && this.curve.is(':visible')) {
            $('.clearfix').css({ 'margin-top': '80px' });
            $('.clearfix').show();
        } else if (this.font.is(':visible') || this.curve.is(':visible')) {
            $('.clearfix').css({ 'margin-top': '40px' });
            $('.clearfix').show();
        } else {
            $('.clearfix').hide();
        }
    };

    Object.defineProperty(ControlPanel.prototype, "Mode", {
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
        this.messageEl = $('<div>').attr('id', 'message-dialog').css({ 'display': 'none' });
        this.timeline = new Timeline(this, this.timelineEl);
        this.workspace = new Workspace(this, this.workspaceEl, this.workspaceWrapperEl);
        this.controlPanel = new ControlPanel(this, this.topContainerEl);

        $('body').append(this.messageEl);
        $('body').append(this.topContainerEl);
        $('body').append(this.timelineEl);

        this.controlPanel.setHeight();

        this.topContainerEl.append(this.workspaceWrapperEl.append(this.workspaceEl));
    }
    return Application;
})();

$(document).ready(function () {
    new Application();
    $('.tooltip').tooltipster({ position: 'right', maxWidth: 200 });
    $('.tooltip-delay').tooltipster({ position: 'right', maxWidth: 200, delay: 600 });
    $('.tooltip-top').tooltipster({ position: 'top' });
    $('.workspace-wrapper').perfectScrollbar({ includePadding: true });

    window.onbeforeunload = function () {
        return "Opravdu chcete opustit stránku? Neuložený projekt bude ztracený!";
    };
});
var GenerateCode = (function () {
    function GenerateCode(app, l) {
        var _this = this;
        this.tabsEl = $('<div>').attr('id', 'tabs');
        this.codeTab = $('<did>').attr('id', 'code');
        this.previewTab = $('<div>').attr('id', 'preview');
        this.dialogEl = $('<div>').attr('id', 'dialog').html('<p></p>').attr('title', 'Výsledný kód animace');
        this.previewEl = $('<iframe>').attr('id', 'previewFrame').attr('src', 'about:blank');
        this.codeWrapperEl = $('<div>').attr('id', 'code');
        this.runEl = $('<a>').attr('href', '#').addClass('run-preview').html('Znovu spustit animaci');
        this.downloadWrapperEl = $('<div>').addClass('download-wrapper');
        this.downloadBtnEl = $('<a>').addClass('btn download-btn').html('Stáhnout HTML soubor').attr('href', '#');
        this.arrayMax = Function.prototype.apply.bind(Math.max, null);
        this.arrayMin = Function.prototype.apply.bind(Math.min, null);
        this.app = app;
        this.layers = l;

        this.tabsEl.append('<ul><li><a href="#code">Vygenerovaný HTML kód animace</a></li><li><a href="#preview">Náhled vytvořené animace</a></li></ul>');
        this.tabsEl.append(this.codeTab);
        this.tabsEl.append(this.previewTab);

        $('body').find(this.dialogEl).remove();
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            autoOpen: false,
            draggable: false,
            height: 600,
            width: 900,
            resizable: true,
            modal: true,
            closeOnEscape: true,
            close: function (event, ui) {
                _this.dialogEl.remove();
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');

        this.dialogEl.append(this.tabsEl);
        this.downloadWrapperEl.append(this.downloadBtnEl);
        this.dialogEl.append(this.downloadWrapperEl);
        this.tabsEl.tabs();

        this.runEl.on('click', function (event) {
            _this.previewEl.remove();
            _this.previewTab.append(_this.previewEl);
        });

        this.downloadBtnEl.on('click', function (e) {
            var blob = new Blob([_this.resultHtml], { type: "text/html;charset=utf-8" });

            saveAs(blob, "animation.html");
        });
    }
    GenerateCode.prototype.generate = function () {
        var _this = this;
        this.dialogEl.dialog('open');

        var html = '<!DOCTYPE html>\n<html lang="cs">\n<head>\n  <meta charset="UTF-8">\n  <title></title>\n';
        html += '  <style>\n';
        html += this.generateCss();
        html += '  </style>\n</head>\n';
        html += '<body>\n';
        html += this.generateObjects();
        html += '\n</body>\n</html>';

        var encodehtml = html;
        this.resultHtml = encodehtml;
        html = html.replace(/[<>]/g, function (m) {
            return { '<': '&lt;', '>': '&gt;' }[m];
        });
        var pre = $('<pre>').addClass('prettyprint').attr('id', 'code');
        this.codeTab.append(pre.html(html));

        this.previewTab.append(this.runEl);
        this.previewTab.append(this.previewEl);
        this.previewEl.attr('srcdoc', encodehtml);
        this.previewEl.attr('src', 'data:text/html;charset=utf-8,' + encodehtml);

        prettyPrint();

        $(pre).on('dblclick', function () {
            _this.selectText('code');
        });

        return encodehtml;
    };

    GenerateCode.prototype.generateCss = function () {
        var css = '';
        css += this.gCss({
            'name': '#workspace',
            'max-width': this.app.workspace.workspaceSize.width + 'px',
            'height': this.app.workspace.workspaceSize.height + 'px',
            'width': '100%',
            'border': '1px dotted #ededed',
            'overflow': 'hidden',
            'position': 'relative',
            'margin': '0 auto'
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
                } else if (layer instanceof SvgLayer) {
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

        //find absolute maximum
        var absoluteMax = 0;
        this.layers.forEach(function (item, index) {
            var tmp = _this.arrayMax(item.timestamps);
            if (tmp > absoluteMax)
                absoluteMax = tmp;
        });

        this.layers.forEach(function (item, index) {
            var parentSize = _this.app.workspace.workspaceSize;
            var percents = new Array();
            var min = _this.arrayMin(item.timestamps);
            var max = _this.arrayMax(item.timestamps);
            var duration = absoluteMax;

            var nameElement = 'object' + item.id;

            //1. init style for object
            parentSize = _this.app.workspace.workspaceSize;
            if (item.parent != null) {
                var k = _this.app.timeline.getLayer(item.parent).getKeyframe(0);
                parentSize = { width: k.shape.parameters.width, height: k.shape.parameters.height };
            }
            var cssObject = item.getInitStyles(nameElement, parentSize);

            if (_this.app.timeline.repeat) {
                cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
                cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
            } else {
                if (duration != 0) {
                    cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's forwards';
                    cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's forwards';
                }
            }

            css += _this.gCss(cssObject);

            //2. if keyframes > 1, generate it
            if (item.timestamps.length > 1) {
                cssObject = {};
                cssObject['name'] = nameElement;

                item.timestamps.forEach(function (timestamp, i) {
                    var keyframe = item.getKeyframeByTimestamp(timestamp);

                    var part = ((keyframe.timestamp) / duration);

                    var percent = (part * 100).toString() + '%';

                    //if first keyframe and not 0, make object invisible
                    if (i == 0 && part != 0) {
                        cssObject['0%'] = { 'visibility': 'hidden' };
                    }

                    parentSize = _this.app.workspace.workspaceSize;
                    if (item.parent != null) {
                        var k = _this.app.timeline.getLayer(item.parent).getKeyframeByTimestamp(timestamp);
                        if (k == null) {
                            //compute dimensions
                            var tmp = _this.app.timeline.getLayer(item.parent).getShape(timestamp);
                            parentSize = {
                                width: tmp.parameters.width,
                                height: tmp.parameters.height
                            };
                        } else {
                            parentSize = { width: k.shape.parameters.width, height: k.shape.parameters.height };
                        }
                    }
                    cssObject[percent] = item.getKeyframeStyle(timestamp, parentSize);

                    //if last keyframe and not 100%, make object invisible
                    if (i == item.timestamps.length - 1 && part != 1) {
                        cssObject[percent]['visibility'] = 'hidden';
                        cssObject['100%'] = cssObject[percent];
                    }

                    //if first keyframe and not 0, make object invisible
                    if (i == 0 && part != 0) {
                        cssObject[percent]['visibility'] = 'hidden';

                        //fix, if only 2 keyframes
                        if (item.timestamps.length == 2 && ((item.timestamps[item.timestamps.length - 1] / duration) != 1)) {
                            cssObject[((part * 100) + 0.1).toString() + '%'] = { 'visibility': 'visible' };
                        }
                    }

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
    Mode[Mode["SVG"] = 4] = "SVG";
    Mode[Mode["LOAD"] = 5] = "LOAD";
})(Mode || (Mode = {}));

var Type;
(function (Type) {
    Type[Type["DIV"] = 0] = "DIV";
    Type[Type["TEXT"] = 1] = "TEXT";
    Type[Type["SVG"] = 2] = "SVG";
    Type[Type["IMAGE"] = 3] = "IMAGE";
})(Type || (Type = {}));

var Animation_playing;
(function (Animation_playing) {
    Animation_playing[Animation_playing["PLAY"] = 0] = "PLAY";
    Animation_playing[Animation_playing["STOP"] = 1] = "STOP";
    Animation_playing[Animation_playing["PAUSE"] = 2] = "PAUSE";
})(Animation_playing || (Animation_playing = {}));
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
        _super.call(this, name, fn, 3 /* IMAGE */, shape);
    }
    ImageLayer.prototype.transform = function (position, shape, helper, currentLayerId, app, showHelper) {
        _super.prototype.transform.call(this, position, shape, helper, currentLayerId, app, showHelper);
    };

    ImageLayer.prototype.getShape = function (position) {
        var params = _super.prototype.getParameters.call(this, position);
        var shape = new Img(params, this.globalShape.getSrc());

        return shape;
    };

    ImageLayer.prototype.getInitStyles = function (nameElement, workspaceSize) {
        var cssObject = _super.prototype.getInitStyles.call(this, nameElement, workspaceSize);

        return cssObject;
    };

    ImageLayer.prototype.getKeyframeStyle = function (timestamp, workspaceSize) {
        return _super.prototype.getKeyframeStyle.call(this, timestamp, workspaceSize);
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

    ImageLayer.parseJson = function (obj) {
        var name = obj.name;
        var fn = obj._keyframes[0]._timing_function;
        var params = obj._globalShape._parameters;
        var src = obj._globalShape._src;

        var img = new Img(params, src);
        var newLayer = new ImageLayer(name, fn, img);
        newLayer.id = obj.id;
        newLayer.order = obj._order;
        newLayer.idEl = obj._idEl;
        newLayer.globalShape.id = obj.id;
        newLayer.parent = obj._parent;
        newLayer.nesting = obj.nesting;
        newLayer.isMultipleEdit = obj.isMultipleEdit;
        newLayer.isVisibleOnWorkspace = obj.isVisibleOnWorkspace;
        newLayer.deleteKeyframe(0);

        obj._keyframes.forEach(function (k, i) {
            var p = k._shape._parameters;
            var s = new Img(p, null);
            var f = k._timing_function;
            var t = k._timestamp;
            s.id = newLayer.id;
            newLayer.addKeyframe(s, t, f);
        });

        return newLayer;
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
        get: function () {
            return this._shape;
        },
        set: function (shape) {
            this._shape = shape;
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
        _super.call(this, name, fn, 0 /* DIV */, shape);
    }
    RectangleLayer.prototype.transform = function (position, shape, helper, currentLayerId, app, showHelper) {
        _super.prototype.transform.call(this, position, shape, helper, currentLayerId, app, showHelper);
    };

    RectangleLayer.prototype.getShape = function (position) {
        var params = _super.prototype.getParameters.call(this, position);

        var shape = new Rectangle(params);

        return shape;
    };

    RectangleLayer.prototype.getInitStyles = function (nameElement, workspaceSize) {
        return _super.prototype.getInitStyles.call(this, nameElement, workspaceSize);
    };

    RectangleLayer.prototype.getKeyframeStyle = function (timestamp, workspaceSize) {
        return _super.prototype.getKeyframeStyle.call(this, timestamp, workspaceSize);
    };

    RectangleLayer.prototype.getObject = function () {
        var object = Array(this.nesting + 1).join('  ') + '    <div class="square object' + this.id + '">\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <div id="' + this.idEl + '" class="square object' + this.id + '">\n';
        }
        return object;
    };

    RectangleLayer.prototype.renderShape = function (container, position, currentScope) {
        var shape = $('<div>').addClass('shape square');
        var helper = $('<div>').addClass('shape-helper square-helper');
        shape = _super.prototype.renderShapeCore.call(this, shape, container, position, currentScope, helper);

        return shape;
    };

    RectangleLayer.parseJson = function (obj) {
        var name = obj.name;
        var fn = obj._keyframes[0]._timing_function;
        var params = obj._globalShape._parameters;
        var rect = new Rectangle(params);
        var newLayer = new RectangleLayer(name, fn, rect);
        newLayer.id = obj.id;
        newLayer.order = obj._order;
        newLayer.idEl = obj._idEl;
        newLayer.globalShape.id = obj.id;
        newLayer.parent = obj._parent;
        newLayer.nesting = obj.nesting;
        newLayer.isMultipleEdit = obj.isMultipleEdit;
        newLayer.isVisibleOnWorkspace = obj.isVisibleOnWorkspace;
        newLayer.deleteKeyframe(0);

        obj._keyframes.forEach(function (k, i) {
            var p = k._shape._parameters;
            var s = new Rectangle(p);
            var f = k._timing_function;
            var t = k._timestamp;
            s.id = newLayer.id;
            newLayer.addKeyframe(s, t, f);
        });

        return newLayer;
    };
    return RectangleLayer;
})(Layer);
var Svg = (function (_super) {
    __extends(Svg, _super);
    function Svg(params, src) {
        if (typeof src === "undefined") { src = null; }
        var _this = this;
        _super.call(this, params);
        this._src = null;
        this.base64 = null;
        this._src = src;
        if (src != null) {
            var blob = new Blob([this.getSrc()], { type: 'image/svg+xml' });
            this.readFile(blob, function (e) {
                _this.base64 = e.target.result;
            });
        }
    }
    Svg.prototype.getSrc = function () {
        return this._src;
    };

    Svg.prototype.setSrc = function (src, base64) {
        this._src = src;
        this.base64 = base64;
    };

    Svg.prototype.readFile = function (file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    };
    return Svg;
})(Shape);
var SvgGallery = (function () {
    function SvgGallery(app) {
        var _this = this;
        this.dialogEl = $('<div>').attr('id', 'dialog').attr('title', 'Galerie');
        this.files = ["cloud-1.svg", "cloud-2.svg", "cloud-3.svg", "cloud-4.svg", "cloud-5.svg", "cloud-6.svg", "plane.svg", "vsb.svg", "fei.svg", "add187.svg", "alarm50.svg", "american39.svg", "aromatherapy2.svg", "award27.svg", "award42.svg", "award44.svg", "award46.svg", "award47.svg", "ball26.svg", "ball27.svg", "ball28.svg", "ball29.svg", "banner3.svg", "baseball28.svg", "baseball30.svg", "basketball39.svg", "basketball41.svg", "bowling17.svg", "bowling19.svg", "bowling21.svg", "box79.svg", "boxing6.svg", "boy39.svg", "briefcase51.svg", "bulb12.svg", "casual.svg", "chef25.svg", "chronometer21.svg", "chronometer23.svg", "click1.svg", "closed65.svg", "closed66.svg", "coin16.svg", "coins30.svg", "coins31.svg", "coins32.svg", "commercial16.svg", "concentric3.svg", "credit100.svg", "credit101.svg", "credit102.svg", "delete83.svg", "digital24.svg", "discount3.svg", "dislike10.svg", "diving2.svg", "double100.svg", "double102.svg", "dumbbells4.svg", "engineer1.svg", "farmer2.svg", "female225.svg", "female227.svg", "female228.svg", "female229.svg", "female230.svg", "flag102.svg", "flags14.svg", "forefinger1.svg", "free9.svg", "front19.svg", "full48.svg", "gardener1.svg", "geek.svg", "gentleman.svg", "girl31.svg", "golf25.svg", "graduate26.svg", "graduate33.svg", "hands9.svg", "herbal1.svg", "high18.svg", "hockey4.svg", "hockey5.svg", "ice66.svg", "jcb6.svg", "like52.svg", "logotype68.svg", "logotype77.svg", "logotype82.svg", "logotype84.svg", "logotype99.svg", "male231.svg", "man427.svg", "map47.svg", "mastercard7.svg", "medal55.svg", "medal59.svg", "medical84.svg", "medieval1.svg", "middle1.svg", "money131.svg", "money132.svg", "new105.svg", "number42.svg", "office29.svg", "office30.svg", "one37.svg", "one38.svg", "one39.svg", "one41.svg", "one43.svg", "one44.svg", "one45.svg", "one46.svg", "one49.svg", "one53.svg", "one54.svg", "one57.svg", "one58.svg", "one60.svg", "one63.svg", "open208.svg", "paypal15.svg", "person304.svg", "phone377.svg", "piggy12.svg", "pilot2.svg", "policeman5.svg", "present19.svg", "price10.svg", "price11.svg", "price9.svg", "product3.svg", "professor19.svg", "publicity.svg", "qr7.svg", "relaxing1.svg", "remove21.svg", "resizing2.svg", "ribbon48.svg", "ribbon71.svg", "ribbon77.svg", "rock5.svg", "rolled3.svg", "rotate10.svg", "rubbish1.svg", "sailing10.svg", "sailing9.svg", "sale21.svg", "scream1.svg", "scream2.svg", "shield76.svg", "shoe18.svg", "shopping234.svg", "shopping235.svg", "shopping236.svg", "shopping237.svg", "shuttlecock1.svg", "signing2.svg", "silhouette20.svg", "silhouette21.svg", "silhouette43.svg", "silhouette48.svg", "silhouette53.svg", "silhouette61.svg", "soccer81.svg", "soccer82.svg", "socialnetwork26.svg", "socialnetwork31.svg", "socialnetwork37.svg", "socialnetwork55.svg", "socialnetwork64.svg", "socialnetwork69.svg", "spa21.svg", "speech142.svg", "speech143.svg", "speech144.svg", "speech145.svg", "speech146.svg", "speech147.svg", "speech148.svg", "speech149.svg", "speech150.svg", "sport13.svg", "sport14.svg", "sportive59.svg", "sports37.svg", "sports38.svg", "star159.svg", "stewardess.svg", "swipe10.svg", "swipe15.svg", "swipe16.svg", "swipe20.svg", "swipe21.svg", "swipe22.svg", "swipe3.svg", "swipe4.svg", "swipe6.svg", "swipe8.svg", "swipe9.svg", "table40.svg", "tap4.svg", "target41.svg", "tennis21.svg", "tennis22.svg", "tennis24.svg", "thinking1.svg", "thinking2.svg", "thought7.svg", "thought8.svg", "three144.svg", "three146.svg", "three148.svg", "three151.svg", "thumb43.svg", "thumb47.svg", "toilet9.svg", "touch18.svg", "touching1.svg", "trophy58.svg", "trophy59.svg", "trophy61.svg", "two333.svg", "two335.svg", "two341.svg", "two343.svg", "van18.svg", "visa8.svg", "volleyball6.svg", "waiter1.svg", "waitress.svg", "water54.svg", "whistle14.svg", "woman106.svg", "woman107.svg", "woman108.svg"];
        this.app = app;

        $('body').find(this.dialogEl).remove();
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            autoOpen: false,
            draggable: false,
            height: 550,
            width: 900,
            resizable: true,
            modal: true,
            closeOnEscape: true,
            close: function (event, ui) {
                _this.dialogEl.remove();
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');

        this.objects = new Array();
        this.dialogEl.dialog('open');

        var p = {
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            relativeSize: { width: ((100 / this.app.workspace.workspaceContainer.width()) * 100), height: ((100 / this.app.workspace.workspaceContainer.height()) * 100) },
            relativePosition: { top: 0, left: 0 },
            background: { r: 255, g: 255, b: 255, a: 0 },
            opacity: 1,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: { x: 50, y: 50 },
            zindex: this.app.timeline.layers.length,
            scale: 1,
            translate: { x: 0, y: 0, z: 0 },
            relativeTranslate: { x: 0, y: 0 },
            perspective: 0
        };

        this.files.forEach(function (name, index) {
            $.ajax({
                url: 'svg-gallery/' + name,
                dataType: 'text',
                success: function (data) {
                    var svg = new Svg(p, data);
                    _this.objects.push(svg);
                    _this.showSingleObject(_this.objects.length - 1);
                }
            });
        });
    }
    SvgGallery.prototype.showGallery = function () {
        var _this = this;
        this.objects.forEach(function (svg, i) {
            var blob = new Blob([svg.getSrc()], { type: 'image/svg+xml' });
            var link = $('<a>').attr('href', '#').addClass('gallery-item');
            var shape = $('<img>').css({ 'width': '150px', 'height': '150px' });

            _this.readFile(blob, function (e) {
                shape.attr('src', e.target.result);
                link.attr('data-id', i);
                link.append(shape);
                _this.dialogEl.append(link);

                link.on('click', function (ev) {
                    _this.insertSvg(link.data('id'));
                });
            });
        });
    };

    SvgGallery.prototype.showSingleObject = function (index) {
        var _this = this;
        var svg = this.objects[index];
        var blob = new Blob([svg.getSrc()], { type: 'image/svg+xml' });
        var link = $('<a>').attr('href', '#').addClass('gallery-item');
        var shape = $('<img>').css({ 'width': '50px', 'height': '50px' });

        this.readFile(blob, function (e) {
            shape.attr('src', e.target.result);
            link.attr('data-id', index);
            link.append(shape);
            _this.dialogEl.append(link);

            link.on('click', function (ev) {
                _this.insertSvg(link.data('id'));
            });
        });
    };

    SvgGallery.prototype.insertSvg = function (id) {
        this.app.workspace.insertLayerFromGallery(this.objects[id]);

        this.dialogEl.remove();
    };

    SvgGallery.prototype.readFile = function (file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    };
    return SvgGallery;
})();
var SvgLayer = (function (_super) {
    __extends(SvgLayer, _super);
    function SvgLayer(name, fn, shape) {
        if (typeof shape === "undefined") { shape = null; }
        _super.call(this, name, fn, 2 /* SVG */, shape);
    }
    SvgLayer.prototype.transform = function (position, shape, helper, currentLayerId, app, showHelper) {
        _super.prototype.transform.call(this, position, shape, helper, currentLayerId, app, showHelper);
    };

    SvgLayer.prototype.getShape = function (position) {
        var params = _super.prototype.getParameters.call(this, position);

        //var shape: IShape = new Svg(params, this.globalShape.getSrc());
        var shape = new Svg(params, null);
        return shape;
    };

    SvgLayer.prototype.getInitStyles = function (nameElement, workspaceSize) {
        var cssObject = _super.prototype.getInitStyles.call(this, nameElement, workspaceSize);

        return cssObject;
    };

    SvgLayer.prototype.getKeyframeStyle = function (timestamp, workspaceSize) {
        return _super.prototype.getKeyframeStyle.call(this, timestamp, workspaceSize);
    };

    SvgLayer.prototype.getObject = function () {
        var g = this.globalShape;
        var object = Array(this.nesting + 1).join('  ') + '    <img class="svg object' + this.id + '" src="' + g.base64 + '">\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <img id="' + this.idEl + '" class="svg object' + this.id + '" src="' + g.base64 + '">\n';
        }
        return object;
    };

    SvgLayer.prototype.renderShape = function (container, position, currentScope) {
        var svgShape = this.globalShape;
        var blob = new Blob([svgShape.getSrc()], { type: 'image/svg+xml' });
        var shape = $('<img>').addClass('shape svg');

        this.readFile(blob, function (e) {
            shape.attr('src', e.target.result);
        });
        shape = _super.prototype.renderShapeCore.call(this, shape, container, position, currentScope);

        return shape;
    };

    SvgLayer.prototype.readFile = function (file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    };

    SvgLayer.parseJson = function (obj) {
        var name = obj.name;
        var fn = obj._keyframes[0]._timing_function;
        var params = obj._globalShape._parameters;
        var src = obj._globalShape._src;

        var img = new Svg(params, src);
        var newLayer = new SvgLayer(name, fn, img);
        newLayer.id = obj.id;
        newLayer.order = obj._order;
        newLayer.idEl = obj._idEl;
        newLayer.globalShape.id = obj.id;
        newLayer.parent = obj._parent;
        newLayer.nesting = obj.nesting;
        newLayer.isMultipleEdit = obj.isMultipleEdit;
        newLayer.isVisibleOnWorkspace = obj.isVisibleOnWorkspace;
        newLayer.deleteKeyframe(0);

        obj._keyframes.forEach(function (k, i) {
            var p = k._shape._parameters;
            var s = new Svg(p, null);
            var f = k._timing_function;
            var t = k._timestamp;
            s.id = newLayer.id;
            newLayer.addKeyframe(s, t, f);
        });

        return newLayer;
    };
    return SvgLayer;
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
        _super.call(this, name, fn, 1 /* TEXT */, shape);
    }
    TextLayer.prototype.transform = function (position, shape, helper, currentLayerId, app, showHelper) {
        _super.prototype.transform.call(this, position, shape, helper, currentLayerId, app, showHelper);

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
            'font-size': (fontParams.size / 16) + 'em',
            'font-family': fontParams.fontFamily
        });

        if (currentLayerId == this.id) {
            app.controlPanel.updateFont(fontParams.color, fontParams.size, fontParams.fontFamily);
        }
    };

    TextLayer.prototype.getShape = function (position) {
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

        var params = _super.prototype.getParameters.call(this, position);

        var t = this.globalShape;
        var shape = new TextField(params, t.getContent(), fontParams.color, fontParams.size, t.getFamily());

        return shape;
    };

    TextLayer.prototype.getInitStyles = function (nameElement, workspaceSize) {
        var shape = (this.getKeyframeByTimestamp(this.timestamps[0])).shape;

        var cssObject = _super.prototype.getInitStyles.call(this, nameElement, workspaceSize);
        cssObject['display'] = 'inline';
        cssObject['font-size'] = (shape.getSize() / 16) + 'em';
        cssObject['font-family'] = '"' + shape.getFamily() + '"';
        cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    };

    TextLayer.prototype.getKeyframeStyle = function (timestamp, workspaceSize) {
        var shape = (this.getKeyframeByTimestamp(timestamp)).shape;

        var cssObject = _super.prototype.getKeyframeStyle.call(this, timestamp, workspaceSize);

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
            cssObject['font-size'] = (shape.getSize() / 16) + 'em';
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
            'font-size': (textShape.getSize() / 16) + 'em',
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

    TextLayer.parseJson = function (obj) {
        var name = obj.name;
        var fn = obj._keyframes[0]._timing_function;
        var params = obj._globalShape._parameters;
        var content = obj._globalShape._content;
        var color = obj._globalShape.color;
        var size = obj._globalShape.size;
        var family = obj._globalShape.family;

        var text = new TextField(params, content, color, size, family);
        var newLayer = new TextLayer(name, fn, text);
        newLayer.id = obj.id;
        newLayer.order = obj._order;
        newLayer.idEl = obj._idEl;
        newLayer.globalShape.id = obj.id;
        newLayer.parent = obj._parent;
        newLayer.nesting = obj.nesting;
        newLayer.isMultipleEdit = obj.isMultipleEdit;
        newLayer.isVisibleOnWorkspace = obj.isVisibleOnWorkspace;
        newLayer.deleteKeyframe(0);

        obj._keyframes.forEach(function (k, i) {
            var p = k._shape._parameters;
            var content = k._shape._content;
            var color = k._shape.color;
            var size = k._shape.size;
            var family = k._shape.family;
            var s = new TextField(p, content, color, size, family);
            var f = k._timing_function;
            var t = k._timestamp;
            s.id = newLayer.id;
            newLayer.addKeyframe(s, t, f);
        });

        return newLayer;
    };
    return TextLayer;
})(Layer);
//# sourceMappingURL=app.js.map
