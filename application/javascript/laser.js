import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"
import { setupUfo, updateUfo, getUfoRect, setUfoLose, getIsJumping, getHeight, getHorizontal } from './ufoscript.js'
import { removeEnemy } from "./enemies.js";
import { getIsPlaying, lowerScore } from "./gamescript.js";

const worldElem = document.querySelector("[data-world]")

let laserTime;
let isShooting;
let firetime = 99999;

export function setupLaser() {
    document.querySelectorAll("[data-laser]").forEach(laser => {
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
        if (getIsJumping()){
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

    const ufoRect1 = getUfoRect();
    const laser = document.createElement("img");
    laser.dataset.laser = true;
    laser.src = "laser-0.png";
    laser.classList.add("laser");

    setCustomProperty(laser, "--bottom", getHeight());
    setCustomProperty(laser, "--left", getHorizontal()+4);

    worldElem.append(laser);
}

export function onShoot() {
    if (/* !getIsJumping() || */ isShooting || !getIsPlaying()) {
        return;
    }
    
    isShooting = true;
    firetime = laserTime;

  }