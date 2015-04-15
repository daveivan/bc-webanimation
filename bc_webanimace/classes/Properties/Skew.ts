class Skew implements IProperty {
    private skewXEl: JQuery = $('<input>').attr('id', 'skewx').addClass('number skew');
    private skewXSliderEl: JQuery = $('<div>').addClass('skew-slider').attr('id', 'skewx');
    private skewYEl: JQuery = $('<input>').attr('id', 'skewy').addClass('number skew');
    private skewYSliderEl: JQuery = $('<div>').addClass('skew-slider').attr('id', 'skewy');

    renderPropery(container: JQuery) {
        container.html('<h2>Zkosení</h2>').addClass('control-rotate');
        var x: JQuery = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.skewXSliderEl);
        x.append(this.skewXEl);
        x.append(' deg');
        container.append(x);
        var y: JQuery = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.skewYSliderEl);
        y.append(this.skewYEl);
        y.append(' deg');
        container.append(y);
        return container;
    }

    private initSlider() {
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
    }
}         