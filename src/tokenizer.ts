function isDigit(c: string): boolean {
    return c >= '0' && c <= '9';
}

function isAlpha(c: string): boolean {
    c = c.toLowerCase();
    return c >= 'a' && c <= 'z';
}

function isOperator(c: string): boolean {
    return ['*', '+', '-', '/', '^', '!'].indexOf(c) > -1;
}

export type TokenResult = {
    done: false,
    error: null,
    type: 'number' | 'operator' | ')' | '(' | 'identifier',
    value: string,
    end: number
} | { done: false, error: Error } | { done: true };

function get_next_token(src: string, start: number): TokenResult {
    if (start >= src.length) return { done: true };

    let end = start;

    // skip whitespaces
    while (src[end] == ' ') end++;

    // number
    if (isDigit(src[end]) || end + 1 < src.length && src[end] == '.' && isDigit(src[end + 1])) {
        const begin = end;

        while (isDigit(src[end])) end++;

        if (src[end] == '.') {
            end++;
            while (isDigit(src[end])) end++;
        }

        return {
            done: false,
            error: null,
            type: 'number',
            value: src.substring(begin, end),
            end: end
        }
    }

    // identifier - alpha numeric
    if (isAlpha(src[end])) {
        const begin = end;
        while (end < src.length && (isAlpha(src[end]) || isDigit(src[end]))) {
            end++;
        }
        return {
            done: false,
            error: null,
            type: 'identifier',
            value: src.substring(begin, end),
            end: end
        }
    }

    // operator and parans
    if (isOperator(src[end])) {
        end++;
        return {
            done: false,
            error: null,
            type: 'operator',
            value: src.substring(end - 1, end),
            end: end
        }
    }

    if (src[end] == ')' || src[end] == '(') {
        return {
            done: false,
            error: null,
            type: src[end] as any,
            value: src[end],
            end: end + 1
        }
    }

    return { done: false, error: new Error(`invalid character '${src[end]}' at pos ${end + 1}`) };
}

function* tokenize(src: string) {
    let pos = 0;
    let token: TokenResult;

    while ((token = get_next_token(src, pos)) && !token.done) {
        if (token.error) {
            throw token.error;
        }

        yield token;
        pos = token.end;
    }
}

export { get_next_token, tokenize }