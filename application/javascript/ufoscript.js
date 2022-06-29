import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperty.js"

const ufoElem = document.querySelector("[data-ufo]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.002
const UFO_FRAME_COUNT = 3
const FRAME_TIME = 100


let isJumping
let ufoFrame
let currentFrameTime
let yVelocity
export function setupUfo() {
    isJumping = false
    ufoFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(ufoElem, "--bottom", 15)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
}

export function updateUfo(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)
}

export function getUfoRect() {
    return ufoElem.getBoundingClientRect()
}

export function setUfoLose() {
    ufoElem.src = "ufodead.png"
}

function handleRun(delta, speedScale) {
    if (isJumping) {
        ufoElem.src = `ufo-0.png`
        return
    }

    if (currentFrameTime >= FRAME_TIME) {
        ufoFrame = (ufoFrame + 1) % UFO_FRAME_COUNT
        ufoElem.src = `ufo-${ufoFrame}.png`
        currentFrameTime -= FRAME_TIME
    }
    currentFrameTime += delta * speedScale
}

function handleJump(delta) {
    if (!isJumping) return

    incrementCustomProperty(ufoElem, "--bottom", yVelocity * delta)

    if (getCustomProperty(ufoElem, "--bottom") <= 0) {
        setCustomProperty(ufoElem, "--bottom", 0)
        isJumping = false
    }

    yVelocity -= GRAVITY * delta
}

function onJump(e) {
    if (e.code !== "Space" || isJumping) return
  
    yVelocity = JUMP_SPEED
    isJumping = true
  }