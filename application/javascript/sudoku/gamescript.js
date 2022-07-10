import Grid from "./grid.js";
import Tile from "./tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
var activeCell = 0;
setupInput();
startGame();

function startGame() {
    //const newTile = new Tile(gameBoard)
    //grid.cells[0] = newTile;
    grid.cells[activeCell].setActive();
    //console.log(grid.cells[0].active);
}


function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
    window.addEventListener("click", handleClick, { once: true})
}

function handleClick(e) {
    if (e.target.matches("[data-num]")){
        grid.cells[activeCell].setFalse();
        
        activeCell = Number(e.target.dataset.num);
        grid.cells[activeCell].setActive();
    }


    setupInput();
}
 
async function handleInput(e) {

    if (e.key === "ArrowUp") {
        if (!canMoveUp()) {
            setupInput()
            return
        }
        await move("up")

    } else if (e.key === "ArrowDown") {
        if (!canMoveDown()) {
            setupInput()
            return
        }
        await move("down")

    } else if (e.key === "ArrowLeft") {
        if (!canMoveLeft()) {
            setupInput()
            return
        }
        await move("left")

    } else if (e.key === "ArrowRight") {
        if (!canMoveRight()) {
            setupInput()
            return
        }
        await move("right")

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
//       this.#tileElement.style.setProperty("--background-lightness", `${backgroundLightness}%`)

function move(dir) {
    if (grid.cells[activeCell].tile) {
        grid.cells[activeCell].tile.active = false;
    }
    
    switch(dir) {
        case "up":
            grid.cells[activeCell].setFalse();
            activeCell -= 9;
            grid.cells[activeCell].setActive();
            break
        case "down":
            grid.cells[activeCell].setFalse();
            activeCell += 9;
            grid.cells[activeCell].setActive();
            break
        case "left":
            grid.cells[activeCell].setFalse();
            activeCell -= 1;
            grid.cells[activeCell].setActive();
            break
        case "right":
            grid.cells[activeCell].setFalse();
            activeCell += 1;
            grid.cells[activeCell].setActive();
            break
    }
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
    grid.activeCell()[0].tile = new Tile(gameBoard, val, activeCell % 9, Math.floor(activeCell / 9, true));
}

// Enters tile from whatever location given
function enterTile(location, value) {
    if (grid.cells[location].tile) {
        grid.cells[location].removeTile();
    }
    grid.cells[location].tile = new Tile(gameBoard, value, location % 9, Math.floor(location / 9, true))
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

    console.log(isValidSudoku(board));
    if (isValidSudoku(board)) {
        solveSudoku(board);
        console.log(board)
        complete(board);
    } else {
        alert("No Possible Solutions")
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
