class Opacity implements IProperty {
    private opacityEl: JQuery = $('<input>').attr('id', 'opacity-input');
    private opacitySliderEl: JQuery = $('<div>').addClass('opacity-slider');

    renderPropery(container: JQuery) {
        container.html('<h2>Průhlednost elementu</h2>');
        this.opacityEl.val('1');
        container.append(this.opacitySliderEl);
        container.append(this.opacityEl);
        this.initSlider();
        return container;
    }

    private initSlider() {
        this.opacitySliderEl.slider({
            min: 0,
            max: 1,
            step: 0.05,
            value: 1,
            slide: (event, ui) => {
                this.opacityEl.val(ui.value).change();
            },
        });
    }
}    