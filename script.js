const board = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
const gameBoardElement = document.getElementById('game-board');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
];


board.forEach(cell => {
    cell.addEventListener('click', () => {
        const cellIndex = cell.getAttribute('data-index');

       
        if (gameState[cellIndex] !== '' || !gameActive) return;

        
        handlePlayerMove(cellIndex);

        
        if (gameActive) {
            setTimeout(() => handleComputerMove(), 500); 
        }
    });
});


function handlePlayerMove(cellIndex) {
    gameState[cellIndex] = currentPlayer;
    updateCellUI(cellIndex);
    checkResult();
    currentPlayer = 'O'; 
}


function handleComputerMove() {
    if (!gameActive) return;

   
    const aiMove = findBestMove();
    if (aiMove !== -1) {
        gameState[aiMove] = currentPlayer;
        updateCellUI(aiMove);
        checkResult();
    }
    currentPlayer = 'X';
}


function updateCellUI(cellIndex) {
    const cell = board[cellIndex];
    cell.textContent = gameState[cellIndex];
    cell.classList.add('played');
}


function checkResult() {
    let roundWon = false;

    
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            if (currentPlayer === 'X') {
                announceWinner('You Win!');
                triggerParticleEffect(condition);
            } else {
                announceWinner('You Lost!');
            }
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        return;
    }

    
    if (!gameState.includes('')) {
        announceWinner("It's a Draw!");
        gameActive = false;
        return;
    }

   
    message.textContent = `Player ${currentPlayer === 'X' ? 'O' : 'X'}'s Turn`;
}


function announceWinner(text) {
    message.textContent = text;
    message.style.fontSize = '2rem';
    message.style.color = text === 'You Win!' ? '#2ecc71' : '#e74c3c'; 
}


function triggerParticleEffect(condition) {
    for (let index of condition) {
        const cell = board[index];
        createParticleEffect(cell);
    }
}


function createParticleEffect(element) {
    const rect = element.getBoundingClientRect();
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-container');
    particleContainer.style.top = `${rect.top}px`;
    particleContainer.style.left = `${rect.left}px`;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.backgroundColor = currentPlayer === 'X' ? '#2ecc71' : '#e74c3c'; 
        particleContainer.appendChild(particle);
    }

    document.body.appendChild(particleContainer);

   
    setTimeout(() => {
        particleContainer.remove();
    }, 1000);
}


function findBestMove() {
    
    for (let condition of winningConditions) {
        const [a, b, c] = condition;

       
        if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === '') return c;
        if (gameState[a] === 'O' && gameState[c] === 'O' && gameState[b] === '') return b;
        if (gameState[b] === 'O' && gameState[c] === 'O' && gameState[a] === '') return a;

       
        if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === '') return c;
        if (gameState[a] === 'X' && gameState[c] === 'X' && gameState[b] === '') return b;
        if (gameState[b] === 'X' && gameState[c] === 'X' && gameState[a] === '') return a;
    }

   
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') return i;
    }

    return -1; 
}


restartButton.addEventListener('click', () => {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    message.textContent = `Player X's Turn`;
    message.style.fontSize = '1.2rem'; 
    message.style.color = '#ecf0f1'; 

    board.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('played');
    });

   
    document.querySelectorAll('.particle-container').forEach(container => container.remove());
});
