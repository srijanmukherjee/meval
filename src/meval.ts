import { TokenResult, tokenize } from "./tokenizer"
import * as operator from './operators'
import { Operator } from "./operator";

const operators: { [key: string]: Operator } = {
    '+': new Operator('+', operator.add).withPrecedence(2),
    '-': new Operator('-', operator.minus).withPrecedence(2),
    '*': new Operator('*', operator.multiply).withPrecedence(3),
    '/': new Operator('/', operator.divide).withPrecedence(3),
    '^': new Operator('^', operator.pow).withPrecedence(4).withAssociativity('right'),
    'sin': new Operator('sin', operator.sin).asFunction(),
    'cos': new Operator('cos', operator.cos).asFunction(),
    'tan': new Operator('tan', operator.tan).asFunction(),
    'ln': new Operator('ln', operator.ln).asFunction(),
    'log2': new Operator('log2', operator.log2).asFunction(),
    'log10': new Operator('log10', operator.log10).asFunction(),
    'arcsin': new Operator('arcsin', operator.arcsin).asFunction(),
    'arccos': new Operator('arccos', operator.arccos).asFunction(),
    'arctan': new Operator('arctan', operator.arctan).asFunction(),
    'sqrt': new Operator('sqrt', operator.sqrt).asFunction(),
    '!': new Operator('!', operator.factorial, 1).withPrecedence(5),
} as const;

const constants: { [key: string]: Number } = {
    'PI': new Number(Math.PI),
    'E': new Number(Math.E)
} as const;

const OP_LEFT_PARAN = new Operator('(');

function operator_can_be_popped(opStack: Operator[], currentOp: string): boolean {
    if (opStack.length === 0) return false;
    const o1 = operators[currentOp];
    const o2 = opStack[opStack.length - 1];
    if (o2.symbol === '(') return false;
    return o2.precedence > o1.precedence || o2.precedence === o1.precedence && o1.associativity === 'left';
}

function evaluate(expression: string, strict: boolean = false): string {
    const outputQueue: (Number | Operator)[] = [];
    const opStack: Operator[] = [];
    let prevToken: TokenResult | null = null;

    for (const token of tokenize(expression)) {
        switch (token.type) {
            case 'number': {
                if (prevToken !== null && (prevToken.type === 'number' || prevToken.type === 'identifier' && prevToken.value in constants)) {
                    throw new Error(`expected an operator or a function after number but got ${token.value} instead`);
                }
                outputQueue.push(new Number(token.value));
                break;
            }
            case 'identifier': {
                if (token.value in constants) {
                    outputQueue.push(constants[token.value]);
                } else if (token.value in operators && operators[token.value].isFunction) {
                    // Implicit multiplication
                    // Eg. 2sin(PI/2) === 2*sin(PI/2)
                    if (prevToken && prevToken.type !== 'operator' && prevToken.type !== '(') {
                        opStack.push(operators['*']);
                    }
                    opStack.push(operators[token.value]);
                } else {
                    throw new Error(`unknown identifier '${token.value}'`);
                }
                break;
            }
            case 'operator': {
                if (!operators.hasOwnProperty(token.value)) {
                    throw new Error(`invalid operator ${token.value}`);
                }

                if (prevToken === null || prevToken.type === 'operator' && prevToken.value !== '!') {
                    if (token.value === '+' || token.value === '-') {
                        outputQueue.push(new Number(0));
                    } else {
                        throw new Error(`did not expect operator ${token.value} ` + (prevToken === null ? "at the start of expression" : `after ${prevToken.value}`));
                    }
                }

                while (operator_can_be_popped(opStack, token.value)) {
                    outputQueue.push(opStack.pop()!);
                }
                opStack.push(operators[token.value]);
                break;
            }
            case '(': {
                // Implicit multiplication
                // Eg. 2(3 + 4)
                if (prevToken !== null && (prevToken.type === 'number' || prevToken.type === ')' || prevToken.type === 'identifier' && prevToken.value in constants)) {
                    opStack.push(operators['*']);
                }
                opStack.push(OP_LEFT_PARAN);
                break;
            }
            case ')': {
                while (opStack.length > 0 && opStack[opStack.length - 1].symbol !== '(') {
                    outputQueue.push(opStack.pop()!);
                }
 
                if (opStack.length > 0 && opStack[opStack.length - 1].symbol == '(') {
                    opStack.pop();
                }

                if (opStack.length > 0) {
                    const tos = opStack[opStack.length - 1];
                    if (tos.isFunction) {
                        outputQueue.push(opStack.pop()!);
                    }
                }

                break;
            }
        }

        prevToken = token;
    }

    while (opStack.length > 0) {
        const tos = opStack.pop()!;
        if (tos.symbol === '(') {
            if (strict) {
                throw new Error("mismatch paranthesis");
            } else {
                continue
            }
        } 
        outputQueue.push(tos);
    }

    const valueStack: number[] = [];

    for (let i = 0; i < outputQueue.length; i++) {
        if (outputQueue[i] instanceof Number) {
            valueStack.push(outputQueue[i].valueOf() as number);
        } else {
            const operator = outputQueue[i] as Operator;
            if (valueStack.length < operator.nargs) {
                throw new Error("not enough arguemnts");
            }
            const values = valueStack.splice(valueStack.length - operator.nargs);
            try {
                valueStack.push(operator.compute(values));
            } catch (err: any) {
                return err.message;
            }
        }
    }

    if (valueStack.length !== 1) {
        throw new Error("value stack contains more than 1 value");
    }

    return valueStack[0].toString();
}

export { evaluate }