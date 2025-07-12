// 调试版二进制矩阵脚本
// console.log('Debug Matrix script loaded');

// 简化的矩阵数据
const wordMatrices = {
    happy: [
        [0,1,1,0,1,0,0,0], // h
        [0,1,1,0,0,0,0,1], // a
        [0,1,1,1,0,0,0,0], // p
        [0,1,1,1,0,0,0,0], // p
        [0,1,1,1,1,0,0,1]  // y
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOM loaded');
    
    const divs = document.querySelectorAll('section div');
    // console.log('Found divs:', divs.length);
    
    if(divs.length === 0) {
        // No divs found in section
        return;
    }
    
    // 根据屏幕尺寸调整网格 - 减少数量
    const cols = window.innerWidth >= 1200 ? 20 : (window.innerWidth >= 1024 ? 18 : 16);
    const rows = window.innerWidth >= 1200 ? 14 : (window.innerWidth >= 1024 ? 12 : 10);
    // console.log(`Grid: ${cols} cols x ${rows} rows, total: ${cols * rows}`);
    
    // 先填充所有div为随机数字
    divs.forEach((div, index) => {
        const randomNum = Math.floor(Math.random() * 8) + 2;
        div.textContent = randomNum;
        div.style.color = 'rgba(255, 255, 255, 0.4)';
        div.style.transform = 'scale(1)'; // 普通数字正常大小
        div.style.border = 'none';
        div.style.background = 'none';
        div.style.fontSize = '16px';
    });
    
    // 放置HAPPY矩阵在中心位置
    // console.log('Placing HAPPY matrix...');
    const matrix = wordMatrices.happy;
    
    // 计算居中位置
    const matrixWidth = matrix.length; // 5个字符
    const matrixHeight = 8; // 8位二进制
    const startRow = Math.floor((rows - matrixHeight) / 2);
    const startCol = Math.floor((cols - matrixWidth) / 2);
    
    // console.log(`Matrix center position: startRow=${startRow}, startCol=${startCol}`);
    // console.log(`Matrix size: ${matrixWidth} x ${matrixHeight}`);
    
    // 计算矩阵中心点用于放大效果
    const matrixCenterRow = startRow + matrixHeight / 2;
    const matrixCenterCol = startCol + matrixWidth / 2;
    
    // console.log(`Matrix center point: centerRow=${matrixCenterRow}, centerCol=${matrixCenterCol}`);
    
    for(let charIndex = 0; charIndex < matrix.length; charIndex++) {
        for(let bitIndex = 0; bitIndex < matrix[charIndex].length; bitIndex++) {
            const row = startRow + bitIndex;
            const col = startCol + charIndex;
            const divIndex = row * cols + col;
            
            if(divIndex < divs.length && row < rows && col < cols && row >= 0 && col >= 0) {
                const div = divs[divIndex];
                div.textContent = matrix[charIndex][bitIndex];
                div.style.color = matrix[charIndex][bitIndex] === 1 ? '#00ff00' : '#ff6666';
                div.style.fontWeight = 'bold';
                div.style.fontSize = '20px';
                
                // 计算距离中心的距离，实现放大效果
                const distanceFromCenter = Math.sqrt(
                    Math.pow(row - matrixCenterRow, 2) + Math.pow(col - matrixCenterCol, 2)
                );
                
                // 简化的放大效果
                const maxDistance = 4; // 简化最大距离
                const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
                const scale = 1.5 + (1.0 - normalizedDistance * 0.5); // 中心2.5倍，边缘1.5倍
                
                div.style.transform = `scale(${scale})`;
                div.style.zIndex = '10';
                
                // 添加发光效果
                if(matrix[charIndex][bitIndex] === 1) {
                    div.style.textShadow = '0 0 15px #00ff00, 0 0 25px #00ff00';
                } else {
                    div.style.textShadow = '0 0 8px #ff6666';
                }
                
                div.classList.add('matrix-cell');
                // console.log(`✅ Placed ${matrix[charIndex][bitIndex]} at (${row},${col}) divIndex=${divIndex}, scale=${scale.toFixed(2)}`);
            } else {
                                 // Position out of bounds
            }
        }
    }
    
    // console.log('Matrix placement complete');
});

// 鼠标跟随效果 - 只对非矩阵元素生效
document.addEventListener('mousemove', function(e) {
    const divs = document.querySelectorAll('section div:not(.matrix-cell)');
    divs.forEach(div => {
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