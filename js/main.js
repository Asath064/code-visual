// Main Application
class AlgorithmVisualizer {
    constructor() {
        this.codeExecutor = new CodeExecutor();
        this.visualizationEngine = new VisualizationEngine();
        this.uiControls = new UIControls();
        
        this.currentStep = 0;
        this.executionSteps = [];
        this.isRunning = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        // Initialize UI controls
        this.uiControls.init();
        
        // Set up event listeners
        document.getElementById('run-btn').addEventListener('click', () => this.runVisualization());
        document.getElementById('step-btn').addEventListener('click', () => this.stepExecution());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('reset-btn').addEventListener('click', () => this.resetVisualization());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Initialize CodeMirror if available
        if (typeof CodeMirror !== 'undefined') {
            this.initCodeEditor();
        }
    }
    
    initCodeEditor() {
        this.editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'dracula',
            indentUnit: 4,
            tabSize: 4,
            lineWrapping: true,
            autoCloseBrackets: true,
            matchBrackets: true
        });
        
        // Update editor mode based on language selection
        document.getElementById('language').addEventListener('change', (e) => {
            const language = e.target.value;
            let mode = 'javascript';
            
            switch(language) {
                case 'python': mode = 'python'; break;
                case 'java': mode = 'text/x-java'; break;
                case 'c': mode = 'text/x-csrc'; break;
                default: mode = 'javascript';
            }
            
            this.editor.setOption('mode', mode);
        });
    }
    
    async runVisualization() {
        if (this.isRunning) {
            this.pauseExecution();
            return;
        }
        
        this.resetVisualization();
        
        const code = this.editor ? this.editor.getValue() : document.getElementById('code-editor').value;
        const input = document.getElementById('input-values').value;
        const algorithmType = document.getElementById('algorithm-type').value;
        const language = document.getElementById('language').value;
        
        try {
            // Parse and analyze the code
            this.executionSteps = await this.codeExecutor.executeCode(code, input, algorithmType, language);
            
            if (this.executionSteps.length === 0) {
                alert('No execution steps generated. Please check your code.');
                return;
            }
            
            // Update UI
            document.getElementById('total-steps').textContent = `/ ${this.executionSteps.length}`;
            
            // Start visualization
            this.isRunning = true;
            this.currentStep = 0;
            
            // Visualize first step
            this.visualizeStep(this.currentStep);
            
            // Start auto-play if enabled
            if (document.getElementById('auto-play').checked) {
                this.startAutoPlay();
            }
            
        } catch (error) {
            console.error('Execution error:', error);
            alert(`Error: ${error.message}`);
            this.resetVisualization();
        }
    }
    
    visualizeStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.executionSteps.length) {
            return;
        }
        
        const step = this.executionSteps[stepIndex];
        this.currentStep = stepIndex;
        
        // Update step info
        document.getElementById('current-step').textContent = `Step: ${stepIndex + 1}`;
        document.getElementById('step-explanation').textContent = step.explanation || 'Executing step...';
        
        // Update complexity if available
        if (step.complexity) {
            document.getElementById('time-complexity').textContent = step.complexity.time || 'O(n)';
            document.getElementById('space-complexity').textContent = step.complexity.space || 'O(1)';
        }
        
        // Highlight current line in code
        this.highlightCurrentLine(step.lineNumber);
        
        // Update variables display
        this.updateVariablesDisplay(step.variables);
        
        // Draw visualization
        this.visualizationEngine.drawStep(step);
    }
    
    highlightCurrentLine(lineNumber) {
        // Remove previous highlights
        const codeLines = document.querySelectorAll('.highlight-line, .current-line');
        codeLines.forEach(line => {
            line.classList.remove('highlight-line', 'current-line');
        });
        
        if (lineNumber === undefined || lineNumber === null) return;
        
        // If using CodeMirror
        if (this.editor) {
            this.editor.removeLineClass(0, 'background', 'highlight-line');
            this.editor.removeLineClass(0, 'background', 'current-line');
            
            if (lineNumber >= 0 && lineNumber < this.editor.lineCount()) {
                this.editor.addLineClass(lineNumber, 'background', 'current-line');
            }
        }
    }
    
    updateVariablesDisplay(variables) {
        const container = document.getElementById('variables-container');
        container.innerHTML = '';
        
        if (!variables) return;
        
        for (const [name, value] of Object.entries(variables)) {
            const variableElement = document.createElement('div');
            variableElement.className = 'variable';
            variableElement.innerHTML = `
                <span class="variable-name">${name}</span>:
                <span class="variable-value">${JSON.stringify(value)}</span>
            `;
            container.appendChild(variableElement);
        }
    }
    
    stepExecution() {
        if (!this.isRunning || this.executionSteps.length === 0) return;
        
        if (this.currentStep < this.executionSteps.length - 1) {
            this.currentStep++;
            this.visualizeStep(this.currentStep);
        } else {
            this.pauseExecution();
        }
    }
    
    togglePause() {
        if (this.isRunning) {
            this.pauseExecution();
        } else {
            this.resumeExecution();
        }
    }
    
    pauseExecution() {
        this.isRunning = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        document.getElementById('pause-btn').textContent = 'Resume';
    }
    
    resumeExecution() {
        if (this.currentStep >= this.executionSteps.length) {
            this.resetVisualization();
            return;
        }
        
        this.isRunning = true;
        document.getElementById('pause-btn').textContent = 'Pause';
        
        if (document.getElementById('auto-play').checked) {
            this.startAutoPlay();
        }
    }
    
    startAutoPlay() {
        const speed = parseInt(document.getElementById('speed').value);
        const interval = 2000 - (speed * 150); // 500ms to 2000ms range
        
        this.autoPlayInterval = setInterval(() => {
            if (this.currentStep < this.executionSteps.length - 1) {
                this.currentStep++;
                this.visualizeStep(this.currentStep);
            } else {
                this.pauseExecution();
            }
        }, interval);
    }
    
    resetVisualization() {
        this.isRunning = false;
        this.currentStep = 0;
        
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        document.getElementById('current-step').textContent = 'Step: 0';
        document.getElementById('total-steps').textContent = '/ 0';
        document.getElementById('step-explanation').textContent = 'Click "Run & Visualize" to start';
        document.getElementById('pause-btn').textContent = 'Pause';
        
        // Clear visualization
        this.visualizationEngine.clear();
        
        // Clear variable display
        document.getElementById('variables-container').innerHTML = '';
        
        // Clear line highlights
        if (this.editor) {
            this.editor.removeLineClass(0, 'background', 'highlight-line');
            this.editor.removeLineClass(0, 'background', 'current-line');
        }
    }
    
    toggleTheme() {
        const themeStylesheet = document.getElementById('theme-stylesheet');
        const currentTheme = themeStylesheet.getAttribute('href');
        
        if (currentTheme.includes('dark-theme')) {
            themeStylesheet.setAttribute('href', 'css/main.css');
            document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            themeStylesheet.setAttribute('href', 'css/dark-theme.css');
            document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.visualizer = new AlgorithmVisualizer();
});