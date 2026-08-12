var board;
var score = 0;
var rows = 4;
var columns = 4;
var gameEnded = false;

window.onload = function() {
    setGame();
    setupSwipeControls();
}

function setGame() {
    gameEnded = false;
    document.getElementById("game-over").style.display = "none";

    // Clear the old board
    document.getElementById("board").innerHTML = "";

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");

            tile.id = r.toString() + "-" + c.toString();

            let num = board[r][c];

            updateTile(tile, num);

            document.getElementById("board").append(tile);
        }
    }

    setTwo();

    document.getElementById("score").innerText = score;
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }

    return false;
}


// Check whether any tiles can still move or merge
function hasMovesAvailable() {

    // If there's an empty space, the player can still move
    if (hasEmptyTile()) {
        return true;
    }

    // Check horizontal matches
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] == board[r][c + 1]) {
                return true;
            }
        }
    }

    // Check vertical matches
    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == board[r + 1][c]) {
                return true;
            }
        }
    }

    // No empty spaces and no possible merges
    return false;
}


function checkGameOver() {
    if (!hasMovesAvailable()) {
        gameOver();
    }
}


function setTwo() {
    if (!hasEmptyTile()) {
        checkGameOver();
        return;
    }

    let found = false;

    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {

            if (Math.random() > 0.4) {
                board[r][c] = 4;

                let tile = document.getElementById(
                    r.toString() + "-" + c.toString()
                );

                tile.innerText = "4";
                tile.classList.add("x4");

            } else {
                board[r][c] = 2;

                let tile = document.getElementById(
                    r.toString() + "-" + c.toString()
                );

                tile.innerText = "2";
                tile.classList.add("x2");
            }

            found = true;
        }
    }
}


function gameOver() {
    gameEnded = true;

    document.getElementById("game-over").style.display = "flex";
}


function restartGame() {
    gameEnded = false;

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;

    setGame();
}


function updateTile(tile, num) {
    tile.innerText = "";

    tile.classList.value = "";

    tile.classList.add("tile");

    if (num > 0) {
        tile.innerText = num;

        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}


document.addEventListener("keyup", (e) => {

    // Don't allow movement after Game Over
    if (gameEnded) {
        return;
    }

    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();

    } else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();

    } else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();

    } else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }

    document.getElementById("score").innerText = score;

    // Check after the new tile has been placed
    checkGameOver();
});


function filterZero(row) {
    return row.filter(num => num != 0);
}


function slide(row) {

    row = filterZero(row);

    for (let i = 0; i < row.length - 1; i++) {

        if (row[i] == row[i + 1]) {

            row[i] *= 2;

            row[i + 1] = 0;

            score += row[i];
        }
    }

    row = filterZero(row);

    while (row.length < columns) {
        row.push(0);
    }

    return row;
}


function slideLeft() {

    for (let r = 0; r < rows; r++) {

        let row = board[r];

        row = slide(row);

        board[r] = row;

        for (let c = 0; c < columns; c++) {

            let tile = document.getElementById(
                r.toString() + "-" + c.toString()
            );

            let num = board[r][c];

            updateTile(tile, num);
        }
    }
}


function slideRight() {

    for (let r = 0; r < rows; r++) {

        let row = board[r];

        row.reverse();

        row = slide(row);

        row.reverse();

        board[r] = row;

        for (let c = 0; c < columns; c++) {

            let tile = document.getElementById(
                r.toString() + "-" + c.toString()
            );

            let num = board[r][c];

            updateTile(tile, num);
        }
    }
}


function slideUp() {

    for (let c = 0; c < columns; c++) {

        let row = [
            board[0][c],
            board[1][c],
            board[2][c],
            board[3][c]
        ];

        row = slide(row);

        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        for (let r = 0; r < rows; r++) {

            let tile = document.getElementById(
                r.toString() + "-" + c.toString()
            );

            let num = board[r][c];

            updateTile(tile, num);
        }
    }
}


function slideDown() {

    for (let c = 0; c < columns; c++) {

        let row = [
            board[0][c],
            board[1][c],
            board[2][c],
            board[3][c]
        ];

        row.reverse();

        row = slide(row);

        row.reverse();

        board[0][c] = row[0];
        board[1][c] = row[1];
        board[2][c] = row[2];
        board[3][c] = row[3];

        for (let r = 0; r < rows; r++) {

            let tile = document.getElementById(
                r.toString() + "-" + c.toString()
            );

            let num = board[r][c];

            updateTile(tile, num);
        }
    }
}

// ================================
// Mobile Swipe Controls
// ================================

function setupSwipeControls() {

    const gameBoard = document.getElementById("board");

    let touchStartX = 0;
    let touchStartY = 0;

    gameBoard.addEventListener("touchstart", (e) => {

        if (gameEnded) {
            return;
        }

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

    }, { passive: true });


    gameBoard.addEventListener("touchend", (e) => {
    e.preventDefault();

    if (gameEnded) {
        return;
    }

        let touchEndX = e.changedTouches[0].clientX;
        let touchEndY = e.changedTouches[0].clientY;

        let differenceX = touchEndX - touchStartX;
        let differenceY = touchEndY - touchStartY;

        // Minimum swipe distance
        let minSwipeDistance = 30;

        // Ignore taps / tiny movements
        if (
            Math.abs(differenceX) < minSwipeDistance &&
            Math.abs(differenceY) < minSwipeDistance
        ) {
            return;
        } { passive: false };


        // Horizontal swipe
        if (Math.abs(differenceX) > Math.abs(differenceY)) {

            if (differenceX > 0) {
                // 👉 Swipe right
                slideRight();
            } else {
                // 👈 Swipe left
                slideLeft();
            }

        }

        // Vertical swipe
        else {

            if (differenceY > 0) {
                // 👇 Swipe down
                slideDown();
            } else {
                // 👆 Swipe up
                slideUp();
            }
        }


        // Update score
        document.getElementById("score").innerText = score;

        // Spawn new tile
        setTwo();

        // Check for Game Over
        checkGameOver();
    }, { passive: false });
}