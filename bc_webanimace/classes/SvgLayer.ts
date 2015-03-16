class SvgLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, Type.SVG, shape);
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application) {
        super.transform(position, shape, helper, currentLayerId, app);
    }

    jsem() {
        console.log('jsem svg');
    }

    getInitStyles(nameElement: string, workspaceSize: Dimensions) {
        var cssObject = super.getInitStyles(nameElement, workspaceSize);

        return cssObject;
    }

    getKeyframeStyle(timestamp: number, workspaceSize: Dimensions) {
        return super.getKeyframeStyle(timestamp, workspaceSize);
    }

    getObject(): string {
        var g: any = this.globalShape;
        var object: string = Array(this.nesting + 1).join('  ') + '    <img class="svg object' + this.id + '" src="' + g.base64 + '">\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <img id="' + this.idEl + '" class="svg object' + this.id + '" src="' + g.base64 + '">\n';
        }
        return object;
    }

    renderShape(container: JQuery, position: number, currentScope: number): JQuery {
        var svgShape: any = this.globalShape;
        var blob = new Blob([svgShape.getSrc()], { type: 'image/svg+xml' });
        var shape = $('<img>').addClass('shape svg');

        /*var shape = $('<div>').addClass('shape svg');
        var svgShape: any = this.globalShape;*/
        //shape.append(svgShape.getSrc());

        this.readFile(blob, (e) => {
            shape.attr('src', e.target.result);
        });
        shape = super.renderShapeCore(shape, container, position, currentScope);

        return shape;

    }

    readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    }

    static parseJson(obj: any): Layer {

        var name: string = obj.name;
        var fn: Bezier_points = obj._keyframes[0]._timing_function;
        var params: Parameters = obj._globalShape._parameters;
        var src: string = obj._globalShape._src;

        var img: IShape = new Svg(params, src);
        var newLayer: Layer = new SvgLayer(name, fn, img);
        newLayer.id = obj.id;
        newLayer.order = obj._order;
        newLayer.idEl = obj._idEl;
        newLayer.globalShape.id = obj.id;
        newLayer.parent = obj._parent;
        newLayer.nesting = obj.nesting;

        obj._keyframes.forEach((k: any, i: number) => {
            if (k._timestamp != 0) {
                var p: Parameters = k._shape._parameters;
                var s: IShape = new Svg(p, null);
                var f: Bezier_points = k._timing_function;
                var t: number = k._timestamp;
                s.id = newLayer.id;
                newLayer.addKeyframe(s, t, f);
            }
        });

        return newLayer;
    }
}  