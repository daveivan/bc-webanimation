///<reference path="Shape.ts" />
class Workspace {
    private workspaceContainer: JQuery;
    private workspaceWrapper: JQuery;
    private workspaceContainerOriginal: JQuery;
    private createdLayer: boolean = false;
    private app: Application;
    private shapeParams: Parameters;
    private color: rgba;
    private opacity: number;
    bezier: Bezier_points;
    private _workspaceSize: Dimensions = { width: 800, height: 360 };
    private fontParameters: fontParameters;

    private _scope = null;
    private movedLayer: Layer = null;

    private workspaceOverlay: JQuery = $('<div>').addClass('workspace-overlay');
    private scopeOverlay: JQuery = $('<div>').addClass('overlay-scope overlay-clickable');
    private uploadArea: JQuery = $('<div>').addClass('upload-area').html('<p>Sem přetáhněte obrázek</p>');
    private uploadBtn: JQuery = $('<input type="file"></input>').addClass('pick-image');
    private svgTextArea: JQuery = $('<div>').addClass('svg-area');
    private svgInsertBtn: JQuery = $('<a>').addClass('btn svg-btn').attr('href', '#').html('Vložit');
    private svgText: JQuery = $('<textarea>');
    private loadArea: JQuery = $('<div>').addClass('load-area').html('<p>Sem přetáhněte .json soubor s uloženými objekty</p>');
    private loadBtn: JQuery = $('<input type="file"></input>').addClass('pick-json');
    private contextMenuEl: JQuery = $('<div>').addClass('context-menu');
    private menuItemDelete: JQuery = $('<a>').addClass('menu-item menu-delete').attr('href', '#').html('<i class="fa fa-trash"></i> Smazat objekt');
    private menuItemToBackground: JQuery = $('<a>').addClass('menu-item menu-tobackground').attr('href', '#').html('<i class="fa fa-long-arrow-down"></i> Níže do pozadí');
    private menuItemToForeground: JQuery = $('<a>').addClass('menu-item menu-toforeground').attr('href', '#').html('<i class="fa fa-long-arrow-up"></i> Výše do popředí');
    private menuItemDuplicate: JQuery = $('<a>').addClass('menu-item menu-duplicate').attr('href', '#').html('<i class="fa fa-files-o"></i> Duplikovat objekt');
    private menuItemMoveTo: JQuery = $('<a>').addClass('menu-item menu-moveto').attr('href', '#').html('<i class="fa fa-file"></i> Přesunout do...');
    private menuItemMoveHere: JQuery = $('<a>').addClass('menu-item menu-movehere').attr('href', '#').html('<i class="fa fa-file-o"></i> ...Přesunout tady');
    private menuItemMoveCancel: JQuery = $('<a>').addClass('menu-item menu-movecancel').attr('href', '#').html('<i class="fa fa-times"></i> Zrušit přesun');

