///<reference path="Shape.ts" />
interface rgb {
    r: number;
    g: number;
    b: number;
}

class Workspace {
    private workspaceContainer: JQuery;
    private workspaceWrapper: JQuery;
    private createdLayer: boolean = false;
    private app: Application;
    private shapeParams: Parameters;
    private color: rgb;
    private opacity: number;
    private bezier: Bezier_points;
    private _workspaceSize: Dimensions = {width: 800, height: 360};

    constructor(app: Application, workspaceContainer: JQuery, workspaceWrapper: JQuery) {
        this.app = app;
        this.workspaceContainer = workspaceContainer;
        this.workspaceWrapper = workspaceWrapper;

        this.workspaceContainer.css(this._workspaceSize);

        this.workspaceWrapper.on('mousedown', (event: JQueryEventObject) => {
            //if ($(event.target).is('#workspace')) {
                if (this.app.controlPanel.Mode == Mode.CREATE_DIV) {
                    this.onDrawSquare(event);     
                }
            //}   
        });

        this.workspaceWrapper.on('mouseup', (event: JQueryEventObject) => {
            if (this.createdLayer) {
                var shape: Shape = new Shape(this.shapeParams);
                var idLayer: number = this.app.timeline.addLayer(event, shape);
                this.renderShapes();
                this.transformShapes();
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
        var new_object: JQuery = $('<div>').addClass('shape-helper');
        var click_y = e.pageY - this.workspaceContainer.offset().top;
        var click_x = e.pageX - this.workspaceContainer.offset().left;

        new_object.css({
            'top': click_y,
            'left': click_x,
            //'background': this.getRandomColor(),
            'background': 'rgb(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ')',
            'z-index': this.app.timeline.layers.length,
            'opacity': this.opacity,
    });

        //new_object.appendTo(this.workspaceContainer);

        this.workspaceWrapper.on('mousemove', (event: JQueryEventObject) => {
            this.onChangeSizeSquare(event, click_y, click_x, new_object);
        }).on('mouseup', (event: JQueryEventObject) => {
            this.workspaceWrapper.off('mousemove');
        });
    }

    private onChangeSizeSquare(e: JQueryEventObject, click_y, click_x, new_object) {
        var move_x = e.pageX - this.workspaceContainer.offset().left;
        var move_y = e.pageY - this.workspaceContainer.offset().top;
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
            opacity: new_object.css('opacity'),
            zindex: this.app.timeline.layers.length,
            borderRadius: [0, 0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
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
            this.app.controlPanel.updateDimensions({ width: width, height: height });
            this.createdLayer = true;
        } else {
            new_object.remove();
            this.createdLayer = false;
        }
    }

    getTransformAttr(idLayer: number, attr: string): number {
        var currentTimestamp: number = this.app.timeline.pxToMilisec();
        var layer: Layer = this.app.timeline.getLayer(idLayer);
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(currentTimestamp);
            if (keyframe == null) {
                keyframe = layer.getKeyframe(0);
            }
            var timestamps: Array<number> = layer.timestamps;

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
            };

            if (left === null && right === currentTimestamp && timestamps.length >= 2) {
                left = right;
                right = timestamps[index + 1];
            }

            var params: Parameters = null;
            var interval: Array<Keyframe> = new Array<Keyframe>();
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
                var fn: Bezier_points = interval['right'].timing_function;
                var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
                var p: number = (currentTimestamp - left) / (right - left);
                
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
                }
                
            }
            
