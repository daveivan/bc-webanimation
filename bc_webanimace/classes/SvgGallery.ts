class SvgGallery {
    private app;
    private objects: Array<Svg>;

    private dialogEl: JQuery = $('<div>').attr('id', 'dialog').html('<p></p>').attr('title', 'Výsledný kód animace');

    constructor(app: Application) {
        this.app = app;

        $('body').find(this.dialogEl).remove();
        console.log('vytvarim galerii');
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            autoOpen: false,
            draggable: false,
            height: 600,
            width: 900,
            resizable: true,
            modal: true,
            closeOnEscape: true,
            close: (event, ui) => {
                this.dialogEl.remove();
            },
        });

        this.dialogEl.append($('<p>Ahoj ahoj ahoj</p>'));

        this.objects = new Array<Svg>();

        //1. object
        var p: Parameters = {
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            relativeSize: { width: ((100 / this.app.workspace.workspaceContainer.width()) * 100), height: ((100 / this.app.workspace.workspaceContainer.height()) * 100) },
            relativePosition: { top: 0, left: 0 },
            background: { r: 255, g: 255, b: 255, a: 0 },
            opacity: 1,
            borderRadius: [0, 0, 0, 0],
            rotate: { x: 0, y: 0, z: 0 },
            skew: { x: 0, y: 0 },
            origin: { x: 50, y: 50 },
            zindex: this.app.timeline.layers.length,
        };

        var xmlString = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><circle fill="#ff0" stroke="#000" stroke-width="10" stroke-miterlimit="10" cx="382.553" cy="306.786" r="217.961"/><path fill="#ff0" stroke="#000" stroke-width="10" stroke-miterlimit="10" d="M244.69 329.602C315.562 498.534 484.494 479.116 531.582 333"/><ellipse cx="337.592" cy="233.485" rx="21.359" ry="49.272"/><ellipse cx="422.592" cy="232.485" rx="21.359" ry="49.272"/></svg>';
        var svg: Svg = new Svg(p, xmlString);
        this.objects.push(svg);

        //2. object
        xmlString = '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" version="1"><defs><linearGradient><stop offset="0" stop-color="#0ff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g color="#000"><path d="M346.563 329.188l56.875 56.875C433.042 352.41 451.03 308.308 451.03 260c0-48.31-17.988-92.41-47.592-126.063l-56.875 56.875c1.87 2.338 3.695 4.702 5.375 7.188 1.993 2.95 3.854 6.014 5.562 9.156 1.708 3.143 3.284 6.37 4.688 9.688 1.403 3.316 2.638 6.716 3.718 10.187 1.08 3.473 1.98 7.018 2.72 10.626.738 3.61 1.308 7.274 1.687 11 .378 3.727.593 7.518.593 11.344 0 3.826-.215 7.617-.593 11.344-.38 3.726-.95 7.39-1.688 11-.74 3.608-1.638 7.153-2.72 10.625-1.08 3.47-2.314 6.87-3.717 10.186-1.404 3.317-2.98 6.545-4.688 9.688-1.708 3.142-3.57 6.206-5.562 9.156-1.68 2.486-3.505 4.85-5.375 7.188z" fill="#eec73e" overflow="visible" enable-background="accumulate"/><path d="M190.813 346.563l-56.875 56.875C167.59 433.04 211.69 451.03 260 451.03c48.31 0 92.41-17.988 126.063-47.592l-56.875-56.875c-2.338 1.87-4.702 3.695-7.188 5.375-2.95 1.993-6.014 3.854-9.156 5.562-3.143 1.708-6.37 3.284-9.688 4.688-3.316 1.403-6.716 2.638-10.187 3.718-3.473 1.08-7.018 1.98-10.626 2.72-3.61.738-7.274 1.308-11 1.687-3.727.378-7.518.593-11.344.593-3.826 0-7.617-.215-11.344-.594-3.726-.378-7.39-.948-11-1.687-3.608-.74-7.153-1.638-10.625-2.72-3.47-1.08-6.87-2.314-10.186-3.717-3.317-1.404-6.545-2.98-9.688-4.688-3.142-1.708-6.206-3.57-9.156-5.563-2.486-1.68-4.85-3.504-7.187-5.375z" fill="#f0a513" overflow="visible" enable-background="accumulate"/><path d="M173.438 190.813l-56.875-56.875C86.958 167.59 68.97 211.69 68.97 260c0 48.31 17.988 92.41 47.593 126.063l56.875-56.875c-1.87-2.338-3.696-4.702-5.375-7.188-1.994-2.95-3.855-6.014-5.563-9.156-1.708-3.143-3.284-6.37-4.687-9.688-1.404-3.316-2.64-6.716-3.72-10.187-1.08-3.473-1.98-7.018-2.718-10.626-.74-3.61-1.31-7.274-1.687-11-.38-3.727-.594-7.518-.594-11.344 0-3.826.215-7.617.594-11.344.378-3.726.948-7.39 1.687-11 .74-3.608 1.638-7.153 2.72-10.625 1.08-3.47 2.314-6.87 3.718-10.186 1.403-3.317 2.98-6.545 4.687-9.688 1.708-3.142 3.57-6.206 5.563-9.156 1.68-2.486 3.504-4.85 5.375-7.188z" fill="#fb8b00" overflow="visible" enable-background="accumulate"/><path d="M260 68.97c-48.31 0-92.41 17.988-126.062 47.593l56.875 56.874c2.337-1.87 4.7-3.695 7.187-5.375 2.95-1.993 6.014-3.854 9.156-5.562 3.143-1.708 6.37-3.284 9.688-4.688 3.316-1.403 6.716-2.638 10.187-3.718 3.473-1.08 7.018-1.98 10.626-2.72 3.61-.738 7.274-1.308 11-1.686 3.727-.38 7.518-.594 11.344-.594 3.826 0 7.617.215 11.344.594 3.726.378 7.39.948 11 1.687 3.608.74 7.153 1.638 10.625 2.72 3.47 1.08 6.87 2.314 10.186 3.718 3.317 1.403 6.545 2.98 9.688 4.687 3.142 1.708 6.206 3.57 9.156 5.563 2.486 1.68 4.85 3.504 7.188 5.375l56.875-56.875C352.41 86.957 308.31 68.97 260 68.97z" fill="#f44800" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 75.529 89.333)" fill="#f44800" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 267.529 -102.667)" fill="#fb8b00" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 75.529 -294.667)" fill="#fdca01" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 -116.471 -102.667)" fill="#fd3301" overflow="visible" enable-background="accumulate"/></g></svg>';
        svg = new Svg(p, xmlString);
        this.objects.push(svg);
        this.dialogEl.dialog('open');
        this.showGallery();
    }

    showGallery() {
        this.objects.forEach((svg: Svg, i: number) => {
            var blob = new Blob([svg.getSrc()], { type: 'image/svg+xml' });
            var link: JQuery = $('<a>').attr('href', '#');
            var shape = $('<img>').css({ 'width': '150px', 'height': '150px' });

            this.readFile(blob, (e) => {
                shape.attr('src', e.target.result);
                link.attr('data-id', i);
                link.append(shape);
                this.dialogEl.append(link);

                link.on('click', (ev: JQueryEventObject) => {
                    this.insertSvg(link.data('id'));
                });
            });
        });
    }

    insertSvg(id) {
        this.app.workspace.insertLayerFromGallery(this.objects[id]);

        this.dialogEl.remove();
    }

    readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    }
}