// 简化版二进制矩阵测试
console.log('Matrix script loaded');

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    const divs = document.querySelectorAll('section div');
    console.log('Found divs:', divs.length);
    
    if(divs.length === 0) {
        console.error('No divs found in section!');
        return;
    }
    
    // 简单的二进制矩阵 - HAPPY
    const happyMatrix = [
        [0,1,1,0,1,0,0,0], // h
        [0,1,1,0,0,0,0,1], // a  
        [0,1,1,1,0,0,0,0], // p
        [0,1,1,1,0,0,0,0], // p
        [0,1,1,1,1,0,0,1]  // y
    ];
    
    // 计算网格尺寸
    const totalDivs = divs.length;
    const cols = Math.ceil(Math.sqrt(totalDivs)); // 估算列数
    console.log(`Total divs: ${totalDivs}, estimated cols: ${cols}`);
    
    // 先填充所有div为随机数字
    divs.forEach((div, index) => {
        const randomNum = Math.floor(Math.random() * 8) + 2; // 2-9
        div.textContent = randomNum;
        div.style.color = 'white';
    });
    
    // 在左上角区域显示HAPPY矩阵
    let matrixIndex = 0;
    for(let row = 0; row < happyMatrix.length && matrixIndex < totalDivs; row++) {
        for(let col = 0; col < happyMatrix[row].length && matrixIndex < totalDivs; col++) {
            const divIndex = row * cols + col; // 计算div位置
            if(divIndex < totalDivs) {
                const div = divs[divIndex];
                div.textContent = happyMatrix[row][col];
                div.style.color = '#00ff00';
                div.style.fontWeight = 'bold';
                div.style.textShadow = '0 0 5px #00ff00';
                div.classList.add('matrix-cell');
                console.log(`Set div ${divIndex} to ${happyMatrix[row][col]}`);
            }
        }
    }
    
    console.log('Matrix setup complete');
});

// 保留原有的鼠标跟随效果（简化版）
document.addEventListener('mousemove', function(e) {
    const divs = document.querySelectorAll('section div');
    divs.forEach(div => {
        const rect = div.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        const scale = Math.max(0.5, 1 - distance / 300);
        
        div.style.transform = `scale(${scale})`;
    });
}); 