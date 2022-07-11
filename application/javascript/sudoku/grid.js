const GRID_SIZE = 9;
const CELL_SIZE = 6;
const CELL_GAP = 1;

export default class Grid {
    #cells

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
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

    get cellsByGrid() {
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

    get #fullCells() {
        return this.#cells.filter(cell => cell.tile != null)
    }

    fullCells() {
        return this.#fullCells;
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex]
    }

    clearTiles() {
        this.#fullCells.forEach(cell => {
            cell.tile.remove();
            cell.removeTile();
        });
    }

    activeCell() {
        return this.#cells.filter(cell => cell.active === true)
    }
}

class Cell {
    #cellElement
    #x
    #y
    #tile
    #active

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
        this.#active = false;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get active() {
        return this.#active;
    }

    get tile() {
        return this.#tile
    }

    set tile(value) {
        this.#tile = value;
        if (value == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
        this.#tile.active = this.#active;
    }

    setActive() {
        if (this.#cellElement.dataset.state === "active") {
            this.#cellElement.dataset.state = "inactive";
            this.#active = false;
        } else {
            this.#cellElement.dataset.state = "active";
            this.#active = true;
        }
    }

    setFalse() {
        this.#cellElement.dataset.state = "inactive";
        this.#active = false;
    }

    canAccept(tile) {
        return (this.tile == null || (this.mergeTile == null && this.tile.value === tile.value))
    }

    removeTile() {
        if (this.tile == null) return;
        this.tile.remove();
        this.tile = null
    }
}

function createCellElements(gridElement) {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.num = i;
        if ((i+1) % 3 === 0 && ((i+1) % 9 !== 0)) {
            cell.classList.add("r-col")
        } else if ((i) % 3 === 0 && ((i+1) % 9 !== 1)) {
            cell.classList.add("l-col")
        }
        if (((i) % 27 > 17 && i < 73)) {
            cell.classList.add("t-row")
        } else if ((i) % 27 < 9 && i > 10) {
            cell.classList.add("b-row")
        }

        cells.push(cell);
        gridElement.append(cell);
    }
    return cells;
}