const board = (function gameBoard(){
    let gameBoard = [[[],[],[]],[[],[],[]],[[],[],[]]];

    const clearBoard = () => {
        gameBoard = [[[],[],[]],[[],[],[]],[[],[],[]]];
    }

    const getValue = (row, column) => {
        return (gameBoard[row][column] == 'X' || gameBoard[row][column] == 'O') ? gameBoard[row][column] : '_';
    }

    const setValue = (row, column, value) => {
        if(getValue(row, column) == '_'){
            gameBoard[row][column] = value;
            return true;
        }
        return false;
    }

    const isBoardFull = () => {
        let count = 0;
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(getValue(i,j) == '_')
                    count++;
            }
        }
        if(count == 0)
            return true;
        return false;
    }

    const displayBoard = () => {
        for(let i=0; i<3; i++)
            console.log(`${getValue(i, 0)} ${getValue(i, 1)} ${getValue(i, 2)}`);
    }

    return {getValue, setValue, displayBoard, clearBoard, isBoardFull};
})();

const users = (function user(){
    const u1 = "X";
    const u2 = "O";

    let activePlayer = u1;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer == u1) ? u2 : u1;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    return {u1, u2, switchActivePlayer, getActivePlayer};
})();

const game = (function gameController(){
    let gameOver = false;
    const handleWinner = (winner) => {
        console.log(`Winner is ${winner} !!!`);
        console.log('Game Over');
        gameOver = true;
    };

    const checkWinner = () => {
        // Rows
        if( (board.getValue(0,0) != '_') && (board.getValue(0,0) == board.getValue(0,1)) && (board.getValue(0,1) == board.getValue(0,2)) ) {
            console.log('Row 0');
            handleWinner(users.getActivePlayer());
        }
        else if( (board.getValue(1,0) != '_') && (board.getValue(1,0) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(1,2)) ) {
            console.log('Row 1');
            handleWinner(users.getActivePlayer());
        }
        else if( (board.getValue(2,0) != '_') && (board.getValue(2,0) == board.getValue(2,1)) && (board.getValue(2,1) == board.getValue(2,2)) ) {
            console.log('Row 2');
            handleWinner(users.getActivePlayer());
        }
        // Columns
        else if( (board.getValue(0,0) != '_') && (board.getValue(0,0) == board.getValue(1,0)) && (board.getValue(1,0) == board.getValue(2,0)) ) {
            console.log('Column 0');
            handleWinner(users.getActivePlayer());
        }
        else if( (board.getValue(0,1) != '_') && (board.getValue(0,1) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(2,1)) ) {
            console.log('Column 1');
            handleWinner(users.getActivePlayer());
        }
        else if( (board.getValue(0,2) != '_') && (board.getValue(0,2) == board.getValue(1,2)) && (board.getValue(1,2) == board.getValue(2,2)) ) {
            console.log('Column 2');
            handleWinner(users.getActivePlayer());
        }
        // Diagonals
        else if( (board.getValue(0,0) != '_') && (board.getValue(0,0) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(2,2)) ) {
            console.log('Diagonal 0');
            handleWinner(users.getActivePlayer());
        }
        else if( (board.getValue(0,2) != '_') && (board.getValue(0,2) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(2,0)) ) {
            console.log('Diagonal 1');
            handleWinner(users.getActivePlayer());
        }
        // Tie
        else if( board.isBoardFull() ){
            console.log("It's A Tie.");
            gameOver = true;
        }
    };

    const playRound = () => {
        console.log(`Its ${users.getActivePlayer()}'s turn.`);
        let inputR = prompt('Enter Row');
        let inputC = prompt('Enter Column');
        if( board.setValue(inputR, inputC, users.getActivePlayer()) ){
            if( checkWinner() )
                return ;
            users.switchActivePlayer();
            board.displayBoard();
        }
    };

    const play = () => {
        board.clearBoard();
        if(users.getActivePlayer() == users.u2)
            users.switchActivePlayer();
        gameOver = false;
        while(!gameOver)
            playRound();
    }

    return {play};
})();

// game.play();