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

// Fullscreen functionality with iOS Safari support
const fullscreenUtils = {
    // Check if fullscreen is supported
    isSupported() {
        // Check for standard Fullscreen API
        const standardSupport = !!(document.documentElement.requestFullscreen ||
                 document.documentElement.webkitRequestFullscreen ||
                 document.documentElement.mozRequestFullScreen ||
                 document.documentElement.msRequestFullscreen);
        
        // Check for iOS Safari specific support
        const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const hasWebkitSupport = !!document.documentElement.webkitRequestFullscreen;
        
        console.log('Fullscreen support check:', {
            standardSupport: standardSupport,
            isSafariIOS: isSafariIOS,
            hasWebkitSupport: hasWebkitSupport,
            userAgent: navigator.userAgent
        });
        
        return standardSupport || (isSafariIOS && hasWebkitSupport);
    },
    
    // iOS Safari specific fullscreen method
    async enterIOS() {
        try {
            const element = document.documentElement;
            if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
                return true;
            } else if (element.webkitEnterFullscreen) {
                await element.webkitEnterFullscreen();
                return true;
            }
            return false;
        } catch (error) {
            console.log('iOS fullscreen failed:', error);
            return false;
        }
    },
    
    // Enter fullscreen with iOS support
    async enter() {
        const element = document.documentElement;
        
        // Detect iOS Safari
        const isSafariIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        
        try {
            if (isSafariIOS) {
                // Try iOS specific methods first
                if (element.webkitRequestFullscreen) {
                    await element.webkitRequestFullscreen();
                    console.log('Entered fullscreen using webkit (iOS)');
                    return true;
                }
            }
            
            // Standard methods
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                await element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                await element.msRequestFullscreen();
            } else {
                throw new Error('No fullscreen method available');
            }
            
            console.log('Entered fullscreen mode');
            return true;
        } catch (error) {
            console.log('Failed to enter fullscreen:', error);
            
            // Fallback: Show manual instructions for iOS
            if (isSafariIOS) {
                this.showManualFullscreenInstructions();
                return false;
            }
            
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
    
    // Show manual fullscreen instructions for iOS
    showManualFullscreenInstructions() {
        const instructions = document.createElement('div');
        instructions.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(8, 32, 58, 0.95);
            color: #8EE3F1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
            font-size: 18px;
            line-height: 1.6;
        `;
        
        instructions.innerHTML = `
            <div style="max-width: 400px;">
                <div style="font-size: 48px; margin-bottom: 20px;">📱</div>
                <div style="font-size: 24px; margin-bottom: 20px; color: #ffffff;">手动进入全屏模式</div>
                <div style="margin-bottom: 30px;">
                    在Safari中，点击地址栏右侧的<br/>
                    <strong style="color: #8EE3F1;">分享按钮 📤</strong><br/>
                    然后选择<br/>
                    <strong style="color: #8EE3F1;">"添加到主屏幕"</strong>
                </div>
                <div style="margin-bottom: 30px; font-size: 16px; opacity: 0.8;">
                    或者将手机横屏并隐藏地址栏<br/>
                    获得更好的全屏体验
                </div>
                <button id="close-instructions" style="
                    background: rgba(142, 227, 241, 0.3);
                    border: 2px solid #8EE3F1;
                    color: #8EE3F1;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    touch-action: manipulation;
                ">我知道了</button>
            </div>
        `;
        
        const closeButton = instructions.querySelector('#close-instructions');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(instructions);
        });
        
        document.body.appendChild(instructions);
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

// Mobile detection (improved)
function isMobileDevice() {
    // More comprehensive mobile detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|phone|tablet/i.test(userAgent);
    const hasTouchPoints = navigator.maxTouchPoints && navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 1024;
    
    const result = isMobileUA || hasTouchPoints || isSmallScreen;
    console.log('Mobile detection:', {
        userAgent: userAgent,
        isMobileUA: isMobileUA,
        hasTouchPoints: hasTouchPoints,
        touchPoints: navigator.maxTouchPoints,
        screenWidth: window.innerWidth,
        isSmallScreen: isSmallScreen,
        result: result
    });
    
    return result;
}

// Check if device is in landscape mode
function isLandscape() {
    return window.innerWidth > window.innerHeight;
}

// Create fullscreen button for mobile (with improved visibility)
function createFullscreenButton() {
    console.log('Attempting to create fullscreen button...');
    console.log('isMobileDevice():', isMobileDevice());
    console.log('fullscreenUtils.isSupported():', fullscreenUtils.isSupported());
    
    // Always create button on mobile-like devices, even if fullscreen might not be supported
    if (!isMobileDevice()) {
        console.log('Not creating button: not a mobile device');
        return;
    }
    
    // Remove existing button if any
    const existingButton = document.getElementById('fullscreen-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    const button = document.createElement('button');
    button.id = 'fullscreen-btn';
    button.innerHTML = '⛶';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        background: rgba(142, 227, 241, 0.3);
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
        box-shadow: 0 0 10px rgba(142, 227, 241, 0.5);
        -webkit-backdrop-filter: blur(10px);
        touch-action: manipulation;
    `;
    
    // Update button appearance based on fullscreen state
    function updateButton() {
        if (fullscreenUtils.isActive()) {
            button.innerHTML = '⛷';
            button.title = 'Exit Fullscreen | 退出全屏';
            button.style.background = 'rgba(255, 100, 100, 0.3)';
            button.style.borderColor = '#ff6464';
            button.style.color = '#ff6464';
        } else {
            button.innerHTML = '⛶';
            button.title = 'Enter Fullscreen | 进入全屏';
            button.style.background = 'rgba(142, 227, 241, 0.3)';
            button.style.borderColor = '#8EE3F1';
            button.style.color = '#8EE3F1';
        }
    }
    
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Fullscreen button clicked');
        
        if (fullscreenUtils.isSupported()) {
            const success = await fullscreenUtils.toggle();
            console.log('Fullscreen toggle result:', success);
            updateButton();
            setTimeout(applyProportionalScaling, 100);
        } else {
            // Fallback for unsupported browsers
            console.log('Fullscreen not supported, showing tip');
            showFullscreenTip('该浏览器不支持全屏功能');
        }
    });
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', updateButton);
    document.addEventListener('webkitfullscreenchange', updateButton);
    document.addEventListener('mozfullscreenchange', updateButton);
    document.addEventListener('MSFullscreenChange', updateButton);
    
    // Ensure button is added to body and visible
    document.body.appendChild(button);
    updateButton();
    
    // Force show button after intro animation
    setTimeout(() => {
        button.style.display = 'flex';
        button.style.opacity = '1';
    }, 5000); // After intro animation completes
    
    console.log('Fullscreen button created and added to DOM');
    console.log('Button element:', button);
    
    return button;
}

