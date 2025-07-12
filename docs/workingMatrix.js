// 确保能工作的矩阵版本
// console.log('Working Matrix script loaded');

// HAPPY矩阵数据
const happyMatrix = [
    [0,1,1,0,1,0,0,0], // h
    [0,1,1,0,0,0,0,1], // a
    [0,1,1,1,0,0,0,0], // p
    [0,1,1,1,0,0,0,0], // p
    [0,1,1,1,1,0,0,1]  // y
];

// 定义网格规格
const GRID_WIDTH = 100;
const GRID_HEIGHT = 60;

// 转换字符为8位二进制
function charToBinary(char) {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
}

document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOM loaded, starting matrix placement');
    
    const divs = document.querySelectorAll('section div');
    // console.log('Found divs:', divs.length);
    
    // 基于实际div数量计算网格
    const totalDivs = divs.length;
    const cols = Math.floor(Math.sqrt(totalDivs * (16/9)));
    const rows = Math.ceil(totalDivs / cols);
    
    // console.log(`Grid: ${cols} cols x ${rows} rows`);
    
    // 清空并设置背景数字
    divs.forEach(div => {
        div.textContent = Math.floor(Math.random() * 8) + 2;
        div.style.color = '#8EE3F1';
        div.style.opacity = '0.3';
        div.style.fontSize = '14px';
        div.style.fontWeight = 'normal';
        div.style.transform = 'scale(1)';
    });
    
    // console.log('Background numbers filled');
    
    // 定义要显示的单词
    const word = "HAPPY";
    const wordLength = word.length;
    const matrixWidth = wordLength;
    const matrixHeight = 8; // 8位二进制
    
    // 计算在网格中的起始位置 (居中)
    const startRow = Math.floor((rows - matrixHeight) / 2);
    const startCol = Math.floor((cols - matrixWidth) / 2);
    
    // console.log(`Matrix placement: startRow=${startRow}, startCol=${startCol}`);
    // console.log(`Matrix size: ${matrixWidth} chars x ${matrixHeight} bits`);
    
    // 创建二进制矩阵
    const binaryMatrix = [];
    for (let i = 0; i < wordLength; i++) {
        const binary = charToBinary(word[i]);
        binaryMatrix.push(binary.split('').map(b => parseInt(b)));
    }
    
    // 在网格中放置二进制数据
    for (let row = 0; row < matrixHeight; row++) {
        for (let col = 0; col < matrixWidth; col++) {
            const gridRow = startRow + row;
            const gridCol = startCol + col;
            
            // 检查是否在网格范围内
            if (gridRow >= 0 && gridRow < rows && gridCol >= 0 && gridCol < cols) {
                const divIndex = gridRow * cols + gridCol;
                
                if (divIndex < divs.length) {
                    const div = divs[divIndex];
                    const value = binaryMatrix[col][row]; // 转置矩阵
                    
                    div.textContent = value;
                    div.style.color = '#8EE3F1';
                    div.style.opacity = '1';
                    div.style.fontSize = '16px';
                    div.style.fontWeight = 'bold';
                    
                    // 添加发光效果
                    div.style.textShadow = '0 0 10px #8EE3F1';
                    
                    // 根据位置调整缩放
                    const centerRow = Math.floor(matrixHeight / 2);
                    const centerCol = Math.floor(matrixWidth / 2);
                    const distanceFromCenter = Math.sqrt(
                        Math.pow(row - centerRow, 2) + 
                        Math.pow(col - centerCol, 2)
                    );
                    
                    let scale = 1.0;
                    if (distanceFromCenter <= 1) {
                        scale = 1.5;
                    } else if (distanceFromCenter <= 2) {
                        scale = 1.3;
                    } else {
                        scale = 1.1;
                    }
                    
                    div.style.transform = `scale(${scale})`;
                    
                    // console.log(`✅ Placed ${value} at (${row},${col}) index=${divIndex}, scale=${scale.toFixed(2)}`);
                }
            }
        }
    }
    
    // console.log('🎉 HAPPY matrix placement complete!');
    // console.log('You should see a glowing HAPPY matrix in the center of the screen');
});

// 鼠标效果只对背景数字生效
document.addEventListener('mousemove', function(e) {
    const backgroundDivs = document.querySelectorAll('section div:not(.matrix-cell)');
    backgroundDivs.forEach(div => {
        if(div.textContent) {
            const rect = div.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
            const scale = Math.max(0.8, Math.min(1.2, 1.0 + (150 - distance) / 300));
            
            div.style.transform = `scale(${scale})`;
        }
    });
}); 