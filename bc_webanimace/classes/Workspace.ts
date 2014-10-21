﻿///<reference path="Shape.ts" />
class Workspace {
    private workspaceContainer: JQuery;
    private createdLayer: boolean = false;
    private app: Application;
    private shapeParams: Parameters;

    constructor(app: Application, workspaceContainer: JQuery) {
        this.app = app;
        this.workspaceContainer = workspaceContainer;

        this.workspaceContainer.on('mousedown', (event: JQueryEventObject) => {
            if ($(event.target).is('#workspace')) {
                this.onDrawSquare(event);   
            }   
        });


        this.workspaceContainer.on('mouseup', (event: JQueryEventObject) => {
            if (this.createdLayer) {
                var shape: Shape = new Shape(this.shapeParams);
                var idLayer: number = this.app.timeline.addLayer(event, shape);
                this.renderShapes();
                this.highlightShape([idLayer]);
                this.createdLayer = false;
            }
        });

        this.workspaceContainer.on('mousedown', '.shape-helper', (event: JQueryEventObject) => {
            this.createdLayer = false;
            var id: number = $(event.target).data('id');
            this.app.timeline.selectLayer(id);
            this.app.timeline.scrollTo(id);
        });

        this.workspaceContainer.on('mouseenter', '.shape-helper', (event: JQueryEventObject) => {
            $(event.target).find('.helpername').show();
        });

        this.workspaceContainer.on('mouseleave', '.shape-helper', (event: JQueryEventObject) => {
            $(event.target).find('.helpername').hide();
        });

    }

    private onDrawSquare(e: JQueryEventObject) {
        console.log('mousedown');
        var new_object: JQuery = $('<div>').addClass('square-creating');
        var click_y = e.pageY, click_x = e.pageX;

        new_object.css({
            'top': click_y,
            'left': click_x,
            'background': this.getRandomColor(),
            'z-index': this.app.timeline.layers.length,
    });

        //new_object.appendTo(this.workspaceContainer);

        this.workspaceContainer.on('mousemove', (event: JQueryEventObject) => {
            this.onChangeSizeSquare(event, click_y, click_x, new_object);
        }).on('mouseup', (event: JQueryEventObject) => {
            this.workspaceContainer.off('mousemove');
        });
    }

    private onChangeSizeSquare(e: JQueryEventObject, click_y, click_x, new_object) {
        var move_x = e.pageX, move_y = e.pageY;
        var width = Math.abs(move_x - click_x);
        var height = Math.abs(move_y - click_y);
        var new_x, new_y;

        new_x = (move_x < click_x) ? (click_x - width) : click_x;
        new_y = (move_y < click_y) ? (click_y - height) : click_y;

        var params: Parameters = {
            top: new_y,
            left: new_x,
            width: width,
            height: height,
            background: new_object.css('background-color'),
            zindex: this.app.timeline.layers.length,
        };

        new_object.css({
            'width': width,
            'height': height,
            'top': new_y,
            'left': new_x,
            'z-index': this.app.timeline.layers.length,
        });
        this.shapeParams = params;

        if (width > 5 && height > 5) {
            new_object.appendTo(this.workspaceContainer);
            this.createdLayer = true;
        } else {
            new_object.remove();
            this.createdLayer = false;
        }
    }

    public renderShapes() {
        var layers: Array<Layer> = this.app.timeline.layers;
        this.workspaceContainer.empty();

        layers.forEach((item: Layer, index: number) => {
            var shape: JQuery = $('<div>').addClass('square');
            var helper: JQuery = $('<div>').addClass('shape-helper');
            var helpername: JQuery = $('<div>').addClass('helpername').html('<p>' + item.name + '</p>');
            if (item.shape != null) {
                var params: Parameters = item.shape.parameters;
                var css = {
                    'top': params.top,
                    'left': params.left,
                    'width': params.width,
                    'height': params.height,
                    'background': params.background,
                    'border': params.border,
                    'z-index': params.zindex,
                }
                shape.css(css);
                helper.css({
                    'top': params.top - 1,
                    'left': params.left - 1,
                    'width': params.width + 2,
                    'height': params.height + 2,       
                    'z-index': params.zindex + 10000,       
                });

                shape.attr('data-id', item.shape.id); 
                helper.attr('data-id', item.shape.id);
                helpername.appendTo(helper);
                shape.appendTo(this.workspaceContainer);
                helper.appendTo(this.workspaceContainer);
            }

            //hook draging on shapes
            $('.shape-helper').draggable({
                containment: 'parent',
                scroll: false,
                drag: (event: JQueryEventObject, ui) => {
                    var id: number = $(event.target).data('id');
                    this.workspaceContainer.find('.square[data-id="' + id + '"]').css({
                        'top': ui.position.top + 1,
                        'left': ui.position.left + 1,
                    });
                },
                stop: (event, ui) => {
                    var layer: Layer = this.app.timeline.getLayer($(event.target).data('id'));
                    layer.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1,
                    });
                    this.renderShapes();
                    this.app.timeline.selectLayer(layer.id);
                },
        });
        });
    }

    highlightShape(arrayID: Array<number>) {
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        arrayID.forEach((id: number, index: number) => {
            this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').addClass('highlight');
        });
    }

    private getRandomColor() {
        var letters: string[] = '0123456789ABCDEF'.split('');
        var color: string = '#';
        for (var i: number = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
} 