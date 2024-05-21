export function add(values: number[]): number {
    return values[0] + values[1];
}

export function minus(values: number[]): number {
    return values[0] - values[1];
}

export function multiply(values: number[]): number {
    return values[0] * values[1];
}

export function divide(values: number[]): number {
    if (values[1] === 0) {
        throw new Error("Cannot divide by zero");
    }
    return values[0] / values[1]
}

export function pow(values: number[]): number {
    return Math.pow(values[0], values[1]);
}

export function sin(values: number[]): number {
    return Math.sin(values[0]);
}

export function cos(values: number[]): number {
    return Math.cos(values[0]);
}

export function tan(values: number[]): number {
    return Math.tan(values[0]);
}

export function ln(values: number[]): number {
    return Math.log(values[0]);
}

export function log10(values: number[]): number {
    return Math.log10(values[0]);
}

export function log2(values: number[]): number {
    return Math.log2(values[0]);
}

export function arcsin(values: number[]): number {
    return Math.asin(values[0]);
}

export function arccos(values: number[]): number {
    return Math.acos(values[0]);
}

export function arctan(values: number[]): number {
    return Math.atan(values[0]);
}

export function sqrt(values: number[]): number {
    return Math.sqrt(values[0]);
}

export function factorial(values: number[]): number {
    let value = 1;
    const n = values[0];

    for (let i = 1; i <= n; i++) {
        if (value === Infinity)
            break;
        value *= i;
    }

    return value;
}

export function percentage(values: number[]): number {
    return values[0] / 100.0;
}