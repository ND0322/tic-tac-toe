const board = []
const symbols = ['X', 'O'];
const colors = ["#FF746C", "#A7C7E7"];

for(let i = 0; i < 3; i++){
    board[i] = [];

    for(let j = 0; j < 3; j++) board[i][j] = '';
}



let turn = 1;
let active = 1;
let cnt = 0;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status-message');
const resetBtn = document.getElementById('reset-btn');


document.addEventListener('DOMContentLoaded', init);

function init(){
    active = 1;
    boardElement.innerHTML = '';

    turn = 1;

    cnt = 0;

    const t = document.getElementById("status-message");

    t.textContent = "Player " + symbols[1-turn] + "'s Turn";


    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            board[i][j] = '';
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.xcoord = i;
            cell.dataset.ycoord = j;

            cell.addEventListener('click', onClick);
            boardElement.appendChild(cell);

        }
    }

    resetBtn.addEventListener("click", onReset);
}

function onClick(event){
    
    const element = event.target;

    const x = element.dataset.xcoord;
    const y = element.dataset.ycoord;

    if(!active) return;
    if(board[x][y] !== '') return;

    cnt++;


    turn ^= 1;
    board[x][y] = symbols[turn];

    const t = document.getElementById("status-message");

    t.textContent = "Player " + symbols[1-turn] + "'s Turn";
    element.textContent = symbols[turn];
    element.style.color = colors[turn];

    //const symb = document.createElement("p");
    //symb.textContent = symbols[turn];
    //element.appendChild(symb);


    const winningCells = checkWin();
    if(winningCells){
      console.log("won");
      const [start, , end] = winningCells;
      drawLine(start[0], end[0], start[1], end[1], colors[turn]);
      active = 0;
      t.textContent = "Player " + symbols[turn] + " Won";
      return;
    }

    if(cnt == 9){
      console.log("tie");
      t.textContent = "Tie";
      active = 0;
    }

   

}

function checkWin(){
  for(let i = 0; i < 3; i++){
    const l = []

    if(board[i][0] == '') continue;
    for(let j = 0; j < 3; j++){
      if(board[i][0] == board[i][j]) l.push([i,j]);
    }
    if(l.length == 3) return l;
  }

  for(let j = 0; j < 3; j++){
    const l = []

    if(board[0][j] == '') continue;
    for(let i = 0; i < 3; i++){
      if(board[0][j] == board[i][j]) l.push([i,j]);
    }
    if(l.length == 3) return l;
  }


  //check diagonals

  
  if(board[0][0] !== ''){
    const l = []
    for(let i = 0; i < 3; i++){
      if(board[i][i] == board[0][0]) l.push([i,i]);
    }

    if(l.length==3) return l;

  }

  if(board[0][2] !== ''){
    const l = [];
    for(let i = 0; i < 3; i++){
      if(board[i][2-i] == board[0][2]) l.push([i,2-i]);
    }

    if(l.length == 3) return l;
    
  }
  return 0;


}

function drawLine(x1, x2, y1, y2, color){
  const cells = boardElement.querySelectorAll('.cell');

  const sc = cells[x1 * 3 + y1];
  const ec = cells[x2 * 3 + y2];

  const board = boardElement.getBoundingClientRect();
  const srect = sc.getBoundingClientRect();
  const erect = ec.getBoundingClientRect();

  const cx1 = srect.left + srect.width / 2 - board.left;
  const cy1 = srect.top + srect.height/2 - board.top;
  const cx2 = erect.left + erect.width / 2 - board.left;
  const cy2 = erect.top + erect.height/2 - board.top;

  const dx = cx2 - cx1;
  const dy = cy2 - cy1;

  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / length;
  const uy = dy / length;

  const angle = Math.atan2(dy, dx);


  const extension = Math.hypot(board.width, board.height);

  const line = document.createElement('div');
  line.classList.add('winning-line');
  line.style.backgroundColor = color;

  line.style.width = `${Math.hypot(dx, dy) + 2 * extension}px`;
  line.style.left = `${cx1 - Math.cos(angle) * extension}px`;
  line.style.top = `${cy1 - Math.sin(angle) * extension}px`;
  line.style.transformOrigin = 'left center';
  line.style.transform = `rotate(${angle}rad)`;

  boardElement.appendChild(line);

}




function onReset(){
    init();
}




