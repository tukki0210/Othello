let count = 0;

const setBlack = (i, j) => {
    const element = document.getElementById(`${i}${j}`);
    element.setAttribute("class", "black");
    element.textContent = "●";
}

const setWhite = (i, j) => {
    const element = document.getElementById(`${i}${j}`);
    element.setAttribute("class", "white");
    element.textContent = "●";
}

const setClickable = (i, j) => {
    const element = document.getElementById(`${i}${j}`);
    element.setAttribute("class", "clickable");
}

const removeClickable = (i, j) => {
    const element = document.getElementById(`${i}${j}`);
    element.removeAttribute("class");
}

const hasClickable = (i, j) => {
    const element = document.getElementById(`${i}${j}`);
    return element.getAttribute("class") === "clickable";
}

const setSquare = (i, j) => {
    const square = document.createElement("div");
    square.setAttribute("id", `${i}${j}`)
    square.addEventListener("click", () => {
        if (hasClickable(i, j)) {
            squareArrays[i][j] = count % 2 === 0 ? 1 : -1
            count++;
        }
    })
    document.querySelector("#board").appendChild(square)
}

// 1~8の盤と角を表すために0行・列と９行・列を作る（アルゴリズムの番兵）
const squareArrays = Array.from(new Array(10), () => new Array(10).fill(0))

for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
        setSquare(i, j);
    }
}

// 盤面の初期化
squareArrays[4][4] = 1
squareArrays[5][5] = 1
squareArrays[4][5] = -1
squareArrays[5][4] = -1

setBlack(4, 4);
setBlack(5, 5);
setWhite(4, 5);
setWhite(5, 4);

// squareArraysから盤面を再現する
const makeBoard = () => {
    for (let i = 1; i < 9; i++) {
        for (let j = 1; j < 9; j++) {
            // clickableクラスを毎回削除する
            removeClickable(i, j);

            switch (squareArrays[i][j]) {
                case 0: break;
                case 1:
                    setBlack(i, j);
                    break;
                case -1:
                    setWhite(i, j);
                    break;
                default: console.log("squareArraysに想定外の数値が入っている");
            }
        }
    }
}

const isSetArrays = Array.from(new Array(10), () => new Array(10).fill(0))

// 挟まったマスを裏返す処理
const reverse = (x, y, dx, dy, countSquare, square) => {
    squareArrays[x][y] = square;
    // 間に挟んだマスの数だけ再帰処理
    if (countSquare > 0) {
        countSquare--;
        reverse(x - dx, y - dy, dx, dy, countSquare, square);
    }
}

// checkAll関数をクリック可能場所を示すときと実際にクリックした時で使い回すための変数
let clicked = false

const checkSquare = (x, y, dx, dy) => {

    const thisSquare = squareArrays[x][y]
    const thisX = x;
    const thisY = y;

    let countSquare = 0;

    const checkNext = (x, y, dx, dy) => {

        // 最初は隣のマス
        const nextSquare = squareArrays[x + dx][y + dy]
        // クリックしたマスとnextSquare(最初は隣のマス)を比較
        switch (nextSquare) {
            // nextSquareが空欄だった場合
            case 0:
                break;
            // nextSquareが同じ色だった場合
            case thisSquare:
                // 間にマスが一つ以上ある場合
                if (countSquare > 0) {
                    // 裏返しの処理
                    // 実施にクリックしたとき
                    if (clicked === true) {
                        reverse(x, y, dx, dy, countSquare, thisSquare);
                    } else {
                        setClickable(thisX, thisY);
                    }
                };
                break;

            // nextSquareが異なる色だった場合
            case -(thisSquare):
                // クリックしたマスと
                if (nextSquare !== thisSquare) {
                    // 間に入るマスを数える
                    countSquare++;
                    // 再帰呼び出し　nextSquareが一つズレる
                    checkNext(x + dx, y + dy, dx, dy);
                }
                break;

            default: console.log("nextSquareに想定外の数値が入っている");
        }
    }
    checkNext(x, y, dx, dy);

}

// 全ての方向でチェックする
const checkAll = (x, y) => {
    checkSquare(x, y, 1, 0)
    checkSquare(x, y, -1, 0)
    checkSquare(x, y, 0, 1)
    checkSquare(x, y, 0, -1)
    checkSquare(x, y, 1, 1)
    checkSquare(x, y, 1, -1)
    checkSquare(x, y, -1, -1)
    checkSquare(x, y, -1, 1)
}

// 指定したマスに石が置けるかをチェック
const checkClickable = (x, y) => {
    // checkAll()を流用するために、空白のマスにそのターンの色の石を仮に置く
    if (squareArrays[x][y] === 0) {
        clicked = false
        squareArrays[x][y] = count % 2 === 0 ? 1 : -1
        checkAll(x, y)
        // 仮に置いた石を取り除く
        squareArrays[x][y] = 0
    }
}
// 全てのマスで石が置けるかをチェックする
const checkClickableAll = () => {
    for (let i = 1; i < 9; i++) {
        for (let j = 1; j < 9; j++) {
            checkClickable(i, j)
        }
    }
}

// 開始ターンのチェック
checkClickableAll()

const check = document.getElementById("board").addEventListener("click", (e) => {
    const x = parseInt(e.target.getAttribute("id")[0]);
    const y = parseInt(e.target.getAttribute("id")[1]);

    const blackNum = document.body.querySelectorAll(".black").length;
    const whiteNum = document.body.querySelectorAll(".white").length;

    if (hasClickable(x, y)) {
        // 実際にクリックした時のチェック
        clicked = true

        checkAll(x, y);
        makeBoard(x, y);
        console.log(`黒:${blackNum},白:${whiteNum}`)

        // 毎ターンの置けるかのチェック
        checkClickableAll()
    }

    const clickableNum = document.body.querySelectorAll(".clickable").length;
    console.log(`置けるマス：${clickableNum}個`)

    if (clickableNum === 0) {
        alert("置けるマスがありません。")
        count++;
        // パスした時のチェック
        checkClickableAll()
        // 手番が変わっても置けるマスがない場合
        if (clickableNum === 0) {
            if (blackNum > whiteNum) {
                alert("黒の勝ち！")
            } else if (blackNum < whiteNum) {
                alert("白の勝ち!")
            } else {
                alert("引き分け！")
            }
        }
    }
})

