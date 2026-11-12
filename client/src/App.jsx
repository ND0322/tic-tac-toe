import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Cell from './components/Cell'
import Board from './components/Board'

function App() {
  const [active, setActive] = useState(0);
  const [cells, setCells] = useState(Array(9).fill(''));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState('');


  return (
    <div className="container">
      <header>
      <h1>Tic-Tac-Toe</h1>
    </header>

    <section class="status-panel">
      <div id="status-message" class="status-message">{active ? `Player ${turn}'s Turn` : `${winner}`}</div>
      <div class = "controls">
        <button id="reset-btn" class="btn" onClick={() => {
          setCells(Array(9).fill(''));

          setActive(1);

          setTurn('X');
          
        }}>Start Game</button>
        <button id="size-btn" class = "btn">Switch to 4 x 4</button>
        <button id="ai-btn" class = "btn">Play AI</button>
      </div>
    </section>

    <Board active={active} setActive={setActive} cells = {cells} setCells={setCells} turn={turn} setTurn={setTurn} setWinner = {setWinner}></Board>

    </div>
  );
}

export default App
