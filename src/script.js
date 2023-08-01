const board = document.querySelector('#board');
const squares = document.querySelectorAll('.square');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
let turn = 'X';
let winner = null;
let lastHovered = null;

function startGame() {
	squares.forEach((square) => (square.textContent = ''));
	turn = 'X';
	winner = null;
	message.textContent = `${turn} gets to start.`;
}

function nextMove(square) {
	if (winner !== null) {
		message.textContent = `${turn} already won.`;
	} else if (square.textContent === '') {
		square.textContent = turn;
		switchTurn();
	} else {
		message.textContent = 'Pick another square.';
	}
}

function switchTurn() {
	if (checkForWinner(turn)) {
		message.textContent = `Congratulations, ${turn}! You win!`;
		winner = turn;
	} else {
		turn = turn === 'X' ? 'O' : 'X';
		message.textContent = `It's ${turn}'s turn.`;
        if (turn === 'O') {
            computerMove();
        }
	}
}

function checkForWinner(move) {
	if (Array.from(squares).every((square) => square.textContent !== '')) {
		startGame();
	}
	return (
		checkRow(0, 1, 2, move) ||
		checkRow(3, 4, 5, move) ||
		checkRow(6, 7, 8, move) ||
		checkRow(0, 3, 6, move) ||
		checkRow(1, 4, 7, move) ||
		checkRow(2, 5, 8, move) ||
		checkRow(0, 4, 8, move) ||
		checkRow(2, 4, 6, move)
	);
}

function checkRow(a, b, c, move) {
	return squares[a].textContent === move && squares[b].textContent === move && squares[c].textContent === move;
}

function computerMove() {
    // find the best move for the computer, then make that move
    // make sure to try to win first, then try to block the player from winning if they have two in a row
    // if neither of those are true, then pick a random square
    let bestMove = null;
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].textContent === '') {
            squares[i].textContent = turn;
            if (checkForWinner(turn)) {
                squares[i].textContent = '';
                bestMove = i;
                break;
            } else {
                squares[i].textContent = '';
            }
        }
    }
    if (bestMove === null) {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].textContent === '') {
                squares[i].textContent = 'X';
                if (checkForWinner('X')) {
                    squares[i].textContent = '';
                    bestMove = i;
                    break;
                } else {
                    squares[i].textContent = '';
                }
            }
        }
    }
    if (bestMove === null) {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].textContent === '') {
                squares[i].textContent = 'O';
                if (checkForWinner('O')) {
                    squares[i].textContent = '';
                    bestMove = i;
                    break;
                } else {
                    squares[i].textContent = '';
                }
            }
        }
    }
    if (bestMove === null) {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].textContent === '') {
                squares[i].textContent = 'X';
                squares[i].textContent = '';
                bestMove = i;
                break;
            }
        }
    }
    squares[bestMove].textContent = turn;
    switchTurn();
}

document.addEventListener('DOMContentLoaded', function () {
	startGame();
	board.addEventListener('click', function (e) {
		nextMove(e.target);
	});
	// enter key
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') {
			nextMove(e.target);
		}
	});
	document.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowUp') {
			if (lastHovered === null) {
				squares[4].focus();
				lastHovered = 4;
			} else if (lastHovered > 2) {
				squares[lastHovered - 3].focus();
				lastHovered = lastHovered - 3;
			}
		} else if (e.key === 'ArrowDown') {
			if (lastHovered === null) {
				squares[4].focus();
				lastHovered = 4;
			} else if (lastHovered < 6) {
				squares[lastHovered + 3].focus();
				lastHovered = lastHovered + 3;
			}
		} else if (e.key === 'ArrowLeft') {
			if (lastHovered === null) {
				squares[4].focus();
				lastHovered = 4;
			} else if (lastHovered % 3 !== 0) {
				squares[lastHovered - 1].focus();
				lastHovered = lastHovered - 1;
			}
		} else if (e.key === 'ArrowRight') {
			if (lastHovered === null) {
				squares[4].focus();
				lastHovered = 4;
			} else if (lastHovered % 3 !== 2) {
				squares[lastHovered + 1].focus();
				lastHovered = lastHovered + 1;
			}
		}
	});
    // when user hovers a square show a preview overlay of the current player's move
    board.addEventListener('mouseover', function (e) {
        e.target.focus();
        if (e.target.textContent === '') {
            e.target.classList.add('previewed');
            e.target.setAttribute('data-preview', turn);
            e.target.setAttribute('aria-label', `Preview ${turn} in this square`);
        }
    });
    board.addEventListener('mouseout', function (e) {
        e.target.classList.remove('previewed');
        e.target.removeAttribute('data-preview');
        e.target.removeAttribute('aria-label');
    });
	resetButton.addEventListener('click', startGame);
});