// Create a simple test button to verify mobile detection and visibility
function createTestButton() {
    console.log('Creating test button for debugging...');
    
    const testButton = document.createElement('div');
    testButton.id = 'test-btn';
    testButton.innerHTML = '🔍';
    testButton.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 999999;
        background: rgba(255, 0, 0, 0.8);
        border: 2px solid #ff0000;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
    `;
    
    testButton.addEventListener('click', () => {
        console.log('Test button clicked!');
        console.log('Screen size:', window.innerWidth, 'x', window.innerHeight);
        console.log('User agent:', navigator.userAgent);
        console.log('Touch points:', navigator.maxTouchPoints);
        console.log('Is mobile:', isMobileDevice());
        console.log('Fullscreen supported:', fullscreenUtils.isSupported());
        
        // Show info in a tip
        showFullscreenTip(`测试按钮工作正常！屏幕: ${window.innerWidth}x${window.innerHeight}`);
    });
    
    document.body.appendChild(testButton);
    console.log('Test button created and added');
    
    return testButton;
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
function showFullscreenTip(customMessage = null) {
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
        z-index: 999999;
        font-size: 16px;
        max-width: 300px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    `;
    
    if (customMessage) {
        tip.innerHTML = `<div>🌐 ${customMessage}</div>`;
    } else {
        tip.innerHTML = `
            <div>🌐 Entering fullscreen for better experience</div>
            <div style="font-size: 14px; margin-top: 8px; opacity: 0.8;">正在进入全屏以获得更好体验</div>
        `;
    }
    
    document.body.appendChild(tip);
    
    // Remove tip after 3 seconds
    setTimeout(() => {
        if (tip.parentNode) {
            tip.parentNode.removeChild(tip);
        }
    }, 3000);
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
    
    // Create test button for debugging visibility issues
    console.log('Creating test button for debugging...');
    createTestButton();
    
    // Create fullscreen button immediately for debugging
    console.log('Creating fullscreen button on DOMContentLoaded...');
    createFullscreenButton();
    
    // Create button again after intro animation to ensure visibility
    setTimeout(() => {
        console.log('Creating fullscreen button after intro delay...');
        createFullscreenButton();
        handleOrientationForFullscreen();
    }, 5000);
    
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
        // Ensure button is created after everything loads
        console.log('Creating fullscreen button after window load...');
        createFullscreenButton();
    }, 100);
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        applyProportionalScaling();
        handleOrientationForFullscreen(); // Check if should enter fullscreen
    }, 100);
});