    constructor(app: Application, workspaceContainer: JQuery, workspaceWrapper: JQuery) {
        this.app = app;
        this.workspaceContainer = workspaceContainer;
        this.workspaceContainerOriginal = workspaceContainer;
        this.workspaceWrapper = workspaceWrapper;
        this.uploadArea.append(($('<p>').addClass('perex').html('nebo vyberte soubor ')).append(this.uploadBtn));
        this.loadArea.append(($('<p>').addClass('perex').html('nebo vyberte soubor ')).append(this.loadBtn));
        this.svgTextArea.append('Vložte XML kód');
        this.svgTextArea.append(this.svgText);
        this.svgTextArea.append(this.svgInsertBtn);

        this.workspaceContainer.css(this._workspaceSize);

        $(document).on('mousedown', (e: JQueryEventObject) => {
            //hide context menu
            if (!$(e.target).parents().hasClass('context-menu')) {
                this.contextMenuEl.removeClass('active');
                this.contextMenuEl.remove();
            }
        });

        this.workspaceWrapper.on('mousedown', (event: JQueryEventObject) => {
            //if ($(event.target).is('#workspace')) {
                if (this.app.controlPanel.Mode == Mode.CREATE_DIV) {
                    this.onDrawSquare(event);     
                }
            //}   
        });

        $('html').on('keyup', (e: JQueryEventObject) => {
            if (e.keyCode == 46) {
                if (e.target.nodeName === 'BODY') {
                    this.app.timeline.deleteLayers(e);
                }
            }
        });

        this.workspaceWrapper.on('dblclick', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.TEXT) {
                //if mode is TEXT, create text field
                this.onCreateText(event);
            } else if (this.app.controlPanel.Mode == Mode.SELECT) {
                //if mode is SELECT, check if dblclick is in container -> set scope
                var layer: any = this.app.timeline.getLayer($(event.target).data('id'));
                if (layer instanceof RectangleLayer && $(event.target).hasClass('shape-helper')) {
                    this.setScope(layer.id);
                }
            }
        });

        this.workspaceWrapper.on('mousedown', (e: JQueryEventObject) => {
            //for deselect layer
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                if (!$(e.target).parents().hasClass('context-menu') && !$(e.target).hasClass('shape-helper') && !$(e.target).hasClass('origin-point') && !$(e.target).hasClass('ui-resizable-handle')) {
                    this.app.timeline.selectLayer(null);
                }
            } 

            /*if ($(e.target).hasClass('shape-helper')) {
                if (e.button == 2) {
                    console.log('right click');

                    return false;
                }
            }*/
        });

        this.workspaceContainer.on('contextmenu', (event: JQueryEventObject) => {
            if (!$(event.target).hasClass('shape-helper')) {
                //kontextova nabidka pro presun i na aktualni objekt

                //TODO - doresit (pri presunuti na hlavni platno)
                console.log('contextmenu_current');
                this.contextMenuEl.empty();

                if (this.movedLayer != null) {
                    this.menuItemMoveHere.removeClass('disabled');
                    this.menuItemMoveCancel.removeClass('disabled');
                } else {
                    this.menuItemMoveHere.addClass('disabled');
                    this.menuItemMoveCancel.addClass('disabled');
                }
                if (this.movedLayer != null && this.movedLayer.id === parseInt($(event.target).closest('.shape-helper').data('id'))) {
                    this.menuItemMoveHere.addClass('disabled');
                }

                //context menu items
                var targetID: number = $(event.target).data('id');
                if (!targetID) {
                    targetID = 0;
                }
                this.contextMenuEl.append('<ul></ul>');
                this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemMoveHere.attr('data-id', targetID)));
                this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemMoveCancel.attr('data-id', targetID)));

                this.contextMenuEl.appendTo(this.workspaceContainer);
                this.contextMenuEl.css({
                    'top': event.pageY - this.workspaceContainer.offset().top,
                    'left': event.pageX - this.workspaceContainer.offset().left,
                });
                this.contextMenuEl.focus();

                this.contextMenuEl.addClass('active');



                this.menuItemMoveCancel.on('click', (e: JQueryEventObject) => {
                    if ($(e.target).hasClass('disabled')) {
                        e.preventDefault();
                        return false;
                    }
                    this.movedLayer = null;
                    this.contextMenuEl.remove();
                });

                this.menuItemMoveHere.on('click', (e: JQueryEventObject) => {
                    if ($(e.target).hasClass('disabled')) {
                        e.preventDefault();
                        return false;
                    }

                    var destID: number = parseInt($(e.target).data('id'));
                    if (destID == 0) {
                        if (this.movedLayer) {
                            this.movedLayer.parent = null;

                            this.updateNesting(this.movedLayer);
                        }
                    } else {
                        var destLayer: Layer = this.app.timeline.getLayer(destID);
                        if (this.movedLayer) {
                            this.movedLayer.parent = destLayer.id;
                            //this.movedLayer.nesting = (destLayer.nesting + 1);

                            this.updateNesting(this.movedLayer);
                        }   
                    }

                    this.renderShapes();
                    this.transformShapes();
                    this.app.timeline.renderLayers();
                    this.contextMenuEl.remove();
                    this.movedLayer = null;
                    this.highlightShape([destID]);
                });

                event.preventDefault();
                return false; 
            }
        });

        this.workspaceWrapper.on('contextmenu', '.shape-helper', (event: JQueryEventObject) => {
            console.log('contextmenu');
            this.contextMenuEl.empty();
            
            var scopedLayers: Array<Layer> = new Array<Layer>();
            var outOfScopeLayers: Array<Layer> = new Array<Layer>();
            this.app.timeline.layers.forEach((layer: Layer, index: number) => {
                if (layer.parent == this.scope) {
                    scopedLayers.push(layer);
                } else {
                    outOfScopeLayers.push(layer);
                }
            });
            if (parseInt($(event.target).closest('.shape-helper').data('id')) === scopedLayers[0].id) {
                this.menuItemToBackground.addClass('disabled');
            } else {
                this.menuItemToBackground.removeClass('disabled');
            }

            if (parseInt($(event.target).closest('.shape-helper').data('id')) === scopedLayers[scopedLayers.length-1].id) {
                this.menuItemToForeground.addClass('disabled');
            } else {
                this.menuItemToForeground.removeClass('disabled');
            }

            if (this.movedLayer != null) {
                this.menuItemMoveHere.removeClass('disabled');
                this.menuItemMoveCancel.removeClass('disabled');
            } else {
                this.menuItemMoveHere.addClass('disabled');
                this.menuItemMoveCancel.addClass('disabled');
            }
            if (this.movedLayer != null && this.movedLayer.id === parseInt($(event.target).closest('.shape-helper').data('id'))) {
                this.menuItemMoveHere.addClass('disabled');
            }

            //context menu items
            var targetID: number = $(event.target).closest('.shape-helper').data('id');
            this.contextMenuEl.append('<ul></ul>');
            this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemToForeground.attr('data-id', targetID)));
            this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemToBackground.attr('data-id', targetID)));
            this.contextMenuEl.find('ul').append($('<li class="separator"></li>'));
            this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemMoveTo.attr('data-id', targetID)));
            this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemMoveHere.attr('data-id', targetID)));
            this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemMoveCancel.attr('data-id', targetID)));
            this.contextMenuEl.find('ul').append($('<li class="separator"></li>'));
            this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemDuplicate.attr('data-id', targetID)));
            this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuItemDelete.attr('data-id', targetID)));

            this.contextMenuEl.appendTo($('body'));
            this.contextMenuEl.css({
                'top': event.pageY - $('body').offset().top,
                'left': event.pageX - $('body').offset().left,
            });
            this.contextMenuEl.focus();

            this.contextMenuEl.addClass('active');

            this.menuItemDelete.on('click', (e: JQueryEventObject) => {
                var id: number = parseInt($(e.target).data('id'));
                var index: number = this.app.timeline.getLayerIndex(id);
                this.app.timeline.deleteOneLayer(index);

                this.contextMenuEl.removeClass('active');
                this.contextMenuEl.remove();
            });

            this.menuItemToBackground.on('click', (e: JQueryEventObject) => {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }
                var id: number = parseInt($(e.target).data('id'));
                var layer: Layer = this.app.timeline.getLayer(id);

                scopedLayers.forEach((layer: Layer, index: number) => {
                    if (layer.id == id && index > 0) {
                        var tmp: Layer = scopedLayers[index - 1];
                        scopedLayers[index - 1] = layer;
                        scopedLayers[index] = tmp;
                        scopedLayers[index - 1].globalShape.setZindex(index - 1);
                        scopedLayers[index].globalShape.setZindex(index);
                    } else {
                        layer.globalShape.setZindex(index);
                    }
                });

                this.app.timeline.layers = outOfScopeLayers.concat(scopedLayers);
                //render layers
                this.app.timeline.renderLayers();
                //render shapes
                this.renderShapes();
                this.transformShapes();
                this.app.timeline.selectLayer(id);
            });

            this.menuItemToForeground.on('click', (e: JQueryEventObject) => {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }
                var id: number = parseInt($(e.target).data('id'));
                var layer: Layer = this.app.timeline.getLayer(id);

                scopedLayers.forEach((layer: Layer, index: number) => {
                    if (layer.id == id && index < (scopedLayers.length-1)) {
                        var tmp: Layer = scopedLayers[index + 1];
                        scopedLayers[index + 1] = layer;
                        scopedLayers[index] = tmp;
                        scopedLayers[index + 1].globalShape.setZindex(index + 1);
                        scopedLayers[index].globalShape.setZindex(index);
                    } else {
                        layer.globalShape.setZindex(index);
                    }
                });

                this.app.timeline.layers = outOfScopeLayers.concat(scopedLayers);
                //render layers
                this.app.timeline.renderLayers();
                //render shapes
                this.renderShapes();
                this.transformShapes();
                this.app.timeline.selectLayer(id);
            });

            this.menuItemDuplicate.on('click', (e: JQueryEventObject) => {
                var l: Layer = this.app.timeline.getLayer(parseInt($(e.target).data('id')));
                if (l) {
                    var idNewLayer = this.makeCopy(l);
                    this.renderShapes();
                    this.transformShapes();
                    this.contextMenuEl.remove();
                    this.highlightShape([idNewLayer]);
                }
            });

            this.menuItemMoveTo.on('click', (e: JQueryEventObject) => {
                var l: Layer = this.app.timeline.getLayer(parseInt($(e.target).data('id')));
                if (l) {
                    this.movedLayer = l;
                }
                this.contextMenuEl.remove();
            });

            this.menuItemMoveCancel.on('click', (e: JQueryEventObject) => {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }
                this.movedLayer = null;
                this.contextMenuEl.remove();
            });

            this.menuItemMoveHere.on('click', (e: JQueryEventObject) => {
                if ($(e.target).hasClass('disabled')) {
                    e.preventDefault();
                    return false;
                }

                var destID: number = parseInt($(e.target).data('id'));
                var destLayer: Layer = this.app.timeline.getLayer(destID);
                if (this.movedLayer) {
                    this.movedLayer.parent = destLayer.id;
                    //this.movedLayer.nesting = (destLayer.nesting + 1);

                    this.updateNesting(this.movedLayer);
                }

                this.renderShapes();
                this.transformShapes();
                this.app.timeline.renderLayers();
                this.contextMenuEl.remove();
                this.movedLayer = null;
                this.highlightShape([destID]);
            });

            event.preventDefault();
            return false;
        });

        this.workspaceWrapper.on('mouseup', (event: JQueryEventObject) => {
            if (this.createdLayer) {
                var shape: IShape = new Rectangle(this.shapeParams);
                var layer: Layer = new RectangleLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), shape);
                var parent: number = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
                layer.parent = parent;
                if (layer.parent) {
                    layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
                }
                var idLayer: number = this.app.timeline.addLayer(layer);
                //this.renderShapes();
                this.workspaceWrapper.find('.tmp-shape').remove();
                this.renderSingleShape(idLayer);
                this.transformShapes();
                this.highlightShape([idLayer]);
                this.createdLayer = false;
                this.app.controlPanel.Mode = Mode.SELECT;
                $('.tool-btn').removeClass('active');
                $('.tool-btn.select').addClass('active');
                this.onChangeMode();
                this.app.controlPanel.displayMainPanel(false, 'bezier');
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
        /*this.workspaceContainer.on('click', '.shape-helper', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                var id: number = $(event.target).closest('.shape-helper').data('id');
                this.app.timeline.selectLayer(id);
                this.app.timeline.scrollTo(id); 
            } 
        });*/

        this.workspaceContainer.on('mouseover', '.shape-helper, .ui-resizable-handle', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                $(event.target).closest('.shape-helper').find('.helpername').show();   
            }
        });

        this.workspaceContainer.on('mouseout', '.shape-helper, .ui-resizable-handle', (event: JQueryEventObject) => {
            if (this.app.controlPanel.Mode == Mode.SELECT) {
                $(event.target).closest('.shape-helper').find('.helpername').hide();   
            }
        });

        $(document).ready(() => {
            $(document).on('click', '.breadcrumb span:last-child .set-scope', (e: JQueryEventObject) => {
                console.log('prevent');
                e.preventDefault();
                return false;
            });
            $(document).on('click', '.breadcrumb span:not(:last-child) .set-scope', (e: JQueryEventObject) => {
                var scope: number = null;
                var layer: Layer = this.app.timeline.getLayer($(e.target).data('id'));
                if (layer) {
                    scope = layer.id;
                }
                this.setScope(scope);
            });

            this.workspaceWrapper.on('dblclick', '.overlay-clickable', (e: JQueryEventObject) => {
                var scopedLayer: Layer = this.app.timeline.getLayer(this._scope);
                this.setScope(scopedLayer.parent);
            });

            /*$(document).on('mousedown', '.shape-helper', (e: JQueryEventObject) => {
                console.log('click helper');
                if (e.button == 2) {
                    console.log('right click');

                    return false;
                }

                return true;
            });*/
        });
    }

    updateNesting(l: Layer) {
        var parentLayer: Layer = this.app.timeline.getLayer(l.parent);
        if (parentLayer) {
            l.nesting = (parentLayer.nesting + 1);
        }
        this.app.timeline.layers.forEach((layer: Layer, i: number) => {
            if (layer.parent == l.id) {
                this.updateNesting(layer);
            }
        });
    }

    private onDrawSquare(e: JQueryEventObject) {     
        var new_object: JQuery = $('<div>').addClass('shape-helper tmp-shape');
        console.log(e);
        var click_y = e.pageY - this.workspaceContainer.offset().top;
        var click_x = e.pageX - this.workspaceContainer.offset().left;
        console.log(this.workspaceContainer.offset().top);
        console.log(this.workspaceContainer.offset().left);
        new_object.css({
            'top': click_y,
            'left': click_x,
            //'background': this.getRandomColor(),
            'background': 'rgba(' + this.color.r + ', ' + this.color.g + ', ' + this.color.b + ', ' + 0 + ')',
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
        console.log('pozadovana sirka: ' + this.workspaceContainer.width());
        var params: Parameters = {
            top: new_y,
            left: new_x,
            width: width,
            height: height,
            relativePosition: {
                top: (new_y / this.workspaceContainer.height()) * 100,
                left: (new_x / this.workspaceContainer.width()) * 100,
            },
            relativeSize: {
                width: (width / this.workspaceContainer.width()) * 100,
                height: (height / this.workspaceContainer.height()) * 100,
            },
            background: c,
            opacity: new_object.css('opacity'),
            zindex: this.app.timeline.layers.length,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: {x: 50, y: 50},
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

    getTransformAttr(idLayer: number, attr: string, timestamp: number = null): any {
        if (timestamp == null) {
            var currentTimestamp: number = this.app.timeline.pxToMilisec();
        } else {
            var currentTimestamp: number = timestamp;
        }
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
                    background: {
                        r: this.computeParameter(interval['left'].shape.parameters.background.r, interval['right'].shape.parameters.background.r, bezier(p)),
                        g: this.computeParameter(interval['left'].shape.parameters.background.g, interval['right'].shape.parameters.background.g, bezier(p)),
                        b: this.computeParameter(interval['left'].shape.parameters.background.b, interval['right'].shape.parameters.background.b, bezier(p)),
                        a: this.computeOpacity(interval['left'].shape.parameters.background.a, interval['right'].shape.parameters.background.a, bezier(p)),
                    },
                    opacity: this.computeOpacity(interval['left'].shape.parameters.opacity, interval['right'].shape.parameters.opacity, bezier(p)),
                    borderRadius: [
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[0], interval['right'].shape.parameters.borderRadius[0], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[1], interval['right'].shape.parameters.borderRadius[1], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[2], interval['right'].shape.parameters.borderRadius[2], bezier(p)),
                        this.computeParameter(interval['left'].shape.parameters.borderRadius[3], interval['right'].shape.parameters.borderRadius[3], bezier(p))
                    ],
                    rotate: {
                        x: this.computeParameter(interval['left'].shape.parameters.rotate.x, interval['right'].shape.parameters.rotate.x, bezier(p)),
                        y: this.computeParameter(interval['left'].shape.parameters.rotate.y, interval['right'].shape.parameters.rotate.y, bezier(p)),
                        z: this.computeParameter(interval['left'].shape.parameters.rotate.z, interval['right'].shape.parameters.rotate.z, bezier(p)),
                    },
                    skew: {
                        x: this.computeParameter(interval['left'].shape.parameters.skew.x, interval['right'].shape.parameters.skew.x, bezier(p)),
                        y: this.computeParameter(interval['left'].shape.parameters.skew.y, interval['right'].shape.parameters.skew.y, bezier(p)),
                    },
                    origin: {
                        x: this.computeOpacity(interval['left'].shape.parameters.origin.x, interval['right'].shape.parameters.origin.x, bezier(p)),
                        y: this.computeOpacity(interval['left'].shape.parameters.origin.y, interval['right'].shape.parameters.origin.y, bezier(p)),
                    },
                    zindex: interval['left'].shape.parameters.zindex,
                    relativePosition: {
                        top: this.computeParameter(interval['left'].shape.parameters.relativePosition.top, interval['right'].shape.parameters.relativePosition.top, bezier(p)),
                        left: this.computeParameter(interval['left'].shape.parameters.relativePosition.left, interval['right'].shape.parameters.relativePosition.left, bezier(p)),
                    },
                    relativeSize: {
                        width: this.computeParameter(interval['left'].shape.parameters.relativeSize.width, interval['right'].shape.parameters.relativeSize.width, bezier(p)),
                        height: this.computeParameter(interval['left'].shape.parameters.relativeSize.height, interval['right'].shape.parameters.relativeSize.height, bezier(p)),
                    }
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
            var shape: JQuery = this.workspaceWrapper.find('.shape[data-id="' + layer.id + '"]');
            var helper: JQuery = this.workspaceWrapper.find('.shape-helper[data-id="' + layer.id + '"]');
            var currentLayerId = this.workspaceWrapper.find('.shape-helper.highlight').first().data('id');

            layer.transform(currentTimestamp, shape, helper, currentLayerId, this.app);
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

    public renderShapes(scope: number = null) {
        $('#workspace').empty();
        var existing: boolean = false;
        var scopedLayer: Layer = this.app.timeline.getLayer(scope);
        var nesting: number = 0;
        if (scopedLayer) {
            nesting = scopedLayer.nesting;
        }

        for (var n: number = nesting; ; n++) {
            existing = false;
            var container: JQuery;
            if (n == 0) {
                container = $('#workspace');
            }
            this.app.timeline.layers.forEach((layer: Layer, index: number) => {
                if (layer.nesting == n) {
                    existing = true;
                    var parentLayer: Layer = this.app.timeline.getLayer(layer.parent);
                    if (parentLayer) {
                        container = this.workspaceWrapper.find('.shape[data-id="' + parentLayer.id + '"]');
                    }
                    layer.renderShape(container, this.app.timeline.pxToMilisec(), this.scope);
                }
            });
            if (!existing) {
                break;
            }
        }
        this.dragResize();
        this.onChangeMode();
        if (this.scope) {
            this.workspaceContainer = this.workspaceWrapper.find('.square' + '[data-id="' + this.scope + '"]').addClass('scope');
            /*this.workspaceContainer.parent().prepend($('<div>').css({
                'background-color': '#fff',
                'width': this.workspaceContainer.width(),
                'height': this.workspaceContainer.height(),
                'position': 'absolute',
                'top': this.workspaceContainer.position().top,
                'left': this.workspaceContainer.position().left,
                'z-index': '10002',
            }));*/

            this.workspaceContainer.parents('.square').append($('<div>').addClass('overlay-clickable').css({
                'background-color': 'rgba(255, 255, 255, 0.6)',
                'position': 'absolute',
                'z-index': '10001',
                'width': '100%',
                'height': '100%',
            }));
            this.workspaceContainer.closest('.square').css({
                'outline': '2px solid #f08080',
            });

            this.workspaceContainer.parents('.square').addClass('scope');
        } else {
            this.workspaceContainer = $('#workspace');
        }
    }

    public renderSingleShape(id: number) {
        var shapeEl: JQuery = $('#workspace').find('.shape[data-id="' + id + '"]');
        var container: JQuery = this.workspaceContainer;
        if (shapeEl.length) {
            container = shapeEl.parent();
        }

        var layer: Layer = this.app.timeline.getLayer(id);
        if (layer) {
            layer.renderShape(container, this.app.timeline.pxToMilisec(), this.scope);
        }

        this.dragResize();
        this.onChangeMode();
        if (this.scope) {
            this.workspaceContainer = this.workspaceWrapper.find('.square' + '[data-id="' + this.scope + '"]').addClass('scope');
            this.workspaceContainer.parents('.square').addClass('scope');
        } else {
            this.workspaceContainer = $('#workspace');
        }
    }

    public renderShapesOld() {
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
                    'background': 'rgba(' + params.background.r + ',' + params.background.g + ',' + params.background.b + ',' + params.background.a + ')',
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
                    keyframe.shape.setRelativePosition({
                        top: ((ui.position.top + 1) / this.workspaceContainer.height()) * 100,
                        left: ((ui.position.left + 1) / this.workspaceContainer.width()) * 100
                    });
                }

                this.transformShapes();
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
                    keyframe.shape.setRelativePosition({
                        top: ((ui.position.top + 1) / this.workspaceContainer.height()) * 100,
                        left: ((ui.position.left + 1) / this.workspaceContainer.width()) * 100
                    });
                    keyframe.shape.setDimensions({
                        width: $(event.target).width(),
                        height: $(event.target).height(),
                    });
                    keyframe.shape.setRelativeDimensions({
                        width: (($(event.target).width()) / this.workspaceContainer.width()) * 100,
                        height: (($(event.target).height()) / this.workspaceContainer.height()) * 100
                    });
                }

                this.transformShapes();
                this.app.timeline.selectLayer(layer.id);
            },
        });       
    }

    highlightShape(arrayID: Array<number>) {
        //var originPoint: JQuery = $('<div>').addClass('origin-point');
        this.workspaceContainer.find('.shape-helper').removeClass('highlight');
        this.workspaceContainer.find('.shape-helper').find('.origin-point').hide();

        if (arrayID != null) {
            arrayID.forEach((id: number, index: number) => {
                this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').addClass('highlight');
                //last selected shape(if selected more then one)
                if (index == (arrayID.length - 1)) {
                    var shape: IShape = this.getCurrentShape(id);
                    if (shape) {
                        this.app.controlPanel.updateDimensions({ width: shape.parameters.width, height: shape.parameters.height });
                        this.app.controlPanel.updateOpacity(shape.parameters.opacity);
                        this.app.controlPanel.updateColor({ r: shape.parameters.background.r, g: shape.parameters.background.g, b: shape.parameters.background.b }, shape.parameters.background.a);
                        this.app.controlPanel.updateBorderRadius(shape.parameters.borderRadius);
                        this.app.controlPanel.updateIdEl(this.app.timeline.getLayer(id).idEl);
                        this.app.controlPanel.update3DRotate({ x: shape.parameters.rotate.x, y: shape.parameters.rotate.y, z: shape.parameters.rotate.z });
                        this.app.controlPanel.updateTransformOrigin(shape.parameters.origin.x, shape.parameters.origin.y);

                        (this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]')).find('.origin-point').css({
                            'left': shape.parameters.origin.x + '%',
                            'top': shape.parameters.origin.y + '%',
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
        } else {
            this.app.controlPanel.updateDimensions({ width: null, height: null });
            this.app.controlPanel.updateIdEl(null);
        }
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
            //var topPx: number = this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().top + 1;
            //var leftPx: number = this.workspaceContainer.find('.shape-helper[data-id="' + id + '"]').position().left + 1;
            var topPx: number = shapeEl.position().top;
            var leftPx: number = shapeEl.position().left;
            var params: Parameters = {
                top: topPx,
                left: leftPx,
                width: shapeEl.width(),
                height: shapeEl.height(),
                relativePosition: {
                    top: (topPx / shapeEl.parent().height() * 100),
                    left: (leftPx / shapeEl.parent().width() * 100),
                },
                relativeSize: {
                    width: (shapeEl.width() / shapeEl.parent().width() * 100),
                    height: (shapeEl.height() / shapeEl.parent().height() * 100),
                },
                background: c,
                opacity: parseFloat(shapeEl.css('opacity')),
                zindex: parseInt(shapeEl.css('z-index')),
                borderRadius: [
                    parseInt(shapeEl.css('border-top-left-radius')),
                    parseInt(shapeEl.css('border-top-right-radius')),
                    parseInt(shapeEl.css('border-bottom-right-radius')),
                    parseInt(shapeEl.css('border-bottom-left-radius'))
                ],
                rotate: {
                    x: this.getTransformAttr(id, 'rotate').x,
                    y: this.getTransformAttr(id, 'rotate').y,
                    z: this.getTransformAttr(id, 'rotate').z,
                },
                skew: {
                    x: this.getTransformAttr(id, 'skew').x,
                    y: this.getTransformAttr(id, 'skew').y,
                },
                origin: {
                    x: this.getTransformAttr(id, 'origin').x,
                    y: this.getTransformAttr(id, 'origin').y,
                },
            };

            //if background is transparent
            if (c.a == 0) {
                params['background']['r'] = this.color.r;
                params['background']['g'] = this.color.g;
                params['background']['b'] = this.color.b;
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
            } else if (this.app.timeline.getLayer(id).globalShape instanceof Svg) {
                var shape: IShape = new Svg(params, this.app.timeline.getLayer(id).globalShape.getSrc());
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
                keyframe.shape.setRelativeX((dimension / this.workspaceContainer.width()) * 100);
            } else if(axis === 'y')
            {
                keyframe.shape.setY(dimension);
                keyframe.shape.setRelativeY((dimension / this.workspaceContainer.height()) * 100);
            }

            this.transformShapes();
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
        this.app.controlPanel.displayMainPanel(true, 'bezier');
        if (layer) {
            var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe) {
                this.app.controlPanel.updateBezierCurve(keyframe.timing_function);
            } 
        }
    }

    updateBezierCurveByKeyframe(keyframe: Keyframe) {
        this.app.controlPanel.displayMainPanel(true, 'bezier');
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
            //this.renderShapes();
            this.renderSingleShape(layer.id);
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
        $('#workspace').css(this._workspaceSize);
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

    loadMode(active: boolean = true) {
        if (active) {
            this.workspaceOverlay.empty();
            this.workspaceOverlay.append(this.loadArea);
            this.workspaceWrapper.append(this.workspaceOverlay);
            this.workspaceOverlay.css({
                'height': this.workspaceWrapper.outerHeight(),
                'width': this.workspaceWrapper.outerWidth(),
            });

            //zpracovani souboru
            $('.load-area > p').on('dragenter', (event: JQueryEventObject) => {
                console.log('vp');
                $('.upload-area').addClass('over');
            });

            this.loadArea.on('dragenter', (event: JQueryEventObject) => {
                console.log('enter');
                $(event.target).addClass('over');
            });

            this.loadArea.on('dragleave', (event: JQueryEventObject) => {
                $(event.target).removeClass('over');
            });

            this.loadArea.on('dragover', (event: JQueryEventObject) => {
                console.log('over');
                event.preventDefault();
            });

            this.loadArea.on('drop', (event: JQueryEventObject) => {
                console.log('upload');
                event.stopPropagation();
                event.preventDefault();
                var files = (<DragEvent>event.originalEvent).dataTransfer.files;
                this.uploadFile(files);
            });

            this.loadBtn.on('change', (event: any) => {
                this.uploadFile(event.target.files);
            });
        } else {
            this.workspaceOverlay.remove();
        }
    }

    uploadFile(files: FileList) {
        var file: File = files[0];

        var reader = new FileReader();
        reader.onload = (e) => {
            if (file.name.split('.').pop() == 'json') {
                this.parseJson(e.target.result);
            }
            this.loadBtn.val('');

            this.app.controlPanel.Mode = Mode.SELECT;
            $('.tool-btn').removeClass('active');
            $('.tool-btn.select').addClass('active');
            this.onChangeMode();
        }

        reader.readAsText(file);

        this.insertMode(false);
    }

    parseJson(data: string) {
        var newLayers: Array<Layer> = new Array<Layer>();
        var maxCount = 0;

        //parse fron JSON
        var objLayers = JSON.parse(data);
        objLayers.forEach((obj: any, i: number) => {
            if (obj._type == Type.DIV) {
                var newLayer: Layer = RectangleLayer.parseJson(obj);
            } else if (obj._type == Type.TEXT) {
                var newLayer: Layer = TextLayer.parseJson(obj);
            } else if (obj._type == Type.IMAGE) {
                var newLayer: Layer = ImageLayer.parseJson(obj);
            } else if (obj._type == Type.SVG) {
                var newLayer: Layer = SvgLayer.parseJson(obj);
            }

            newLayers.push(newLayer);
            if (maxCount < newLayer.id) {
                maxCount = newLayer.id;
            }
        });

        Layer.counter = maxCount;
        this.app.timeline.layers = newLayers;
        this.renderShapes();
        this.app.timeline.renderLayers();
        this.transformShapes();
        this.highlightShape(null);
    }

    svgMode(active: boolean = true) {
        if (active) {
            this.workspaceOverlay.empty();
            this.workspaceOverlay.append(this.svgTextArea);
            this.workspaceWrapper.append(this.workspaceOverlay);
            this.workspaceOverlay.css({
                'height': this.workspaceWrapper.outerHeight(),
                'width': this.workspaceWrapper.outerWidth(),
            });

            this.svgText.on('keyup', (e: JQueryEventObject) => {
                if (e.which == 13) {
                    this.svgInsertBtn.trigger('click');
                }
            });

            this.svgInsertBtn.on('click', (e: JQueryEventObject) => {
                console.log('Inserting SVG');

                var xmlString = this.svgText.val();
                var parser: DOMParser = new DOMParser();
                var doc: XMLDocument = parser.parseFromString(xmlString, "image/svg+xml");

                if (!this.isParseError(doc)) {

                    var width: number = 150;
                    var height: number = 150;

                    //if set viewbox, parse width and height
                    for (var j: number = 0; j < doc.childNodes.length; j++) {
                        var child: Node = doc.childNodes[j];
                        if (child.nodeName === 'svg' && child.attributes) {
                            for (var i: number = 0; i < child.attributes.length; i++) {
                                var attr: Attr = child.attributes[i];
                                if (attr.name == 'viewBox') {
                                    var view = attr.value.match(/-?[\d\.]+/g);
                                    width = parseFloat(view[2]);
                                    height = parseFloat(view[3]);
                                }
                            }
                        }
                    }

                    var p: Parameters = {
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                        relativeSize: { width: ((width / this.workspaceContainer.width()) * 100), height: ((height / this.workspaceContainer.height()) * 100) },
                        relativePosition: { top: 0, left: 0 },
                        background: { r: 255, g: 255, b: 255, a: 0 },
                        opacity: 1,
                        borderRadius: [0, 0, 0, 0],
                        rotate: { x: 0, y: 0, z: 0 },
                        skew: { x: 0, y: 0 },
                        origin: { x: 50, y: 50 },
                        zindex: this.app.timeline.layers.length,
                    };

                    //var svg: IShape = new Svg(p, doc);
                    var svg: IShape = new Svg(p, xmlString);
                    var layer: Layer = new SvgLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), svg);
                    var parent: number = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
                    layer.parent = parent;
                    if (layer.parent) {
                        layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
                    }
                    var idLayer: number = this.app.timeline.addLayer(layer);
                    this.renderSingleShape(idLayer);
                    this.transformShapes();
                    this.highlightShape([idLayer]);   
                }

                this.app.controlPanel.Mode = Mode.SELECT;
                this.svgText.val('');
                $('.tool-btn').removeClass('active');
                $('.tool-btn.select').addClass('active');
                this.onChangeMode();

            });
        } else {
            this.workspaceOverlay.remove();
        }
    }

    insertMode(active: boolean = true) {
        if (active) {
            this.workspaceOverlay.empty();
            this.workspaceOverlay.append(this.uploadArea);
            this.workspaceWrapper.append(this.workspaceOverlay);
            this.workspaceOverlay.css({
                'height': this.workspaceWrapper.outerHeight(),
                'width': this.workspaceWrapper.outerWidth(),
            });

            $('.upload-area > p').on('dragenter', (event: JQueryEventObject) => {
                console.log('vp');
                $('.upload-area').addClass('over');
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
        var file: File = files[0];
        if (file.type.match('image.*')) {
            console.log('isImage');
            var img = new Image();
            var reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;

                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                var MAX_WIDTH: number = $('#workspace').width();
                var MAX_HEIGHT: number = $('#workspace').height();
                var width: number = img.width;
                var height: number = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                var dataurl = canvas.toDataURL("image/png");
                console.log(dataurl);
                var p: Parameters = {
                    top: 0,
                    left: 0,
                    width: width,
                    height: height,
                    relativeSize: { width: ((width / this.workspaceContainer.width()) * 100), height: ((height / this.workspaceContainer.height()) * 100) },
                    relativePosition: { top: 0, left: 0 },
                    background: { r: 255, g: 255, b: 255, a: 0 },
                    opacity: 1,
                    borderRadius: [0, 0, 0, 0],
                    rotate: { x: 0, y: 0, z: 0 },
                    skew: { x: 0, y: 0 },
                    origin: { x: 50, y: 50 },
                    zindex: this.app.timeline.layers.length,
                };
                var image: IShape = new Img(p, dataurl);
                var layer: Layer = new ImageLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), image);
                var parent: number = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
                layer.parent = parent;
                if (layer.parent) {
                    layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
                }
                var idLayer: number = this.app.timeline.addLayer(layer);
                //this.renderShapes();
                this.renderSingleShape(idLayer);
                this.transformShapes();
                this.highlightShape([idLayer]);
            }
        
            reader.readAsDataURL(file); 
        }
        this.uploadBtn.val('');

        this.app.controlPanel.Mode = Mode.SELECT;
        $('.tool-btn.select').addClass('active');
        this.onChangeMode();
        this.insertMode(false);
    }

    uploadImageOld(files: FileList) {
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
                            relativeSize: { width: ((img.width / this.workspaceContainer.width()) * 100), height: ((img.height / this.workspaceContainer.height()) * 100) },
                            relativePosition: { top: 0, left: 0 },
                            background: {r: 255, g: 255, b: 255, a: 0},
                            opacity: 1,
                            borderRadius: [0, 0, 0, 0],
                            rotate: {x: 0, y: 0, z: 0},
                            skew: {x: 0, y: 0},
                            origin: {x: 50, y: 50},
                            zindex: this.app.timeline.layers.length,
                    };
                        var image: IShape = new Img(p, e.target.result);
                        var layer: Layer = new ImageLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), image);
                        var parent: number = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
                        layer.parent = parent;
                        if (layer.parent) {
                            layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
                        }
                        var idLayer: number = this.app.timeline.addLayer(layer);
                        //this.renderShapes();
                        this.renderSingleShape(idLayer);
                        this.transformShapes();
                        this.highlightShape([idLayer]);

                        this.uploadBtn.val('');

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

        var top: number = e.pageY - this.workspaceContainer.offset().top - 10;
        var left: number = e.pageX - this.workspaceContainer.offset().left - 5;
        var width: number = 150;
        var height: number = 75;
        //top: ((shape.parameters.top) / this.workspaceContainer.height()) * 100,

        var params: Parameters = {
            top: top,
            left: left,
            width: width,
            height: height,
            relativeSize: { width: ((width / this.workspaceContainer.width()) * 100), height: ((height / this.workspaceContainer.height()) * 100) },
            relativePosition: { top: ((top / this.workspaceContainer.height()) * 100), left: ((left / this.workspaceContainer.width()) * 100) },
            background: { r: 255, g: 255, b: 255, a: 0 },
            opacity: 1,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: { x: 50, y: 50 },
            zindex: this.app.timeline.layers.length,         
        }

        var shape: IShape = new TextField(params, null, this.fontParameters.color, this.fontParameters.size, this.fontParameters.fontFamily);
        var layer: Layer = new TextLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), shape);
        var parent: number = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
        layer.parent = parent;
        if (layer.parent) {
            layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
        }
        var idLayer: number = this.app.timeline.addLayer(layer);
        //this.renderShapes();
        this.renderSingleShape(layer.id);
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

        if (mode == Mode.IMAGE || mode == Mode.SVG || mode == Mode.LOAD) {
            if (mode == Mode.IMAGE) {
                this.insertMode(true);   
            } else if (mode == Mode.SVG) {
                this.svgMode(true);
            } else if (mode == Mode.LOAD) {
                this.loadMode(true);
            }
        } else {
            this.insertMode(false);
            this.svgMode(false);
            this.loadMode(false);
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

    setScope(id: number) {
        this._scope = id;
        this.scopeOverlay.remove();

        if (this.scope != null) {
            this.scopeOverlay.css({
                'top': this.workspaceWrapper.scrollTop(),
            });
            this.workspaceWrapper.prepend(this.scopeOverlay);

            $('.workspace-wrapper').perfectScrollbar('destroy');
        } else {
            this.workspaceContainer = this.workspaceContainerOriginal;
            $('.workspace-wrapper').perfectScrollbar({ includePadding: true, });
        }
        this.app.timeline.buildBreadcrumb(this.scope);
        //this.dragResize(); <- nefunguje
        this.app.timeline.renderLayers();
        this.renderShapes();
        this.transformShapes();
        this.app.timeline.selectLayer(null);
    }

    get scope() {
        return this._scope;
    }

    isParseError(parsedDocument: XMLDocument) {
        // parser and parsererrorNS could be cached on startup for efficiency
        var parser = new DOMParser(),
            errorneousParse = parser.parseFromString('<', 'text/xml'),
            parsererrorNS = errorneousParse.getElementsByTagName("parsererror")[0].namespaceURI;

        if (parsererrorNS === 'http://www.w3.org/1999/xhtml') {
            return parsedDocument.getElementsByTagName("parsererror").length > 0;
        }

        return parsedDocument.getElementsByTagNameNS(parsererrorNS, 'parsererror').length > 0;
    }

    makeCopy(l: Layer, idParent: number = null): number {
        var shape: IShape = this.getCurrentShape(l.id);
        if (l.parent == null) {
            shape.setPosition({
                top: shape.parameters.top + 50,
                left: shape.parameters.left + 50,
            });
            shape.setRelativePosition({
                top: ((shape.parameters.top) / this.workspaceContainer.height()) * 100,
                left: ((shape.parameters.left) / this.workspaceContainer.width()) * 100,
            });   
        }
        if (shape instanceof Rectangle) {
            var layer: Layer = new RectangleLayer(l.name + ' - kopie', this.getBezier(), shape);   
        } else if (shape instanceof TextField) {
            var layer: Layer = new TextLayer(l.name + ' - kopie', this.getBezier(), shape);   
        } else if (shape instanceof Svg) {
            var layer: Layer = new SvgLayer(l.name + ' - kopie', this.getBezier(), shape);   
        } else if (shape instanceof Img) {
            var layer: Layer = new ImageLayer(l.name + ' - kopie', this.getBezier(), shape);   
        }
        if (idParent == null) {
            layer.parent = l.parent;
        } else {
            layer.parent = idParent;
        }
        if (layer.parent) {
            layer.nesting = l.nesting;
        }
        var idLayer: number = this.app.timeline.addLayer(layer);
        //this.renderSingleShape(idLayer);

        //find childrens
        for (var i: number = this.app.timeline.layers.length - 1; i >= 0; i--) {
            if (this.app.timeline.layers[i].parent == l.id) {
                this.makeCopy(this.app.timeline.layers[i], idLayer);
            }
        }

        return idLayer;
    }

    insertLayerFromGallery(svg: IShape) {
        var layer: Layer = new SvgLayer('Vrstva ' + (Layer.counter + 1), this.getBezier(), svg);
        var parent: number = this.workspaceContainer.data('id') ? this.workspaceContainer.data('id') : null;
        layer.parent = parent;
        if (layer.parent) {
            layer.nesting = (this.app.timeline.getLayer(layer.parent).nesting + 1);
        }
        var idLayer: number = this.app.timeline.addLayer(layer);
        this.renderSingleShape(idLayer);
        this.transformShapes();
        this.highlightShape([idLayer]);   
    }
} 