﻿///<reference path="Layer.ts" />
class Timeline
{
    timelineContainer: JQuery;
    layers: Array<Layer>;
    //array of arrays, for rendering layers by scope
    groupedLayers: Array<Array<Layer>>;
    pointerPosition: number = 0;
    //width of one keyframe in px
    keyframeWidth: number = 15;
    //init number of keyframes
    keyframeCount: number = 100;
    //minimum free frames, when exceed, append another
    expandTimelineBound: number = 10;
    //convert frame to time
    miliSecPerFrame: number = 100;
    groupKeyframes: number = 5;
    playInterval: any;
    playMode: Animation_playing = Animation_playing.STOP;

    private _repeat: boolean = false;

    private app: Application;
    start;
    stop;

    deleteLayerEl: JQuery = $('<a class="delete-layer" href="#">Smazat vrstvu/y <i class="fa fa-trash"></i></a>');
    repeatEl: JQuery = $('<label><input type="checkbox" class="repeat">Opakovat celou animaci</label>')
    deleteKeyframeEl: JQuery = $('<a>').addClass('delete-keyframe').html('Smazat keyframe <i class="fa fa-trash"></i>').attr('href', '#');
    layersEl: JQuery = $('<div id="layers"></div>');
    timelineHeadEl: JQuery = $('<div class="layers-head"></div>');
    layersWrapperEl: JQuery = $('<div class="layers-wrapper"></div>');
    fixedWidthEl: JQuery = $('<div class="fix-width"></div>');
    keyframesEl: JQuery = $('<div class="keyframes"></div>');
    timelineFooterEl: JQuery = $('<div class="timeline-footer"></div>');
    layersFooterEl: JQuery = $('<div class="layers-footer"></div>');
    keyframesFooterEl: JQuery = $('<div class="keyframes-footer"></div>');
    keyframesTableEl: JQuery = $('<table><thead></thead><tbody></tbody>');
    pointerEl: JQuery = $('<div class="pointer"><div class="pointer-top"></div></div>');

    playEl: JQuery = $('<a class="animation-btn play-animation tooltip-top" href="#" title="Přehrát animaci"><i class="fa fa-play"></i></a>');
    stopEl: JQuery = $('<a class="animation-btn stop-animation tooltip-top" href="#" title="Zastavit animaci"><i class="fa fa-stop"></i></a>');
    pauseEl: JQuery = $('<a class="animation-btn pause-animation tooltip-top" href="#" title="Pozastavit animaci"><i class="fa fa-pause"></i></a>');

