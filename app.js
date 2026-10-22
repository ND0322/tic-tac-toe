let board = []
const symbols = ['X', 'O'];
const colors = ["#FF746C", "#A7C7E7"];

let n = 3




let turn = 1;
let active = 0;
let cnt = 0;
let mode = 0;
let ai = 0

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status-message');
const resetBtn = document.getElementById('reset-btn');
const sizeBtn = document.getElementById('size-btn');
const aiBtn = document.getElementById('ai-btn');

resetBtn.addEventListener("click", onReset);

sizeBtn.addEventListener('click', async () => {
    n = n === 3 ? 4 : 3;
    active = 0;
    resetBtn.textContent = "Start Game"
    init();

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/reset?n=${n}`,
            { method: 'POST' }
        );

        if (!response.ok) {
            throw new Error('Failed to reset AI');
        }
    } catch (error) {
        console.error('Could not reset backend:', error);
    }
});

aiBtn.addEventListener('click', () => {
  mode = !mode;
  active = 0;
  resetBtn.textContent = "Start Game"
  aiBtn.textContent = (!mode ? "Play AI" : "Play Human");

})


    
document.addEventListener('DOMContentLoaded', init);

function init(){
    
    boardElement.innerHTML = '';

    turn = 1;

    cnt = 0;

    const t = document.getElementById("status-message");

    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns =`repeat(${n}, 1fr)`;
    t.textContent = "Player " + symbols[1-turn] + "'s Turn";

    board = Array.from({ length: n }, () => Array(n).fill(''));
    for(let i = 0; i < n; i++){
        board[i] = [];

        for(let j = 0; j < n; j++) board[i][j] = '';
    }


    for(let i = 0; i < n; i++){
        for(let j = 0; j < n; j++){
            board[i][j] = '';
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.xcoord = i;
            cell.dataset.ycoord = j;

            cell.addEventListener('click', onClick);
            boardElement.appendChild(cell);

        }
    }

    sizeBtn.textContent = n === 3 ? 'Switch to 4 x 4' : 'Switch to 3 x 3';
    
}

function encode(){
    let mask = 0;
    let power = 1;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let value = 0;

            if (board[i][j] === 'X') value = 1;
            else if (board[i][j] === 'O') value = 2;

            mask += value * power;
            power *= 3;
        }
    }

    return mask;
}

const getMove = async() => {
    try {
          const mask = encode();
          console.log(mask);
          const resp = await fetch(`http://127.0.0.1:5000/getMove?x=${mask}`);
          
          const data = await resp.json();

          return { x: data.i, y: data.j };
    } catch (error){
      console.log("ERROR", error.message);
    }
  }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function onClick(event){

  const element = event.target;

  const x = element.dataset.xcoord;
  const y = element.dataset.ycoord;

  if(!active || ai) return;
  if(board[x][y] !== '') return;

  cnt++;


  turn ^= 1;
  board[x][y] = symbols[turn];

  const t = document.getElementById("status-message");

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
    resetBtn.textContent = "Restart Game"
    t.textContent = "Player " + symbols[turn] + " Won";
    return;
  }

  if(cnt === n * n) {
    t.textContent = "Tie";
    active = 0;
    resetBtn.textContent = "Restart Game";
    return;
  }

  if(mode && !turn)t.textContent = "AI's Turn";
  else t.textContent = "Player " + symbols[1-turn] + "'s Turn";

  if(mode){
    ai = 1;
    await sleep(1000);
    const {x,y} = await getMove();

    cnt++;


    turn ^= 1;
    board[x][y] = symbols[turn];
    cell = boardElement.querySelectorAll('.cell')[x * n + y]; 
    cell.textContent = symbols[turn];
    cell.style.color = colors[turn];

    t.textContent = "Player " + symbols[1-turn] + "'s Turn";

    ai = 0;


    const winningCells = checkWin();
    if(winningCells){
      console.log("won");
      const [start, , end] = winningCells;
      drawLine(start[0], end[0], start[1], end[1], colors[turn]);
      active = 0;
      resetBtn.textContent = "Restart Game"
      t.textContent = "AI Won";
      return;
    }

    if(cnt == n * n){
      console.log("tie");
      t.textContent = "Tie";
      active = 0;
      resetBtn.textContent = "Restart Game"
    }

  }
  
   

}

function checkWin(){
  for(let i = 0; i < n; i++){
    const l = []

    if(board[i][0] == '') continue;
    for(let j = 0; j < n; j++){
      if(board[i][0] == board[i][j]) l.push([i,j]);
    }
    if(l.length == n) return l;
  }

  for(let j = 0; j < n; j++){
    const l = []

    if(board[0][j] == '') continue;
    for(let i = 0; i < n; i++){
      if(board[0][j] == board[i][j]) l.push([i,j]);
    }
    if(l.length == n) return l;
  }


  //check diagonals

  
  if(board[0][0] !== ''){
    const l = []
    for(let i = 0; i < n; i++){
      if(board[i][i] == board[0][0]) l.push([i,i]);
    }

    if(l.length==n) return l;

  }

  if(board[0][n-1] !== ''){
    const l = [];
    for(let i = 0; i < n; i++){
      if(board[i][n-i-1] == board[0][n-1]) l.push([i,n-i-1]);
    }

    if(l.length == n) return l;
    
  }
  return 0;


}

function drawLine(x1, x2, y1, y2, color){
  const cells = boardElement.querySelectorAll('.cell');

  const sc = cells[x1 * n + y1];
  const ec = cells[x2 * n + y2];

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
  active = 1;
  resetBtn.textContent = "Restart Game"
  init();
}




