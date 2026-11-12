import React from 'react'
import Cell from './Cell';
import { useState } from 'react';


function checkWin(cells){

  //rows
  for(let i = 0; i < 3; i++){

    if(cells[3*i] == '') continue
    let flag = 1;
    for(let j = 0; j < 3; j++){
      flag &= (cells[3*i] == cells[3*i+j]);
    }

    if(flag) return cells[3*i];
  }

  //cols

  for(let j = 0; j < 3; j++){
    if(cells[j] == '') continue

    let flag = 1;
    for(let i = 0; i < 3; i++){
      flag &= (cells[j] == cells[3 * i + j]);
    }

    if(flag) return cells[j];
  }


  //diagonals

  if(cells[0] !== ''){
    let flag = 1;
    for(let i = 0; i < 3; i++) flag &= (cells[0] == cells[i*3 + i]);

    if(flag) return cells[0];
  }

  if(cells[2] !== ''){
    let flag = 1;

    for(let i = 0; i < 3; i++) flag &= (cells[2] == cells[i * 3 + 2 - i])
    if(flag) return cells[2];
  }

  return '';

  
  
}

export default function Board({active, setActive, cells, setCells, turn, setTurn, setWinner}) {
  


  return (
    <div className="board">
      {cells.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => {
            if(value !== '' || !active) return;
            
            const newCells = cells.map((cell, i) =>
              i === index ? turn : cell
            );

            setCells(newCells);

            if(checkWin(newCells) !== ''){
              setWinner(checkWin(newCells) + " has won!")
              setActive(0);
            }

            if (!newCells.includes('')) {
              setWinner("It's a tie!");
              setActive(0);
              return;
            }

            setTurn(turn == 'X' ? 'O' : 'X');
          }}
        />
      ))}
          
    </div>
  )
}
