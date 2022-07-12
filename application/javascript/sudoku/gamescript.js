import Grid from "./grid.js";
import Tile from "./tile.js";
import { getBoards } from "./presets.js";

const gameBoard = document.getElementById("game-board");
const alertContainer = document.querySelector("[data-alert-container]");
const keyboard = document.querySelector("[data-directions]");
const instructions = document.querySelector("[data-instructions]");

const grid = new Grid(gameBoard);
var activeCell = 0;
var toggled = false;
var presetCnt = 0;
var newBoard = [
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."]]; 

const moveUp = -9;
const moveUpMax = 72;
const moveDown = 9;
const moveDownMax = -72;
const moveLeft = -1;
const moveLeftMax = 8;
const moveRight = 1;
const moveRightMax = -8;

setupInput();
startGame();

function startGame() {
    grid.cells[activeCell].setActive();
}


function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
    window.addEventListener("click", handleClick, { once: true })
}

function handleClick(e) {
    if (e.target.matches("[data-num]")) {

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

    else if (e.target.matches("[data-key]")) {
        moveDir(e.target.dataset.key);
    } else if (e.target.matches("[data-action]")) {
        if (e.target.dataset.action === "Delete") {
            deleteActive();
        } else if (e.target.dataset.action === "Solve") {
            submitNums();
        } else if (e.target.dataset.action === "Clear") {
            clearBoard();
        } if (e.target.dataset.action === "Preset") {
            preset();
        }
    } else if (e.target.matches("[data-val]")) {
        inputValue(e.target.dataset.val);
    } else if (e.target.matches("[data-ins]")) {
        popUp();
    }

    setupInput();
}

function popUp() {
    if (!toggled){
        instructions.classList.remove("hide");
        toggled = true;
    } else {
        instructions.classList.add("hide");
        toggled = false;
    }

}

async function handleInput(e) {

    if (e.key === "ArrowUp") {
        moveDir("Up")

    } else if (e.key === "ArrowDown") {
        moveDir("Down")

    } else if (e.key === "ArrowLeft") {
        moveDir("Left")

    } else if (e.key === "ArrowRight") {
        moveDir("Right")

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

function moveDir(dir) {
    if (dir === "Up") {
        if (canMoveUp()) {
            move(moveUp)
        } else {
            move(moveUpMax)
        }

    } else if (dir === "Down") {
        if (canMoveDown()) {
            move(moveDown)
        } else {
            move(moveDownMax)
        }

    } else if (dir === "Left") {
        if (canMoveLeft()) {
            move(moveLeft)
        } else {
            move(moveLeftMax)
        }

    } else if (dir === "Right") {
        if (canMoveRight()) {
            move(moveRight)
        } else {
            move(moveRightMax)
        }
    }
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

    if(isValid(newBoard, val, grid.activeCell()[0].y, grid.activeCell()[0].x)) {
        if (grid.activeCell()[0].tile) {
            grid.activeCell()[0].removeTile();
        }
        grid.activeCell()[0].tile = new Tile(gameBoard, val, grid.activeCell()[0].x, grid.activeCell()[0].y, true);
        newBoard[grid.activeCell()[0].y][grid.activeCell()[0].x] = val;
        grid.activeCell()[0].tile.flip();
    } else if (!((grid.activeCell()[0].tile) && (grid.activeCell()[0].tile.value === val))) { 
        showAlert("Not a valid Placement")
    }

}

// Enters tile from whatever location given
function enterTile(location, value) {
    if (grid.cells[location].tile) {
        grid.cells[location].removeTile();
    }
    grid.cells[location].tile = new Tile(gameBoard, value, grid.cells[location].x, grid.cells[location].y, true);
    // grid.cells[location].tile.flip(); // can be obnoxious if all flip at once
}

function deleteActive() {
    grid.activeCell()[0].removeTile();
    newBoard[grid.activeCell()[0].y][grid.activeCell()[0].x] = ".";

}

function clearBoard() {
    grid.clearTiles();
    newBoard = [
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."],
        [".", ".", ".", ".", ".", ".", ".", ".", "."]]; 
}

function submitNums() {

    if (isValidSudoku(newBoard)) {
        solve(newBoard);

        for (let i = 0; i < 9; i++) {
            if (newBoard[i].includes(".")) {
                showAlert("No possible solutions from current board");
                break;
            }
            if (i === 8){
                showAlert("Sudoku Solved!")
            }
        }

        complete(newBoard);

    } else {
        showAlert("No Possible Solutions")
    }
}


function isValidSudoku(board) {
    const mySet = new Set();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === ".") {
                continue;
            }
            let tempRow = board[i][j] + " in row: " + i;
            let tempCol = board[i][j] + " in column: " + j;
            let tempBox = board[i][j] + " in box: " + Math.floor(i / 3) + "-" + Math.floor(j / 3);

            if (mySet.has(tempRow) || mySet.has(tempCol) || mySet.has(tempBox)) {
                return false;
            }
            mySet.add(tempRow);
            mySet.add(tempCol);
            mySet.add(tempBox);
        }
    }

    return true;
}

/*  Solves the sudoku board   */
function isValid(board, num, row, col) {
    let b_row = Math.floor(row / 3) * 3;
    let b_col = Math.floor(col / 3) * 3;

    for (let i = 0; i < board.length; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
        let curRow = b_row + Math.floor(i / 3);
        let curCol = b_col + Math.floor(i % 3);
        if (board[curRow][curCol] === num)
            return false;
    }
    return true;

}

function solve(board) {

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            if (board[row][col] !== '.') {
                continue;
            }
            for (let i = 1; i <= 9; i++) {
                const s_i = i.toString();
                if (isValid(board, s_i, row, col)) {
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

/* Inserts the correct files from a complete board */
function complete(board) {
    let temp = board.flat();
    for (let i = 0; i < 81; i++) {
        if (temp[i] === ".") continue;
        enterTile(i, temp[i])
    }
}

/* Loads the preset boards */
function preset() {
    let boards = getBoards();
    let board = boards[presetCnt]
    if (presetCnt === boards.length-1) {
        presetCnt = 0;
    } else {
        presetCnt++;
    }
    //let board = boards[Math.floor(Math.random() * 2)]
    clearBoard();
    complete(board);

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