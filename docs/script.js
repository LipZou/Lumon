// Dynamic grid constants - will be read from CSS variables
let GRID_WIDTH = 30;
let GRID_HEIGHT = 13;

// Get current grid size from CSS variables
function getGridSize() {
    const section = document.querySelector('section');
    const styles = getComputedStyle(section);
    const cols = parseInt(styles.getPropertyValue('--grid-cols')) || 30;
    const rows = parseInt(styles.getPropertyValue('--grid-rows')) || 13;
    return { cols, rows };
}

// Generate random number between 2-9
function getRandomNumber() {
    return Math.floor(Math.random() * 8) + 2;
}

// Convert character to 8-bit binary array
function charToBinary(char) {
    const ascii = char.charCodeAt(0);
    const binary = ascii.toString(2).padStart(8, '0');
    return binary.split('').map(bit => parseInt(bit));
}

// Convert text to binary matrix with word spacing
function textToBinaryMatrix(text, maxWidth = null) {
    const words = text.split(' ');
    const matrix = [];
    const wordLengths = [];
    
    // If maxWidth is specified, try to fit text within it
    let processedWords = words;
    if (maxWidth && text.length > maxWidth) {
        // For small screens, use abbreviated text
        if (maxWidth < 15) {
            processedWords = ['YOU', 'DESERVE'];
        } else if (maxWidth < 20) {
            processedWords = ['YOU', 'DESERVE', 'ALL'];
        }
    }
    
    // Create 8 rows (for 8 bits)
    for (let row = 0; row < 8; row++) {
        matrix[row] = [];
        
        // For each word
        for (let wordIndex = 0; wordIndex < processedWords.length; wordIndex++) {
            const word = processedWords[wordIndex];
            
            if (row === 0) {
                wordLengths.push(word.length);
            }
            
            // Add characters of the word
            for (let charIndex = 0; charIndex < word.length; charIndex++) {
                const char = word[charIndex];
                const binaryArray = charToBinary(char);
                matrix[row].push(binaryArray[row]);
            }
            
            // Add spacing between words (except after the last word)
            if (wordIndex < processedWords.length - 1) {
                matrix[row].push(-1); // Use -1 to represent spacing
            }
        }
    }
    
    return { matrix, wordLengths, processedWords };
}

// Initialize the grid with responsive sizing
function initializeGrid() {
    const section = document.querySelector('section');
    
    // Clear existing content
    section.innerHTML = '';
    
    // Get current grid size from CSS
    const { cols, rows } = getGridSize();
    GRID_WIDTH = cols;
    GRID_HEIGHT = rows;
    
    console.log(`Initializing ${GRID_WIDTH}×${GRID_HEIGHT} grid`);
    
    // Create the text matrix with responsive text fitting
    const text = "YOU DESERVE EVERYTHING";
    const maxTextWidth = Math.floor(GRID_WIDTH * 0.8); // Use 80% of grid width
    const { matrix: binaryMatrix, wordLengths, processedWords } = textToBinaryMatrix(text, maxTextWidth);
    
    // Calculate starting position to center the text
    const textWidth = binaryMatrix[0].length;
    const textHeight = 8;
    const startCol = Math.floor((GRID_WIDTH - textWidth) / 2);
    const startRow = Math.floor((GRID_HEIGHT - textHeight) / 2);
    
    // Ensure text fits within grid bounds
    const effectiveStartCol = Math.max(0, startCol);
    const effectiveStartRow = Math.max(0, startRow);
    
    // Calculate word start positions
    let wordStartPositions = [];
    let currentPos = 0;
    for (let i = 0; i < wordLengths.length; i++) {
        wordStartPositions.push(currentPos);
        currentPos += wordLengths[i] + 1; // +1 for spacing
    }
    
    // Create responsive grid
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const div = document.createElement('div');
            div.dataset.row = row;
            div.dataset.col = col;
            
            // Check if this position is part of the text matrix
            const matrixRow = row - effectiveStartRow;
            const matrixCol = col - effectiveStartCol;
            
            if (matrixRow >= 0 && matrixRow < textHeight && 
                matrixCol >= 0 && matrixCol < textWidth &&
                matrixCol < binaryMatrix[matrixRow].length) {
                
                const binaryValue = binaryMatrix[matrixRow][matrixCol];
                
                if (binaryValue === -1) {
                    // This is a spacing position - show random number
                    div.textContent = getRandomNumber();
                    div.style.color = '#8EE3F1';
                } else {
                    // This is part of the binary matrix
                    div.textContent = binaryValue;
                    div.style.color = '#8EE3F1';
                    div.classList.add('matrix-bit');
                    
                    // Find which word this position belongs to
                    let currentWord = -1;
                    for (let i = 0; i < wordStartPositions.length; i++) {
                        const wordStart = wordStartPositions[i];
                        const wordEnd = wordStart + wordLengths[i];
                        if (matrixCol >= wordStart && matrixCol < wordEnd) {
                            currentWord = i;
                            break;
                        }
                    }
                    
                    if (currentWord !== -1) {
                        // Calculate center point of current word
                        const wordStart = wordStartPositions[currentWord];
                        const wordLength = wordLengths[currentWord];
                        const wordCenterCol = wordStart + Math.floor(wordLength / 2);
                        const wordCenterRow = Math.floor(textHeight / 2);
                        
                        // Calculate distance from word center
                        const distanceFromCenter = Math.sqrt(
                            Math.pow(matrixRow - wordCenterRow, 2) + 
                            Math.pow(matrixCol - wordCenterCol, 2)
                        );
                        
                        // Add scaling classes based on distance
                        if (distanceFromCenter <= 1) {
                            div.classList.add('center');
                        } else if (distanceFromCenter <= 2) {
                            div.classList.add('near-center');
                        } else {
                            div.classList.add('edge');
                        }
                    }
                }
            } else {
                // Background random number
                div.textContent = getRandomNumber();
                div.style.color = '#8EE3F1';
            }
            
            section.appendChild(div);
        }
    }
    
    console.log(`Created ${GRID_WIDTH}×${GRID_HEIGHT} grid with binary matrix for: "${processedWords.join(' ')}"`);
    console.log('Matrix size:', textWidth, 'x', textHeight);
    console.log('Matrix starts at:', { startRow: effectiveStartRow, startCol: effectiveStartCol });
}

// Reinitialize on window resize to handle orientation changes
function handleResize() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        const { cols, rows } = getGridSize();
        if (cols !== GRID_WIDTH || rows !== GRID_HEIGHT) {
            console.log(`Grid size changed from ${GRID_WIDTH}×${GRID_HEIGHT} to ${cols}×${rows}`);
            initializeGrid();
        }
    }, 250);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeGrid);

// Reinitialize on window resize (for orientation changes, etc.)
window.addEventListener('resize', handleResize);

// Force update after CSS loads
window.addEventListener('load', () => {
    setTimeout(initializeGrid, 100);
});