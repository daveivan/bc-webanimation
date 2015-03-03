interface Parameters {
    top: number;
    left: number;
    width: number;
    height: number;
    relativePosition: Pos;
    relativeSize: Dimensions;
    background: rgba;
    opacity: number;
    border?: string;
    zindex: number;
    borderRadius: Array<number>;
    rotate: _3d;
    skew: _2d;
    origin: _2d;
}

interface IShape {
    parameters: Parameters;
    id:number;

    setBorder(border: string);

    setZindex(zindex: number);

    setPosition(pos: Pos);

    setRelativePosition(pos: Pos);

    setDimensions(d: Dimensions);

    setRelativeDimensions(d: Dimensions);

    setBackground(c: rgba);

    setOpacity(o: number);

    setX(x: number);

    setRelativeX(x: number);

    setY(y: number);

    setRelativeY(y: number);

    setBorderRadiusTopLeft(val: number);

    setBorderRadiusTopRight(val: number);

    setBorderRadiusBottomRight(val: number);

    setBorderRadiusBottomLeft(val: number);

    setRotateX(val: number);

    setRotateY(val: number);

    setRotateZ(val: number);

    setSkewX(val: number);

    setSkewY(val: number);

    setOriginX(val: number);

    setOriginY(val: number);
}