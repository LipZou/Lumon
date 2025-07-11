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
    
    console.log('Mobile detection:', {
        userAgent: userAgent,
        isMobileUA: isMobileUA,
        hasTouchPoints: hasTouchPoints,
        touchPoints: navigator.maxTouchPoints,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        isMobileSize: isMobileSize,
        result: result
    });
    
    return result;
}









// Simple and effective mobile-first scaling
function applyProportionalScaling() {
    const contentWrapper = document.querySelector('.content-wrapper');
    if (!contentWrapper) return;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const isPortrait = screenHeight > screenWidth;
    const isSmallScreen = screenWidth <= 768; // Simple mobile detection
    
    // Calculate scale ratios
    const scaleX = screenWidth / DESIGN_WIDTH;
    const scaleY = screenHeight / DESIGN_HEIGHT;
    
    let scale;
    let transformOrigin = 'center center';
    let strategy = '';
    
    // Optimized mobile strategy based on user feedback
    if (isSmallScreen && isPortrait) {
        // Mobile portrait: fill width, center vertically
        scale = scaleX;
        transformOrigin = 'left center';
        strategy = 'mobile-portrait-width-fill-center';
        
        // Apply mobile portrait styles - absolute positioning for width fill
        contentWrapper.style.position = 'absolute';
        contentWrapper.style.left = '0';
        contentWrapper.style.top = '50%';
        contentWrapper.style.transform = `translateY(-50%) scale(${scale})`;
        
        // Allow scrolling in portrait if needed
        document.body.style.overflow = 'auto';
        
    } else if (isSmallScreen && !isPortrait) {
        // Mobile landscape: fill width but ensure no scrolling
        const scaleForWidth = scaleX;
        const heightAfterWidthScale = DESIGN_HEIGHT * scaleForWidth;
        
        if (heightAfterWidthScale <= screenHeight) {
            // Width fill doesn't cause overflow - use it
            scale = scaleForWidth;
            strategy = 'mobile-landscape-width-fill-safe';
        } else {
            // Width fill would cause scrolling - use height fill instead
            scale = scaleY;
            strategy = 'mobile-landscape-height-fill-fallback';
        }
        
        transformOrigin = 'center center';
        
        // Reset to centered positioning and prevent scrolling
        contentWrapper.style.position = 'relative';
        contentWrapper.style.left = 'auto';
        contentWrapper.style.top = 'auto';
        contentWrapper.style.transform = `scale(${scale})`;
        
        // Ensure no scrolling
        document.body.style.overflow = 'hidden';
        
    } else {
        // PC: safe fit
        scale = Math.min(scaleX, scaleY) * 0.98;
        transformOrigin = 'center center';
        strategy = 'pc-safe-fit';
        
        // Reset styles for PC
        contentWrapper.style.position = 'relative';
        contentWrapper.style.left = 'auto';
        contentWrapper.style.top = 'auto';
        contentWrapper.style.transform = `scale(${scale})`;
        
        // Allow normal scrolling on PC
        document.body.style.overflow = 'auto';
    }
    
    // Set transform origin
    contentWrapper.style.transformOrigin = transformOrigin;
    
    // Force container styles
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer && isSmallScreen && isPortrait) {
        // Portrait: left align horizontally, center vertically
        mainContainer.style.justifyContent = 'flex-start';
        mainContainer.style.alignItems = 'center';
    } else if (mainContainer) {
        // Landscape and PC: center everything
        mainContainer.style.justifyContent = 'center';
        mainContainer.style.alignItems = 'center';
    }
    
    console.log(`Applied scaling: ${scale.toFixed(3)} (${strategy})`);
    console.log(`Device: ${isSmallScreen ? 'Mobile' : 'PC'}, Orientation: ${isPortrait ? 'Portrait' : 'Landscape'}`);
    console.log(`Screen: ${screenWidth}x${screenHeight}, ScaleX: ${scaleX.toFixed(3)}, ScaleY: ${scaleY.toFixed(3)}`);
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



