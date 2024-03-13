import Board from "./board.js";

let board = new Board(); // creates a new game board

// Examine the grid of the game board in the browser console.
// Create the UI of the game using HTML elements based on this grid.
console.log(board.grid);
console.log(board.numRows);
console.log(board.shipCoordinates);

//**I wrote all code below here: */
window.addEventListener("DOMContentLoaded", event => {
    //build table
    function buildTable(numRows, numCols) {
        let newTable = document.createElement("table");
        newTable.setAttribute("id", "gameBoard");
        for (let i = 0; i < numRows; i++) {
            let newRow = document.createElement("tr");
            for (let j = 0; j < numCols; j++) {
                let newDataCell = document.createElement("td");
                newDataCell.setAttribute("data-row", i);
                newDataCell.setAttribute("data-col", j);
                newDataCell.setAttribute("data-value", board.grid[i][j]);
                newDataCell.setAttribute("id", i + "," + j);
                newDataCell.classList.add("unknown");
                newRow.appendChild(newDataCell);
            }
            newTable.appendChild(newRow);
        }
        document.body.appendChild(newTable);
    }

    //track clicked cells (to prevent counting double clicks as additional hits)
    let alreadyClickedCells = new Set();

    function buildResetButton() {
        let resetButton = document.createElement("button");
        resetButton.innerText = "Reset Game";
        resetButton.setAttribute("id", "reset-button");
        document.body.appendChild(resetButton);
    }

    buildResetButton();
    buildTable(board.numRows, board.numCols);

    function deleteOldTable() {
        let table = document.getElementById("gameBoard");
        document.body.removeChild(table);
    }

    function createNewBoard() {
        board = new Board();
    }

    function deleteWinMessage() {
        let winMessage = document.getElementById("game-end-message");
        if (winMessage) {
            document.body.removeChild(winMessage);
        }
    }

    function resetGame() {
        deleteWinMessage();
        createNewBoard();

        deleteOldTable();
        buildTable(board.numRows, board.numCols);

        table = document.getElementById("gameBoard");
        table.addEventListener("click", handleClick);

        alreadyClickedCells = new Set();
    }

    let resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", resetGame);

    //determine which cell was clicked
    function identifyCell(event) {
        let clickedCell = event.target;
        return clickedCell;
    }

    //read value
    function readCellValue(element) {
        let value = element.dataset.value;
        return value;
    }

    //if value is not null
        //run make hit
        //hit specific ship
        //add inner text as value
        //remove class unknown
        //add class hit
        //check for game over
    function successfulClick(value, element) {
        let row = element.dataset.row;
        let col = element.dataset.col;

        board.makeHit(row, col);
        handleShipHit(row, col);

        element.classList.remove("unknown");
        element.classList.add("hit");
        element.innerText = value;

        if (board.isGameOver()) {
            gameEnd();
        }
    }

    function handleShipHit(row, col) {
        let shipName = board.findShipAt(row, col);
        
        if (board.numsRemainingByShip[shipName] === 0) {
            sunkItMessage();
        } else {
            hitShipMessage(shipName);
        }
    }

    //if value is null
        //remove class unknown
        //add class miss
    function unsuccessfulClick(element) {
        element.classList.remove("unknown");
        element.classList.add("miss");
    }

    //handle click
    function handleClick(event) {
        let clickedCell = identifyCell(event);

        if (!alreadyClickedCells.has(clickedCell.getAttribute("id"))) {
            alreadyClickedCells.add(clickedCell.getAttribute("id"));
            clearTemporaryMessage();

            let cellValue = readCellValue(clickedCell);

            if (cellValue !== "null") {
                successfulClick(cellValue, clickedCell);
            } else {
                unsuccessfulClick(clickedCell);
            }
        }
    }

    let table = document.getElementById("gameBoard");
    table.addEventListener("click", handleClick);

    function hitShipMessage(ship) {
        let newDiv = document.createElement("div");
        newDiv.innerText = "You've hit the " + ship + "!";
        newDiv.setAttribute("class", "temporary-message");
        newDiv.setAttribute("id", "hit-ship-message");
        document.body.appendChild(newDiv);
    }

    function sunkItMessage() {
        let newDiv = document.createElement("div");
        newDiv.innerText = "SUNK IT!";
        newDiv.setAttribute("class", "temporary-message");
        newDiv.setAttribute("id", "sunk-it-message");
        document.body.appendChild(newDiv);
    }

    function clearTemporaryMessage() {
        let message = document.getElementsByClassName("temporary-message")[0];
        if (message) {
            document.body.removeChild(message);
        }
    }

    //disable all of the listeners
    function disableAllListeners() {
        table.removeEventListener("click", handleClick);
    }

    //add a game over message
    function gameOverMessage() {
        let newDiv = document.createElement("div");
        newDiv.innerText = "Congratulations! You won!";
        newDiv.setAttribute("id", "game-end-message");
        document.body.appendChild(newDiv);
    }

    //game ender function
    function gameEnd() {
        clearTemporaryMessage();
        gameOverMessage();
        disableAllListeners();
    }
});


//Notes: 
    //there is a thing where if you click in the table but not on an actual cell
    //it console logs an error, but nothing bad actually happens so I feel like 
    //it's not a big deal.... could be fixed though I guess

    //the other thing is that the functions for setting the bottom messages are
    //a little repetitive... so there could be a better way to rework those probably
    //but I'm not sure it's worth it...?