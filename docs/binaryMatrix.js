// 二进制矩阵生成器
// 为每个单词生成二进制矩阵

// 转换单个字符为8位二进制
function charToBinary(char) {
    const ascii = char.charCodeAt(0);
    const binary = ascii.toString(2).padStart(8, '0');
    // console.log(`'${char}' (ASCII: ${char.charCodeAt(0)}) -> ${binary}`);
    return binary.split('').map(bit => parseInt(bit));
}

// 生成单词的二进制矩阵
function generateWordMatrix(word) {
    // console.log(`\n=== ${word.toUpperCase()} ===`);
    const matrix = [];
    
    // 为每个字符生成8位二进制
    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const binary = charToBinary(char);
        matrix.push(binary);
        // console.log(`'${char}' (ASCII: ${char.charCodeAt(0)}) -> ${binary}`);
    }
    
    // console.log('\n矩阵表示:');
    // 显示矩阵
    for (let i = 0; i < matrix.length; i++) {
        const row = matrix[i];
        // console.log(`${word[i]}: [${row.join(', ')}]`);
    }
    
    // console.log('\n转置矩阵 (按位位置):');
    for (let bitPos = 0; bitPos < 8; bitPos++) {
        const bitRow = matrix.map(charMatrix => charMatrix[bitPos]);
        // console.log(`Bit ${bitPos}: [${bitRow.join(', ')}]`);
    }
    
    return matrix;
}

// 生成所有单词的矩阵
function generateAllMatrices() {
    const words = ['HAPPY', 'BIRTHDAY', 'YOU', 'DESERVE', 'ALL', 'THE', 'GOODS'];
    const matrices = {};
    
    // console.log("=".repeat(60));
    // console.log("生成二进制矩阵: Happy birthday, you deserve all the goods");
    // console.log("=".repeat(60));
    
    words.forEach(word => {
        matrices[word] = generateWordMatrix(word);
    });
    
    // console.log("\n" + "=".repeat(60));
    // console.log("统计信息:");
    // console.log("=".repeat(60));
    // console.log(`总单词数: ${words.length}`);
    // console.log(`单词列表: ${words.join(', ')}`);
    
    words.forEach((word, index) => {
        // console.log(`${index + 1}. "${word}" - ${word.length} 字符 -> ${word.length}x8 矩阵`);
    });
    
    return matrices;
}

// 导出矩阵
const binaryMatrices = generateAllMatrices();

// 如果在浏览器中，将矩阵添加到全局对象
if (typeof window !== 'undefined') {
    window.binaryMatrices = binaryMatrices;
} 