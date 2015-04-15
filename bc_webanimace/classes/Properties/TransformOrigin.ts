class TransformOrigin implements IProperty {
    private initOrigin: _2d = {x: 50, y: 50};

    private transformOriginVisibleEl: JQuery = $('<input>').attr('type', 'checkbox').attr('id', 'visible').prop('checked', false);
    private transformOriginXEl: JQuery = $('<input>').attr('id', 'originx').addClass('number origin');
    private transformOriginYEl: JQuery = $('<input>').attr('id', 'originy').addClass('number origin');

    renderPropery(container: JQuery) {
        this.transformOriginXEl.val(this.initOrigin.x.toString());
        this.transformOriginYEl.val(this.initOrigin.y.toString());
        container.html('<h2>Transform-origin</h2>').addClass('control-origin');
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
        container.append(row);
        return container;
    }
}       