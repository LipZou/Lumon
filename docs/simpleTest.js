// 超简单测试版本

document.addEventListener('DOMContentLoaded', () => {
    // console.log('DOM loaded, starting simple test');
    
    const divs = document.querySelectorAll('section div');
    // console.log('Found divs:', divs.length);
    
    // First, fill all divs with their index numbers
    divs.forEach((div, index) => {
        div.textContent = index;
        div.style.color = '#8EE3F1';
    });
    
    // Wait a bit, then start the test
    setTimeout(() => {
        // console.log('All divs filled with index numbers');
        
        // Now let's test placing 1s and 0s in the first row
        const firstRowDivs = [];
        const estimatedCols = Math.floor(Math.sqrt(divs.length * (16/9))); // Assuming 16:9 aspect ratio
        
        for (let i = 0; i < estimatedCols && i < divs.length; i++) {
            firstRowDivs.push(divs[i]);
        }
        
        // Place alternating 1s and 0s in first row
        firstRowDivs.forEach((div, i) => {
            const value = i % 2 === 0 ? '1' : '0';
            div.textContent = value;
            div.style.color = '#8EE3F1';
            div.style.fontWeight = 'bold';
            
            // console.log(`Set div ${i} to ${div.textContent}`);
        });
        
        // console.log('Test placement complete - you should see alternating 1s and 0s in the first row');
    }, 1000);
}); 