var aiService;
(function (aiService) {
    /** Returns the move that the computer player should do for the given state in move. */
    function findComputerMove(move) {
        return createComputerMove(move);
    }
    aiService.findComputerMove = findComputerMove;
    /**
     * Returns all the possible moves for the given state and turnIndexBeforeMove.
     * Returns an empty array if the game is over.
     */
    /*
    export function getPossibleMoves(state: IState, turnIndexBeforeMove: number): IMove[] {
      let possibleMoves: IMove[] = [];
      for (let i = 0; i < gameLogic.ROWS; i++) {
        for (let j = 0; j < gameLogic.COLS; j++) {
          try {
            possibleMoves.push(gameLogic.createMove(state, i, j, turnIndexBeforeMove));
          } catch (e) {
            // The cell in that position was full.
          }
        }
      }
      return possibleMoves;
    }
    */
    function score(board, row, col, prevMove) {
        var move;
        try {
            move = gameLogic.createMove(prevMove.stateAfterMove, row, col, prevMove.turnIndexAfterMove);
        }
        catch (e) {
            return 10000;
        }
        var newBoard = move.stateAfterMove.board;
        var opponentCells = 0;
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (newBoard[i][j].playerId != -1 && newBoard[i][j].playerId != prevMove.turnIndexAfterMove) {
                    opponentCells++;
                }
            }
        }
        return opponentCells;
    }
    /**
     * Returns the move that the computer player should do for the given state.
     * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
     * and it has either a millisecondsLimit or maxDepth field:
     * millisecondsLimit is a time limit, and maxDepth is a depth limit.
     */
    function createComputerMove(prevMove) {
        //TODO : handle empty board, randomization
        var currBoard = prevMove.stateAfterMove.board;
        var bestCells = [];
        //let bestRow : number = -1;
        //let bestCol : number = -1;
        var bestScore = 1000;
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                var currScore = score(currBoard, i, j, prevMove);
                if (currScore < bestScore) {
                    //bestRow = i;
                    //bestCol = j;
                    bestScore = currScore;
                    bestCells = [];
                }
                if (currScore === bestScore) {
                    var newCell = { row: i, col: j };
                    bestCells.push(newCell);
                }
            }
        }
        var bestCellsLength = bestCells.length;
        var index = getRandomInt(0, bestCellsLength);
        return gameLogic.createMove(prevMove.stateAfterMove, bestCells[index].row, bestCells[index].col, prevMove.turnIndexAfterMove);
    }
    aiService.createComputerMove = createComputerMove;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
})(aiService || (aiService = {}));
//# sourceMappingURL=aiService.js.map