// Show Lumon letter modal after intro animation
function showLumonLetter() {
    const modal = document.createElement('div');
    modal.id = 'lumon-letter-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(8, 32, 58, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;
    
    const letterContent = document.createElement('div');
    letterContent.style.cssText = `
        background: #08203A;
        border: 2px solid #8EE3F1;
        color: #8EE3F1;
        padding: 40px;
        border-radius: 8px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        font-family: 'Share Tech Mono', monospace;
        font-size: 14px;
        line-height: 1.6;
        box-shadow: 0 0 20px rgba(142, 227, 241, 0.3);
    `;
    
    letterContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-family: 'Russo One', sans-serif; font-size: 20px; letter-spacing: 4px; color: #8EE3F1;">LUMON INDUSTRIES</div>
            <div style="font-size: 12px; margin-top: 5px; opacity: 0.8;">MACRODATA REFINEMENT DEPARTMENT</div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <strong>Dear Eileen Y.,</strong>
        </div>
        
        <div style="margin-bottom: 15px;">
            On behalf of Lumon Industries, and specifically the Macrodata Refinement Department, we extend our sincere congratulations on the anniversary of your birth. This occasion marks a full cycle of terrestrial rotation, and we encourage you to reflect on your contributions to the greater whole.
        </div>
        
        <div style="margin-bottom: 15px;">
            The Macrodata Refinement Department has, for the past year, observed your behaviors with precision and discretion. It is with great satisfaction that we note your consistently exceptional performance, both in observable and inferred metrics.
        </div>
        
        <div style="margin-bottom: 15px;">
            In recognition of these qualities, you are hereby invited to join the Lumon collective. Upon acceptance, you may report to the Macrodata Refinement Department to receive a welcome token curated for new employees.
        </div>
        
        <div style="margin-bottom: 15px;">
            We anticipate, with measured enthusiasm, your continued excellence over the next cycle. The work is mysterious. The work is vital. The work is for the good of all.
        </div>
        
        <div style="margin-bottom: 30px;">
            <div><strong>With all due reverence,</strong></div>
            <div style="margin-top: 10px; font-style: italic;">Lumon Industries – Macrodata Refinement Department</div>
        </div>
        
        <div style="text-align: center;">
            <button id="lumon-accept-btn" style="
                background: rgba(142, 227, 241, 0.2);
                border: 2px solid #8EE3F1;
                color: #8EE3F1;
                padding: 15px 30px;
                font-family: 'Russo One', sans-serif;
                font-size: 16px;
                letter-spacing: 2px;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            ">FOR THE GOOD OF ALL</button>
        </div>
    `;
    
    modal.appendChild(letterContent);
    document.body.appendChild(modal);
    
    // Button click handler
    document.getElementById('lumon-accept-btn').addEventListener('click', () => {
        modal.remove();
        showBirthdayAnimation();
    });
    
    // Add hover effect to button
    const btn = document.getElementById('lumon-accept-btn');
    btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(142, 227, 241, 0.4)';
        btn.style.boxShadow = '0 0 15px rgba(142, 227, 241, 0.6)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(142, 227, 241, 0.2)';
        btn.style.boxShadow = 'none';
    });
}

// Show birthday animation (same as intro but different text)
function showBirthdayAnimation() {
    const birthdayIntro = document.createElement('div');
    birthdayIntro.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        z-index: 99999;
        background-color: #08203A;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fade-out ease-in 0.3s forwards;
        animation-delay: 4.5s;
    `;
    
    birthdayIntro.innerHTML = `
        <div class="logo">
            <svg class="logo-svg" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="
                position: absolute;
                z-index: 999999;
                height: 21px;
                top: 42px;
                right: 43px;
                opacity: 0;
                animation: fade-in ease-in 1s forwards;
                animation-delay: 2s;
            ">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8V40C0 44.4183 3.58172 48 8 48H40C44.4183 48 48 44.4183 48 40V8C48 3.58172 44.4183 0 40 0H8ZM36 28.75C36 24.2402 32.0006 16.6575 24 6C15.9994 16.6575 12 24.2402 12 28.75C12 35.5155 17.3726 41 24 41C30.6274 41 36 35.5155 36 28.75Z" fill="#8EE3F1"/>
            </svg>
            <span style="
                position: absolute;
                top: 36px;
                left: 28px;
                font-family: 'Russo One', sans-serif;
                font-size: 20px;
                letter-spacing: 8px;
                z-index: 99999;
                opacity: 0;
                animation: fade-in ease-in 1s forwards;
                animation-delay: 2s;
                color: #8EE3F1;
                text-align: center;
                width: 300px;
                left: -90px;
            ">HAPPY BIRTHDAY<br/><span style="font-size: 24px; letter-spacing: 12px;">EILEEN Y.</span></span>
            <span style="
                position: absolute;
                width: 0;
                top: 33px;
                left: 20px;
                height: 40px;
                background-color: #08203A;
                z-index: 9999;
                animation: grow linear 0.6s forwards;
                animation-delay: 1.5s;
            "></span>
            <span style="
                display: block;
                width: 200px;
                height: 100px;
                border: 2px solid #8EE3F1;
                border-radius: 100%;
                position: relative;
            ">
                <span style="
                    content: '';
                    width: 0;
                    height: 100%;
                    position: absolute;
                    top: -2px;
                    left: 50%;
                    border: 2px solid #8EE3F1;
                    border-radius: 100%;
                    animation: scale72 linear 1s forwards;
                    animation-delay: 1s;
                    opacity: 0;
                    display: block;
                "></span>
                <span style="
                    content: '';
                    width: 0;
                    height: 100%;
                    position: absolute;
                    top: -2px;
                    left: 50%;
                    border: 2px solid #8EE3F1;
                    border-radius: 100%;
                    animation: scale33 linear 1s forwards;
                    animation-delay: 1.8s;
                    opacity: 0;
                    display: block;
                "></span>
            </span>
        </div>
    `;
    
    // Add borders animation
    const logo = birthdayIntro.querySelector('.logo');
    logo.style.cssText = `
        position: relative;
        opacity: 1;
        animation: fade-out ease-in 1s forwards;
        animation-delay: 3.3s;
    `;
    
    // Add top border
    const topBorder = document.createElement('span');
    topBorder.style.cssText = `
        content: '';
        position: absolute;
        left: 21px;
        top: 21px;
        width: 0;
        margin-left: 80%;
        height: 2px;
        background-color: #8EE3F1;
        animation: grow ease-in 0.8s forwards;
        animation-delay: 1.5s;
        display: block;
    `;
    logo.appendChild(topBorder);
    
    // Add bottom border
    const bottomBorder = document.createElement('span');
    bottomBorder.style.cssText = `
        content: '';
        position: absolute;
        left: 21px;
        bottom: 21px;
        width: 0;
        height: 2px;
        background-color: #8EE3F1;
        animation: grow ease-in 0.8s forwards;
        animation-delay: 2s;
        display: block;
    `;
    logo.appendChild(bottomBorder);
    
    document.body.appendChild(birthdayIntro);
    
    // Remove after animation completes
    setTimeout(() => {
        if (birthdayIntro.parentNode) {
            birthdayIntro.parentNode.removeChild(birthdayIntro);
        }
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    initializeMouseEvents();
    applyProportionalScaling();
    
    // Show Lumon letter after intro animation completes
    setTimeout(() => {
        showLumonLetter();
    }, 5000); // 5 seconds to match intro animation duration
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