import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"
import { setupUfo, updateUfo, getUfoRect, setUfoLose, isJumping, height } from './ufoscript.js'
import { removeEnemy } from "./enemies.js";
import { isPlaying, lowerScore } from "./gamescript.js";

const worldElem = document.querySelector("[data-world")


let laserTime;
let isShooting;
let firetime = 99999;

export function setupLaser() {
    document.querySelectorAll("[data-laser").forEach(laser => {
        laser.remove()

    })
    isShooting = false;
    // document.removeEventListener("keydown", onShoot)
    // document.addEventListener("keydown", onShoot)

}

export function updateLaser(time, delta) {

    laserTime = time
    let laserr = document.querySelector("[data-laser]");
    

    if (!isShooting && firetime !== 0 && (laserTime - firetime > 100)) {

        isShooting = false;
        firetime = 99999;
        laserr.remove();
    }
    if (isShooting) {
        createLaser(delta);
        isShooting = false;
        if (isJumping){
            removeEnemy();
            lowerScore();
        }
    }
}

// export function getLaserRect() {
//     return laserr.getBoundingClientRect();
// }

// function handleLaser(delta) {
//     if (!isShooting) return;
//     const ufoRect1 = getUfoRect();
//     setCustomProperty(laserElem, "--bottom", ufoRect1.top)
// }

function createLaser(delta) {
    // console.log("LASER")

    const ufoRect1 = getUfoRect();
    const laser = document.createElement("img");
    laser.dataset.laser = true;
    laser.src = "laser-0.png";
    laser.classList.add("laser");
    //laser.id = "laserr"

    setCustomProperty(laser, "--bottom", height);

    worldElem.append(laser);
}

export function onShoot() {
    if (!isJumping || isShooting || !isPlaying) {
        return;
    }
    
    isShooting = true;
    firetime = laserTime;

  }