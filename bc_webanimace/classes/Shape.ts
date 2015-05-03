class Shape implements IShape {
    _parameters: Parameters;
    private _id: number;

    constructor(params: Parameters) {
        this._parameters = params;
    }

    get parameters() {
        return this._parameters;
    }

    get id() {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }

    setBorder(border: string) {
        this._parameters.border = border;
    }

    setZindex(zindex: number) {
        this._parameters.zindex = zindex;
    }

    setPosition(pos: Pos) {
        this._parameters.top = pos.top;
        this._parameters.left = pos.left;
    }

    setRelativePosition(pos: Pos) {
        this._parameters.relativePosition.top = pos.top;
        this._parameters.relativePosition.left = pos.left;
    }

    setDimensions(d: Dimensions) {
        this._parameters.width = d.width;
        this._parameters.height = d.height;
    }

    setRelativeDimensions(d: Dimensions) {
        this._parameters.relativeSize.width = d.width;
        this._parameters.relativeSize.height = d.height;
    }

    setBackground(c: rgba) {
        this.parameters.background = c;
    }

    setOpacity(o: number) {
        this.parameters.opacity = o;
    }

    setX(x: number) {
        this._parameters.width = x;
    }

    setRelativeX(x: number) {
        this._parameters.relativeSize.width = x;
    }

    setRelativeY(y: number) {
        this._parameters.relativeSize.height = y;
    }

    setY(y: number) {
        this._parameters.height = y;
    }

    setBorderRadiusTopLeft(val: number) {
        this._parameters.borderRadius[0] = val;
    }

    setBorderRadiusTopRight(val: number) {
        this._parameters.borderRadius[1] = val;
    }

    setBorderRadiusBottomRight(val: number) {
        this._parameters.borderRadius[2] = val;
    }

    setBorderRadiusBottomLeft(val: number) {
        this._parameters.borderRadius[3] = val;
    }

    setBorderRadius(val: number) {
        this.setBorderRadiusBottomLeft(val);
        this.setBorderRadiusBottomRight(val);
        this.setBorderRadiusTopLeft(val);
        this.setBorderRadiusTopRight(val);
    }

    setRotateX(val: number) {
        this._parameters.rotate.x = val;
    }

    setRotateY(val: number) {
        this._parameters.rotate.y = val;
    }

    setRotateZ(val: number) {
        this._parameters.rotate.z = val;
    }

    setSkewX(val: number) {
        this._parameters.skew.x = val;
    }

    setSkewY(val: number) {
        this._parameters.skew.y = val;
    }

    setOriginX(val: number) {
        this._parameters.origin.x = val;
    }

    setOriginY(val: number) {
        this._parameters.origin.y = val;
    }

    setScale(val: number) {
        this._parameters.scale = val;
    }

    setTranslateX(val: number) {
        this._parameters.translate.x = val;
    }

    setTranslateY(val: number) {
        this._parameters.translate.y = val;
    }

    setTranslateZ(val: number) {
        this._parameters.translate.z = val;
    }

    setRelativeTranslateX(val: number) {
        this._parameters.relativeTranslate.x = val;
    }

    setRelativeTranslateY(val: number) {
        this._parameters.relativeTranslate.y = val;
    }

    setPerspective(val: number) {
        this._parameters.perspective = val;
    }

    setParameterByName(name: string, val: number) {
        if (name == 'opacity') {
            this.setOpacity(val);
        } else if (name == 'rotatey') {
            this.setRotateY(val);
        } else if(name == 'rotatez') {
            this.setRotateZ(val);
        } else if (name == 'rotatex') {
            this.setRotateX(val);
        } else if (name == 'translatey') {
            this.setTranslateY(val);
            this.setRelativeTranslateY((val / this.parameters.height) * 100);
        } else if (name == 'translatex') {
            this.setTranslateX(val);
            this.setRelativeTranslateX((val / this.parameters.width) * 100);
        } else if (name == 'translatez') {
            this.setTranslateZ(val);
        } else if (name == 'scale') {
            this.setScale(val);
        } else if (name == 'originx') {
            this.setOriginX(val);
        } else if (name == 'originy') {
            this.setOriginY(val);
        } else if (name == 'perspective') {
            this.setPerspective(val);
        } else if (name == 'skewx') {
            this.setSkewX(val);
        } else if (name == 'skewy') {
            this.setSkewY(val);
        }
    }
}  