class WorkspaceDimension implements IProperty {
    private workspaceWidthEl: JQuery = $('<input type="text"></input>').attr('id', 'workspace-y').addClass('number');
    private workspaceHeightEl: JQuery = $('<input type="text"></input>').attr('id', 'workspace-x').addClass('number');

    constructor(app: Application) {
        this.workspaceHeightEl.on('change', (event: JQueryEventObject) => {
            app.workspace.setWorkspaceDimension(null, parseInt($(event.target).val()));
        });

        this.workspaceWidthEl.on('change', (event: JQueryEventObject) => {
            app.workspace.setWorkspaceDimension(parseInt($(event.target).val()), null);
        }); 
    }

    renderPropery(container: JQuery) {
        container.html('<h2>Rozměry plátna</h2>');
        var row: JQuery = $('<div>').addClass('row');
        var w: JQuery = $('<div>').html('width: ').addClass('group half');
        w.append(this.workspaceWidthEl);
        w.append(' px');
        row.append(w);
        var h: JQuery = $('<div>').html('height: ').addClass('group half last');
        h.append(this.workspaceHeightEl);
        h.append((' px'));
        row.append(h);
        container.append(row);
        return container;
    }
}   