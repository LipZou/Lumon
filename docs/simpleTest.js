// 超简单测试版本
console.log('Simple test script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting simple test');
    
    const divs = document.querySelectorAll('section div');
    console.log('Found divs:', divs.length);
    
    if(divs.length === 0) {
        console.error('No divs found!');
        return;
    }
    
    // 先让所有div显示索引号，确保能看到内容
    divs.forEach((div, index) => {
        div.textContent = index;
        div.style.color = 'white';
        div.style.fontSize = '14px';
        div.style.fontWeight = 'normal';
    });
    
    console.log('All divs filled with index numbers');
    
    // 在前几个位置放置明显的测试内容
    for(let i = 0; i < Math.min(20, divs.length); i++) {
        const div = divs[i];
        if(i % 2 === 0) {
            div.textContent = '1';
            div.style.color = '#00ff00';
            div.style.fontSize = '24px';
            div.style.fontWeight = 'bold';
            div.style.textShadow = '0 0 10px #00ff00';
            div.style.transform = 'scale(2)';
        } else {
            div.textContent = '0';
            div.style.color = '#ff0000';
            div.style.fontSize = '24px';
            div.style.fontWeight = 'bold';
            div.style.textShadow = '0 0 10px #ff0000';
            div.style.transform = 'scale(2)';
        }
        console.log(`Set div ${i} to ${div.textContent}`);
    }
    
    console.log('Test placement complete - you should see alternating 1s and 0s in the first row');
}); 