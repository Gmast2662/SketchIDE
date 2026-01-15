
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
  }

  execute(code: string): void {
    this.stop();
    this.stopRequested = false;

    try {
      const { ctx, canvas, print, input } = this.context;
      
      // Clear canvas before execution
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
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

      // Transform code syntax
      let transformedCode = code
        // Replace var with let
        .replace(/\bvar\b/g, 'let')
        // Replace 'or' with '||'
        .replace(/\bor\b/g, '||')
        // Replace 'and' with '&&'
        .replace(/\band\b/g, '&&')
        // Replace 'not' with '!'
        .replace(/\bnot\b/g, '!')
        // Replace function with const arrow function
        .replace(/function\s+(\w+)\s*\(/g, 'const $1 = (')
        .replace(/\)\s*{/g, ') => {');

      // Execute the transformed code
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
        'canvas',
        'Math',
        transformedCode + '\n\nif (typeof setup === "function") setup();\nreturn typeof loop === "function" ? loop : null;'
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
        canvas,
        Math
      );

      // Start animation loop if loop() function is defined
      if (this.loopFunction) {
        this.startLoop();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.context.print(`ERROR: ${errorMessage}`);
      throw error;
    }
  }

  private startLoop(): void {
    if (!this.loopFunction || this.stopRequested) return;

    const animate = () => {
      if (this.stopRequested || !this.loopFunction) return;

      try {
        this.loopFunction();
        this.animationId = requestAnimationFrame(animate);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.context.print(`LOOP ERROR: ${errorMessage}`);
        this.stop();
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }
}
