var Layer = (function () {
    function Layer(name) {
        this._order = 0;
        this.name = name;
        this.id = ++Layer.counter;
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
    function Timeline(timelineContainer) {
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
        this.timelineContainer = timelineContainer;
        this.layers = new Array();

        this.drawTimeline();

        this.newLayerEl.on('click', function (event) {
            _this.addLayer(event);
        });

        this.deleteLayerEl.on('click', function (event) {
            //this.deleteLayers(event);
            _this.deleteLayers(event);
        });

        this.layersWrapperEl.scroll(function (event) {
            _this.onScroll(event);
        });

        this.layersEl.on('sortupdate', function (event, ui) {
            _this.sort(event, ui);
        });

        this.layersEl.on('mousedown', function (event, ui) {
            _this.onClickLayer(event, ui);
        });

        $(document).on('click', 'td', function (event) {
            _this.onClickRow(event);
        });

        $(document).on('mouseup', '.keyframes > table', function (event) {
            _this.onClickTable(event);
        });

        this.timelineContainer.ready(function (event) {
            _this.onReady(event);
        });
    }
    Timeline.prototype.redrawLayers = function () {
        var _this = this;
        console.log('Refresh layers');
        this.keyframesEl.empty();
        this.keyframesEl.append(this.keyframesTableEl);
        this.fixedWidthEl.width(this.keyframesTableEl.width() + this.layersEl.width() + 15);
        this.layersEl.empty();
        this.layers.forEach(function (item, index) {
            return _this.layersEl.append($('<div class="layer" data-index="' + index + '" id="' + item.id + '">' + item.name + '</div>'));
        });
    };

    Timeline.prototype.drawTimeline = function () {
        $(this.timelineHeadEl).append(this.newLayerEl);
        $(this.timelineContainer).append(this.timelineHeadEl);
        $(this.fixedWidthEl).append(this.layersEl);
        $(this.fixedWidthEl).append(this.keyframesEl);
        $(this.layersFooterEl).append(this.deleteLayerEl);
        $(this.timelineFooterEl).append(this.layersFooterEl);
        $(this.fixedWidthEl).append(this.timelineFooterEl);
        $(this.layersWrapperEl).append(this.fixedWidthEl);
        $(this.timelineContainer).append(this.layersWrapperEl);
        this.drawHeader();
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
            _this.layersEl.append($('<div>').addClass('layer').attr('id', index).attr('data-id', item.id).html(item.name));

            //and render frames fot this layer
            _this.renderRow(item.id);
        });

        //if array layers is empty, insert default layer
        if (this.layers.length == 0) {
            this.renderRow(0, 'disabled');
            this.layersEl.append($('<div>').addClass('layer disabled').html('Vložte novou vrstvu'));
        } else {
            //select last layer in list
            var lastLayer = this.layers[this.layers.length - 1];
            this.selectLayer(lastLayer.id);
        }
    };

    Timeline.prototype.selectLayer = function (id) {
        //select layer by ID
        //? separate (select .last(), select by id) ?
        this.keyframesTableEl.find('tbody tr').removeClass('selected');
        this.layersEl.find('.layer').removeClass('selected');
        this.layersEl.find('[data-id="' + id + '"]').addClass('selected');
        this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');
    };

    Timeline.prototype.drawHeader = function () {
        var head = $('<tr class="first"></tr>');
        var numCells = this.keyframeCount / this.groupKeyframes;

        var milisec = 0;
        for (var i = 0; i < numCells; i++) {
            milisec += this.miliSecPerFrame * this.groupKeyframes;
            head.append('<th colspan="' + this.groupKeyframes + '">' + milisec / 1000 + ' s</th>');
        }

        this.keyframesTableEl.find('thead').append(head);
    };

    Timeline.prototype.addLayer = function (e) {
        console.log('Adding new layer...');

        //remove initial example layer
        this.keyframesTableEl.find('tbody tr.disabled').remove();

        //create layer & push to array & set order(depend on index of array)
        var layer = new Layer('Vrstva ' + (Layer.counter + 1));
        this.layers.push(layer);
        layer.order = this.layers.length;

        //render new layer list
        this.renderLayers();

        this.layersWrapperEl.stop(true, true).animate({ scrollTop: this.layersWrapperEl[0].scrollHeight - 50 }, 300);
        this.layersWrapperEl.perfectScrollbar('update');
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

        //scroll to last layer
        this.layersWrapperEl.scrollTop(this.layersWrapperEl.scrollTop() - (this.layersEl.find('.layer').outerHeight() * selectedLayers.length));
        this.layersWrapperEl.perfectScrollbar('update');
    };

    Timeline.prototype.sort = function (e, ui) {
        var order = $(e.target).sortable('toArray');
        order.forEach(function (value, index) {
            //TODO
        });
    };

    Timeline.prototype.onClickLayer = function (e, ui) {
        //select row by selected layer
        var id = parseInt($(e.target).data('id'));
        if (!isNaN(id)) {
            this.keyframesTableEl.find('tbody tr').removeClass('selected');
            this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');
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
        this.layersEl.multisortable({ items: 'div.layer:not(.disabled)', axis: 'y', containment: '.layers-wrapper', delay: 150, scroll: true, appendTo: '.layers-wrapper' });
        this.layersWrapperEl.perfectScrollbar();
    };

    Timeline.prototype.onClickTable = function (e) {
        if (!$(e.target).hasClass('pointer')) {
            var n = $(e.target).parents('table');
            var posX = e.pageX - $(n).offset().left;
            this.pointerPosition = posX - 1;
            this.pointerEl.css('left', this.pointerPosition);
        }
    };
    return Timeline;
})();
///<reference path="../assets/jquery/jquery.d.ts" />
///<reference path="../assets/jqueryui/jqueryui.d.ts" />
///<reference path="Timeline.ts" />
var Application = (function () {
    function Application() {
        this.timelineEl = $('<div>').attr('id', 'timeline');
        console.log('Start Application');
        new Timeline(this.timelineEl);
        $('body').append(this.timelineEl);
    }
    return Application;
})();

$(document).ready(function () {
    console.log('DOM Loaded');
    new Application();
});
//# sourceMappingURL=app.js.map
