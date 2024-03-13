export default class Board {
    constructor() {
        this.numRows = 9;
        this.numCols = 9;
            //*Note* I replaced given game logic to label specific ships
            //to notify player when each specific ship is sunk
            //so replaced the below this.ships and added every variable that has a list of ships
            //this.ships = [5, 4, 3, 3, 2];
        this.ships = {
            AircraftCarrier: 5,
            Battleship: 4,
            Destroyer: 3,
            Submarine: 3, 
            Cruiser: 2
        };
        this.shipCoordinates = {
            AircraftCarrier: [],
            Battleship: [],
            Destroyer: [],
            Submarine: [],
            Cruiser: []
        };
        this.grid = this.populateGrid();
        this.numsRemaining = 17;
        this.numsRemainingByShip = {
            AircraftCarrier: 5,
            Battleship: 4,
            Destroyer: 3,
            Submarine: 3,
            Cruiser: 2
        }
    }

    populateGrid() {
        const grid = [];
        // Initialize empty board
        for (let i = 0; i < this.numRows; i++) {
            grid.push(Array(this.numCols).fill(null));
        }
        const orientations = ["x+", "x-", "y+", "y-"];
        for (const [key, value] of Object.entries(this.ships)) {
            let orientation = orientations[Math.floor(Math.random() * 4)];
            let x = Math.floor(Math.random() * this.numCols);
            let y = Math.floor(Math.random() * this.numRows);

            // // While ship doesn't fit
            while (!this.verifyFit(grid, value, x, y, orientation)) {
                // Choose new orientation and start coord
                orientation = orientations[Math.floor(Math.random() * 4)];
                x = Math.floor(Math.random() * this.numCols);
                y = Math.floor(Math.random() * this.numRows);
            }

            // Set coordinates
            this.setShip(grid, value, x, y, orientation, key);
        }

        return grid;
    }

    makeHit(row, col) {
        if (this.grid[row][col]) {
            this.numsRemaining--;
            //decrement specific ship
            this.hitShip(row, col);
        }
        return this.grid[row][col];
    }

    //*wrote these two ship specific functions
    hitShip(row, col) {
        let hitShip = this.findShipAt(row, col);
        this.numsRemainingByShip[hitShip]--;
    }

    //*
    findShipAt(row, col) {
        let hitShip;

        for (const key in this.shipCoordinates) {
            
            let value = this.shipCoordinates[key];
            if (value.length > 0) {
                value.forEach(coordinate => {
                    if (coordinate[0] === Number(row) && coordinate[1] === Number(col)) {
                        hitShip = key;
                    }
                });
            }

        }
        return hitShip;
    }

    verifyFit(grid, length, x, y, orientation) {
        if (orientation === "x+") {
            if (x + length - 1 > this.numCols - 1) return false;
            if (grid[y].slice(x, x + length).some(el => el !== null)) return false;
        } else if (orientation === "x-") {
            if (x - length + 1 < 0) return false;
            if (grid[y].slice(x - length + 1, x + 1).some(el => el !== null)) return false;
        } else if (orientation === "y+") {
            if (y + length - 1 > this.numRows - 1) return false;
            for(let i = y; i < y + length; i++){
                if(grid[i][x] !== null) return false;
            }
        } else {
            if (y - length + 1 < 0) return false;
            for(let i = y; i > y - length; i--){
                if(grid[i][x] !== null) return false;
            }
        }
        return true;
    }

    setShip(grid, length, x, y, orientation, shipName) {
        if (orientation === "x+") {
            for(let i = x; i < x + length; i++) {
                grid[y][i] = length;
                this.shipCoordinates[shipName].push([y, i]); //*added these lines
            }
        } else if (orientation === "x-") {
            for(let i = x; i > x - length; i--) {
                grid[y][i] = length;
                this.shipCoordinates[shipName].push([y, i]); //*
            }
        } else if (orientation === "y+") {
            for(let i = y; i < y + length; i++) {
                grid[i][x] = length;
                this.shipCoordinates[shipName].push([i, x]); //*
            }
        } else {
            for(let i = y; i > y - length; i--) {
                grid[i][x] = length;
                this.shipCoordinates[shipName].push([i, x]); //*
            }
        }
    } 

    isGameOver() {
        return this.numsRemaining === 0;
    }
}
