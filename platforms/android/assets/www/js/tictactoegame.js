(function () {
    var Tictactoegame = function () {
        this.board = [[null, null], [null, null], [null, null]];
        this.winningCombination = [[null, null], [null, null], [null, null]];
    }

    Tictactoegame.prototype = (function () {
        var symbol = { x: 'X', o: 'O' };

        function setWinningCombination(a1, a2, b1, b2, c1, c2) {
            this.winningCombination[a1][a2] = true;
            this.winningCombination[b1][b2] = true;
            this.winningCombination[c1][c2] = true;
        }

        function getResult() {
            var isGameWon = false;
            if (this.board[0][0] === this.board[0][1] && this.board[0][1] === this.board[0][2]) {
                if (this.board[0][0]) {
                    this.setWinningCombination(0, 0, 0, 1, 0, 2);
                    isGameWon = true;
                }
            }

            if (this.board[1][0] === this.board[1][1] && this.board[1][1] === this.board[1][2]) {
                if (this.board[1][0]) {
                    this.setWinningCombination(1, 0, 1, 1, 1, 2);
                    isGameWon = true;
                }
            }

            if (this.board[2][0] === this.board[2][1] && this.board[2][1] === this.board[2][2]) {
                if (this.board[2][0]) {
                    this.setWinningCombination(2, 0, 2, 1, 2, 2);
                    isGameWon = true;
                }
            }

            if (this.board[0][0] === this.board[1][0] && this.board[1][0] === this.board[2][0]) {
                if (this.board[0][0]) {
                    this.setWinningCombination(0, 0, 1, 0, 2, 0);
                    isGameWon = true;
                }
            }

            if (this.board[0][1] === this.board[1][1] && this.board[1][1] === this.board[2][1]) {
                if (this.board[0][1]) {
                    this.setWinningCombination(0, 1, 1, 1, 2, 1);
                    isGameWon = true;
                }
            }

            if (this.board[0][2] === this.board[1][2] && this.board[1][2] === this.board[2][2]) {
                if (this.board[0][2]) {
                    this.setWinningCombination(0, 2, 1, 2, 2, 2);
                    isGameWon = true;
                }
            }

            if (this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
                if (this.board[0][0]) {
                    this.setWinningCombination(0, 0, 1, 1, 2, 2);
                    isGameWon = true;
                }
            }

            if (this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
                if (this.board[0][2]) {
                    this.setWinningCombination(0, 2, 1, 1, 2, 0);
                    isGameWon = true;
                }
            }

            if (isGameWon) {
                return 'Won';
            }

            if (this.isBoardCompletelyFilled()) {
                return 'Draw';
            }

            return 'Continue';
        }

        function isFilled(row, column) {
            return this.board[row][column] === symbol.x || this.board[row][column] === symbol.o;
        }

        function isBoardCompletelyFilled() {
            for (var r = 0; r <= 2; r++) {
                for (var c = 0; c <= 2; c++) {
                    if (!this.isFilled(r, c)) {
                        return false;
                    }
                }
            }

            return true;
        }

        function mergeCells(newBoard) {
            if (newBoard) {
                for (var r = 0; r <= 2; r++) {
                    for (var c = 0; c <= 2; c++) {
                        if (newBoard[r] !== undefined && newBoard[r][c] !== undefined) {
                            this.board[r][c] = newBoard[r][c];
                        }
                    }
                }
            }            
        }

        function makeMove(row, col, symbol) {
            this.board[row][col] = symbol;
            return this.getResult();
        }

        function resetBoard() {

            for (var r = 0; r <= 2; r++) {
                for (var c = 0; c <= 2; c++) {
                    this.board[r][c] = null;
                }
            }
        }

        return {
            makeMove: makeMove,
            resetBoard: resetBoard,
            getResult: getResult,
            isBoardCompletelyFilled: isBoardCompletelyFilled,
            isFilled: isFilled,
            setWinningCombination: setWinningCombination,
            mergeCells: mergeCells
        }

    }());

    window.Tictactoegame = Tictactoegame;

}());