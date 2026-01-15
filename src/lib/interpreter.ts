
// Custom language interpreter for the coding environment

interface InterpreterContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  print: (message: string) => void;
  input: (prompt: string) => string | null;
  requestStop: () => boolean;
  onResize?: (width: number, height: number) => void;
}

export class CodeInterpreter {
  private context: InterpreterContext;
  private animationId: number | null = null;
  private loopFunction: (() => void) | null = null;
  private stopRequested = false;

  constructor(context: InterpreterContext) {
    this.context = context;
  }

  stop(): void {
    this.stopRequested = true;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.loopFunction = null;
    // Cleanup event listeners
    if ((this as any).cleanup) {
      (this as any).cleanup();
      (this as any).cleanup = null;
    }
  }

  execute(code: string): void {
    this.stop();
    this.stopRequested = false;

    try {
      const { ctx, canvas, print, input } = this.context;
      
      // Reset canvas to default size and clear
      const defaultWidth = 400;
      const defaultHeight = 300;
      canvas.width = defaultWidth;
      canvas.height = defaultHeight;
      if (this.context.onResize) {
        this.context.onResize(defaultWidth, defaultHeight);
      }
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, defaultWidth, defaultHeight);
      
      // Current drawing state
      let currentFillColor = 'black';
      let currentStrokeColor = 'black';
      let currentStrokeWeight = 1;

      // Size function to change canvas dimensions
      const size = (w: number, h: number) => {
        canvas.width = w;
        canvas.height = h;
        if (this.context.onResize) {
          this.context.onResize(w, h);
        }
        // Clear canvas after resize
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
      };

      // Drawing functions
      const background = (r: number, g: number = r, b: number = r, a: number = 1) => {
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      const fill = (r: number, g: number = r, b: number = r, a: number = 1) => {
        currentFillColor = `rgba(${r}, ${g}, ${b}, ${a})`;
      };

      const stroke = (r: number, g: number = r, b: number = r) => {
        currentStrokeColor = `rgb(${r}, ${g}, ${b})`;
      };

      const strokeWeight = (weight: number) => {
        currentStrokeWeight = weight;
      };

      const ellipse = (x: number, y: number, w: number, h: number = w) => {
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = currentFillColor;
        ctx.fill();
      };

      const rect = (x: number, y: number, w: number, h: number) => {
        ctx.fillStyle = currentFillColor;
        ctx.fillRect(x, y, w, h);
      };

      const line = (x1: number, y1: number, x2: number, y2: number) => {
        ctx.strokeStyle = currentStrokeColor;
        ctx.lineWidth = currentStrokeWeight;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      const text = (str: string, x: number, y: number, size: number = 16) => {
        ctx.font = `${size}px Monaco, monospace`;
        ctx.fillStyle = currentFillColor;
        ctx.fillText(str.toString(), x, y);
      };

      const random = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const triangle = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fillStyle = currentFillColor;
        ctx.fill();
      };

      const quad = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.fillStyle = currentFillColor;
        ctx.fill();
      };

      const arc = (x: number, y: number, w: number, h: number, start: number, stop: number) => {
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, 0, start, stop);
        ctx.strokeStyle = currentStrokeColor;
        ctx.lineWidth = currentStrokeWeight;
        ctx.stroke();
      };

      const point = (x: number, y: number) => {
        ctx.fillStyle = currentStrokeColor;
        ctx.fillRect(x, y, 1, 1);
      };

