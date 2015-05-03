class TextField extends Shape {
    private _content: string;
    private color: rgb;
    private size: number;
    private family: string;

    constructor(params: Parameters, content: string, color: rgb, size: number, family: string) {
        super(params);
        this._content = content;
        this.color = color;
        this.size = size;
        this.family = family;
    }

    public getContent() {
        return this._content;
    }

    public getColor() {
        return this.color;
    }

    public getSize() {
        return this.size;
    }

    public getFamily() {
        return this.family;
    }

    public setFont(p: fontParameters) {
        this.color = p.color;
        this.size = p.size;
    }

    public setContent(text: string) {
        this._content = text;
    }

    public setFamily(family: string) {
        this.family = family;
    }
}