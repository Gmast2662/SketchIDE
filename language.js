// ArtLang - A Lua-like language with Processing-like graphics

class ArtLangInterpreter {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.variables = {};
        this.functions = {};
        this.isRunning = false;
        this.animationId = null;
        
        // Processing-like variables
        this.width = canvas.width;
        this.height = canvas.height;
        this.mouseX = 0;
        this.mouseY = 0;
        this.pmouseX = 0;
        this.pmouseY = 0;
        this.mousePressed = false;
        this.keyPressed = false;
        this.key = '';
        this.frameCount = 0;
        
        // Setup built-in functions
        this.setupBuiltins();
    }

    setupBuiltins() {
        // Canvas setup
        this.functions['size'] = (w, h) => {
            this.canvas.width = w;
            this.canvas.height = h;
            this.width = w;
            this.height = h;
            this.variables.width = w;
            this.variables.height = h;
        };

        // Graphics functions
        this.functions['background'] = (r, g, b) => {
            const color = this.parseColor(r, g, b);
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, this.width, this.height);
        };

        this.functions['fill'] = (r, g, b, a) => {
            const color = this.parseColor(r, g, b, a);
            this.ctx.fillStyle = color;
        };

        this.functions['stroke'] = (r, g, b, a) => {
            const color = this.parseColor(r, g, b, a);
            this.ctx.strokeStyle = color;
        };

        this.functions['noFill'] = () => {
            this.ctx.fillStyle = 'transparent';
        };

        this.functions['noStroke'] = () => {
            this.ctx.strokeStyle = 'transparent';
        };

        this.functions['strokeWeight'] = (w) => {
            this.ctx.lineWidth = w || 1;
        };

        this.functions['rect'] = (x, y, w, h) => {
            this.ctx.fillRect(x, y, w, h);
            this.ctx.strokeRect(x, y, w, h);
        };

        this.functions['ellipse'] = (x, y, w, h) => {
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, w/2, h/2, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        };

        // Processing-style ellipse (width and height are diameters)
        this.functions['ellipseMode'] = (mode) => {
            // For now, we use CENTER mode by default
            // Could implement CORNER, CORNERS, RADIUS modes later
        };

        this.functions['circle'] = (x, y, r) => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        };

        this.functions['line'] = (x1, y1, x2, y2) => {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        };

        this.functions['point'] = (x, y) => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        };

        this.functions['triangle'] = (x1, y1, x2, y2, x3, y3) => {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineTo(x3, y3);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        };

        this.functions['text'] = (str, x, y) => {
            this.ctx.fillText(String(str), x, y);
        };

        this.functions['textSize'] = (size) => {
            this.ctx.font = `${size}px sans-serif`;
        };

        this.functions['push'] = () => {
            this.ctx.save();
        };

        this.functions['pop'] = () => {
            this.ctx.restore();
        };

        this.functions['translate'] = (x, y) => {
            this.ctx.translate(x, y);
        };

        this.functions['rotate'] = (angle) => {
            this.ctx.rotate(angle);
        };

        this.functions['scale'] = (x, y) => {
            this.ctx.scale(x, y || x);
        };

        // Math functions
        this.functions['random'] = (min, max) => {
            if (max === undefined) {
                return Math.random() * min;
            }
            return Math.random() * (max - min) + min;
        };

        this.functions['map'] = (value, start1, stop1, start2, stop2) => {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        };

        this.functions['constrain'] = (value, min, max) => {
            return Math.max(min, Math.min(max, value));
        };

        this.functions['dist'] = (x1, y1, x2, y2) => {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        };

        this.functions['lerp'] = (start, stop, amt) => {
            return start + (stop - start) * amt;
        };

        // Utility functions
        this.functions['print'] = (...args) => {
            console.log(...args);
        };

        // Math functions
        this.functions['cos'] = (angle) => Math.cos(angle);
        this.functions['sin'] = (angle) => Math.sin(angle);
        this.functions['tan'] = (angle) => Math.tan(angle);
        this.functions['acos'] = (value) => Math.acos(value);
        this.functions['asin'] = (value) => Math.asin(value);
        this.functions['atan'] = (value) => Math.atan(value);
        this.functions['atan2'] = (y, x) => Math.atan2(y, x);
        this.functions['sqrt'] = (value) => Math.sqrt(value);
        this.functions['pow'] = (base, exp) => Math.pow(base, exp);
        this.functions['abs'] = (value) => Math.abs(value);
        this.functions['floor'] = (value) => Math.floor(value);
        this.functions['ceil'] = (value) => Math.ceil(value);
        this.functions['round'] = (value) => Math.round(value);
        this.functions['min'] = (a, b) => Math.min(a, b);
        this.functions['max'] = (a, b) => Math.max(a, b);

        // Processing variables (read-only in code, but settable by system)
        this.variables['width'] = this.width;
        this.variables['height'] = this.height;
        this.variables['PI'] = Math.PI;
        this.variables['TWO_PI'] = Math.PI * 2;
        this.variables['HALF_PI'] = Math.PI / 2;
    }

    parseColor(r, g, b, a) {
        if (g === undefined) {
            // Grayscale
            return `rgb(${r}, ${r}, ${r})`;
        }
        if (a === undefined) {
            return `rgb(${r}, ${g}, ${b})`;
        }
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    parse(code) {
        // Simple tokenizer and parser for Lua-like syntax
        const tokens = this.tokenize(code);
        return this.parseTokens(tokens);
    }

    tokenize(code) {
        const tokens = [];
        let i = 0;
        
        const skipWhitespace = () => {
            while (i < code.length && /\s/.test(code[i])) i++;
        };

        const readNumber = () => {
            let num = '';
            while (i < code.length && /[\d.]/.test(code[i])) {
                num += code[i++];
            }
            return parseFloat(num);
        };

        const readString = () => {
            const quote = code[i++];
            let str = '';
            while (i < code.length && code[i] !== quote) {
                if (code[i] === '\\') {
                    i++;
                    if (code[i] === 'n') str += '\n';
                    else if (code[i] === 't') str += '\t';
                    else str += code[i];
                } else {
                    str += code[i];
                }
                i++;
            }
            i++; // skip closing quote
            return str;
        };

        const readIdentifier = () => {
            let id = '';
            while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
                id += code[i++];
            }
            return id;
        };

        while (i < code.length) {
            skipWhitespace();
            if (i >= code.length) break;

            const char = code[i];

            if (char === '-' && code[i + 1] === '-') {
                // Comment
                i += 2;
                while (i < code.length && code[i] !== '\n') i++;
                continue;
            }

            if (char === '"' || char === "'") {
                tokens.push({ type: 'string', value: readString() });
                continue;
            }

            if (/\d/.test(char)) {
                tokens.push({ type: 'number', value: readNumber() });
                continue;
            }

            if (/[a-zA-Z_]/.test(char)) {
                const id = readIdentifier();
                const keywords = ['function', 'end', 'if', 'then', 'else', 'elseif', 'for', 'while', 'do', 'return', 'and', 'or', 'not', 'true', 'false', 'nil'];
                if (keywords.includes(id)) {
                    tokens.push({ type: 'keyword', value: id });
                } else {
                    tokens.push({ type: 'identifier', value: id });
                }
                continue;
            }

            // Operators and punctuation
            const operators = {
                '=': 'assign',
                '+': 'plus',
                '-': 'minus',
                '*': 'multiply',
                '/': 'divide',
                '%': 'modulo',
                '^': 'power',
                '(': 'lparen',
                ')': 'rparen',
                '{': 'lbrace',
                '}': 'rbrace',
                '[': 'lbracket',
                ']': 'rbracket',
                ',': 'comma',
                '.': 'dot',
                ':': 'colon',
                ';': 'semicolon',
                '<': 'lt',
                '>': 'gt',
                '==': 'eq',
                '~=': 'ne',
                '<=': 'le',
                '>=': 'ge',
            };

            if (i < code.length - 1) {
                const twoChar = code.substr(i, 2);
                if (operators[twoChar]) {
                    tokens.push({ type: operators[twoChar], value: twoChar });
                    i += 2;
                    continue;
                }
            }

            if (operators[char]) {
                tokens.push({ type: operators[char], value: char });
                i++;
                continue;
            }

            i++;
        }

        return tokens;
    }

    parseTokens(tokens) {
        let i = 0;
        const statements = [];

        const peek = () => tokens[i];
        const consume = (type) => {
            if (tokens[i]?.type === type) {
                return tokens[i++];
            }
            throw new Error(`Expected ${type}, got ${tokens[i]?.type}`);
        };

        const parseExpression = () => {
            return parseLogicalOr();
        };

        const parseLogicalOr = () => {
            let left = parseLogicalAnd();
            while (peek()?.type === 'or') {
                i++;
                const right = parseLogicalAnd();
                left = { type: 'binary', op: '||', left, right };
            }
            return left;
        };

        const parseLogicalAnd = () => {
            let left = parseComparison();
            while (peek()?.type === 'and') {
                i++;
                const right = parseComparison();
                left = { type: 'binary', op: '&&', left, right };
            }
            return left;
        };

        const parseComparison = () => {
            let left = parseAdditive();
            const ops = ['eq', 'ne', 'lt', 'gt', 'le', 'ge'];
            while (ops.includes(peek()?.type)) {
                const op = tokens[i++].type;
                const right = parseAdditive();
                left = { type: 'binary', op, left, right };
            }
            return left;
        };

        const parseAdditive = () => {
            let left = parseMultiplicative();
            while (peek()?.type === 'plus' || peek()?.type === 'minus') {
                const op = tokens[i++].type;
                const right = parseMultiplicative();
                left = { type: 'binary', op, left, right };
            }
            return left;
        };

        const parseMultiplicative = () => {
            let left = parseUnary();
            while (peek()?.type === 'multiply' || peek()?.type === 'divide' || peek()?.type === 'modulo') {
                const op = tokens[i++].type;
                const right = parseUnary();
                left = { type: 'binary', op, left, right };
            }
            return left;
        };

        const parseUnary = () => {
            if (peek()?.type === 'minus') {
                i++;
                return { type: 'unary', op: 'neg', expr: parseUnary() };
            }
            if (peek()?.type === 'not') {
                i++;
                return { type: 'unary', op: '!', expr: parseUnary() };
            }
            return parsePrimary();
        };

        const parsePrimary = () => {
            const token = peek();
            if (!token) throw new Error('Unexpected end of input');

            if (token.type === 'number') {
                i++;
                return { type: 'literal', value: token.value };
            }
            if (token.type === 'string') {
                i++;
                return { type: 'literal', value: token.value };
            }
            if (token.type === 'keyword' && (token.value === 'true' || token.value === 'false' || token.value === 'nil')) {
                i++;
                return { type: 'literal', value: token.value === 'true' ? true : token.value === 'false' ? false : null };
            }
            if (token.type === 'identifier') {
                const id = token.value;
                i++;
                // Check for member access (e.g., math.cos)
                if (peek()?.type === 'dot') {
                    i++;
                    const member = peek();
                    if (member?.type === 'identifier') {
                        i++;
                        if (peek()?.type === 'lparen') {
                            // Method call (e.g., math.cos(...))
                            i++;
                            const args = [];
                            if (peek()?.type !== 'rparen') {
                                args.push(parseExpression());
                                while (peek()?.type === 'comma') {
                                    i++;
                                    args.push(parseExpression());
                                }
                            }
                            consume('rparen');
                            return { type: 'call', name: `${id}.${member.value}`, args };
                        }
                        // Member access (variable)
                        return { type: 'variable', name: `${id}.${member.value}` };
                    }
                }
                if (peek()?.type === 'lparen') {
                    // Function call
                    i++;
                    const args = [];
                    if (peek()?.type !== 'rparen') {
                        args.push(parseExpression());
                        while (peek()?.type === 'comma') {
                            i++;
                            args.push(parseExpression());
                        }
                    }
                    consume('rparen');
                    return { type: 'call', name: id, args };
                }
                return { type: 'variable', name: id };
            }
            if (token.type === 'lparen') {
                i++;
                const expr = parseExpression();
                consume('rparen');
                return expr;
            }

            throw new Error(`Unexpected token: ${token.type}`);
        };

        const parseStatement = () => {
            const token = peek();
            if (!token) return null;

            if (token.type === 'keyword' && token.value === 'function') {
                i++;
                const name = consume('identifier').value;
                consume('lparen');
                const params = [];
                if (peek()?.type !== 'rparen') {
                    params.push(consume('identifier').value);
                    while (peek()?.type === 'comma') {
                        i++;
                        params.push(consume('identifier').value);
                    }
                }
                consume('rparen');
                const body = [];
                while (peek() && (peek().type !== 'keyword' || peek().value !== 'end')) {
                    body.push(parseStatement());
                }
                consume('keyword');
                return { type: 'function', name, params, body };
            }

            if (token.type === 'keyword' && token.value === 'if') {
                i++;
                const condition = parseExpression();
                if (peek()?.type === 'keyword' && peek().value === 'then') i++;
                const thenBody = [];
                while (peek() && peek().type !== 'keyword' || (peek().value !== 'else' && peek().value !== 'elseif' && peek().value !== 'end')) {
                    thenBody.push(parseStatement());
                }
                let elseBody = null;
                if (peek()?.type === 'keyword' && peek().value === 'elseif') {
                    i++;
                    elseBody = [parseStatement()];
                } else if (peek()?.type === 'keyword' && peek().value === 'else') {
                    i++;
                    elseBody = [];
                    while (peek() && peek().type !== 'keyword' || peek().value !== 'end') {
                        elseBody.push(parseStatement() || { type: 'empty' });
                    }
                }
                consume('keyword');
                return { type: 'if', condition, then: thenBody, else: elseBody };
            }

            if (token.type === 'keyword' && token.value === 'for') {
                i++;
                const varName = consume('identifier').value;
                consume('assign');
                const start = parseExpression();
                consume('comma');
                const end = parseExpression();
                const step = peek()?.type === 'comma' ? (i++, parseExpression()) : { type: 'literal', value: 1 };
                const body = [];
                while (peek() && peek().type !== 'keyword' || peek().value !== 'end') {
                    body.push(parseStatement());
                }
                consume('keyword');
                return { type: 'for', var: varName, start, end, step, body };
            }

            if (token.type === 'keyword' && token.value === 'while') {
                i++;
                const condition = parseExpression();
                if (peek()?.type === 'keyword' && peek().value === 'do') i++;
                const body = [];
                while (peek() && peek().type !== 'keyword' || peek().value !== 'end') {
                    body.push(parseStatement());
                }
                consume('keyword');
                return { type: 'while', condition, body };
            }

            if (token.type === 'keyword' && token.value === 'return') {
                i++;
                const expr = peek() ? parseExpression() : null;
                return { type: 'return', expr };
            }

            // Assignment or expression statement (variables are global by default - no "local" needed)
            if (token.type === 'identifier') {
                const name = token.value;
                i++;
                if (peek()?.type === 'assign') {
                    i++;
                    const value = parseExpression();
                    return { type: 'assign', name, value };
                }
                // Function call statement
                if (peek()?.type === 'lparen') {
                    i++;
                    const args = [];
                    if (peek()?.type !== 'rparen') {
                        args.push(parseExpression());
                        while (peek()?.type === 'comma') {
                            i++;
                            args.push(parseExpression());
                        }
                    }
                    consume('rparen');
                    return { type: 'call', name, args };
                }
                // Put back the identifier
                i--;
            }

            // Expression statement
            const expr = parseExpression();
            return { type: 'expr', expr };
        };

        while (i < tokens.length) {
            const stmt = parseStatement();
            if (stmt) statements.push(stmt);
        }

        return statements;
    }

    execute(ast) {
        this.variables = { ...this.variables };
        this.frameCount = 0;

        // Find setup and draw functions
        let setupFunc = null;
        let drawFunc = null;
        const otherStatements = [];

        for (const stmt of ast) {
            if (stmt.type === 'function') {
                if (stmt.name === 'setup') {
                    setupFunc = stmt;
                } else if (stmt.name === 'draw') {
                    drawFunc = stmt;
                } else {
                    this.functions[stmt.name] = stmt;
                }
            } else {
                otherStatements.push(stmt);
            }
        }

        // Execute top-level statements
        for (const stmt of otherStatements) {
            this.executeStatement(stmt);
        }

        // Execute setup
        if (setupFunc) {
            this.executeFunction(setupFunc, []);
        }

        // Execute draw in loop
        if (drawFunc) {
            const drawLoop = () => {
                if (!this.isRunning) return;
                this.frameCount++;
                this.pmouseX = this.mouseX;
                this.pmouseY = this.mouseY;
                try {
                    this.executeFunction(drawFunc, []);
                } catch (error) {
                    this.isRunning = false;
                    this.updateStatus(`Error: ${error.message}`);
                    throw error;
                }
                if (this.isRunning) {
                    this.animationId = requestAnimationFrame(drawLoop);
                }
            };
            drawLoop();
        } else {
            // If no draw function, just execute once
            this.updateStatus('Executed (no draw loop)');
        }
    }

    executeStatement(stmt) {
        if (!stmt) return null;

        switch (stmt.type) {
            case 'assign':
                this.variables[stmt.name] = this.evaluate(stmt.value);
                return null;
            case 'call':
                return this.callFunction(stmt.name, stmt.args);
            case 'expr':
                return this.evaluate(stmt.expr);
            case 'if':
                const condition = this.evaluate(stmt.condition);
                if (condition) {
                    for (const s of stmt.then) {
                        this.executeStatement(s);
                    }
                } else if (stmt.else) {
                    for (const s of stmt.else) {
                        this.executeStatement(s);
                    }
                }
                return null;
            case 'for':
                const start = this.evaluate(stmt.start);
                const end = this.evaluate(stmt.end);
                const step = this.evaluate(stmt.step);
                for (let i = start; i <= end; i += step) {
                    this.variables[stmt.var] = i;
                    for (const s of stmt.body) {
                        this.executeStatement(s);
                    }
                }
                return null;
            case 'while':
                while (this.evaluate(stmt.condition)) {
                    for (const s of stmt.body) {
                        this.executeStatement(s);
                    }
                }
                return null;
            case 'return':
                return this.evaluate(stmt.expr);
            default:
                return null;
        }
    }

    executeFunction(func, args) {
        const oldVars = { ...this.variables };
        for (let i = 0; i < func.params.length; i++) {
            this.variables[func.params[i]] = args[i] !== undefined ? args[i] : null;
        }
        let result = null;
        for (const stmt of func.body) {
            result = this.executeStatement(stmt);
            if (result !== null) break; // Return statement
        }
        this.variables = oldVars;
        return result;
    }

    callFunction(name, args) {
        const evaluatedArgs = args.map(arg => this.evaluate(arg));
        
        // Handle math.* function calls
        if (name.startsWith('math.')) {
            const mathFunc = name.substring(5);
            if (this.functions[mathFunc]) {
                return this.functions[mathFunc](...evaluatedArgs);
            }
            throw new Error(`Math function '${mathFunc}' is not defined`);
        }
        
        if (this.functions[name]) {
            const func = this.functions[name];
            if (func.params) {
                // User-defined function
                return this.executeFunction(func, evaluatedArgs);
            } else {
                // Built-in function
                return func(...evaluatedArgs);
            }
        }
        
        throw new Error(`Function '${name}' is not defined`);
    }

    evaluate(expr) {
        if (!expr) return null;

        switch (expr.type) {
            case 'literal':
                return expr.value;
            case 'variable':
                if (expr.name === 'width') return this.width;
                if (expr.name === 'height') return this.height;
                if (expr.name === 'mouseX') return this.mouseX;
                if (expr.name === 'mouseY') return this.mouseY;
                if (expr.name === 'pmouseX') return this.pmouseX;
                if (expr.name === 'pmouseY') return this.pmouseY;
                if (expr.name === 'mousePressed') return this.mousePressed;
                if (expr.name === 'keyPressed') return this.keyPressed;
                if (expr.name === 'key') return this.key;
                if (expr.name === 'frameCount') return this.frameCount;
                if (expr.name === 'PI') return Math.PI;
                if (expr.name === 'TWO_PI') return Math.PI * 2;
                if (expr.name === 'HALF_PI') return Math.PI / 2;
                return this.variables[expr.name];
            case 'call':
                return this.callFunction(expr.name, expr.args);
            case 'binary':
                const left = this.evaluate(expr.left);
                const right = this.evaluate(expr.right);
                switch (expr.op) {
                    case 'plus': return left + right;
                    case 'minus': return left - right;
                    case 'multiply': return left * right;
                    case 'divide': return left / right;
                    case 'modulo': return left % right;
                    case 'power': return Math.pow(left, right);
                    case 'eq': return left == right;
                    case 'ne': return left != right;
                    case 'lt': return left < right;
                    case 'gt': return left > right;
                    case 'le': return left <= right;
                    case 'ge': return left >= right;
                    case '||': return left || right;
                    case '&&': return left && right;
                }
                break;
            case 'unary':
                const val = this.evaluate(expr.expr);
                if (expr.op === 'neg') return -val;
                if (expr.op === '!') return !val;
                break;
        }
        return null;
    }

    updateStatus(message) {
        // This will be set by the IDE
        if (this.onStatusUpdate) {
            this.onStatusUpdate(message);
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    run(code) {
        this.stop();
        this.isRunning = true;
        
        // Reset canvas context
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Reset default styles
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.font = '12px sans-serif';
        this.ctx.textBaseline = 'top';
        
        try {
            console.log('Parsing code...');
            const ast = this.parse(code);
            console.log('AST:', ast);
            console.log('Executing...');
            this.execute(ast);
            this.updateStatus('Running');
        } catch (error) {
            this.updateStatus(`Error: ${error.message}`);
            console.error('Execution error:', error);
            console.error('Error stack:', error.stack);
            this.isRunning = false;
            throw error; // Re-throw so IDE can handle it
        }
    }

    updateMouse(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }

    setMousePressed(pressed) {
        this.mousePressed = pressed;
    }

    setKeyPressed(pressed, key) {
        this.keyPressed = pressed;
        this.key = key;
    }
}

