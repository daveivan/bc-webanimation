﻿class Shape implements IShape {
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

    setDimensions(d: Dimensions) {
        this._parameters.width = d.width;
        this._parameters.height = d.height;
    }

    setBackground(c: rgba) {
        this.parameters.backgroundR = c.r;
        this.parameters.backgroundG = c.g;
        this.parameters.backgroundB = c.b;
        this.parameters.backgroundA = c.a;
    }

    setOpacity(o: number) {
        this.parameters.opacity = o;
    }

    setX(x: number) {
        this._parameters.width = x;
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

    setRotateX(val: number) {
        this._parameters.rotateX = val;
    }

    setRotateY(val: number) {
        this._parameters.rotateY = val;
    }

    setRotateZ(val: number) {
        this._parameters.rotateZ = val;
    }

    setSkewX(val: number) {
        this._parameters.skewX = val;
    }

    setSkewY(val: number) {
        this._parameters.skewY = val;
    }

    setOriginX(val: number) {
        this._parameters.originX = val;
    }

    setOriginY(val: number) {
        this._parameters.originY = val;
    }
}  