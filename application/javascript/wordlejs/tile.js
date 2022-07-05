
/*
const styleElem = document.querySelector("[data-color]");

export default class Tile {
    #tileElement
    #x
    #y
    #value
    #background

    constructor(tileContainer, value ) {
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile");
        //this.#tileElement.dataset.color = "red";
        tileContainer.append(this.#tileElement);
        this.value = value
    }

    get value() {
        return this.#value;
    }

    set value(v) {
        this.#value = v
        this.#tileElement.textContent = v
        const power = Math.log2(v)
        const backgroundLightness = 100 - power * 9
        //console.log(styleElem);
        //this.#tileElement.style.setProperty("--background-color", `aliceblue`)
        // this.#tileElement.style.setProperty("--text-lightness", `${backgroundLightness <= 50 ? 90 : 10}%`)
    }

    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty("--x", value);
    }

    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty("--y", value);
    }
    get background() {
        return this.#background;
    }
    set background(v) {
        this.#background = value;
        this.#tileElement.style.setProperty("--tile-color", `${v}`);
        //this.#tileElement.style.setProperty("--tile-color", "green");
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

    resultBackground(res) {
        // switch(res) {
        //     case "correct":
        //         this.#background = "green";
        // }
        this.#tileElement.style.setProperty("--tile-color", `${res}`);
    }
}

*/