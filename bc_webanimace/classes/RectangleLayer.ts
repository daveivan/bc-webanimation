class RectangleLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, shape);
    }

    jsem() {
        console.log('jsem cverec');
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, controlPanel) {
        super.transform(position, shape, helper, currentLayerId, controlPanel);
    }

    getInitStyles(nameElement: string) {
        return super.getInitStyles(nameElement);
    }

    getKeyframeStyle(timestamp: number) {
        return super.getKeyframeStyle(timestamp);
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
        shape = super.renderShapeCore(shape, container, position, currentScope);

        return shape;
    }
} 