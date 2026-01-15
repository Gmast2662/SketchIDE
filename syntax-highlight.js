// Syntax highlighting for ArtLang

class SyntaxHighlighter {
    constructor(editor, output) {
        this.editor = editor;
        this.output = output;
        this.setup();
    }

    setup() {
        // Make output match editor styling
        this.output.style.fontFamily = getComputedStyle(this.editor).fontFamily;
        this.output.style.fontSize = getComputedStyle(this.editor).fontSize;
        this.output.style.lineHeight = getComputedStyle(this.editor).lineHeight;
        this.output.style.padding = getComputedStyle(this.editor).padding;
        this.output.style.margin = getComputedStyle(this.editor).margin;
        this.output.style.border = 'none';
        this.output.style.outline = 'none';
        this.output.style.whiteSpace = 'pre-wrap';
        this.output.style.wordWrap = 'break-word';
        this.output.style.overflowWrap = 'break-word';
        this.output.style.background = 'transparent';
        this.output.style.color = 'transparent';
        this.output.style.caretColor = getComputedStyle(this.editor).color;
        this.output.style.zIndex = '1';
        this.output.setAttribute('spellcheck', 'false');
        this.output.setAttribute('contenteditable', 'false');
    }

    highlight(text) {
        // Keywords
        const keywords = ['function', 'end', 'if', 'then', 'else', 'elseif', 'for', 'while', 'do', 'return', 'and', 'or', 'not', 'true', 'false', 'nil'];
        
        // Built-in functions
        const functions = ['setup', 'draw', 'size', 'background', 'fill', 'stroke', 'noFill', 'noStroke', 'strokeWeight', 
                          'rect', 'ellipse', 'circle', 'line', 'point', 'triangle', 'text', 'textSize', 'push', 'pop',
                          'translate', 'rotate', 'scale', 'random', 'map', 'constrain', 'dist', 'lerp', 'cos', 'sin', 'tan',
                          'acos', 'asin', 'atan', 'atan2', 'sqrt', 'pow', 'abs', 'floor', 'ceil', 'round', 'min', 'max', 'print'];
        
        // Built-in variables
        const variables = ['width', 'height', 'mouseX', 'mouseY', 'pmouseX', 'pmouseY', 'mousePressed', 'keyPressed', 'key', 'frameCount', 'PI', 'TWO_PI', 'HALF_PI'];
        
        let highlighted = text;
        
        // Escape HTML
        highlighted = highlighted.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // Comments (-- ...)
        highlighted = highlighted.replace(/(--[^\n]*)/g, '<span class="hl-comment">$1</span>');
        
        // Strings (handle escaped quotes)
        highlighted = highlighted.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => {
            return '<span class="hl-string">' + match.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</span>';
        });
        
        // Numbers
        highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="hl-number">$1</span>');
        
        // Keywords
        keywords.forEach(kw => {
            const regex = new RegExp(`\\b(${kw})\\b`, 'g');
            highlighted = highlighted.replace(regex, '<span class="hl-keyword">$1</span>');
        });
        
        // Functions
        functions.forEach(fn => {
            const regex = new RegExp(`\\b(${fn})\\s*(?=\\()`, 'g');
            highlighted = highlighted.replace(regex, '<span class="hl-function">$1</span>');
        });
        
        // Variables
        variables.forEach(v => {
            const regex = new RegExp(`\\b(${v})\\b(?!\\s*\\()`, 'g');
            highlighted = highlighted.replace(regex, '<span class="hl-variable">$1</span>');
        });
        
        return highlighted;
    }

    update() {
        const text = this.editor.value;
        const highlighted = this.highlight(text);
        this.output.innerHTML = highlighted;
        
        // Sync scroll
        this.output.scrollTop = this.editor.scrollTop;
        this.output.scrollLeft = this.editor.scrollLeft;
    }

    syncScroll() {
        this.output.scrollTop = this.editor.scrollTop;
        this.output.scrollLeft = this.editor.scrollLeft;
    }
}

