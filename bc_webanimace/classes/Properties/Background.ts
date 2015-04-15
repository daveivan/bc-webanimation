class Background implements IProperty {
    private initColor: rgb = { r: 44, g: 208, b: 219 };

    private bgPickerEl: JQuery = $('<input type="text" id="picker"></input>');
    private bgOpacityEl: JQuery = $('<input>').attr('id', 'bgopacity').addClass('number');
    private bgOpacitySliderEl: JQuery = $('<div>').addClass('bgopacity-slider'); 
    private colorPicker: any;

    renderPropery(container: JQuery) {
        container.html('<h2>Barva pozadí elementu</h2>');
        var row: JQuery = $('<div>').addClass('row');
        var s: JQuery = $('<div>').html('#').addClass('group quarter');
        s.append(this.bgPickerEl.val($.colpick.rgbToHex(this.initColor)));
        row.append(s);
        var a: JQuery = $('<div>').html('alpha opacity:<br>').addClass('group quarter-3');
        this.bgOpacityEl.val('0');
        a.append(this.bgOpacitySliderEl);
        a.append(this.bgOpacityEl);
        row.append(a);
        container.append(row);
        this.initColorPicker();
        this.initSlider();
        return container;
    }

    private initSlider() {
        this.bgOpacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 0,
            slide: (event, ui) => {
                this.bgOpacityEl.val(ui.value).change();
            },
        });
    }

    private initColorPicker() {
        this.colorPicker = this.bgPickerEl.colpick({
            layout: 'hex',
            submit: 0,
            color: this.initColor,
            onChange: (hsb, hex, rgb, el, bySetColor) => {
                $(el).css('border-color', '#' + hex);
                if (!bySetColor) $(el).val(hex);
                if (!bySetColor) {
                    //this.app.workspace.setColor(rgb, parseFloat(this.bgOpacityEl.val()));
                }
            },
        }).on('change', (e: JQueryEventObject) => {
                this.colorPicker.colpickSetColor($(e.target).val());
                //this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()), parseFloat(this.bgOpacityEl.val()));
            });
    }

    getInitColor() {
        return this.initColor;
    }
}   