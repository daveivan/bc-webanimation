class SvgGallery {
    private app;
    private objects: Array<Svg>;

    private dialogEl: JQuery = $('<div>').attr('id', 'dialog').attr('title', 'Galerie');

    private files: Array<string> = ["cloud-1.svg", "cloud-2.svg", "cloud-3.svg", "cloud-4.svg", "cloud-5.svg", "cloud-6.svg", "plane.svg", "vsb.svg", "fei.svg", "add187.svg", "alarm50.svg", "american39.svg", "aromatherapy2.svg", "award27.svg", "award42.svg", "award44.svg", "award46.svg", "award47.svg", "ball26.svg", "ball27.svg", "ball28.svg", "ball29.svg", "banner3.svg", "baseball28.svg", "baseball30.svg", "basketball39.svg", "basketball41.svg", "bowling17.svg", "bowling19.svg", "bowling21.svg", "box79.svg", "boxing6.svg", "boy39.svg", "briefcase51.svg", "bulb12.svg", "casual.svg", "chef25.svg", "chronometer21.svg", "chronometer23.svg", "click1.svg", "closed65.svg", "closed66.svg", "coin16.svg", "coins30.svg", "coins31.svg", "coins32.svg", "commercial16.svg", "concentric3.svg", "credit100.svg", "credit101.svg", "credit102.svg", "delete83.svg", "digital24.svg", "discount3.svg", "dislike10.svg", "diving2.svg", "double100.svg", "double102.svg", "dumbbells4.svg", "engineer1.svg", "farmer2.svg", "female225.svg", "female227.svg", "female228.svg", "female229.svg", "female230.svg", "flag102.svg", "flags14.svg", "forefinger1.svg", "free9.svg", "front19.svg", "full48.svg", "gardener1.svg", "geek.svg", "gentleman.svg", "girl31.svg", "golf25.svg", "graduate26.svg", "graduate33.svg", "hands9.svg", "herbal1.svg", "high18.svg", "hockey4.svg", "hockey5.svg", "ice66.svg", "jcb6.svg", "like52.svg", "logotype68.svg", "logotype77.svg", "logotype82.svg", "logotype84.svg", "logotype99.svg", "male231.svg", "man427.svg", "map47.svg", "mastercard7.svg", "medal55.svg", "medal59.svg", "medical84.svg", "medieval1.svg", "middle1.svg", "money131.svg", "money132.svg", "new105.svg", "number42.svg", "office29.svg", "office30.svg", "one37.svg", "one38.svg", "one39.svg", "one41.svg", "one43.svg", "one44.svg", "one45.svg", "one46.svg", "one49.svg", "one53.svg", "one54.svg", "one57.svg", "one58.svg", "one60.svg", "one63.svg", "open208.svg", "paypal15.svg", "person304.svg", "phone377.svg", "piggy12.svg", "pilot2.svg", "policeman5.svg", "present19.svg", "price10.svg", "price11.svg", "price9.svg", "product3.svg", "professor19.svg", "publicity.svg", "qr7.svg", "relaxing1.svg", "remove21.svg", "resizing2.svg", "ribbon48.svg", "ribbon71.svg", "ribbon77.svg", "rock5.svg", "rolled3.svg", "rotate10.svg", "rubbish1.svg", "sailing10.svg", "sailing9.svg", "sale21.svg", "scream1.svg", "scream2.svg", "shield76.svg", "shoe18.svg", "shopping234.svg", "shopping235.svg", "shopping236.svg", "shopping237.svg", "shuttlecock1.svg", "signing2.svg", "silhouette20.svg", "silhouette21.svg", "silhouette43.svg", "silhouette48.svg", "silhouette53.svg", "silhouette61.svg", "soccer81.svg", "soccer82.svg", "socialnetwork26.svg", "socialnetwork31.svg", "socialnetwork37.svg", "socialnetwork55.svg", "socialnetwork64.svg", "socialnetwork69.svg", "spa21.svg", "speech142.svg", "speech143.svg", "speech144.svg", "speech145.svg", "speech146.svg", "speech147.svg", "speech148.svg", "speech149.svg", "speech150.svg", "sport13.svg", "sport14.svg", "sportive59.svg", "sports37.svg", "sports38.svg", "star159.svg", "stewardess.svg", "swipe10.svg", "swipe15.svg", "swipe16.svg", "swipe20.svg", "swipe21.svg", "swipe22.svg", "swipe3.svg", "swipe4.svg", "swipe6.svg", "swipe8.svg", "swipe9.svg", "table40.svg", "tap4.svg", "target41.svg", "tennis21.svg", "tennis22.svg", "tennis24.svg", "thinking1.svg", "thinking2.svg", "thought7.svg", "thought8.svg", "three144.svg", "three146.svg", "three148.svg", "three151.svg", "thumb43.svg", "thumb47.svg", "toilet9.svg", "touch18.svg", "touching1.svg", "trophy58.svg", "trophy59.svg", "trophy61.svg", "two333.svg", "two335.svg", "two341.svg", "two343.svg", "van18.svg", "visa8.svg", "volleyball6.svg", "waiter1.svg", "waitress.svg", "water54.svg", "whistle14.svg", "woman106.svg", "woman107.svg", "woman108.svg"];

    constructor(app: Application) {
        this.app = app;

        $('body').find(this.dialogEl).remove();
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            autoOpen: false,
            draggable: false,
            height: 550,
            width: 900,
            resizable: true,
            modal: true,
            closeOnEscape: true,
            close: (event, ui) => {
                this.dialogEl.remove();
            },
        });
        $('.ui-dialog-titlebar-close').empty().append('X');

        this.objects = new Array<Svg>();
        this.dialogEl.dialog('open');

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
            translate: { x: 0, y: 0, z: 0 },
            relativeTranslate: { x: 0, y: 0 },
            perspective: 0,
        };

        this.files.forEach((name: string, index: number) => {
            $.ajax({
                url: 'svg-gallery/' + name,
                dataType: 'text',
                success: (data) => {
                    var svg: Svg = new Svg(p, data);
                    this.objects.push(svg);
                    this.showSingleObject(this.objects.length - 1);
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