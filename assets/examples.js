// Algorithm Examples
const ALGORITHM_EXAMPLES = {
    'bubble-sort': {
        name: 'Bubble Sort',
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
        input: '[5, 2, 9, 1, 5, 6]',
        description: 'Simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
    },
    
    'quick-sort': {
        name: 'Quick Sort',
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
        input: '[5, 2, 9, 1, 5, 6]',
        description: 'Divide and conquer algorithm that selects a pivot element and partitions the array around the pivot.'
    },
    
    'binary-search': {
        name: 'Binary Search',
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
        input: '[1, 2, 5, 5, 6, 9]',
        description: 'Efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.'
    }
};