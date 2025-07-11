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



// Simplified and more reliable mobile detection
function isMobileDevice() {
    // Primary detection: User Agent
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|phone|tablet/i.test(userAgent);
    
    // Secondary detection: Touch capability 
    const hasTouchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
    
    // Screen size detection - be more aggressive for mobile
    const isMobileSize = window.innerWidth <= 900 || window.innerHeight <= 900;
    
    // More liberal detection: if ANY indicator suggests mobile, treat as mobile
    const result = isMobileUA || hasTouchPoints || isMobileSize;
    
    // Force debug output to console
    console.warn('🔍 MOBILE DETECTION DEBUG:', {
        userAgent: userAgent,
        isMobileUA: isMobileUA,
        hasTouchPoints: hasTouchPoints,
        touchPoints: navigator.maxTouchPoints,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isMobileSize: isMobileSize,
        FINAL_RESULT: result
    });
    
    return result;
}









// Calculate and apply optimized scaling for different devices
function applyProportionalScaling() {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!contentWrapper) return;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isPortrait = screenHeight > screenWidth;
    const isMobile = isMobileDevice();
    
    // Calculate scale ratios
    const scaleX = screenWidth / DESIGN_WIDTH;
    const scaleY = screenHeight / DESIGN_HEIGHT;
    
    let scale;
    let strategy = '';
    
    // Force debug output
    console.warn('📐 SCALING DEBUG START:', {
        screenWidth, screenHeight, isPortrait, isMobile,
        scaleX: scaleX.toFixed(3), 
        scaleY: scaleY.toFixed(3)
    });
    
    if (isMobile) {
        // Mobile优化策略：最大化利用屏幕空间
        if (isPortrait) {
            // 手机竖屏：更激进的宽度填充策略
            const heightAfterWidthScale = DESIGN_HEIGHT * scaleX;
            const heightOverflow = heightAfterWidthScale / screenHeight;
            
            console.warn('📱 MOBILE PORTRAIT CALCULATION:', {
                heightAfterWidthScale: heightAfterWidthScale.toFixed(1),
                heightOverflow: heightOverflow.toFixed(3),
                willUseWidthScale: heightOverflow <= 1.30
            });
            
            if (heightOverflow <= 1.30) {
                // 进一步放宽限制：允许30%的高度溢出
                scale = scaleX;
                strategy = 'mobile-portrait-fill-width-super-aggressive';
            } else {
                // 只有在极端溢出时才完全适配
                scale = Math.min(scaleX, scaleY);
                strategy = 'mobile-portrait-fit-complete';
            }
        } else {
            // 手机横屏：优先填满高度
            const widthAfterHeightScale = DESIGN_WIDTH * scaleY;
            const widthOverflow = widthAfterHeightScale / screenWidth;
            
            if (widthOverflow <= 1.15) {
                scale = scaleY;
                strategy = 'mobile-landscape-fill-height';
            } else {
                scale = Math.min(scaleX, scaleY);
                strategy = 'mobile-landscape-fit-complete';
            }
        }
    } else {
        // PC端：绝对保证完整显示，零溢出政策
        scale = Math.min(scaleX, scaleY);
        
        // 为PC端添加额外的安全边距，确保header完全可见
        const safetyMargin = 0.98; // 留2%安全边距
        scale = scale * safetyMargin;
        
        strategy = isPortrait ? 'pc-portrait-safe-fit' : 'pc-landscape-safe-fit';
    }
    
    // Apply the scale transform with device-specific centering
    contentWrapper.style.transform = `scale(${scale})`;
    
    if (isMobile && isPortrait) {
        // Mobile portrait: scale from left center to fill width properly
        contentWrapper.style.transformOrigin = 'left center';
    } else {
        // PC and mobile landscape: normal center scaling
        contentWrapper.style.transformOrigin = 'center center';
    }
    
    // Enhanced debug output
    console.warn('🎯 SCALING APPLIED:', {
        finalScale: scale.toFixed(3),
        strategy: strategy,
        device: isMobile ? 'MOBILE' : 'PC',
        orientation: isPortrait ? 'PORTRAIT' : 'LANDSCAPE',
        transform: `scale(${scale.toFixed(3)})`
    });
    
    // Show debug info on page (temporary)
    showDebugInfo(scale, strategy, isMobile, isPortrait, screenWidth, screenHeight);
    
    console.log(`Applied optimized scaling: ${scale.toFixed(3)} (${strategy})`);
    console.log(`Device: ${isMobile ? 'Mobile' : 'PC'}, Orientation: ${isPortrait ? 'Portrait' : 'Landscape'}`);
    console.log(`Screen: ${screenWidth}x${screenHeight}, Design: ${DESIGN_WIDTH}x${DESIGN_HEIGHT}`);
    console.log(`Scale ratios - X: ${scaleX.toFixed(3)}, Y: ${scaleY.toFixed(3)}`);
}

// Show debug information on the page
function showDebugInfo(scale, strategy, isMobile, isPortrait, screenWidth, screenHeight) {
    // Remove existing debug info
    const existingDebug = document.getElementById('debug-info');
    if (existingDebug) {
        existingDebug.remove();
    }
    
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-info';
    debugDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 10px;
        font-size: 12px;
        z-index: 999999;
        border-radius: 5px;
        font-family: monospace;
        line-height: 1.3;
        max-width: 300px;
    `;
    
    debugDiv.innerHTML = `
        <div><strong>🔍 DEBUG INFO</strong></div>
        <div>Device: ${isMobile ? 'MOBILE' : 'PC'}</div>
        <div>Orientation: ${isPortrait ? 'Portrait' : 'Landscape'}</div>
        <div>Screen: ${screenWidth}×${screenHeight}</div>
        <div>Scale: ${scale.toFixed(3)}</div>
        <div>Strategy: ${strategy}</div>
        <div>ScaleX: ${(screenWidth / DESIGN_WIDTH).toFixed(3)}</div>
        <div>ScaleY: ${(screenHeight / DESIGN_HEIGHT).toFixed(3)}</div>
    `;
    
    document.body.appendChild(debugDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (debugDiv.parentNode) {
            debugDiv.parentNode.removeChild(debugDiv);
        }
    }, 5000);
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



// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    initializeMouseEvents();
    applyProportionalScaling();
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
    }, 100);
});