            return params[attr];
        } else {
            return null;
        }
    }

    public transformShapes() {
        var currentTimestamp: number = this.app.timeline.pxToMilisec();
        var layers: Array<Layer> = this.app.timeline.layers;

        layers.forEach((item: Layer, index: number) => {
            var keyframe: Keyframe = item.getKeyframeByTimestamp(currentTimestamp);

            //if no keyframe, take get init keyframe
            if (keyframe == null) {
                keyframe = item.getKeyframe(0);
            }

            var timestamps: Array<number> = item.timestamps;

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
            };

            if (left === null && right === currentTimestamp && timestamps.length >= 2) {
                left = right;
                right = timestamps[index + 1];
            }

            /*if (i < (timestamps.length-1)) {
                right = timestamps[i+1];
            }*/

            var params: Parameters = null;
            var interval: Array<Keyframe> = new Array<Keyframe>();
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
                var fn: Bezier_points = interval['left'].timing_function;
                var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
                var p: number = (currentTimestamp - left) / (right - left);

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
                }
                
            }

            this.transformShape(item.id, params, item.idEl);

            //this.transformShape(item.id, keyframe.shape._parameters);
        });
    }


    public transformShape(id: number, params: Parameters, idEl = null) {
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
            'transform': 'rotateX(' + params.rotateX + 'deg) rotateY(' + params.rotateY + 'deg) rotateZ(' + params.rotateZ + 'deg)',
        });

        helper.css({
            'top': params.top - 1,
            'left': params.left - 1,
            'width': params.width + 2,
            'height': params.height + 2,
            'z-index': helper.css('z-index'),
        });

        if (idEl != null) {
            shape.attr('id', idEl);
        } else {
            shape.removeAttr('id');
        }

        //if current layer, set dimensions in control panel
        var highlightLayerID: number = this.workspaceContainer.find('.shape-helper.highlight').first().data('id');
        if (highlightLayerID == id) {
            this.app.controlPanel.updateDimensions({ width: params.width, height: params.height });
            this.app.controlPanel.updateOpacity(params.opacity);
            this.app.controlPanel.updateColor({ r: params.backgroundR, g: params.backgroundG, b: params.backgroundB });
            this.app.controlPanel.updateBorderRadius(params.borderRadius);
            this.app.controlPanel.update3DRotate({ x: params.rotateX, y: params.rotateY, z: params.rotateZ });
        }
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

    computeOpacity(leftParam: number, rightParam: number, b: number): number {
        var value: number = null;
        var absValue: number = (Math.abs(rightParam - leftParam)) * b;
        if (leftParam > rightParam) {
            value = Number(leftParam) - Number(absValue);
        } else {
            value = Number(leftParam) + Number(absValue);
        }
        return (Number(value));
    }

    public renderShapes() {
        console.log('Rendering workspace..');
        var layers: Array<Layer> = this.app.timeline.layers;
        this.workspaceContainer.empty();

        layers.forEach((item: Layer, index: number) => {
            var shape: JQuery = $('<div>').addClass('square');
            var helper: JQuery = $('<div>').addClass('shape-helper');
            if (item.idEl) {
                var helpername: JQuery = $('<div>').addClass('helpername').html('<p>' + item.name + '<span class="div-id">#' + item.idEl + '</span></p>');
            } else {
                var helpername: JQuery = $('<div>').addClass('helpername').html('<p>' + item.name + '</p>');   
            }

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
                    'opacity': params.opacity,
                    'border-top-left-radius': params.borderRadius[0],
                    'border-top-right-radius': params.borderRadius[1],
                    'border-bottom-right-radius': params.borderRadius[2],
                    'border-bottom-left-radius': params.borderRadius[3],
                }
                shape.css(css);
                if (item.idEl) {
                    shape.attr('id', item.idEl);
                }
                helper.css({
                    'top': params.top - 1,
                    'left': params.left - 1,
                    'width': params.width + 2,
                    'height': params.height + 2,       
                    'z-index': params.zindex + 1000,       
                });

                shape.attr('data-id', keyframe.shape.id); 
                helper.attr('data-id', keyframe.shape.id);
                helpername.appendTo(helper);
                shape.appendTo(this.workspaceContainer);
                helper.appendTo(this.workspaceContainer);
            }
        });

        this.dragResize();

        if (this.app.controlPanel.Mode == Mode.CREATE_DIV) {
            $('.shape-helper').draggable('disable');
            $('.shape-helper').removeClass('ui-state-disabled').resizable('disable');
        }
    }

    dragResize() {
        //hook draging on shapes
        $('.shape-helper').draggable({
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
                    //keyframe = layer.getKeyframe(0);
                    layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                    this.app.timeline.renderKeyframes(layer.id);
                } else {
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1,
                    });
                }

                this.renderShapes();
                this.transformShapes();;
                this.app.timeline.selectLayer(layer.id);
                $('.workspace-wrapper').perfectScrollbar('update');
            },
        });

        //resizable shape
        $('.shape-helper').resizable({
            handles: 'all',
            autohide: true,
            resize: (event, ui) => {
                var id: number = $(event.target).data('id');
                var shape: JQuery = this.workspaceContainer.find('.square[data-id="' + id + '"]');
                shape.css({
                    'top': ui.position.top + 1,
                    'left': ui.position.left + 1,
                    'width': $(event.target).width(),
                    'height': $(event.target).height(),
                });
                this.app.controlPanel.updateDimensions({ width: $(event.target).width(), height: $(event.target).height() });
            },
            stop: (event, ui) => {
                var layer: Layer = this.app.timeline.getLayer($(event.target).data('id'));
                var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
                if (keyframe == null) {
                    layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                    this.app.timeline.renderKeyframes(layer.id);
                } else {
                    keyframe.shape.setPosition({
                        top: ui.position.top + 1,
                        left: ui.position.left + 1,
                    });
                    keyframe.shape.setDimensions({
                        width: $(event.target).width(),
                        height: $(event.target).height(),
                    });
                }
                //this.renderShapes();
                this.transformShapes();
                this.app.timeline.selectLayer(layer.id);
            },
        });       
    }

    highlightShape(arrayID: Array<number>) {
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        arrayID.forEach((id: number, index: number) => {
            this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').addClass('highlight');
            //last selected shape(if selected more then one)
            if (index == (arrayID.length - 1)) {
                var shape: Shape = this.getCurrentShape(id);
                if (shape) {
                    this.app.controlPanel.updateDimensions({ width: shape.parameters.width, height: shape.parameters.height });
                    this.app.controlPanel.updateOpacity(shape.parameters.opacity);
                    this.app.controlPanel.updateColor({ r: shape.parameters.backgroundR, g: shape.parameters.backgroundG, b: shape.parameters.backgroundB });
                    this.app.controlPanel.updateBorderRadius(shape.parameters.borderRadius);
                    this.app.controlPanel.updateIdEl(this.app.timeline.getLayer(id).idEl);
                    this.app.controlPanel.update3DRotate({ x: shape.parameters.rotateX, y: shape.parameters.rotateY, z: shape.parameters.rotateZ });
                }
            }
        });
    }

    getCurrentShape(id: number): Shape {
        var shapeEl: JQuery = this.workspaceContainer.find('.square[data-id="' + id + '"]');
        if (shapeEl.length) {
            var params: Parameters = {
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

    parseRotation(style: any, index: number): number {
        var s = style.split(';');
        var t = s[s.length - 2];
        var x = t.match(/\(.*?\)/g)[index];
        x = x.substr(1, x.length - 2);
        return parseInt(x.replace('deg', ''));
    }

    setColor(c: rgb) {
        this.color = c;
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            keyframe.shape.setBackground(this.color);   

            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);   
        }
    }

    setOpacity(opacity: number) {
        this.opacity = opacity;
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            keyframe.shape.setOpacity(opacity);

            this.renderShapes();
            this.app.timeline.selectLayer(layer.id);
        }        
    }

    setDimension(axis: string, dimension: number) {
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            if (axis === 'x') {
                keyframe.shape.setX(dimension);
            } else if(axis === 'y')
            {
                keyframe.shape.setY(dimension);
            }

            this.renderShapes();
            this.app.timeline.selectLayer(layer.id);
        }           
    }

    setBorderRadius(type: string, value: number) {
        console.log('Setting border radius');
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
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
    }

    set3DRotate(type: string, value: number) {
        console.log('setting rotate');
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
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
    }

    setBezier(fn: Bezier_points) {
        this.bezier = fn;
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {         
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            keyframe.timing_function = this.bezier;
            //this.renderShapes();
            this.app.timeline.renderKeyframes(layer.id);
            this.app.timeline.selectLayer(layer.id);
        }  
    }

    updateBezierCurve(layer: Layer) {
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe) {
                this.app.controlPanel.updateBezierCurve(keyframe.timing_function);
            } 
        }
    }

    updateBezierCurveByKeyframe(keyframe: Keyframe) {
        if (keyframe) {
            this.app.controlPanel.updateBezierCurve(keyframe.timing_function);
        }
    }

    setIdEl(id: string) {
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var webalizeID = this.webalize(id);

            if (!this.isEmpty(webalizeID)) {
                var unique: boolean = true;
                this.app.timeline.layers.forEach((item: Layer, index: number) => {
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
    }

    isEmpty(str) {
        return (!str || 0 === str.length);
    }

    webalize(s: string) {
        var nodiac = { 'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i', 'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u', 'ů': 'u', 'ý': 'y', 'ž': 'z' };
        s = s.toLowerCase();
        var s2: string = "";
        for (var i: number = 0; i < s.length; i++) {
            s2 += (typeof nodiac[s.charAt(i)] != 'undefined' ? nodiac[s.charAt(i)] : s.charAt(i));
        }

        return s2.replace(/[^a-z0-9_]+/g, '-').replace(/^-|-$/g, '');
    }

    get workspaceSize() {
        return this._workspaceSize;
    }

    setWorkspaceDimension(x: number, y: number) {
        var newDimension: Dimensions;
        if (x != null) {
            newDimension = {
                width: x,
                height: this._workspaceSize.height,
            };
        } 

        if (y != null) {
            newDimension = {
                width: this._workspaceSize.width,
                height: y,
            };
        }

        this._workspaceSize = newDimension;
        this.workspaceContainer.css(this._workspaceSize);
        $('.workspace-wrapper').perfectScrollbar('update');
    }

    getBezier() {
        return this.bezier;
    }

    getHighlightedLayer(): Layer {
        var layer: Layer = this.app.timeline.getLayer(this.workspaceContainer.find('.shape-helper.highlight').first().data('id'));
        if (layer) {
            return layer;
        } else {
            return null;
        }
    }
} 