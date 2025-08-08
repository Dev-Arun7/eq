// Undo/Redo System
let undoStack = [];
let redoStack = [];
const MAX_HISTORY = 50;

// Save current state to undo stack
function saveState() {
    const currentState = {...values};
    undoStack.push(currentState);
    
    // Keep stack size manageable
    if (undoStack.length > MAX_HISTORY) {
        undoStack.shift();
    }
    
    // Clear redo stack when new action is performed
    redoStack = [];
}

// Undo last action
function undo() {
    if (undoStack.length === 0) return;
    
    // Save current state to redo stack
    const currentState = {...values};
    redoStack.push(currentState);
    
    // Get previous state
    const previousState = undoStack.pop();
    
    // Apply previous state
    applyState(previousState);
}

// Redo last undone action  
function redo() {
    if (redoStack.length === 0) return;
    
    // Save current state to undo stack
    const currentState = {...values};
    undoStack.push(currentState);
    
    // Get next state
    const nextState = redoStack.pop();
    
    // Apply next state
    applyState(nextState);
}

// Apply state to all sliders and inputs
function applyState(state) {
    freqs.forEach(freq => {
        values[freq] = state[freq] || 0;
        const slider = document.querySelector(`input[data-freq="${freq}"]`);
        if (slider) {
            slider.value = values[freq];
            const valueInput = slider.nextElementSibling.querySelector('.value-input');
            if (valueInput) {
                valueInput.value = values[freq].toFixed(1);
            }
            updateEQFilter(freq, values[freq]);
        }
    });
    updateOutput();
}

// Add keyboard event listener
document.addEventListener('keydown', (e) => {
    // Ctrl+Z for undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    
    // Ctrl+Y or Ctrl+Shift+Z for redo
    if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
    }
});

// Modified slider event handler to save state before changes
function createSliderWithUndo(slider, freq) {
    let hasChanged = false;
    
    slider.addEventListener('mousedown', () => {
        if (!hasChanged) {
            saveState();
            hasChanged = true;
        }
    });
    
    slider.addEventListener('mouseup', () => {
        hasChanged = false;
    });
}