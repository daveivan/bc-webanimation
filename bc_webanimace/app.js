var Layer = (function () {
    function Layer(name, shape) {
        if (typeof shape === "undefined") { shape = null; }
        this._order = 0;
        this.name = name;
        this.id = ++Layer.counter;
        this._keyframes = new Array();
        this._timestamps = new Array();
        if (shape != null) {
            this._keyframes.push(new Keyframe(shape, 0));
        }
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


    Layer.prototype.addKeyframe = function (shape, timestamp, index) {
        if (typeof index === "undefined") { index = null; }
        var keyframe = new Keyframe(shape, timestamp);
        if (index != null) {
            this._keyframes.splice(index, 0, keyframe);
        } else {
            this._keyframes.push(keyframe);
        }

        this._timestamps.push(keyframe.timestamp);
        this.sortTimestamps();
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
        this.newLayerEl = $('<a class="new-layer" href = "#">Nová vrstva <i class="fa fa-file-o"></i></a>');
        this.deleteLayerEl = $('<a class="delete-layer" href="#">Smazat vrstvu/y <i class="fa fa-trash"></i></a>');
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

        $(document).on('click', 'td', function (event) {
            _this.onClickRow(event);
        });

        $(document).on('dblclick', 'td', function (event) {
            _this.onCreateKeyframe(event);
        });

        $(document).on('mouseup', '.keyframes > table', function (event) {
            _this.onClickTable(event);
        });

        this.keyframesTableEl.on('click', '.keyframe', function (event) {
            _this.keyframesTableEl.find('.keyframe').removeClass('selected');
            $(event.target).addClass('selected');

            //this.app.workspace.renderShapes(); <-- misto toho se zavola event pri kliku na tabulku a provede se transformace transformShapes
            _this.app.workspace.renderShapes();
        });

        this.timelineContainer.ready(function (event) {
            _this.onReady(event);
        });
    }
    Timeline.prototype.renderTimeline = function () {
        $(this.timelineHeadEl).append(this.newLayerEl);
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

        var keyframes = this.getLayer(id).getAllKeyframes();
        if (keyframes.length > 1) {
            var minValue = keyframes[0].timestamp, maxValue = keyframes[0].timestamp;

            keyframes.forEach(function (keyframe, index) {
                keyframesTdEl.append($('<div>').addClass('keyframe').attr('data-layer', id).attr('data-index', index).css({
                    'left': _this.milisecToPx(keyframe.timestamp) - 5
                }));
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
            _this.layersEl.append(($('<div>').addClass('layer').attr('id', index).attr('data-id', item.id)).append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(item.name)));

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
        var layer = new Layer('Vrstva ' + (Layer.counter + 1));
        this.layers.push(layer);
        layer.order = this.layers.length;

        //insert shape to layer
        if (shape != null) {
            //init keyframe
            shape.id = layer.id;
            layer.addKeyframe(shape, 0);
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
            }
        });
    };

    Timeline.prototype.onClickTable = function (e) {
        if (!$(e.target).hasClass('pointer')) {
            this.keyframesTableEl.find('.keyframe').removeClass('selected');
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
                layer.addKeyframe(this.app.workspace.getCurrentShape(id), ms);

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
            this.app.workspace.renderShapes();
        }
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
        this.parameters.backgroundR = c.r;
        this.parameters.backgroundG = c.g;
        this.parameters.backgroundB = c.b;
    };
    return Shape;
})();
///<reference path="Shape.ts" />

var Workspace = (function () {
    function Workspace(app, workspaceContainer) {
        var _this = this;
        this.createdLayer = false;
        this.app = app;
        this.workspaceContainer = workspaceContainer;

        this.workspaceContainer.on('mousedown', function (event) {
            if ($(event.target).is('#workspace')) {
                _this.onDrawSquare(event);
            }
        });

        this.workspaceContainer.on('mouseup', function (event) {
            if (_this.createdLayer) {
                var shape = new Shape(_this.shapeParams);
                var idLayer = _this.app.timeline.addLayer(event, shape);
                _this.renderShapes();
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
        var new_object = $('<div>').addClass('square-creating');
        var click_y = e.pageY - this.workspaceContainer.offset().top;
        var click_x = e.pageX - this.workspaceContainer.offset().left;

        new_object.css({
            'top': click_y,
            'left': click_x,
            //'background': this.getRandomColor(),
            'background': 'rgb(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ')',
            'z-index': this.app.timeline.layers.length
        });

        //new_object.appendTo(this.workspaceContainer);
        this.workspaceContainer.on('mousemove', function (event) {
            _this.onChangeSizeSquare(event, click_y, click_x, new_object);
        }).on('mouseup', function (event) {
            _this.workspaceContainer.off('mousemove');
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
            zindex: this.app.timeline.layers.length
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
            this.createdLayer = true;
        } else {
            new_object.remove();
            this.createdLayer = false;
        }
    };

    Workspace.prototype.transformShapes = function () {
        var _this = this;
        console.log('transform...');
        var currentTimestamp = this.app.timeline.pxToMilisec();
        var layers = this.app.timeline.layers;

        layers.forEach(function (item, index) {
            var keyframe = item.getKeyframeByTimestamp(currentTimestamp);

            //if no keyframe, take get init keyframe
            if (keyframe == null) {
                keyframe = item.getKeyframe(0);
            }

            //nove
            var timestamps = item.timestamps;

            //find closest left and right
            var left = null;
            var right = null;
            var i = 0;
            timestamps.forEach(function (value, index) {
                if (currentTimestamp > value) {
                    left = value;
                    i = index;
                }
            });

            if (i < (timestamps.length - 1)) {
                right = timestamps[i + 1];
            }

            var interval = new Array();
            if (left != null) {
                interval['left'] = item.getKeyframeByTimestamp(left);
            }
            if (right != null) {
                interval['right'] = item.getKeyframeByTimestamp(right);
            }

            //working in mozilla?
            if (Object.keys(interval).length == 2) {
                var bezier = BezierEasing(0.25, 0.1, 0.0, 1.0);
                var p = (currentTimestamp - left) / (right - left);

                var params = {
                    top: _this.computeParameter(interval['left'].shape.parameters.top, interval['right'].shape.parameters.top, bezier(p)),
                    left: _this.computeParameter(interval['left'].shape.parameters.left, interval['right'].shape.parameters.left, bezier(p)),
                    width: _this.computeParameter(interval['left'].shape.parameters.width, interval['right'].shape.parameters.width, bezier(p)),
                    height: _this.computeParameter(interval['left'].shape.parameters.height, interval['right'].shape.parameters.height, bezier(p)),
                    backgroundR: _this.computeParameter(interval['left'].shape.parameters.backgroundR, interval['right'].shape.parameters.backgroundR, bezier(p)),
                    backgroundG: _this.computeParameter(interval['left'].shape.parameters.backgroundG, interval['right'].shape.parameters.backgroundG, bezier(p)),
                    backgroundB: _this.computeParameter(interval['left'].shape.parameters.backgroundB, interval['right'].shape.parameters.backgroundB, bezier(p)),
                    backgroundA: _this.computeParameter(interval['left'].shape.parameters.backgroundA, interval['right'].shape.parameters.backgroundA, bezier(p))
                };

                _this.transformShape(item.id, params);
            }
            //this.transformShape(item.id, keyframe.shape._parameters);
        });
    };

    Workspace.prototype.transformShape = function (id, params) {
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
            'z-index': shape.css('z-index')
        });

        helper.css({
            'top': params.top - 1,
            'left': params.left - 1,
            'width': params.width + 2,
            'height': params.height + 2,
            'z-index': helper.css('z-index')
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

    Workspace.prototype.renderShapes = function () {
        var _this = this;
        console.log('Rendering workspace..');
        var layers = this.app.timeline.layers;
        this.workspaceContainer.empty();

        layers.forEach(function (item, index) {
            var shape = $('<div>').addClass('square');
            var helper = $('<div>').addClass('shape-helper');
            var helpername = $('<div>').addClass('helpername').html('<p>' + item.name + '</p>');

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
                    'z-index': params.zindex
                };
                shape.css(css);
                helper.css({
                    'top': params.top - 1,
                    'left': params.left - 1,
                    'width': params.width + 2,
                    'height': params.height + 2,
                    'z-index': params.zindex + 10000
                });

                shape.attr('data-id', keyframe.shape.id);
                helper.attr('data-id', keyframe.shape.id);
                helpername.appendTo(helper);
                shape.appendTo(_this.workspaceContainer);
                helper.appendTo(_this.workspaceContainer);
            }

            //hook draging on shapes
            $('.shape-helper').draggable({
                containment: 'parent',
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
                        keyframe = layer.getKeyframe(0);
                    }
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1
                    });
                    _this.renderShapes();
                    _this.app.timeline.selectLayer(layer.id);
                }
            });

            //resizable shape
            $('.shape-helper').resizable({
                handles: 'all',
                autohide: true,
                containment: 'parent',
                resize: function (event, ui) {
                    var id = $(event.target).data('id');
                    var shape = _this.workspaceContainer.find('.square[data-id="' + id + '"]');
                    shape.css({
                        'top': ui.position.top + 1,
                        'left': ui.position.left + 1,
                        'width': $(event.target).width(),
                        'height': $(event.target).height()
                    });
                },
                stop: function (event, ui) {
                    var layer = _this.app.timeline.getLayer($(event.target).data('id'));
                    var keyframe = layer.getKeyframeByTimestamp(_this.app.timeline.pxToMilisec());
                    if (keyframe == null) {
                        keyframe = layer.getKeyframe(0);
                    }
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1
                    });
                    keyframe.shape.setDimensions({
                        width: $(event.target).width(),
                        height: $(event.target).height()
                    });
                    _this.renderShapes();
                    _this.app.timeline.selectLayer(layer.id);
                }
            });
        });
    };

    Workspace.prototype.highlightShape = function (arrayID) {
        var _this = this;
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        arrayID.forEach(function (id, index) {
            _this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').addClass('highlight');
        });
    };

    Workspace.prototype.getCurrentShape = function (id) {
        var shapeEl = this.workspaceContainer.find('.square[data-id="' + id + '"]');
        if (shapeEl.length) {
            var params = {
                top: shapeEl.position().top,
                left: shapeEl.position().left,
                width: shapeEl.width(),
                height: shapeEl.height(),
                //background: shapeEl.css('background-color'),
                backgroundR: this.convertRBGtoColor(shapeEl.css('background-color'), 'r'),
                backgroundG: this.convertRBGtoColor(shapeEl.css('background-color'), 'g'),
                backgroundB: this.convertRBGtoColor(shapeEl.css('background-color'), 'b'),
                backgroundA: 1,
                zindex: parseInt(shapeEl.css('z-index'))
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

    Workspace.prototype.setColor = function (c) {
        this.color = c;
        var layer = this.app.timeline.getLayer(this.workspaceContainer.find('.shape-helper.highlight').data('id'));
        if (layer) {
            var keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.getKeyframe(0);
            }
            keyframe.shape.setBackground(this.color);

            this.renderShapes();
            this.app.timeline.selectLayer(layer.id);
        }
    };
    return Workspace;
})();
///<reference path="../assets/jquery/jquery.d.ts" />
///<reference path="../assets/jqueryui/jqueryui.d.ts" />
///<reference path="../assets/bezier-easing/index.d.ts" />
///<reference path="Timeline.ts" />
///<reference path="Workspace.ts" />
var Application = (function () {
    function Application() {
        var _this = this;
        this.timelineEl = $('<div>').attr('id', 'timeline');
        this.workspaceEl = $('<div>').attr('id', 'workspace');
        console.log('Start Application');
        this.timeline = new Timeline(this, this.timelineEl);
        this.workspace = new Workspace(this, this.workspaceEl);

        //$('body').append(($('<div>').addClass('wrapper')).append(this.workspaceEl).append($('<div>').addClass('push')));
        $('body').append($('<div>').addClass('top-container'));
        $('body').append(this.timelineEl);

        //$('body').append('<p class="help-text">Workspace</p>');
        //set height
        $('.top-container').css('height', ($(window).height() - this.timelineEl.height()) + 'px');

        $('.top-container').append(($('<div>').addClass('tool-panel')));
        $('.top-container').append(($('<div>').addClass('control-panel')).append(($('<div>').addClass('control-item')).append($('<div>').addClass('picker'))));
        $('.top-container').append(($('<div>').addClass('workspace-wrapper')).append(this.workspaceEl));

        $(window).resize(function () {
            console.log('onResize window');

            $('.top-container').css('height', ($(window).height() - _this.timelineEl.height()) + 'px');
        });

        $('.picker').colpick({
            flat: true,
            layout: 'hex',
            submit: 0,
            color: { r: 255, g: 255, b: 255 },
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                _this.workspace.setColor(rgb);
            }
        });
        this.workspace.setColor({ r: 255, g: 255, b: 255 });
    }
    return Application;
})();

$(document).ready(function () {
    console.log('DOM Loaded');
    new Application();
});
var Keyframe = (function () {
    function Keyframe(shape, timestamp) {
        this._shape = shape;
        this._timestamp = timestamp;
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

    return Keyframe;
})();
//# sourceMappingURL=app.js.map
