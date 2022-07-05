import { setupGround, updateGround } from './ground.js'
import { setupUfo, updateUfo, getUfoRect, setUfoLose, onJump, moveShip, setHorizontal } from './ufoscript.js'
import { setupBuilding, updateBuilding, getBuildingRect, getBuildingCount, setBuildingCount } from './building.js'
import { setupEnemy, updateEnemy, getEnemyRect } from './enemies.js'
import { onShoot, setupLaser, updateLaser } from './laser.js'

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world]');
const scoreElem = document.querySelector('[data-score]');
const startScreenElem = document.querySelector('[data-start-screen]');

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleInput);

setupGround();

let lastTime = null;
let speedScale;
let score;
var isPlaying = false;


/* Is constantly updating the game */
function update(time) {

    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }
    const delta = time - lastTime;

    updateGround(delta, speedScale);
    updateUfo(delta, speedScale);
    updateBuilding(delta, speedScale);
    updateEnemy(delta, speedScale);
    updateSpeedScale(delta);
    updateScore(delta);
    updateLaser(time, delta);
    if (checkLose()) return handleLose();

    lastTime = time;
    window.requestAnimationFrame(update);
}

/* Checks to see if the player has collided with an obstacle */
function checkLose() {
    const ufoRect = getUfoRect();

    return (getBuildingRect().some(rect => isCollision(rect, ufoRect)) ||
        getEnemyRect().some(rect1 => isCollision(rect1, ufoRect)));
}

/* Checks to see if rect1 and rect2 ever collide */
function isCollision(rect1, rect2) {

    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    );
}

/* Lowers score by 10 when called */
export function lowerScore() {
    score -= 10;
}

/* Slowly increases the speed of the ground */
function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
}

/* Updates the score everytime the game is updated */
function updateScore(delta) {
    score += delta * .01;
    scoreElem.textContent = Math.floor(score);
}

/* Initializes the game */
function handleStart() {
    //if (e.code !== "Enter") return;
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupUfo();
    setupBuilding();
    setupLaser();
    setupEnemy();
    setHorizontal(0);
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update);
    isPlaying = true;
}

/*  Handles the loss including showing the start message,
    showing stats, reseting game, and removing any lasers */
function handleLose() {
    let cnt = getBuildingCount();
    setUfoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleInput /*, { once: true } */)
        startScreenElem.classList.remove("hide")
        startScreenElem.innerHTML = `Score: ${Math.floor(score)}  Jumped over ${cnt} buildings<br>  Press Enter to play again`
    }, 100)
    setBuildingCount(0);
    let laserr = document.querySelector("[data-laser]");
    if (laserr) {
        laserr.remove();
    }
    isPlaying = false;
}

/* Handles any inputs */
function handleInput(e) {
    if (e.code === "Enter") {
        handleStart();
    }
    else if (e.code === "Space") {
        onJump();
    }
    else if (e.code === "KeyF") {
        onShoot();
    }
    else if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
        moveShip(e);
    }
}

/* Scales the game based on the window */
function setPixelToWorldScale() {

    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH;
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
    }

    worldElem.getElementsByClassName.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.getElementsByClassName.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}

export function getScore() {
    return score;
}

export function getIsPlaying() {
    return isPlaying;
}