# Universal Algorithm Visualizer

A generic, interactive code visualization website that can visualize any programming algorithm step-by-step using animations and visuals.

## Features

### 🎯 Core Functionality
- **Multi-language support**: JavaScript, Python, Java, C-style pseudocode
- **Algorithm type selection**: Sorting, Searching, Graph, Dynamic Programming, Recursion, etc.
- **Interactive execution**: Step-by-step, auto-play, pause/resume, speed control
- **Visualization types**: Arrays, Graphs, Trees, Variables, Recursion call stacks

### 🖥️ UI/UX
- **Split-screen layout**: Code editor + Visualization canvas
- **Dark mode**: Modern, eye-friendly interface
- **Zoom & pan**: Navigate complex visualizations
- **Responsive design**: Works on different screen sizes

### 📊 Learning Features
- **Variable tracking**: Watch variables change in real-time
- **Complexity analysis**: Time and space complexity display
- **Step explanations**: Beginner-friendly descriptions
- **Algorithm presets**: Common algorithms ready to visualize

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Code Editor**: CodeMirror with multiple language modes
- **Parsing**: Acorn for JavaScript AST analysis
- **Visualization**: Canvas API for dynamic rendering
- **Styling**: Custom CSS with dark/light theme support

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources)

### Running the Application
1. Open `index.html` in your web browser
2. Select an algorithm type from the dropdown
3. Choose a programming language
4. Write or paste your code in the editor
5. Enter input values in the input field
6. Click "Run & Visualize" to start the visualization

### Using Algorithm Presets
1. Select a preset algorithm from the dropdown (e.g., "Bubble Sort")
2. The code and sample input will be loaded automatically
3. Click "Run & Visualize" to see the algorithm in action

## Controls

- **Run & Visualize**: Start the visualization
- **Step**: Execute one step at a time
- **Pause/Resume**: Pause or resume the visualization
- **Reset**: Reset the visualization to the beginning
- **Speed**: Adjust the animation speed
- **Auto-play**: Toggle automatic step-by-step execution
- **Zoom In/Out**: Zoom the visualization canvas
- **Reset Zoom**: Reset zoom level to default
- **Theme Toggle**: Switch between light and dark themes
- **Format Code**: Auto-format the code in the editor

## Algorithm Examples

The application includes several built-in algorithm examples:

### Sorting Algorithms
- Bubble Sort
- Quick Sort
- Merge Sort

### Search Algorithms
- Binary Search
- Linear Search

### Graph Algorithms
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Dijkstra's Algorithm

### Recursive Algorithms
- Fibonacci Sequence
- Factorial Calculation

## Visualization Types

### Array Visualization
- Shows arrays as boxes with values
- Highlights current elements being processed
- Displays pointers and indices
- Animates swaps and comparisons

### Graph Visualization
- Displays nodes and edges
- Shows traversal paths
- Highlights current node
- Animates graph operations

### Recursion Visualization
- Visualizes the call stack
- Shows function parameters and return values
- Highlights current function call
- Animates recursive calls and returns

### Variable Visualization
- Displays all variables and their current values
- Updates in real-time as execution progresses
- Shows variable changes between steps

## Complexity Analysis

The visualizer provides estimated time and space complexity for each algorithm:

- **Time Complexity**: Big-O notation (e.g., O(n), O(n²), O(log n))
- **Space Complexity**: Big-O notation for memory usage

## Limitations

### Current Implementation
- JavaScript execution is fully functional
- Python, Java, and C-style support is simulated (visualization only)
- Complexity analysis is estimated, not calculated precisely
- Some advanced language features may not be fully supported

### Future Enhancements
- Full multi-language support with actual interpreters
- More accurate complexity analysis
- Export visualization as GIF/video
- Save and share code links
- More algorithm presets and examples

## Development

### Project Structure
```
/
├── index.html              # Main application
├── css/
│   ├── main.css           # Main styles
│   └── dark-theme.css     # Dark theme styles
├── js/
│   ├── main.js            # Main application logic
│   ├── visualization-engine.js  # Visualization rendering
│   ├── code-executor.js    # Code execution and analysis
│   └── ui-controls.js      # UI controls and interactions
├── assets/
│   └── examples.js         # Algorithm examples
└── README.md              # This file
```

### Dependencies
- CodeMirror: Syntax-highlighted code editor
- Acorn: JavaScript parser for AST analysis
- Font Awesome: Icons for UI elements

### Building
No build process required. Simply open `index.html` in a browser.

## Contributing

Contributions are welcome! Please feel free to:
- Report bugs and issues
- Suggest new features
- Add more algorithm examples
- Improve the visualization engine
- Enhance the code execution capabilities

## License

This project is open source and available under the MIT License.

## Acknowledgements

- CodeMirror team for the excellent code editor
- Acorn contributors for the JavaScript parser
- Font Awesome for the icon set
- All open-source contributors whose work makes this possible

## Contact

For questions, suggestions, or feedback, please open an issue on the project repository.