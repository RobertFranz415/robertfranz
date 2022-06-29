import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const SPEED = 0.05
const ENEMY_INTERVAL_MIN = 1100
const ENEMY_INTERVAL_MAX = 5000
const worldElem = document.querySelector("[data-world")

let nextEnemyTime
let numEnemies = 0;
export function setupEnemy() {
    nextEnemyTime = ENEMY_INTERVAL_MIN
    document.querySelectorAll("[data-enemy").forEach(enemy => {
        enemy.remove()
        
    })
}

export function updateEnemy(delta, speedScale) {
    document.querySelectorAll("[data-enemy").forEach(enemy => {
        incrementCustomProperty(enemy, "--left", delta * speedScale * SPEED * -1);
        if (getCustomProperty(enemy, "--left") <= -1) {
            enemy.remove();
            numEnemies++;
        }
    })


    if (nextEnemyTime <= 0) {
        createEnemy()
        nextEnemyTime = randomNumberBetween(ENEMY_INTERVAL_MIN, ENEMY_INTERVAL_MAX) / speedScale;
    }
    nextEnemyTime -= delta
}

export function getEnemyRect() {
    return [...document.querySelectorAll("[data-enemy")].map(enemy => {
        return enemy.getBoundingClientRect()
    })
}
export function removeEnemy() {
    document.querySelectorAll("[data-enemy").forEach(enemy => {
        enemy.remove()
        
    })
}

export function getEnemyCount() {
    return numEnemies;
}

export function resetEnemyCount() {
    numEnemies = 0;
}

function createEnemy() {
    const enemy = document.createElement("img");
    enemy.dataset.enemy = true;
    enemy.src = "ufo-0.png";
    enemy.classList.add("enemy");
    setCustomProperty(enemy, "--left", 100);
    worldElem.append(enemy);
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}