class Player{
  constructor(color, num){
    this.color = color; 
    this.num = num; 
  }

  toString(){
    return this.num + '';
  }
}


class Game{
  constructor(height, width){
    this.WIDTH = width; 
    this.HEIGHT = height; 
    this.board = [];
    this.gameActive = false; 
    this.activateBtn = document.querySelector('#start');
    this.activateBtn.addEventListener('click', ()=>this.startGame());
    this.makeBoard(); 
    this.makeHtmlBoard(); 
  }

  loadPlayers(){
    this.p1 = new Player(document.querySelector('#p1Color').value, 1);
    this.p2 = new Player(document.querySelector('#p2Color').value, 2);
    this.currPlayer = this.p1;
  }

  startGame = ()=>{
    this.loadPlayers(); 
    this.gameActive = true;
    this.activateBtn.removeEventListener('click', this.startGame); 
    this.activateBtn.innerText = 'Restart Game'; 
    this.activateBtn.addEventListener('click', ()=>this.restartGame());
    document.querySelector('#colorDir').style.display = 'block';

  }

  restartGame(){
    this.loadPlayers();
    this.gameActive = true;
    this.board = [];
    document.querySelector('#board').innerHTML = '';
    this.makeBoard(); 
    this.makeHtmlBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', (evt) => this.handleClick(evt));
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }
  
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color; 
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    this.gameActive = false;
    alert(msg);
  }

  handleClick(evt) {
    if(!this.gameActive){
      return;
    }
    
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // noticed that when the player clicks in between cells x is set to NaN so i'm rejecting those clicks.
    if(Number.isNaN(x)){
      return; 
    }
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.num;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }

  checkForWin() {
    const _win = (cells)=>{
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.num
      );
    }
  
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
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

const game = new Game(6,7);


