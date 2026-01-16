// Real-time code analyzer for error detection

interface CodeError {
  line: number;
  message: string;
  type: 'syntax' | 'unknown_function' | 'missing_closing';
}

// List of all available functions in the language
const AVAILABLE_FUNCTIONS = new Set([
  // Drawing functions
  'size', 'background', 'fill', 'stroke', 'strokeWeight', 'ellipse', 'rect', 'line', 
  'text', 'triangle', 'quad', 'arc', 'point',
  // Input/Output
  'print', 'input',
  // Math functions
  'random', 'map', 'constrain', 'dist', 'abs', 'sqrt', 'pow', 'sin', 'cos', 'tan',
  'floor', 'ceil', 'round', 'min', 'max',
  // List functions
  'createList', 'append', 'getLength', 'getItem', 'setItem',
  // Encryption
  'encrypt', 'decrypt',
  // Control
  'delay',
  // Input detection
  'keyPressed', 'keyClicked', 'keyHeld', 'mouseClicked', 'isKeyPressed', 
  'isLeftMouse', 'isRightMouse',
  // Button system
  'button', 'buttonClicked',
  // Variables (these are getters, not functions)
  'mouseX', 'mouseY', 'mousePressed', 'key', 'clickedKey', 'width', 'height',
  // Built-in JavaScript
  'Math', 'console', 'parseInt', 'parseFloat', 'String', 'Number',
]);

// List of known variable names (read-only)
const KNOWN_VARIABLES = new Set([
  'mouseX', 'mouseY', 'mousePressed', 'mouseClicked', 'keyPressed', 'keyClicked',
  'key', 'clickedKey', 'width', 'height', 'leftMouse', 'rightMouse', 'middleMouse',
]);

export function analyzeCode(code: string): CodeError[] {
  const errors: CodeError[] = [];
  const lines = code.split('\n');

  // Basic syntax checks
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('//')) continue;

    // Check for unmatched brackets
    const openBrackets = (line.match(/\(/g) || []).length;
    const closeBrackets = (line.match(/\)/g) || []).length;
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    const openSquare = (line.match(/\[/g) || []).length;
    const closeSquare = (line.match(/\]/g) || []).length;

    // Check for function calls with unknown functions
    // Match patterns like: functionName( or functionName ( or functionName(...)
    const functionCallRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    let match;
    const processedCalls = new Set<string>();
    
    while ((match = functionCallRegex.exec(line)) !== null) {
      const functionName = match[1];
      
      // Skip if already processed on this line
      if (processedCalls.has(functionName)) continue;
      processedCalls.add(functionName);
      
      // Check if it's in a comment
      const beforeMatch = line.substring(0, match.index);
      if (beforeMatch.includes('//')) continue;
      
      // Check if it's in a string
      let inString = false;
      let quoteChar = '';
      for (let j = 0; j < match.index; j++) {
        const char = line[j];
        if ((char === '"' || char === "'") && (j === 0 || line[j - 1] !== '\\')) {
          if (!inString) {
            inString = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inString = false;
          }
        }
      }
      if (inString) continue;
      
      // Skip known keywords and control structures
      const keywords = ['if', 'for', 'while', 'return', 'let', 'const', 'var', 'function', 'async', 'await'];
      if (keywords.includes(functionName)) continue;
      
      // Skip if it's a known variable (variables can't be called as functions)
      if (KNOWN_VARIABLES.has(functionName)) continue;
      
      // Check if function is known
      if (!AVAILABLE_FUNCTIONS.has(functionName)) {
        errors.push({
          line: lineNum,
          message: `Unknown function: ${functionName}`,
          type: 'unknown_function',
        });
      }
    }
  }

  // Check for unmatched closing brackets (basic check)
  let bracketCount = 0;
  let braceCount = 0;
  let squareCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Skip comments
    const commentIndex = line.indexOf('//');
    const codeLine = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
    
    // Count brackets (simple count, not perfect but good enough)
    bracketCount += (codeLine.match(/\(/g) || []).length;
    bracketCount -= (codeLine.match(/\)/g) || []).length;
    braceCount += (codeLine.match(/\{/g) || []).length;
    braceCount -= (codeLine.match(/\}/g) || []).length;
    squareCount += (codeLine.match(/\[/g) || []).length;
    squareCount -= (codeLine.match(/\]/g) || []).length;
    
    // Report errors on the line where mismatch becomes clear
    if (bracketCount < 0 && i > 0) {
      errors.push({
        line: lineNum,
        message: 'Unexpected closing parenthesis',
        type: 'syntax',
      });
      bracketCount = 0; // Reset to avoid multiple errors
    }
    if (braceCount < 0 && i > 0) {
      errors.push({
        line: lineNum,
        message: 'Unexpected closing brace',
        type: 'syntax',
      });
      braceCount = 0;
    }
    if (squareCount < 0 && i > 0) {
      errors.push({
        line: lineNum,
        message: 'Unexpected closing bracket',
        type: 'syntax',
      });
      squareCount = 0;
    }
  }

  return errors;
}
