var Layer = (function () {
    function Layer(name, fn, shape) {
        if (typeof shape === "undefined") { shape = null; }
        this._order = 0;
        this.name = name;
        this.id = ++Layer.counter;
        this._keyframes = new Array();
        this._timestamps = new Array();
        if (shape != null) {
            this._keyframes.push(new Keyframe(shape, 0, fn));
        }

        this.idEl = null;
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
        this.newLayerEl = $('<a class="new-layer" href = "#">Nová vrstva <i class="fa fa-file-o"></i></a>');
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
        this.keyframesTableEl = $('<table><thead></thead><tbody></tbody>');
        this.pointerEl = $('<div class="pointer"><div class="pointer-top"></div></div>');
        this.app = app;
        this.timelineContainer = timelineContainer;
        this.layers = new Array();

        this.renderTimeline();

        this.newLayerEl.on('click', function (event) {
            _this.addLayer(event);
            return false;
        });

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

            //this.app.workspace.renderShapes(); <-- OK misto toho se zavola event pri kliku na tabulku a provede se transformace transformShapes
            _this.app.workspace.updateBezierCurve(_this.getLayer($(event.target).data('layer')));
            //this.app.workspace.renderShapes();
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
        $(this.timelineHeadEl).append(this.newLayerEl);
        $(this.timelineHeadEl).append(this.repeatEl);
        $(this.timelineContainer).append(this.timelineHeadEl);
        $(this.fixedWidthEl).append(this.layersEl);
        $(this.fixedWidthEl).append(this.keyframesEl);
        $(this.layersFooterEl).append(this.deleteLayerEl);
        $(this.layersFooterEl).append(this.deleteKeyframeEl);
        $(this.timelineFooterEl).append(this.layersFooterEl);
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

        //render new layers list from array
        this.layers.forEach(function (item, index) {
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
        });

        //if array layers is empty, insert default layer
        if (this.layers.length == 0) {
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

    Timeline.prototype.selectLayer = function (id) {
        //select layer by ID
        this.keyframesTableEl.find('tbody tr').removeClass('selected');
        this.layersEl.find('.layer').removeClass('selected');
        this.layersEl.find('[data-id="' + id + '"]').addClass('selected');
        this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');

        //highlight shape
        this.app.workspace.highlightShape([id]);
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

    Timeline.prototype.addLayer = function (e, shape) {
        if (typeof shape === "undefined") { shape = null; }
        console.log('Adding new layer...');

        //remove initial example layer
        this.keyframesTableEl.find('tbody tr.disabled').remove();

        //create layer & push to array & set order(depend on index of array)
        var layer = new Layer('Vrstva ' + (Layer.counter + 1), this.app.workspace.getBezier());
        this.layers.push(layer);
        layer.order = this.layers.length;

        //insert shape to layer
        if (shape != null) {
            //init keyframe
            shape.id = layer.id;
            layer.addKeyframe(shape, 0, this.app.workspace.getBezier());
        }

        //render new layer list
        this.renderLayers();

        this.selectLayer(layer.id);
        this.layersWrapperEl.stop(true, true).animate({ scrollTop: this.layersWrapperEl[0].scrollHeight - 50 }, 300);
        this.layersWrapperEl.perfectScrollbar('update');

        return layer.id;
    };

    Timeline.prototype.deleteLayers = function (e) {
        console.log('Deleting layers...');

        //iteration from end of array of selected layers
        var selectedLayers = this.layersEl.find('div.layer.selected').get();
        for (var i = selectedLayers.length - 1; i >= 0; i--) {
            this.layers.splice(parseInt($(selectedLayers[i]).attr('id')), 1);
        }

        //render layers
        this.renderLayers();

        //render workspace
        this.app.workspace.renderShapes();

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

        var tmpLayers = new Array();
        order.forEach(function (value, index) {
            var layer = _this.layers[parseInt(value)];
            tmpLayers.push(layer);
            var keyframe = layer.getKeyframe(0);
            if (keyframe) {
                keyframe.shape.setZindex(index);
            }
        });
        this.layers = tmpLayers;

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

                //this.app.workspace.renderShapes();
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

            //this.app.workspace.renderShapes();
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

            //this.app.workspace.renderShapes();
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
        this.parameters.backgroundR = c.r;
        this.parameters.backgroundG = c.g;
        this.parameters.backgroundB = c.b;
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
        this._parameters.rotateX = val;
    };

    Shape.prototype.setRotateY = function (val) {
        this._parameters.rotateY = val;
    };

    Shape.prototype.setRotateZ = function (val) {
        this._parameters.rotateZ = val;
    };

    Shape.prototype.setSkewX = function (val) {
        this._parameters.skewX = val;
    };

    Shape.prototype.setSkewY = function (val) {
        this._parameters.skewY = val;
    };
    return Shape;
})();
///<reference path="Shape.ts" />

var Workspace = (function () {
    function Workspace(app, workspaceContainer, workspaceWrapper) {
        var _this = this;
        this.createdLayer = false;
        this._workspaceSize = { width: 800, height: 360 };
        this.app = app;
        this.workspaceContainer = workspaceContainer;
        this.workspaceWrapper = workspaceWrapper;

        this.workspaceContainer.css(this._workspaceSize);

        this.workspaceWrapper.on('mousedown', function (event) {
            //if ($(event.target).is('#workspace')) {
            if (_this.app.controlPanel.Mode == 1 /* CREATE_DIV */) {
                _this.onDrawSquare(event);
            }
            //}
        });

        this.workspaceWrapper.on('mouseup', function (event) {
            if (_this.createdLayer) {
                var shape = new Shape(_this.shapeParams);
                var idLayer = _this.app.timeline.addLayer(event, shape);
                _this.renderShapes();
                _this.transformShapes();
                _this.highlightShape([idLayer]);
                _this.createdLayer = false;
            }
        });

        this.workspaceContainer.on('mousedown', '.shape-helper', function (event) {
            _this.createdLayer = false;
            var id = $(event.target).closest('.shape-helper').data('id');
            _this.app.timeline.selectLayer(id);
            _this.app.timeline.scrollTo(id);
        });

        this.workspaceContainer.on('mouseover', '.shape-helper', function (event) {
            $(event.target).find('.helpername').show();
        });

        this.workspaceContainer.on('mouseout', '.shape-helper', function (event) {
            $(event.target).find('.helpername').hide();
        });
    }
    Workspace.prototype.onDrawSquare = function (e) {
        var _this = this;
        console.log('mousedown');
        var new_object = $('<div>').addClass('shape-helper');
        var click_y = e.pageY - this.workspaceContainer.offset().top;
        var click_x = e.pageX - this.workspaceContainer.offset().left;

        new_object.css({
            'top': click_y,
            'left': click_x,
            //'background': this.getRandomColor(),
            'background': 'rgb(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ')',
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

        var params = {
            top: new_y,
            left: new_x,
            width: width,
            height: height,
            //background: new_object.css('background-color'),
            backgroundR: this.convertRBGtoColor(new_object.css('background-color'), 'r'),
            backgroundG: this.convertRBGtoColor(new_object.css('background-color'), 'g'),
            backgroundB: this.convertRBGtoColor(new_object.css('background-color'), 'b'),
            backgroundA: 1,
            opacity: new_object.css('opacity'),
            zindex: this.app.timeline.layers.length,
            borderRadius: [0, 0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            skewX: 0,
            skewY: 0
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
                    backgroundR: this.computeParameter(interval['left'].shape.parameters.backgroundR, interval['right'].shape.parameters.backgroundR, bezier(p)),
                    backgroundG: this.computeParameter(interval['left'].shape.parameters.backgroundG, interval['right'].shape.parameters.backgroundG, bezier(p)),
                    backgroundB: this.computeParameter(interval['left'].shape.parameters.backgroundB, interval['right'].shape.parameters.backgroundB, bezier(p)),
                    backgroundA: this.computeParameter(interval['left'].shape.parameters.backgroundA, interval['right'].shape.parameters.backgroundA, bezier(p)),
                    opacity: this.computeOpacity(interval['left'].shape.parameters.opacity, interval['right'].shape.parameters.opacity, bezier(p)),
                    borderRadius: [
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[0], interval['right'].shape.parameters.borderRadius[0], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[1], interval['right'].shape.parameters.borderRadius[1], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[2], interval['right'].shape.parameters.borderRadius[2], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[3], interval['right'].shape.parameters.borderRadius[3], bezier(p))
                    ],
                    rotateX: this.computeParameter(interval['left'].shape.parameters.rotateX, interval['right'].shape.parameters.rotateX, bezier(p)),
                    rotateY: this.computeParameter(interval['left'].shape.parameters.rotateY, interval['right'].shape.parameters.rotateY, bezier(p)),
                    rotateZ: this.computeParameter(interval['left'].shape.parameters.rotateZ, interval['right'].shape.parameters.rotateZ, bezier(p)),
                    skewX: this.computeParameter(interval['left'].shape.parameters.skewX, interval['right'].shape.parameters.skewX, bezier(p)),
                    skewY: this.computeParameter(interval['left'].shape.parameters.skewY, interval['right'].shape.parameters.skewY, bezier(p))
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

        layers.forEach(function (item, index) {
            var keyframe = item.getKeyframeByTimestamp(currentTimestamp);

            //if no keyframe, take get init keyframe
            if (keyframe == null) {
                keyframe = item.getKeyframe(0);
            }

            var timestamps = item.timestamps;

            //find closest left and right
            /*var left: number = null;
            var right: number = null;
            var i = 0;
            timestamps.forEach((value: number, index: number) => {
            if (currentTimestamp > value) {
            left = value;
            i = index;
            }
            });*/
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

            /*if (i < (timestamps.length-1)) {
            right = timestamps[i+1];
            }*/
            var params = null;
            var interval = new Array();
            if (left != null) {
                interval['left'] = item.getKeyframeByTimestamp(left);
                params = interval['left'].shape.parameters;
            }
            if (right != null) {
                interval['right'] = item.getKeyframeByTimestamp(right);
                params = interval['right'].shape.parameters;
            }

            /*console.log(interval['left']);
            console.log(interval['right']);*/
            //working in mozilla?
            if (Object.keys(interval).length == 2) {
                //var bezier = BezierEasing(0.25, 0.1, 0.0, 1.0);
                var fn = interval['left'].timing_function;
                var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
                var p = (currentTimestamp - left) / (right - left);

                params = {
                    top: _this.computeParameter(interval['left'].shape.parameters.top, interval['right'].shape.parameters.top, bezier(p)),
                    left: _this.computeParameter(interval['left'].shape.parameters.left, interval['right'].shape.parameters.left, bezier(p)),
                    width: _this.computeParameter(interval['left'].shape.parameters.width, interval['right'].shape.parameters.width, bezier(p)),
                    height: _this.computeParameter(interval['left'].shape.parameters.height, interval['right'].shape.parameters.height, bezier(p)),
                    backgroundR: _this.computeParameter(interval['left'].shape.parameters.backgroundR, interval['right'].shape.parameters.backgroundR, bezier(p)),
                    backgroundG: _this.computeParameter(interval['left'].shape.parameters.backgroundG, interval['right'].shape.parameters.backgroundG, bezier(p)),
                    backgroundB: _this.computeParameter(interval['left'].shape.parameters.backgroundB, interval['right'].shape.parameters.backgroundB, bezier(p)),
                    backgroundA: _this.computeParameter(interval['left'].shape.parameters.backgroundA, interval['right'].shape.parameters.backgroundA, bezier(p)),
                    opacity: _this.computeOpacity(interval['left'].shape.parameters.opacity, interval['right'].shape.parameters.opacity, bezier(p)),
                    borderRadius: [
                        _this.computeParameter(interval['left'].shape.parameters.borderRadius[0], interval['right'].shape.parameters.borderRadius[0], bezier(p)),
                        _this.computeParameter(interval['left'].shape.parameters.borderRadius[1], interval['right'].shape.parameters.borderRadius[1], bezier(p)),
                        _this.computeParameter(interval['left'].shape.parameters.borderRadius[2], interval['right'].shape.parameters.borderRadius[2], bezier(p)),
                        _this.computeParameter(interval['left'].shape.parameters.borderRadius[3], interval['right'].shape.parameters.borderRadius[3], bezier(p))
                    ],
                    rotateX: _this.computeParameter(interval['left'].shape.parameters.rotateX, interval['right'].shape.parameters.rotateX, bezier(p)),
                    rotateY: _this.computeParameter(interval['left'].shape.parameters.rotateY, interval['right'].shape.parameters.rotateY, bezier(p)),
                    rotateZ: _this.computeParameter(interval['left'].shape.parameters.rotateZ, interval['right'].shape.parameters.rotateZ, bezier(p)),
                    skewX: _this.computeParameter(interval['left'].shape.parameters.skewX, interval['right'].shape.parameters.skewX, bezier(p)),
                    skewY: _this.computeParameter(interval['left'].shape.parameters.skewY, interval['right'].shape.parameters.skewY, bezier(p))
                };
            }

            _this.transformShape(item.id, params, item.idEl);
            //this.transformShape(item.id, keyframe.shape._parameters);
        });
    };

    Workspace.prototype.transformShape = function (id, params, idEl) {
        if (typeof idEl === "undefined") { idEl = null; }
        var shape = this.workspaceContainer.find('.square[data-id="' + id + '"]');
        var helper = this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]');

        shape.css({
            'top': params.top,
            'left': params.left,
            'width': params.width,
            'height': params.height,
            //'background': params.background,
            'background': 'rgba(' + params.backgroundR + ',' + params.backgroundG + ',' + params.backgroundB + ',' + params.backgroundA + ')',
            'border': params.border,
            'z-index': shape.css('z-index'),
            'opacity': params.opacity,
            'border-top-left-radius': params.borderRadius[0],
            'border-top-right-radius': params.borderRadius[1],
            'border-bottom-right-radius': params.borderRadius[2],
            'border-bottom-left-radius': params.borderRadius[3],
            'transform': 'rotateX(' + params.rotateX + 'deg) rotateY(' + params.rotateY + 'deg) rotateZ(' + params.rotateZ + 'deg) skew(' + params.skewX + 'deg , ' + params.skewY + 'deg)'
        });

        helper.css({
            'top': params.top - 1,
            'left': params.left - 1,
            'width': params.width + 2,
            'height': params.height + 2,
            'z-index': helper.css('z-index')
        });

        if (idEl != null) {
            shape.attr('id', idEl);
        } else {
            shape.removeAttr('id');
        }

        //if current layer, set dimensions in control panel
        var highlightLayerID = this.workspaceContainer.find('.shape-helper.highlight').first().data('id');
        if (highlightLayerID == id) {
            this.app.controlPanel.updateDimensions({ width: params.width, height: params.height });
            this.app.controlPanel.updateOpacity(params.opacity);
            this.app.controlPanel.updateColor({ r: params.backgroundR, g: params.backgroundG, b: params.backgroundB });
            this.app.controlPanel.updateBorderRadius(params.borderRadius);
            this.app.controlPanel.update3DRotate({ x: params.rotateX, y: params.rotateY, z: params.rotateZ });
        }
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

    Workspace.prototype.renderShapes = function () {
        var _this = this;
        console.log('Rendering workspace..');
        var layers = this.app.timeline.layers;
        this.workspaceContainer.empty();

        layers.forEach(function (item, index) {
            var shape = $('<div>').addClass('square');
            var helper = $('<div>').addClass('shape-helper');
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
                var params = keyframe.shape.parameters;
                var css = {
                    'top': params.top,
                    'left': params.left,
                    'width': params.width,
                    'height': params.height,
                    'background': 'rgba(' + params.backgroundR + ',' + params.backgroundG + ',' + params.backgroundB + ',' + params.backgroundA + ')',
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

                shape.attr('data-id', keyframe.shape.id);
                helper.attr('data-id', keyframe.shape.id);
                helpername.appendTo(helper);
                shape.appendTo(_this.workspaceContainer);
                helper.appendTo(_this.workspaceContainer);
            }
        });

        this.dragResize();

        if (this.app.controlPanel.Mode == 1 /* CREATE_DIV */) {
            $('.shape-helper').draggable('disable');
            $('.shape-helper').removeClass('ui-state-disabled').resizable('disable');
        }
    };

    Workspace.prototype.dragResize = function () {
        var _this = this;
        //hook draging on shapes
        $('.shape-helper').draggable({
            scroll: false,
            drag: function (event, ui) {
                var id = $(event.target).data('id');
                _this.workspaceContainer.find('.square[data-id="' + id + '"]').css({
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

                _this.renderShapes();
                _this.transformShapes();
                ;
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
                var shape = _this.workspaceContainer.find('.square[data-id="' + id + '"]');
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

                //this.renderShapes();
                _this.transformShapes();
                _this.app.timeline.selectLayer(layer.id);
            }
        });
    };

    Workspace.prototype.highlightShape = function (arrayID) {
        var _this = this;
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        arrayID.forEach(function (id, index) {
            _this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').addClass('highlight');

            //last selected shape(if selected more then one)
            if (index == (arrayID.length - 1)) {
                var shape = _this.getCurrentShape(id);
                if (shape) {
                    _this.app.controlPanel.updateDimensions({ width: shape.parameters.width, height: shape.parameters.height });
                    _this.app.controlPanel.updateOpacity(shape.parameters.opacity);
                    _this.app.controlPanel.updateColor({ r: shape.parameters.backgroundR, g: shape.parameters.backgroundG, b: shape.parameters.backgroundB });
                    _this.app.controlPanel.updateBorderRadius(shape.parameters.borderRadius);
                    _this.app.controlPanel.updateIdEl(_this.app.timeline.getLayer(id).idEl);
                    _this.app.controlPanel.update3DRotate({ x: shape.parameters.rotateX, y: shape.parameters.rotateY, z: shape.parameters.rotateZ });
                }
            }
        });
    };

    Workspace.prototype.getCurrentShape = function (id) {
        var shapeEl = this.workspaceContainer.find('.square[data-id="' + id + '"]');
        if (shapeEl.length) {
            var params = {
                //top: shapeEl.position().top,
                //left: shapeEl.position().left,
                top: this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().top + 1,
                left: this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().left + 1,
                width: shapeEl.width(),
                height: shapeEl.height(),
                //background: shapeEl.css('background-color'),
                backgroundR: this.convertRBGtoColor(shapeEl.css('background-color'), 'r'),
                backgroundG: this.convertRBGtoColor(shapeEl.css('background-color'), 'g'),
                backgroundB: this.convertRBGtoColor(shapeEl.css('background-color'), 'b'),
                backgroundA: 1,
                opacity: parseFloat(shapeEl.css('opacity')),
                zindex: parseInt(shapeEl.css('z-index')),
                borderRadius: [
                    parseInt(shapeEl.css('border-top-left-radius')),
                    parseInt(shapeEl.css('border-top-right-radius')),
                    parseInt(shapeEl.css('border-bottom-right-radius')),
                    parseInt(shapeEl.css('border-bottom-left-radius'))
                ],
                //not working on chrome
                //rotateX: this.parseRotation(shapeEl.attr('style'), 0),
                //rotateY: this.parseRotation(shapeEl.attr('style'), 1),
                //rotateZ: this.parseRotation(shapeEl.attr('style'), 2),
                //rotateX: 0,
                //rotateY: 0,
                //rotateZ: 0,
                //workaround
                rotateX: this.getTransformAttr(id, 'rotateX'),
                rotateY: this.getTransformAttr(id, 'rotateY'),
                rotateZ: this.getTransformAttr(id, 'rotateZ'),
                skewX: this.getTransformAttr(id, 'skewX'),
                skewY: this.getTransformAttr(id, 'skewY')
            };

            var shape = new Shape(params);
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

    Workspace.prototype.convertRBGtoColor = function (rgb, part) {
        var parts = rgb.match(/\d+/g);
        if (part == 'r') {
            return parseInt(parts[0]);
        } else if (part == 'g') {
            return parseInt(parts[1]);
        } else if (part == 'b') {
            return parseInt(parts[2]);
        }
    };

    Workspace.prototype.parseRotation = function (style, index) {
        var s = style.split(';');
        var t = s[s.length - 2];
        var x = t.match(/\(.*?\)/g)[index];
        x = x.substr(1, x.length - 2);
        return parseInt(x.replace('deg', ''));
    };

    Workspace.prototype.setColor = function (c) {
        this.color = c;
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

            this.renderShapes();
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

            this.renderShapes();
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

            //this.renderShapes();
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

            //this.renderShapes();
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

            //this.renderShapes();
            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };

    Workspace.prototype.setBezier = function (fn) {
        this.bezier = fn;
        var layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            keyframe.timing_function = this.bezier;

            //this.renderShapes();
            this.app.timeline.renderKeyframes(layer.id);
            this.app.timeline.selectLayer(layer.id);
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
            this.renderShapes();
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
        this.workspaceContainer.css(this._workspaceSize);
        $('.workspace-wrapper').perfectScrollbar('update');
    };

    Workspace.prototype.getBezier = function () {
        return this.bezier;
    };

    Workspace.prototype.getHighlightedLayer = function () {
        var layer = this.app.timeline.getLayer(this.workspaceContainer.find('.shape-helper.highlight').first().data('id'));
        if (layer) {
            return layer;
        } else {
            return null;
        }
    };
    return Workspace;
})();
///<reference path="Workspace.ts" />
var Mode;
(function (Mode) {
    Mode[Mode["SELECT"] = 0] = "SELECT";
    Mode[Mode["CREATE_DIV"] = 1] = "CREATE_DIV";
})(Mode || (Mode = {}));

var ControlPanel = (function () {
    function ControlPanel(app, container) {
        var _this = this;
        this.initColor = { r: 44, g: 208, b: 219 };
        this.toolPanelEl = $('<div>').addClass('tool-panel');
        this.selectToolEl = $('<a>').attr('href', '#').addClass('tool-btn').addClass('select').addClass('tooltip').html('<i class="fa fa-location-arrow fa-flip-horizontal"></i>').attr('title', 'Nástroj pro výběr');
        this.createDivToolEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('create-div').html('<i class="fa fa-stop"></i>').attr('title', 'Nástroj Nový DIV');
        this.generateCodeEl = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('generate-code').html('<i class="fa fa-code"></i>').attr('title', 'Vygenerovat kód');
        this.controlPanelEl = $('<div>').addClass('control-panel');
        //private bgPickerEl: JQuery = $('<div>').addClass('picker');
        this.bgPickerEl = $('<input type="text" id="picker"></input>');
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
        this.idEl = $('<input type="text"></input>').attr('id', 'id-el').addClass('number');
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
        this.app = app;
        this.containerEl = container;

        this.toolPanelEl.append(this.selectToolEl);
        this.toolPanelEl.append(this.createDivToolEl);
        this.toolPanelEl.append(this.generateCodeEl);
        this.containerEl.append(this.toolPanelEl);

        //Workspace dimensions
        var workspaceXY = this.itemControlEl.clone();
        workspaceXY.html('<h2>Rozměry plátna</h2>');
        var w = $('<span>').html('width: ').addClass('group-form');
        w.append(this.workspaceWidthEl.val(this.app.workspace.workspaceSize.width.toString()));
        w.append(' px');
        workspaceXY.append(w);
        var h = $('<span>').html('height: ').addClass('group-form');
        h.append(this.workspaceHeightEl.val(this.app.workspace.workspaceSize.height.toString()));
        h.append((' px'));
        workspaceXY.append(h);
        this.controlPanelEl.append(workspaceXY);

        var idElement = this.itemControlEl.clone();
        idElement.html('<h2>ID elementu</h2>');
        var g = $('<span>').html('#').addClass('group-form fullwidth');
        g.append(this.idEl);
        idElement.append(g);
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
        var s = $('<span>').html('#').addClass('bg-input');
        s.append(this.bgPickerEl.val($.colpick.rgbToHex(this.initColor)));
        newItem.append(s);
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
        var w = $('<span>').html('width: ').addClass('group-form');
        w.append(this.dimensionXEl);
        w.append(' px');
        dim.append(w);
        var h = $('<span>').html('height: ').addClass('group-form');
        h.append(this.dimensionYEl);
        h.append(' px');
        dim.append(h);
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
                    _this.app.workspace.setColor(rgb);
                }
            }
        }).on('change', function (e) {
            _this.colorPicker.colpickSetColor($(e.target).val());
            _this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()));
        });
        this.app.workspace.setColor(this.initColor);

        this.opacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 1,
            slide: function (event, ui) {
                _this.opacityEl.val(ui.value).change();
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

        this.selectToolEl.on('click', function (event) {
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            $('.shape-helper').draggable('enable');
            $('.shape-helper').resizable('enable');
        });

        this.createDivToolEl.on('click', function (event) {
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            $('.shape-helper').draggable('disable');
            $('.shape-helper').removeClass('ui-state-disabled').resizable('disable');
        });

        this.generateCodeEl.on('click', function (event) {
            var generator = new GenerateCode(_this.app, _this.app.timeline.layers);
            generator.generate();
        });

        $(document).ready(function () {
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
        this.dimensionXEl.val(d.width.toString());
        this.dimensionYEl.val(d.height.toString());
    };

    ControlPanel.prototype.updateOpacity = function (opacity) {
        this.opacitySliderEl.slider('option', 'value', Number(opacity));
        this.opacityEl.val(opacity.toString());
    };

    ControlPanel.prototype.updateColor = function (color) {
        this.colorPicker.colpickSetColor(color, false);
        this.bgPickerEl.val($.colpick.rgbToHex(color));
    };

    ControlPanel.prototype.updateBorderRadius = function (bradius) {
        this.borderRadiusTLEl.val(bradius[0].toString());
        this.borderRadiusTREl.val(bradius[1].toString());
        this.borderRadiusBLEl.val(bradius[3].toString());
        this.borderRadiusBREl.val(bradius[2].toString());
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

    Object.defineProperty(ControlPanel.prototype, "Mode", {
        get: function () {
            if (this.selectToolEl.hasClass('active')) {
                return 0 /* SELECT */;
            } else if (this.createDivToolEl.hasClass('active')) {
                return 1 /* CREATE_DIV */;
            } else {
                return null;
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

        css += this.objectCss();

        return css;
    };

    GenerateCode.prototype.generateObjects = function () {
        var shapes = $('#workspace').clone();
        shapes.find('.shape-helper').remove();
        shapes.find('div').removeAttr('style');
        shapes.removeAttr('style');

        var markup = '  <div id="workspace">\n';
        shapes.find('div').each(function (index) {
            //markup += '    <div class="object' + $(this).data('id').toString() + '">' + $(this).html().toString() + '</div>\n';
            markup += '    ' + ($(this).addClass('object' + $(this).data('id')).prop('outerHTML')) + '\n';
        });
        markup += '  </div>';
        return markup;
        /*$("<pre />", {
        "html": '&lt;!DOCTYPE html>\n&lt;html>\n' +
        shapes.wrapAll('<div></div>').parent().html()
        .replace(/[<>]/g, function (m) { return { '<': '&lt;', '>': '&gt;' }[m] })
        .replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi, '<a href="$1">$1</a>') +
        '\n&lt;/html>'
        }).appendTo(this.codeWrapperEl);*/
        /*this.generateKeyframes();
        this.gCss({
        'name': '#workspace',
        'width': this.app.workspace.workspaceSize.width + 'px',
        'height': this.app.workspace.workspaceSize.height + 'px',
        });*/
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
            var p = (item.getKeyframeByTimestamp(item.timestamps[0])).shape.parameters;
            var cssObject = {
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
                'position': 'absolute'
            };
            if (_this.app.timeline.repeat) {
                cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
                cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
            } else {
                cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + (item.timestamps[0] / 1000) + 's forwards';
                cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + (item.timestamps[0] / 1000) + 's forwards';
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
                    p = keyframe.shape.parameters;
                    cssObject[percent] = {
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
                        'transform': 'rotateX(' + p.rotateX + 'deg) rotateY(' + p.rotateY + 'deg) rotateZ(' + p.rotateZ + 'deg) skew(' + p.skewX + 'deg , ' + p.skewY + 'deg)'
                    };

                    if (i != item.timestamps.length - 1) {
                        cssObject[percent]['-webkit-animation-timing-function'] = 'cubic-bezier(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')';
                        cssObject[percent]['animation-timing-function'] = 'cubic-bezier(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')';
                    }
                });

                keyframesCss += _this.gKeyframes(cssObject);
            }
            /*var style: JQuery = $("<style>").attr({
            class: "keyframe-style",
            type: "text/css"
            }).append(this.gKeyframes(c));
            style.appendTo('head');*/
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
//# sourceMappingURL=app.js.map
