// Constants
const GRID_WIDTH = 30;
const GRID_HEIGHT = 13;

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
function textToBinaryMatrix(text) {
    const words = text.split(' ');
    const matrix = [];
    const wordLengths = []; // 记录每个单词的长度
    
    // Create 8 rows (for 8 bits)
    for (let row = 0; row < 8; row++) {
        matrix[row] = [];
        
        // For each word
        for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
            const word = words[wordIndex];
            
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
            if (wordIndex < words.length - 1) {
                matrix[row].push(-1); // Use -1 to represent spacing
            }
        }
    }
    
    return { matrix, wordLengths };
}

// Initialize the grid
function initializeGrid() {
    const section = document.querySelector('section');
    
    // Clear existing content
    section.innerHTML = '';
    
    // Create the text matrix
    const text = "YOU DESERVE EVERYTHING";
    const { matrix: binaryMatrix, wordLengths } = textToBinaryMatrix(text);
    
    // Calculate starting position to center the text
    const textWidth = binaryMatrix[0].length;
    const textHeight = 8;
    const startCol = Math.floor((GRID_WIDTH - textWidth) / 2);
    const startRow = Math.floor((GRID_HEIGHT - textHeight) / 2);
    
    // 计算每个单词的起始位置
    let wordStartPositions = [];
    let currentPos = 0;
    for (let i = 0; i < wordLengths.length; i++) {
        wordStartPositions.push(currentPos);
        currentPos += wordLengths[i] + 1; // +1 for spacing
    }
    
    // Create 30x13 grid
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const div = document.createElement('div');
            div.dataset.row = row;
            div.dataset.col = col;
            
            // Check if this position is part of the text matrix
            const matrixRow = row - startRow;
            const matrixCol = col - startCol;
            
            if (matrixRow >= 0 && matrixRow < textHeight && 
                matrixCol >= 0 && matrixCol < textWidth) {
                
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
                    
                    // 找出当前位置属于哪个单词
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
                        // 计算当前单词的中心点
                        const wordStart = wordStartPositions[currentWord];
                        const wordLength = wordLengths[currentWord];
                        const wordCenterCol = wordStart + Math.floor(wordLength / 2);
                        const wordCenterRow = Math.floor(textHeight / 2);
                        
                        // 计算与单词中心的距离
                        const distanceFromCenter = Math.sqrt(
                            Math.pow(matrixRow - wordCenterRow, 2) + 
                            Math.pow(matrixCol - wordCenterCol, 2)
                        );
                        
                        // 根据距离添加缩放类
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
    
    console.log(`Created ${GRID_WIDTH}×${GRID_HEIGHT} grid with binary matrix for: "${text}"`);
    console.log('Matrix size:', textWidth, 'x', textHeight);
    console.log('Matrix starts at:', { startRow, startCol });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeGrid);