
        document.addEventListener('DOMContentLoaded', () => {
            // Game state
            let board = ['', '', '', '', '', '', '', '', ''];
            let currentPlayer = 'X';
            let gameActive = true;
            let vsComputer = false;
            let scores = { X: 0, O: 0, draws: 0 };
            
            // DOM elements
            const cells = document.querySelectorAll('.cell');
            const playerTurnDisplay = document.querySelector('.player-turn');
            const gameStatusDisplay = document.querySelector('.game-status');
            const newGameBtn = document.querySelector('.btn-new-game');
            const resetBtn = document.querySelector('.btn-reset');
            const modeBtn = document.querySelector('.btn-mode');
            const modal = document.querySelector('.modal');
            const modalMessage = document.querySelector('.modal-message');
            const closeModalBtn = document.querySelector('.btn-close-modal');
            
            // Winning conditions
            const winningConditions = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6]             // diagonals
            ];
            
            // Initialize game
            initGame();
            
            function initGame() {
                board = ['', '', '', '', '', '', '', '', ''];
                currentPlayer = 'X';
                gameActive = true;
                
                updateDisplay();
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.classList.remove('x', 'o', 'winning-cell');
                    cell.addEventListener('click', handleCellClick);
                });
            }
            
            function handleCellClick(e) {
                const clickedCell = e.target;
                const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
                
                // If cell already filled or game not active, ignore click
                if (board[clickedCellIndex] !== '' || !gameActive) return;
                
                // Process player move
                processMove(clickedCellIndex, currentPlayer);
                
                // If playing against computer and game is still active
                if (vsComputer && gameActive && currentPlayer === 'O') {
                    setTimeout(makeComputerMove, 500);
                }
            }
            
            function processMove(cellIndex, player) {
                // Update board
                board[cellIndex] = player;
                
                // Update UI
                const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
                cell.textContent = player;
                cell.classList.add(player.toLowerCase());
                
                // Check for win or draw
                const roundWon = checkWin(player);
                const roundDraw = checkDraw();
                
                if (roundWon) {
                    handleWin(player, roundWon);
                } else if (roundDraw) {
                    handleDraw();
                } else {
                    // Switch player
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateDisplay();
                }
            }
            
            function checkWin(player) {
                for (let i = 0; i < winningConditions.length; i++) {
                    const [a, b, c] = winningConditions[i];
                    if (board[a] === player && board[b] === player && board[c] === player) {
                        return winningConditions[i]; // Return winning combination
                    }
                }
                return false;
            }
            
            function checkDraw() {
                return board.every(cell => cell !== '');
            }
            
            function handleWin(player, winningCombination) {
                gameActive = false;
                scores[player]++;
                
                // Highlight winning cells
                winningCombination.forEach(index => {
                    const cell = document.querySelector(`.cell[data-index="${index}"]`);
                    cell.classList.add('winning-cell');
                });
                
                // Show win message
                const symbol = player === 'X' ? '❌' : '⭕';
                modalMessage.textContent = `Player ${player} (${symbol}) wins! 🎊`;
                modal.style.display = 'flex';
                
                updateDisplay();
            }
            
            function handleDraw() {
                gameActive = false;
                scores.draws++;
                
                modalMessage.textContent = "Game ended in a draw! 🤝";
                modal.style.display = 'flex';
                
                updateDisplay();
            }
            
            function makeComputerMove() {
                if (!gameActive) return;
                
                // Simple AI: first try to win, then block, then random
                let move = findWinningMove('O') || 
                           findWinningMove('X') || 
                           findRandomMove();
                
                if (move !== null) {
                    processMove(move, 'O');
                }
            }
            
            function findWinningMove(player) {
                for (let i = 0; i < winningConditions.length; i++) {
                    const [a, b, c] = winningConditions[i];
                    // Check if two in a row and third is empty
                    if ((board[a] === player && board[b] === player && board[c] === '') ||
                        (board[a] === player && board[c] === player && board[b] === '') ||
                        (board[b] === player && board[c] === player && board[a] === '')) {
                        
                        if (board[a] === '') return a;
                        if (board[b] === '') return b;
                        if (board[c] === '') return c;
                    }
                }
                return null;
            }
            
            function findRandomMove() {
                const availableMoves = [];
                board.forEach((cell, index) => {
                    if (cell === '') availableMoves.push(index);
                });
                
                if (availableMoves.length > 0) {
                    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }
                return null;
            }
            
            function updateDisplay() {
                const symbol = currentPlayer === 'X' ? '❌' : '⭕';
                playerTurnDisplay.textContent = gameActive ? 
                    `Player ${currentPlayer}'s Turn (${symbol})` : 
                    `Game Over - ${currentPlayer === 'X' ? 'O' : 'X'} Won!`;
                
                gameStatusDisplay.textContent = `X: ${scores.X} | O: ${scores.O} | Draws: ${scores.draws}`;
            }
            
            // Event listeners
            newGameBtn.addEventListener('click', initGame);
            
            resetBtn.addEventListener('click', () => {
                scores = { X: 0, O: 0, draws: 0 };
                initGame();
            });
            
            modeBtn.addEventListener('click', () => {
                vsComputer = !vsComputer;
                modeBtn.textContent = vsComputer ? 'Play vs Human' : 'Play vs Computer';
                initGame();
            });
            
            closeModalBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                initGame();
            });
        });
    
