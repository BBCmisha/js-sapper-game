const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const minesCounterBlock = document.querySelector('.mines-count');
const timeCounter = document.querySelector('.time-count');
// popups
const startButton = document.querySelector('.popup-button_start');
const restartButtons = document.querySelectorAll('.popup-button_restart');
const popupStart = document.querySelector('.popup-start');
const popupSuccess = document.querySelector('.popup-success');
const popupLose = document.querySelector('.popup-lose');
const settingsButtons = document.querySelectorAll('.popup-settings');
// settings
const settingsBlock = document.querySelector('.settings');
const widthInput = document.querySelector('.settings__input_width');
const heightInput = document.querySelector('.settings__input_height');
const minesInput = document.querySelector('.settings__input_mines');


let cellSize = 30;                            // cell width and height
let fieldWidth = 18;                          // the width of the playing field in cells
let fieldHeight = 18;                         // the height of the playing field in cells
let canvasWidth = fieldWidth * cellSize;      // canvas width in pixels
let canvasHeight = fieldHeight * cellSize;    // canvas height in pixels
let cells = [];                               // matrix of filled cells
let openedCells = [];                         // open cell matrix
let mines = 45;                               // number of mines
let timer = null;
let timeCount = 0;
let minesCount = mines;


// implementation of settings

function checkInput (input) {
    let inputValue = +input.value;

    if (!Number.isNaN(inputValue) && inputValue > 3) {
        input.classList.remove('error');
        return true;
    }

    input.classList.add('error');
    return false;
}

function checkSettings () {
    if (fieldWidth != null &&
        fieldHeight != null &&
        mines != null &&
        (fieldHeight * fieldWidth) * 0.5 > mines) {
        return true;
    }

    return false;
}


// implementation of game

function drawField () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = cellSize + 0.5; x < canvasWidth; x += cellSize) {
        context.moveTo(x, 0);
        context.lineTo(x, canvasHeight);
    }
    
    for (let y = cellSize + 0.5; y < canvasHeight; y += cellSize) {
        context.moveTo(0, y);
        context.lineTo(canvasWidth, y);
    }
    
    context.strokeStyle = "#767888";
    context.stroke();
}

function setCells () {
    for (let i = 0; i < fieldHeight; i++) {
        cells[i] = new Array();
        openedCells[i] = new Array();
        
        for (let j = 0; j < fieldWidth; j++) {
            cells[i][j] = 0;
            openedCells[i][j] = null;
        }
    }
}

function setMines () {
    let count = mines;
    
    while (count) {
        let randomCell = getRandomInt(0, fieldWidth - 1);
        let randomRow = getRandomInt(0, fieldHeight - 1);

        if (cells[randomRow][randomCell] == 0) {
            cells[randomRow][randomCell] = 'M';
            count--;
        }
    }
}

function setNumbers () {
    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            let num = 0;

            if (cells[i][j] == 0) {

                if (j != fieldWidth - 1 && cells[i][j+1] == 'M') {
                    num += 1;
                }
                if (j != 0 && cells[i][j-1] == 'M') {
                    num += 1;
                }
                if (i != fieldHeight - 1 && cells[i+1][j] == 'M') {
                    num += 1;
                }
                if (i != 0 && cells[i-1][j] == 'M') {
                    num += 1;
                }
                if (i != fieldHeight - 1 && j != fieldWidth - 1 && cells[i+1][j+1] == 'M') {
                    num += 1;
                }
                if (i != fieldHeight - 1 && j != 0 && cells[i+1][j-1] == 'M') {
                    num += 1;
                }
                if (i != 0 && j != fieldWidth - 1 && cells[i-1][j+1] == 'M') {
                    num += 1;
                }
                if (i != 0 && j != 0 && cells[i-1][j-1] == 'M') {
                    num += 1;
                }

                cells[i][j] = num;

            }
        }
    }
}

function drawClickedCell (cellX, cellY) {
    openedCells[cellY][cellX] = cells[cellY][cellX];

    context.fillStyle = "grey";
    context.fillRect(cellX * cellSize + 2, cellY * cellSize + 2, cellSize - 3, cellSize - 3);

    if (cells[cellY][cellX] == 'M') {
        context.beginPath();
        context.arc(cellX * cellSize + cellSize/2, cellY * cellSize + cellSize/2, 10, 0, Math.PI*2, false);
        context.fillStyle = "#fff";
        context.fill();
        context.closePath();
    } else if (cells[cellY][cellX] != 0) {
        context.fillStyle = "#fff";
        context.font = 'bold 20px sans-serif';
        context.fillText(cells[cellY][cellX], cellX * cellSize + cellSize/2 - 5, cellY * cellSize + cellSize/2 + 5);
    } else {
        drawEmptyField (cellX, cellY);
    }
}

function drawFlag (cellX, cellY) {
    context.fillStyle = "#fff";
    context.font = 'bold 20px sans-serif';
    context.fillText('#', cellX * cellSize + cellSize/2 - 5, cellY * cellSize + cellSize/2 + 5);
}

