const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.getElementById('winningMessageText');
const restartButton = document.getElementById('restartButton');
const friendButton = document.getElementById('friendButton');
const aiButton = document.getElementById('aiButton');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
let circleTurn;
let aiMode = false;
let gameStarted = false;
let scoreX = 0;
let scoreO = 0;

friendButton.addEventListener('click', () => {
    aiMode = false;
    initializeGame();
});

aiButton.addEventListener('click', () => {
    aiMode = true;
    initializeGame();
});

restartButton.addEventListener('click', restartGame);

function initializeGame() {
    gameStarted = true;
    startGame();
}

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    winningMessageElement.style.display = 'none';
    if (aiMode && !circleTurn) {
        aiMove();
    }
}

function handleClick(e) {
    if (!gameStarted) return;
    const cell = e.target;
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
        updateScore(currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (aiMode && !circleTurn) {
            aiMove();
        }
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!';
    } else {
        winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    winningMessageElement.style.display = 'flex';
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (circleTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function aiMove() {
    const emptyCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.click();
}

function restartGame() {
    winningMessageElement.style.display = 'none';
    startGame();
}

function updateScore(currentClass) {
    if (currentClass === X_CLASS) {
        scoreX++;
        scoreXElement.textContent = scoreX;
    } else {
        scoreO++;
        scoreOElement.textContent = scoreO;
    }
}
