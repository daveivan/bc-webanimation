class SvgLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, shape);
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, controlPanel) {
        super.transform(position, shape, helper, currentLayerId, controlPanel);
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
        var object: string = Array(this.nesting + 1).join('  ') + '    <div class="svg object' + this.id + '">\n' + g.getSrc() + '\n';
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <div id="' + this.idEl + '" class="svg object' + this.id + '">\n' + g.getSrc() + '\n';
        }
        return object;
    }

    renderShape(container: JQuery, position: number, currentScope: number): JQuery {
        /*var shape = $('<img>').addClass('shape svg');

        var svgShape: any = this.globalShape;
        shape.attr('src', 'data:image/svg+xml;charset=utf-8,' + svgShape.getSrc());*/
        var shape = $('<div>').addClass('shape svg');
        var svgShape: any = this.globalShape;
        shape.append(svgShape.getSrc());

        shape = super.renderShapeCore(shape, container, position, currentScope);

        return shape;
    }
}  