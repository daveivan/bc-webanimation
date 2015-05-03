class Img extends Shape {
    private _src: string;

    constructor(params: Parameters, src: string) {
        super(params);
        this._src = src;
    }

    public getSrc() {
        return this._src;
    }
}