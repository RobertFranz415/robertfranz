import { getDict, getTargetWords } from "./variables.js";

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");
const msgElem = document.querySelector("[data-message]");

const offsetFromDate = new Date(2022, 5, 7);
const msOffset = Date.now() - offsetFromDate;
const dayOffset = msOffset / 1000 / 60 / 60 / 24;
const list = getTargetWords();
const dictList = getDict();
const targetWord = list[Math.floor(dayOffset)];
let numGuess = 0;  // keeps track of the number of guesses
var history = [];  // keeps track of the results of the player's guesses
var currRes = [];  // the current guess results
var temp = [];     // array of char in target word used to keep track of the previous letters in a guess

function sayWord(targetWord) {
    console.log(targetWord);
}

startGuess();
//sayWord(targetWord);

function startGuess() {
    history.push(currRes);  // pushes the current guess into history
    currRes = [];  // resets current guess
    document.addEventListener("click", handleMouseClick);
    document.addEventListener("keydown", handleKeyPress);
}

function endGuess() {
    document.removeEventListener("click", handleMouseClick);
    document.removeEventListener("keydown", handleKeyPress);
}

function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key);
        return;
    }
    if (e.target.matches("[data-enter]")) {
        submitGuess();
        return;
    }
    if (e.target.matches("[data-delete]")) {
        deleteKey();
        return;
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess();
        return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return;
    }

    //if keu pressed is a letter
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        pressKey(e.key);
        return;
    }
}

function pressKey(key) {
    const activeTiles = getActiveTiles();

    // if there are already 5 letters entered, return
    if (activeTiles.length >= WORD_LENGTH) return;

    // enter the letter into the next empty tile
    const nextTile = guessGrid.querySelector(":not([data-letter])");
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = "active";

}

function deleteKey() {
    const activeTiles = getActiveTiles();
    const lastActiveTile = activeTiles[activeTiles.length - 1];

    // if there are no letters entered, return
    if (lastActiveTile == null) return;

    // clear last tile
    lastActiveTile.textContent = "";
    delete lastActiveTile.dataset.state;
    delete lastActiveTile.dataset.letter;
}

function submitGuess() {
    // if there are not 5 letters entered or if the word guessed 
    // is not in the dictionary, return
    const activeTiles = [...getActiveTiles()];
    if (activeTiles.length !== WORD_LENGTH) {
        showAlert("Not enough letters");
        shakeTiles(activeTiles);
        return;
    }
    
    const guessTiles = activeTiles.reduce((word, tile) => {
        return word + tile.dataset.letter;
    }, "")

    if (!dictList.includes(guessTiles)) {
        showAlert("Not in dictionary");
        shakeTiles(activeTiles);
        return;
    }

    // otherwise, increment the guess count, create a copy of the target word we can change,
    // and flip over each tile
    numGuess++;
    temp = targetWord.split('');
    endGuess();
    activeTiles.forEach((...params) => flipTile(...params, guessTiles));

}

function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter;
    const key = keyboard.querySelector(`[data-key="${letter}"i]`);
    
    // flips each tile one at a time, only flips half way
    setTimeout(() => {
        tile.classList.add("flip")}, 
        ((index * FLIP_ANIMATION_DURATION) / 2));
    
    // once tile is fliped half way, deteremine result of tile, change it's properties to match
    // the result and flip back the other way to appear as a full flip
    tile.addEventListener(
        "transitionend",
        () => {
            tile.classList.remove("flip")
            if (temp[index] === letter) {
                tile.dataset.state = "correct";
                key.classList.add("correct");
                currRes.push("correct");
                /* replace indec of temp so that it does not affect the results
                   of the next letters in the guess  */
                temp[temp.indexOf(letter, 0)] = "*";
            } else if (temp.includes(letter)) {
                tile.dataset.state = "wrong-location";
                key.classList.add("wrong-location");
                currRes.push("wrong-loc");
                /* replace indec of temp so that it does not affect the results
                   of the next letters in the guess  */
                temp[temp.indexOf(letter, 0)] = "*";
            } else {
                tile.dataset.state = "wrong";
                key.classList.add("wrong");
                currRes.push("wrong");
            }

            // if all tiles have been flipped, check if the guess was correct
            // if not, guess again
            if (index === array.length - 1) {
                tile.addEventListener(
                    "transitionend",
                    () => {
                        startGuess()
                        checkWinLose(guess, array);
                    },
                    { once: true }
                )
            }
        },
        { once: true }
    )
   
}

function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
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

function shakeTiles(tiles) {
    tiles.forEach(tile => {
        tile.classList.add("shake")
        tile.addEventListener(
            "animationend",
            () => {
                tile.classList.remove("shake")
            },
            { once: true }
        )
    })
}

function removeOverlay() {
    msgElem.classList.add("hidden");
    let exitElem = document.querySelector("[data-exit]")
    exitElem.removeEventListener("click", removeOverlay, { once : true})
}

