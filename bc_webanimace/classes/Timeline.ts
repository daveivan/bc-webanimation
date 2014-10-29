///<reference path="Layer.ts" />
class Timeline
{
    timelineContainer: JQuery;
    layers: Array<Layer>;
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

    private app: Application;

    newLayerEl: JQuery = $('<a class="new-layer" href = "#">Nová vrstva <i class="fa fa-file-o"></i></a>');
    deleteLayerEl: JQuery = $('<a class="delete-layer" href="#">Smazat vrstvu/y <i class="fa fa-trash"></i></a>');
    deleteKeyframeEl: JQuery = $('<a>').addClass('delete-keyframe').html('Smazat keyframe <i class="fa fa-trash"></i>').attr('href', '#');
    layersEl: JQuery = $('<div id="layers"></div>');
    timelineHeadEl: JQuery = $('<div class="layers-head"></div>');
    layersWrapperEl: JQuery = $('<div class="layers-wrapper"></div>');
    fixedWidthEl: JQuery = $('<div class="fix-width"></div>');
    keyframesEl: JQuery = $('<div class="keyframes"></div>');
    timelineFooterEl: JQuery = $('<div class="timeline-footer"></div>');
    layersFooterEl: JQuery = $('<div class="layers-footer"></div>');
    keyframesTableEl: JQuery = $('<table><thead></thead><tbody></tbody>');
    pointerEl: JQuery = $('<div class="pointer"><div class="pointer-top"></div></div>');

    constructor(app: Application, timelineContainer: JQuery) {
        this.app = app;
        this.timelineContainer = timelineContainer;
        this.layers = new Array<Layer>();

        this.renderTimeline();

        this.newLayerEl.on('click', (event: JQueryEventObject) => {
            this.addLayer(event);
            return false;
        });

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

        $(document).on('click', 'td', (event: JQueryEventObject) => {
            this.onClickRow(event);
        });

        $(document).on('dblclick', 'td', (event: JQueryEventObject) => {
            this.onCreateKeyframe(event);
        });

        $(document).on('mouseup', '.keyframes > table', (event: JQueryEventObject) => {
            this.onClickTable(event);
        });

        this.keyframesTableEl.on('click', '.keyframe', (event: JQueryEventObject) => {
            this.keyframesTableEl.find('.keyframe').removeClass('selected');
            $(event.target).addClass('selected');
            this.app.workspace.renderShapes();
        });

        this.timelineContainer.ready((event: JQueryEventObject) => {
            this.onReady(event);
        });
    }

    renderTimeline()
    {
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

    private renderKeyframes(id: number) {
        var rowEl: JQuery = this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]');
        rowEl.find('td.keyframes-list').remove();
        var keyframesTdEl: JQuery = $('<td>').addClass('keyframes-list');

        var keyframes: Array<Keyframe> = this.getLayer(id).getAllKeyframes();
        if (keyframes.length > 1) {
            keyframes.forEach((keyframe: Keyframe, index: number) => {
                keyframesTdEl.append($('<div>').addClass('keyframe').attr('data-layer', id).attr('data-index', index).css({
                    'left': this.milisecToPx(keyframe.timestamp) - 5,
                }));

            }); 
            
            rowEl.prepend(keyframesTdEl);  
        }
    }

    private renderLayers() {
        console.log('Rendering layers...');

        //remove layers list
        this.layersEl.empty();
        this.keyframesTableEl.find('tbody').empty();

        //render new layers list from array
        this.layers.forEach((item: Layer, index: number) => {
            this.layersEl.append(($('<div>').addClass('layer').attr('id', index).attr('data-id', item.id)).append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(item.name)));
            //and render frames fot this layer
            this.renderRow(item.id);
            //render keyframes
            this.renderKeyframes(item.id);
        });

        //if array layers is empty, insert default layer
        if (this.layers.length == 0) {
            this.renderRow(0, 'disabled');
            this.layersEl.append($('<div>').addClass('layer disabled').html('Vložte novou vrstvu'));
        }

        //add jeditable plugin
        var me: any = this;
        $('.editable').editable(function(value: string, settings: any) {
            me.onChangeName($(this).attr('id'), value);
            me.app.workspace.renderShapes();
            return (value);
        }, {
            width: 150,
            onblur: 'submit',
           event: 'dblclick',
        });
    }

    selectLayer(id: number) {
        //select layer by ID
        this.keyframesTableEl.find('tbody tr').removeClass('selected');
        this.layersEl.find('.layer').removeClass('selected');
        this.layersEl.find('[data-id="' + id + '"]').addClass('selected');
        this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');

        //highlight shape
        this.app.workspace.highlightShape([id]);
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

    public addLayer(e: JQueryEventObject, shape: Shape = null): number
    {
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
    }

    private deleteLayers(e: JQueryEventObject) {
        console.log('Deleting layers...');

        //iteration from end of array of selected layers
        var selectedLayers: Array<JQueryEventObject> = this.layersEl.find('div.layer.selected').get();
        for (var i: number = selectedLayers.length - 1; i >= 0; i--) {
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
    }

    private sort(e: JQueryEventObject, ui)
    {
        var order: Array<string> = $(e.target).sortable('toArray');
        var firstSelectedEl: JQuery = $(this.layersEl.find('.selected').get(0));

        var tmpLayers: Array<Layer> = new Array<Layer>();
        order.forEach((value: string, index: number) => {
            var layer: Layer = this.layers[parseInt(value)];
            tmpLayers.push(layer);
            var keyframe: Keyframe = layer.getKeyframe(0);
            if (keyframe) {
                keyframe.shape.setZindex(index);
            }
        });
        this.layers = tmpLayers;

        //render layers
        this.renderLayers();
        //render shapes
        this.app.workspace.renderShapes();
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
            },
            drag: (event: JQueryEventObject, ui) => {
                this.pointerPosition = ui.position.left + 1;
                console.log(this.pointerPosition);
            },
            stop: (event: JQueryEventObject, ui) => {
                var posX = Math.round(ui.position.left / this.keyframeWidth) * this.keyframeWidth;
                this.pointerPosition = posX;  
                this.pointerEl.css('left', this.pointerPosition - 1);   
                console.log(this.pointerPosition);
            },
        });
    }

    private onClickTable(e: JQueryEventObject) {
        if (!$(e.target).hasClass('pointer')) {
            this.keyframesTableEl.find('.keyframe').removeClass('selected');
            var n = $(e.target).parents('table');
            var posX = e.pageX - $(n).offset().left;
            posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
            this.pointerPosition = posX;
            console.log(this.pointerPosition);
            this.pointerEl.css('left', this.pointerPosition - 1);   
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
                layer.addKeyframe(this.app.workspace.getCurrentShape(id), ms);

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
            this.app.workspace.renderShapes();
        }
    }
}

