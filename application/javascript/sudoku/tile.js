export default class Tile {
    #tileElement
    #x
    #y
    #value
    #active

    constructor(tileContainer, value, x, y, active) {
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile")
        tileContainer.append(this.#tileElement);
        this.value = value;
        this.x = x;
        this.y = y;
        this.active = active;
    }

    get value() {
        return this.#value;
    }

    set value(v) {
        this.#value = v
        this.#tileElement.textContent = v

    }

    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty("--x", value);
    }

    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty("--y", value);
    }
    get active() {
        return this.#active;
    }
    set active(value) {
        this.#active = value;
        if (value) {
            this.#tileElement.style.setProperty("--background-lightness", `65%`)
        } else {
            this.#tileElement.style.setProperty("--background-lightness", `50%`)
        }
    }



    remove() {
        this.#tileElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? "animationend" : "transitionend"
            , resolve,
             {
                once: true, 
            })
        })
    }
}