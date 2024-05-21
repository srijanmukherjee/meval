import { evaluate } from '../src/meval.js'
import assert from 'assert';

describe('mathematical expression evaluation', () => {
    it("addition", () => {
        assert(evaluate("1 + 2") === "3")
    })

    it("substraction", () => {
        assert(evaluate("12 - 9") === "3")
        assert(evaluate("8 - 12") === "-4")
    })

    it("addition + substraction", () => {
        assert(evaluate("1 + 2 - 4") === "-1")
    })

    it("multiplication", () => {
        assert(evaluate("2.5 * 2") === "5")
        assert(evaluate("2.5 * 2.5") === "6.25")
    })

    it("division", () => {
        assert(evaluate("5 / 10") === "0.5");
        assert(evaluate("5 / 0") === "Cannot divide by zero");
    })

    it("multiplication + division", () => {
        assert(evaluate("100 * 5 / 10 * 2.5") === "125")
    })

    it("invalid expressions", () => {
        const expressions = ["1+3*/", "*123", "2 5"]

        for (const expr of expressions) {
            let produced_error = false;
            try {
                evaluate(expr);
            } catch (err: any) {
                produced_error = true;
            }
            assert(produced_error);
        }
    })

    it("functions", () => {
        assert(evaluate("sin(PI/2)") == "1")
        assert(evaluate("log10(10)") == "1")
        assert(evaluate("log2(2)") == "1")
        assert(evaluate("ln(E)") == "1")
    })
    
    it("implicit multiplication", () => {
        assert(evaluate("2sin(PI/2)") == "2")
    })

    it("factorial", () => {
        assert(evaluate("5!") === "120")
        assert(evaluate("5! + 10") === "130")
        assert(evaluate("1000!") === "Infinity")
        assert(evaluate("-1000!") === "-Infinity")
    })
})