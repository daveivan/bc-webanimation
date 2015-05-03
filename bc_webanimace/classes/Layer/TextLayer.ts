class TextLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, Type.TEXT, shape);
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, app: Application, showHelper: boolean) {
        super.transform(position, shape, helper, currentLayerId, app, showHelper);

        //find interval between position
        var rangeData = this.getRange(position);
        var left: number = rangeData.left;
        var right: number = rangeData.right;
        var rng: Array<Keyframe> = rangeData.rng;

        var fontParams: fontParameters = null;
        var g: any = this.globalShape;

        if (left != null) {
            fontParams = {
                color: rng['l'].shape.getColor(),
                size: rng['l'].shape.getSize(),
                fontFamily: g.getFamily(),
            }
        }
        if (right != null) {
            fontParams = {
                color: rng['r'].shape.getColor(),
                size: rng['r'].shape.getSize(),
                fontFamily: g.getFamily(),
            }
        }

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            fontParams = {
                color: {
                    r: Math.round(this.computeAttr(rng['l'].shape.getColor().r, rng['r'].shape.getColor().r, bezier(p))),
                    g: Math.round(this.computeAttr(rng['l'].shape.getColor().g, rng['r'].shape.getColor().g, bezier(p))),
                    b: Math.round(this.computeAttr(rng['l'].shape.getColor().b, rng['r'].shape.getColor().b, bezier(p))),
                },
                size: this.computeAttr(rng['l'].shape.getSize(), rng['r'].shape.getSize(), bezier(p)),
                fontFamily: g.getFamily()
            }
        }

        shape.css({
            'color': 'rgb(' + fontParams.color.r + ',' + fontParams.color.g + ',' + fontParams.color.b + ')',
            'font-size': (fontParams.size / 16) + 'em',
            'font-family': fontParams.fontFamily,
        });

        if (currentLayerId == this.id) {
            app.controlPanel.updateFont(fontParams.color, fontParams.size, fontParams.fontFamily);
        }
    }

    getShape(position: number): IShape {
        //find interval between position
        var rangeData = this.getRange(position);
        var left: number = rangeData.left;
        var right: number = rangeData.right;
        var rng: Array<Keyframe> = rangeData.rng;

        var fontParams: fontParameters = null;
        var g: any = this.globalShape;

        if (left != null) {
            fontParams = {
                color: rng['l'].shape.getColor(),
                size: rng['l'].shape.getSize(),
                fontFamily: g.getFamily(),
            }
        }
        if (right != null) {
            fontParams = {
                color: rng['r'].shape.getColor(),
                size: rng['r'].shape.getSize(),
                fontFamily: g.getFamily(),
            }
        }

        //if exist left && right, compute attributes
        if (Object.keys(rng).length == 2) {
            var fn: Bezier_points = rng['l'].timing_function;
            var bezier = BezierEasing(fn.p0, fn.p1, fn.p2, fn.p3);
            var p: number = (position - left) / (right - left);

            fontParams = {
                color: {
                    r: Math.round(this.computeAttr(rng['l'].shape.getColor().r, rng['r'].shape.getColor().r, bezier(p))),
                    g: Math.round(this.computeAttr(rng['l'].shape.getColor().g, rng['r'].shape.getColor().g, bezier(p))),
                    b: Math.round(this.computeAttr(rng['l'].shape.getColor().b, rng['r'].shape.getColor().b, bezier(p))),
                },
                size: this.computeAttr(rng['l'].shape.getSize(), rng['r'].shape.getSize(), bezier(p)),
                fontFamily: g.getFamily()
            }
        }

        var params: Parameters = super.getParameters(position);

        var t: any = this.globalShape;
        var shape: IShape = new TextField(params, t.getContent(), fontParams.color, fontParams.size, t.getFamily());

        return shape;
    }

    getInitStyles(nameElement: string, workspaceSize: Dimensions) {
        var shape: any = (this.getKeyframeByTimestamp(this.timestamps[0])).shape;

        var cssObject = super.getInitStyles(nameElement, workspaceSize);
        cssObject['display'] = 'inline';
        cssObject['font-size'] = (shape.getSize() / 16) + 'em';
        cssObject['font-family'] = '"' + shape.getFamily() + '"';
        cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    }

    getKeyframeStyle(timestamp: number, workspaceSize: Dimensions) {
        var shape: any = (this.getKeyframeByTimestamp(timestamp)).shape;

        var cssObject = super.getKeyframeStyle(timestamp, workspaceSize);

        //check if parameters is changing
        var initShape: any = (this.getKeyframeByTimestamp(this.timestamps[0])).shape;
        var change: repeatTextParams = {
            size: false,
            color: false,
        }
        this.getAllKeyframes().forEach((k: Keyframe, i: number) => {
            var s: any = k.shape;
            if (initShape.getSize() != s.getSize()) change.size = true;
            if (initShape.color.r != s.color.r) change.color = true;
            if (initShape.color.g != s.color.g) change.color = true;
            if (initShape.color.b != s.color.b) change.color = true;
        });
        if (change.size) cssObject['font-size'] = (shape.getSize() / 16) + 'em';
        if (change.color) cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    }

    getObject(): string {
        var g: any = this.globalShape;
        var object: string = Array(this.nesting + 1).join('  ') + '    <span class="text object' + this.id + '">' + g.getContent();
        if (this.idEl != null) {
            object = Array(this.nesting + 1).join('  ') + '    <span id="' + this.idEl + '" class="text object' + this.id + '">' + g.getContent();
        }
        return object;
    }

    renderShape(container: JQuery, position: number, currentScope: number): JQuery {
        var layer: any = this.globalShape;
        var shape = $('<span>').addClass('shape froala text').html(layer.getContent());

        var globalTextShape: any = this.globalShape;
        var keyframe: Keyframe = this.getKeyframeByTimestamp(position);

        //if no keyframe, get init keyframe
        if (keyframe == null) {
            keyframe = this.getKeyframe(0);
        }
        var textShape: any = keyframe.shape;
        shape.css({
            'color': 'rgba(' + textShape.getColor().r + ',' + textShape.getColor().g + ',' + textShape.getColor().b + ')',
            'font-size': (textShape.getSize() / 16) + 'em',
            'font-family': globalTextShape.getFamily(),
        });
        shape.froala({
            inlineMode: true,
            paragraphy: false,
            allowedTags: [],
            buttons: [],
            placeholder: 'Zadejte text...',
        });

        shape.on('editable.contentChanged', (e, editor) => {
            var globalTextShape: any = this.globalShape;
            globalTextShape.setContent(editor.trackHTML);
        });

        shape = super.renderShapeCore(shape, container, position, currentScope);

        return shape;
    }

    static parseJson(obj: any): Layer {

        var name: string = obj.name;
        var fn: Bezier_points = obj._keyframes[0]._timing_function;
        var params: Parameters = obj._globalShape._parameters;
        var content: string = obj._globalShape._content;
        var color: rgb = obj._globalShape.color;
        var size: number = obj._globalShape.size;
        var family: string = obj._globalShape.family;

        var text: IShape = new TextField(params, content, color, size, family);
        var newLayer: Layer = new TextLayer(name, fn, text);
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
                var content: string = k._shape._content;
                var color: rgb = k._shape.color;
                var size: number = k._shape.size;
                var family: string = k._shape.family;
                var s: IShape = new TextField(p, content, color, size, family);
                var f: Bezier_points = k._timing_function;
                var t: number = k._timestamp;
                s.id = newLayer.id;
                newLayer.addKeyframe(s, t, f);
        });

        return newLayer;
    }
}