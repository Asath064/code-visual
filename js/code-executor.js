// Code Executor - Handles parsing and step-by-step execution
class CodeExecutor {
    constructor() {
        this.executionContext = {};
        this.currentLine = 0;
        this.executionSteps = [];
        this.variableStates = [];
        
        // Load required libraries if available
        this.acorn = window.acorn;
        this.acornWalk = window.acornWalk;
    }
    
    async executeCode(code, input, algorithmType, language) {
        this.executionSteps = [];
        this.variableStates = [];
        this.currentLine = 0;
        
        try {
            // Parse input safely
            let parsedInput;
            try {
                parsedInput = JSON.parse(input);
            } catch (e) {
                // If JSON parsing fails, try to parse as array or simple values
                try {
                    // Check if it looks like an array
                    if (input.trim().startsWith('[') && input.trim().endsWith(']')) {
                        parsedInput = this.safeParseArray(input);
                    } else if (input.trim().startsWith('{') && input.trim().endsWith('}')) {
                        parsedInput = this.safeParseObject(input);
                    } else {
                        // Try to parse as number or string
                        parsedInput = this.safeParsePrimitive(input);
                    }
                } catch (parseError) {
                    parsedInput = input;
                }
            }
            
            // Set up execution context
            this.executionContext = {
                input: parsedInput,
                console: {
                    log: (...args) => {
                        this.addExecutionStep({
                            type: 'log',
                            message: args.join(' '),
                            lineNumber: this.currentLine
                        });
                    }
                }
            };
            
            // Execute based on language
            switch (language) {
                case 'javascript':
                    return this.executeJavaScript(code, algorithmType);
                case 'python':
                    return this.executePython(code, algorithmType);
                case 'java':
                    return this.executeJava(code, algorithmType);
                case 'c':
                    return this.executeCStyle(code, algorithmType);
                default:
                    return this.executeJavaScript(code, algorithmType);
            }
            
        } catch (error) {
            console.error('Execution error:', error);
            throw new Error(`Execution failed: ${error.message}`);
        }
    }
    
    async executeJavaScript(code, algorithmType) {
        try {
            // Parse the code using Acorn
            const ast = this.acorn.parse(code, {
                ecmaVersion: 2020,
                sourceType: 'module'
            });
            
            // Analyze the AST to understand the code structure
            this.analyzeAST(ast, algorithmType);
            
            // Execute the code step by step
            const executionResult = await this.executeAST(ast);
            
            return this.executionSteps;
            
        } catch (error) {
            console.error('JavaScript execution error:', error);
            throw new Error(`JavaScript execution failed: ${error.message}`);
        }
    }
    
    analyzeAST(ast, algorithmType) {
        // Add initial step
        this.addExecutionStep({
            type: 'start',
            explanation: 'Starting execution',
            variables: {...this.executionContext}
        });
        
        // Analyze based on algorithm type
        switch (algorithmType) {
            case 'sort':
                this.analyzeSortAlgorithm(ast);
                break;
            case 'search':
                this.analyzeSearchAlgorithm(ast);
                break;
            case 'graph':
                this.analyzeGraphAlgorithm(ast);
                break;
            case 'dp':
                this.analyzeDPAlgorithm(ast);
                break;
            case 'recursion':
                this.analyzeRecursiveAlgorithm(ast);
                break;
            default:
                this.analyzeGenericAlgorithm(ast);
        }
    }
    
