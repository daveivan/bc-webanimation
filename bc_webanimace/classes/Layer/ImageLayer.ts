class ImageLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, Type.IMAGE, shape);
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application, showHelper: boolean) {
        super.transform(position, shape, helper, currentLayerId, app, showHelper);
    }

    getShape(position: number): IShape {
        var params: Parameters = super.getParameters(position);
        var shape: IShape = new Img(params, this.globalShape.getSrc());

        return shape;
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
        var object: string = Array(this.nesting + 1).join('  ') + '    <img class="image object' + this.id + '" src="' + g.getSrc() + '">\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <img id="' + this.idEl + '" class="image object' + this.id + '" src="' + g.getSrc() + '">\n';
        }
        return object;
    }

    renderShape(container: JQuery, position: number, currentScope: number): JQuery {
        var shape = $('<img>').addClass('shape image');

        var imgShape: any = this.globalShape;
        shape.attr('src', imgShape.getSrc());

        shape = super.renderShapeCore(shape, container, position, currentScope);

        return shape;
    }

    static parseJson(obj: any): Layer {

        var name: string = obj.name;
        var fn: Bezier_points = obj._keyframes[0]._timing_function;
        var params: Parameters = obj._globalShape._parameters;
        var src: string = obj._globalShape._src;

        var img: IShape = new Img(params, src);
        var newLayer: Layer = new ImageLayer(name, fn, img);
        newLayer.id = obj.id;
        newLayer.order = obj._order;
        newLayer.idEl = obj._idEl;
        newLayer.globalShape.id = obj.id;
        newLayer.parent = obj._parent;
        newLayer.nesting = obj.nesting;
        newLayer.isMultipleEdit = obj.isMultipleEdit;
        newLayer.isVisibleOnWorkspace = obj.isVisibleOnWorkspace;
        newLayer.deleteKeyframe(0);

        obj._keyframes.forEach((k: any, i: number) => {
                var p: Parameters = k._shape._parameters;
                var s: IShape = new Img(p, null);
                var f: Bezier_points = k._timing_function;
                var t: number = k._timestamp;
                s.id = newLayer.id;
                newLayer.addKeyframe(s, t, f);
        });

        return newLayer;
    }
}