enum Mode {
    SELECT,
    CREATE_DIV,
    IMAGE,
    TEXT,
    SVG,
    LOAD,
}

enum Type {
    DIV,
    TEXT,
    SVG,
    IMAGE
}

enum Animation_playing {
    PLAY,
    STOP,
    PAUSE,
}

interface _2d {
    x: number;
    y: number;
}

interface _3d extends _2d{
    z: number;
}

interface Pos {
    top: number;
    left: number;
}

interface Dimensions {
    width: number;
    height: number;
}

interface Bezier_points {
    p0: number;
    p1: number;
    p2: number;
    p3: number;
}

interface repeatParams {
    width: boolean;
    height: boolean;
    top: boolean;
    left: boolean;
    bg: boolean;
    opacity: boolean;
    radius: boolean;
    rotate: boolean;
    skew: boolean;
    origin: boolean;
}

interface repeatTextParams {
    size: boolean;
    color: boolean;
}

interface rgb {
    r: number;
    g: number;
    b: number;
}

interface rgba extends rgb {
    a: number;
}

interface fontParameters {
    fontFamily: string;
    color: rgb;
    size: number;
}

interface keyframeFrom {
    layer: number;
    keyframe: number;
}