    analyzeSortAlgorithm(ast) {
        // Look for common sorting patterns
        this.acornWalk.simple(ast, {
            ForStatement(node) {
                this.addExecutionStep({
                    type: 'loop_start',
                    explanation: 'Starting sorting loop',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            },
            IfStatement(node) {
                this.addExecutionStep({
                    type: 'comparison',
                    explanation: 'Comparing elements',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            }
        }, this);
    }
    
    analyzeSearchAlgorithm(ast) {
        // Look for search patterns
        this.acornWalk.simple(ast, {
            WhileStatement(node) {
                this.addExecutionStep({
                    type: 'search_loop',
                    explanation: 'Searching through elements',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            },
            IfStatement(node) {
                this.addExecutionStep({
                    type: 'found_check',
                    explanation: 'Checking if element found',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            }
        }, this);
    }
    
    analyzeGraphAlgorithm(ast) {
        // Look for graph traversal patterns
        this.acornWalk.simple(ast, {
            FunctionDeclaration(node) {
                if (node.id && node.id.name.includes('visit')) {
                    this.addExecutionStep({
                        type: 'graph_visit',
                        explanation: 'Visiting graph node',
                        lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                    });
                }
            }
        }, this);
    }
    
    analyzeRecursiveAlgorithm(ast) {
        // Look for recursive function calls
        this.acornWalk.simple(ast, {
            CallExpression(node) {
                if (node.callee.type === 'Identifier' && 
                    this.isRecursiveCall(node.callee.name, ast)) {
                    this.addExecutionStep({
                        type: 'recursive_call',
                        explanation: 'Making recursive call',
                        lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                    });
                }
            }
        }, this);
    }
    
    isRecursiveCall(functionName, ast) {
        // Check if the function calls itself
        let hasFunction = false;
        let callsItself = false;
        
        this.acornWalk.simple(ast, {
            FunctionDeclaration(node) {
                if (node.id.name === functionName) {
                    hasFunction = true;
                }
            },
            CallExpression(node) {
                if (hasFunction && node.callee.type === 'Identifier' && node.callee.name === functionName) {
                    callsItself = true;
                }
            }
        });
        
        return callsItself;
    }
    
    analyzeGenericAlgorithm(ast) {
        // Generic analysis for any algorithm
        this.acornWalk.simple(ast, {
            FunctionDeclaration(node) {
                this.addExecutionStep({
                    type: 'function_declaration',
                    explanation: `Declared function: ${node.id.name}`,
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            },
            VariableDeclaration(node) {
                this.addExecutionStep({
                    type: 'variable_declaration',
                    explanation: 'Declared variables',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            },
            ForStatement(node) {
                this.addExecutionStep({
                    type: 'for_loop',
                    explanation: 'Starting for loop',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            },
            WhileStatement(node) {
                this.addExecutionStep({
                    type: 'while_loop',
                    explanation: 'Starting while loop',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            },
            IfStatement(node) {
                this.addExecutionStep({
                    type: 'if_statement',
                    explanation: 'Conditional statement',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            },
            ReturnStatement(node) {
                this.addExecutionStep({
                    type: 'return',
                    explanation: 'Return statement',
                    lineNumber: node.loc ? node.loc.start.line - 1 : this.currentLine
                });
            }
        }, this);
    }
    
    async executeAST(ast) {
        // This is a simplified execution - in a real implementation,
        // you would need a proper JavaScript interpreter
        
        try {
            // Create a function from the AST and execute it
            const code = this.generateCodeFromAST(ast);
            const func = new Function('input', 'context', code);
            
            // Execute with error handling
            const result = func(this.executionContext.input, this.executionContext);
            
            // Add final step
            this.addExecutionStep({
                type: 'end',
                explanation: 'Execution completed',
                result: result,
                variables: {...this.executionContext}
            });
            
            return this.executionSteps;
            
        } catch (error) {
            this.addExecutionStep({
                type: 'error',
                explanation: `Error: ${error.message}`,
                error: error.message
            });
            throw error;
        }
    }
    
    generateCodeFromAST(ast) {
        // This is a simplified approach - in reality you'd need a proper code generator
        // For this demo, we'll return the original code with some instrumentation
        return `try {
            ${this.getOriginalCode()}
            return result || context.input;
        } catch (e) {
            throw e;
        }`;
    }
    
    getOriginalCode() {
        // In a real implementation, this would reconstruct code from AST
        // For this demo, we'll use the editor content
        const editor = window.visualizer?.editor;
        if (editor) {
            return editor.getValue();
        }
        return document.getElementById('code-editor').value;
    }
    
    addExecutionStep(step) {
        // Create a visualization for this step based on the type
        const visualization = this.createVisualizationForStep(step);
        
        // Add complexity analysis
        const complexity = this.analyzeComplexity(step);
        
        const executionStep = {
            ...step,
            stepNumber: this.executionSteps.length,
            visualization: visualization,
            complexity: complexity,
            timestamp: Date.now()
        };
        
        this.executionSteps.push(executionStep);
    }
    
    createVisualizationForStep(step) {
        const visualization = { type: 'variables', variables: step.variables || {} };
        
        // Create specific visualizations based on step type
        switch (step.type) {
            case 'start':
            case 'end':
                return visualization;
                
            case 'loop_start':
            case 'for_loop':
            case 'while_loop':
                // Try to visualize arrays if present
                if (step.variables && Array.isArray(step.variables.arr)) {
                    return this.createArrayVisualization(step.variables.arr, step);
                }
                return visualization;
                
            case 'comparison':
            case 'search_loop':
            case 'found_check':
                if (step.variables && Array.isArray(step.variables.arr)) {
                    return this.createArrayVisualization(step.variables.arr, step);
                }
                return visualization;
                
            case 'recursive_call':
                return this.createRecursionVisualization(step);
                
            case 'graph_visit':
                return this.createGraphVisualization(step);
                
            default:
                return visualization;
        }
    }
    
    createArrayVisualization(array, step) {
        // Find pointers/indices from variables
        const pointers = [];
        
        if (step.variables) {
            for (const [name, value] of Object.entries(step.variables)) {
                if (typeof value === 'number' && value >= 0 && value < array.length) {
                    pointers.push({
                        label: name,
                        index: value,
                        color: '#ff4757'
                    });
                }
            }
        }
        
        // Find highlighted elements (for comparisons, etc.)
        const highlights = [];
        if (step.type === 'comparison' && step.variables) {
            // Highlight elements being compared
            if (typeof step.variables.i === 'number' && step.variables.i < array.length) {
                highlights.push(step.variables.i);
            }
            if (typeof step.variables.j === 'number' && step.variables.j < array.length) {
                highlights.push(step.variables.j);
            }
        }
        
        return {
            type: 'array',
            array: [...array],
            pointers: pointers,
            highlights: highlights
        };
    }
    
    createRecursionVisualization(step) {
        // This would track the call stack in a real implementation
        return {
            type: 'recursion',
            callStack: [
                {
                    function: 'exampleFunction',
                    parameters: step.variables || {},
                    isCurrent: true
                }
            ]
        };
    }
    
    createGraphVisualization(step) {
        // This would visualize graph structures
        return {
            type: 'graph',
            nodes: [
                { id: 'A', label: 'A', x: 1, y: 1 },
                { id: 'B', label: 'B', x: 2, y: 2 },
                { id: 'C', label: 'C', x: 3, y: 1 }
            ],
            edges: [
                { from: 'A', to: 'B', directed: true },
                { from: 'B', to: 'C', directed: true }
            ],
            highlights: ['B'] // Highlight current node
        };
    }
    
    analyzeComplexity(step) {
        // Simple complexity analysis based on step type
        switch (step.type) {
            case 'for_loop':
            case 'while_loop':
                return { time: 'O(n)', space: 'O(1)' };
            case 'recursive_call':
                return { time: 'O(2^n)', space: 'O(n)' };
            case 'comparison':
                return { time: 'O(1)', space: 'O(1)' };
            default:
                return { time: 'O(n)', space: 'O(1)' };
        }
    }
    
    // Safe parsing methods
    safeParseArray(input) {
        // Simple array parser - only handles basic arrays with numbers
        const content = input.trim().slice(1, -1); // Remove brackets
        const items = content.split(',').map(item => {
            const trimmed = item.trim();
            if (!isNaN(trimmed)) return parseFloat(trimmed);
            if (trimmed === 'true') return true;
            if (trimmed === 'false') return false;
            if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
            if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
            return trimmed;
        });
        return items;
    }
    
    safeParseObject(input) {
        // Simple object parser - only handles basic key-value pairs
        const content = input.trim().slice(1, -1); // Remove braces
        const obj = {};
        const pairs = content.split(',');
        pairs.forEach(pair => {
            const [key, value] = pair.split(':').map(item => item.trim());
            if (key && value !== undefined) {
                if (!isNaN(value)) obj[key] = parseFloat(value);
                else if (value === 'true') obj[key] = true;
                else if (value === 'false') obj[key] = false;
                else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    obj[key] = value.slice(1, -1);
                } else {
                    obj[key] = value;
                }
            }
        });
        return obj;
    }
    
    safeParsePrimitive(input) {
        const trimmed = input.trim();
        if (!isNaN(trimmed)) return parseFloat(trimmed);
        if (trimmed === 'true') return true;
        if (trimmed === 'false') return false;
        if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            return trimmed.slice(1, -1);
        }
        return trimmed;
    }
    
    // Placeholder methods for other languages
    executePython(code, algorithmType) {
        // In a real implementation, this would use a Python interpreter
        // For this demo, we'll simulate it
        this.addExecutionStep({
            type: 'start',
            explanation: 'Python execution started (simulated)',
            variables: { input: 'Python code' }
        });
        
        this.addExecutionStep({
            type: 'end',
            explanation: 'Python execution completed (simulated)',
            variables: { result: 'Python result' }
        });
        
        return this.executionSteps;
    }
    
    executeJava(code, algorithmType) {
        // In a real implementation, this would use a Java interpreter
        // For this demo, we'll simulate it
        this.addExecutionStep({
            type: 'start',
            explanation: 'Java execution started (simulated)',
            variables: { input: 'Java code' }
        });
        
        this.addExecutionStep({
            type: 'end',
            explanation: 'Java execution completed (simulated)',
            variables: { result: 'Java result' }
        });
        
        return this.executionSteps;
    }
    
    executeCStyle(code, algorithmType) {
        // In a real implementation, this would use a C-style interpreter
        // For this demo, we'll simulate it
        this.addExecutionStep({
            type: 'start',
            explanation: 'C-style execution started (simulated)',
            variables: { input: 'C-style code' }
        });
        
        this.addExecutionStep({
            type: 'end',
            explanation: 'C-style execution completed (simulated)',
            variables: { result: 'C-style result' }
        });
        
        return this.executionSteps;
    }
}