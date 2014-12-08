///<reference path="Workspace.ts" />
enum Mode {
    SELECT,
    CREATE_DIV,
}

interface Rotate {
    x: number;
    y: number;
    z: number;
}

class ControlPanel {
    private app: Application;
    private containerEl: JQuery;

    private initColor: rgb = { r: 44, g: 208, b: 219 };

    private toolPanelEl: JQuery = $('<div>').addClass('tool-panel');

    private selectToolEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn').addClass('select').addClass('tooltip').html('<i class="fa fa-location-arrow fa-flip-horizontal"></i>').attr('title', 'Nástroj pro výběr');
    private createDivToolEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('create-div').html('<i class="fa fa-stop"></i>').attr('title', 'Nástroj Nový DIV');
    private generateCodeEl: JQuery = $('<a>').attr('href', '#').addClass('tool-btn tooltip').addClass('generate-code').html('<i class="fa fa-code"></i>').attr('title', 'Vygenerovat kód');

    private controlPanelEl: JQuery = $('<div>').addClass('control-panel');
    //private bgPickerEl: JQuery = $('<div>').addClass('picker');
    private bgPickerEl: JQuery = $('<input type="text" id="picker"></input>');
    private colorPicker: any;
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

    private idEl: JQuery = $('<input type="text"></input>').attr('id', 'id-el').addClass('number');

    private rotateXEl: JQuery = $('<input>').attr('id', 'rx').addClass('number rotate');
    private rotateXSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'rx');
    private rotateYEl: JQuery = $('<input>').attr('id', 'ry').addClass('number rotate');
    private rotateYSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'ry');
    private rotateZEl: JQuery = $('<input>').attr('id', 'rz').addClass('number rotate');
    private rotateZSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'rz');

    constructor(app: Application, container: JQuery) {
        this.app = app;
        this.containerEl = container;

        this.toolPanelEl.append(this.selectToolEl);
        this.toolPanelEl.append(this.createDivToolEl);
        this.toolPanelEl.append(this.generateCodeEl);
        this.containerEl.append(this.toolPanelEl);

        //Workspace dimensions
        var workspaceXY: JQuery = this.itemControlEl.clone();
        workspaceXY.html('<h2>Rozměry plátna</h2>');
        var w: JQuery = $('<span>').html('width: ').addClass('group-form');
        w.append(this.workspaceWidthEl.val(this.app.workspace.workspaceSize.width.toString()));
        w.append(' px');
        workspaceXY.append(w);
        var h: JQuery = $('<span>').html('height: ').addClass('group-form');
        h.append(this.workspaceHeightEl.val(this.app.workspace.workspaceSize.height.toString()));
        h.append((' px'));
        workspaceXY.append(h);
        this.controlPanelEl.append(workspaceXY);

        var idElement: JQuery = this.itemControlEl.clone();
        idElement.html('<h2>ID elementu</h2>');
        var g: JQuery = $('<span>').html('#').addClass('group-form fullwidth');
        g.append(this.idEl);
        idElement.append(g);
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
        this.controlPanelEl.append(curve);

        //background
        var newItem: JQuery = this.itemControlEl.clone();
        newItem.html('<h2>Barva pozadí elementu</h2>');
        var s: JQuery = $('<span>').html('#').addClass('bg-input');
        s.append(this.bgPickerEl.val($.colpick.rgbToHex(this.initColor)));
        newItem.append(s);
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
        var w: JQuery = $('<span>').html('width: ').addClass('group-form');
        w.append(this.dimensionXEl)
        w.append(' px');
        dim.append(w);
        var h: JQuery = $('<span>').html('height: ').addClass('group-form');
        h.append(this.dimensionYEl);
        h.append(' px');
        dim.append(h);
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
                    this.app.workspace.setColor(rgb);
                }
            },
        }).on('change', (e: JQueryEventObject) => {
            this.colorPicker.colpickSetColor($(e.target).val());
            this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()));
        });
        this.app.workspace.setColor(this.initColor);

        this.opacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 1,
            slide: (event, ui) => {
                this.opacityEl.val(ui.value).change();
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

        this.idEl.on('change', (event: JQueryEventObject) => {
            this.app.workspace.setIdEl($(event.target).val().toString());
        });

        this.idEl.on('keyup', (event: JQueryEventObject) => {
            if (event.which == 13) {
                $(event.target).trigger('change');
            }
        });

        $(document).on('keyup', '.rotate', (event: JQueryEventObject) => {
            if (event.which == 13) {
                $(event.target).trigger('change');
            }
        })

        $(document).on('change', '.border-radius-input', (e: JQueryEventObject) => {
            this.app.workspace.setBorderRadius($(e.target).data('type'), parseInt($(e.target).val()));
        });

        $(document).on('keyup', '.border-radius-input', (e: JQueryEventObject) => {
            if (e.which == 13) {
                $(e.target).trigger('change');
            }
        });

        this.selectToolEl.on('click', (event: JQueryEventObject) => {
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            $('.shape-helper').draggable('enable');
            $('.shape-helper').resizable('enable');
        });

        this.createDivToolEl.on('click', (event: JQueryEventObject) => {
            $('.tool-btn').removeClass('active');
            $(event.target).closest('a').addClass('active');
            $('.shape-helper').draggable('disable');
            $('.shape-helper').removeClass('ui-state-disabled').resizable('disable');
        });

        this.generateCodeEl.on('click', (event: JQueryEventObject) => {
            var generator = new GenerateCode(this.app, this.app.timeline.layers);
            generator.generate();
        });

        $(document).ready(() => {
            this.ctx = (<HTMLCanvasElement>this.canvas.get(0)).getContext('2d');
            this.renderWrap(this.ctx);
            this.controlPanelEl.perfectScrollbar();
            this.app.workspace.setBezier(this.renderWrap(this.ctx));

            $('.rotate-slider').slider({
                min: -180,
                max: 180,
                step: 1,
                value: 0,
                slide: (event, ui) => {
                    $('input#'+ $(event.target).attr('id')).val(ui.value).change();
                },
            });
            $('.rotate').val('0');

        });
    }

    updateDimensions(d: Dimensions) {
        this.dimensionXEl.val(d.width.toString());
        this.dimensionYEl.val(d.height.toString());
    }

    updateOpacity(opacity: number) {
        this.opacitySliderEl.slider('option', 'value', Number(opacity));
        this.opacityEl.val(opacity.toString());
    }

    updateColor(color: rgb) {
        this.colorPicker.colpickSetColor(color, false);
        this.bgPickerEl.val($.colpick.rgbToHex(color));
    }

    updateBorderRadius(bradius: Array<number>) {
        this.borderRadiusTLEl.val(bradius[0].toString());
        this.borderRadiusTREl.val(bradius[1].toString());
        this.borderRadiusBLEl.val(bradius[3].toString());
        this.borderRadiusBREl.val(bradius[2].toString());
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

    update3DRotate(rotate: Rotate) {
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

    get Mode (){
        if (this.selectToolEl.hasClass('active')) {
            return Mode.SELECT;
        } else if (this.createDivToolEl.hasClass('active')) {
            return Mode.CREATE_DIV;
        } else {
            return null;
        }
    }
}  