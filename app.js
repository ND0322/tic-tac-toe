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
    cnt++;
    const element = event.target;

    const x = element.dataset.xcoord;
    const y = element.dataset.ycoord;

    if(!active) return;
    if(board[x][y] !== '') return;


    turn ^= 1;
    board[x][y] = symbols[turn];

    const t = document.getElementById("status-message");

    t.textContent = "Player " + symbols[1-turn] + "'s Turn";
    element.textContent = symbols[turn];
    element.style.color = colors[turn];

    //const symb = document.createElement("p");
    //symb.textContent = symbols[turn];
    //element.appendChild(symb);

    if(checkWin()){
      console.log("won");
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
    let flag = 1;

    if(board[i][0] == '') continue;
    for(let j = 0; j < 3; j++) flag &= board[i][j] == board[i][0];
    if(flag) return 1;
  }

  for(let j = 0; j < 3; j++){
    let flag = 1;
    if(board[0][j] == '') continue;
    for(let i = 0; i < 3; i++) flag &= board[i][j] == board[0][j];
    if(flag) return 1;
  }


  //check diagonals

  let flag = 1;
  if(board[0][0] !== ''){
    for(let i = 0; i < 3; i++){
      flag &= board[i][i] == board[0][0];
    }
  

    if(flag) return 1;
  }

  if(board[0][2] !== ''){
    flag = 1;
    for(let i = 0; i < 3; i++){
      flag &= board[i][3-i-1] == board[0][2];
    }

    if(flag) return 1;
  }
  return 0;


}


function onReset(){
    init();
}




