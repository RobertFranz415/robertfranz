

/*
const GRID_SIZE = 5;
const CELL_SIZE = 10;
const CELL_GAP = 1;
let background = "pink"

export default class Grid {
    #cells

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        // gridElement.style.setProperty("--tile-color", `${background}`);
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE))
        });
    }

    get cellsByCol() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }
    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }

    get cells() {
        return this.#cells;
    }


    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null)
    }

    nextEmptyCell() {
        //console.log(this.#emptyCells)
        //const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[0]
    }

}

class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile
    }

    set tile(value) {
        this.#tile = value;
        if (value == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value
        if (value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    canAccept(tile) {
        return (this.tile == null || (this.mergeTile == null && this.tile.value === tile.value))
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;
        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
    }

    tileResult(res) {
        // switch(res) {
        //     case "correct":
        //         this.#background = "green";
        // }
        if (this.tile == null) return;
        this.tile.resultBackground(res);
    }
    removeTile() {
        if (this.tile == null) return;
        console.log(this.tile)
        this.tile.remove();
    }
}

function createCellElements(gridElement) {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.color = "empty";
        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}
*/