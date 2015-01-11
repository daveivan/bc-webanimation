///<reference path="Shape.ts" />
interface rgb {
    r: number;
    g: number;
    b: number;
}

interface rgba extends rgb{
    a: number;
}

interface fontParameters {
    fontFamily: string;
    color: rgb;
    size: number;
}

class Workspace {
    private workspaceContainer: JQuery;
    private workspaceWrapper: JQuery;
    private createdLayer: boolean = false;
    private app: Application;
    private shapeParams: Parameters;
    private color: rgba;
    private opacity: number;
    private bezier: Bezier_points;
    private _workspaceSize: Dimensions = { width: 800, height: 360 };
    private fontParameters: fontParameters;

    private workspaceOverlay: JQuery = $('<div>').addClass('workspace-overlay');
    private uploadArea: JQuery = $('<div>').addClass('upload-area').html('<p>Sem přetáhněte obrázek</p>');
    private uploadBtn: JQuery = $('<input type="file"></input>').addClass('pick-image');

    constructor(app: Application, workspaceContainer: JQuery, workspaceWrapper: JQuery) {
        this.app = app;
        this.workspaceContainer = workspaceContainer;
        this.workspaceWrapper = workspaceWrapper;
        this.uploadArea.append(($('<p>').addClass('perex').html('nebo vyberte soubor ')).append(this.uploadBtn));
        this.workspaceOverlay.append(this.uploadArea);

        this.workspaceContainer.css(this._workspaceSize);

        this.workspaceWrapper.on('mousedown', (event: JQueryEventObject) => {
            //if ($(event.target).is('#workspace')) {
                if (this.app.controlPanel.Mode == Mode.CREATE_DIV) {
                    this.onDrawSquare(event);     
                }
            //}   
        });

        this.workspaceWrapper.on('dblclick', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.TEXT) {
                this.onCreateText(event);
            }
        });

        this.workspaceWrapper.on('mouseup', (event: JQueryEventObject) => {
            if (this.createdLayer) {
                var shape: IShape = new Rectangle(this.shapeParams);
                var layer: Layer = new RectangleLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), shape);
                var idLayer: number = this.app.timeline.addLayer(layer);
                this.renderShapes();
                this.transformShapes();
                this.highlightShape([idLayer]);
                this.createdLayer = false;
            }
        });

        this.workspaceContainer.on('mousedown', '.shape-helper', (event: JQueryEventObject) => {
            this.createdLayer = false;
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                var id: number = $(event.target).closest('.shape-helper').data('id');
                this.app.timeline.selectLayer(id);
                this.app.timeline.scrollTo(id);     
            } 
        });

        //fix for draggable origin point
        this.workspaceContainer.on('click', '.shape-helper', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                var id: number = $(event.target).closest('.shape-helper').data('id');
                this.highlightShape([id]);
            } 
        });

        this.workspaceContainer.on('mouseover', '.shape-helper', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                $(event.target).find('.helpername').show();   
            }
        });

        this.workspaceContainer.on('mouseout', '.shape-helper', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                $(event.target).find('.helpername').hide();   
            }
        });
    }

    private onDrawSquare(e: JQueryEventObject) {
        var new_object: JQuery = $('<div>').addClass('shape-helper');
        var click_y = e.pageY - this.workspaceContainer.offset().top;
        var click_x = e.pageX - this.workspaceContainer.offset().left;

        new_object.css({
            'top': click_y,
            'left': click_x,
            //'background': this.getRandomColor(),
            'background': 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + this.color.a + ')',
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

        //var c = $.color.extract(new_object, 'background-color');
        var barva = parseCSSColor(new_object.css('background-color'));
        var c: rgba = {
            r: barva[0],
            g: barva[1],
            b: barva[2],
            a: barva[3],
        };
        var params: Parameters = {
            top: new_y,
            left: new_x,
            width: width,
            height: height,
            backgroundR: c.r,
            backgroundG: c.g,
            backgroundB: c.b,
            backgroundA: c.a,
            opacity: new_object.css('opacity'),
            zindex: this.app.timeline.layers.length,
            borderRadius: [0, 0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            skewX: 0,
            skewY: 0,
            originX: 50,
            originY: 50,
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
                    backgroundA: this.computeOpacity(interval['left'].shape.parameters.backgroundA, interval['right'].shape.parameters.backgroundA, bezier(p)),
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
                    skewY: this.computeParameter(interval['left'].shape.parameters.skewY, interval['right'].shape.parameters.skewY, bezier(p)),
                    originX: this.computeOpacity(interval['left'].shape.parameters.originX, interval['right'].shape.parameters.originX, bezier(p)),
                    originY: this.computeOpacity(interval['left'].shape.parameters.originY, interval['right'].shape.parameters.originY, bezier(p)),
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
        layers.forEach((layer, index: number) => {
            var shape: JQuery = this.workspaceContainer.find('.shape[data-id="' + layer.id + '"]');
            var helper: JQuery = this.workspaceContainer.find('.shape-helper[data-id="' + layer.id + '"]');
            var currentLayerId = this.workspaceContainer.find('.shape-helper.highlight').first().data('id');

            layer.transform(currentTimestamp, shape, helper, currentLayerId, this.app.controlPanel);
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
            var shape: JQuery = $('<div>').addClass('shape square');
            var helper: JQuery = $('<div>').addClass('shape-helper');
            helper.append($('<div>').addClass('origin-point'));
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
                if (keyframe.shape instanceof Img) {
                    shape = $('<img>').addClass('shape image');
                }

                if (keyframe.shape instanceof TextField) {
                    var l: any = item;
                    shape = $('<span>').addClass('shape froala text').html(l.globalShape.getContent());
                }
            
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

                if (keyframe.shape instanceof Img) {
                    var img: any = keyframe.shape;
                    shape.attr('src', img.getSrc());
                }

                if (keyframe.shape instanceof TextField) {
                    var text: any = keyframe.shape;
                    shape.css({
                        'color': 'rgba(' + text.getColor().r + ',' + text.getColor().g + ',' + text.getColor().b + ')',
                        'font-size': text.getSize(),
                        'font-family': text.getFamily(),
                    });
                    shape.froala({
                        inlineMode: true,
                        paragraphy: false,
                        allowedTags: [],
                        buttons: [],
                        placeholder: 'Zadejte text...',
                    });

                    shape.on('editable.contentChanged', (e, editor) => {
                        this.onChangeText(shape.data('id'), editor.trackHTML);
                    });
                }

                shape.attr('data-id', keyframe.shape.id); 
                helper.attr('data-id', keyframe.shape.id);
                helpername.appendTo(helper);
                shape.appendTo(this.workspaceContainer);
                helper.appendTo(this.workspaceContainer);
            }
        });

        this.dragResize();

        /*if (this.app.controlPanel.Mode == Mode.CREATE_DIV) {
            $('.shape-helper').draggable('disable');
            //$('.origin-point').draggable('disable');
            $('.shape-helper').removeClass('ui-state-disabled').resizable('disable');
        }*/
        this.onChangeMode();
    }


    dragResize() {
        $('.origin-point').draggable();
        //hook draging on shapes
        $('.shape-helper').draggable({
            scroll: false,
            drag: (event: JQueryEventObject, ui) => {
                console.log('dragging helper');
                var id: number = $(event.target).data('id');
                this.workspaceContainer.find('.shape[data-id="' + id + '"]').css({
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

                //this.renderShapes();
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
                var shape: JQuery = this.workspaceContainer.find('.shape[data-id="' + id + '"]');
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
        //var originPoint: JQuery = $('<div>').addClass('origin-point');
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        this.workspaceContainer.find('.shape-helper').find('.origin-point').hide();
        arrayID.forEach((id: number, index: number) => {
            this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').addClass('highlight');
            //last selected shape(if selected more then one)
            if (index == (arrayID.length - 1)) {
                var shape: IShape = this.getCurrentShape(id);
                if (shape) {
                    this.app.controlPanel.updateDimensions({ width: shape.parameters.width, height: shape.parameters.height });
                    this.app.controlPanel.updateOpacity(shape.parameters.opacity);
                    this.app.controlPanel.updateColor({ r: shape.parameters.backgroundR, g: shape.parameters.backgroundG, b: shape.parameters.backgroundB }, shape.parameters.backgroundA);
                    this.app.controlPanel.updateBorderRadius(shape.parameters.borderRadius);
                    this.app.controlPanel.updateIdEl(this.app.timeline.getLayer(id).idEl);
                    this.app.controlPanel.update3DRotate({ x: shape.parameters.rotateX, y: shape.parameters.rotateY, z: shape.parameters.rotateZ });
                    this.app.controlPanel.updateTransformOrigin(shape.parameters.originX, shape.parameters.originY);

                    (this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]')).find('.origin-point').css({
                        'left': shape.parameters.originX + '%',
                        'top': shape.parameters.originY + '%',
                    });

                    if (shape instanceof TextField) {
                        var text: any = shape;
                        var layer: any = this.app.timeline.getLayer(id);
                        this.app.controlPanel.updateFont(text.getColor(), text.getSize(), layer.globalShape.getFamily());
                    }

                    if (this.app.controlPanel.originMode) {
                        (this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]')).find('.origin-point').show();
                        console.log('is origin mode');
                        $('.origin-point').draggable('option', {
                            drag: (event: JQueryEventObject, ui) => {
                                var xPercent: number = ui.position.left / shape.parameters.width * 100;
                                var yPercent: number = ui.position.top / shape.parameters.height * 100;
                                xPercent = Math.round(xPercent * 100) / 100;
                                yPercent = Math.round(yPercent * 100) / 100;

                                this.app.controlPanel.updateTransformOrigin(xPercent, yPercent);
                            },
                            stop: (event, ui) => {
                                var xPercent: number = ui.position.left / shape.parameters.width * 100;
                                var yPercent: number = ui.position.top / shape.parameters.height * 100;
                                xPercent = Math.round(xPercent * 100) / 100;
                                yPercent = Math.round(yPercent * 100) / 100;

                                this.setTransformOrigin('x', xPercent);
                                this.setTransformOrigin('y', yPercent);
                            },
                        });
                    }
                }
            }
        });
    }

    getCurrentShape(id: number): IShape {
        var shapeEl: JQuery = this.workspaceContainer.find('.shape[data-id="' + id + '"]');
        if (shapeEl.length) {
            //var c = $.color.extract(shapeEl, 'background-color');
            var barva = parseCSSColor(shapeEl.css('background-color'));
            var c: rgba = {
                r: barva[0],
                g: barva[1],
                b: barva[2],
                a: barva[3], 
            }
            var params: Parameters = {
                top: this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().top + 1,
                left: this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().left + 1,
                width: shapeEl.width(),
                height: shapeEl.height(),
                backgroundR: c.r,
                backgroundG: c.g,
                backgroundB: c.b,
                backgroundA: c.a,
                opacity: parseFloat(shapeEl.css('opacity')),
                zindex: parseInt(shapeEl.css('z-index')),
                borderRadius: [
                    parseInt(shapeEl.css('border-top-left-radius')),
                    parseInt(shapeEl.css('border-top-right-radius')),
                    parseInt(shapeEl.css('border-bottom-right-radius')),
                    parseInt(shapeEl.css('border-bottom-left-radius'))
                ],
                rotateX: this.getTransformAttr(id, 'rotateX'),
                rotateY: this.getTransformAttr(id, 'rotateY'),
                rotateZ: this.getTransformAttr(id, 'rotateZ'),
                skewX: this.getTransformAttr(id, 'skewX'),
                skewY: this.getTransformAttr(id, 'skewY'),
                originX: this.getTransformAttr(id, 'originX'),
                originY: this.getTransformAttr(id, 'originY'),
            };

            //if background is transparent
            if (c.a == 0) {
                params['backgroundR'] = this.color.r;
                params['backgroundG'] = this.color.g;
                params['backgroundB'] = this.color.b;
            }

            if (this.app.timeline.getLayer(id).globalShape instanceof Img) {
                var shape: IShape = new Img(params, shapeEl.attr('src'));
            } else if (this.app.timeline.getLayer(id).globalShape instanceof TextField) {
                var color: rgb = {
                    r: this.getPartOfRGBA(shapeEl.css('color'), 'r'),
                    g: this.getPartOfRGBA(shapeEl.css('color'), 'g'),
                    b: this.getPartOfRGBA(shapeEl.css('color'), 'b'),
                };
                var size: number = parseFloat(shapeEl.css('font-size'));
                var font: string = shapeEl.css('font-family');
                var shape: IShape = new TextField(params, shapeEl.html().toString(), color, size, font);
            } else {
                var shape: IShape = new Rectangle(params);   
            }
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

    getPartOfRGBA(rgb: string, part: string): number {
        var parts = rgb.match(/\d+/g);
        if (part == 'r') {
            return parseInt(parts[0]);
        } else if (part == 'g') {
            return parseInt(parts[1]);
        } else if (part == 'b') {
            return parseInt(parts[2]);
        } else if (part == 'a') {
            return parseInt(parts[3]);
        }
    }

    parseRotation(style: any, index: number): number {
        var s = style.split(';');
        var t = s[s.length - 2];
        var x = t.match(/\(.*?\)/g)[index];
        x = x.substr(1, x.length - 2);
        return parseInt(x.replace('deg', ''));
    }

    setColor(c: rgb, alpha: number) {
        this.color = {
            r: c.r,
            g: c.g,
            b: c.b,
            a: alpha,
        };
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

    setFont(params: fontParameters, newKeyframe: boolean = true) {
        this.fontParameters = params;
        var layer: Layer = this.getHighlightedLayer();
        if (layer && layer.getKeyframe(0).shape instanceof TextField) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null && newKeyframe) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }

            if (keyframe != null) {
                var textField: any = keyframe.shape;
                textField.setFont(this.fontParameters);  
            }
            var l: any = layer;
            l.globalShape.setFamily(this.fontParameters.fontFamily); 

            //this.renderShapes();
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

            this.transformShapes();
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

    setTransformOrigin(type: string, value: number) {
        console.log('setting transform-origin');
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.getCurrentShape(layer.id), this.app.timeline.pxToMilisec(), this.bezier);
                this.app.timeline.renderKeyframes(layer.id);
            }
            if (type === 'x') {
                keyframe.shape.setOriginX(value);
            } else if (type === 'y') {
                keyframe.shape.setOriginY(value);
            }
            //this.renderShapes();
            this.transformShapes();
            this.app.timeline.selectLayer(layer.id);
        }          
    }

    setSkew(type: string, value: number) {
        console.log('setting skew');
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
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
    }

    setBezier(fn: Bezier_points) {
        this.bezier = fn;
        var layer: Layer = this.getHighlightedLayer();
        if (layer) {         
            var keyframeID: number = this.app.timeline.getSelectedKeyframeID(layer.id);
            var keyframe: Keyframe = layer.getKeyframe(keyframeID);
            if (keyframe != null) {
                keyframe.timing_function = this.bezier;
                this.app.timeline.renderKeyframes(layer.id);
                this.app.timeline.selectLayer(layer.id, keyframeID);
            }
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

    setOriginVisible() {
        this.highlightShape([this.workspaceContainer.find('.shape-helper.highlight').first().data('id')]);
    }

    getHighlightedLayer(): Layer {
        var layer: Layer = this.app.timeline.getLayer(this.workspaceContainer.find('.shape-helper.highlight').first().data('id'));
        if (layer) {
            return layer;
        } else {
            return null;
        }
    }

    insertMode(active: boolean = true) {
        if (active) {
            this.workspaceWrapper.append(this.workspaceOverlay);
            this.workspaceOverlay.css({
                'height': this.workspaceWrapper.outerHeight(),
                'width': this.workspaceWrapper.outerWidth(),
            });
            this.uploadArea.on('dragenter', (event: JQueryEventObject) => {
                console.log('enter');
                $(event.target).addClass('over');
            });

            this.uploadArea.on('dragleave', (event: JQueryEventObject) => {
                $(event.target).removeClass('over');
            });

            this.uploadArea.on('dragover', (event: JQueryEventObject) => {
                console.log('over');
                event.preventDefault();
            });

            this.uploadArea.on('drop', (event: JQueryEventObject) => {
                console.log('upload');
                event.stopPropagation();
                event.preventDefault();
                var files = (<DragEvent>event.originalEvent).dataTransfer.files;
                this.uploadImage(files);
            });

            this.uploadBtn.on('change', (event: any) => {
                console.log('pick image');
                this.uploadImage(event.target.files);
            });
        } else {
            $('.insert-image').removeClass('active');
            this.workspaceOverlay.remove();
        }
    }

    uploadImage(files: FileList) {
        var image: File = files[0];
        if (image.type.match('image.*')) {
            var reader: FileReader = new FileReader();
            reader.onload = ((theFile) => {
                return (e) => {

                    var img = new Image();
                    img.onload = () => {
                        var p: Parameters = {
                            top: 0,
                            left: 0,
                            width: img.width,
                            height: img.height,
                            backgroundR: 255,
                            backgroundG: 255,
                            backgroundB: 255,
                            backgroundA: 0,
                            opacity: 1,
                            borderRadius: [0, 0, 0, 0],
                            rotateX: 0,
                            rotateY: 0,
                            rotateZ: 0,
                            skewX: 0,
                            skewY: 0,
                            originX: 50,
                            originY: 50,
                            zindex: this.app.timeline.layers.length,
                    };
                        var image: IShape = new Img(p, e.target.result);
                        var layer: Layer = new ImageLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), image);
                        var idLayer: number = this.app.timeline.addLayer(layer);
                        this.renderShapes();
                        this.transformShapes();
                        this.highlightShape([idLayer]);

                        this.app.controlPanel.Mode = Mode.SELECT;
                        $('.tool-btn.select').addClass('active');
                        this.onChangeMode();
                    }

                    img.src = e.target.result;
                    //create image layer
                };
            })(image);

            reader.readAsDataURL(image);
        }

        this.insertMode(false);
    }

    onCreateText(e: JQueryEventObject) {
        console.log('creating textfield');

        var params: Parameters = {
            top: e.pageY - this.workspaceContainer.offset().top - 10,
            left: e.pageX - this.workspaceContainer.offset().left - 5,
            width: 150,
            height: 75,
            backgroundR: 255,
            backgroundG: 255,
            backgroundB: 255,
            backgroundA: 0,
            opacity: 1,
            borderRadius: [0, 0, 0, 0],
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            skewX: 0,
            skewY: 0,
            originX: 50,
            originY: 50,
            zindex: this.app.timeline.layers.length,         
        }

        var shape: IShape = new TextField(params, null, this.fontParameters.color, this.fontParameters.size, this.fontParameters.fontFamily);
        var layer: Layer = new TextLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), shape);
        var idLayer: number = this.app.timeline.addLayer(layer);
        this.renderShapes();
        this.transformShapes();
        this.highlightShape([idLayer]);
        this.onChangeMode();
    }

    public onChangeText(id: number, text: string) {
        console.log(text);
        var shape: any = this.app.timeline.getLayer(id).globalShape;
        shape.setContent(text);
    }

    public onChangeMode() {
        console.log('onChangeMode');
        var mode: Mode = this.app.controlPanel.Mode;
        if (mode == Mode.SELECT) {
            $('.shape-helper').draggable('enable');
            $('.origin-point').draggable('enable');
            $('.shape-helper').resizable('enable');
        } else {
            $('.shape-helper').draggable('disable');
            $('.origin-point').draggable('disable');
            $('.shape-helper').resizable('disable');
        }

        if (mode == Mode.IMAGE) {
            this.insertMode(true);
        } else {
            this.insertMode(false);
        }

        if (mode == Mode.TEXT) {
            $('.workspace-wrapper').addClass('text-mode');
            $('.froala').froala('enable');
            $('.froala').removeClass('nonedit');
            this.workspaceContainer.find('.shape.text').each((index: number, el: Element) => {
                $(el).css({
                    'z-index': parseInt(this.workspaceContainer.find('.shape-helper' + '[data-id="' + $(el).data('id') + '"]').css('z-index')) + 1,
                });
            });
        } else {
            $('.workspace-wrapper').removeClass('text-mode');
            $('.froala').froala('disable');
            $('.froala').addClass('nonedit');
            this.workspaceContainer.find('.shape.text').each((index: number, el: Element) => {
                var keyframe: Keyframe = this.app.timeline.getLayer($(el).data('id')).getKeyframe(0);
                $(el).css({
                    'z-index': keyframe.shape.parameters.zindex,
                });
            });
            var sel;
            if (window.getSelection) {
                sel = window.getSelection();
            } else {
                sel = document.selection;
            }
            if (sel) {
                if (sel.removeAllRanges) {
                    sel.removeAllRanges();
                } else if (sel.empty) {
                    sel.empty();
                }
            }
        }
    }
} 