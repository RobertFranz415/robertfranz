import { setupGround, updateGround } from './ground.js'
import { setupUfo, updateUfo, getUfoRect, setUfoLose } from './ufoscript.js'
import { setupBuilding, updateBuilding, getBuildingRect, getBuildingCount, resetBuildingCount } from './building.js'
import { setupEnemy, updateEnemy, getEnemyRect, removeEnemy, getEnemyCount, resetEnemyCount } from './enemies.js'
import { setupLaser, updateLaser } from './laser.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart,)

setupGround()

let lastTime = null;
let speedScale;
export let score;
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
// window.requestAnimationFrame(update)

function checkLose() {
    const ufoRect = getUfoRect();

    return (getBuildingRect().some(rect => isCollision(rect, ufoRect)) ||
             getEnemyRect().some(rect1 => isCollision(rect1, ufoRect)));
}

function isCollision(rect1, rect2) {
    
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}

export function lowerScore() {
    score -= 10;
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta * .01;
    scoreElem.textContent = Math.floor(score)
}

function handleStart(e) {
    if (e.code !== "Enter") return;
    lastTime = null;
    speedScale = 1
    score = 0
    setupGround();
    setupUfo();
    setupBuilding();
    setupLaser();
    setupEnemy();
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update);
}

function handleLose() {
    let cnt = getBuildingCount();
    setUfoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true })
        startScreenElem.classList.remove("hide")
        startScreenElem.innerHTML = `Score: ${Math.floor(score)}  Jumped over ${cnt} buildings<br>  Press Enter to play again`
    }, 100)
    resetBuildingCount();
}

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