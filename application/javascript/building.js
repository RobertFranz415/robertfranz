import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const SPEED = 0.05
const BUILDING_INTERVAL_MIN = 500
const BUILDING_INTERVAL_MAX = 2000
const worldElem = document.querySelector("[data-world")

let nextBuildingTime
let numBuildings = 0;
export function setupBuilding() {
    nextBuildingTime = BUILDING_INTERVAL_MIN
    document.querySelectorAll("[data-building").forEach(building => {
        building.remove()
        
    })
}

export function updateBuilding(delta, speedScale) {
    document.querySelectorAll("[data-building").forEach(building => {
        incrementCustomProperty(building, "--left", delta * speedScale * SPEED * -1);
        if (getCustomProperty(building, "--left") <= -1) {
            building.remove();
            numBuildings++;
        }
    })


    if (nextBuildingTime <= 0) {
        createBuilding()
        nextBuildingTime = randomNumberBetween(BUILDING_INTERVAL_MIN, BUILDING_INTERVAL_MAX) / speedScale;
    }
    nextBuildingTime -= delta
}

export function getBuildingRect() {
    return [...document.querySelectorAll("[data-building")].map(building => {
        return building.getBoundingClientRect()
    })
}

export function getBuildingCount() {
    return numBuildings;
}

export function resetBuildingCount() {
    numBuildings = 0;
}

function createBuilding() {
    const building = document.createElement("img");
    building.dataset.building = true;
    building.src = "building.png";
    building.classList.add("building");
    setCustomProperty(building, "--left", 100);
    worldElem.append(building);
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}