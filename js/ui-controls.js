// UI Controls Module
class UIControls {
    constructor() {
        this.initEventListeners();
    }
    
    init() {
        // Initialize any UI components that need it
        this.setupTooltips();
        this.setupAlgorithmPresets();
    }
    
    initEventListeners() {
        // Format code button
        document.getElementById('format-code')?.addEventListener('click', () => {
            this.formatCode();
        });
        
        // Algorithm type change
        document.getElementById('algorithm-type')?.addEventListener('change', (e) => {
            this.onAlgorithmTypeChange(e.target.value);
        });
        
        // Input values change
        document.getElementById('input-values')?.addEventListener('input', (e) => {
            this.onInputValuesChange(e.target.value);
        });
    }
    
    setupTooltips() {
        // Add tooltips to buttons
        const buttons = document.querySelectorAll('.btn-icon, .btn-primary, .btn-secondary');
        buttons.forEach(button => {
            const title = button.getAttribute('title') || button.textContent?.trim();
            if (title) {
                button.setAttribute('title', title);
            }
        });
    }
    
    setupAlgorithmPresets() {
        // Add algorithm presets to the algorithm selector
        const algorithmSelect = document.getElementById('algorithm-type');
        if (!algorithmSelect) return;
        
        // Store original options
        const originalOptions = Array.from(algorithmSelect.options);
        
        // Add preset algorithms
        const presets = [
            { value: 'bubble-sort', text: 'Bubble Sort', category: 'sort' },
            { value: 'quick-sort', text: 'Quick Sort', category: 'sort' },
            { value: 'merge-sort', text: 'Merge Sort', category: 'sort' },
            { value: 'binary-search', text: 'Binary Search', category: 'search' },
            { value: 'linear-search', text: 'Linear Search', category: 'search' },
            { value: 'dfs', text: 'Depth-First Search', category: 'graph' },
            { value: 'bfs', text: 'Breadth-First Search', category: 'graph' },
            { value: 'dijkstra', text: 'Dijkstra\'s Algorithm', category: 'graph' },
            { value: 'fibonacci', text: 'Fibonacci (Recursive)', category: 'recursion' },
            { value: 'factorial', text: 'Factorial (Recursive)', category: 'recursion' }
        ];
        
        // Group by category
        const groupedPresets = {};
        presets.forEach(preset => {
            if (!groupedPresets[preset.category]) {
                groupedPresets[preset.category] = [];
            }
            groupedPresets[preset.category].push(preset);
        });
        
        // Add to select element
        for (const [category, categoryPresets] of Object.entries(groupedPresets)) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
            
            categoryPresets.forEach(preset => {
                const option = document.createElement('option');
                option.value = preset.value;
                option.textContent = preset.text;
                optgroup.appendChild(option);
            });
            
            algorithmSelect.appendChild(optgroup);
        }
        
        // Add event listener for preset selection
        algorithmSelect.addEventListener('change', (e) => {
            this.loadAlgorithmPreset(e.target.value);
        });
    }
    
    loadAlgorithmPreset(presetValue) {
        const codeEditor = window.visualizer?.editor || document.getElementById('code-editor');
        const inputValues = document.getElementById('input-values');
        
        const presets = {
            'bubble-sort': {
                code: `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// Run the algorithm
const result = bubbleSort(input);`,
                input: '[5, 2, 9, 1, 5, 6]'
            },
            'quick-sort': {
                code: `function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left < right) {
        const pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }
    return arr;
}

function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left;
    
    for (let j = left; j < right; j++) {
        if (arr[j] < pivot) {
            // Swap
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
        }
    }
    
    // Swap pivot to correct position
    [arr[i], arr[right]] = [arr[right], arr[i]];
    return i;
}

// Run the algorithm
const result = quickSort([...input]);`,
                input: '[5, 2, 9, 1, 5, 6]'
            },
            'merge-sort': {
                code: `function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Run the algorithm
const result = mergeSort([...input]);`,
                input: '[5, 2, 9, 1, 5, 6]'
            },
            'binary-search': {
                code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Found
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

// Run the algorithm (make sure input is sorted)
const sortedInput = [...input].sort((a, b) => a - b);
const target = 5;
const result = binarySearch(sortedInput, target);`,
                input: '[1, 2, 5, 5, 6, 9]'
            },
            'linear-search': {
                code: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Found
        }
    }
    return -1; // Not found
}

// Run the algorithm
const target = 5;
const result = linearSearch(input, target);`,
                input: '[5, 2, 9, 1, 5, 6]'
            }
        };
        
        if (presets[presetValue]) {
            if (codeEditor) {
                if (window.visualizer?.editor) {
                    window.visualizer.editor.setValue(presets[presetValue].code);
                } else {
                    codeEditor.value = presets[presetValue].code;
                }
            }
            
            if (inputValues) {
                inputValues.value = presets[presetValue].input;
            }
        }
    }
    
    formatCode() {
        const codeEditor = window.visualizer?.editor;
        if (codeEditor) {
            // Auto-format the code
            const cursor = codeEditor.getCursor();
            codeEditor.autoFormatRange(
                {line: 0, ch: 0},
                {line: codeEditor.lineCount(), ch: 0}
            );
            codeEditor.setCursor(cursor);
        } else {
            alert('Code formatting requires CodeMirror to be loaded');
        }
    }
    
    onAlgorithmTypeChange(type) {
        // Could update UI based on algorithm type
        console.log('Algorithm type changed to:', type);
    }
    
    onInputValuesChange(values) {
        // Could validate input based on algorithm type
        console.log('Input values changed:', values);
    }
}