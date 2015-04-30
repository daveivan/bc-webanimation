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
    private isLockedBorderRadius:boolean = true;
    private fontFamily: Array<string> = ['Segoe UI', 'Georgia', 'Times', 'Arial', 'Calibri', 'Verdana', 'serif', 'sans-serif'];

    private toolPanelEl: JQuery = $('<div>').addClass('tool-panel');

    private newProjectEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn').addClass('new').addClass('tooltip').html('<i class="fa fa-eraser"></i>').attr('title', 'Nový projekt');
    private selectToolEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn').addClass('select').addClass('tooltip').html('<i class="fa fa-location-arrow fa-flip-horizontal"></i>').attr('title', 'Nástroj pro výběr');
    private createDivToolEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('create-div').html('<i class="fa fa-stop"></i>').attr('title', 'Nový kontejner');
    private generateCodeEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('generate-code').html('<i class="fa fa-download"></i>').attr('title', 'Vygenerovat kód');
    private insertImageEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('insert-image').html('<i class="fa fa-file-image-o"></i>').attr('title', 'Vložit obrázek');
    private insertTextEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip insert-text').html('<i class="fa fa-font"</i>').attr('title', 'Vložit text');
    private insertSVGEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip insert-svg').html('<i class="fa fa-file-code-o"></i>').attr('title', 'Vložit kód s SVG');
    private saveEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip save').html('<i class="fa fa-floppy-o"></i>').attr('title', 'Uložit projekt');
    private loadEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip load').html('<i class="fa fa-file-text-o"></i>').attr('title', 'Načíst projekt ze souboru');
    private svgGalleryEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip svg-gallery').html('<i class="fa fa-smile-o"></i>').attr('title', 'SVG galerie');

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
    private borderRadiusSwitch: JQuery = $('<span>').addClass('border-radius-switch locked tooltip').html('<a href="#"><i class="fa fa-lock"></i></a>').attr('title', 'Budou všechny okraje stejné?');
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

    private animationSetSelectEl: JQuery = $('<select>').attr('id', 'text-family').addClass('font-attr');
    private animationSetSubmitEl: JQuery = $('<a>').attr('href', '#').html('Vložit').addClass('btn animationset-btn');

    private idEl: JQuery = $('<input type="text"></input>').attr('id', 'id-el');

    private scaleEl: JQuery = $('<input>').attr('id', 'scale-input');
    private scaleSliderEl: JQuery = $('<div>').addClass('scale-slider');

    private translateXEl: JQuery = $('<input>').attr('id', 'translatex').addClass('translate');
    private translateXSliderEl: JQuery = $('<div>').addClass('translate-slider').attr('id', 'translatex');
    private translateYEl: JQuery = $('<input>').attr('id', 'translatey').addClass('translate');
    private translateYSliderEl: JQuery = $('<div>').addClass('translate-slider').attr('id', 'translatey');

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

        this.toolPanelEl.append(this.newProjectEl);
        this.toolPanelEl.append(this.loadEl);
        this.toolPanelEl.append(this.saveEl);
        this.toolPanelEl.append(this.generateCodeEl);
        this.toolPanelEl.append($('<div>').addClass('deliminer'));
        this.toolPanelEl.append(this.selectToolEl);
        this.toolPanelEl.append(this.createDivToolEl);
        this.toolPanelEl.append(this.insertImageEl);
        this.toolPanelEl.append(this.insertTextEl);
        this.toolPanelEl.append(this.insertSVGEl);
        this.toolPanelEl.append(this.svgGalleryEl);
        this.containerEl.append(this.toolPanelEl);

        this.controlPanelEl.append(this.mainPanel);
        this.controlPanelEl.append($('<div>').addClass('clearfix'));


        //NEW NEW NEW
        /*var propery1: IProperty = new WorkspaceDimension(this.app);
        this.controlPanelEl.append(propery1.renderPropery(this.itemControlEl.clone()));
        var propery2: IProperty = new Background();
        this.controlPanelEl.append(propery2.renderPropery(this.itemControlEl.clone()));
        var propery3: IProperty = new Opacity();
        this.controlPanelEl.append(propery3.renderPropery(this.itemControlEl.clone()));
        var propery4: IProperty = new ObjectDimension();
        this.controlPanelEl.append(propery4.renderPropery(this.itemControlEl.clone()));
        var propery5: IProperty = new BorderRadius();
        this.controlPanelEl.append(propery5.renderPropery(this.itemControlEl.clone()));
        var propery6: IProperty = new Font();
        this.controlPanelEl.append(propery6.renderPropery(this.itemControlEl.clone()));
        var propery7: IProperty = new TransformOrigin();
        this.controlPanelEl.append(propery7.renderPropery(this.itemControlEl.clone()));
        var propery8: IProperty = new Rotate();
        this.controlPanelEl.append(propery8.renderPropery(this.itemControlEl.clone()));
        var propery9: IProperty = new Skew();
        this.controlPanelEl.append(propery9.renderPropery(this.itemControlEl.clone()));
        var propery10: IProperty = new BezierCurve();
        this.controlPanelEl.append(propery10.renderPropery(this.itemControlEl.clone()));*/
        //NEW NEW NEW /end

        //Animation set
        var ans = Animations.animations;
        ans.forEach((v, i) => {
            this.animationSetSelectEl.append($("<option>").attr('value', i).text(v.name));
        });

        var animation: JQuery = this.itemControlEl.clone();
        animation.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Připravené animace</h2></a>');
        var row: JQuery = $('<div>').addClass('row');
        row.append(this.animationSetSelectEl);
        row.append(this.animationSetSubmitEl);
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(row);
        animation.append(expand);
        this.controlPanelEl.append(animation);

        //Workspace dimensions
        var workspaceXY: JQuery = this.itemControlEl.clone();
        workspaceXY.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Rozměry plátna</h2></a>');
        var row: JQuery = $('<div>').addClass('row');
        var w: JQuery = $('<div>').html('width: ').addClass('group half');
        w.append(this.workspaceWidthEl.val(this.app.workspace.workspaceSize.width.toString()));
        w.append(' px');
        row.append(w);
        var h: JQuery = $('<div>').html('height: ').addClass('group half last');
        h.append(this.workspaceHeightEl.val(this.app.workspace.workspaceSize.height.toString()));
        h.append((' px'));
        row.append(h);
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(row);
        workspaceXY.append(expand);
        this.controlPanelEl.append(workspaceXY);

        var idElement: JQuery = this.itemControlEl.clone();
        idElement.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>ID elementu</h2></a>');
        var row: JQuery = $('<div>').addClass('row');
        var g: JQuery = $('<div>').html('#').addClass('group full');
        g.append(this.idEl);
        row.append(g);
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(row);
        idElement.append(expand);
        this.controlPanelEl.append(idElement);

        //Bezier curve
        var curve: JQuery = this.itemControlEl.clone();
        curve.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Časový průběh animace</h2></a>');
        this.graph.append(this.point0);
        this.graph.append(this.point1);
        this.graph.append(this.point2);
        this.graph.append(this.point3);
        this.graph.append(this.canvas);
        var expand: JQuery = $('<div>').addClass('expand init-visible expand-bezier');

        expand.append(this.graph);
        expand.append($('<span>').addClass('cubic-bezier').html('cubic-bezier(<span id="p0">0</span>, <span id="p1">0</span>, <span id="p2">0</span>, <span id="p3">0</span>)'));
        curve.append(expand);
        
        this.curve = curve;
        //this.displayMainPanel(true, 'bezier');
        this.mainPanel.append(curve);
        //this.controlPanelEl.append(curve);

        //background
        var newItem: JQuery = this.itemControlEl.clone();
        newItem.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Barva pozadí elementu</h2></a>');
        var row: JQuery = $('<div>').addClass('row');
        var s: JQuery = $('<div>').html('#').addClass('group quarter');
        s.append(this.bgPickerEl.val($.colpick.rgbToHex(this.initColor)));
        row.append(s);
        var a: JQuery = $('<div>').html('alpha opacity:<br>').addClass('group quarter-3');
        this.bgOpacityEl.val('0');
        a.append(this.bgOpacitySliderEl);
        a.append(this.bgOpacityEl);
        row.append(a);
        var expand: JQuery = $('<div>').addClass('expand init-visible');
        expand.append(row);
        newItem.append(expand);
        this.controlPanelEl.append(newItem);

        //opacity
        var opacity: JQuery = this.itemControlEl.clone();
        opacity.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Průhlednost elementu</h2></a>');
        this.opacityEl.val('1');
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(this.opacitySliderEl);
        expand.append(this.opacityEl);
        opacity.append(expand);
        this.controlPanelEl.append(opacity);

        //dimensions
        var dim: JQuery = this.itemControlEl.clone();
        dim.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Rozměry elementu</h2></a>');
        var row: JQuery = $('<div>').addClass('row');
        var w: JQuery = $('<div>').html('width: ').addClass('group half');
        w.append(this.dimensionXEl);
        w.append(' px');
        row.append(w);
        var h: JQuery = $('<div>').html('height: ').addClass('group half last');
        h.append(this.dimensionYEl);
        h.append(' px');
        row.append(h);
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(row);
        dim.append(expand);
        this.controlPanelEl.append(dim);

        //border-radius
        var radius: JQuery = this.itemControlEl.clone();
        radius.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Border-radius</h2></a>');
        this.borderRadiusHelperEl.append(this.borderRadiusTLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusTREl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBREl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusSwitch);
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(this.borderRadiusHelperEl);
        radius.append(expand);
        this.controlPanelEl.append(radius);

        //Font
        var font: JQuery = this.itemControlEl.clone();
        this.fontSizeEl.val(this.initFontSize.toString());
        this.fontColorEl.val($.colpick.rgbToHex(this.initTextColor));
        font.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Nastavení textu</h2></a>');
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
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(row);
        font.append(expand);

        this.controlPanelEl.append(font);

        //opacity
        var scale: JQuery = this.itemControlEl.clone();
        scale.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>CSS3 Scale</h2></a>');
        this.scaleEl.val('1');
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(this.scaleSliderEl);
        expand.append(this.scaleEl);
        scale.append(expand);
        this.controlPanelEl.append(scale);

        //Transform-origin
        this.transformOriginXEl.val(this.initOrigin[0].toString());
        this.transformOriginYEl.val(this.initOrigin[1].toString());
        var origin: JQuery = this.itemControlEl.clone();
        origin.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Transform-origin</h2></a>').addClass('control-origin');
        var row: JQuery = $('<div>').addClass('row');
        var visibleLabel: JQuery = $('<label>').html('Zobrazit polohu na plátně').addClass('tooltip').attr('title', 'Poloha bodu umístění transform-origin se zobrazí spolu s elementem. Táhnutím bodu lze transform-origin měnit.');
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
        var expand: JQuery = $('<div>').addClass('expand');
        expand.append(row);
        origin.append(expand);

        this.controlPanelEl.append(origin);

        //3D Rotate
        var rotate: JQuery = this.itemControlEl.clone();
        rotate.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>3D Rotace</h2></a>').addClass('control-rotate');
        var expand: JQuery = $('<div>').addClass('expand');
        var x: JQuery = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.rotateXSliderEl);
        x.append(this.rotateXEl);
        x.append(' deg');
        expand.append(x);
        var y: JQuery = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.rotateYSliderEl);
        y.append(this.rotateYEl);
        y.append(' deg');
        expand.append(y);
        var z: JQuery = $('<span>').html('<p>z:</p>').addClass('group-form');
        z.append(this.rotateZSliderEl);
        z.append(this.rotateZEl);
        z.append(' deg');
        expand.append(z);
        rotate.append(expand);
        this.controlPanelEl.append(rotate);

        //skew
        var skew: JQuery = this.itemControlEl.clone();
        skew.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>Zkosení</h2></a>').addClass('control-rotate');
        var expand: JQuery = $('<div>').addClass('expand');
        var x: JQuery = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.skewXSliderEl);
        x.append(this.skewXEl);
        x.append(' deg');
        expand.append(x);
        var y: JQuery = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.skewYSliderEl);
        y.append(this.skewYEl);
        y.append(' deg');
        expand.append(y);
        skew.append(expand);
        this.controlPanelEl.append(skew);

        //translate
        var translate: JQuery = this.itemControlEl.clone();
        translate.html('<a href="#" class="expand-link"><i class="fa fa-caret-right"></i><h2>2D Translate</h2></a>').addClass('control-rotate');
        var expand: JQuery = $('<div>').addClass('expand');
        var x: JQuery = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.translateXSliderEl);
        x.append(this.translateXEl);
        x.append(' px');
        expand.append(x);
        var y: JQuery = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.translateYSliderEl);
        y.append(this.translateYEl);
        y.append(' px');
        expand.append(y);
        translate.append(expand);
        this.controlPanelEl.append(translate);

        this.containerEl.append(this.controlPanelEl);

        $(window).resize(() => {
            this.setHeight();
            this.controlPanelEl.perfectScrollbar('update');
            $('.workspace-wrapper').perfectScrollbar('update');
        });

  
        this.colorPicker = this.bgPickerEl.colpick({
            layout: 'hex',
            submit: true,
            color: this.initColor,
            onSubmit: (hsb, hex, rgb, el, bySetColor) => {
                $(el).colpickHide();
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
            submit: true,
            color: this.initTextColor,
            onSubmit: (hsb, hex, rgb, el, bySetColor) => {
                $(el).colpickHide();
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

        this.scaleSliderEl.slider({
            min: 0,
            max: 2,
            step: 0.1,
            value: 1,
            slide: (event, ui) => {
                this.scaleEl.val(ui.value).change();
            },
        });

        this.bgOpacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 0,
            slide: (event, ui) => {
                this.bgOpacityEl.val(ui.value).change();
            },
        });

        this.ctx = (<HTMLCanvasElement>this.canvas.get(0)).getContext('2d');

        //init coordinates
        this.point1.css({ top: '180px', left: '50px' });
        this.point2.css({ top: '0px', left: '50px' });

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

        this.scaleEl.on('change', (e: JQueryEventObject) => {
            this.scaleSliderEl.slider('value', $(e.target).val());
            this.app.workspace.setScale($(e.target).val());
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

        this.translateXEl.on('change', (event: JQueryEventObject) => {
            this.translateXSliderEl.slider('value', $(event.target).val());
            this.app.workspace.setTranslate('x', parseInt($(event.target).val()));
        });

        this.translateYEl.on('change', (event: JQueryEventObject) => {
            this.translateYSliderEl.slider('value', $(event.target).val());
            this.app.workspace.setTranslate('y', parseInt($(event.target).val()));
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
            if (this.isLockedBorderRadius == true) {
                this.app.workspace.setBorderRadius('all', parseInt($(e.target).val()));
            } else {
                this.app.workspace.setBorderRadius($(e.target).data('type'), parseInt($(e.target).val()));
            }
        });

        $(document).on('keyup', '.border-radius-input', (e: JQueryEventObject) => {
            if (e.which == 13) {
                $(e.target).trigger('change');
            }
            if (this.isLockedBorderRadius == true) {
                $('.border-radius-input').val($(e.target).val());
            }
        });

        $(document).on('click', '.border-radius-switch a', (e: JQueryEventObject) => {
            if (this.isLockedBorderRadius == true) {
                this.isLockedBorderRadius = false;
                this.borderRadiusSwitch.removeClass('locked').addClass('unlocked');
                this.borderRadiusSwitch.find('i').removeClass('fa-lock').addClass('fa-unlock');
            } else {
                this.isLockedBorderRadius = true;
                this.borderRadiusSwitch.removeClass('unlocked').addClass('locked');
                this.borderRadiusSwitch.find('i').removeClass('fa-unlock').addClass('fa-lock');        
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

        this.animationSetSubmitEl.on('click', (e: JQueryEventObject) => {
            this.app.timeline.insertAnimationSet(Animations.animations[this.animationSetSelectEl.val()]);
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

        this.newProjectEl.on('click', (event: JQueryEventObject) => {
            if (this.app.timeline.layers.length > 0) {
                if (confirm('Přejete si před vytvořením nového projektu uložit stávající projekt?')) {
                    this.saveEl.click();
                }
                this.app.timeline.layers = new Array<Layer>();
                this.app.timeline.renderLayers();
                this.app.workspace.renderShapes();
            }
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

        this.svgGalleryEl.on('click', (event: JQueryEventObject) => {
            var svgGallery = new SvgGallery(this.app);
            //this.app.workspace.insertMode(false);
        });

        this.generateCodeEl.on('click', (event: JQueryEventObject) => {
            var generator = new GenerateCode(this.app, this.app.timeline.layers);
            //this.app.workspace.insertMode(false);
            generator.generate();
        });

        this.saveEl.on('click', (event: JQueryEventObject) => {

            var arr: Array<any> = new Array<any>();
            arr.push({ x: this.app.workspace.workspaceSize.width, y: this.app.workspace.workspaceSize.height });
            arr.push(this.app.timeline.repeat);
            arr.push(this.app.timeline.layers);
            var toSave = JSON.stringify(arr);

            if (this.app.timeline.layers.length > 0) {
                var blob = new Blob([toSave], { type: "application/json;charset=utf-8" });
                var now: Date = new Date();
                var datetime: string = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
                datetime += '_' + now.getHours() + '.' + now.getMinutes();

                saveAs(blob, "animation_project_" + datetime + ".json");   
            }
        });

        $(document).ready(() => {
            this.selectToolEl.trigger('click');
            $('.expand').hide();
            $('.expand.init-visible').show();
            $('a.expand-link').on('click', function(e: JQueryEventObject) {
                console.log('expand');
                if ($(e.target).parents('.control-item').find('.expand').is(':visible')) {
                    $(this).find('i').addClass('fa-caret-right');
                    $(this).find('i').removeClass('fa-caret-down');
                } else {
                    $(this).find('i').removeClass('fa-caret-right');
                    $(this).find('i').addClass('fa-caret-down');
                }
                $(e.target).parents('.control-item').find('.expand').slideToggle(100);
                return false;
            });
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

            $('.translate-slider').slider({
                min: -100,
                max: 100,
                step: 1,
                value: 0,
                slide: (event, ui) => {
                    $('input#' + $(event.target).attr('id')).val(ui.value).change();
                },
            });

            $('.translate').val('0');

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

    updateScale(scale: number) {
        this.scaleSliderEl.slider('option', 'value', Number(scale));
        this.scaleEl.val(scale.toString());
    }

    updateColor(color: rgb, alpha: number) {
        this.colorPicker.colpickSetColor(color, false);
        this.bgPickerEl.val($.colpick.rgbToHex(color));
        this.bgPickerEl.css({ 'border-color': 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')' });
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
        this.textColorPicker.css({ 'border-color': 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')' });
        this.fontSizeEl.val(size.toString());
        this.fontFamilyEl.val(family);
    }

    updateWorkspaceDimension(d: Dimensions) {
        this.workspaceHeightEl.val(d.height.toString());
        this.workspaceWidthEl.val(d.width.toString());
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
        $('.expand-bezier').show();
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

    updateTranslate(translate: _2d) {
        if (translate.x != null) {
            this.translateXSliderEl.slider('option', 'value', Number(translate.x));
            this.translateXEl.val(translate.x.toString());
        }

        if (translate.y != null) {
            this.translateYSliderEl.slider('option', 'value', Number(translate.y));
            this.translateYEl.val(translate.y.toString());
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
            $('.clearfix').css({ 'margin-top': '40px' });
            $('.delete-keyframe').removeClass('disabled');
        } else {
            this.mainPanel.hide();
            $('.clearfix').hide();
            $('.delete-keyframe').addClass('disabled');
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