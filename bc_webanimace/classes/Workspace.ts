///<reference path="Shape.ts" />
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
            var id: number = $(event.target).closest('.shape-helper').data('id');
            this.app.timeline.selectLayer(id);
            this.app.timeline.scrollTo(id);
        });

        this.workspaceContainer.on('mouseover', '.shape-helper', (event: JQueryEventObject) => {
            $(event.target).find('.helpername').show();
        });

        this.workspaceContainer.on('mouseout', '.shape-helper', (event: JQueryEventObject) => {
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
            //background: new_object.css('background-color'),
            backgroundR: this.convertRBGtoColor(new_object.css('background-color'), 'r'),
            backgroundG: this.convertRBGtoColor(new_object.css('background-color'), 'g'),
            backgroundB: this.convertRBGtoColor(new_object.css('background-color'), 'b'),
            backgroundA: 1,
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

    public transformShapes() {
        console.log('transform...');
        var currentTimestamp: number = this.app.timeline.pxToMilisec();
        var layers: Array<Layer> = this.app.timeline.layers;

        layers.forEach((item: Layer, index: number) => {
            var keyframe: Keyframe = item.getKeyframeByTimestamp(currentTimestamp);

            //if no keyframe, take get init keyframe
            if (keyframe == null) {
                keyframe = item.getKeyframe(0);
            }

            //nove
            var timestamps: Array<number> = item.timestamps;

            //find closest left and right
            var left: number = null;
            var right: number = null;
            var i = 0;
            timestamps.forEach((value: number, index: number) => {
                if (currentTimestamp > value) {
                    left = value;
                    i = index;
                }
            });

            if (i < (timestamps.length-1)) {
                right = timestamps[i+1];
            }

            var interval: Array<Keyframe> = new Array<Keyframe>();
            if (left != null) {
                interval['left'] = item.getKeyframeByTimestamp(left);
            }
            if (right != null) {
                interval['right'] = item.getKeyframeByTimestamp(right);
            }

            //working in mozilla?
            if (Object.keys(interval).length == 2) {
                var bezier = BezierEasing(0.25, 0.1, 0.0, 1.0);
                var p: number = (currentTimestamp - left) / (right - left);

                var params: Parameters = {
                    top: this.computeParameter(interval['left'].shape.parameters.top, interval['right'].shape.parameters.top, bezier(p)),
                    left: this.computeParameter(interval['left'].shape.parameters.left, interval['right'].shape.parameters.left, bezier(p)),
                    width: this.computeParameter(interval['left'].shape.parameters.width, interval['right'].shape.parameters.width, bezier(p)),
                    height: this.computeParameter(interval['left'].shape.parameters.height, interval['right'].shape.parameters.height, bezier(p)),
                    backgroundR: this.computeParameter(interval['left'].shape.parameters.backgroundR, interval['right'].shape.parameters.backgroundR, bezier(p)),
                    backgroundG: this.computeParameter(interval['left'].shape.parameters.backgroundG, interval['right'].shape.parameters.backgroundG, bezier(p)),
                    backgroundB: this.computeParameter(interval['left'].shape.parameters.backgroundB, interval['right'].shape.parameters.backgroundB, bezier(p)),
                    backgroundA: this.computeParameter(interval['left'].shape.parameters.backgroundA, interval['right'].shape.parameters.backgroundA, bezier(p)),
                }

                this.transformShape(item.id, params);
            }

            //this.transformShape(item.id, keyframe.shape._parameters);
        });
    }

    public transformShape(id: number, params: Parameters) {
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
        });
        
        helper.css({
            'top': params.top - 1,
            'left': params.left - 1,
            'width': params.width + 2,
            'height': params.height + 2,
            'z-index': helper.css('z-index'),
        });
    }

    computeParameter(leftParam: number, rightParam: number, b: number): number {
        var value: number = null;
        var absValue: number = Math.round((Math.abs(rightParam - leftParam)) * b);
        if (leftParam > rightParam) {
            value = leftParam - absValue;
        } else {
            value = leftParam + absValue;
        }
        return value;
    }

    public renderShapes() {
        console.log('Rendering workspace..');
        var layers: Array<Layer> = this.app.timeline.layers;
        this.workspaceContainer.empty();

        layers.forEach((item: Layer, index: number) => {
            var shape: JQuery = $('<div>').addClass('square');
            var helper: JQuery = $('<div>').addClass('shape-helper');
            var helpername: JQuery = $('<div>').addClass('helpername').html('<p>' + item.name + '</p>');

            //get keyframe by pointer position
            var keyframe: Keyframe = item.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());

            //if no keyframe, take get init keyframe
            if (keyframe == null) {
                keyframe = item.getKeyframe(0);
            }
            if (keyframe != null) {
                var params: Parameters = keyframe.shape.parameters;
                var css = {
                    'top': params.top,
                    'left': params.left,
                    'width': params.width,
                    'height': params.height,
                    'background': 'rgba(' + params.backgroundR + ',' + params.backgroundG + ',' + params.backgroundB + ',' + params.backgroundA + ')',
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

                shape.attr('data-id', keyframe.shape.id); 
                helper.attr('data-id', keyframe.shape.id);
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
                    var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
                    if (keyframe == null) {
                        keyframe = layer.getKeyframe(0);
                    }
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1,
                    });
                    this.renderShapes();
                    this.app.timeline.selectLayer(layer.id);
                },
            })

            //resizable shape
            $('.shape-helper').resizable({
                handles: 'all',
                autohide: true,
                containment: 'parent',
                resize: (event, ui) => {
                    var id: number = $(event.target).data('id');
                    var shape: JQuery = this.workspaceContainer.find('.square[data-id="' + id + '"]');
                    shape.css({
                        'top': ui.position.top + 1,
                        'left': ui.position.left + 1,
                        'width': $(event.target).width(),
                        'height': $(event.target).height(),
                    });
                },
                stop: (event, ui) => {
                    var layer: Layer = this.app.timeline.getLayer($(event.target).data('id'));
                    var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
                    if (keyframe == null) {
                        keyframe = layer.getKeyframe(0);
                    }
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1,
                    });
                    keyframe.shape.setDimensions({
                        width: $(event.target).width(),
                        height: $(event.target).height(),
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

    getCurrentShape(id: number): Shape {
        var shapeEl: JQuery = this.workspaceContainer.find('.square[data-id="' + id + '"]');
        if (shapeEl.length) {
            var params: Parameters = {
                top: shapeEl.position().top,
                left: shapeEl.position().left,
                width: shapeEl.width(),
                height: shapeEl.height(),
                //background: shapeEl.css('background-color'),
                backgroundR: this.convertRBGtoColor(shapeEl.css('background-color'), 'r'),
                backgroundG: this.convertRBGtoColor(shapeEl.css('background-color'), 'g'),
                backgroundB: this.convertRBGtoColor(shapeEl.css('background-color'), 'b'),
                backgroundA: 1,
                zindex: parseInt(shapeEl.css('z-index')),
            };

            var shape: Shape = new Shape(params);
            shape.id = id;

            return shape;
        } else {
            return null;   
        }
    }

    private getRandomColor() {
        var letters: string[] = '0123456789ABCDEF'.split('');
        var color: string = '#';
        for (var i: number = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    convertHex(hex, opacity){
        hex = hex.replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

    convertPartColor(hex: string, part: string): number {
        hex = hex.replace('#', '');
        if (part == 'r') {
            var value: number = parseInt(hex.substring(0, 2), 16);
        } else if(part == 'g') {
            var value: number = parseInt(hex.substring(2, 4), 16);
        } else if(part == 'b') {
            var value: number = parseInt(hex.substring(4, 6), 16);
        }

        return value;
    }

    convertRBGtoColor(rgb: string, part: string): number {
        var parts = rgb.match(/\d+/g);
        if (part == 'r') {
            return parseInt(parts[0]);
        } else if (part == 'g') {
            return parseInt(parts[1]);
        } else if (part == 'b') {
            return parseInt(parts[2]);
        }
    }
} 