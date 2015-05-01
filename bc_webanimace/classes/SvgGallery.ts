class SvgGallery {
    private app;
    private objects: Array<Svg>;

    private dialogEl: JQuery = $('<div>').attr('id', 'dialog').attr('title', 'Galerie');

    private files: Array<string> = ["add187.svg", "alarm50.svg", "american39.svg", "aromatherapy2.svg", "award27.svg", "award42.svg", "award44.svg", "award46.svg", "award47.svg", "ball26.svg", "ball27.svg", "ball28.svg", "ball29.svg", "banner3.svg", "baseball28.svg", "baseball30.svg", "basketball39.svg", "basketball41.svg", "bowling17.svg", "bowling19.svg", "bowling21.svg", "box79.svg", "boxing6.svg", "boy39.svg", "briefcase51.svg", "bulb12.svg", "casual.svg", "chef25.svg", "chronometer21.svg", "chronometer23.svg", "click1.svg", "closed65.svg", "closed66.svg", "coin16.svg", "coins30.svg", "coins31.svg", "coins32.svg", "commercial16.svg", "concentric3.svg", "credit100.svg", "credit101.svg", "credit102.svg", "delete83.svg", "digital24.svg", "discount3.svg", "dislike10.svg", "diving2.svg", "double100.svg", "double102.svg", "dumbbells4.svg", "engineer1.svg", "farmer2.svg", "female225.svg", "female227.svg", "female228.svg", "female229.svg", "female230.svg", "flag102.svg", "flags14.svg", "forefinger1.svg", "free9.svg", "front19.svg", "full48.svg", "gardener1.svg", "geek.svg", "gentleman.svg", "girl31.svg", "golf25.svg", "graduate26.svg", "graduate33.svg", "hands9.svg", "herbal1.svg", "high18.svg", "hockey4.svg", "hockey5.svg", "ice66.svg", "jcb6.svg", "like52.svg", "logotype68.svg", "logotype77.svg", "logotype82.svg", "logotype84.svg", "logotype99.svg", "male231.svg", "man427.svg", "map47.svg", "mastercard7.svg", "medal55.svg", "medal59.svg", "medical84.svg", "medieval1.svg", "middle1.svg", "money131.svg", "money132.svg", "new105.svg", "number42.svg", "office29.svg", "office30.svg", "one37.svg", "one38.svg", "one39.svg", "one41.svg", "one43.svg", "one44.svg", "one45.svg", "one46.svg", "one49.svg", "one53.svg", "one54.svg", "one57.svg", "one58.svg", "one60.svg", "one63.svg", "open208.svg", "paypal15.svg", "person304.svg", "phone377.svg", "piggy12.svg", "pilot2.svg", "policeman5.svg", "present19.svg", "price10.svg", "price11.svg", "price9.svg", "product3.svg", "professor19.svg", "publicity.svg", "qr7.svg", "relaxing1.svg", "remove21.svg", "resizing2.svg", "ribbon48.svg", "ribbon71.svg", "ribbon77.svg", "rock5.svg", "rolled3.svg", "rotate10.svg", "rubbish1.svg", "sailing10.svg", "sailing9.svg", "sale21.svg", "scream1.svg", "scream2.svg", "shield76.svg", "shoe18.svg", "shopping234.svg", "shopping235.svg", "shopping236.svg", "shopping237.svg", "shuttlecock1.svg", "signing2.svg", "silhouette20.svg", "silhouette21.svg", "silhouette43.svg", "silhouette48.svg", "silhouette53.svg", "silhouette61.svg", "soccer81.svg", "soccer82.svg", "socialnetwork26.svg", "socialnetwork31.svg", "socialnetwork37.svg", "socialnetwork55.svg", "socialnetwork64.svg", "socialnetwork69.svg", "spa21.svg", "speech142.svg", "speech143.svg", "speech144.svg", "speech145.svg", "speech146.svg", "speech147.svg", "speech148.svg", "speech149.svg", "speech150.svg", "sport13.svg", "sport14.svg", "sportive59.svg", "sports37.svg", "sports38.svg", "star159.svg", "stewardess.svg", "swipe10.svg", "swipe15.svg", "swipe16.svg", "swipe20.svg", "swipe21.svg", "swipe22.svg", "swipe3.svg", "swipe4.svg", "swipe6.svg", "swipe8.svg", "swipe9.svg", "table40.svg", "tap4.svg", "target41.svg", "tennis21.svg", "tennis22.svg", "tennis24.svg", "thinking1.svg", "thinking2.svg", "thought7.svg", "thought8.svg", "three144.svg", "three146.svg", "three148.svg", "three151.svg", "thumb43.svg", "thumb47.svg", "toilet9.svg", "touch18.svg", "touching1.svg", "trophy58.svg", "trophy59.svg", "trophy61.svg", "two333.svg", "two335.svg", "two341.svg", "two343.svg", "van18.svg", "visa8.svg", "volleyball6.svg", "waiter1.svg", "waitress.svg", "water54.svg", "whistle14.svg", "woman106.svg", "woman107.svg", "woman108.svg"]

    constructor(app: Application) {
        this.app = app;

        $('body').find(this.dialogEl).remove();
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
            scale: 1,
            translate: {x: 0, y: 0},
        };

        var xmlString = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><circle fill="#ff0" stroke="#000" stroke-width="10" stroke-miterlimit="10" cx="382.553" cy="306.786" r="217.961"/><path fill="#ff0" stroke="#000" stroke-width="10" stroke-miterlimit="10" d="M244.69 329.602C315.562 498.534 484.494 479.116 531.582 333"/><ellipse cx="337.592" cy="233.485" rx="21.359" ry="49.272"/><ellipse cx="422.592" cy="232.485" rx="21.359" ry="49.272"/></svg>';
        var svg: Svg = new Svg(p, xmlString);
        this.objects.push(svg);

        //2. object
        xmlString = '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" version="1"><defs><linearGradient><stop offset="0" stop-color="#0ff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g color="#000"><path d="M346.563 329.188l56.875 56.875C433.042 352.41 451.03 308.308 451.03 260c0-48.31-17.988-92.41-47.592-126.063l-56.875 56.875c1.87 2.338 3.695 4.702 5.375 7.188 1.993 2.95 3.854 6.014 5.562 9.156 1.708 3.143 3.284 6.37 4.688 9.688 1.403 3.316 2.638 6.716 3.718 10.187 1.08 3.473 1.98 7.018 2.72 10.626.738 3.61 1.308 7.274 1.687 11 .378 3.727.593 7.518.593 11.344 0 3.826-.215 7.617-.593 11.344-.38 3.726-.95 7.39-1.688 11-.74 3.608-1.638 7.153-2.72 10.625-1.08 3.47-2.314 6.87-3.717 10.186-1.404 3.317-2.98 6.545-4.688 9.688-1.708 3.142-3.57 6.206-5.562 9.156-1.68 2.486-3.505 4.85-5.375 7.188z" fill="#eec73e" overflow="visible" enable-background="accumulate"/><path d="M190.813 346.563l-56.875 56.875C167.59 433.04 211.69 451.03 260 451.03c48.31 0 92.41-17.988 126.063-47.592l-56.875-56.875c-2.338 1.87-4.702 3.695-7.188 5.375-2.95 1.993-6.014 3.854-9.156 5.562-3.143 1.708-6.37 3.284-9.688 4.688-3.316 1.403-6.716 2.638-10.187 3.718-3.473 1.08-7.018 1.98-10.626 2.72-3.61.738-7.274 1.308-11 1.687-3.727.378-7.518.593-11.344.593-3.826 0-7.617-.215-11.344-.594-3.726-.378-7.39-.948-11-1.687-3.608-.74-7.153-1.638-10.625-2.72-3.47-1.08-6.87-2.314-10.186-3.717-3.317-1.404-6.545-2.98-9.688-4.688-3.142-1.708-6.206-3.57-9.156-5.563-2.486-1.68-4.85-3.504-7.187-5.375z" fill="#f0a513" overflow="visible" enable-background="accumulate"/><path d="M173.438 190.813l-56.875-56.875C86.958 167.59 68.97 211.69 68.97 260c0 48.31 17.988 92.41 47.593 126.063l56.875-56.875c-1.87-2.338-3.696-4.702-5.375-7.188-1.994-2.95-3.855-6.014-5.563-9.156-1.708-3.143-3.284-6.37-4.687-9.688-1.404-3.316-2.64-6.716-3.72-10.187-1.08-3.473-1.98-7.018-2.718-10.626-.74-3.61-1.31-7.274-1.687-11-.38-3.727-.594-7.518-.594-11.344 0-3.826.215-7.617.594-11.344.378-3.726.948-7.39 1.687-11 .74-3.608 1.638-7.153 2.72-10.625 1.08-3.47 2.314-6.87 3.718-10.186 1.403-3.317 2.98-6.545 4.687-9.688 1.708-3.142 3.57-6.206 5.563-9.156 1.68-2.486 3.504-4.85 5.375-7.188z" fill="#fb8b00" overflow="visible" enable-background="accumulate"/><path d="M260 68.97c-48.31 0-92.41 17.988-126.062 47.593l56.875 56.874c2.337-1.87 4.7-3.695 7.187-5.375 2.95-1.993 6.014-3.854 9.156-5.562 3.143-1.708 6.37-3.284 9.688-4.688 3.316-1.403 6.716-2.638 10.187-3.718 3.473-1.08 7.018-1.98 10.626-2.72 3.61-.738 7.274-1.308 11-1.686 3.727-.38 7.518-.594 11.344-.594 3.826 0 7.617.215 11.344.594 3.726.378 7.39.948 11 1.687 3.608.74 7.153 1.638 10.625 2.72 3.47 1.08 6.87 2.314 10.186 3.718 3.317 1.403 6.545 2.98 9.688 4.687 3.142 1.708 6.206 3.57 9.156 5.563 2.486 1.68 4.85 3.504 7.188 5.375l56.875-56.875C352.41 86.957 308.31 68.97 260 68.97z" fill="#f44800" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 75.529 89.333)" fill="#f44800" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 267.529 -102.667)" fill="#fb8b00" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 75.529 -294.667)" fill="#fdca01" overflow="visible" enable-background="accumulate"/><path d="M357.587 506.582a92.106 89.397 0 1 1-184.21 0 92.106 89.397 0 1 1 184.21 0z" transform="matrix(.695 0 0 .716 -116.471 -102.667)" fill="#fd3301" overflow="visible" enable-background="accumulate"/></g></svg>';
        svg = new Svg(p, xmlString);
        this.objects.push(svg);

        //3.objekt
        this.files.forEach((name: string, index: number) => {
            $.ajax({
                url: 'svg-gallery/' + name,
                success: (data) => {
                    svg = new Svg(p, data);
                    this.objects.push(svg);
                    this.dialogEl.dialog('open');
                    this.showSingleObject(this.objects.length - 1);
                    //this.showGallery();
                }
            });
        });
    }

    showGallery() {
        this.objects.forEach((svg: Svg, i: number) => {
            var blob = new Blob([svg.getSrc()], { type: 'image/svg+xml' });
            var link: JQuery = $('<a>').attr('href', '#').addClass('gallery-item');
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

    showSingleObject(index: number) {
        var svg: Svg = this.objects[index];
        var blob = new Blob([svg.getSrc()], { type: 'image/svg+xml' });
        var link: JQuery = $('<a>').attr('href', '#').addClass('gallery-item');
        var shape = $('<img>').css({ 'width': '50px', 'height': '50px' });

        this.readFile(blob, (e) => {
            shape.attr('src', e.target.result);
            link.attr('data-id', index);
            link.append(shape);
            this.dialogEl.append(link);

            link.on('click', (ev: JQueryEventObject) => {
                this.insertSvg(link.data('id'));
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