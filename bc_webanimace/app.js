var Layer = (function () {
    function Layer(name, shape) {
        if (typeof shape === "undefined") { shape = null; }
        this._order = 0;
        this.name = name;
        this.id = ++Layer.counter;
        this.shape = shape;
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

        this.layersWrapperEl.scroll(function (event) {
            _this.onScroll(event);
        });

        this.layersEl.on('mousedown', function (event, ui) {
            _this.onClickLayer(event, ui);
        });

        $(document).on('click', 'td', function (event) {
            _this.onClickRow(event);
        });

        $(document).on('click', '.keyframes > table', function (event) {
            _this.onClickTable(event);
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
            layer.shape = shape;
            layer.shape.id = layer.id;
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
    };

    Timeline.prototype.sort = function (e, ui) {
        var _this = this;
        var order = $(e.target).sortable('toArray');
        var firstSelectedEl = $(this.layersEl.find('.selected').get(0));

        var tmpLayers = new Array();
        order.forEach(function (value, index) {
            var layer = _this.layers[parseInt(value)];
            tmpLayers.push(layer);
            if (layer.shape != null) {
                layer.shape.setZindex(index);
            }
        });
        this.layers = tmpLayers;

        //render layers
        this.renderLayers();

        //render shapes
        this.app.workspace.renderShapes();
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
            drag: function (event, ui) {
                _this.pointerPosition = ui.position.left + 1;
                console.log(_this.pointerPosition);
            }
        });
    };

    Timeline.prototype.onClickTable = function (e) {
        if (!$(e.target).hasClass('pointer')) {
            var n = $(e.target).parents('table');
            var posX = e.pageX - $(n).offset().left;
            this.pointerPosition = posX - 1;
            this.pointerEl.css('left', this.pointerPosition);
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
            var id = $(event.target).data('id');
            _this.app.timeline.selectLayer(id);
            _this.app.timeline.scrollTo(id);
        });

        this.workspaceContainer.on('mouseenter', '.shape-helper', function (event) {
            $(event.target).find('.helpername').show();
        });

        this.workspaceContainer.on('mouseleave', '.shape-helper', function (event) {
            $(event.target).find('.helpername').hide();
        });
    }
    Workspace.prototype.onDrawSquare = function (e) {
        var _this = this;
        console.log('mousedown');
        var new_object = $('<div>').addClass('square-creating');
        var click_y = e.pageY, click_x = e.pageX;

        new_object.css({
            'top': click_y,
            'left': click_x,
            'background': this.getRandomColor(),
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
        var move_x = e.pageX, move_y = e.pageY;
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
            background: new_object.css('background-color'),
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

    Workspace.prototype.renderShapes = function () {
        var _this = this;
        var layers = this.app.timeline.layers;
        this.workspaceContainer.empty();

        layers.forEach(function (item, index) {
            var shape = $('<div>').addClass('square');
            var helper = $('<div>').addClass('shape-helper');
            var helpername = $('<div>').addClass('helpername').html('<p>' + item.name + '</p>');
            if (item.shape != null) {
                var params = item.shape.parameters;
                var css = {
                    'top': params.top,
                    'left': params.left,
                    'width': params.width,
                    'height': params.height,
                    'background': params.background,
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

                shape.attr('data-id', item.shape.id);
                helper.attr('data-id', item.shape.id);
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
                    layer.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1
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

    Workspace.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    return Workspace;
})();
///<reference path="../assets/jquery/jquery.d.ts" />
///<reference path="../assets/jqueryui/jqueryui.d.ts" />
///<reference path="Timeline.ts" />
///<reference path="Workspace.ts" />
var Application = (function () {
    function Application() {
        this.timelineEl = $('<div>').attr('id', 'timeline');
        this.workspaceEl = $('<div>').attr('id', 'workspace');
        console.log('Start Application');
        this.timeline = new Timeline(this, this.timelineEl);
        this.workspace = new Workspace(this, this.workspaceEl);

        $('body').append(($('<div>').addClass('wrapper')).append(this.workspaceEl).append($('<div>').addClass('push')));
        $('body').append(this.timelineEl);
        $('body').append('<p class="help-text">Workspace</p>');
    }
    return Application;
})();

$(document).ready(function () {
    console.log('DOM Loaded');
    new Application();
});
//# sourceMappingURL=app.js.map
