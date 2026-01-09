// Visualization Engine
class VisualizationEngine {
    constructor() {
        this.canvas = document.getElementById('visualization-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        
        this.init();
    }
    
    init() {
        // Set up canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Set up zoom and pan controls
        document.getElementById('zoom-in').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoom(0.8));
        document.getElementById('reset-zoom').addEventListener('click', () => this.resetZoom());
        
        // Set up mouse events for panning
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e));
        this.canvas.addEventListener('mouseup', () => this.endDrag());
        this.canvas.addEventListener('mouseleave', () => this.endDrag());
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.redraw();
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawStep(step) {
        this.clear();
        
        if (!step || !step.visualization) {
            this.drawPlaceholder();
            return;
        }
        
        // Apply transformations
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw based on visualization type
        const viz = step.visualization;
        
        switch (viz.type) {
            case 'array':
                this.drawArrayVisualization(viz);
                break;
            case 'graph':
                this.drawGraphVisualization(viz);
                break;
            case 'tree':
                this.drawTreeVisualization(viz);
                break;
            case 'variables':
                this.drawVariablesVisualization(viz);
                break;
            case 'recursion':
                this.drawRecursionVisualization(viz);
                break;
            default:
                this.drawPlaceholder();
        }
        
        this.ctx.restore();
    }
    
    drawPlaceholder() {
        this.ctx.fillStyle = '#999';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Visualization will appear here', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    drawArrayVisualization(viz) {
        const array = viz.array || [];
        const pointers = viz.pointers || [];
        const highlights = viz.highlights || [];
        
        const boxWidth = 60;
        const boxHeight = 40;
        const spacing = 20;
        const startX = 50;
        const startY = 100;
        
        // Draw array boxes
        array.forEach((value, index) => {
            const x = startX + index * (boxWidth + spacing);
            const y = startY;
            
            // Check if this element is highlighted
            const isHighlighted = highlights.includes(index);
            
            this.ctx.strokeStyle = isHighlighted ? '#ff4757' : '#333';
            this.ctx.lineWidth = isHighlighted ? 3 : 1;
            this.ctx.fillStyle = isHighlighted ? '#ff6b81' : '#4a6bff';
            
            // Draw box
            this.ctx.fillRect(x, y, boxWidth, boxHeight);
            this.ctx.strokeRect(x, y, boxWidth, boxHeight);
            
            // Draw value
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(String(value), x + boxWidth / 2, y + boxHeight / 2);
            
            // Draw index
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(index, x + boxWidth / 2, y - 10);
        });
        
        // Draw pointers
        pointers.forEach(pointer => {
            const x = startX + pointer.index * (boxWidth + spacing);
            const y = startY - 30;
            
            // Draw arrow
            this.ctx.strokeStyle = pointer.color || '#ff4757';
            this.ctx.lineWidth = 2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x + boxWidth / 2, y);
            this.ctx.lineTo(x + boxWidth / 2, startY);
            this.ctx.stroke();
            
            // Draw pointer label
            this.ctx.fillStyle = pointer.color || '#ff4757';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(pointer.label || 'ptr', x + boxWidth / 2, y - 5);
        });
        
        // Draw title
        this.ctx.fillStyle = '#333';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Array Visualization', 50, 30);
    }
    
    drawGraphVisualization(viz) {
        const nodes = viz.nodes || [];
        const edges = viz.edges || [];
        const highlights = viz.highlights || [];
        
        const nodeRadius = 25;
        
        // Draw edges first (so nodes appear on top)
        edges.forEach(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return;
            
            const fromX = fromNode.x * 100 + 100;
            const fromY = fromNode.y * 100 + 100;
            const toX = toNode.x * 100 + 100;
            const toY = toNode.y * 100 + 100;
            
            this.ctx.strokeStyle = edge.color || '#333';
            this.ctx.lineWidth = edge.weight || 1;
            
            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);
            this.ctx.lineTo(toX, toY);
            this.ctx.stroke();
            
            // Draw arrowhead if directed
            if (edge.directed) {
                this.drawArrowhead(fromX, fromY, toX, toY);
            }
            
            // Draw edge label
            if (edge.label) {
                const midX = (fromX + toX) / 2;
                const midY = (fromY + toY) / 2;
                this.ctx.fillStyle = edge.color || '#333';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(edge.label, midX, midY);
            }
        });
        
        // Draw nodes
        nodes.forEach(node => {
            const x = node.x * 100 + 100;
            const y = node.y * 100 + 100;
            const isHighlighted = highlights.includes(node.id);
            
            // Draw node circle
            this.ctx.fillStyle = isHighlighted ? '#ff6b81' : '#4a6bff';
            this.ctx.strokeStyle = isHighlighted ? '#ff4757' : '#333';
            this.ctx.lineWidth = isHighlighted ? 3 : 1;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Draw node label
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(node.label || node.id, x, y);
        });
        
        // Draw title
        this.ctx.fillStyle = '#333';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Graph Visualization', 50, 30);
    }
    
    drawTreeVisualization(viz) {
        // Tree visualization (similar to graph but with hierarchical layout)
        this.drawGraphVisualization(viz);
        
        // Override title
        this.ctx.fillStyle = '#333';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Tree Visualization', 50, 30);
    }
    
    drawVariablesVisualization(viz) {
        const variables = viz.variables || {};
        
        let y = 50;
        const lineHeight = 30;
        
        // Draw title
        this.ctx.fillStyle = '#333';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Variables Visualization', 50, 30);
        
        y += 40;
        
        // Draw variables
        for (const [name, value] of Object.entries(variables)) {
            this.ctx.fillStyle = '#4a6bff';
            this.ctx.font = '14px Arial';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(`${name}:`, 50, y);
            
            this.ctx.fillStyle = '#333';
            this.ctx.fillText(JSON.stringify(value), 150, y);
            
            y += lineHeight;
        }
    }
    
    drawRecursionVisualization(viz) {
        const callStack = viz.callStack || [];
        
        const boxWidth = 200;
        const boxHeight = 60;
        const spacing = 30;
        const startX = 50;
        const startY = 100;
        
        // Draw title
        this.ctx.fillStyle = '#333';
        this.ctx.font = '18px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Recursion Call Stack', 50, 30);
        
        // Draw call stack boxes (most recent call on top)
        callStack.forEach((call, index) => {
            const reversedIndex = callStack.length - 1 - index;
            const x = startX;
            const y = startY + reversedIndex * (boxHeight + spacing);
            
            // Draw box
            this.ctx.fillStyle = call.isCurrent ? '#ff6b81' : '#4a6bff';
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            
            this.ctx.fillRect(x, y, boxWidth, boxHeight);
            this.ctx.strokeRect(x, y, boxWidth, boxHeight);
            
            // Draw function name
            this.ctx.fillStyle = 'white';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(call.function || 'function', x + boxWidth / 2, y + 10);
            
            // Draw parameters
            this.ctx.font = '12px Arial';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(call.parameters ? JSON.stringify(call.parameters) : '', x + boxWidth / 2, y + boxHeight / 2);
            
            // Draw return value if available
            if (call.returnValue !== undefined) {
                this.ctx.font = '12px Arial';
                this.ctx.textBaseline = 'bottom';
                this.ctx.fillText(`→ ${JSON.stringify(call.returnValue)}`, x + boxWidth / 2, y + boxHeight - 10);
            }
        });
    }
    
    drawArrowhead(fromX, fromY, toX, toY) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle - Math.PI / 6),
            toY - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.lineTo(
            toX - headLength * Math.cos(angle + Math.PI / 6),
            toY - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.lineTo(toX, toY);
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.fill();
    }
    
    zoom(factor) {
        const oldScale = this.scale;
        this.scale = Math.max(0.1, Math.min(5, this.scale * factor));
        
        // Adjust offset to zoom around center
        const canvasCenterX = this.canvas.width / 2;
        const canvasCenterY = this.canvas.height / 2;
        
        this.offsetX = canvasCenterX - (canvasCenterX - this.offsetX) * (this.scale / oldScale);
        this.offsetY = canvasCenterY - (canvasCenterY - this.offsetY) * (this.scale / oldScale);
        
        this.redraw();
    }
    
    resetZoom() {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.redraw();
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.dragStartX = e.clientX - this.offsetX;
        this.dragStartY = e.clientY - this.offsetY;
        this.canvas.style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        this.offsetX = e.clientX - this.dragStartX;
        this.offsetY = e.clientY - this.dragStartY;
        this.redraw();
    }
    
    endDrag() {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }
    
    redraw() {
        // This will be called by the main application when needed
        // The actual drawing is handled by drawStep
    }
}