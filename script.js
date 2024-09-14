const gameBoard = (function () {
    let board;

    const getBoard = () => board;

    const resetBoard = () => board = Array.from({ length: 3 }, () => Array(3).fill(null));

    const placeMark = (row, column) => {
        if (row < 1 || row > 3 || column < 1 || column > 3) {
            console.log("Invalid value!");
            return;
        }
        if (board[row-1][column-1] !== null) {
            console.log("Spot is already marked!");
            return;
        }
        const player = playerManager.getActivePlayer();
        console.log(`${player.name} marked row ${row} and column ${column}.`)
        board[row-1][column-1] = player.marker;
        playerManager.switchPlayerTurn();
    };

    return { placeMark, getBoard, resetBoard };
})();

const playerManager = (function () {
    const players = [
        {
            name: "Player 1",
            marker: "X",
            score: 0
        },
        {
            name: "Player 2",
            marker: "O",
            score: 0
        }
    ];

    const setPlayerNames = (name1, name2) => {
        players[0]["name"] = name1;
        players[1]["name"] = name2;
    }
    
    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;
    const resetActivePlayer = () => activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getScore = (i) => players[i]["score"];
    const addScore = (i) => players[i]["score"]++;
    const getPlayerName = (i) => players[i]["name"];

    return { switchPlayerTurn, getActivePlayer, 
        setPlayerNames, addScore, getScore, 
        getPlayerName, resetActivePlayer };
})();

const gameController = (function () {

    const checkGameEnd = () => {
        let board = gameBoard.getBoard();

        const winPatterns = 
        [
        // Horizontal checks
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],

        // Vertical checks
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],

        //Diagonal checks
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
        ]

        const equality = (array1, array2) => {
            if (array1.length !== array2.length) {
                return false;
            }
            for (let i = 0; i < array1.length; i++) {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }
            return true;
        }

        const patternX = (element) => equality(element,["X", "X", "X"]);
        const patternO = (element) => equality(element,["O", "O", "O"]);

        const xWin = winPatterns.some(patternX);
        const oWin = winPatterns.some(patternO);
        
        const boardFull = () => board.every(row => !row.includes(null));
    
        if (xWin || oWin || boardFull()) {
            console.log("Round finished!");
    
            if (xWin) {
                console.log(`${playerManager.getPlayerName(0)} won!`);
                playerManager.addScore(0);
            } else if (oWin) {
                console.log(`${playerManager.getPlayerName(1)} won!`);
                playerManager.addScore(1);
            } else if (boardFull()) {
                console.log(`It's a tie!`);  
            }
            
        console.log(`Player 1 score: ${playerManager.getScore(0)}`);
        console.log(`Player 2 score: ${playerManager.getScore(1)}`);
        }
    }

    const playTurns = (row, column) => {
        gameBoard.placeMark(row, column);
        display.updateBoard();
        checkGameEnd();
    }

    const playRound = () => {
        console.log("Starting new round...");
        gameBoard.resetBoard();
        playerManager.resetActivePlayer();
        playTurns(1,1);
        playTurns(1,2);
        playTurns(1,3);
        playTurns(2,2);
        playTurns(2,3);
        playTurns(2,1);
        playTurns(3,2);
        playTurns(3,3);
        playTurns(3,1);
    }

    return { checkGameEnd, playTurns, playRound };
})();

const display = (function() {

    const updateBoard = () => {
        const grid = document.querySelector("#grid");
        grid.replaceChildren();

        const rows = gameBoard.getBoard().flat();

        rows.forEach((element, i) => {
            const div = document.createElement("div");
            if (element !== null) {
                div.classList.add(element === "X" ? "cross" : "circle");
            }
            grid.appendChild(div);
        })
    }

    return { updateBoard };
})();