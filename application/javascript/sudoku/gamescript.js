import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBoard = document.getElementById("game-board");
const alertContainer = document.querySelector("[data-alert-container]");

const grid = new Grid(gameBoard);
var activeCell = 0;
setupInput();
startGame();

function startGame() {
    grid.cells[activeCell].setActive();
}


function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
    window.addEventListener("click", handleClick, { once: true})
}

function handleClick(e) {
    if (e.target.matches("[data-num]")){

        if (grid.cells[activeCell].tile) {
            grid.cells[activeCell].tile.active = false;
        }

        grid.cells[activeCell].setFalse();
        activeCell = Number(e.target.dataset.num);
        grid.cells[activeCell].setActive();

        // if there is a tile on the previous cell, set it to inactive
        if (grid.cells[activeCell].tile) {
            grid.cells[activeCell].tile.active = true;
        }
    }


    setupInput();
}
 
async function handleInput(e) {

    if (e.key === "ArrowUp") {
        if (!canMoveUp()) {
            move(72)
        } else {
            move(-9)
        }

    } else if (e.key === "ArrowDown") {
        if (!canMoveDown()) {
            move(-72)
        } else {
            move(9)
        }

    } else if (e.key === "ArrowLeft") {
        if (!canMoveLeft()) {
            move(8)
        } else {
            move(-1)
        }

    } else if (e.key === "ArrowRight") {
        if (!canMoveRight()) {
            move(-8)
        } else {
            move(1)
        }

    } else if (e.key.match(/^[1-9]$/)) {
        inputValue(e.key);
    } else if (e.key === "Backspace" || e.key === "Delete") {
        deleteActive();
    } else if (e.key === "Enter") {
        submitNums();
    } else if (e.key === "d") {
        clearBoard();
    } else if (e.key === "p") {
        preset();
    }

    setupInput();
}

function canMoveUp() {
    
    return grid.activeCell()[0].y !== 0;
}

function canMoveDown() {

    return grid.activeCell()[0].y !== 8;
}

function canMoveLeft() {

    return grid.activeCell()[0].x !== 0;
}

function canMoveRight() {

    return grid.activeCell()[0].x !== 8;
}

function move(dir) {
    // if there is a tile on the previous cell, set it to inactive
    if (grid.cells[activeCell].tile) {
        grid.cells[activeCell].tile.active = false;
    }
    
    // updates the active cell
    grid.cells[activeCell].setActive();
    activeCell += dir;
    grid.cells[activeCell].setActive();

    // if there is a tile on the previous cell, set it to inactive
    if (grid.cells[activeCell].tile) {
        grid.cells[activeCell].tile.active = true;
    }
}
// Enters tile from where the user is highlighting
function inputValue(val) {
    // removes any previous tile before creating a new one
    if (grid.activeCell()[0].tile) {
        grid.activeCell()[0].removeTile();
    }
    grid.activeCell()[0].tile = new Tile(gameBoard, val, activeCell % 9, Math.floor(activeCell / 9), true);
    grid.activeCell()[0].tile.flip();
}

// Enters tile from whatever location given
function enterTile(location, value) {
    if (grid.cells[location].tile) {
        grid.cells[location].removeTile();
    }
    grid.cells[location].tile = new Tile(gameBoard, value, location % 9, Math.floor(location / 9), true);
    // grid.cells[location].tile.flip(); // can be obnoxious if all flip at once
}

function deleteActive() {
    grid.activeCell()[0].removeTile();
    
}

function clearBoard() {
    grid.clearTiles();
}

function submitNums() {
    var board = [];
    for (let i = 0; i < 9; i++) {
        let temp = [];
        for (let j = 0; j < 9; j++){
            if (!grid.cellsByRow[i][j].tile){
                temp.push(".");
            } else {
                temp.push(grid.cellsByRow[i][j].tile.value);
            }
        }
        board.push(temp);
    }

    if (isValidSudoku(board)) {
        solveSudoku(board);

        for (let i = 0; i < 9; i++) {
            if (board[i].includes(".")) {
                showAlert("No possible solutions from current board");
                break;
            }
        }
        
        complete(board);
    } else {
        showAlert("No Possible Solutions")
    }
}


function isValidSudoku(board) {
    const mySet = new Set();
    
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++){
            if (board[i][j] === "."){
                continue;
            }
            let tempRow = board[i][j] + " in row: " + i;
            let tempCol = board[i][j] + " in column: " + j;
            let tempBox = board[i][j] + " in box: " + Math.floor(i/3) + "-" + Math.floor(j/3);

            if (mySet.has(tempRow) || mySet.has(tempCol) || mySet.has(tempBox)){
                return false;
            }
            mySet.add(tempRow);
            mySet.add(tempCol);
            mySet.add(tempBox);
        }
    }
    
    return true;
}

function solveSudoku(board) {
    var isValid = function(board, num, row, col){
        let b_row =  Math.floor(row / 3) * 3;
        let b_col =  Math.floor(col / 3) * 3;

        for (let i = 0; i < board.length; i++){
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
            let curRow = b_row +  Math.floor(i / 3);
            let curCol = b_col +  Math.floor(i % 3);
            if (board[curRow][curCol] === num) 
                return false;
        }
        return true;

    }
    
    var solve = function(board){

        for (let row = 0; row < board.length; row++){
            for (let col = 0; col < board.length; col++){
                if (board[row][col] !== '.'){
                    continue;
                }
                for (let i = 1; i <= 9; i++){
                    const s_i = i.toString();
                    if (isValid(board, s_i, row, col)){
                        board[row][col] = s_i;
                        if (solve(board)) {
                            return true;
                        }
                    }
                }
                board[row][col] = '.';
                return false;   
            }
        }
        return true;
        
    }
  
    solve(board);
}

function preset() {
    let board = [
    ["5","3",".",".","7",".",".",".","."],
    ["6",".",".","1","9","5",".",".","."],
    [".","9","8",".",".",".",".","6","."],
    ["8",".",".",".","6",".",".",".","3"],
    ["4",".",".","8",".","3",".",".","1"],
    ["7",".",".",".","2",".",".",".","6"],
    [".","6",".",".",".",".","2","8","."],
    [".",".",".","4","1","9",".",".","5"],
    [".",".",".",".","8",".",".","7","9"]];
    
    clearBoard();
    complete(board);

}

function complete(board) {
    let temp = board.flat();
    for (let i = 0; i < 81; i++) {
        if (temp[i] === ".") continue;
        enterTile(i, temp[i])
    }
}

function showAlert(message, duration = 1000) {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.prepend(alert)
    if (duration == null) return

    setTimeout(() => {
        alert.classList.add("hide")
        alert.addEventListener("transitionend", () => {
            alert.remove()
        })
    }, duration)
}