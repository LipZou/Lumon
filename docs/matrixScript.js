// 二进制矩阵显示脚本
// 将"Happy birthday, you deserve all the goods"显示为二进制矩阵

// 定义二进制矩阵数据
const binaryMatrices = {
    // 第一行：HAPPY BIRTHDAY
    row1: {
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
        ]
    },
    // 第二行：YOU DESERVE ALL THE GOODS
    row2: {
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
    }
};

// 计算网格布局（假设网格是大致方形的）
function calculateGridLayout(totalDivs) {
    const approxCols = Math.ceil(Math.sqrt(totalDivs));
    const approxRows = Math.ceil(totalDivs / approxCols);
    return { rows: approxRows, cols: approxCols };
}

// 获取矩阵在网格中的起始位置
function getMatrixPosition(gridCols, rowIndex, colOffset) {
    return rowIndex * gridCols + colOffset;
}

// 检查位置是否在矩阵范围内
function isInMatrix(index, gridCols, matrixConfigs) {
    for (let config of matrixConfigs) {
        const startPos = getMatrixPosition(gridCols, config.row, config.col);
        
        for (let matrixRow = 0; matrixRow < config.matrix.length; matrixRow++) {
            for (let matrixCol = 0; matrixCol < config.matrix[matrixRow].length; matrixCol++) {
                const currentPos = startPos + matrixRow * gridCols + matrixCol;
                if (index === currentPos) {
                    return config.matrix[matrixRow][matrixCol];
                }
            }
        }
    }
    return null;
}

// 初始化网格
function initializeGrid() {
    const divs = document.querySelectorAll("section div");
    const totalDivs = divs.length;
    const gridLayout = calculateGridLayout(totalDivs);
    
    console.log(`网格布局: ${gridLayout.rows}行 × ${gridLayout.cols}列`);
    
    // 定义矩阵配置
    const matrixConfigs = [
        // 第一行：HAPPY (从第2行开始，留出顶部空间)
        {
            row: 2,
            col: 5,
            matrix: binaryMatrices.row1.happy
        },
        // 第一行：BIRTHDAY (紧接在HAPPY后面)
        {
            row: 2,
            col: 15,
            matrix: binaryMatrices.row1.birthday
        },
        // 第二行：YOU (从第12行开始)
        {
            row: 12,
            col: 2,
            matrix: binaryMatrices.row2.you
        },
        // 第二行：DESERVE
        {
            row: 12,
            col: 8,
            matrix: binaryMatrices.row2.deserve
        },
        // 第二行：ALL
        {
            row: 12,
            col: 18,
            matrix: binaryMatrices.row2.all
        },
        // 第二行：THE
        {
            row: 12,
            col: 24,
            matrix: binaryMatrices.row2.the
        },
        // 第二行：GOODS
        {
            row: 12,
            col: 30,
            matrix: binaryMatrices.row2.goods
        }
    ];
    
    // 为每个div设置内容
    divs.forEach((div, index) => {
        const matrixValue = isInMatrix(index, gridLayout.cols, matrixConfigs);
        
        if (matrixValue !== null) {
            // 在矩阵区域显示0或1
            div.innerHTML = matrixValue;
            div.classList.add('matrix-cell');
        } else {
            // 在非矩阵区域显示随机数字2-9
            div.innerHTML = Math.floor(Math.random() * 8) + 2;
        }
        
        // 保留原有的随机样式
        const r = Math.floor(Math.random() * 10);
        if (r <= 1) {
            div.classList.add('b-20');
        } else if (r <= 3) {
            div.classList.add('l-20');
        }

        const d = Math.floor(Math.random() * 10);
        if (d <= 3) {
            div.classList.add('d-1');
        } else if (d <= 6) {
            div.classList.add('d-1_5');
        }

        const du = Math.floor(Math.random() * 10);
        if (du <= 1) {
            div.classList.add('du-2');
        } else if (du <= 6) {
            div.classList.add('du-8');
        }
    });
}

// 保留原有的鼠标跟随效果
document.addEventListener("mousemove", function(event) {
    const x = event.pageX;
    const y = event.pageY;

    document.querySelectorAll("section div").forEach(div => {
        const dx = div.offsetLeft + 50 - x;
        const dy = div.offsetTop + 50 - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= 100) {
            div.style.transform = "scale(2.6)"
        } else if (dist <= 130) {
            div.style.transform = "scale(2.3)"
        } else if (dist <= 140) {
            div.style.transform = "scale(1.8)"
        } else if (dist <= 150) {
            div.style.transform = "scale(1.5)"
        } else if (dist <= 180) {
            div.style.transform = "scale(1.2)"
        } else if (dist <= 200) {
            div.style.transform = "scale(1.1)"
        } else {
            div.style.transform = "scale(1)"
        }
    });
});

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", initializeGrid); 