    constructor(app: Application, timelineContainer: JQuery) {
        this.app = app;
        this.timelineContainer = timelineContainer;
        this.layers = new Array<Layer>();
        this.groupedLayers = new Array<Array<Layer>>();
        this.groupedLayers[0] = new Array<Layer>();

        this.renderTimeline();

        this.buildBreadcrumb(null);

        this.deleteLayerEl.on('click', (event: JQueryEventObject) => {
            this.deleteLayers(event);
            return false;
        });

        this.deleteKeyframeEl.on('click', (event: JQueryEventObject) => {
            this.onDeleteKeyframe(event);
        });

        this.layersWrapperEl.scroll((event: JQueryEventObject) => {
            this.onScroll(event);
        });

        this.layersEl.on('mousedown', (event: JQueryEventObject, ui) => {
            this.onClickLayer(event, ui);
        });

        this.repeatEl.on('change', (event: JQueryEventObject) => {
            this._repeat = this.repeatEl.find('input').is(':checked');
        });

        this.playEl.on('click', (event: JQueryEventObject) => {
            this.playMode = Animation_playing.PLAY;
            this.showPause();
            this.runTimeline();
            console.log('play');
            var int = this.miliSecPerFrame / (this.keyframeWidth / 2);
            console.log(int);
            /*clearTimeout(this.playInterval);*/
            /*this.playInterval = setInterval(() => {
                console.log((new Date()).getMilliseconds());
                this.pointerPosition += 2;
                this.pointerEl.css('left', this.pointerPosition - 1);
                this.app.workspace.transformShapes();
            }, (this.miliSecPerFrame / (this.keyframeWidth / 2)));*/
        });

        this.stopEl.on('click', (event: JQueryEventObject) => {
            //clearTimeout(this.playInterval);
            this.playMode = Animation_playing.STOP;
            this.showPlay();
            $('tr.first').removeClass('to-background');
            cancelAnimationFrame(this.playInterval);
            this.stop = new Date();
            console.log(this.stop - this.start);
            this.pointerPosition = 0;
            this.pointerEl.css('left', this.pointerPosition - 1);
            this.app.workspace.transformShapes();
        });

        this.pauseEl.on('click', (event: JQueryEventObject) => {
            this.playMode = Animation_playing.PAUSE;
            this.showPlay();
            $('tr.first').removeClass('to-background');
            cancelAnimationFrame(this.playInterval);
        });

        $(document).on('mousedown', 'td', (event: JQueryEventObject) => {
            this.onClickRow(event);
        });

        $(document).on('dblclick', 'td', (event: JQueryEventObject) => {
            this.onCreateKeyframe(event);
        });

        $(document).on('mousedown', '.keyframes > table', (event: JQueryEventObject) => {
            this.onClickTable(event);
        });

        this.keyframesTableEl.on('click', '.keyframe', (event: JQueryEventObject) => {
            this.keyframesTableEl.find('.keyframe').removeClass('selected');
            this.keyframesTableEl.find('.timing-function').removeClass('selected');
            $(event.target).addClass('selected');
            $(event.target).next('.timing-function').addClass('selected');
            this.app.workspace.updateBezierCurve(this.getLayer($(event.target).data('layer')));
        });

        this.keyframesTableEl.on('click', '.timing-function p', (event: JQueryEventObject) => {
            var keyframeEl: JQuery = $(event.target).parent('.timing-function').prev('.keyframe');


            this.keyframesTableEl.find('.keyframe').removeClass('selected');
            this.keyframesTableEl.find('.timing-function').removeClass('selected');  
            $(event.target).parent('.timing-function').addClass('selected');
            keyframeEl.addClass('selected');
            var k: Keyframe = this.getLayer(parseInt(keyframeEl.data('layer'))).getKeyframe(parseInt(keyframeEl.data('index')));
            this.app.workspace.updateBezierCurveByKeyframe(k);       
        });

        this.timelineContainer.ready((event: JQueryEventObject) => {
            this.onReady(event);
        });
    }

    showPause() {
        $('.play-animation').hide();
        $('.pause-animation').show();
        $('tr.first').removeClass('to-background');
    }

    showPlay() {
        $('.pause-animation').hide();
        $('.play-animation').show();  
    }

    runTimeline() {
        if (this.playMode == Animation_playing.PAUSE) {
            return false;
        }
        $('tr.first').addClass('to-background');
        cancelAnimationFrame(this.playInterval);
        //find absolute maximum
        var arrayMax = Function.prototype.apply.bind(Math.max, null);
        var absoluteMax: number = 0;
        this.layers.forEach((item: Layer, index: number) => {
            var tmp: number = arrayMax(item.timestamps);
            if (tmp > absoluteMax) absoluteMax = tmp;
        });
        absoluteMax = this.milisecToPx(absoluteMax);
        var time;
        this.start = new Date();
        var draw = () => {
            this.playInterval = requestAnimationFrame(draw);
            var now = new Date().getTime();
            var dt = now - (time || now);

            time = now;
            this.pointerPosition += 2;
            if (this.pointerPosition >= absoluteMax) {
                cancelAnimationFrame(this.playInterval);
                if (this.repeat) {
                    this.pointerPosition = 0;
                    this.pointerEl.css('left', this.pointerPosition - 1);
                    this.app.workspace.transformShapes();
                    draw();
                } else {
                    $('tr.first').removeClass('to-background');
                    this.pointerPosition = 0;
                    this.pointerEl.css('left', this.pointerPosition - 1);
                    this.showPlay();   
                }
            }

            this.pointerEl.css('left', this.pointerPosition - 1);
            this.app.workspace.transformShapes();

        }
        draw();
        return true;
    }

    renderTimeline() {
        $(this.timelineHeadEl).append(this.repeatEl);
        $(this.timelineHeadEl).append(this.playEl);
        $(this.timelineHeadEl).append(this.pauseEl);
        $(this.timelineHeadEl).append(this.stopEl);
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
    }

    private renderRow(id: number, selector: string = null) {
        var trEl: JQuery = $('<tr>').addClass('layer-row').attr('data-id', id);

        if (selector != null) {
            trEl.attr('class', selector);
        }

        //render frames
        for (var i: number = 0; i < this.keyframeCount; i++) {
            var tdEl: JQuery = $('<td>').attr('class', i);

            //every n-th highlighted
            if ((i + 1) % this.groupKeyframes == 0) {
                tdEl.addClass('highlight');
            }

            tdEl.appendTo(trEl);
        }

        this.keyframesTableEl.find('tbody').append(trEl);
    }

