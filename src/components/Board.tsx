import React from "react";
import './Board.css';
import { Cell, cell_info } from "./Cell";

interface IBoardProp {
  width: number;
  height: number;
  mine_percentage: number;
}

// const neighbous = [[-1, 0], [1, 0], [0, -1], [0, 1]];
let neighbours: [number, number][] = [];
for (let di = -1; di <= 1; di++) {
  for (let dj = -1; dj <= 1; dj++) {
    if (di === 0 && dj === 0) {
      continue;
    }
    neighbours.push([di, dj]);
  }
}

function initBoard(width: number, height: number, mine_percentage: number) {
  const board = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      const cell: cell_info = {
        type: Math.random() < mine_percentage ? "mine" : 0,
        isRevealed: false,
        isFlagged: false,
      };
      row.push(cell);
    }
    board.push(row);
  }
  // set the number of mines around each cell
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (board[i][j].type === "mine") {
        continue;
      }
      let count = 0;
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (di === 0 && dj === 0) {
            continue;
          }
          const ni = i + di;
          const nj = j + dj;
          if (ni < 0 || ni >= height || nj < 0 || nj >= width) {
            continue;
          }
          if (board[ni][nj].type === "mine") {
            count++;
          }
        }
      }
      board[i][j].type = count;
    }
  }
  return board;
}

export function Board(props: IBoardProp) {
  const { width, height } = props;

  const [board, setBoard] = React.useState(
    initBoard(width, height, props.mine_percentage)
  );

  const lost = board.some((row) =>
    row.some((cell) => cell.isRevealed && cell.type === "mine")
  );

  const clickCell = (i: number, j: number) => {
    if (lost) {
      return;
    }
    if (board[i][j].isRevealed) {
      return;
    }
    if (board[i][j].isFlagged) {
      return;
    }
    const newBoard = [...board];

    // reveal all empty cells around this cell
    if (newBoard[i][j].type === 0) {
      let queue = [[i, j]];
      while (queue.length > 0) {
        const [ni, nj] = queue.shift()!;
        if (ni < 0 || ni >= height || nj < 0 || nj >= width) {
          continue;
        }
        if (newBoard[ni][nj].isRevealed) {
          continue;
        }
        if (typeof newBoard[ni][nj].type === "number") {
          newBoard[ni][nj].isRevealed = true;
          if (newBoard[ni][nj].type === 0) {
            neighbours.forEach(([di, dj]) => {
              queue.push([ni + di, nj + dj]);
            });
          }
        }
      }
    }
    if (newBoard[i][j].type === "mine") {
      // reveal all mines
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (newBoard[i][j].type === "mine") {
            newBoard[i][j].isRevealed = true;
          }
        }
      }
    }
    newBoard[i][j].isRevealed = true;


    setBoard(newBoard);
  };

  const flagCell = (i: number, j: number) => {
    if (lost) {
      return;
    }
    if (board[i][j].isRevealed) {
      return;
    }
    const newBoard = [...board];
    newBoard[i][j].isFlagged = !newBoard[i][j].isFlagged;
    setBoard(newBoard);
  };

  const totalMines = board.reduce((acc, row) =>
    acc + row.reduce((acc, cell) =>
      acc + (cell.type === "mine" ? 1 : 0), 0), 0
  );

  const totalFlags = board.reduce((acc, row) =>
    acc + row.reduce((acc, cell) =>
      acc + (cell.isFlagged ? 1 : 0), 0), 0
  );

  return (
    <div className="board">
      <div className="header">
        {totalFlags} 🚩 / {totalMines} 💣
      </div>
      {board.map((row, i) => (
        <div className="row" key={i}>
          {row.map((cell, j) => (
            <Cell key={j} {...cell}
              reveal={() => clickCell(i, j)}
              flag={() => flagCell(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  )

}

