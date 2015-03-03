///<reference path="Workspace.ts" />
class ControlPanel {
    private app: Application;
    private containerEl: JQuery;

    private _mode = Mode.SELECT;
    private initColor: rgb = { r: 44, g: 208, b: 219 };
    private initOrigin: Array<number> = [50, 50];
    private initFontSize: number = 16;
    private initTextColor: rgb = { r: 0, g: 0, b: 0 };
    private isOriginVisible: boolean = false;
    private fontFamily: Array<string> = ['Segoe UI', 'Georgia', 'Times', 'Arial', 'Calibri', 'Verdana', 'serif', 'sans-serif'];

    private toolPanelEl: JQuery = $('<div>').addClass('tool-panel');

    private selectToolEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn').addClass('select').addClass('tooltip').html('<i class="fa fa-location-arrow fa-flip-horizontal"></i>').attr('title', 'Nástroj pro výběr');
    private createDivToolEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('create-div').html('<i class="fa fa-stop"></i>').attr('title', 'Nástroj Nový DIV');
    private generateCodeEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('generate-code').html('<i class="fa fa-code"></i>').attr('title', 'Vygenerovat kód');
    private insertImageEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('insert-image').html('<i class="fa fa-file-image-o"></i>').attr('title', 'Vložit obrázek');
    private insertTextEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip insert-text').html('<i class="fa fa-font"</i>').attr('title', 'Vložit text');
    private insertSVGEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip insert-svg').html('<i class="fa fa-circle-o"></i>').attr('title', 'Vložit SVG');
    private saveEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip save').html('<i class="fa fa-floppy-o"></i>').attr('title', 'Uložit');
    private loadEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip load').html('<i class="fa fa-file-text-o"></i>').attr('title', 'Načíst ze souboru');

    private controlPanelEl: JQuery = $('<div>').addClass('control-panel');

    private bgPickerEl: JQuery = $('<input type="text" id="picker"></input>');
    private bgOpacityEl: JQuery = $('<input>').attr('id', 'bgopacity').addClass('number');
    private bgOpacitySliderEl: JQuery = $('<div>').addClass('bgopacity-slider'); 
    private colorPicker: any;

    private mainPanel: JQuery = $('<div>').addClass('main-panel');
    private itemControlEl: JQuery = $('<div>').addClass('control-item');
    private opacityEl: JQuery = $('<input>').attr('id', 'opacity-input');
    private opacitySliderEl: JQuery = $('<div>').addClass('opacity-slider');
    private dimensionXEl: JQuery = $('<input type="text"></input').attr('id', 'dimension-x');
    private dimensionYEl: JQuery = $('<input type="text"></input').attr('id', 'dimension-y');
    private borderRadiusTLEl: JQuery = $('<input type="text"></input').attr('id', 'radius-tl').addClass('border-radius-input').attr('data-type', 'tl');
    private borderRadiusTREl: JQuery = $('<input type="text"></input').attr('id', 'radius-tr').addClass('border-radius-input').attr('data-type', 'tr');
    private borderRadiusBLEl: JQuery = $('<input type="text"></input').attr('id', 'radius-bl').addClass('border-radius-input').attr('data-type', 'bl');
    private borderRadiusBREl: JQuery = $('<input type="text"></input').attr('id', 'radius-br').addClass('border-radius-input').attr('data-type', 'br');
    private borderRadiusHelperEl: JQuery = $('<div>').addClass('border-radius-helper');

    private graph: JQuery = $('<div>').addClass('graph');
    private point0: JQuery = $('<a>').addClass('point p0').attr('href', '#');
    private point1: JQuery = $('<a>').addClass('point p1').attr('href', '#');
    private point2: JQuery = $('<a>').addClass('point p2').attr('href', '#');
    private point3: JQuery = $('<a>').addClass('point p3').attr('href', '#');
    private canvas: JQuery = $('<canvas id="bezierCurve" width="200" height="200"></canvas>');
    private ctx: any;

    private workspaceWidthEl: JQuery = $('<input type="text"></input>').attr('id', 'workspace-y').addClass('number');
    private workspaceHeightEl: JQuery = $('<input type="text"></input>').attr('id', 'workspace-x').addClass('number');

