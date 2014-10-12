class Layer
{
    static counter: number = 0;
    id: number;
    name: string;
    private _order: number = 0;

    constructor(name: string)
    {
        this.name = name;
        this.id = ++Layer.counter;
    }

    get order(): number {
        return this._order;
    }

    set order(order: number) {
        this._order = order;
    }

    toString() : string {
        return "ID: " + this.id + "Jmeno vrstvy: " + this.name + ", poradi: " + this.order;
    }
} 