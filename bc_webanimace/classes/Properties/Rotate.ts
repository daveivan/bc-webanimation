class Rotate implements IProperty {
    private rotateXEl: JQuery = $('<input>').attr('id', 'rx').addClass('number rotate');
    private rotateXSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'rx');
    private rotateYEl: JQuery = $('<input>').attr('id', 'ry').addClass('number rotate');
    private rotateYSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'ry');
    private rotateZEl: JQuery = $('<input>').attr('id', 'rz').addClass('number rotate');
    private rotateZSliderEl: JQuery = $('<div>').addClass('rotate-slider').attr('id', 'rz');

    renderPropery(container: JQuery) {
        container.html('<h2>3D rotace</h2>').addClass('control-rotate');
        var x: JQuery = $('<span>').html('<p>x:</p>').addClass('group-form');
        x.append(this.rotateXSliderEl);
        x.append(this.rotateXEl);
        x.append(' deg');
        container.append(x);
        var y: JQuery = $('<span>').html('<p>y:</p>').addClass('group-form');
        y.append(this.rotateYSliderEl);
        y.append(this.rotateYEl);
        y.append(' deg');
        container.append(y);
        var z: JQuery = $('<span>').html('<p>z:</p>').addClass('group-form');
        z.append(this.rotateZSliderEl);
        z.append(this.rotateZEl);
        z.append(' deg');
        container.append(z);
        //this.initSlider();
        return container;
    }

    private initSlider() {
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
    }
}        