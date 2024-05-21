type TComputeFunc = (values: number[]) => number;

class Operator {
    private _nargs: number = 2;
    private _precedence: number = 0;
    private _associativity: 'left' | 'right' = 'left'
    private _isFunction: boolean = false;
    private _compute?: TComputeFunc;
    private _symbol: string;

    constructor(symbol: string, compute: TComputeFunc | undefined = undefined, nargs: number = 2, precedence: number = 0, associativity: 'left' | 'right' = 'left') {
        this._symbol = symbol;
        this._compute = compute;
        this._nargs = nargs;
        this._precedence = precedence;
        this._associativity = associativity;
    }

    compute(values: number[]): number {
        return this._compute!(values);
    }

    withPrecedence(precedence: number): Operator {
        this._precedence = precedence;
        return this;
    }

    withAssociativity(associativity: 'left' | 'right'): Operator {
        this._associativity = associativity;
        return this;
    }

    asFunction(nargs: number = 1): Operator {
        this._isFunction = true;
        this._nargs = 1;
        return this;
    }

    get symbol() {
        return this._symbol;
    }

    get precedence() {
        return this._precedence;
    }

    get nargs() {
        return this._nargs
    }

    get associativity() {
        return this._associativity;
    }

    get isFunction() {
        return this._isFunction;
    }
}

export { Operator }