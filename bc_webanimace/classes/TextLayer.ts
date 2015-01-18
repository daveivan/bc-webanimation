class TextLayer extends Layer {
    constructor(name: string, fn: Bezier_points, shape: IShape = null) {
        super(name, fn, shape);
    }

    transform(position: number, shape: JQuery, helper: JQuery, currentLayerId: number, controlPanel) {
        super.transform(position, shape, helper, currentLayerId, controlPanel);

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
            'font-size': fontParams.size,
            'font-family': fontParams.fontFamily,
        });

        if (currentLayerId == this.id) {
            controlPanel.updateFont(fontParams.color, fontParams.size, fontParams.fontFamily);
        }
    }

    jsem() {
        console.log('jsem text');
    }

    getInitStyles(nameElement: string) {
        var shape: any = (this.getKeyframeByTimestamp(this.timestamps[0])).shape;

        var cssObject = super.getInitStyles(nameElement);
        cssObject['display'] = 'inline';
        cssObject['font-size'] = shape.getSize() + 'px';
        cssObject['font-family'] = '"' + shape.getFamily() + '"';
        cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

        return cssObject;
    }

    getKeyframeStyle(timestamp: number) {
        var shape: any = (this.getKeyframeByTimestamp(timestamp)).shape;

        var cssObject = super.getKeyframeStyle(timestamp);

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
        if(change.size) cssObject['font-size'] = shape.getSize() + 'px';
        if(change.color) cssObject['color'] = 'rgb(' + shape.color.r + ',' + shape.color.g + ',' + shape.color.b + ')';

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
            'font-size': textShape.getSize(),
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
} 