class Keyframe {
    //private _id: number;
    private _shape: IShape;
    private _timestamp: number;  //ms
    private _timing_function: Bezier_points;

    constructor(shape: IShape, timestamp: number, timing_function: Bezier_points) {
        this._shape = shape;
        this._timestamp = timestamp;
        this._timing_function = timing_function;
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

    set timestamp(ms: number) {
        this._timestamp = ms;
    }

    get timing_function() {
        return this._timing_function;
    }

    set timing_function(val: Bezier_points) {
        this._timing_function = val;
    }

    set shape(shape: IShape) {
        this._shape = shape;
    } 
} 