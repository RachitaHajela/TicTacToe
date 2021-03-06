describe("In ChainReaction", function () {
    /*
    let OK = true;
    let ILLEGAL = false;
    let X_TURN = 0;
    let O_TURN = 1;
    let NO_ONE_TURN = -1;
    let NO_ONE_WINS: number[] = null;
    let X_WIN_SCORES = [1, 0];
    let O_WIN_SCORES = [0, 1];
    let TIE_SCORES = [0, 0];
  
    function expectMove(
        isOk: boolean,
        turnIndexBeforeMove: number,
        boardBeforeMove: Board,
        row: number,
        col: number,
        boardAfterMove: Board,
        turnIndexAfterMove: number,
        endMatchScores: number[]): void {
      let stateTransition: IStateTransition = {
        turnIndexBeforeMove: turnIndexBeforeMove,
        stateBeforeMove: boardBeforeMove ? {board: boardBeforeMove, delta: null} : null,
        move: {
          turnIndexAfterMove: turnIndexAfterMove,
          endMatchScores: endMatchScores,
          stateAfterMove: {board: boardAfterMove, delta: {row: row, col: col}}
        },
        numberOfPlayers: null
      };
      if (isOk) {
        gameLogic.checkMoveOk(stateTransition);
      } else {
        // We expect an exception to be thrown :)
        let didThrowException = false;
        try {
          gameLogic.checkMoveOk(stateTransition);
        } catch (e) {
          didThrowException = true;
        }
        if (!didThrowException) {
          throw new Error("We expect an illegal move, but checkMoveOk didn't throw any exception!")
        }
      }
    }
    */
    var LEGAL = true;
    var ILLEGAL = false;
    var PLAYER1_TURN = 0;
    var PLAYER2_TURN = 1;
    var NO_ONE_TURN = -1;
    var NO_ONE_WINS = null;
    var PLAYER1_WIN_SCORES = [1, 0];
    var PLAYER2_WIN_SCORES = [0, 1];
    var TIE_SCORES = [0, 0];
    var ROWS = 6;
    var COLS = 4;
    function createBoardDelta(row, col, explosions) {
        var cell = { row: row, col: col };
        //cell.row = row;
        //cell.col = col;
        var boardDelta = {
            currMoveCell: cell,
            explosions: explosions };
        return boardDelta;
    }
    function createCellState(playerId, numMolecules) {
        var cellState = { playerId: playerId, numMolecules: numMolecules };
        return cellState;
    }
    function expectMove(isOk, turnIndexBeforeMove, boardBeforeMove, row, col, explosions, boardAfterMove, turnIndexAfterMove, endMatchScores) {
        var stateTransition = {
            turnIndexBeforeMove: turnIndexBeforeMove,
            stateBeforeMove: boardBeforeMove ? { board: boardBeforeMove, delta: null } : null,
            move: {
                turnIndexAfterMove: turnIndexAfterMove,
                endMatchScores: endMatchScores,
                stateAfterMove: { board: boardAfterMove, delta: createBoardDelta(row, col, explosions) }
            },
            numberOfPlayers: null
        };
        if (isOk) {
            gameLogic.checkMoveOk(stateTransition);
        }
        else {
            // We expect an exception to be thrown :)
            var didThrowException = false;
            try {
                gameLogic.checkMoveOk(stateTransition);
            }
            catch (e) {
                didThrowException = true;
            }
            if (!didThrowException) {
                throw new Error("We expect an illegal move, but checkMoveOk didn't throw any exception!");
            }
        }
    }
    function createBoard(boardRepr) {
        var board = [];
        for (var i = 0; i < ROWS; i++) {
            board[i] = [];
            for (var j = 0; j < COLS; j++) {
                if (boardRepr[i][j] == 0) {
                    board[i][j] = { playerId: -1, numMolecules: 0 };
                }
                else if (boardRepr[i][j] > 0) {
                    board[i][j] = { playerId: 0, numMolecules: boardRepr[i][j] };
                }
                else {
                    board[i][j] = { playerId: 1, numMolecules: -boardRepr[i][j] };
                }
            }
        }
        return board;
    }
    /*
    it ("test1 : placing player 1 chip in 0x0 from initial state is legal", function() {
      expectMove(LEGAL, PLAYER1_TURN, null, 0, 0, [],
        createBoard([
            [1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]]), PLAYER2_TURN, NO_ONE_WINS)
    });
    
    it ("test2 : placing player 1 chip in 1x1 already containing one player 1's chip is legal", function() {
      expectMove(LEGAL, PLAYER1_TURN,
        createBoard([
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 0]]),
        1, 1, [],
        createBoard([
            [0, 0, 0, 0],
            [0, 2, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, -1, 0],
            [0, 0, 0, 0]]),
        PLAYER2_TURN, NO_ONE_WINS)
    });
  
    it ("test3 : placing player 2 chip in 1x1 already containing one player 1's chip is illegal", function() {
      expectMove(ILLEGAL, PLAYER2_TURN,
        createBoard([[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]),
        1, 1, [],
        null, PLAYER1_TURN, NO_ONE_WINS)
    });
  
    it ("test4 : placing player 1 chip in 1x1 and setting turn to yourself is illegal", function() {
      expectMove(ILLEGAL, PLAYER1_TURN,
        createBoard([
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]]),
        1, 1, [],
        createBoard([[0, 0, 0, 0], [0, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]),
        PLAYER1_TURN, NO_ONE_WINS)
    });
    
    it ("test5 : placing player 2 chip in 2x2 already containing one player 2's 3 chips (explosion) is legal", function() {
      let cell : Cell = {row : 2, col : 2};
      let explosion : Explosion = {cellsExploded : [cell], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [0, 0, -1, 0],
            [0, -1, 0, -1],
            [0, 0, -1, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0]])}
      expectMove(LEGAL, PLAYER2_TURN,
        createBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, -3, 0],
            [0, 0, 0, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0]]),
        2, 2, [explosion],
        createBoard([
            [0, 0, 0, 0],
            [0, 0, -1, 0],
            [0, -1, 0, -1],
            [0, 0, -1, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0]]),
        PLAYER1_TURN, NO_ONE_WINS)
    });
  
    it ("test6 : placing player 2 chip in 0x2 already containing one player 2's 2 chips (explosion) is legal", function() {
      let cell : Cell = {row : 0, col : 2};
      let explosion : Explosion = {cellsExploded : [cell], boardAfterExplosions: createBoard([
            [0, -1, 0, -1],
            [0, 0, -1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0]])}
      expectMove(LEGAL, PLAYER2_TURN,
        createBoard([
            [0, 0, -2, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0]]),
        0, 2, [explosion],
        createBoard([
            [0, -1, 0, -1],
            [0, 0, -1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [2, 0, 0, 0],
            [0, 0, 0, 0]]),
        PLAYER1_TURN, NO_ONE_WINS)
    });
  
    it ("test7 : placing player 2 chip in 0x0 already containing one player 2's 1 chips (explosion) is legal", function() {
      let cell : Cell = {row : 0, col : 0};
      let explosion : Explosion = {cellsExploded : [cell], boardAfterExplosions: createBoard([
            [0, -1, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]])}
      expectMove(LEGAL, PLAYER2_TURN,
        createBoard([
            [-1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]]),
        0, 0, [explosion],
        createBoard([
            [0, -1, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0]]),
        PLAYER1_TURN, NO_ONE_WINS)
    });
  
    it ("test8 : placing player 1 chip in 3x2 already containing one player 1's 3 chips (two explosions) is legal", function() {
      let cell1 : Cell = {row : 3, col : 2};
      let cell2 : Cell = {row : 2, col : 2};
      let explosion1 : Explosion = {cellsExploded : [cell1], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 4, 0],
            [0, 1, 0, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]])}
      let explosion2 : Explosion = {cellsExploded : [cell2], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [-1, 0, 1, 0],
            [0, 1, 0, 1],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]])}
      expectMove(LEGAL, PLAYER1_TURN,
        createBoard([
            [0, 0, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 3, 0],
            [0, 0, 3, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]]),
        3, 2, [explosion1, explosion2],
        createBoard([
            [0, 0, 0, 0],
            [-1, 0, 1, 0],
            [0, 1, 0, 1],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]]),
        PLAYER2_TURN, NO_ONE_WINS)
    });
  
    it ("test9 : placing player 1 chip in 3x2 already containing one player 1's 3 chips (two explosions) is legal", function() {
      let cell1 : Cell = {row : 3, col : 2};
      let cell2 : Cell = {row : 2, col : 2};
      let explosion1 : Explosion = {cellsExploded : [cell1], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 4, 0],
            [0, 1, 0, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]])}
      let explosion2 : Explosion = {cellsExploded : [cell2], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [-1, 0, 1, 0],
            [0, 1, 0, 1],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]])}
      expectMove(LEGAL, PLAYER1_TURN,
        createBoard([
            [0, 0, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, -3, 0],
            [0, 0, 3, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]]),
        3, 2, [explosion1, explosion2],
        createBoard([
            [0, 0, 0, 0],
            [-1, 0, 1, 0],
            [0, 1, 0, 1],
            [0, 1, 1, 1],
            [0, 0, 1, 0],
            [0, 0, 0, 0]]),
        PLAYER2_TURN, NO_ONE_WINS)
    });
  
    it ("test10 : placing player 1 chip in 3x2 already containing one player 1's 3 chips (two explosions) is legal", function() {
      let cell1 : Cell = {row : 3, col : 2};
      let cell2 : Cell = {row : 2, col : 2};
      let cell3 : Cell = {row : 4, col : 2};
      let explosion1 : Explosion = {cellsExploded : [cell1], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 4, 0],
            [0, 1, 0, 1],
            [0, 0, 4, 0],
            [0, 0, 0, 0]])}
      let explosion2 : Explosion = {cellsExploded : [cell2, cell3], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [-1, 0, 1, 0],
            [0, 1, 0, 1],
            [0, 1, 2, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 0]])}
      expectMove(LEGAL, PLAYER1_TURN,
        createBoard([
            [0, 0, 0, 0],
            [-1, 0, 0, 0],
            [0, 0, 3, 0],
            [0, 0, 3, 0],
            [0, 0, -3, 0],
            [0, 0, 0, 0]]),
        3, 2, [explosion1, explosion2],
        createBoard([
            [0, 0, 0, 0],
            [-1, 0, 1, 0],
            [0, 1, 0, 1],
            [0, 1, 2, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 0]]),
        PLAYER2_TURN, NO_ONE_WINS)
    });
  
    it ("test11 : placing player 1 chip in 3x2 already containing one player 1's 3 chips (two explosions) is legal", function() {
      let cell1 : Cell = {row : 3, col : 2};
      let cell2 : Cell = {row : 2, col : 2};
      let cell3 : Cell = {row : 4, col : 2};
      let explosion1 : Explosion = {cellsExploded : [cell1], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 4, 0],
            [0, 1, 0, 1],
            [0, 0, 4, 0],
            [0, 0, 0, 0]])}
      let explosion2 : Explosion = {cellsExploded : [cell2, cell3], boardAfterExplosions: createBoard([
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 1, 0, 1],
            [0, 1, 2, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 0]])}
      expectMove(LEGAL, PLAYER1_TURN,
        createBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 3, 0],
            [0, 0, 3, 0],
            [0, 0, -3, 0],
            [0, 0, 0, 0]]),
        3, 2, [explosion1],
        createBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 4, 0],
            [0, 1, 0, 1],
            [0, 0, 4, 0],
            [0, 0, 0, 0]]),
        NO_ONE_TURN, PLAYER1_WIN_SCORES)
    });
    */
    /*
    - Simple explosion in middle
    - Explosion edge cases
    - Game end - win , ties
    - Infinite loop
    */
    /*
    it("placing X in 0x0 from initial state is legal", function() {
      expectMove(OK, X_TURN, null, 0, 0,
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], O_TURN, NO_ONE_WINS);
    });
  
    it("placing X in 0x0 from initial state but setting the turn to yourself is illegal", function() {
      expectMove(ILLEGAL, X_TURN, null, 0, 0,
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], X_TURN, NO_ONE_WINS);
    });
  
    it("placing X in 0x0 from initial state and winning is illegal", function() {
      expectMove(ILLEGAL, X_TURN, null, 0, 0,
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], NO_ONE_TURN, X_WIN_SCORES);
    });
  
    it("placing X in 0x0 from initial state and setting the wrong board is illegal", function() {
      expectMove(ILLEGAL, X_TURN, null, 0, 0,
        [['X', 'X', ''],
         ['', '', ''],
         ['', '', '']], O_TURN, NO_ONE_WINS);
    });
  
    it("placing O in 0x1 after X placed X in 0x0 is legal", function() {
      expectMove(OK, O_TURN,
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], 0, 1,
        [['X', 'O', ''],
         ['', '', ''],
         ['', '', '']], X_TURN, NO_ONE_WINS);
    });
  
    it("placing an O in a non-empty position is illegal", function() {
      expectMove(ILLEGAL, O_TURN,
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], 0, 0,
        [['O', '', ''],
         ['', '', ''],
         ['', '', '']], X_TURN, NO_ONE_WINS);
    });
  
    it("cannot move after the game is over", function() {
      expectMove(ILLEGAL, O_TURN,
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['X', '', '']], 2, 1,
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['X', 'O', '']], X_TURN, NO_ONE_WINS);
    });
  
    it("placing O in 2x1 is legal", function() {
      expectMove(OK, O_TURN,
        [['O', 'X', ''],
         ['X', 'O', ''],
         ['X', '', '']], 2, 1,
        [['O', 'X', ''],
         ['X', 'O', ''],
         ['X', 'O', '']], X_TURN, NO_ONE_WINS);
    });
  
    it("X wins by placing X in 2x0 is legal", function() {
      expectMove(OK, X_TURN,
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['', '', '']], 2, 0,
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['X', '', '']], NO_ONE_TURN, X_WIN_SCORES);
    });
  
    it("O wins by placing O in 1x1 is legal", function() {
      expectMove(OK, O_TURN,
        [['X', 'X', 'O'],
         ['X', '', ''],
         ['O', '', '']], 1, 1,
        [['X', 'X', 'O'],
         ['X', 'O', ''],
         ['O', '', '']], NO_ONE_TURN, O_WIN_SCORES);
    });
  
    it("the game ties when there are no more empty cells", function() {
      expectMove(OK, X_TURN,
        [['X', 'O', 'X'],
         ['X', 'O', 'O'],
         ['O', 'X', '']], 2, 2,
        [['X', 'O', 'X'],
         ['X', 'O', 'O'],
         ['O', 'X', 'X']], NO_ONE_TURN, TIE_SCORES);
    });
  
    it("move without board is illegal", function() {
      expectMove(ILLEGAL, X_TURN,
        [['X', 'O', 'X'],
         ['X', 'O', 'O'],
         ['O', 'X', '']], 2, 2,
        null, NO_ONE_TURN, TIE_SCORES);
    });
  
    it("placing X outside the board (in 0x3) is illegal", function() {
      expectMove(ILLEGAL, X_TURN,
        [['', '', ''],
         ['', '', ''],
         ['', '', '']], 0, 3,
        [['', '', '', 'X'],
         ['', '', ''],
         ['', '', '']], O_TURN, NO_ONE_WINS);
    });
    */
});
//# sourceMappingURL=gameLogic_test.js.map