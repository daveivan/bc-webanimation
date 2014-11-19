///<reference path="Workspace.ts" />
class ControlPanel {
    private app: Application;
    private containerEl: JQuery;

    private initColor: rgb = { r: 255, g: 255, b: 255 };

    private toolPanelEl: JQuery = $('<div>').addClass('tool-panel');
    private controlPanelEl: JQuery = $('<div>').addClass('control-panel');
    private bgPickerEl: JQuery = $('<div>').addClass('picker');
    private colorPicker: any;
    private itemControlEl: JQuery = $('<div>').addClass('control-item');
    private opacityEl: JQuery = $('<input type="text"></input>').attr('id', 'opacity-input');
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

    constructor(app: Application, container: JQuery) {
        this.app = app;
        this.containerEl = container;

        this.containerEl.append(this.toolPanelEl);

        //Bezier curve
        var curve: JQuery = this.itemControlEl.clone();
        this.graph.append(this.point0);
        this.graph.append(this.point1);
        this.graph.append(this.point2);
        this.graph.append(this.point3);
        this.graph.append(this.canvas);
        curve.append(this.graph);
        this.controlPanelEl.append(curve);

        //background
        var newItem: JQuery = this.itemControlEl.clone();
        newItem.append(this.bgPickerEl);
        this.controlPanelEl.append(newItem);

        //opacity
        var opacity: JQuery = this.itemControlEl.clone();
        this.opacityEl.val('1');
        opacity.append(this.opacitySliderEl);
        opacity.append(this.opacityEl);
        this.controlPanelEl.append(opacity);

        //dimensions
        var dim: JQuery = this.itemControlEl.clone();
        dim.append($('<span>').html('X:'));
        dim.append(this.dimensionXEl);
        dim.append($('<span>').html('Y:'));
        dim.append(this.dimensionYEl);
        this.controlPanelEl.append(dim);

        //border-radius
        var radius: JQuery = this.itemControlEl.clone();
        this.borderRadiusHelperEl.append(this.borderRadiusTLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusTREl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBLEl.val('0'));
        this.borderRadiusHelperEl.append(this.borderRadiusBREl.val('0'));
        radius.append(this.borderRadiusHelperEl);
        this.controlPanelEl.append(radius);

        this.containerEl.append(this.controlPanelEl);

        $(window).resize(() => {
            this.setHeight();
        });

        this.colorPicker = this.bgPickerEl.colpick({
            flat: true,
            layout: 'hex',
            submit: 0,
            color: this.initColor,
            onChange: (hsb, hex, rgb, el, bySetColor) => {
                if (!bySetColor) {
                    this.app.workspace.setColor(rgb); 
                }  
            },
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
                this.renderWrap(this.ctx);
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

        $(document).on('change', '.border-radius-input', (e: JQueryEventObject) => {
            this.app.workspace.setBorderRadius($(e.target).data('type'), parseInt($(e.target).val()));
        });

        $(document).on('keyup', '.border-radius-input', (e: JQueryEventObject) => {
            if (e.which == 13) {
                $(e.target).trigger('change');
            }
        });

        $(document).ready(() => {
            this.ctx = (<HTMLCanvasElement>this.canvas.get(0)).getContext('2d');
            this.renderWrap(this.ctx);
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

    renderWrap(ctx) {
        var p1 = this.point1.position(),
            p2 = this.point2.position();
        console.log(p1);
        console.log(p2);
        this.renderLines(ctx, {
            x: p1.left,
            y: p1.top
        }, {
                x: p2.left,
                y: p2.top
            });
    }

    renderLines(ctx: any, p1, p2) {
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
            p3: Number((1 - (p2.x) / 200).toFixed(2)),
        };
        console.log(fn);
        this.app.workspace.setBezier(fn);
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
}  