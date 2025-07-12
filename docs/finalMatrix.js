// 最终版二进制矩阵脚本

// 定义所有单词的二进制矩阵
const wordMatrices = {
    // 第一行单词
    happy: [
        [0,1,1,0,1,0,0,0], // h
        [0,1,1,0,0,0,0,1], // a
        [0,1,1,1,0,0,0,0], // p
        [0,1,1,1,0,0,0,0], // p
        [0,1,1,1,1,0,0,1]  // y
    ],
    birthday: [
        [0,1,1,0,0,0,1,0], // b
        [0,1,1,0,1,0,0,1], // i
        [0,1,1,1,0,0,1,0], // r
        [0,1,1,1,0,1,0,0], // t
        [0,1,1,0,1,0,0,0], // h
        [0,1,1,0,0,1,0,0], // d
        [0,1,1,0,0,0,0,1], // a
        [0,1,1,1,1,0,0,1]  // y
    ],
    // 第二行单词
    you: [
        [0,1,1,1,1,0,0,1], // y
        [0,1,1,0,1,1,1,1], // o
        [0,1,1,1,0,1,0,1]  // u
    ],
    deserve: [
        [0,1,1,0,0,1,0,0], // d
        [0,1,1,0,0,1,0,1], // e
        [0,1,1,1,0,0,1,1], // s
        [0,1,1,0,0,1,0,1], // e
        [0,1,1,1,0,0,1,0], // r
        [0,1,1,1,0,1,1,0], // v
        [0,1,1,0,0,1,0,1]  // e
    ],
    all: [
        [0,1,1,0,0,0,0,1], // a
        [0,1,1,0,1,1,0,0], // l
        [0,1,1,0,1,1,0,0]  // l
    ],
    the: [
        [0,1,1,1,0,1,0,0], // t
        [0,1,1,0,1,0,0,0], // h
        [0,1,1,0,0,1,0,1]  // e
    ],
    goods: [
        [0,1,1,0,0,1,1,1], // g
        [0,1,1,0,1,1,1,1], // o
        [0,1,1,0,1,1,1,1], // o
        [0,1,1,0,0,1,0,0], // d
        [0,1,1,1,0,0,1,1]  // s
    ]
};

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    const divs = document.querySelectorAll('section div');
    
          if(divs.length === 0) {
          // No divs found in section
          return;
      }
    
    // 根据屏幕尺寸调整网格
    const cols = window.innerWidth >= 1200 ? 18 : (window.innerWidth >= 1024 ? 16 : 14);
    const rows = window.innerWidth >= 1200 ? 12 : (window.innerWidth >= 1024 ? 11 : 10);
    
    // 计算矩阵总宽度来居中
    const totalMatrixWidth = wordMatrices.happy.length + 1 + wordMatrices.birthday.length;
    const startCol = Math.floor((cols - totalMatrixWidth) / 2);
    
    // 只在矩阵区域和少量周围填充随机数字
    const matrixPositions = new Set();
    
    // 先填充所有div为空
    divs.forEach((div, index) => {
        div.textContent = '';
        div.style.color = 'rgba(255, 255, 255, 0.7)';
        div.style.transform = 'scale(1)';
        div.style.border = 'none';
        div.style.background = 'none';
    });
    
    // 放置矩阵的函数
    function placeMatrix(matrix, startRow, startCol, wordName) {
        
        // 计算矩阵中心点
        const matrixCenterRow = startRow + 4; // 8位二进制的中心
        const matrixCenterCol = startCol + (matrix.length - 1) / 2; // 字符数的中心
        
        for(let charIndex = 0; charIndex < matrix.length; charIndex++) {
            for(let bitIndex = 0; bitIndex < matrix[charIndex].length; bitIndex++) {
                const row = startRow + bitIndex;
                const col = startCol + charIndex;
                
                if(row < rows && col < cols) {
                    const divIndex = row * cols + col;
                    matrixPositions.add(divIndex);
                    
                    if(divIndex < divs.length) {
                        const div = divs[divIndex];
                        div.textContent = matrix[charIndex][bitIndex];
                        div.style.color = matrix[charIndex][bitIndex] === 1 ? '#00ff00' : '#004400';
                        div.style.fontWeight = 'bold';
                        div.style.textShadow = matrix[charIndex][bitIndex] === 1 ? '0 0 5px #00ff00' : 'none';
                        div.style.border = 'none';
                        div.style.background = 'none';
                        
                        // 计算距离矩阵中心的距离，模拟鼠标在中心的放大效果
                        const distanceFromCenter = Math.sqrt(
                            Math.pow(row - matrixCenterRow, 2) + Math.pow(col - matrixCenterCol, 2)
                        );
                        const scale = Math.max(1.0, 1.8 - distanceFromCenter * 0.15);
                        
                        div.style.transform = `scale(${scale})`;
                        div.classList.add('matrix-cell');
                        div.dataset.word = wordName;
                    }
                }
            }
        }
    }
    
    // 第一行：HAPPY BIRTHDAY (居中放置)
    let currentCol = startCol;
    placeMatrix(wordMatrices.happy, 1, currentCol, 'happy');
    currentCol += wordMatrices.happy.length + 1;
    placeMatrix(wordMatrices.birthday, 1, currentCol, 'birthday');
    
    // 第二行：YOU DESERVE ALL THE GOODS (居中放置)
    const secondRowMatrixWidth = wordMatrices.you.length + 1 + wordMatrices.deserve.length + 1 + 
                                wordMatrices.all.length + 1 + wordMatrices.the.length + 1 + wordMatrices.goods.length;
    const secondRowStartCol = Math.floor((cols - secondRowMatrixWidth) / 2);
    const secondRowStart = Math.floor(rows * 0.65); // 65%位置开始第二行
    
    currentCol = secondRowStartCol;
    placeMatrix(wordMatrices.you, secondRowStart, currentCol, 'you');
    currentCol += wordMatrices.you.length + 1;
    
    placeMatrix(wordMatrices.deserve, secondRowStart, currentCol, 'deserve');
    currentCol += wordMatrices.deserve.length + 1;
    
    placeMatrix(wordMatrices.all, secondRowStart, currentCol, 'all');
    currentCol += wordMatrices.all.length + 1;
    
    placeMatrix(wordMatrices.the, secondRowStart, currentCol, 'the');
    currentCol += wordMatrices.the.length + 1;
    
    placeMatrix(wordMatrices.goods, secondRowStart, currentCol, 'goods');
    
    // 在矩阵周围少量位置填充随机数字，营造氛围
    const surroundingPositions = [];
    for(let i = 0; i < divs.length; i++) {
        if(!matrixPositions.has(i)) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            // 只在矩阵区域上方和左右两侧填充少量数字
            if((row === 0 || col === 0 || col === cols-1) && Math.random() < 0.3) {
                surroundingPositions.push(i);
            }
        }
    }
    
    // 填充周围的随机数字
    surroundingPositions.forEach(index => {
        const div = divs[index];
        const randomNum = Math.floor(Math.random() * 8) + 2;
        div.textContent = randomNum;
        div.style.color = 'rgba(255, 255, 255, 0.4)';
    });
    
});

// 鼠标跟随效果 - 只对非矩阵元素生效
document.addEventListener('mousemove', function(e) {
    const divs = document.querySelectorAll('section div:not(.matrix-cell)');
    divs.forEach(div => {
        if(div.textContent) { // 只对有内容的div生效
            const rect = div.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
            const scale = Math.max(0.8, Math.min(1.3, 1 + (200 - distance) / 400));
            
            div.style.transform = `scale(${scale})`;
        }
    });
}); 