class Keyframe {
    //private _id: number;
    private _shape: Shape;
    private _timestamp: number;  //ms

    constructor(shape: Shape, timestamp: number) {
        this._shape = shape;
        this._timestamp = timestamp;
    }

    /*get id() {
        return this._id;
    }

    set id(id: number) {
        this._id = id;
    }*/

    get shape() {
        return this._shape;
    }

    get timestamp() {
        return this._timestamp;
    }
} 