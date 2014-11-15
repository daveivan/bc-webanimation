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

    constructor(app: Application, container: JQuery) {
        this.app = app;
        this.containerEl = container;

        this.containerEl.append(this.toolPanelEl);

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
}  