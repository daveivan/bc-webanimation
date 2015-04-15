class Font implements IProperty {
    private initFontSize: number = 16;
    private initTextColor: rgb = { r: 0, g: 0, b: 0 };
    private fontFamily: Array<string> = ['Segoe UI', 'Georgia', 'Times', 'Arial', 'Calibri', 'Verdana', 'serif', 'sans-serif'];

    private fontColorEl: JQuery = $('<input>').attr('type', 'text').attr('id', 'text-color').addClass('font-attr');
    private fontSizeEl: JQuery = $('<input>').attr('type', 'text').attr('id', 'text-size').addClass('number font-attr');
    private fontFamilyEl: JQuery = $('<select>').attr('id', 'text-family').addClass('font-attr');
    private textColorPicker: any;

    renderPropery(container: JQuery) {
        this.fontSizeEl.val(this.initFontSize.toString());
        this.fontColorEl.val($.colpick.rgbToHex(this.initTextColor));
        container.html('<h2>Text</h2>');
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
        container.append(row);
        this.initColorPicker();
        return container;
    }

    private initColorPicker() {
        this.textColorPicker = this.fontColorEl.colpick({
            layout: 'hex',
            submit: 0,
            color: this.initTextColor,
            onChange: (hsb, hex, rgb, el, bySetColor) => {
                $(el).css('border-color', '#' + hex);
                if (!bySetColor) $(el).val(hex);
                if (!bySetColor) {
                    //this.app.workspace.setColor(rgb);
                    /*this.app.workspace.setFont({
                        color: rgb,
                        fontFamily: this.fontFamilyEl.val(),
                        size: parseFloat(this.fontSizeEl.val()),
                    });*/
                }
            },
        }).on('change', (e: JQueryEventObject) => {
                this.textColorPicker.colpickSetColor($(e.target).val());
                //this.app.workspace.setColor($.colpick.hexToRgb($(e.target).val()));
                /*this.app.workspace.setFont({
                    color: $.colpick.hexToRgb($(e.target).val()),
                    fontFamily: this.fontFamilyEl.val(),
                    size: parseFloat(this.fontSizeEl.val()),
                });*/
            });
    }
}       