      const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
        return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
      };

      const constrain = (value: number, min: number, max: number) => {
        return Math.max(min, Math.min(max, value));
      };

      const dist = (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      };

      const abs = Math.abs;
      const sqrt = Math.sqrt;
      const pow = Math.pow;
      const sin = Math.sin;
      const cos = Math.cos;
      const tan = Math.tan;
      const floor = Math.floor;
      const ceil = Math.ceil;
      const round = Math.round;
      const min = Math.min;
      const max = Math.max;

      // Array/List functions - beginner-friendly
      const createList = (...items: any[]) => {
        // Creates a new array/list with the given items
        // Example: createList(1, 2, 3) returns [1, 2, 3]
        return [...items];
      };

      const append = (target: any[] | any, item: any) => {
        // Works with arrays: append(list, item) adds item to list
        // Works with objects: append(obj, {key: value}) adds property to object
        if (Array.isArray(target)) {
          target.push(item);
          return target;
        } else if (typeof target === 'object' && target !== null) {
          // For objects, merge the item into the object
          if (typeof item === 'object' && item !== null) {
            Object.assign(target, item);
          } else {
            // If item is not an object, can't append to object
            throw new Error('Cannot append non-object to object. Use object syntax: obj.key = value');
          }
          return target;
        } else {
          throw new Error('append() only works with arrays [] or objects {}');
        }
      };

      const getLength = (list: any[]) => {
        return list.length;
      };

      const getItem = (list: any[], index: number) => {
        if (index < 0 || index >= list.length) {
          throw new Error(`Index ${index} is out of bounds. List has ${list.length} items.`);
        }
        return list[index];
      };

      const setItem = (target: any[] | any, indexOrKey: number | string, value: any) => {
        // Works with arrays: setItem(list, index, value) sets list[index] = value
        // Works with objects: setItem(obj, "key", value) sets obj.key = value
        if (Array.isArray(target)) {
          const index = indexOrKey as number;
          if (index < 0 || index >= target.length) {
            throw new Error(`Index ${index} is out of bounds. List has ${target.length} items.`);
          }
          target[index] = value;
          return target;
        } else if (typeof target === 'object' && target !== null) {
          // For objects, use the key
          const key = String(indexOrKey);
          (target as any)[key] = value;
          return target;
        } else {
          throw new Error('setItem() only works with arrays [] or objects {}');
        }
      };

      // Encryption function - reversible encryption
      const encrypt = (data: any): string => {
        // Convert data to string
        const str = String(data);
        
        // Generate a random salt for this encryption
        const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const timestamp = Date.now();
        
        // Create encryption key from salt and timestamp (not from data, so it's reversible)
        const key = salt + timestamp.toString(36) + 'SECRET_KEY_2024';
        
        // XOR cipher with key rotation (XOR is reversible)
        let encoded = '';
        for (let i = 0; i < str.length; i++) {
          const charCode = str.charCodeAt(i);
          const keyChar = key.charCodeAt(i % key.length);
          // XOR with key and position-based scrambling
          const encrypted = charCode ^ keyChar ^ (i * 7 + 13);
          encoded += String.fromCharCode(encrypted);
        }
        
        // Base64-like encoding with custom alphabet
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let base64 = '';
        for (let i = 0; i < encoded.length; i += 3) {
          const a = encoded.charCodeAt(i);
          const b = i + 1 < encoded.length ? encoded.charCodeAt(i + 1) : 0;
          const c = i + 2 < encoded.length ? encoded.charCodeAt(i + 2) : 0;
          
          const bitmap = (a << 16) | (b << 8) | c;
          base64 += alphabet.charAt((bitmap >> 18) & 63);
          base64 += alphabet.charAt((bitmap >> 12) & 63);
          base64 += i + 1 < encoded.length ? alphabet.charAt((bitmap >> 6) & 63) : '=';
          base64 += i + 2 < encoded.length ? alphabet.charAt(bitmap & 63) : '=';
        }
        
        // Add salt and timestamp to the output (encoded) - needed for decryption
        const saltEncoded = btoa(salt).replace(/[+/=]/g, (m) => ({'+': '-', '/': '_', '=': ''})[m] || '');
        const timeEncoded = timestamp.toString(36);
        
        // Final output: salt + timestamp + encrypted data
        return `ENC:${saltEncoded}:${timeEncoded}:${base64}`;
      };

      // Delay function - like Lua's task.delay, pauses execution without blocking UI
      // Accepts seconds (0.1 = 100ms)
      // For very short delays, uses synchronous wait (acceptable blocking)
      // For longer delays, uses setTimeout (non-blocking)
      const delay = (seconds: number): void | Promise<void> => {
        const milliseconds = seconds * 1000;
        if (milliseconds <= 0) {
          return;
        }
        
        // For delays < 50ms, use synchronous wait (acceptable for UI)
        // For longer delays, use setTimeout (non-blocking)
        if (milliseconds < 50) {
          const start = Date.now();
          while (Date.now() - start < milliseconds) {
            // Busy wait - blocks but only for very short times
          }
          return;
        } else {
          // For longer delays, return a promise that will be handled by async code
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, milliseconds);
          });
        }
      };

      // Mouse and keyboard state
      let mouseX = 0;
      let mouseY = 0;
      let mousePressed = false;
      let mouseClicked = false;
      let mouseButton = 0; // 0 = left, 1 = middle, 2 = right
      let keyPressed = false;
      let currentKey = '';
      let pressedKeys = new Set<string>(); // Track all pressed keys
      
      // Set up mouse and keyboard event listeners
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      };
      
      const handleMouseDown = (e: MouseEvent) => {
        mousePressed = true;
        mouseClicked = true;
        mouseButton = e.button; // 0 = left, 1 = middle, 2 = right
        // Reset clicked after a frame
        setTimeout(() => { mouseClicked = false; }, 0);
      };
      
      const handleMouseUp = () => {
        mousePressed = false;
        mouseButton = 0;
      };
      
      const handleKeyDown = (e: KeyboardEvent) => {
        // Don't capture IDE shortcuts
        if (e.ctrlKey || e.metaKey) return;
        keyPressed = true;
        pressedKeys.add(e.key);
        // Set currentKey to the most recently pressed key
        currentKey = e.key;
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
        pressedKeys.delete(e.key);
        keyPressed = pressedKeys.size > 0; // Still pressed if other keys are down
        if (pressedKeys.size === 0) {
          currentKey = '';
        } else {
          // Set currentKey to the most recently pressed key that's still down
          const keys = Array.from(pressedKeys);
          currentKey = keys[keys.length - 1];
        }
      };
      
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      // Cleanup function
      const cleanup = () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
      
      // Store cleanup for later
      (this as any).cleanup = cleanup;
      
      // Helper function to check if a specific key is pressed
      const isKeyPressed = (key: string): boolean => {
        // Check if the key is in the pressedKeys set
        // Handle case-insensitive matching and common variations
        const normalizedKey = key.trim();
        
        // Direct match
        if (pressedKeys.has(normalizedKey)) return true;
        if (currentKey === normalizedKey) return true;
        
        // Case-insensitive match
        for (const pressedKey of pressedKeys) {
          if (pressedKey.toLowerCase() === normalizedKey.toLowerCase()) {
            return true;
          }
        }
        if (currentKey.toLowerCase() === normalizedKey.toLowerCase()) {
          return true;
        }
        
        return false;
      };
      
      // Check if ALL of multiple keys are pressed (AND logic)
      const keyPressedFunc = (...keys: string[]): boolean => {
        if (keys.length === 0) return keyPressed;
        // Require ALL keys to be pressed (AND logic)
        return keys.every(key => isKeyPressed(key));
      };
      
      // Helper functions for mouse buttons
      const isLeftMouse = (): boolean => mouseButton === 0;
      const isRightMouse = (): boolean => mouseButton === 2;
      
      // Check if any of multiple mouse buttons were clicked
      const mouseClickedFunc = (...buttons: (string | number)[]): boolean => {
        if (!mouseClicked) return false;
        if (buttons.length === 0) return mouseClicked;
        
        return buttons.some(button => {
          if (typeof button === 'string') {
            if (button === 'left' || button === 'leftMouse') return mouseButton === 0;
            if (button === 'right' || button === 'rightMouse') return mouseButton === 2;
            if (button === 'middle' || button === 'middleMouse') return mouseButton === 1;
          } else if (typeof button === 'number') {
            return mouseButton === button;
          }
          return false;
        });
      };
      
      // Mouse button constants
      const leftMouse = 0;
      const rightMouse = 2;
      const middleMouse = 1;

      // Button system - create and check buttons
      const buttons: Map<string, { x: number; y: number; w: number; h: number; clicked: boolean }> = new Map();
      
      const button = (x: number, y: number, w: number, h: number, id: string) => {
        // Create or update a button
        const btn = buttons.get(id) || { x, y, w, h, clicked: false };
        btn.x = x;
        btn.y = y;
        btn.w = w;
        btn.h = h;
        
        // Check if button was clicked this frame
        if (mouseClicked && mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) {
          btn.clicked = true;
        } else {
          btn.clicked = false;
        }
        
        buttons.set(id, btn);
        
        // Draw the button
        fill(200, 200, 200);
        rect(x, y, w, h);
        fill(0, 0, 0);
        text(id, x + 10, y + h/2 + 5, 14);
        
        return btn;
      };
      
      // Check if a button was clicked
      const buttonClicked = (id: string): boolean => {
        const btn = buttons.get(id);
        return btn ? btn.clicked : false;
      };
      
      // Clear button click states (call this at start of each frame)
      const clearButtons = () => {
        buttons.forEach(btn => {
          btn.clicked = false;
        });
      };

      // Decryption function - reverses the encryption
      const decrypt = (encryptedData: string): string => {
        // Check if it's a valid encrypted string
        if (!encryptedData.startsWith('ENC:')) {
          throw new Error('Invalid encrypted data format. Must start with "ENC:"');
        }
        
        // Parse the encrypted string: ENC:salt:timestamp:data
        const parts = encryptedData.substring(4).split(':');
        if (parts.length !== 3) {
          throw new Error('Invalid encrypted data format');
        }
        
        const [saltEncoded, timeEncoded, base64] = parts;
        
        // Decode salt and timestamp
        const salt = atob(saltEncoded.replace(/-/g, '+').replace(/_/g, '/'));
        const timestamp = parseInt(timeEncoded, 36);
        
        // Recreate the key (same as encryption)
        const key = salt + timestamp.toString(36) + 'SECRET_KEY_2024';
        
        // Decode Base64
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        let encoded = '';
        for (let i = 0; i < base64.length; i += 4) {
          const a = alphabet.indexOf(base64[i]);
          const b = alphabet.indexOf(base64[i + 1]);
          const c = base64[i + 2] === '=' ? -1 : alphabet.indexOf(base64[i + 2]);
          const d = base64[i + 3] === '=' ? -1 : alphabet.indexOf(base64[i + 3]);
          
          const bitmap = (a << 18) | (b << 12) | (c >= 0 ? c << 6 : 0) | (d >= 0 ? d : 0);
          
          encoded += String.fromCharCode((bitmap >> 16) & 255);
          if (c >= 0) encoded += String.fromCharCode((bitmap >> 8) & 255);
          if (d >= 0) encoded += String.fromCharCode(bitmap & 255);
        }
        
        // Remove padding nulls
        encoded = encoded.replace(/\0+$/, '');
        
        // Reverse XOR cipher (XOR is its own inverse)
        let decrypted = '';
        for (let i = 0; i < encoded.length; i++) {
          const encrypted = encoded.charCodeAt(i);
          const keyChar = key.charCodeAt(i % key.length);
          // Reverse: encrypted ^ keyChar ^ (i * 7 + 13) = original
          const decryptedChar = encrypted ^ keyChar ^ (i * 7 + 13);
          decrypted += String.fromCharCode(decryptedChar);
        }
        
        return decrypted;
      };

      // Transform code syntax
      // Note: <= and >= operators are preserved as-is (word boundaries prevent 'or'/'and' from matching inside them)
      
      // First, protect strings and comments from transformation
      const stringPlaceholders: string[] = [];
      const commentPlaceholders: string[] = [];
      let protectedCode = code;
      
      // Protect strings
      protectedCode = protectedCode.replace(/(["'])((?:\\.|(?!\1).)*?)\1/g, (match) => {
        const placeholder = `__STRING_${stringPlaceholders.length}__`;
        stringPlaceholders.push(match);
        return placeholder;
      });
      
      // Protect comments
      protectedCode = protectedCode.replace(/\/\/.*/g, (match) => {
        const placeholder = `__COMMENT_${commentPlaceholders.length}__`;
        commentPlaceholders.push(match);
        return placeholder;
      });
      
      let transformedCode = protectedCode
        // Replace var with let
        .replace(/\bvar\b/g, 'let')
        // Replace 'or' with '||' (word boundary ensures it doesn't match in 'for', 'floor', etc.)
        .replace(/\bor\b/g, '||')
        // Replace 'and' with '&&' (word boundary ensures it doesn't match in 'random', 'stand', etc.)
        .replace(/\band\b/g, '&&')
        // Replace 'not' with '!' (word boundary ensures it doesn't match in 'note', 'notify', etc.)
        .replace(/\bnot\b/g, '!')
        // Replace function declarations with arrow functions
        // Match: function name(params) { and replace with: const name = (params) => {
        // Handle both empty and non-empty parameter lists
        .replace(/\bfunction\s+(\w+)\s*\(\)\s*\{/g, 'const $1 = () => {')
        .replace(/\bfunction\s+(\w+)\s*\(([^)]+)\)\s*\{/g, 'const $1 = ($2) => {')
        // Support async functions
        .replace(/\basync\s+function\s+(\w+)\s*\(\)\s*\{/g, 'const $1 = async () => {')
        .replace(/\basync\s+function\s+(\w+)\s*\(([^)]+)\)\s*\{/g, 'const $1 = async ($2) => {')
        // Support async arrow functions (already async)
        .replace(/\basync\s+\(/g, 'async (')
        // Transform isKeyPressed("a" or "A") to check both keys
        .replace(/isKeyPressed\s*\(\s*"([^"]+)"\s+or\s+"([^"]+)"\s*\)/g, '(isKeyPressed("$1") || isKeyPressed("$2"))')
        .replace(/isKeyPressed\s*\(\s*'([^']+)'\s+or\s+'([^']+)'\s*\)/g, "(isKeyPressed('$1') || isKeyPressed('$2'))");
      
      // Restore strings
      stringPlaceholders.forEach((str, index) => {
        const placeholder = `__STRING_${index}__`;
        transformedCode = transformedCode.replace(placeholder, str);
      });
      
      // Restore comments
      commentPlaceholders.forEach((comment, index) => {
        const placeholder = `__COMMENT_${index}__`;
        transformedCode = transformedCode.replace(placeholder, comment);
      });

      // Arrays work naturally with JavaScript [] syntax
      // Users can use: let list = [] or let list = [1, 2, 3]
      // And access with: list[0] or use helper functions

      // Store original code for error mapping
      const originalCodeLines = code.split('\n');
      const transformedCodeLines = transformedCode.split('\n');

      // Transform array syntax to be beginner-friendly
      // But only for array literals, not object literals {}
      // Replace [] with createList() for empty arrays (but not {} which are objects)
      transformedCode = transformedCode.replace(/=\s*\[\s*\]/g, '= createList()');
      // Replace [item1, item2, ...] with createList(item1, item2, ...)
      // This regex won't match {} objects, only [] arrays
      transformedCode = transformedCode.replace(/=\s*\[([^\]]+)\]/g, (match, items) => {
        return `= createList(${items})`;
      });
      // Note: Objects {} work natively in JavaScript, no transformation needed

      // Create a scope object with mouse/key as properties
      const scope: any = {
        mouseX: () => mouseX,
        mouseY: () => mouseY,
        mousePressed: () => mousePressed,
        mouseClicked: () => mouseClicked,
        keyPressed: () => keyPressed,
        key: () => currentKey,
      };
      
      // Execute the transformed code with error tracking
      // Make it async to support delay()
      const userCode = new Function(
        'size',
        'background',
        'fill',
        'stroke',
        'strokeWeight',
        'ellipse',
        'rect',
        'line',
        'text',
        'triangle',
        'quad',
        'arc',
        'point',
        'print',
        'input',
        'random',
        'map',
        'constrain',
        'dist',
        'abs',
        'sqrt',
        'pow',
        'sin',
        'cos',
        'tan',
        'floor',
        'ceil',
        'round',
        'min',
        'max',
        'createList',
        'append',
        'getLength',
        'getItem',
        'setItem',
        'encrypt',
        'decrypt',
        'delay',
        'getMouseX',
        'getMouseY',
        'getMousePressed',
        'getMouseClicked',
        'getKeyPressed',
        'getKey',
        'isKeyPressed',
        'isLeftMouse',
        'isRightMouse',
        'keyPressedFunc',
        'mouseClickedFunc',
        'leftMouse',
        'rightMouse',
        'middleMouse',
        'button',
        'buttonClicked',
        'clearButtons',
        'canvas',
        'Math',
        'Promise',
        // Inject mouse/key as variables in the code
        (() => {
          let code = transformedCode;
          // Protect strings from replacement
          const strPlaceholders: string[] = [];
          code = code.replace(/(["'])((?:\\.|(?!\1).)*?)\1/g, (match) => {
            const placeholder = `__STR2_${strPlaceholders.length}__`;
            strPlaceholders.push(match);
            return placeholder;
          });
          
          // Replace function calls FIRST (before variable replacements)
          code = code            .replace(/\bisKeyPressed\s*\(/g, 'isKeyPressed(')
            .replace(/\bisLeftMouse\s*\(/g, 'isLeftMouse(')
            .replace(/\bisRightMouse\s*\(/g, 'isRightMouse(')
            // Replace keyPressed() function calls (but not the variable)
            .replace(/\bkeyPressed\s*\(/g, 'keyPressedFunc(')
            // Replace mouseClicked() function calls (but not the variable)
            .replace(/\bmouseClicked\s*\(/g, 'mouseClickedFunc(')
            // Replace button() calls
            .replace(/\bbutton\s*\(/g, 'button(')
            // Replace buttonClicked() calls and buttonId(clicked) syntax
            .replace(/\b(\w+)\s*\(\s*clicked\s*\)/g, 'buttonClicked("$1")')
            .replace(/\bbuttonClicked\s*\(/g, 'buttonClicked(')
            // Now replace variables (after function calls)
            .replace(/\bmouseX\b/g, 'getMouseX()')
            .replace(/\bmouseY\b/g, 'getMouseY()')
            .replace(/\bmousePressed\b/g, 'getMousePressed()')
            .replace(/\bmouseClicked\b(?!\()/g, 'getMouseClicked()')
            .replace(/\bkeyPressed\b(?!\()/g, 'getKeyPressed()')
            .replace(/\bkey\b(?!\w)/g, 'getKey()');
          
          // Restore strings
          strPlaceholders.forEach((str, i) => {
            code = code.replace(`__STR2_${i}__`, str);
          });
          
          return code;
        })() +
        '\n\nif (typeof setup === "function") { const setupResult = setup(); if (setupResult && typeof setupResult.then === "function") { setupResult.catch(err => { throw err; }); } }\nreturn typeof loop === "function" ? loop : null;'
      );

      // Run the code and get loop function if defined
      this.loopFunction = userCode(
        size,
        background,
        fill,
        stroke,
        strokeWeight,
        ellipse,
        rect,
        line,
        text,
        triangle,
        quad,
        arc,
        point,
        print,
        input,
        random,
        map,
        constrain,
        dist,
        abs,
        sqrt,
        pow,
        sin,
        cos,
        tan,
        floor,
        ceil,
        round,
        min,
        max,
        createList,
        append,
        getLength,
        getItem,
        setItem,
        encrypt,
        decrypt,
        delay,
        () => mouseX,
        () => mouseY,
        () => mousePressed,
        () => mouseClicked,
        () => keyPressed,
        () => currentKey,
        isKeyPressed,
        isLeftMouse,
        isRightMouse,
        keyPressedFunc,
        mouseClickedFunc,
        leftMouse,
        rightMouse,
        middleMouse,
        button,
        buttonClicked,
        clearButtons,
        canvas,
        Math,
        Promise
      );

      // Store clearButtons function for use in loop
      (this as any).clearButtons = clearButtons;
      
      // Start animation loop if loop() function is defined
      if (this.loopFunction) {
        this.startLoop();
      }
    } catch (error) {
      // Re-throw with more context if possible
      if (error instanceof Error) {
        // Try to preserve the original error with stack trace
        const enhancedError = new Error(error.message);
        enhancedError.stack = error.stack;
        throw enhancedError;
      }
      throw error;
    }
  }

  private startLoop(): void {
    if (!this.loopFunction || this.stopRequested) return;

    const animate = () => {
      if (this.stopRequested || !this.loopFunction) return;

      try {
        // Clear button states at start of frame
        if ((this as any).clearButtons) {
          (this as any).clearButtons();
        }
        this.loopFunction();
        this.animationId = requestAnimationFrame(animate);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : '';
        this.context.print(`LOOP ERROR: ${errorMessage}${stack ? '\n' + stack : ''}`);
        this.stop();
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }
}
