//I struggled a bit with the first connect-4, as well as this oo version - so I 
//referred to the Springboard solution and made some alterations; these include 
//changing variable names to names that make more sense to me. I also made a change 
//in the constructor, rather than access the players from a players array, I separated 
//player1 and player2 into their own "thises" - it all still works, and my alterations 
//were made in order to demonstrate my deeper understanding of this project and oop. 

class Game {
    constructor(p1, p2, height = 6, width = 7) {
      // this.players = [p1, p2];
      this.player1 = p1;
      this.player2 = p2;
      this.height = height;
      this.width = width;
      this.currentPlayer = p1;
      this.makeBoard();
      this.makeHtmlBoard();
      this.gameOver = false;
    }
  
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[y][x])
     */
    makeBoard() {
      this.availableSpaces = [];
      for (let y = 0; y < this.height; y++) {
        this.availableSpaces.push(Array.from({ length: this.width }));
      }
    }
  
    /** makeHtmlBoard: make HTML table and row of column tops.  */
  
    makeHtmlBoard() {
      const gameBoard = document.getElementById('board');
      // board.innerHTML = '';
  
      // make column tops (clickable area for adding a piece to that column)
      const clickableTop = document.createElement('tr');
      clickableTop.setAttribute('id', 'column-top');
  
      // store a reference to the handleClick bound function 
      // so that we can remove the event listener correctly later
      this.handleGameClick = this.handleClick.bind(this);
      
      clickableTop.addEventListener("click", this.handleGameClick);
  
      for (let x = 0; x < this.width; x++) {
        const clickCell = document.createElement('td');
        clickCell.setAttribute('id', x);
        clickableTop.append(clickCell);
      }
  
      gameBoard.append(clickableTop);
  
      // make main part of board
      for (let y = 0; y < this.height; y++) {
        const gameRow = document.createElement('tr');
      
        for (let x = 0; x < this.width; x++) {
          const gameCell = document.createElement('td');
          gameCell.setAttribute('id', `${y}-${x}`);
          gameRow.append(gameCell);
        }
      
        board.append(gameRow);
      }
    }
  
    /** findSpotForCol: given column x, return top empty y (null if filled) */
  
    findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.availableSpaces[y][x]) {
          return y;
        }
      }
      return null;
    }
  
    /** placeInTable: update DOM to place piece into HTML board */
  
    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currentPlayer.color;
      piece.style.top = -50 * (y + 2);
  
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
  
    /** endGame: announce game end */
  
    endGame(msg) {
      alert(msg);
      const top = document.querySelector("#column-top");
      top.removeEventListener("click", this.handleGameClick);
    }
  
    /** handleClick: handle click of column top to play piece */
  
    handleClick(evt) {
      // get x from ID of clicked cell
      const x = +evt.target.id;
  
      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
  
      // place piece in board and add to HTML table
      this.availableSpaces[y][x] = this.currentPlayer;
      this.placeInTable(y, x);
  
      // check for tie
      if (this.availableSpaces.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
  
      // check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`The ${this.currentPlayer.color} player won!`);
      }
  
      // switch players
      this.currentPlayer =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
  
    /** checkForWin: check board cell-by-cell for "does a win start here?" */
  
    checkForWin() {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      const _win = cells =>
        cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.availableSpaces[y][x] === this.currentPlayer
        );
  
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
  }
  
  class Player {
    constructor(color) {
      this.color = color;
    }
  }
  
  document.getElementById('start-game').addEventListener('click', () => {
    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);
    new Game(p1, p2);
  });