    renderKeyframes(id: number) {
        var rowEl: JQuery = this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]');
        rowEl.find('td.keyframes-list').remove();
        rowEl.find('.range').remove();
        var keyframesTdEl: JQuery = $('<td>').addClass('keyframes-list');

        this.getLayer(id).sortKeyframes();
        var keyframes: Array<Keyframe> = this.getLayer(id).getAllKeyframes();
        if (keyframes.length > 1) {

            var minValue: number = keyframes[0].timestamp, maxValue: number = keyframes[0].timestamp;

            keyframes.forEach((keyframe: Keyframe, index: number) => {
                keyframesTdEl.append($('<div>').addClass('keyframe').attr('data-layer', id).attr('data-index', index).css({
                    'left': this.milisecToPx(keyframe.timestamp) - 5,
                }));

                if (index != (keyframes.length - 1)) {
                    keyframesTdEl.append($('<div>').addClass('timing-function').html('<p>(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 +')</p>').css({
                        'left': this.milisecToPx(keyframe.timestamp) + 5,
                        'width': this.milisecToPx(keyframes[index+1].timestamp - keyframe.timestamp) - 10,
                    }));   
                }
                if (keyframe.timestamp < minValue)
                    minValue = keyframe.timestamp;
                if (keyframe.timestamp > maxValue)
                    maxValue = keyframe.timestamp;
            }); 

            keyframesTdEl.append($('<div>').addClass('range').css({
                'left': this.milisecToPx(minValue),
                'width': this.milisecToPx(maxValue - minValue),
            }));
            
            rowEl.prepend(keyframesTdEl);  
        }

        $('.keyframe').draggable({
            axis: "x",
            grid: [this.keyframeWidth, this.keyframeWidth],
            containment: 'tr',
            stop: (event, ui) => {
                //update positon of keyframe
                var ms = this.pxToMilisec((Math.round(ui.position.left / this.keyframeWidth) * this.keyframeWidth));
                var layerID = $(event.target).data('layer');
                var keyframeID = $(event.target).data('index');

                this.getLayer(layerID).updatePosition(keyframeID, ms);

                console.log(this.getLayer(layerID).timestamps);
                this.renderKeyframes(layerID);
            },
            drag: (event, ui) => {
                if (ui.position.left < 11) {
                    console.log($('.keyframe').draggable("option", "grid", [10, 10]));
                } else {
                    $('.keyframe').draggable("option", "grid", [this.keyframeWidth, this.keyframeWidth]);
                }
            },
        });
    }

    renderLayers() {
        console.log('Rendering layers...');

        //remove layers list
        this.layersEl.empty();
        this.keyframesTableEl.find('tbody').empty();

        var isEmpty: boolean = true;

        //render new layers list from array
        this.layers.forEach((item: Layer, index: number) => {
            if (this.app.workspace.scope == item.parent) {
                var layerItem: JQuery = $('<div>').addClass('layer').attr('id', index).attr('data-id', item.id);
                layerItem.append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(item.name));
                if (item.idEl) {
                    layerItem.append($('<span>').addClass('div-id').html('#' + item.idEl));
                }
                this.layersEl.append(layerItem);
                //and render frames fot this layer
                this.renderRow(item.id);
                //render keyframes
                this.renderKeyframes(item.id);
                isEmpty = false;
            }
        });

        //if array layers is empty, insert default layer
        if (this.layers.length == 0 || isEmpty) {
            this.renderRow(0, 'disabled');
            this.layersEl.append($('<div>').addClass('layer disabled').html('Vložte novou vrstvu'));
        }

        //add jeditable plugin
        var me: any = this;
        $('.editable').editable(function (value: string, settings: any) {
            me.onChangeName($(this).attr('id'), value);
            me.app.workspace.renderShapes();
            me.app.workspace.highlightShape([$(this).closest('.layer').data('id')]);
            me.app.workspace.transformShapes();
            return (value);
        }, {
            width: 150,
            onblur: 'submit',
           event: 'dblclick',
            });
    }

    selectLayer(id: number, idKeyframe: number = null) {
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
    }

    private renderHeader()
    {
        var head: JQuery = $('<tr class="first"></tr>');
        var numCells: number = this.keyframeCount / this.groupKeyframes;

        var milisec: number = 0;
        for (var i: number = 0; i < numCells; i++)
        {
            milisec += this.miliSecPerFrame * this.groupKeyframes;
            head.append('<th colspan="' + this.groupKeyframes + '">'+ milisec/1000 +' s</th>');
        }

        this.keyframesTableEl.find('thead').append(head);
    }

    public addLayer(layer): number {
        this.keyframesTableEl.find('tbody tr.disabled').remove();
        this.layers.push(layer);
        if (layer.parent == null) {
            (this.groupedLayers[0]).push(layer);
        } else {
            if (!this.groupedLayers[layer.parent]) {
                this.groupedLayers[layer.parent] = new Array<Layer>();
            }
            (this.groupedLayers[layer.parent]).push(layer);
        }
        layer.order = this.layers.length;
        this.renderLayers();

        this.selectLayer(layer.id);
        this.layersWrapperEl.stop(true, true).animate({ scrollTop: this.layersWrapperEl[0].scrollHeight - 50 }, 300);
        this.layersWrapperEl.perfectScrollbar('update');

        return layer.id;
    }

    private deleteLayer(index: number) {
        var deletedLayer: Layer = this.layers[index];
        this.layers.splice(index, 1);

        //find childrens
        for (var i: number = this.layers.length - 1; i >= 0; i--) {
            if (this.layers[i].parent == deletedLayer.id) {
                this.deleteLayer(i);
            }   
        }
    }

    private deleteLayers(e: JQueryEventObject) {
        console.log('Deleting layers...');

        //iteration from end of array of selected layers
        var selectedLayers: Array<JQueryEventObject> = this.layersEl.find('div.layer.selected').get();
        for (var i: number = selectedLayers.length - 1; i >= 0; i--) {
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

    }

    private sort(e: JQueryEventObject, ui)
    {
        var order: Array<string> = $(e.target).sortable('toArray');
        var firstSelectedEl: JQuery = $(this.layersEl.find('.selected').get(0));

        var outOfScopeLayers: Array < Layer> = new Array<Layer>();
        this.layers.forEach((layer: Layer, index: number) => {
            if (layer.parent != this.app.workspace.scope) {
                outOfScopeLayers.push(layer);
            }
        });

        var tmpLayers: Array<Layer> = new Array<Layer>();
        order.forEach((value: string, index: number) => {
            var layer: Layer = this.layers[parseInt(value)];
            tmpLayers.push(layer);
            //TODO - update z-index podle poradi (brat v potaz keyframe nebo aktualizace do global shape?)
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.app.workspace.getCurrentShape(layer.id), this.pxToMilisec(), this.app.workspace.bezier);
                this.renderKeyframes(layer.id);
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
    }

    private onClickLayer(e: JQueryEventObject, ui)
    {
        //select row by selected layer
        var id: number = parseInt($(e.target).closest('.layer').data('id'));
        if (!isNaN(id)) {
            this.keyframesTableEl.find('tbody tr').removeClass('selected');
            this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');
            //highlight selected shapes
            var selectedLayersID: Array<number> = this.layersEl.find('.selected').map(function () { return $(this).data('id'); }).get();
            this.app.workspace.highlightShape(selectedLayersID);
        }
    }

    private onClickRow(e: JQueryEventObject) {
        //select layer by selected row
        var tr: JQuery = $(e.target).closest('tr');
        if (!tr.hasClass('disabled')) {
            this.selectLayer(tr.data('id'));
        }
    }

    private onScroll(e: JQueryEventObject)
    {
        var posX = this.layersWrapperEl.scrollLeft();
        var posY = this.layersWrapperEl.scrollTop();
        this.layersEl.css('left', posX);
        $('.first').css('top', posY);
        this.layersFooterEl.css('left', posX);
        this.keyframesFooterEl.css('left', posX);
        this.timelineFooterEl.css('bottom', 0 - posY);
        this.pointerEl.find('.pointer-top').css('top', posY);
    }

    private onReady(e: JQueryEventObject)
    {
        this.layersEl.multisortable({
            items: '> div.layer:not(.disabled)',
            axis: 'y', delay: 150,
            scroll: true,
            stop: (e: JQueryEventObject) => {
                this.sort(e, null);
            },
        });
        this.layersEl.sortable("option", "cancel", "span.editable");
        this.layersWrapperEl.perfectScrollbar();

        this.pointerEl.draggable({
            axis: 'x',
            containment: 'parent',
            handle: '.pointer-top',
            start: (event: JQueryEventObject, ui) => {
                this.keyframesTableEl.find('.keyframe').removeClass('selected');
                this.keyframesTableEl.find('.timing-function').removeClass('selected');
            },
            drag: (event: JQueryEventObject, ui) => {
                this.pointerPosition = ui.position.left + 1;
                this.app.workspace.transformShapes();
            },
            stop: (event: JQueryEventObject, ui) => {
                var posX = Math.round(ui.position.left / this.keyframeWidth) * this.keyframeWidth;
                this.pointerPosition = posX;  
                this.pointerEl.css('left', this.pointerPosition - 1);
                this.app.workspace.transformShapes();
            },
        });

        this.showPlay();
    }

    private onClickTable(e: JQueryEventObject) {
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
    }

    private onChangeName(id: number, name: string) {
        this.layers[id].name = name;
    }

    scrollTo(id: number) {
        var scrollTo: number = this.layersEl.find('[data-id="' + id + '"]').offset().top - this.layersEl.offset().top;
        this.layersWrapperEl.stop(true, true).animate({ scrollTop: scrollTo }, 300);
        this.layersWrapperEl.perfectScrollbar('update');
    }

    getLayer(id: number) {
        var layer: Layer = null;

        this.layers.forEach((item: Layer, index: number) => {
            if (item.id == id) {
                layer = item;
            }
        });

        return layer;
    }

    onCreateKeyframe(e: JQueryEventObject) {
        console.log('Creating keyframe...');
        //nejblizsi tr -> vytanout data-id -> najit layer podle id ->vlozit novy keyframe (pouzit  position, nejprve prevest na ms, pouzit shape z workspace)
        var id: number = parseInt($(e.target).closest('tr.selected').data('id'));
        if ($.isNumeric(id)) {
            var layer: Layer = this.getLayer(id);
            var ms: number = this.pxToMilisec(this.pointerPosition);
            if (layer.getKeyframeByTimestamp(ms) === null) {
                layer.addKeyframe(this.app.workspace.getCurrentShape(id), ms, this.app.workspace.getBezier());

                //for check
                layer.getAllKeyframes().forEach((item: Keyframe, index: number) => {
                    console.log(item);
                });
                //for check

                this.renderKeyframes(id);   
            }
        }
    }

    pxToMilisec(px: number = null): number {
        if (px == null) {
            return ((this.pointerPosition / this.keyframeWidth) * this.miliSecPerFrame);
        } else {
            return ((px / this.keyframeWidth) * this.miliSecPerFrame);   
        }
    }

    milisecToPx(ms: number): number {
        return ((ms / this.miliSecPerFrame) * this.keyframeWidth);
    }

    onDeleteKeyframe(e: JQueryEventObject) {
        console.log('Deleting keyframe...');
        var keyframeEl = this.keyframesTableEl.find('tbody .keyframe.selected');

        if (keyframeEl.length) {
            this.getLayer(keyframeEl.data('layer')).deleteKeyframe(keyframeEl.data('index'));

            this.renderKeyframes(keyframeEl.data('layer'));
            this.app.workspace.transformShapes();
        }
    }

    get repeat() {
        return this._repeat;
    }

    getSelectedKeyframeID(idLayer: number) {
        var el: JQuery = (this.keyframesTableEl.find('tr.layer-row[data-id="' + idLayer + '"]')).find('.keyframe.selected');
        return el.data('index');
    }

    buildBreadcrumb(scope: number) {
        console.log('building breadcrumb');
        $('.breadcrumb').remove();
        var container: JQuery = $('<div>').addClass('breadcrumb');
        var currentLayer: Layer = this.getLayer(scope);
        console.log(currentLayer);
        if (currentLayer) {
            container.append($('<span>').html('<a href="#" class="set-scope" data-id=' + currentLayer.id + '>' + currentLayer.name + '</a>'));   
            this.getParent(currentLayer.parent, container);
        }
        container.prepend($('<span>').html('<a href="#" class="set-scope">Hlavní plátno</a>'));
        this.keyframesFooterEl.append(container);
    }

    getParent(parent: number, container: JQuery): Layer {
        var layer: Layer = null;
        layer = this.getLayer(parent);
        if (layer) {
            container.prepend($('<span>').html('<a href="#" class="set-scope" data-id=' + layer.id + '>' + layer.name + '</a>'));
            this.getParent(layer.parent, container);            
        }
        return layer; 
    }
}