function drawEmptyField (clickedX, clickedY) {
    if (clickedX != fieldWidth-1 && openedCells[clickedY][clickedX+1] == null) {
        drawClickedCell(clickedX+1, clickedY);
    }
    if (clickedX != fieldWidth-1 && clickedY != fieldHeight-1 && openedCells[clickedY+1][clickedX+1] == null) {
        drawClickedCell(clickedX+1, clickedY+1);
    }
    if (clickedY != fieldHeight-1 && openedCells[clickedY+1][clickedX] == null) {
        drawClickedCell(clickedX, clickedY+1);
    }
    if (clickedX != 0 && clickedY != fieldHeight-1 && openedCells[clickedY+1][clickedX-1] == null) {
        drawClickedCell(clickedX-1, clickedY+1);
    }
    if (clickedX != 0 && openedCells[clickedY][clickedX-1] == null) {
        drawClickedCell(clickedX-1, clickedY);
    }
    if (clickedX != 0 && clickedY != 0 && openedCells[clickedY-1][clickedX-1] == null) {
        drawClickedCell(clickedX-1, clickedY-1);
    }
    if (clickedY != 0 && openedCells[clickedY-1][clickedX] == null) {
        drawClickedCell(clickedX, clickedY-1);
    }
    if (clickedX != fieldWidth-1 && clickedY != 0 && openedCells[clickedY-1][clickedX+1] == null) {
        drawClickedCell(clickedX+1, clickedY-1);
    }
}

function isVictory () {
    let count = 0;

    for (let i = 0; i < fieldHeight; i++) {
        for (let j = 0; j < fieldWidth; j++) {
            if (openedCells[i][j] == null || openedCells[i][j] == '#') {
                count++;
            }
        }
    }

    if (count == mines) {
        return true;
    }

    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function init() {
    minesCount = mines;
    minesCounterBlock.innerHTML = minesCount;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    setCells();
    setMines();
    setNumbers();
    drawField();

    timer = setInterval(() => {
        timeCounter.innerHTML = timeCount;
        timeCount++;
    }, 1000)
}


// EVENT --------------------------
//      LISTENERS -----------------
document.addEventListener('DOMContentLoaded', () => {
    popupStart.classList.add('active');
});

startButton.addEventListener('click', () => {
    if (checkSettings()) {
        init();
        startButton.parentElement.classList.remove('active');
        settingsBlock.classList.remove('active');
    }
});

restartButtons.forEach((item) => {
    item.addEventListener('click', () => {
        if (checkSettings()) {
            init();
            item.parentElement.classList.remove('active');
            settingsBlock.classList.remove('active');
        }
    });
});

settingsButtons.forEach((item) => {
    item.addEventListener('click', () => {
        settingsBlock.classList.toggle('active');
    })
})

widthInput.addEventListener('input', () => {
    if (checkInput(widthInput)) {
        fieldWidth = +widthInput.value;
        canvasWidth = fieldWidth * cellSize;
    } else {
        fieldWidth = null;
    }
});

heightInput.addEventListener('input', () => {
    if (checkInput(heightInput)) {
        fieldHeight = +heightInput.value;
        canvasHeight = fieldHeight * cellSize;
    } else {
        fieldHeight = null;
    }
});

minesInput.addEventListener('input', () => {
    if (checkInput(minesInput)) {
        mines = +minesInput.value;
    } else {
        mines = null;
    }
});

    // Event listeners for canvas
canvas.addEventListener('click', function (e) {
    let x = e.pageX - e.target.offsetLeft,
        y = e.pageY - e.target.offsetTop;

    let cellX = Math.floor(x / cellSize);
    let cellY = Math.floor(y / cellSize);
    
    if (openedCells[cellY][cellX] == null && openedCells[cellY][cellX] != '#') {
        drawClickedCell(cellX, cellY);
    }

    if (openedCells[cellY][cellX] == 'M') {
        setTimeout(() => {
            timeCount = 0;
            clearInterval(timer);
            popupLose.classList.add('active');
        }, 100);
    }

    if (isVictory()) {
        setTimeout(() => {
            timeCount = 0;
            clearInterval(timer);
            popupSuccess.classList.add('active');
        }, 100);
    }
});

canvas.addEventListener('contextmenu', function (e) {
    let x = e.pageX - e.target.offsetLeft,
        y = e.pageY - e.target.offsetTop;

    let cellX = Math.floor(x / cellSize);
    let cellY = Math.floor(y / cellSize);

    e.preventDefault();
    if (openedCells[cellY][cellX] == null && minesCount != 0) {
        openedCells[cellY][cellX] = '#';
        drawFlag(cellX, cellY);
        minesCount--;
        minesCounterBlock.innerHTML = minesCount;
    } else if (openedCells[cellY][cellX] == '#') {
        openedCells[cellY][cellX] = null;
        context.clearRect(cellX * cellSize + 1, cellY * cellSize + 0.5, cellSize - 0.5, cellSize - 0.5);
        minesCount++;
        minesCounterBlock.innerHTML = minesCount;
    }
});
