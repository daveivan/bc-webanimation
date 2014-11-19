class Layer {
    static counter: number = 0;
    id: number;
    name: string;
    private _order: number = 0;
    private _keyframes: Array<Keyframe>;
    private _timestamps: Array<number>;

    constructor(name: string, fn: Bezier_points, shape: Shape = null) {
        this.name = name;
        this.id = ++Layer.counter;
        this._keyframes = new Array<Keyframe>();
        this._timestamps = new Array<number>();
        if (shape != null) {
            this._keyframes.push(new Keyframe(shape, 0, fn));
        }
    }

    get order(): number {
        return this._order;
    }

    set order(order: number) {
        this._order = order;
    }

    addKeyframe(shape: Shape, timestamp: number, timing_function: Bezier_points, index: number = null): Keyframe {
        var keyframe: Keyframe = new Keyframe(shape, timestamp, timing_function);
        if (index != null) {
            this._keyframes.splice(index, 0, keyframe);
        } else {
            this._keyframes.push(keyframe);
        }

        this._timestamps.push(keyframe.timestamp);
        this.sortTimestamps();
        return keyframe;
    }

    deleteKeyframe(index: number) {
        var keyframe: Keyframe = this.getKeyframe(index);
        //IE9<
        this._timestamps.splice(this._timestamps.indexOf(keyframe.timestamp), 1);
        this._keyframes.splice(index, 1);
    }

    getKeyframe(index: number): Keyframe {
        if (typeof this._keyframes[index] == 'undefined') {
            return null;
        } else {
            return this._keyframes[index];
        }
    }

    updatePosition(index: number, ms: number) {
        //if position is free
        if (this.getKeyframeByTimestamp(ms) == null) {
            this.getKeyframe(index).timestamp = ms;
            this._timestamps = [];
            this._keyframes.forEach((item: Keyframe, index: number) => {
                this._timestamps.push(item.timestamp);
            });
            this.sortTimestamps();
        }
    }

    getKeyframeByTimestamp(timestamp: number): Keyframe {
        var i: number = null;
        this._keyframes.forEach((item: Keyframe, index: number) => {
            if (item.timestamp == timestamp) {
                i = index;

            }
        });

        if (i == null) {
            return null;
        } else {
            return this._keyframes[i];   
        }
    }

    getAllKeyframes(): Array<Keyframe> {
        return this._keyframes;
    }

    sortTimestamps() {
        var tmp: Array<number> = this._timestamps.sort((n1, n2) => n1 - n2);
        this._timestamps = tmp;

    }

    get timestamps() {
        return this._timestamps;
    }

    toString() : string {
        return "ID: " + this.id + "Jmeno vrstvy: " + this.name + ", poradi: " + this.order;
    }
} 