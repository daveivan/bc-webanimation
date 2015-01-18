/*interface Parameters {
    top: number;
    left: number;
    width: number;
    height: number;
    backgroundR: number;
    backgroundG: number;
    backgroundB: number;
    backgroundA: number;
    opacity: number;
    border?: string;
    zindex: number;   
    borderRadius: Array<number>; 
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    skewX: number;
    skewY: number;
    originX: number;
    originY: number;
}*/
interface Parameters {
    top: number;
    left: number;
    width: number;
    height: number;
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

    setDimensions(d: Dimensions);

    setBackground(c: rgba);

    setOpacity(o: number);

    setX(x: number);

    setY(y: number);

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