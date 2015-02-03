class Svg extends Shape {
    private _src: XMLDocument;

    constructor(params: Parameters, src: XMLDocument) {
        super(params);
        this._src = src;
    }

    public getSrc(): string {
        return new XMLSerializer().serializeToString(this._src.documentElement);
        //return this._src.documentElement.innerText;
    }
}   