function showAns() {
    let ansElem = document.querySelector("[data-show-ans]")
    ansElem.innerHTML = targetWord.toUpperCase();
}

function showHistory() {
    let historyElem = document.querySelector("[data-history]");
    let str = ``;
    for (let i = 1; i < history.length; i++){
        str += `<div class="history-row">
                    <div class="row-name">Attempt ${i}: </div>`;
        for (let j = 0; j < 5; j++) {
            if (history[i][j] === "correct") {
                str += `<div class="material-symbols-outlined correct1 nohover">check_box </div>`
            } else if (history[i][j] === "wrong-loc") {
                str += `<div class="material-symbols-outlined wrong-loc1 nohover ">indeterminate_check_box </div>`
            } else {
                str += `<div class="material-symbols-outlined wrong1 nohover">disabled_by_default </div>`
            }
            
        }
        str += `</div>`
    }
    historyElem.innerHTML = str;
}

function showResults(results) {
    if (results){
        msgElem.innerHTML = `
        <div class="result-overlay">
            <div class="result-container">
                <div class="res-space"></div>
                <div class="exit-btn material-symbols-outlined" data-exit >close</div>
                <div class="res">Correct!</div>
                <div class="answer">The word was ${targetWord.toUpperCase()}</div>
                <div class="statistics"> Took ${numGuess} attempt(s) </div>
                <div class="history-cont" data-history >

                </div>
            </div>
        </div>
        `;
    } else {
        msgElem.innerHTML = `
        <div class="result-overlay">
            <div class="result-container">
                <div class="res-space"></div>
                <div class="exit-btn" data-exit >X</div>
                <div class="res">Out of guesses, maybe next time.</div>
                <div class="show-answer" data-show-ans >Click here to see the answer</div>
                <div class="statistics"> Used up all attempts </div>
                <div class="history-cont" data-history>

                </div>
            </div>
        </div>
        `;
        
    let showAnsElem = document.querySelector("[data-show-ans]");
    showAnsElem.addEventListener("click", showAns, { once : true});
    }
    showHistory();
    let exitElem = document.querySelector("[data-exit]");
    exitElem.addEventListener("click", removeOverlay, { once : true});

}

function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
        //showAlert("You Win", 5000);
        danceTiles(tiles);
        showResults(true);
        endGuess();
        return;
    }

    const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
        //showAlert(targetWord.toUpperCase(), null)
        showResults(false);
        endGuess();
    }
}

function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add("dance")
            tile.addEventListener(
                "animationend",
                () => {
                    tile.classList.remove("dance")
                },
                { once: true }
            )
        }, (index * DANCE_ANIMATION_DURATION) / 5)
    })
}


/*
import Grid from "./grid.js";
import Tile from "./tile.js";

const resElem = document.querySelector('[data-result]')
const gameBoard = document.getElementById("game-board");
const msgElem = document.querySelector('[data-msg]');

const grid = new Grid(gameBoard);

setupInput();

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
}

let guess = []
let ans = "farce"
let cnt = 0;
let enterCnt = 0;

function handleInput(e) {
    if (e.code === "Enter" && cnt === 5) {

        enterGuess(enterCnt);
        enterCnt++;
        cnt = 0;
        guess = [];
    } else if (e.code === "Backspace" && cnt > 0) {
        deleteChar();
        grid.nextEmptyCell();
        console.log("entercnt: " + enterCnt + "  cnt: " + cnt)
        console.log(grid.cellsByRow[enterCnt][cnt])
     
        //console.log(grid.cellsByRow())
        // tile.remove()
        cnt--;
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (cnt < 5) {
            grid.nextEmptyCell().tile = new Tile(gameBoard, e.key);
            guess.push(e.key)
            cnt++;
            //console.log(guess.join(""));
        }
    }
    setupInput();
}

function enterGuess(i) {

    let flag = true;

    for (let j = 0; j < 5; j++) {
        let temp = guess[j];
        //console.log((grid.cellsByRow[i][j]))
        if (guess[j] === ans[j]) {
            grid.cellsByRow[i][j].tileResult("#6aaa64");

        } else if (ans.includes(temp)) {
            grid.cellsByRow[i][j].tileResult("#b59f3b");

            flag = false;
        } else {
            grid.cellsByRow[i][j].tileResult("#4e4e4e");

            flag = false;
        }

    }
    if (flag){
        handleWin();
        return;
    }
    if (i === 4){
        handleLose();
    } 

}

function deleteChar() {
    guess.pop();
    grid.cellsByRow[enterCnt][cnt].removeTile();
}

function handleWin() {
    msgElem.innerHTML =
        `<div id="msg-container">
        <div id="msg">Correct!</div>
        <div id="refresh" onClick="window.location.reload();">Play Again</div>
    </div>`;
}

function handleLose() {
    msgElem.innerHTML =
        `<div id="msg-container">
        <div id="msg">You lost</div>
        <div id="refresh" onClick="window.location.reload();">Play Again</div>
    </div>`;
}

*/