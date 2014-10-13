﻿///<reference path="Layer.ts" />
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

    newLayerEl: JQuery = $('<a class="new-layer" href = "#">Nová vrstva <i class="fa fa-file-o"></i></a>');
    deleteLayerEl: JQuery = $('<a class="delete-layer" href="#">Smazat vrstvu/y <i class="fa fa-trash"></i></a>');
    layersEl: JQuery = $('<div id="layers"></div>');
    timelineHeadEl: JQuery = $('<div class="layers-head"></div>');
    layersWrapperEl: JQuery = $('<div class="layers-wrapper"></div>');
    fixedWidthEl: JQuery = $('<div class="fix-width"></div>');
    keyframesEl: JQuery = $('<div class="keyframes"></div>');
    timelineFooterEl: JQuery = $('<div class="timeline-footer"></div>');
    layersFooterEl: JQuery = $('<div class="layers-footer"></div>');
    keyframesTableEl: JQuery = $('<table><thead></thead><tbody></tbody>');
    pointerEl: JQuery = $('<div class="pointer"><div class="pointer-top"></div></div>');

    constructor(timelineContainer: JQuery)
    {
        this.timelineContainer = timelineContainer;
        this.layers = new Array<Layer>();

        this.drawTimeline();

        this.newLayerEl.on('click', (event: JQueryEventObject) => {
            this.addLayer(event);
        });

        this.deleteLayerEl.on('click', (event: JQueryEventObject) => {
            this.deleteLayers(event);
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

        $(document).on('mouseup', '.keyframes > table', (event: JQueryEventObject) => {
            this.onClickTable(event);
        });

        this.timelineContainer.ready((event: JQueryEventObject) => {
            this.onReady(event);
        });
    }

    redrawLayers(): void 
    {
        console.log('Refresh layers');
        this.keyframesEl.empty();
        this.keyframesEl.append(this.keyframesTableEl);
        this.fixedWidthEl.width(this.keyframesTableEl.width() + this.layersEl.width() + 15);
        this.layersEl.empty();
        this.layers.forEach((item: Layer, index: number) => 
            this.layersEl.append($('<div class="layer" data-index="' + index + '" id="' + item.id + '">' + item.name + '</div>'))
            );
    }

    drawTimeline()
    {
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

    private renderLayers() {
        console.log('Rendering layers...');

        //remove layers list
        this.layersEl.empty();
        this.keyframesTableEl.find('tbody').empty();

        //render new layers list from array
        this.layers.forEach((item: Layer, index: number) => {
            this.layersEl.append($('<div>').addClass('layer').attr('id', index).attr('data-id', item.id).html(item.name));
            //and render frames fot this layer
            this.renderRow(item.id);
        });

        //if array layers is empty, insert default layer
        if (this.layers.length == 0) {
            this.renderRow(0, 'disabled');
            this.layersEl.append($('<div>').addClass('layer disabled').html('Vložte novou vrstvu'));
        }
    }

    private selectLayer(id: number) {
        //select layer by ID
        this.keyframesTableEl.find('tbody tr').removeClass('selected');
        this.layersEl.find('.layer').removeClass('selected');
        this.layersEl.find('[data-id="' + id + '"]').addClass('selected');
        this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');        
    }

    private drawHeader()
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

    private addLayer(e: JQueryEventObject)
    {
        console.log('Adding new layer...');

        //remove initial example layer
        this.keyframesTableEl.find('tbody tr.disabled').remove();

        //create layer & push to array & set order(depend on index of array)
        var layer = new Layer('Vrstva ' + (Layer.counter + 1));
        this.layers.push(layer);
        layer.order = this.layers.length;
    
        //render new layer list
        this.renderLayers();

        this.selectLayer(layer.id);
        this.layersWrapperEl.stop(true, true).animate({ scrollTop: this.layersWrapperEl[0].scrollHeight - 50 }, 300);
        this.layersWrapperEl.perfectScrollbar('update');
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

        //scroll to last layer
        this.selectLayer(this.layersEl.find('.layer').last().data('id'));
        this.layersWrapperEl.scrollTop(this.layersWrapperEl.scrollTop() - (this.layersEl.find('.layer').outerHeight() * selectedLayers.length));
        this.layersWrapperEl.perfectScrollbar('update');
    }

    private sort(e: JQueryEventObject, ui)
    {
        var order: Array<string> = $(e.target).sortable('toArray');
        var firstSelectedEl: JQuery = $(this.layersEl.find('.selected').get(0));

        var tmpLayers: Array<Layer> = new Array<Layer>();
        order.forEach((value: string, index: number) => {
            tmpLayers.push(this.layers[parseInt(value)]);
            console.log(value);
        });
        this.layers = tmpLayers;

        //render layers
        this.renderLayers();
        this.selectLayer(firstSelectedEl.data('id'));
    }

    private onClickLayer(e: JQueryEventObject, ui)
    {
        //select row by selected layer
        var id: number = parseInt($(e.target).data('id'));
        if (!isNaN(id)) {
            this.keyframesTableEl.find('tbody tr').removeClass('selected');
            this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]').addClass('selected');
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
            items: 'div.layer:not(.disabled)',
            axis: 'y', delay: 150,
            scroll: true,
            stop: (e: JQueryEventObject) => {
                this.sort(e, null);
            },
        });
        this.layersWrapperEl.perfectScrollbar();
    }

    private onClickTable(e: JQueryEventObject) {
        if (!$(e.target).hasClass('pointer')) {
            var n = $(e.target).parents('table');
            var posX = e.pageX - $(n).offset().left;
            this.pointerPosition = posX - 1;
            this.pointerEl.css('left', this.pointerPosition);   
        }
    }
}

