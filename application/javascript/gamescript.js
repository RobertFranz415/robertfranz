import { setupGround, updateGround } from './ground.js'
import { setupUfo, updateUfo, getUfoRect, setUfoLose } from './ufoscript.js'
import { setupBuilding, updateBuilding, getBuildingRect } from './building.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector('[data-world]')
const scoreElem = document.querySelector('[data-score]')
const startScreenElem = document.querySelector('[data-start-screen]')

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

setupGround()

let lastTime = null
let speedScale
let score
function update(time) {
    if (lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return;
    }
    const delta = time - lastTime;

    updateGround(delta, speedScale)
    updateUfo(delta, speedScale)
    updateBuilding(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    if (checkLose()) return handleLose()

    lastTime = time;
    window.requestAnimationFrame(update);
}
// window.requestAnimationFrame(update)

function checkLose() {
    const ufoRect = getUfoRect();
    return getBuildingRect().some(rect => isCollision(rect, ufoRect))
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right && 
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )

}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta *.01;
    scoreElem.textContent = Math.floor(score)
}

function handleStart() {
    lastTime = null;
    speedScale = 1
    score = 0
    setupGround();
    setupUfo();
    setupBuilding();
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update);
}

function handleLose() {
    setUfoLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, {once: true})
        startScreenElem.classList.remove("hide")
    }, 100)
}

function setPixelToWorldScale() {
    console.log("HELLO")
    let worldToPixelScale;
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH;
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
    }

    worldElem.getElementsByClassName.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.getElementsByClassName.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}