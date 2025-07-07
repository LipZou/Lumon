// 二进制矩阵生成器
// 目标文本: "Happy birthday, you deserve all the goods"

function charToBinary(char) {
    // 将字符转换为ASCII码，然后转换为8位二进制
    const ascii = char.charCodeAt(0);
    return ascii.toString(2).padStart(8, '0');
}

function wordToBinaryMatrix(word) {
    console.log(`\n=== ${word.toUpperCase()} ===`);
    const matrix = [];
    const binaryRows = [];
    
    // 为每个字符生成二进制
    for (let char of word) {
        const binary = charToBinary(char);
        binaryRows.push(binary);
        console.log(`'${char}' (ASCII: ${char.charCodeAt(0)}) -> ${binary}`);
    }
    
    // 创建矩阵 - 每行代表一个字符的8位二进制
    console.log('\n矩阵表示:');
    for (let i = 0; i < binaryRows.length; i++) {
        const row = binaryRows[i].split('').map(bit => parseInt(bit));
        matrix.push(row);
        console.log(`${word[i]}: [${row.join(', ')}]`);
    }
    
    // 也可以创建转置矩阵（按位位置排列）
    console.log('\n转置矩阵 (按位位置):');
    for (let bitPos = 0; bitPos < 8; bitPos++) {
        const bitRow = binaryRows.map(binary => binary[bitPos]);
        console.log(`Bit ${bitPos}: [${bitRow.join(', ')}]`);
    }
    
    return {
        word: word,
        matrix: matrix,
        binaryStrings: binaryRows
    };
}

function generateAllBinaryMatrices() {
    const text = "Happy birthday, you deserve all the goods";
    // 移除标点符号并分割成单词
    const words = text.toLowerCase().replace(/[,\.]/g, '').split(' ');
    
    console.log("=".repeat(60));
    console.log("生成二进制矩阵: Happy birthday, you deserve all the goods");
    console.log("=".repeat(60));
    
    const allMatrices = [];
    
    words.forEach((word, index) => {
        const wordMatrix = wordToBinaryMatrix(word);
        allMatrices.push(wordMatrix);
    });
    
    // 生成统计信息
    console.log("\n" + "=".repeat(60));
    console.log("统计信息:");
    console.log("=".repeat(60));
    console.log(`总单词数: ${words.length}`);
    console.log(`单词列表: ${words.join(', ')}`);
    
    words.forEach((word, index) => {
        console.log(`${index + 1}. "${word}" - ${word.length} 字符 -> ${word.length}x8 矩阵`);
    });
    
    return allMatrices;
}

// 执行生成
const matrices = generateAllBinaryMatrices();

// 导出用于HTML页面使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateAllBinaryMatrices, wordToBinaryMatrix, charToBinary };
} 