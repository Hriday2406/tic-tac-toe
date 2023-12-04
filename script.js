const board = (function gameBoard(){
    let gameBoard = [['','',''],['','',''],['','','']];

    const clearBoard = () => {
        gameBoard = [['','',''],['','',''],['','','']];
    }

    const getValue = (row, column) => {
        return (gameBoard[row][column] == 'X' || gameBoard[row][column] == 'O') ? gameBoard[row][column] : '';
    }

    const setValue = (row, column, value) => {
        if(getValue(row, column) == ''){
            gameBoard[row][column] = value;
            return true;
        }
        return false;
    }

    const isBoardFull = () => {
        let count = 0;
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(getValue(i,j) == '')
                    count++;
            }
        }
        if(count == 0)
            return true;
        return false;
    }

    return {getValue, setValue, clearBoard, isBoardFull};
})();

const users = (function user(){
    let u1, u2, activePlayer;

    const switchActivePlayer = () => {
        activePlayer = (activePlayer == u1) ? u2 : u1;
    }

    const getActivePlayer = () => activePlayer;

    const setPlayerName = (p1, p2) => {
        if(p1 == '' || p2 == ''){
            u1 = 'X';
            u2 = 'O';
        }
        else if(p1 == p2){
            u1 = p1;
            u2 = p1 + " v2";
        }
        else {
            u1 = p1;
            u2 = p2;
        }
        activePlayer = u1;
    }

    const getPlayerName = (p) => (p == '1') ? u1 : u2;

    return {switchActivePlayer, getActivePlayer, setPlayerName, getPlayerName};
})();

const game = (function gameController(){
    const checkWinner = () => {
        // Rows
        if( (board.getValue(0,0) != '') && (board.getValue(0,0) == board.getValue(0,1)) && (board.getValue(0,1) == board.getValue(0,2)) ) 
            return screen.handleWinner(users.getActivePlayer());
        else if( (board.getValue(1,0) != '') && (board.getValue(1,0) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(1,2)) ) 
            return screen.handleWinner(users.getActivePlayer());
        else if( (board.getValue(2,0) != '') && (board.getValue(2,0) == board.getValue(2,1)) && (board.getValue(2,1) == board.getValue(2,2)) ) 
            return screen.handleWinner(users.getActivePlayer());
        // Columns
        else if( (board.getValue(0,0) != '') && (board.getValue(0,0) == board.getValue(1,0)) && (board.getValue(1,0) == board.getValue(2,0)) ) 
            return screen.handleWinner(users.getActivePlayer());
        else if( (board.getValue(0,1) != '') && (board.getValue(0,1) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(2,1)) ) 
            return screen.handleWinner(users.getActivePlayer());
        else if( (board.getValue(0,2) != '') && (board.getValue(0,2) == board.getValue(1,2)) && (board.getValue(1,2) == board.getValue(2,2)) ) 
            return screen.handleWinner(users.getActivePlayer());
        // Diagonals
        else if( (board.getValue(0,0) != '') && (board.getValue(0,0) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(2,2)) ) 
            return screen.handleWinner(users.getActivePlayer());
        else if( (board.getValue(0,2) != '') && (board.getValue(0,2) == board.getValue(1,1)) && (board.getValue(1,1) == board.getValue(2,0)) ) 
            return screen.handleWinner(users.getActivePlayer());
        // Tie
        else if( board.isBoardFull() )
            return screen.handleWinner('Tie');
        else
            return false;
    };

    return {checkWinner};
})();

const screen = (function screenController(){
    const boardBtn = document.querySelectorAll('.btn');
    const userTurnDiv = document.querySelector('#turn-text');
    const dialog = document.querySelector('dialog');
    const closeBtn = document.querySelector('#dialog-btn');
    const inputs = document.querySelectorAll('.input');

    const cross = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="cross"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`;
    const circle = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="circle"s><path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`;

    boardBtn.forEach(btns => {
        btns.addEventListener('click', playRound);
    });

    closeBtn.addEventListener("click", () => {
        users.setPlayerName(inputs[0].value, inputs[1].value)
        setTurnDiv(`${users.getPlayerName('1')}'s Turn`);
    });

    function playRound(e) {
        let inputR = e.target.dataset.row;
        let inputC = e.target.dataset.col;
        let value = (users.getActivePlayer() == users.getPlayerName('1')) ? 'X' : 'O';
        if( board.setValue(inputR, inputC, value) ){
            e.target.innerHTML = (value == 'X') ? cross : circle;
            if(game.checkWinner())
                return ;
            users.switchActivePlayer();
            userTurnDiv.textContent = `${users.getActivePlayer()}'s Turn`;
        }
    };

    const handleWinner = (winner) => {
        userTurnDiv.textContent = (winner == 'Tie') ? `It's a Tie` : `${winner} WON`;
        if(winner == users.getPlayerName('1'))
            document.body.classList.add('winner');
        else if(winner == users.getPlayerName('2'))
            document.body.classList.add('loser');
        else
            document.body.classList.add('tie');

        const retryBtn = document.createElement('btn');
        retryBtn.classList.add('retry-btn');
        retryBtn.textContent = 'RETRY';
        retryBtn.addEventListener("click", () => {
            board.clearBoard();
            dialog.setAttribute('open', "");
            setTurnDiv(`X's Turn`);
            document.body.classList.remove('winner', 'loser', 'tie');
            boardBtn.forEach(btns => {
                btns.textContent = '';
                btns.disabled = false;
            });
            inputs[0].value = inputs[1].value = '';
            retryBtn.remove();
        })
        document.querySelector('main').appendChild(retryBtn);

        boardBtn.forEach(btns => {
            btns.disabled = true;
        });
        return true;
    };

    const setTurnDiv = (text) => {
        userTurnDiv.textContent = text;
    }

    return {handleWinner, setTurnDiv};
})();