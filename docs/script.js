// Fixed grid constants for PC layout
const GRID_WIDTH = 30;
const GRID_HEIGHT = 13;

// Mouse scaling configuration
const MOUSE_EFFECT_RADIUS = 150; // pixels
const MAX_SCALE_MULTIPLIER = 2.5;
const MIN_SCALE_MULTIPLIER = 1.0;

// Design dimensions (PC layout)
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

// Fullscreen functionality
const fullscreenUtils = {
    // Check if fullscreen is supported
    isSupported() {
        return !!(document.documentElement.requestFullscreen ||
                 document.documentElement.webkitRequestFullscreen ||
                 document.documentElement.mozRequestFullScreen ||
                 document.documentElement.msRequestFullscreen);
    },
    
    // Enter fullscreen
    async enter() {
        const element = document.documentElement;
        try {
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            }
            console.log('Entered fullscreen mode');
            return true;
        } catch (error) {
            console.log('Failed to enter fullscreen:', error);
            return false;
        }
    },
    
    // Exit fullscreen
    async exit() {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                await document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                await document.msExitFullscreen();
            }
            console.log('Exited fullscreen mode');
            return true;
        } catch (error) {
            console.log('Failed to exit fullscreen:', error);
            return false;
        }
    },
    
    // Check if currently in fullscreen
    isActive() {
        return !!(document.fullscreenElement ||
                 document.webkitFullscreenElement ||
                 document.mozFullScreenElement ||
                 document.msFullscreenElement);
    },
    
    // Toggle fullscreen
    async toggle() {
        if (this.isActive()) {
            return await this.exit();
        } else {
            return await this.enter();
        }
    }
};

// Mobile detection
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

// Check if device is in landscape mode
function isLandscape() {
    return window.innerWidth > window.innerHeight;
}

