class ObjectDimension implements IProperty {
    private dimensionXEl: JQuery = $('<input type="text"></input').attr('id', 'dimension-x');
    private dimensionYEl: JQuery = $('<input type="text"></input').attr('id', 'dimension-y');

    renderPropery(container: JQuery) {
        container.html('<h2>Rozměry elementu</h2>');
        var row: JQuery = $('<div>').addClass('row');
        var w: JQuery = $('<div>').html('width: ').addClass('group half');
        w.append(this.dimensionXEl);
        w.append(' px');
        row.append(w);
        var h: JQuery = $('<div>').html('height: ').addClass('group half last');
        h.append(this.dimensionYEl);
        h.append(' px');
        row.append(h);
        container.append(row);
        return container;
    }
}     