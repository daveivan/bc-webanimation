class RectangleLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, Type.DIV, shape);
    }

    jsem() {
        console.log('jsem cverec');
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application, showHelper: boolean) {
        super.transform(position, shape, helper, currentLayerId, app, showHelper);
    }

    getShape(position: number): IShape {
        var params: Parameters = super.getParameters(position);

        var shape: IShape = new Rectangle(params);

        return shape;
    }

    getInitStyles(nameElement: string, workspaceSize: Dimensions) {
        return super.getInitStyles(nameElement, workspaceSize);
    }

    getKeyframeStyle(timestamp: number, workspaceSize: Dimensions) {
        return super.getKeyframeStyle(timestamp, workspaceSize);
    }

    /*getObject(): string {
        var object: string = '    <div class="square object' + this.id + '">\n';
        if (this.idEl != null) {
            object = '    <div id="' + this.idEl + '" class="square object' + this.id + '">\n';
        }
        object += this.getChildsObject(this.id, object);
        object += '    </div>\n';
        return object;
    }*/

    getObject(): string {
        var object: string = Array(this.nesting + 1).join('  ') + '    <div class="square object' + this.id + '">\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <div id="' + this.idEl + '" class="square object' + this.id + '">\n';
        }
        return object;
    }

    renderShape(container: JQuery, position: number, currentScope: number): JQuery {
        var shape: JQuery = $('<div>').addClass('shape square');
        var helper: JQuery = $('<div>').addClass('shape-helper square-helper');
        shape = super.renderShapeCore(shape, container, position, currentScope, helper);

        return shape;
    }

    static parseJson(obj: any): Layer {

        var name: string = obj.name;
        var fn: Bezier_points = obj._keyframes[0]._timing_function;
        var params: Parameters = obj._globalShape._parameters;
        var rect: IShape = new Rectangle(params);
        var newLayer: Layer = new RectangleLayer(name, fn, rect);
        newLayer.id = obj.id;
        newLayer.order = obj._order;
        newLayer.idEl = obj._idEl;
        newLayer.globalShape.id = obj.id;
        newLayer.parent = obj._parent;
        newLayer.nesting = obj.nesting;
        newLayer.isMultipleEdit = obj.isMultipleEdit;
        newLayer.isVisibleOnWorkspace = obj.isVisibleOnWorkspace;

        obj._keyframes.forEach((k: any, i: number) => {
            if (k._timestamp != 0) {
                var p: Parameters = k._shape._parameters;
                var s: IShape = new Rectangle(p);
                var f: Bezier_points = k._timing_function;
                var t: number = k._timestamp;
                s.id = newLayer.id;
                newLayer.addKeyframe(s, t, f);
            }
        });
   
        return newLayer;
    }
} 