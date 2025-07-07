// 确保能工作的矩阵版本
console.log('Working Matrix script loaded');

// HAPPY矩阵数据
const happyMatrix = [
    [0,1,1,0,1,0,0,0], // h
    [0,1,1,0,0,0,0,1], // a
    [0,1,1,1,0,0,0,0], // p
    [0,1,1,1,0,0,0,0], // p
    [0,1,1,1,1,0,0,1]  // y
];

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting matrix placement');
    
    const divs = document.querySelectorAll('section div');
    console.log('Found divs:', divs.length);
    
    // 网格尺寸：16列 x 10行
    const cols = 16;
    const rows = 10;
    console.log(`Grid: ${cols} cols x ${rows} rows`);
    
    // 先填充所有div为随机数字
    divs.forEach((div, index) => {
        const randomNum = Math.floor(Math.random() * 8) + 2;
        div.textContent = randomNum;
        div.style.color = 'rgba(255, 255, 255, 0.4)';
        div.style.fontSize = '16px';
        div.style.fontWeight = 'normal';
        div.style.transform = 'scale(1)';
    });
    
    console.log('Background numbers filled');
    
    // 计算HAPPY矩阵的居中位置
    const matrixWidth = happyMatrix.length; // 5个字符
    const matrixHeight = 8; // 8位二进制
    const startCol = Math.floor((cols - matrixWidth) / 2); // 居中列
    const startRow = Math.floor((rows - matrixHeight) / 2); // 居中行
    
    console.log(`Matrix placement: startRow=${startRow}, startCol=${startCol}`);
    console.log(`Matrix size: ${matrixWidth} chars x ${matrixHeight} bits`);
    
    // 计算矩阵中心点用于放大效果
    const centerRow = startRow + matrixHeight / 2;
    const centerCol = startCol + matrixWidth / 2;
    
    // 放置HAPPY矩阵
    for(let charIndex = 0; charIndex < happyMatrix.length; charIndex++) {
        for(let bitIndex = 0; bitIndex < happyMatrix[charIndex].length; bitIndex++) {
            const row = startRow + bitIndex;
            const col = startCol + charIndex;
            const divIndex = row * cols + col;
            
            if(divIndex < divs.length && row >= 0 && col >= 0 && row < rows && col < cols) {
                const div = divs[divIndex];
                const value = happyMatrix[charIndex][bitIndex];
                
                div.textContent = value;
                div.style.color = value === 1 ? '#00ff00' : '#ff4444';
                div.style.fontWeight = 'bold';
                div.style.fontSize = '20px';
                
                // 计算距离中心的距离
                const distanceFromCenter = Math.sqrt(
                    Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2)
                );
                
                // 放大效果：中心最大，向外递减
                const scale = 1.5 + Math.max(0, 1.0 - distanceFromCenter * 0.3);
                div.style.transform = `scale(${scale})`;
                
                // 发光效果
                if(value === 1) {
                    div.style.textShadow = '0 0 15px #00ff00, 0 0 25px #00ff00';
                } else {
                    div.style.textShadow = '0 0 10px #ff4444';
                }
                
                div.classList.add('matrix-cell');
                console.log(`✅ Placed ${value} at (${row},${col}) index=${divIndex}, scale=${scale.toFixed(2)}`);
            } else {
                console.error(`❌ Out of bounds: row=${row}, col=${col}, divIndex=${divIndex}`);
            }
        }
    }
    
    console.log('🎉 HAPPY matrix placement complete!');
    console.log('You should see a glowing HAPPY matrix in the center of the screen');
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