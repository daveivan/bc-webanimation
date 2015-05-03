///<reference path="Layer.ts" />
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
    expandTimelineBound: number = 5;
    //convert frame to time
    miliSecPerFrame: number = 100;
    groupKeyframes: number = 5;
    playInterval: any;
    playMode: Animation_playing = Animation_playing.STOP;
    copyKeyframe: keyframeFrom = null;
    allowedTimes: Array<number> = [10, 25, 50, 100, 200, 500];

    private _repeat: boolean = false;
    private absoluteMax: number = 0;

    private app: Application;
    start;
    stop;

    arrayMax = Function.prototype.apply.bind(Math.max, null);

    deleteLayerEl: JQuery = $('<a class="delete-layer disabled" href="#">Smazat vrstvu/y <i class="fa fa-trash"></i></a>');
    repeatEl: JQuery = $('<label for="repeat" class="repeat-label">Opakovat celou animaci <i class="fa fa-repeat"></i><input type="checkbox" id="repeat"></label>');
    repeatIconEl: JQuery = $('<div>').addClass('repeat-icon').html('<i class="fa fa-undo"></i>');
    deleteKeyframeEl: JQuery = $('<a>').addClass('delete-keyframe').addClass('disabled').html('Smazat keyframe <i class="fa fa-trash"></i>').attr('href', '#');
    layersEl: JQuery = $('<div id="layers"></div>');
    timelineHeadEl: JQuery = $('<div class="layers-head"></div>');
    layersWrapperEl: JQuery = $('<div class="layers-wrapper"></div>');
    fixedWidthEl: JQuery = $('<div class="fix-width"></div>');
    keyframesEl: JQuery = $('<div class="keyframes"></div>');
    timelineFooterEl: JQuery = $('<div class="timeline-footer"></div>');
    layersFooterEl: JQuery = $('<div class="layers-footer"></div>');
    keyframesFooterEl: JQuery = $('<div class="keyframes-footer"></div>');
    keyframesTableEl: JQuery = $('<table><thead></thead><tbody></tbody>');
    pointerEl: JQuery = $('<div class="pointer"><div class="pointer-top-wrapper"><div class="pointer-top"></div></div></div>');
    deleteConfirmEl: JQuery = $('<div>').attr('id', 'delete-confirm').css({ 'display': 'none' });

    playEl: JQuery = $('<a class="animation-btn play-animation tooltip-top" href="#" title="Přehrát animaci"><i class="fa fa-play"></i></a>');
    stopEl: JQuery = $('<a class="animation-btn stop-animation tooltip-top" href="#" title="Zastavit animaci"><i class="fa fa-stop"></i></a>');
    pauseEl: JQuery = $('<a class="animation-btn pause-animation tooltip-top" href="#" title="Pozastavit animaci"><i class="fa fa-pause"></i></a>');

    timelineScaleMinus: JQuery = $('<a class="scale-minus tooltip-top animation-btn" href="#" title="Zmenšit měřítko časové osy"><i class="fa fa-search-minus"></i></a>');
    timelineScalePlus: JQuery = $('<a class="scale-minus tooltip-top animation-btn" href="#" title="Zvětšit měřítko časové osy"><i class="fa fa-search-plus"></i></a>');

    private contextMenuEl: JQuery = $('<div>').addClass('context-menu');
    private menuCreateKeyframe: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-plus"></i> Nový snímek');
    private menuCreateKeyframeOriginal: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-plus"></i> Nový snímek z aktuální podoby');
    private menuDeleteKeyframe: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-trash"></i> Smazat snímek');
    private menuCopyKeyframe: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-copy"></i> Kopírovat snímek');
    private menuPasteKeyframe: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-paste"></i> Vložit snímek ze schránky');
    private menuReplaceKeyframe: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-paste"></i> Nahradit snímkem ze schránky');

    private menuRenameLayer: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-pencil"></i> Přejmenovat vrstvu');
    private menuDeleteLayer: JQuery = $('<a>').addClass('menu-item').attr('href', '#').html('<i class="fa fa-trash"></i> Smazat vrstvu');
    constructor(app: Application, timelineContainer: JQuery) {
        this.app = app;
        this.timelineContainer = timelineContainer;
        this.layers = new Array<Layer>();
        this.groupedLayers = new Array<Array<Layer>>();
        this.groupedLayers[0] = new Array<Layer>();

        this.renderTimeline();

        this.buildBreadcrumb(null);

        $(document).on('mousedown', (e: JQueryEventObject) => {
            //hide context menu
            if (!$(e.target).parents().hasClass('context-menu')) {
                this.contextMenuEl.removeClass('active');
                this.contextMenuEl.remove();
            }
        });

        this.deleteLayerEl.on('click', (event: JQueryEventObject) => {
            if (!this.deleteLayerEl.hasClass('disabled')) {
                this.deleteLayers(event);   
            }
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

        $('body').on('click', '.action.visibility', (e: JQueryEventObject) => {
            this.setVisibility($(e.target).closest('a.action').data('layer'), $(e.target).closest('a.action'));
        });

        $('body').on('click', '.action.multiple', (e: JQueryEventObject) => {
            this.setMultiply($(e.target).closest('a.action').data('layer'), $(e.target).closest('a.action'));
        });

        $('body').on('change', '#repeat', (event: JQueryEventObject) => {
            console.log('repeat event');
            this._repeat = $('#repeat').is(':checked');
            this.renderAnimationRange();
        });

        this.keyframesEl.on('click', (event: JQueryEventObject) => {
            if ($(event.target).hasClass('keyframes')) {
                this.app.controlPanel.displayMainPanel(false, 'bezier');
                /*$('.timing-function').removeClass('selected');
                $('.keyframe').removeClass('selected');  */ 
            }
        });

        this.playEl.on('click', (event: JQueryEventObject) => {
            this.playMode = Animation_playing.PLAY;
            $('.shape-helper').hide();
            this.showPause();
            this.runTimeline();
            var int = this.miliSecPerFrame / (this.keyframeWidth / 2);
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
            $('.shape-helper').show();
            this.showPlay();
            $('tr.first').removeClass('to-background');
            cancelAnimationFrame(this.playInterval);
            this.stop = new Date();
            this.pointerPosition = 0;
            this.pointerEl.css('left', this.pointerPosition - 1);
            this.app.workspace.transformShapes();
        });

        this.pauseEl.on('click', (event: JQueryEventObject) => {
            $('.shape-helper').show();
            this.playMode = Animation_playing.PAUSE;
            this.showPlay();
            $('tr.first').removeClass('to-background');
            cancelAnimationFrame(this.playInterval);
            this.app.workspace.transformShapes();
        });

        this.timelineScaleMinus.on('click', (e: JQueryEventObject) => {
            if ($(e.target).hasClass('disabled')) {
                return false;
            }
            var currentIndex: number = this.allowedTimes.indexOf(this.miliSecPerFrame);
            if(currentIndex > 0) {
                this.miliSecPerFrame = this.allowedTimes[currentIndex - 1];
            }

            this.renderHeader();
            this.layers.forEach((l: Layer, i: number) => {
                this.renderKeyframes(l.id);
            });


            if (this.miliSecPerFrame == this.allowedTimes[0]) {
                this.timelineScaleMinus.addClass('disabled');
            } else {
                this.timelineScaleMinus.removeClass('disabled');
            }
            if (this.miliSecPerFrame == this.allowedTimes[this.allowedTimes.length - 1]) {
                this.timelineScalePlus.addClass('disabled');
            } else {
                this.timelineScalePlus.removeClass('disabled');
            }
        });

        this.timelineScalePlus.on('click', (e: JQueryEventObject) => {
            if ($(e.target).hasClass('disabled')) {
                return false;
            }
            var currentIndex: number = this.allowedTimes.indexOf(this.miliSecPerFrame);
            if (currentIndex < this.allowedTimes.length-1) {
                this.miliSecPerFrame = this.allowedTimes[currentIndex + 1];
            }

            this.renderHeader();
            this.layers.forEach((l: Layer, i: number) => {
                this.renderKeyframes(l.id);
            });

            if (this.miliSecPerFrame == this.allowedTimes[0]) {
                this.timelineScaleMinus.addClass('disabled');
            } else {
                this.timelineScaleMinus.removeClass('disabled');
            }
            if (this.miliSecPerFrame == this.allowedTimes[this.allowedTimes.length - 1]) {
                this.timelineScalePlus.addClass('disabled');
            } else {
                this.timelineScalePlus.removeClass('disabled');
            }
        });

        $(document).on('mousedown', 'td', (event: JQueryEventObject) => {
            console.log('onClickRow');
            this.onClickRow(event);
        });

        $(document).on('dblclick', 'td', (event: JQueryEventObject) => {
            console.log('onDblClick');
            this.onCreateKeyframe(event);
        });

        $(document).on('mousedown', '.keyframes > table > tbody', (event: JQueryEventObject) => {
            console.log('mousedown tbody');
            this.onClickTable(event);
        });

        $(document).on('mousedown', '.keyframes > table > thead', (event: JQueryEventObject) => {
            console.log('mousedown thead');
            this.onClickChangePosition(event);
        });

        $(document).on('contextmenu', '#layers > .layer', (e: JQueryEventObject) => {
            if (!$(e.target).hasClass('disabled')) {
                this.contextMenuEl.empty();

                this.contextMenuEl.append('<ul></ul>');
                this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuRenameLayer.attr('data-id', $(e.target).closest('.layer').data('id'))));
                this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuDeleteLayer.attr('data-id', $(e.target).closest('.layer').data('id'))));

                this.contextMenuEl.appendTo($('body'));
                this.contextMenuEl.css({
                    'top': e.pageY - $('body').offset().top,
                    'left': e.pageX - $('body').offset().left,
                });
                this.contextMenuEl.focus();

                this.menuRenameLayer.on('click', (event: JQueryEventObject) => {
                    $(e.target).closest('.layer').find('.editable').trigger('dblclick');
                    this.contextMenuEl.remove();
                });

                this.menuDeleteLayer.on('click', (event: JQueryEventObject) => {
                    var id: number = parseInt($(event.target).data('id'));
                    var index: number = this.getLayerIndex(id);
                    this.deleteOneLayer(index);
                    this.contextMenuEl.remove();
                });

                this.contextMenuEl.addClass('active');
                e.preventDefault();
                return false;   
            }
        });

        $(document).on('contextmenu', '.keyframes > table > tbody', (e: JQueryEventObject) => {
            if (!$(e.target).closest('tr').hasClass('disabled')) {
                if (!$(e.target).hasClass('keyframe')) {
                    this.contextMenuEl.empty();

                    this.contextMenuEl.append('<ul></ul>');
                    this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuCreateKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));
                    this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuCreateKeyframeOriginal.attr('data-id', $(e.target).closest('tr').data('id'))));
                    this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuPasteKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));

                    if (this.copyKeyframe != null && this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                        this.menuPasteKeyframe.removeClass('disabled');
                    } else {
                        this.menuPasteKeyframe.addClass('disabled');
                    }

                    this.contextMenuEl.appendTo($('body'));
                    this.contextMenuEl.css({
                        'top': e.pageY - $('body').offset().top,
                        'left': e.pageX - $('body').offset().left,
                    });
                    this.contextMenuEl.focus();

                    this.menuCreateKeyframe.on('click', (event: JQueryEventObject) => {
                        var idLayer: number = parseInt($(event.target).data('id'));
                        var n = $('body').find('.keyframes > table');
                        var posX = e.pageX - $(n).offset().left;
                        posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
                        var position: number = this.pxToMilisec(posX);
                        this.createKeyframe(idLayer, position);
                        this.contextMenuEl.remove();
                    });

                    this.menuCreateKeyframeOriginal.on('click', (event: JQueryEventObject) => {
                        var idLayer: number = parseInt($(event.target).data('id'));
                        var n = $('body').find('.keyframes > table');
                        var posX = e.pageX - $(n).offset().left;
                        posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
                        var position: number = this.pxToMilisec(posX);
                        this.createKeyframe(idLayer, position, true);
                        this.contextMenuEl.remove();
                    });

                    this.menuPasteKeyframe.on('click', (event: JQueryEventObject) => {
                        if (!$(event.target).hasClass('disabled')) {
                            if (this.copyKeyframe != null && this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                                var n = $('body').find('.keyframes > table');
                                var posX = e.pageX - $(n).offset().left;
                                posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
                                var position: number = this.pxToMilisec(posX);

                                this.pasteKeyframe(position);
                            } else {
                                alert('Klíčový snímek je možné zkopírovat jen v rámci vrstvy.');
                            }
                        }
                        this.copyKeyframe = null;
                        this.app.workspace.transformShapes();
                        this.contextMenuEl.remove();
                    });

                    this.contextMenuEl.addClass('active');
                    e.preventDefault();
                    return false;
                } else {
                    //context menu for keyframe
                    this.contextMenuEl.empty();

                    this.contextMenuEl.append('<ul></ul>');
                    //data-id = idLayer
                    this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuDeleteKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));
                    this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuCopyKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));
                    this.contextMenuEl.find('ul').append($('<li></li>').append(this.menuReplaceKeyframe.attr('data-id', $(e.target).closest('tr').data('id'))));

                    if (this.copyKeyframe != null && this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                        this.menuReplaceKeyframe.removeClass('disabled');
                    } else {
                        this.menuReplaceKeyframe.addClass('disabled');
                    }

                    this.contextMenuEl.appendTo($('body'));
                    this.contextMenuEl.css({
                        'top': e.pageY - $('body').offset().top,
                        'left': e.pageX - $('body').offset().left,
                    });
                    this.contextMenuEl.focus();

                    this.menuDeleteKeyframe.on('click', (event: JQueryEventObject) => {
                        $(e.target).addClass('selected');
                        $(e.target).next('.timing-function').addClass('selected');
                        this.onDeleteKeyframe(e);
                    });

                    this.menuCopyKeyframe.on('click', (event: JQueryEventObject) => {
                        var idLayer: number = $(event.target).data('id');
                        var indexKeyframe: number = $(e.target).data('index');
                        this.copyKeyframe = { layer: idLayer, keyframe: indexKeyframe };
                        this.contextMenuEl.remove();
                    });

                    this.menuReplaceKeyframe.on('click', (event: JQueryEventObject) => {
                        if (!$(event.target).hasClass('disabled')) {
                            if (this.copyKeyframe != null && this.copyKeyframe.layer == parseInt($(e.target).closest('tr').data('id'))) {
                                var n = $('body').find('.keyframes > table');
                                var posX = e.pageX - $(n).offset().left;
                                posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
                                var position: number = this.pxToMilisec(posX);

                                this.pasteKeyframe(position);
                            } else {
                                alert('Klíčový snímek je možné zkopírovat jen v rámci vrstvy.');
                            }
                        }
                        this.copyKeyframe = null;
                        this.app.workspace.transformShapes();
                        this.contextMenuEl.remove();
                    });

                    this.contextMenuEl.addClass('active');
                    e.preventDefault();
                    return false;
                }
            }
            
        });

        this.keyframesTableEl.on('mouseup', '.keyframe', (event: JQueryEventObject) => {
            console.log('keyframe click');
            this.keyframesTableEl.find('.keyframe').removeClass('selected');
            this.keyframesTableEl.find('.timing-function').removeClass('selected');
            $(event.target).addClass('selected');
            $(event.target).next('.timing-function').addClass('selected');
            this.app.workspace.updateBezierCurve(this.getLayer($(event.target).data('layer')));
            this.onClickChangePosition(event);
        });

        this.keyframesTableEl.on('click', '.timing-function p', (event: JQueryEventObject) => {
            console.log('timing function click');
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

    insertAnimationSet(animation) {
        var currentLayerId: number = this.layersEl.find('.selected').first().data('id');
        var layer: Layer = this.getLayer(currentLayerId);
        if (!layer) {
            alert('Vyberte nějakou vrstvu');
        } else {
            var keyframes: Array<Keyframe> = layer.getAllKeyframes();

            //if layer has keyframe, delete it except first
            var allow: boolean = true;
            if (keyframes.length > 1) {
                allow = confirm('Aplikovat na vrstvu animaci? Stávající snímky budou smazány!');
                if (allow) {

                    for (var i = keyframes.length-1; i > 0; i--) {
                        layer.deleteKeyframe(i);
                    }

                    var zeroK: Keyframe = layer.getKeyframe(0);
                    zeroK.shape.setScale(1);
                    zeroK.shape.setTranslateX(0);
                    zeroK.shape.setTranslateY(0);
                    zeroK.shape.setTranslateZ(0);
                    zeroK.shape.setRelativeTranslateX(0);
                    zeroK.shape.setRelativeTranslateY(0);
                    zeroK.shape.setOpacity(1);
                    zeroK.shape.setPerspective(0);
                }
            }

            if (allow) {
                //iterate keyframes
                animation.keyframes.forEach((k, i) => {
                    //iterate timestamps
                    k.timestamp.forEach((t, it) => {
                        //create keyframe by copying
                        this.copyKeyframe = { layer: layer.id, keyframe: 0 };
                        var newKeyframe: Keyframe = null;
                        if (t == 0) {
                            newKeyframe = layer.getKeyframe(0);
                        } else {
                            newKeyframe = this.pasteKeyframe(t);
                        }

                        //insert bezier
                        if (k.bezier) {
                            newKeyframe.timing_function = k.bezier;
                        }

                        //iterate new parameters
                        for (var name in k.parameters) {
                            newKeyframe.shape.setParameterByName(name, k.parameters[name]);
                        }

                        this.copyKeyframe = null;
                    });
                });

                this.renderLayers();   
            }
        }
    }

    pasteKeyframe(position: number): Keyframe {
        var layer: Layer = this.getLayer(this.copyKeyframe.layer);
        if (layer) {
            var k: Keyframe = layer.getKeyframe(this.copyKeyframe.keyframe);
            if (k) {
                var p: Parameters = {
                    top: k.shape.parameters.top,
                    left: k.shape.parameters.left,
                    width: k.shape.parameters.width,
                    height: k.shape.parameters.height,
                    relativePosition: {
                        top: k.shape.parameters.relativePosition.top,
                        left: k.shape.parameters.relativePosition.left,
                    },
                    relativeSize: {
                        width: k.shape.parameters.relativeSize.width,
                        height: k.shape.parameters.relativeSize.height,
                    },
                    background: k.shape.parameters.background,
                    opacity: k.shape.parameters.opacity,
                    zindex: k.shape.parameters.zindex,
                    borderRadius: [
                        k.shape.parameters.borderRadius[0],
                        k.shape.parameters.borderRadius[1],
                        k.shape.parameters.borderRadius[2],
                        k.shape.parameters.borderRadius[3],
                    ],
                    rotate: {
                        x: k.shape.parameters.rotate.x,
                        y: k.shape.parameters.rotate.y,
                        z: k.shape.parameters.rotate.z,
                    },
                    skew: {
                        x: k.shape.parameters.skew.x,
                        y: k.shape.parameters.skew.y,
                    },
                    origin: {
                        x: k.shape.parameters.origin.x,
                        y: k.shape.parameters.origin.y,
                    },
                    scale: k.shape.parameters.scale,
                    translate: {
                        x: k.shape.parameters.translate.x,
                        y: k.shape.parameters.translate.y,
                        z: k.shape.parameters.translate.z,
                    },
                    relativeTranslate: {
                        x: k.shape.parameters.relativeTranslate.x,
                        y: k.shape.parameters.relativeTranslate.y,
                    },
                    perspective: k.shape.parameters.perspective,
            }

                if (layer.type == Type.DIV) {
                    var shape: IShape = new Rectangle(p);
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, k.timing_function);
                } else if (layer.type == Type.IMAGE) {
                    var shape: IShape = new Img(p, layer.globalShape.getSrc());
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, k.timing_function);
                } else if (layer.type == Type.SVG) {
                    var shape: IShape = new Svg(p, layer.globalShape.getSrc());
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, k.timing_function);
                } else if (layer.type == Type.TEXT) {
                    var g: TextField = layer.globalShape;
                    var shape: IShape = new TextField(p, g.getContent(), k.shape.getColor(), k.shape.getSize(), g.getFamily());
                    var newKeyframe = this.app.workspace.addKeyframe(layer, shape, position, k.timing_function);
                }

                if (newKeyframe == null) {
                    var currentKeyframe: Keyframe = layer.getKeyframeByTimestamp(position);
                    if (currentKeyframe) {
                        if (confirm('Stávající snímek na pozici ' + position / 1000 + ' s bude nahrazen.')) {
                            currentKeyframe.shape = shape;
                            currentKeyframe.timing_function = k.timing_function;
                        }
                    }

                    return currentKeyframe;
                } else {
                    return newKeyframe;
                }
            }
            return null;
        }
        return null;
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
        var absoluteMaxPx: number = this.milisecToPx(absoluteMax);

        if (absoluteMax == 0) {
            this.playMode = Animation_playing.STOP;
            $('.shape-helper').show();
            this.showPlay();
            $('tr.first').removeClass('to-background');
            return false;
        }

        var time;
        this.start = new Date();
        var draw = () => {
            this.playInterval = requestAnimationFrame(draw);
            var now = new Date().getTime();
            var dt = now - (time || now);

            time = now;
            this.pointerPosition += (absoluteMaxPx / absoluteMax) * dt;
            if (this.pointerPosition >= absoluteMaxPx) {
                cancelAnimationFrame(this.playInterval);
                if (this.repeat) {
                    this.pointerPosition = 0;
                    this.pointerEl.css('left', this.pointerPosition - 1);
                    this.app.workspace.transformShapes(false);
                    draw();
                } else {
                    $('tr.first').removeClass('to-background');
                    this.pointerPosition = 0;
                    this.pointerEl.css('left', this.pointerPosition - 1);
                    this.showPlay();
                    $('.shape-helper').show();
                }
            }

            this.pointerEl.css('left', this.pointerPosition - 1);
            this.app.workspace.transformShapes(false);

        }
        draw();
        return true;
    }

    renderTimeline() {
        $('body').append(this.deleteConfirmEl);
        $(this.timelineHeadEl).append(this.repeatEl);
        $(this.timelineHeadEl).append(this.playEl);
        $(this.timelineHeadEl).append(this.pauseEl);
        $(this.timelineHeadEl).append(this.stopEl);
        $(this.timelineHeadEl).append(this.timelineScaleMinus);
        $(this.timelineHeadEl).append(this.timelineScalePlus);
        $(this.timelineContainer).append(this.timelineHeadEl);
        $(this.fixedWidthEl).append(this.layersEl);
        $(this.fixedWidthEl).append(this.keyframesEl);
        $(this.layersFooterEl).append(this.deleteLayerEl);
        $(this.layersFooterEl).append(this.deleteKeyframeEl);

        $(this.layersFooterEl).append($('<a href="#" class="performanceTest">Perf. test</a>').on('click', (e: JQueryEventObject) => {
            this.app.workspace.performanceTest(5);
        }));

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
        var existTrEl: JQuery = this.keyframesTableEl.find('.layer-row').first().clone();
        if (existTrEl.length != 0) {
            console.log('existuje');
            existTrEl.removeClass();
            existTrEl.addClass('layer-row').attr('data-id', id);
            if (selector != null) {
                existTrEl.attr('class', selector);
            }

            this.keyframesTableEl.find('tbody').append(existTrEl);

        } else {
            console.log('neexistuje');
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
    }

    expandFrames() {
        var trEl: JQuery = $('body').find('.keyframes > table > tbody > tr');

        //render frames
        for (var i: number = 0; i < 10; i++) {
            var tdEl: JQuery = $('<td>').attr('class', i + this.keyframeCount);

            //every n-th highlighted
            if ((i + 1) % this.groupKeyframes == 0) {
                tdEl.addClass('highlight');
            }

            tdEl.appendTo(trEl);
        }        

        this.keyframeCount += 10;
        this.fixedWidthEl.width((this.keyframeWidth) * this.keyframeCount + 350 + 15);
        //this.renderHeader();
    }

    renderAnimationRange() {
        this.keyframesTableEl.find('.range').remove();
        if (this.repeat) {
            //if repeat animation, find absolute maximum
            var absMax: number = 0;
            var arrayMax = Function.prototype.apply.bind(Math.max, null);
            this.layers.forEach((item: Layer, index: number) => {
                var tmp: number = arrayMax(item.timestamps);
                if (tmp > absMax) absMax = tmp;
            });
            this.layers.forEach((item: Layer, index: number) => {
                item.sortKeyframes();
                var keyframes: Array<Keyframe> = item.getAllKeyframes();
                if (keyframes.length > 1) {
                    var minValue: number = keyframes[0].timestamp, maxValue: number = keyframes[0].timestamp;

                    keyframes.forEach((keyframe: Keyframe, i: number) => {
                        if (keyframe.timestamp < minValue)
                            minValue = keyframe.timestamp;
                        if (keyframe.timestamp > maxValue)
                            maxValue = keyframe.timestamp;
                    });

                    if (maxValue != absMax) {
                        var keyframesTdEl: JQuery = this.keyframesTableEl.find('tbody tr' + '[data-id="' + item.id + '"] > .keyframes-list');
                        keyframesTdEl.prepend($('<div>').addClass('range').css({
                            'left': this.milisecToPx(minValue),
                            'width': this.milisecToPx(absMax - minValue) + 3,
                        }));
                    }
                }
            });

            $('tr.first').append(this.repeatIconEl);
            this.repeatIconEl.css({ 'left': this.milisecToPx(absMax) - 5 });

        } else {
            this.repeatIconEl.remove();
        }
    }

    renderKeyframes(id: number, isAll: boolean = false) {
        var rowEl: JQuery = this.keyframesTableEl.find('tbody tr' + '[data-id="' + id + '"]');
        rowEl.find('td.keyframes-list').remove();
        var keyframesTdEl: JQuery = $('<td>').addClass('keyframes-list');

        this.getLayer(id).sortKeyframes();
        var keyframes: Array<Keyframe> = this.getLayer(id).getAllKeyframes();
        if (keyframes.length > 1) {
            keyframes.forEach((keyframe: Keyframe, index: number) => {
                keyframesTdEl.append($('<div>').addClass('keyframe').attr('data-layer', id).attr('data-index', index).css({
                    'left': this.milisecToPx(keyframe.timestamp) - 5,
                }));

                if (index != (keyframes.length - 1)) {
                   
                    keyframesTdEl.append($('<div>').addClass('timing-function').html('<p class="tooltip-bottom" title="Kliknutím editujte časovou funkci">(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 +')</p>').css({
                        'left': this.milisecToPx(keyframe.timestamp) + 5,
                        'width': this.milisecToPx(keyframes[index+1].timestamp - keyframe.timestamp) - 10,
                    }));   
                }
            }); 
            
            rowEl.prepend(keyframesTdEl);  
        }
        if (!isAll) {
            this.renderAnimationRange();   
        }

        var c = keyframes[keyframes.length-1].timestamp / this.miliSecPerFrame;
        var renderHeaderNeeded: boolean = false;
        while (c > (this.keyframeCount - this.expandTimelineBound)) {
            renderHeaderNeeded = true;
            this.expandFrames();
        }

        if (renderHeaderNeeded) {
            this.renderHeader();
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

                var layer: Layer = this.getLayer(layerID);

                var err1: boolean = false;
                var err2: boolean = false;
                if (layer.parent != null) {
                    var parentLayer: Layer = this.getLayer(layer.parent);
                    var maxTimestamp: number = this.arrayMax(parentLayer.timestamps);
                    if (ms > maxTimestamp && maxTimestamp != 0) {
                        err1 = true;
                    }
                }
                var mt: number = this.arrayMax(layer.timestamps);
                var maxPosition: number = this.checkChildTimestamps(layer, mt);
                var secondMax: number = 0;
                layer.getAllKeyframes().forEach((item: Keyframe, index: number) => {
                    if (item.timestamp > secondMax && item.timestamp != mt) {
                        secondMax = item.timestamp;
                    }
                });

                if ((mt == layer.getKeyframe(keyframeID).timestamp) && (secondMax < maxPosition && ms < maxPosition && maxPosition != 0)) {
                    err2 = true;
                }

                if (err1) {
                    alert('Doba animace je omezena animací nadřazeného prvku na ' + maxTimestamp / 1000 + 's. Snímek nebude přesunut.');
                } else if (err2) {
                    alert('Nelze přesunout snímek, protože výsledná animace by byla kratší než animace vnořených elementů. Upravte dobu animací vnořených elementů.');
                } else {
                    layer.updatePosition(keyframeID, ms);
                }

                /*var countK = ms / this.miliSecPerFrame;
                if (countK > (this.keyframeCount - this.expandTimelineBound)) {
                    this.expandFrames();
                }*/

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
        $('.tooltip-bottom').tooltipster({ position: 'bottom' });
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
                var textLayerContainer: JQuery = $('<div>').addClass('textlayer-container');
                layerItem.append($('<span>').addClass('handle').html('<i class="fa fa-arrows-v"></i>'));
                textLayerContainer.append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(item.name));
                layerItem.append(textLayerContainer);
                var visibleEl: JQuery = $('<a>').attr('data-layer', item.id).addClass('action tooltip-right visibility').attr('title', 'Viditelnost').html('<i class="fa fa-eye"></i>').attr('href', '#');
                var multipleEditEl: JQuery = $('<a>').attr('data-layer', item.id).addClass('action tooltip-right multiple').attr('title', 'Hromadná editace snímků').html('<i class="fa fa-chain-broken"></i>').attr('href', '#');
                layerItem.append(($('<span>').addClass('layer-actions')).append(multipleEditEl).append(visibleEl));

                if (item.idEl) {
                    textLayerContainer.append($('<span>').addClass('div-id').html('#' + item.idEl));
                }
                this.layersEl.append(layerItem);
                //and render frames for this layer
                this.renderRow(item.id);
                //render keyframes
                this.renderKeyframes(item.id, true);
                isEmpty = false;

                $('.tooltip-right').tooltipster({ position: 'right' });
                this.setVisibility(item.id, visibleEl, false);
                this.setMultiply(item.id, multipleEditEl, false);
            }
        });

        this.renderAnimationRange();

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
                cssClass: 'editable-input'
            });
    }

    renderSingleLayer(layer: Layer, index: number) {
        if (this.app.workspace.scope == layer.parent) {
            var layerItem: JQuery = $('<div>').addClass('layer').attr('id', index).attr('data-id', layer.id);
            var textLayerContainer: JQuery = $('<div>').addClass('textlayer-container');
            layerItem.append($('<span>').addClass('handle').html('<i class="fa fa-arrows-v"></i>'));
            textLayerContainer.append($('<span>').addClass('editable').css('display', 'inline').attr('id', index).html(layer.name));
            layerItem.append(textLayerContainer);
            var visibleEl: JQuery = $('<a>').attr('data-layer', layer.id).addClass('action tooltip-right visibility').attr('title', 'Viditelnost').html('<i class="fa fa-eye"></i>').attr('href', '#');
            var multipleEditEl: JQuery = $('<a>').attr('data-layer', layer.id).addClass('action tooltip-right multiple').attr('title', 'Hromadná editace snímků').html('<i class="fa fa-chain-broken"></i>').attr('href', '#');
            layerItem.append(($('<span>').addClass('layer-actions')).append(multipleEditEl).append(visibleEl));

            if (layer.idEl) {
                textLayerContainer.append($('<span>').addClass('div-id').html('#' + layer.idEl));
            }
            this.layersEl.append(layerItem);

            //and render frames for this layer
            this.renderRow(layer.id);
            //render keyframes
            this.renderKeyframes(layer.id, true);

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
                    cssClass: 'editable-input'
                });

            $('.tooltip-right').tooltipster({ position: 'right' });
            this.setVisibility(layer.id, visibleEl, false);
            this.setMultiply(layer.id, multipleEditEl, false);
        }
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

        this.keyframesTableEl.find('thead').empty().append(head);
    }

    public addLayer(layer): number {
        this.keyframesTableEl.find('tbody tr.disabled').remove();
        this.layersEl.find('.layer.disabled').remove();
        var index: number = this.layers.push(layer);
        /*if (layer.parent == null) {
            (this.groupedLayers[0]).push(layer);
        } else {
            if (!this.groupedLayers[layer.parent]) {
                this.groupedLayers[layer.parent] = new Array<Layer>();
            }
            (this.groupedLayers[layer.parent]).push(layer);
        }*/
        layer.order = this.layers.length;
        //this.renderLayers();
        this.renderSingleLayer(layer, index-1);

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

    deleteOneLayer(index: number) {
        this.deleteConfirmEl.attr('title', 'Vymazat vybrané vrstvy?').html('Opravu chcete vymazat vybrané vrstvy. Objekty v těchto vrstvách budou smazány také!');
        this.deleteConfirmEl.dialog({
            dialogClass: 'delete-confirm',
            resizable: false,
            buttons: {
                "Smazat": () => {
                    this.deleteLayer(index);

                    //render layers
                    this.renderLayers();

                    //render workspace
                    this.app.workspace.renderShapes();
                    this.app.workspace.transformShapes();

                    //scroll to last layer
                    this.selectLayer(this.layersEl.find('.layer').last().data('id'));
                    this.layersWrapperEl.scrollTop(this.layersWrapperEl.scrollTop() - (this.layersEl.find('.layer').outerHeight()));
                    this.layersWrapperEl.perfectScrollbar('update');
                    //this.scrollTo(this.layersEl.find('.layer').last().data('id'));   
                    this.deleteConfirmEl.dialog("destroy");
                },
                Cancel: function () {
                    $(this).dialog("destroy");
                }
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');
    }

    deleteLayers(e: JQueryEventObject) {
        console.log('Deleting layers...');

        //iteration from end of array of selected layers
        var selectedLayers: Array<JQueryEventObject> = this.layersEl.find('div.layer.selected').get();

        if (selectedLayers.length) {
            this.deleteConfirmEl.attr('title', 'Vymazat vybrané vrstvy?').html('Opravu chcete vymazat vybrané vrstvy. Objekty v těchto vrstvách budou smazány také!');
            this.deleteConfirmEl.dialog({
                dialogClass: 'delete-confirm',
                resizable: false,
                buttons: {
                    "Smazat": () => {
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
                        this.deleteConfirmEl.dialog("destroy");
                    },
                    Cancel: function () {
                        $(this).dialog("destroy");
                    }
                }
            });
            $('.ui-dialog-titlebar-close').empty().append('X');
        }
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
            /*var keyframe: Keyframe = layer.getKeyframeByTimestamp(this.app.timeline.pxToMilisec());
            if (keyframe == null) {
                keyframe = layer.addKeyframe(this.app.workspace.getCurrentShape(layer.id), this.pxToMilisec(), this.app.workspace.bezier);
                this.renderKeyframes(layer.id);
            }
            keyframe.shape.setZindex(index);*/
            layer.globalShape.setZindex(index);
        });

        this.layers = outOfScopeLayers.concat(tmpLayers);

        //render layers
        this.renderLayers();
        //render shapes
        this.app.workspace.renderShapes();
        this.app.workspace.transformShapes();
        this.selectLayer(firstSelectedEl.data('id'));
    }

    //on click name layer
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
        this.pointerEl.find('.pointer-top-wrapper').css('top', posY + 18);
    }

    private onReady(e: JQueryEventObject) {
        this.layersEl.multisortable({
            items: '> div.layer:not(.disabled)',
            handle: '.handle',
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
            handle: '.pointer-top-wrapper',
            start: (event: JQueryEventObject, ui) => {
                /*this.keyframesTableEl.find('.keyframe').removeClass('selected');
                this.keyframesTableEl.find('.timing-function').removeClass('selected');*/
                this.app.controlPanel.displayMainPanel(false, 'bezier');
                $('.shape-helper').hide();
            },
            drag: (event: JQueryEventObject, ui) => {
                this.pointerPosition = ui.position.left + 1;
                this.app.workspace.transformShapes(false);
            },
            stop: (event: JQueryEventObject, ui) => {
                var posX = Math.round(ui.position.left / this.keyframeWidth) * this.keyframeWidth;
                this.pointerPosition = posX;  
                this.pointerEl.css('left', this.pointerPosition - 1);
                $('.shape-helper').show();
                this.app.workspace.transformShapes();
            },
        });

        this.showPlay();
    }

    private onClickTable(e: JQueryEventObject) {
        this.app.controlPanel.displayMainPanel(false, 'bezier');
        /*if (!$(e.target).hasClass('pointer')) {
            this.keyframesTableEl.find('.timing-function').removeClass('selected');
            this.keyframesTableEl.find('.keyframe').removeClass('selected');
        }*/
    }

    private onClickChangePosition(e: JQueryEventObject) {
        if (!$(e.target).hasClass('pointer')) {
            if (!$(e.target).hasClass('keyframe')) {
                /*this.keyframesTableEl.find('.timing-function').removeClass('selected');
                this.keyframesTableEl.find('.keyframe').removeClass('selected');*/
                this.app.controlPanel.displayMainPanel(false, 'bezier');
            } else {
                if (!$(e.target).is(':last-child')) {
                    this.app.controlPanel.displayMainPanel(true, 'bezier');
                } else {
                    this.app.controlPanel.displayMainPanel(false, 'bezier');
                    $('.delete-keyframe').removeClass('disabled');
                    $(e.target).addClass('selected');
                }   
            }
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

    getLayerIndex(id: number) {
        var index: number = null;

        this.layers.forEach((item: Layer, i: number) => {
            if (item.id == id) {
                index = i;
            }
        });

        return index;
    }

    onCreateKeyframe(e: JQueryEventObject) {
        console.log('Creating keyframe...');
        var idLayer: number = parseInt($(e.target).closest('tr.selected').data('id'));
        var n = $('body').find('.keyframes > table');
        var posX = e.pageX - $(n).offset().left;
        posX = Math.round(posX / this.keyframeWidth) * this.keyframeWidth;
        var position: number = this.pxToMilisec(posX);

        this.createKeyframe(idLayer, position);
    }

    createKeyframe(idLayer: number, position: number, currentView: boolean = false) {
        if ($.isNumeric(idLayer)) {
            var layer: Layer = this.getLayer(idLayer);
            /*if (layer.parent != null) {
                var arrayMax = Function.prototype.apply.bind(Math.max, null);
                var parentLayer: Layer = this.getLayer(layer.parent);
                var maxTimestamp: number = arrayMax(parentLayer.timestamps);
                if (position > maxTimestamp && maxTimestamp != 0) {
                    position = maxTimestamp;
                    alert('Doba animace je omezena animací nadřazeného prvku na ' + maxTimestamp / 1000 + 's. Snímek bude posunut na tuto pozici.');
                }
            }
            if (layer.getKeyframeByTimestamp(position) === null) {

                layer.addKeyframe(this.app.workspace.getCurrentShape(idLayer), position, this.app.workspace.getBezier());

                var countK = position / this.miliSecPerFrame;
                if (countK > (this.keyframeCount - this.expandTimelineBound)) {
                    this.expandFrames();
                }

                this.renderKeyframes(idLayer);
                this.app.workspace.transformShapes();
            }*/

            if (currentView) {
                var shape: IShape = this.app.workspace.getCurrentShape(idLayer);
            } else {
                var shape: IShape = this.app.workspace.getCurrentShape(idLayer, position);
            }
            
            this.app.workspace.addKeyframe(layer, shape, position, this.app.workspace.getBezier());

            this.app.workspace.transformShapes();
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
        console.log('onDeleteKEyframe');
        if (this.deleteKeyframeEl.hasClass('disabled')) {
            e.preventDefault();
            return false;
        }
        this.deleteConfirmEl.attr('title', 'Vymazat keframe?').html('Opravu chcete vymazat vybráný klíčový snímek?');
        this.deleteConfirmEl.dialog({
            dialogClass: 'delete-confirm',
            resizable: false,
            buttons: {
                "Smazat": () => {
                    console.log('Deleting keyframe...');
                    var keyframeEl = this.keyframesTableEl.find('tbody .keyframe.selected');

                    if (keyframeEl.length) {
                        var layer: Layer = this.getLayer(keyframeEl.data('layer'));
                        
                        var k: Keyframe = layer.getKeyframe(keyframeEl.data('index'));
                        if (layer.getAllKeyframes().length > 2) {

                            var maxPosition: number = this.checkChildTimestamps(layer, this.arrayMax(layer.timestamps));
                            if (k.timestamp > maxPosition && maxPosition != 0) {
                                alert('Nelze smazat snímek, protože výsledná animace by byla kratší než animace vnořených elementů. Upravte dobu animací vnořených elementů.');
                            } else {
                                layer.deleteKeyframe(keyframeEl.data('index'));
                            }
                        } else {
                            layer.deleteKeyframe(keyframeEl.data('index'));
                        }

                        this.renderKeyframes(keyframeEl.data('layer'));
                        this.app.workspace.transformShapes();
                        this.app.controlPanel.displayMainPanel(false, 'bezier');
                    }  
                    this.deleteConfirmEl.dialog("destroy");
                },
                Cancel: function () {
                    $(this).dialog("destroy");
                }
            }
        });
        $('.ui-dialog-titlebar-close').empty().append('X');
    }

    checkChildTimestamps(layer: Layer, limit: number, maxTimestamp: number = 0) {
        var ret: number = maxTimestamp;
        this.layers.forEach((child: Layer, index: number) => {
            if (child.parent == layer.id) {
                var localMax: number = this.arrayMax(child.timestamps);

                var tmp: number = this.checkChildTimestamps(child, limit, localMax);
                if (tmp > ret)
                    ret = tmp;
            }   
        });
        return ret;
    }

    setVisibility(idLayer: number, link: JQuery, change: boolean = true) {
        var layer: Layer = this.getLayer(idLayer);
        if (layer) {
            if (change) {
                if (layer.isVisibleOnWorkspace) {
                    link.html('<i class="fa fa-eye-slash"></i>');
                    link.tooltipster('content', 'Viditelnost: Zobrazit');
                    link.addClass('invisible');
                    layer.isVisibleOnWorkspace = false;
                } else {
                    link.html('<i class="fa fa-eye"></i>');
                    link.removeClass('invisible');
                    link.tooltipster('content', 'Viditelnost: Schovat');
                    layer.isVisibleOnWorkspace = true;
                }
            } else {
                //only update current state
                if (layer.isVisibleOnWorkspace) {
                    link.html('<i class="fa fa-eye"></i>');
                    link.removeClass('invisible');
                    link.tooltipster('content', 'Viditelnost: Schovat');
                } else {
                    link.html('<i class="fa fa-eye-slash"></i>');
                    link.tooltipster('content', 'Viditelnost: Zobrazit');
                    link.addClass('invisible');   
                }
            }
            this.app.workspace.transformShapes();
        }
    }

    setMultiply(idLayer: number, link: JQuery, change: boolean = true) {
        var layer: Layer = this.getLayer(idLayer);
        if (layer) {
            if (change) {
                if (layer.isMultipleEdit) {
                    link.html('<i class="fa fa-chain-broken"></i>');
                    link.tooltipster('content', 'Hromadná editace snímků - Vypnuta');
                    link.removeClass('ismultiple');
                    layer.isMultipleEdit = false;
                } else {
                    link.html('<i class="fa fa-chain"></i>');
                    link.addClass('ismultiple');
                    link.tooltipster('content', 'Hromadná editace snímků - Zapnuta');
                    layer.isMultipleEdit = true;
                }
            } else {
                //only update current state
                if (layer.isMultipleEdit) {
                    link.html('<i class="fa fa-chain"></i>');
                    link.addClass('ismultiple');
                    link.tooltipster('content', 'Hromadná editace snímků - Zapnuta');
                } else {
                    link.html('<i class="fa fa-chain-broken"></i>');
                    link.tooltipster('content', 'Hromadná editace snímků - Vypnuta');
                    link.removeClass('ismultiple');
                }
            }
        }        
    }

    get repeat() {
        return this._repeat;
    }

    set repeat(r: boolean) {
        this._repeat = r;
        if (this._repeat) {
            $('#repeat').prop('checked', true);
        } else {
            $('#repeat').prop('checked', false);
        }

        $('#repeat').change();

    }

    getSelectedKeyframeID(idLayer: number) {
        var el: JQuery = (this.keyframesTableEl.find('tr.layer-row[data-id="' + idLayer + '"]')).find('.keyframe.selected');
        return el.data('index');
    }

    buildBreadcrumb(scope: number) {
        $('.breadcrumb').remove();
        var container: JQuery = $('<div>').addClass('breadcrumb');
        var currentLayer: Layer = this.getLayer(scope);
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

    getSortedArray() {
        return this.layersEl.sortable('toArray');
    }
}

