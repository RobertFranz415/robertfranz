import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"
import { getIsPlaying, lowerScore } from "./gamescript.js";

const ufoElem = document.querySelector("[data-ufo]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const UFO_FRAME_COUNT = 3;
const FRAME_TIME = 100;
const MOVE_DISTANCE = 5;

var isJumping;
var height = 0;
var horizontal;
let ufoFrame;
let currentFrameTime;
let yVelocity;
export function setupUfo() {
    isJumping = false;
    ufoFrame = 0;
    currentFrameTime = 0;
    yVelocity = 0;
    setCustomProperty(ufoElem, "--bottom", 0);
    setCustomProperty(ufoElem, "--left", 0);
    // document.removeEventListener("keydown", onJump)
    // document.addEventListener("keydown", onJump)
}

export function updateUfo(delta, speedScale) {
    handleRun(delta, speedScale);
    handleJump(delta);
}

export function getUfoRect() {
    return ufoElem.getBoundingClientRect();
}

export function setUfoLose() {
    ufoElem.src = "ufodead.png";
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        ufoElem.src = `ufo-0.png`;
        return;
    }

    if (currentFrameTime >= FRAME_TIME) {
        ufoFrame = (ufoFrame + 1) % UFO_FRAME_COUNT;
        ufoElem.src = `ufo-${ufoFrame}.png`;
        currentFrameTime -= FRAME_TIME;
    }
    currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
    if (!isJumping) return;
    incrementCustomProperty(ufoElem, "--bottom", yVelocity * delta);
    height = getCustomProperty(ufoElem, "--bottom");

    if (getCustomProperty(ufoElem, "--bottom") <= 0) {
        setCustomProperty(ufoElem, "--bottom", 0);
        isJumping = false;
    }

    yVelocity -= GRAVITY * delta;
}

export function onJump() {
    if (isJumping) return;

    yVelocity = JUMP_SPEED;
    isJumping = true;
}

export function getIsJumping() {
    return isJumping;
}

export function getHeight() {
    return height;
}

export function getHorizontal() {
    return horizontal;
}

export function setHorizontal(x) {
    horizontal = x;
}

export function moveShip(e) {
    if (!getIsPlaying()) return;

    if (e.code === "ArrowRight") {
        if (getCustomProperty(ufoElem, "--left") > 90) return;
        incrementCustomProperty(ufoElem, "--left", MOVE_DISTANCE);
    }
    else if (e.code === "ArrowLeft") {
        if (getCustomProperty(ufoElem, "--left") === 0) return;
        incrementCustomProperty(ufoElem, "--left", -MOVE_DISTANCE)
    }
    horizontal = getCustomProperty(ufoElem, "--left");
}
