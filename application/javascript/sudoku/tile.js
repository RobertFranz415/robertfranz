export default class Tile {
    #tileElement
    #x
    #y
    #value
    #active

    constructor(tileContainer, value, x, y, active) {
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile")
        this.#tileElement.dataset.num = (x  + (y * 9))
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

    flip() {
        if (this.#x === 2 || this.#x === 5) {
            this.#tileElement.classList.add("r-col");
        } else if (this.#x === 3 || this.#x === 6) {
            this.#tileElement.classList.add("l-col");
        }
        if (this.#y === 2 || this.#y === 5) {
            this.#tileElement.classList.add("t-row");
        } else if (this.#y === 3 || this.#y === 6) {
            this.#tileElement.classList.add("b-row");
        }


        setTimeout(() => {
            this.#tileElement.classList.add("flip")
        }, ((100) / 2));

        this.#tileElement.addEventListener(
            "transitionend",
            () => {
                this.#tileElement.classList.remove("flip");  
            })

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