// Create fullscreen button for mobile
function createFullscreenButton() {
    if (!isMobileDevice() || !fullscreenUtils.isSupported()) return;
    
    const button = document.createElement('button');
    button.id = 'fullscreen-btn';
    button.innerHTML = '⛶';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: rgba(142, 227, 241, 0.2);
        border: 2px solid #8EE3F1;
        color: #8EE3F1;
        width: 50px;
        height: 50px;
        border-radius: 8px;
        font-size: 20px;
        cursor: pointer;
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `;
    
    // Update button appearance based on fullscreen state
    function updateButton() {
        if (fullscreenUtils.isActive()) {
            button.innerHTML = '⛷';
            button.title = 'Exit Fullscreen | 退出全屏';
        } else {
            button.innerHTML = '⛶';
            button.title = 'Enter Fullscreen | 进入全屏';
        }
    }
    
    button.addEventListener('click', async () => {
        await fullscreenUtils.toggle();
        updateButton();
        setTimeout(applyProportionalScaling, 100);
    });
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateButton);
    document.addEventListener('webkitfullscreenchange', updateButton);
    document.addEventListener('mozfullscreenchange', updateButton);
    document.addEventListener('MSFullscreenChange', updateButton);
    
    document.body.appendChild(button);
    updateButton();
    
    console.log('Fullscreen button created');
}

// Auto-enter fullscreen on landscape for mobile
async function handleOrientationForFullscreen() {
    if (!isMobileDevice() || !fullscreenUtils.isSupported()) return;
    
    // Only auto-enter fullscreen, don't auto-exit to avoid annoyance
    if (isLandscape() && !fullscreenUtils.isActive()) {
        // Show a brief notification before entering fullscreen
        showFullscreenTip();
        
        // Delay to let user read the tip
        setTimeout(async () => {
            const success = await fullscreenUtils.enter();
            if (success) {
                setTimeout(applyProportionalScaling, 100);
            }
        }, 1500);
    }
}

// Show fullscreen tip
function showFullscreenTip() {
    const tip = document.createElement('div');
    tip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(8, 32, 58, 0.95);
        border: 2px solid #8EE3F1;
        color: #8EE3F1;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 10001;
        font-size: 16px;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    tip.innerHTML = `
        <div>🌐 Entering fullscreen for better experience</div>
        <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">正在进入全屏以获得更好体验</div>
    `;
    
    document.body.appendChild(tip);
    
    // Remove tip after 2 seconds
    setTimeout(() => {
        if (tip.parentNode) {
            tip.parentNode.removeChild(tip);
        }
    }, 2000);
}

// Calculate and apply proportional scaling
function applyProportionalScaling() {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!contentWrapper) return;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate scale ratios
    const scaleX = screenWidth / DESIGN_WIDTH;
    const scaleY = screenHeight / DESIGN_HEIGHT;
    
    // Use the smaller scale to ensure content fits completely
    const scale = Math.min(scaleX, scaleY);
    
    // Apply the scale transform
    contentWrapper.style.transform = `scale(${scale})`;
    
    console.log(`Applied proportional scaling: ${scale.toFixed(3)}`);
    console.log(`Screen: ${screenWidth}x${screenHeight}, Design: ${DESIGN_WIDTH}x${DESIGN_HEIGHT}`);
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

// Convert text to binary matrix with word spacing (simplified - no responsive logic)
function textToBinaryMatrix(text) {
    const words = text.split(' ');
    const matrix = [];
    const wordLengths = [];
    
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
    
    return { matrix, wordLengths, processedWords: words };
}

// Get element center position in viewport
function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

// Calculate distance between two points
function getDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2) + 
        Math.pow(point1.y - point2.y, 2)
    );
}

// Get base scale for different matrix element types
function getBaseScale(element) {
    if (element.classList.contains('center')) {
        return 2.0;
    } else if (element.classList.contains('near-center')) {
        return 1.8;
    } else if (element.classList.contains('edge')) {
        return 1.3;
    } else if (element.classList.contains('matrix-bit')) {
        return 1.5; // fallback for matrix elements
    }
    return 1.0; // background numbers
}

// Calculate smart scaling based on mouse position and element type
function calculateSmartScale(element, mousePos) {
    const elementCenter = getElementCenter(element);
    const distance = getDistance(mousePos, elementCenter);
    const baseScale = getBaseScale(element);
    
    // If distance is beyond effect radius, return base scale
    if (distance > MOUSE_EFFECT_RADIUS) {
        return baseScale;
    }
    
    // Calculate mouse effect multiplier (1.0 at edge, MAX_SCALE_MULTIPLIER at center)
    const distanceRatio = 1 - (distance / MOUSE_EFFECT_RADIUS);
    const mouseMultiplier = 1 + (distanceRatio * (MAX_SCALE_MULTIPLIER - 1));
    
    // Apply smart scaling rules
    if (element.classList.contains('center')) {
        // Center elements cannot be scaled beyond their base scale
        return baseScale;
    } else if (element.classList.contains('near-center') || element.classList.contains('edge')) {
        // Matrix elements can be scaled up but not below their base scale
        return Math.max(baseScale, baseScale * mouseMultiplier);
    } else {
        // Background numbers can be freely scaled
        return Math.max(MIN_SCALE_MULTIPLIER, mouseMultiplier);
    }
}

// Apply mouse scaling effects to all grid elements
function applyMouseScaling(mousePos) {
    const section = document.querySelector('section');
    const gridElements = section.querySelectorAll('div');
    
    gridElements.forEach(element => {
        const scale = calculateSmartScale(element, mousePos);
        element.style.transform = `scale(${scale})`;
    });
}

// Handle mouse move events
function handleMouseMove(event) {
    const mousePos = {
        x: event.clientX,
        y: event.clientY
    };
    applyMouseScaling(mousePos);
}

// Handle touch move events for mobile devices
function handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling
    
    // Get the first touch point
    const touch = event.touches[0];
    if (touch) {
        const touchPos = {
            x: touch.clientX,
            y: touch.clientY
        };
        applyMouseScaling(touchPos);
    }
}

// Handle touch start events
function handleTouchStart(event) {
    event.preventDefault(); // Prevent default touch behavior
    
    const touch = event.touches[0];
    if (touch) {
        const touchPos = {
            x: touch.clientX,
            y: touch.clientY
        };
        applyMouseScaling(touchPos);
    }
}

// Handle touch end events
function handleTouchEnd(event) {
    event.preventDefault();
    // Reset scaling when finger lifts up
    resetScaling();
}

// Reset all elements to their base scales when mouse leaves
function resetScaling() {
    const section = document.querySelector('section');
    const gridElements = section.querySelectorAll('div');
    
    gridElements.forEach(element => {
        const baseScale = getBaseScale(element);
        element.style.transform = `scale(${baseScale})`;
    });
}

// Initialize the grid with fixed PC layout
function initializeGrid() {
    const section = document.querySelector('section');
    
    // Clear existing content
    section.innerHTML = '';
    
    console.log(`Initializing ${GRID_WIDTH}×${GRID_HEIGHT} grid`);
    
    // Create the text matrix (always full text)
    const text = "YOU DESERVE EVERYTHING";
    const { matrix: binaryMatrix, wordLengths, processedWords } = textToBinaryMatrix(text);
    
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
    
    // Set initial scaling for all elements
    resetScaling();
    
    console.log(`Created ${GRID_WIDTH}×${GRID_HEIGHT} grid with binary matrix for: "${processedWords.join(' ')}"`);
    console.log('Matrix size:', textWidth, 'x', textHeight);
    console.log('Matrix starts at:', { startRow: effectiveStartRow, startCol: effectiveStartCol });
}

// Initialize mouse and touch event listeners
function initializeMouseEvents() {
    const section = document.querySelector('section');
    
    // Add mouse move listener for scaling effects (desktop)
    section.addEventListener('mousemove', handleMouseMove);
    
    // Add touch event listeners for mobile devices
    section.addEventListener('touchstart', handleTouchStart, { passive: false });
    section.addEventListener('touchmove', handleTouchMove, { passive: false });
    section.addEventListener('touchend', handleTouchEnd, { passive: false });
    section.addEventListener('touchcancel', handleTouchEnd, { passive: false }); // Handle touch cancel
    
    // Reset scaling when mouse leaves the section (desktop only)
    section.addEventListener('mouseleave', resetScaling);
    
    console.log('Mouse and touch scaling events initialized');
}



// Handle window resize with proportional scaling
function handleResize() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        applyProportionalScaling();
        console.log('Applied proportional scaling on resize');
    }, 100);
}

// Handle fullscreen state changes
function handleFullscreenChange() {
    console.log('Fullscreen state changed:', fullscreenUtils.isActive());
    // Recalculate scaling when entering/exiting fullscreen
    setTimeout(() => {
        applyProportionalScaling();
    }, 100);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    initializeMouseEvents();
    applyProportionalScaling();
    createFullscreenButton(); // Initialize fullscreen button
    handleOrientationForFullscreen(); // Handle orientation for fullscreen
    
    // Listen for fullscreen changes globally
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
});

// Handle window resize and orientation changes
window.addEventListener('resize', handleResize);

// Force update after CSS loads
window.addEventListener('load', () => {
    setTimeout(() => {
        applyProportionalScaling();
    }, 100);
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        applyProportionalScaling();
        handleOrientationForFullscreen(); // Check if should enter fullscreen
    }, 100);
});