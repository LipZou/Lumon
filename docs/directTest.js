// 最直接的测试版本
console.log('Direct test script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting direct test');
    
    const divs = document.querySelectorAll('section div');
    console.log('Found divs:', divs.length);
    
    if(divs.length === 0) {
        console.error('No divs found!');
        return;
    }
    
    // 清空所有div
    divs.forEach((div, index) => {
        div.textContent = '';
        div.style.color = 'rgba(255, 255, 255, 0.3)';
        div.style.fontSize = '14px';
        div.style.fontWeight = 'normal';
        div.style.transform = 'scale(1)';
    });
    
    // 在中心区域强制显示大号的HAPPY
    const centerIndex = Math.floor(divs.length / 2);
    console.log(`Center index: ${centerIndex}`);
    
    // 直接在中心位置显示HAPPY
    const word = "HAPPY";
    for(let i = 0; i < word.length; i++) {
        const index = centerIndex + i - 2; // 居中显示
        if(index >= 0 && index < divs.length) {
            const div = divs[index];
            div.textContent = word[i];
            div.style.color = '#00ff00';
            div.style.fontSize = '48px';
            div.style.fontWeight = 'bold';
            div.style.textShadow = '0 0 20px #00ff00, 0 0 40px #00ff00';
            div.style.transform = 'scale(3)';
            div.style.zIndex = '100';
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            console.log(`Set div ${index} to "${word[i]}"`);
        }
    }
    
    // 在前10个位置也显示一些明显内容
    for(let i = 0; i < 10; i++) {
        if(i < divs.length) {
            const div = divs[i];
            div.textContent = i % 2 === 0 ? '1' : '0';
            div.style.color = i % 2 === 0 ? '#00ff00' : '#ff0000';
            div.style.fontSize = '32px';
            div.style.fontWeight = 'bold';
            div.style.transform = 'scale(2)';
            div.style.textShadow = '0 0 15px ' + (i % 2 === 0 ? '#00ff00' : '#ff0000');
            console.log(`Set top div ${i} to "${div.textContent}"`);
        }
    }
    
    console.log('Direct test complete - you should see HAPPY in center and 1/0 at top');
}); 