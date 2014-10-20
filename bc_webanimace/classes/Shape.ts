interface Parameters {
    top: number;
    left: number;
    width: number;
    height: number;
    background: string;
    border?: string;
    zindex?: number;    
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
}