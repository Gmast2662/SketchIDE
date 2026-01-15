// Graphics system for ArtLang

class GraphicsSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
    }

    setupCanvas() {
        // Set default canvas size (Processing default)
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Set default styles
        this.ctx.fillStyle = '#ffffff';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.font = '12px sans-serif';
        this.ctx.textBaseline = 'top';
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

