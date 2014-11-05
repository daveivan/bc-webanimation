interface Parameters {
    top: number;
    left: number;
    width: number;
    height: number;
    //background: string;
    backgroundR: number;
    backgroundG: number;
    backgroundB: number;
    backgroundA: number;
    border?: string;
    zindex?: number;    
}

interface Pos {
    top: number;
    left: number;
}

interface Dimensions {
    width: number;
    height: number;
}

class Shape {
    private _parameters: Parameters;
    private _id;

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
}