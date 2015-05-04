class Svg extends Shape {
    private _src: string = null;
    base64: string = null;

    constructor(params: Parameters, src: string = null) {
        super(params);
        this._src = src;
        if (src != null) {
            var blob = new Blob([this.getSrc()], { type: 'image/svg+xml' });
            this.readFile(blob, (e) => {
                this.base64 = e.target.result;
            });   
        }
    }

    public getSrc(): string {
        return this._src;
    }

    public setSrc(src: string, base64: string) {
        this._src = src;
        this.base64 = base64;
    }

    readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    }
}