// 最直接的测试版本

document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOM loaded, starting direct test');
    
    const divs = document.querySelectorAll('section div');
    // console.log('Found divs:', divs.length);
    
    // 计算网格
    const totalDivs = divs.length;
    const aspectRatio = 16/9;
    const cols = Math.floor(Math.sqrt(totalDivs * aspectRatio));
    const rows = Math.ceil(totalDivs / cols);
    
    // 填充背景
    divs.forEach(div => {
        div.textContent = Math.floor(Math.random() * 8) + 2;
        div.style.color = '#8EE3F1';
    });
    
    // 在中心位置放置"HAPPY"
    const word = "HAPPY";
    const startRow = Math.floor(rows / 2);
    const startCol = Math.floor((cols - word.length) / 2);
    
    // console.log(`Center index: ${centerIndex}`);
    
    for (let i = 0; i < word.length; i++) {
        const row = startRow;
        const col = startCol + i;
        const index = row * cols + col;
        
        if (index < divs.length) {
            const div = divs[index];
            div.textContent = word[i];
            div.style.color = '#8EE3F1';
            div.style.fontWeight = 'bold';
            div.style.textShadow = '0 0 10px #8EE3F1';
            div.style.transform = 'scale(1.5)';
            
            // console.log(`Set div ${index} to "${word[i]}"`);
        }
    }
    
    // 在顶部放置一些1和0
    for (let i = 0; i < Math.min(10, cols); i++) {
        const div = divs[i];
        div.textContent = i % 2 === 0 ? '1' : '0';
        div.style.color = '#8EE3F1';
        div.style.fontWeight = 'bold';
        
        // console.log(`Set top div ${i} to "${div.textContent}"`);
    }
    
    // console.log('Direct test complete - you should see HAPPY in center and 1/0 at top');
}); 