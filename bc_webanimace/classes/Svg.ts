﻿class Svg extends Shape {
    //private _src: XMLDocument;
    private _src: string;
    base64: string;

    constructor(params: Parameters, src: string) {
        super(params);
        this._src = src;
       var blob = new Blob([this.getSrc()], { type: 'image/svg+xml' });
        this.readFile(blob, (e) => {
            this.base64 = e.target.result;
        });
    }

    public getSrc(): string {
        //return new XMLSerializer().serializeToString(this._src.documentElement);
        //return this._src.documentElement.innerText;
        
        //return new XMLSerializer().serializeToString(this._src.documentElement);
        return this._src;
    }

    readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    }
}   