    private idEl: JQuery = $('<input type="text"></input>').attr('id', 'id-el');

    private rotateXEl: JQuery = $('<input>').attr('id', 'rx').addClass('number rotate');
    private rotateXSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'rx');
    private rotateYEl: JQuery = $('<input>').attr('id', 'ry').addClass('number rotate');
    private rotateYSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'ry');
    private rotateZEl: JQuery = $('<input>').attr('id', 'rz').addClass('number rotate');
    private rotateZSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'rz');

    private skewXEl: JQuery = $('<input>').attr('id', 'skewx').addClass('number skew');
    private skewXSliderEl: JQuery = $('<div>').addClass('skew-slider').attr('id', 'skewx');
    private skewYEl: JQuery = $('<input>').attr('id', 'skewy').addClass('number skew');
    private skewYSliderEl: JQuery = $('<div>').addClass('skew-slider').attr('id', 'skewy');

    private transformOriginVisibleEl: JQuery = $('<input>').attr('type', 'checkbox').attr('id', 'visible').prop('checked', false);
    private transformOriginXEl: JQuery = $('<input>').attr('id', 'originx').addClass('number origin');
    private transformOriginYEl: JQuery = $('<input>').attr('id', 'originy').addClass('number origin');

    private fontColorEl: JQuery = $('<input>').attr('type', 'text').attr('id', 'text-color').addClass('font-attr');
    private fontSizeEl: JQuery = $('<input>').attr('type', 'text').attr('id', 'text-size').addClass('number font-attr');
    private fontFamilyEl: JQuery = $('<select>').attr('id', 'text-family').addClass('font-attr');
    private textColorPicker: any;

    private curve: JQuery;

    constructor(app: Application, container: JQuery) {
        this.app = app;
        this.containerEl = container;

        this.toolPanelEl.append(this.loadEl);
        this.toolPanelEl.append(this.saveEl);
        this.toolPanelEl.append($('<div>').addClass('deliminer'));
        this.toolPanelEl.append(this.selectToolEl);
        this.toolPanelEl.append(this.createDivToolEl);
        this.toolPanelEl.append(this.insertImageEl);
        this.toolPanelEl.append(this.insertTextEl);
        this.toolPanelEl.append(this.insertSVGEl);
        this.toolPanelEl.append(this.generateCodeEl);
        this.containerEl.append(this.toolPanelEl);

        this.controlPanelEl.append(this.mainPanel);
        this.controlPanelEl.append($('<div>').addClass('clearfix'));

        //Workspace dimensions
        var workspaceXY: JQuery = this.itemControlEl.clone();
        workspaceXY.html('<h2>Rozměry plátna</h2>');
        var row: JQuery = $('<div>').addClass('row');
        var w: JQuery = $('<div>').html('width: ').addClass('group half');
        w.append(this.workspaceWidthEl.val(this.app.workspace.workspaceSize.width.toString()));
        w.append(' px');
        row.append(w);
        var h: JQuery = $('<div>').html('height: ').addClass('group half last');
        h.append(this.workspaceHeightEl.val(this.app.workspace.workspaceSize.height.toString()));
        h.append((' px'));
        row.append(h);
        workspaceXY.append(row);
        this.controlPanelEl.append(workspaceXY);

        var idElement: JQuery = this.itemControlEl.clone();
        idElement.html('<h2>ID elementu</h2>');
        var row: JQuery = $('<div>').addClass('row');
        var g: JQuery = $('<div>').html('#').addClass('group full');
        g.append(this.idEl);
        row.append(g);
        idElement.append(row);
        this.controlPanelEl.append(idElement);

        //Bezier curve
        var curve: JQuery = this.itemControlEl.clone();
        curve.html('<h2>Časový průběh animace</h2>');
        this.graph.append(this.point0);
        this.graph.append(this.point1);
        this.graph.append(this.point2);
        this.graph.append(this.point3);
        this.graph.append(this.canvas);
        curve.append(this.graph);
        curve.append($('<span>').addClass('cubic-bezier').html('cubic-bezier(<span id="p0">0</span>, <span id="p1">0</span>, <span id="p2">0</span>, <span id="p3">0</span>)'));
        this.curve = curve;
        //this.displayMainPanel(true, 'bezier');
        this.mainPanel.append(curve);
        //this.controlPanelEl.append(curve);

        //background
        var newItem: JQuery = this.itemControlEl.clone();
        newItem.html('<h2>Barva pozadí elementu</h2>');
        var row: JQuery = $('<div>').addClass('row');
        var s: JQuery = $('<div>').html('#').addClass('group quarter');
        s.append(this.bgPickerEl.val($.colpick.rgbToHex(this.initColor)));
        row.append(s);
        var a: JQuery = $('<div>').html('alpha opacity:<br>').addClass('group quarter-3');
        this.bgOpacityEl.val('1');
        a.append(this.bgOpacitySliderEl);
        a.append(this.bgOpacityEl);
        row.append(a);
        newItem.append(row);
        this.controlPanelEl.append(newItem);

        //opacity
        var opacity: JQuery = this.itemControlEl.clone();
        opacity.html('<h2>Průhlednost elementu</h2>');
        this.opacityEl.val('1');
        opacity.append(this.opacitySliderEl);
        opacity.append(this.opacityEl);
        this.controlPanelEl.append(opacity);

        //dimensions
        var dim: JQuery = this.itemControlEl.clone();
        dim.html('<h2>Rozměry elementu</h2>');
        var row: JQuery = $('<div>').addClass('row');
        var w: JQuery = $('<div>').html('width: ').addClass('group half');
        w.append(this.dimensionXEl);
        w.append(' px');
        row.append(w);
        var h: JQuery = $('<div>').html('height: ').addClass('group half last');
        h.append(this.dimensionYEl);
        h.append(' px');
        row.append(h);
        dim.append(row);
        this.controlPanelEl.append(dim);

        //border-radius
        var radius: JQuery = this.itemControlEl.clone();
        radius.html('<h2>Border-radius</h2>');
        this.borderRadiusHelperEl.append(this.borderRadiusTLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusTREl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBREl.val('0'));
        radius.append(this.borderRadiusHelperEl);
        this.controlPanelEl.append(radius);

        //Font
        var font: JQuery = this.itemControlEl.clone();
        this.fontSizeEl.val(this.initFontSize.toString());
        this.fontColorEl.val($.colpick.rgbToHex(this.initTextColor));
        font.html('<h2>Text</h2>');
        var row: JQuery = $('<div>').addClass('row');
        this.fontFamily.forEach((val, index) => {
            this.fontFamilyEl.append($("<option>").attr('value', val).text(val));
        });
        var family: JQuery = $('<div>').html('font-family: ').addClass('group full font-family last');
        family.append(this.fontFamilyEl);
        row.append(family);
        var color: JQuery = $('<div>').html('color: #').addClass('group quarter-3');
        color.append(this.fontColorEl);
        row.append(color);
        var size: JQuery = $('<div>').html('size: ').addClass('group quarter last');
        size.append(this.fontSizeEl);
        size.append(' px');
        row.append(size);
        font.append(row);

        this.controlPanelEl.append(font);

        //Transform-origin
        this.transformOriginXEl.val(this.initOrigin[0].toString());
        this.transformOriginYEl.val(this.initOrigin[1].toString());
        var origin: JQuery = this.itemControlEl.clone();
        origin.html('<h2>Transform-origin</h2>').addClass('control-origin');
        var row: JQuery = $('<div>').addClass('row');
        var visibleLabel: JQuery = $('<label>').html('Zobrazit polohu na plátně');
        visibleLabel.prepend(this.transformOriginVisibleEl);
        row.append(visibleLabel);
        var x: JQuery = $('<div>').html('poz. x: ').addClass('group half');
        x.append(this.transformOriginXEl);
        x.append(' %');
        row.append(x);
        var y: JQuery = $('<div>').html('poz. y: ').addClass('group half last');
        y.append(this.transformOriginYEl);
        y.append(' %');
        row.append(y);
        origin.append(row);

        this.controlPanelEl.append(origin);

        //3D Rotate
        var rotate: JQuery = this.itemControlEl.clone();
        rotate.html('<h2>3D rotace</h2>').addClass('control-rotate');
        var x: JQuery = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.rotateXSliderEl);
        x.append(this.rotateXEl);
        x.append(' deg');
        rotate.append(x);
        var y: JQuery = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.rotateYSliderEl);
        y.append(this.rotateYEl);
        y.append(' deg');
        rotate.append(y);
        var z: JQuery = $('<span>').html('<p>z:</p>').addClass('group-form');
        z.append(this.rotateZSliderEl);
        z.append(this.rotateZEl);
        z.append(' deg');
        rotate.append(z);
        this.controlPanelEl.append(rotate);

        //skew
        var skew: JQuery = this.itemControlEl.clone();
        skew.html('<h2>Zkosení</h2>').addClass('control-rotate');
        var x: JQuery = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.skewXSliderEl);
        x.append(this.skewXEl);
        x.append(' deg');
        skew.append(x);
        var y: JQuery = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.skewYSliderEl);
        y.append(this.skewYEl);
        y.append(' deg');
        skew.append(y);
        this.controlPanelEl.append(skew);

        this.containerEl.append(this.controlPanelEl);

        $(window).resize(() => {
            this.setHeight();
            this.controlPanelEl.perfectScrollbar('update');
            $('.workspace-wrapper').perfectScrollbar('update');
        });

  
        this.colorPicker = this.bgPickerEl.colpick({
            layout: 'hex',
            submit: 0,
            color: this.initColor,
            onChange: (hsb, hex, rgb, el, bySetColor) => {
                $(el).css('border-color', '#' + hex);
                if (!bySetColor) $(el).val(hex);
                if (!bySetColor) {
                    this.app.workspace.setColor(rgb, parseFloat(this.bgOpacityEl.val()));
                }
            },
        }).on('change', (e: JQueryEventObject) => {
            this.colorPicker.colpickSetColor($(e.target).val());
            this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()), parseFloat(this.bgOpacityEl.val()));
        });
        this.app.workspace.setColor(this.initColor, parseFloat(this.bgOpacityEl.val()));

        this.textColorPicker = this.fontColorEl.colpick({
            layout: 'hex',
            submit: 0,
            color: this.initTextColor,
            onChange: (hsb, hex, rgb, el, bySetColor) => {
                $(el).css('border-color', '#' + hex);
                if (!bySetColor) $(el).val(hex);
                if (!bySetColor) {
                    //this.app.workspace.setColor(rgb);
                    this.app.workspace.setFont({
                        color: rgb,
                        fontFamily: this.fontFamilyEl.val(),
                        size: parseFloat(this.fontSizeEl.val()),
                    });
                }
            },
        }).on('change', (e: JQueryEventObject) => {
            this.textColorPicker.colpickSetColor($(e.target).val());
            //this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()));
            this.app.workspace.setFont({
                color: $.colpick.hexToRgb($(e.target).val()),
                fontFamily: this.fontFamilyEl.val(),
                size: parseFloat(this.fontSizeEl.val()),
            });
        });
        this.app.workspace.setFont({
            color: this.initTextColor,
            fontFamily: this.fontFamily[0],
            size: this.initFontSize
        });

        this.opacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 1,
            slide: (event, ui) => {
                this.opacityEl.val(ui.value).change();
            },
        });

        this.bgOpacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 1,
            slide: (event, ui) => {
                this.bgOpacityEl.val(ui.value).change();
            },
        });

        this.ctx = (<HTMLCanvasElement>this.canvas.get(0)).getContext('2d');

        //init coordinates
        this.point1.css({ top: '100px', left: '100px' });
        this.point2.css({ top: '50px', left: '50px' });

        var options: any = {
            containment: 'parent',
            drag: (event, ui) => {
                this.renderWrap(this.ctx);
            },

            stop: (event, ui) => {
                this.app.workspace.setBezier(this.renderWrap(this.ctx));
            },            
        }

        this.point1.draggable(options);

        this.point2.draggable(options);

        this.opacityEl.on('change', (e: JQueryEventObject) => {
            this.opacitySliderEl.slider('value', $(e.target).val());
            this.app.workspace.setOpacity($(e.target).val());
        });

        this.bgOpacityEl.on('change', (e: JQueryEventObject) => {
            this.bgOpacitySliderEl.slider('value', $(e.target).val());
            this.app.workspace.setColor($.colpick.hexToRgb(this.bgPickerEl.val()), parseFloat(this.bgOpacityEl.val()));
        });

        this.dimensionXEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setDimension('x', parseInt($(event.target).val()));
        });

        this.dimensionYEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setDimension('y', parseInt($(event.target).val()));
        });

        this.workspaceHeightEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setWorkspaceDimension(null, parseInt($(event.target).val()));
        });

        this.workspaceWidthEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setWorkspaceDimension(parseInt($(event.target).val()), null);
        });

        this.rotateXEl.on('change', (event: JQueryEventObject) => {
            this.rotateXSliderEl.slider('value', $(event.target).val());
            this.app.workspace.set3DRotate('x', parseInt($(event.target).val()));
        });

        this.rotateYEl.on('change', (event: JQueryEventObject) => {
            this.rotateYSliderEl.slider('value', $(event.target).val());
            this.app.workspace.set3DRotate('y', parseInt($(event.target).val()));
        });

        this.rotateZEl.on('change', (event: JQueryEventObject) => {
            this.rotateZSliderEl.slider('value', $(event.target).val());
            this.app.workspace.set3DRotate('z', parseInt($(event.target).val()));
        });

        this.skewXEl.on('change', (event: JQueryEventObject) => {
            this.skewXSliderEl.slider('value', $(event.target).val());
            this.app.workspace.setSkew('x', parseInt($(event.target).val()));
        });

        this.skewYEl.on('change', (event: JQueryEventObject) => {
            this.skewYSliderEl.slider('value', $(event.target).val());
            this.app.workspace.setSkew('y', parseInt($(event.target).val()));
        });

        this.idEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setIdEl($(event.target).val().toString());
        });

        this.idEl.on('keyup', (event: JQueryEventObject) => {
            if (event.which == 13) {
                $(event.target).trigger('change');
            }
        });

        this.transformOriginVisibleEl.on('change', (event: JQueryEventObject) => {
          
            if ($(event.target).is(':checked')) {
                this.isOriginVisible = true;
            } else {
                this.isOriginVisible = false;
            }
            this.app.workspace.setOriginVisible();
        });

        this.transformOriginXEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setTransformOrigin('x', $(event.target).val());
        });

        this.transformOriginYEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setTransformOrigin('y', $(event.target).val());
        });

        $(document).on('keyup', '.rotate', (event: JQueryEventObject) => {
            if (event.which == 13) {
                $(event.target).trigger('change');
            }
        });

        $(document).on('change', '.border-radius-input', (e: JQueryEventObject) => {
            this.app.workspace.setBorderRadius($(e.target).data('type'), parseInt($(e.target).val()));
        });

        $(document).on('keyup', '.border-radius-input', (e: JQueryEventObject) => {
            if (e.which == 13) {
                $(e.target).trigger('change');
            }
        });

        this.fontColorEl.on('change', (e: JQueryEventObject) => {
            this.app.workspace.setFont({
                color: $.colpick.hexToRgb(this.fontColorEl.val()),
                fontFamily: this.fontFamilyEl.val(),
                size: parseFloat(this.fontSizeEl.val()),
            });
        });

        this.fontSizeEl.on('change', (e: JQueryEventObject) => {
            this.app.workspace.setFont({
                color: $.colpick.hexToRgb(this.fontColorEl.val()),
                fontFamily: this.fontFamilyEl.val(),
                size: parseFloat(this.fontSizeEl.val()),
            });
        });

        this.fontFamilyEl.on('change', (e: JQueryEventObject) => {
            this.app.workspace.setFont({
                color: $.colpick.hexToRgb(this.fontColorEl.val()),
                fontFamily: this.fontFamilyEl.val(),
                size: parseFloat(this.fontSizeEl.val()),
            }, false);
        });

        this.selectToolEl.on('click', (event: JQueryEventObject) => {
            this._mode = Mode.SELECT;
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            this.app.workspace.onChangeMode();
        });

        this.createDivToolEl.on('click', (event: JQueryEventObject) => {
            this._mode = Mode.CREATE_DIV;
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            this.app.workspace.onChangeMode();
        });

        this.insertImageEl.on('click', (event: JQueryEventObject) => {
            if ($(event.target).closest('a').hasClass('active')) {
                $(event.target).closest('a').removeClass('active');
                this.selectToolEl.trigger('click');
            } else {
                this._mode = Mode.IMAGE;
                $('.tool-btn').removeClass('active');
                $(event.target).closest('a').addClass('active');
            }
            this.app.workspace.onChangeMode();
        });

        this.loadEl.on('click', (event: JQueryEventObject) => {
            if ($(event.target).closest('a').hasClass('active')) {
                $(event.target).closest('a').removeClass('active');
                this.selectToolEl.trigger('click');
            } else {
                this._mode = Mode.LOAD;
                $('.tool-btn').removeClass('active');
                $(event.target).closest('a').addClass('active');
            }
            this.app.workspace.onChangeMode();
        });

        this.insertTextEl.on('click', (event: JQueryEventObject) => {
            this._mode = Mode.TEXT;
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active'); 
            this.app.workspace.onChangeMode();
        });

        this.insertSVGEl.on('click', (event: JQueryEventObject) => {
            if ($(event.target).closest('a').hasClass('active')) {
                $(event.target).closest('a').removeClass('active');
                this.selectToolEl.trigger('click');
            } else {
                this._mode = Mode.SVG;
                $('.tool-btn').removeClass('active');
                $(event.target).closest('a').addClass('active');
            }
            this.app.workspace.onChangeMode();
        });

        this.generateCodeEl.on('click', (event: JQueryEventObject) => {
            var generator = new GenerateCode(this.app, this.app.timeline.layers);
            this.app.workspace.insertMode(false);
            generator.generate();
        });

        this.saveEl.on('click', (event: JQueryEventObject) => {
            

            var toSave = JSON.stringify(this.app.timeline.layers);

            if (this.app.timeline.layers.length > 0) {
                var blob = new Blob([toSave], { type: "application/json;charset=utf-8" });
                var now: Date = new Date();
                var datetime: string = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                datetime += '_' + now.getHours() + '.' + now.getMinutes();

                saveAs(blob, "animation_" + datetime + ".json");   
            }
        });

        $(document).ready(() => {
            this.selectToolEl.trigger('click');
            this.displayMainPanel(true, 'bezier');
            this.ctx = (<HTMLCanvasElement>this.canvas.get(0)).getContext('2d');
            this.renderWrap(this.ctx);
            this.controlPanelEl.perfectScrollbar();
            this.app.workspace.setBezier(this.renderWrap(this.ctx));
            this.displayMainPanel(false, 'bezier');

            $('.rotate-slider').slider({
                min: -180,
                max: 180,
                step: 1,
                value: 0,
                slide: (event, ui) => {
                    $('input#' + $(event.target).attr('id')).val(ui.value).change();
                },
            });

            $('.rotate').val('0');

            $('.skew-slider').slider({
                min: -90,
                max: 90,
                step: 1,
                value: 0,
                slide: (event, ui) => {
                    $('input#' + $(event.target).attr('id')).val(ui.value).change();
                },
            });

            $('.skew').val('0');

        });
    }

    updateDimensions(d: Dimensions) {
        this.dimensionXEl.val(d.width ? d.width.toString() : null);
        this.dimensionYEl.val(d.height ? d.height.toString() : null);
    }

    updateOpacity(opacity: number) {
        this.opacitySliderEl.slider('option', 'value', Number(opacity));
        this.opacityEl.val(opacity.toString());
    }

    updateColor(color: rgb, alpha: number) {
        this.colorPicker.colpickSetColor(color, false);
        this.bgPickerEl.val($.colpick.rgbToHex(color));
        this.bgOpacityEl.val(alpha.toFixed(2).toString());
        this.bgOpacitySliderEl.slider('option', 'value', Number(alpha));
    }

    updateBorderRadius(bradius: Array<number>) {
        this.borderRadiusTLEl.val(bradius[0].toString());
        this.borderRadiusTREl.val(bradius[1].toString());
        this.borderRadiusBLEl.val(bradius[3].toString());
        this.borderRadiusBREl.val(bradius[2].toString());
    }

    updateFont(color: rgb, size: number, family: string) {
        this.textColorPicker.colpickSetColor(color, false);
        this.fontColorEl.val($.colpick.rgbToHex(color));
        this.fontSizeEl.val(size.toString());
        this.fontFamilyEl.val(family);
    }

    setHeight() {
       this.containerEl.css('height', ($(window).height() - this.app.timelineEl.height()) + 'px');
    }

    renderWrap(ctx): Bezier_points {
        var p1 = this.point1.position(),
            p2 = this.point2.position();
        return this.renderLines(ctx, {
            x: p1.left,
            y: p1.top
        }, {
                x: p2.left,
                y: p2.top
            });
    }

    renderLines(ctx: any, p1, p2): Bezier_points {
        ctx.clearRect(0, 0, 200, 200);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#333";
        ctx.moveTo(0, 200);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, 200, 0);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.moveTo(0, 200);
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();

        ctx.moveTo(200, 0);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.closePath();

        //compute 
        var fn: Bezier_points = {
            p0: Number(((p1.x) / 200).toFixed(2)),
            p1: Number((1 - (p1.y) / 200).toFixed(2)),
            p2: Number(((p2.x) / 200).toFixed(2)),
            p3: Number((1 - (p2.y) / 200).toFixed(2)),
        };

        $('#p0').html(fn.p0.toString());
        $('#p1').html(fn.p1.toString());
        $('#p2').html(fn.p2.toString());
        $('#p3').html(fn.p3.toString());
        
        return fn;

    }

    updateBezierCurve(fn: Bezier_points) {
        this.point1.css({
            'left': fn.p0 * 200,
            'top': (1 - fn.p1) * 200,
        });

        this.point2.css({
            'left': fn.p2 * 200,
            'top': (1 - fn.p3) * 200,
        });

        this.renderWrap(this.ctx);
    }

    updateIdEl(id: string) {
        this.idEl.val(id);
    }

    update3DRotate(rotate: _3d) {
        if (rotate.x != null) {
            this.rotateXSliderEl.slider('option', 'value', Number(rotate.x));
            this.rotateXEl.val(rotate.x.toString());
        }
        if (rotate.y != null) {
            this.rotateYSliderEl.slider('option', 'value', Number(rotate.y));
            this.rotateYEl.val(rotate.y.toString());
        }
        if (rotate.z != null) {
            this.rotateZSliderEl.slider('option', 'value', Number(rotate.z));
            this.rotateZEl.val(rotate.z.toString());
        }
    }

    updateSkew(skew: _2d) {
        if (skew.x != null) {
            this.skewXSliderEl.slider('option', 'value', Number(skew.x));
            this.skewXEl.val(skew.x.toString());           
        }
        if (skew.y != null) {
            this.skewYSliderEl.slider('option', 'value', Number(skew.y));
            this.skewYEl.val(skew.y.toString());            
        }
    }

    updateTransformOrigin(top: number, left: number) {
        this.transformOriginXEl.val(top.toString());
        this.transformOriginYEl.val(left.toString());
    }

    displayMainPanel(visible: boolean, type: string) {
        var object: JQuery;
        if (type === 'bezier') {
            object = this.curve;
        }

        if (visible) {
            this.mainPanel.show();
            $('.clearfix').show();
            $('.clearfix').css({ 'margin-top': this.mainPanel.height() });
        } else {
            this.mainPanel.hide();
            $('.clearfix').hide();
        }

    }

    /*get Mode (){
        if (this.selectToolEl.hasClass('active')) {
            return Mode.SELECT;
        } else if (this.createDivToolEl.hasClass('active')) {
            return Mode.CREATE_DIV;
        } else if (this.insertImageEl.hasClass('active')) {
            return Mode.IMAGE;
        } else if (this.insertTextEl.hasClass('active')) {
            return Mode.TEXT;
        } else {
            return null;
        }
    }*/
    get Mode() {
        return this._mode;
    }

    set Mode(mode: Mode) {
        this._mode = mode;
    }

    get originMode() {
        if (this.isOriginVisible == true) {
            return true;
        } else {
            return false;
        }
    }
}  