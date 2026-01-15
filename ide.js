// IDE functionality for ArtLang

class ArtLangIDE {
    constructor() {
        this.canvas = document.getElementById('outputCanvas');
        this.editor = document.getElementById('codeEditor');
        this.codeOutput = document.getElementById('codeOutput');
        this.interpreter = null;
        this.tabs = new Map();
        this.activeTab = 'sketch1';
        this.nextTabId = 1;
        this.currentTheme = 'light';
        this.highlighter = null;
        
        this.init();
    }

    init() {
        // Initialize interpreter
        this.interpreter = new ArtLangInterpreter(this.canvas);
        this.interpreter.onStatusUpdate = (msg) => {
            this.updateStatus(msg);
        };

        // Set default code (Processing-style example)
        const defaultCode = `function setup()
    size(400, 400)
end

function draw()
    background(240, 240, 240)
    ellipse(200, 200, 300, 300)
end`;
        
        this.tabs.set('sketch1', {
            name: 'sketch1',
            code: defaultCode,
            saved: false
        });
        this.editor.value = defaultCode;

        // Setup syntax highlighting
        this.highlighter = new SyntaxHighlighter(this.editor, this.codeOutput);
        this.highlighter.update();
        
        // Update highlighting on input
        this.editor.addEventListener('input', () => {
            this.highlighter.update();
            this.updateLineCol();
            this.markTabUnsaved(this.activeTab);
        });
        
        this.editor.addEventListener('scroll', () => {
            this.highlighter.syncScroll();
        });

        // Setup event listeners
        this.setupEventListeners();
        
        // Setup canvas mouse tracking
        this.setupCanvasEvents();
        
        // Load saved theme
        const savedTheme = localStorage.getItem('artlang-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
            document.getElementById('themeSelect').value = savedTheme;
        }

        // Load saved font size
        const savedFontSize = localStorage.getItem('artlang-fontsize');
        if (savedFontSize) {
            this.setFontSize(savedFontSize);
            document.getElementById('fontSizeSelect').value = savedFontSize;
        }

        this.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.editor.selectionStart;
                const end = this.editor.selectionEnd;
                this.editor.value = this.editor.value.substring(0, start) + '    ' + this.editor.value.substring(end);
                this.editor.selectionStart = this.editor.selectionEnd = start + 4;
                this.highlighter.update();
            }
            this.updateLineCol();
        });

        this.editor.addEventListener('click', () => this.updateLineCol());

        // Keyboard shortcuts - only when not typing in editor
        document.addEventListener('keydown', (e) => {
            // Don't interfere if user is typing in editor (unless it's a special combo)
            const isInEditor = document.activeElement === this.editor;
            
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                e.stopPropagation();
                this.save();
            }
            // Use Ctrl+Enter or F5 for run (not Ctrl+R to avoid refresh)
            if (((e.ctrlKey || e.metaKey) && e.key === 'Enter') || e.key === 'F5') {
                e.preventDefault();
                e.stopPropagation();
                this.run();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !isInEditor) {
                e.preventDefault();
                e.stopPropagation();
                this.newTab();
            }
            // Escape to stop
            if (e.key === 'Escape' && !isInEditor) {
                this.stop();
            }
        });

        this.updateLineCol();
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('newBtn').addEventListener('click', () => this.newTab());
        document.getElementById('openBtn').addEventListener('click', () => this.open());
        document.getElementById('saveBtn').addEventListener('click', () => this.save());
        document.getElementById('saveAsBtn').addEventListener('click', () => this.saveAs());
        document.getElementById('runBtn').addEventListener('click', () => this.run());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());

        // Theme selector
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // Font size selector
        document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
            this.setFontSize(e.target.value);
        });

        // Tab add button
        document.getElementById('addTabBtn').addEventListener('click', () => this.newTab());

        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        document.getElementById('helpClose').addEventListener('click', () => this.hideHelp());
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') {
                this.hideHelp();
            }
        });

        // File inputs
        document.getElementById('fileInputOpen').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileOpen(e.target.files[0]);
            }
        });
    }

    setupCanvasEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            this.interpreter.updateMouse(x * scaleX, y * scaleY);
        });

        this.canvas.addEventListener('mousedown', () => {
            this.interpreter.setMousePressed(true);
        });

        this.canvas.addEventListener('mouseup', () => {
            this.interpreter.setMousePressed(false);
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.interpreter.setMousePressed(false);
        });

        document.addEventListener('keydown', (e) => {
            this.interpreter.setKeyPressed(true, e.key);
        });

        document.addEventListener('keyup', (e) => {
            this.interpreter.setKeyPressed(false, e.key);
        });
    }

    newTab() {
        const tabId = `sketch${++this.nextTabId}`;
        const tab = {
            name: tabId,
            code: `function setup()
    size(400, 400)
    background(240, 240, 240)
end

function draw()
    -- Your code here
end`,
            saved: false
        };
        
        this.tabs.set(tabId, tab);
        this.switchTab(tabId);
        this.renderTabs();
    }

    switchTab(tabId) {
        // Save current tab
        if (this.activeTab) {
            this.tabs.get(this.activeTab).code = this.editor.value;
        }

        // Switch to new tab
        this.activeTab = tabId;
        const tab = this.tabs.get(tabId);
        this.editor.value = tab.code;
        if (this.highlighter) {
            this.highlighter.update();
        }
        this.renderTabs();
        this.updateLineCol();
    }

    closeTab(tabId) {
        if (this.tabs.size <= 1) {
            // Don't allow closing the last tab, but reset it instead
            const tab = this.tabs.get(tabId);
            tab.code = `function setup()
    background(240, 240, 240)
end

function draw()
    -- Your code here
end`;
            tab.saved = false;
            this.switchTab(tabId);
            this.renderTabs();
            return;
        }

        const tab = this.tabs.get(tabId);
        if (!tab.saved && this.activeTab === tabId) {
            if (!confirm('Unsaved changes. Close anyway?')) {
                return;
            }
        }

        // Stop any running code if closing active tab
        if (this.activeTab === tabId) {
            this.stop();
        }
        
        this.tabs.delete(tabId);
        
        if (this.activeTab === tabId) {
            // Switch to first available tab
            const firstTab = Array.from(this.tabs.keys())[0];
            this.switchTab(firstTab);
        } else {
            this.renderTabs();
        }
    }

    renderTabs() {
        const container = document.getElementById('tabsContainer');
        container.innerHTML = '';

        for (const [tabId, tab] of this.tabs) {
            const tabEl = document.createElement('div');
            tabEl.className = `tab ${tabId === this.activeTab ? 'active' : ''}`;
            tabEl.dataset.tab = tabId;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'tab-name';
            nameSpan.textContent = tab.saved ? tab.name : tab.name + ' *';
            
            const closeSpan = document.createElement('span');
            closeSpan.className = 'tab-close';
            closeSpan.dataset.tab = tabId;
            closeSpan.textContent = '×';
            
            tabEl.appendChild(nameSpan);
            tabEl.appendChild(closeSpan);
            
            tabEl.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-close')) {
                    this.closeTab(tabId);
                } else {
                    this.switchTab(tabId);
                }
            });
            
            container.appendChild(tabEl);
        }
    }

    markTabUnsaved(tabId) {
        const tab = this.tabs.get(tabId);
        if (tab) {
            tab.saved = false;
            this.renderTabs();
        }
    }

    run() {
        const code = this.editor.value;
        this.tabs.get(this.activeTab).code = code;
        
        // Hide overlay
        const overlay = document.getElementById('canvasOverlay');
        overlay.classList.add('hidden');
        
        // Stop any existing execution
        this.interpreter.stop();
        
        // Ensure canvas has proper size (default if size() not called)
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            this.canvas.width = 800;
            this.canvas.height = 600;
        }
        
        // Update canvas size in interpreter BEFORE parsing
        this.interpreter.canvas.width = this.canvas.width;
        this.interpreter.canvas.height = this.canvas.height;
        this.interpreter.width = this.canvas.width;
        this.interpreter.height = this.canvas.height;
        this.interpreter.variables.width = this.canvas.width;
        this.interpreter.variables.height = this.canvas.height;
        
        // Clear canvas before running
        this.interpreter.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.interpreter.ctx.fillStyle = '#ffffff';
        this.interpreter.ctx.strokeStyle = '#000000';
        this.interpreter.ctx.lineWidth = 1;
        
        try {
            console.log('Running code:', code);
            this.interpreter.run(code);
            this.updateStatus('Running');
        } catch (error) {
            this.updateStatus(`Error: ${error.message}`);
            overlay.classList.remove('hidden');
            console.error('Execution error:', error);
            console.error('Stack:', error.stack);
        }
    }

    stop() {
        this.interpreter.stop();
        this.updateStatus('Stopped');
        // Show overlay when stopped
        document.getElementById('canvasOverlay').classList.remove('hidden');
    }

    save() {
        const tab = this.tabs.get(this.activeTab);
        const code = this.editor.value;
        tab.code = code;
        
        if (tab.fileName) {
            // Save with existing filename
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = tab.fileName;
            a.click();
            URL.revokeObjectURL(url);
            tab.saved = true;
            this.renderTabs();
        } else {
            // Save as new file
            this.saveAs();
        }
    }

    saveAs() {
        const tab = this.tabs.get(this.activeTab);
        const code = this.editor.value;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${tab.name}.art`;
        a.click();
        URL.revokeObjectURL(url);
        
        tab.saved = true;
        tab.fileName = `${tab.name}.art`;
        this.renderTabs();
    }

    open() {
        document.getElementById('fileInputOpen').click();
    }

    handleFileOpen(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const code = e.target.result;
            const tabId = `sketch${++this.nextTabId}`;
            const name = file.name.replace('.art', '');
            const tab = {
                name: name,
                code: code,
                saved: true,
                fileName: file.name
            };
            this.tabs.set(tabId, tab);
            this.switchTab(tabId);
            this.renderTabs();
        };
        reader.readAsText(file);
    }


    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('artlang-theme', theme);
    }

    setFontSize(size) {
        this.editor.style.fontSize = `${size}px`;
        localStorage.setItem('artlang-fontsize', size);
    }

    updateStatus(message) {
        document.getElementById('statusText').textContent = message;
    }

    updateLineCol() {
        const text = this.editor.value;
        const cursorPos = this.editor.selectionStart;
        const textBeforeCursor = text.substring(0, cursorPos);
        const lines = textBeforeCursor.split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        document.getElementById('lineCol').textContent = `Line ${line}, Col ${col}`;
    }

    showHelp() {
        const helpBody = document.getElementById('helpBody');
        helpBody.innerHTML = `
            <div class="help-section">
                <h3>Getting Started</h3>
                <p>ArtLang is a simple language inspired by Lua and Processing. Every sketch needs a <code>setup()</code> function that runs once, and optionally a <code>draw()</code> function that runs continuously.</p>
                <pre><code>function setup()
    size(400, 400)
    background(240, 240, 240)
end

function draw()
    -- This runs every frame
end</code></pre>
            </div>

            <div class="help-section">
                <h3>Canvas Setup</h3>
                <ul>
                    <li><code>size(width, height)</code> - Set canvas size (call in setup)</li>
                    <li><code>background(r, g, b)</code> - Set background color (0-255)</li>
                </ul>
            </div>

            <div class="help-section">
                <h3>Drawing Shapes</h3>
                <ul>
                    <li><code>rect(x, y, width, height)</code> - Draw rectangle</li>
                    <li><code>ellipse(x, y, width, height)</code> - Draw ellipse</li>
                    <li><code>circle(x, y, radius)</code> - Draw circle</li>
                    <li><code>line(x1, y1, x2, y2)</code> - Draw line</li>
                    <li><code>triangle(x1, y1, x2, y2, x3, y3)</code> - Draw triangle</li>
                    <li><code>point(x, y)</code> - Draw point</li>
                </ul>
            </div>

            <div class="help-section">
                <h3>Colors</h3>
                <ul>
                    <li><code>fill(r, g, b)</code> - Set fill color (0-255)</li>
                    <li><code>stroke(r, g, b)</code> - Set stroke color (0-255)</li>
                    <li><code>noFill()</code> - Disable filling</li>
                    <li><code>noStroke()</code> - Disable stroking</li>
                    <li><code>strokeWeight(width)</code> - Set stroke width</li>
                </ul>
            </div>

            <div class="help-section">
                <h3>Variables</h3>
                <ul>
                    <li><code>width</code>, <code>height</code> - Canvas dimensions</li>
                    <li><code>mouseX</code>, <code>mouseY</code> - Mouse position</li>
                    <li><code>pmouseX</code>, <code>pmouseY</code> - Previous mouse position</li>
                    <li><code>mousePressed</code> - True if mouse is pressed</li>
                    <li><code>keyPressed</code> - True if key is pressed</li>
                    <li><code>key</code> - Current key character</li>
                    <li><code>frameCount</code> - Frame number since start</li>
                </ul>
            </div>

            <div class="help-section">
                <h3>Math Functions</h3>
                <ul>
                    <li><code>cos(angle)</code>, <code>sin(angle)</code> - Trigonometry</li>
                    <li><code>random(min, max)</code> - Random number</li>
                    <li><code>map(value, start1, stop1, start2, stop2)</code> - Map value</li>
                    <li><code>constrain(value, min, max)</code> - Limit value</li>
                    <li><code>dist(x1, y1, x2, y2)</code> - Distance between points</li>
                    <li><code>lerp(start, stop, amt)</code> - Linear interpolation</li>
                </ul>
            </div>

            <div class="help-section">
                <h3>Control Flow</h3>
                <pre><code>-- If statement
if condition then
    -- code
else
    -- code
end

-- For loop
for i = 1, 10, 1 do
    -- code
end

-- While loop
while condition do
    -- code
end</code></pre>
            </div>

            <div class="help-section">
                <h3>Keyboard Shortcuts</h3>
                <ul>
                    <li><code>Ctrl/Cmd + S</code> - Save</li>
                    <li><code>Ctrl/Cmd + Enter</code> or <code>F5</code> - Run</li>
                    <li><code>Escape</code> - Stop</li>
                    <li><code>Ctrl/Cmd + N</code> - New tab</li>
                </ul>
            </div>
        `;
        document.getElementById('helpModal').style.display = 'flex';
    }

    hideHelp() {
        document.getElementById('helpModal').style.display = 'none';
    }
}

// Initialize IDE when page loads
let ide;
document.addEventListener('DOMContentLoaded', () => {
    ide = new ArtLangIDE();
});

