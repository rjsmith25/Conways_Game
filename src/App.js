import React, { useState, useEffect } from "react";
import cloneDeep from "lodash/cloneDeep";
import "./App.css";

// Create 25 X 25 Game board assign cell objects
function createBoard() {
  let newBoard = [];
  for (let i = 0; i < 25; i++) {
    newBoard.push([]);
  }
  for (let x = 0; x < newBoard.length; x++) {
    for (let y = 0; y < 25; y++) {
      let cell = { coord: { x, y }, isAlive: false, neighbors: 0 };
      newBoard[x][y] = cell;
    }
  }
  return newBoard;
}

function App() {
  const positions = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];

  const [board, setBoard] = useState(createBoard());
  const [start, setStart] = useState(false);
  const [intervalID, setIntervalID] = useState(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (start) {
      var interval = setInterval(run, 1000);
      setIntervalID(interval);
    }
    return () => clearInterval(interval);
  }, [start, board]);

  function toggleCellLife(e) {
    // if game started dont toggle
    if (start) {
      return;
    }

    let coordX = e.target.dataset.coordx;
    let coordY = e.target.dataset.coordy;
    let boardCopy = cloneDeep(board);
    boardCopy[coordX][coordY].isAlive = !boardCopy[coordX][coordY].isAlive;
    countNeighbors(boardCopy);
    setBoard(boardCopy);
  }

  function checkValidPosition(x, y) {
    return x >= 0 && x < 25 && y >= 0 && y < 25;
  }

  function countNeighbors(currentBoard) {
    let countNeighbor = 0;
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 25; y++) {
        for (let i = 0; i < positions.length; i++) {
          let posX = positions[i][0];
          let posY = positions[i][1];
          if (checkValidPosition(x + posX, y + posY)) {
            if (currentBoard[x + posX][y + posY].isAlive) {
              countNeighbor += 1;
            }
          }
        }
        currentBoard[x][y].neighbors = countNeighbor;
        // reset count
        countNeighbor = 0;
      }
    }
  }

  function run() {
    let boardCopy = cloneDeep(board);
    for (let x = 0; x < 25; x++) {
      for (let y = 0; y < 25; y++) {
        if (
          (boardCopy[x][y].neighbors === 2 ||
            boardCopy[x][y].neighbors === 3) &&
          boardCopy[x][y].isAlive
        ) {
          boardCopy[x][y].isAlive = true;
        } else if (
          boardCopy[x][y].isAlive === false &&
          boardCopy[x][y].neighbors === 3
        ) {
          boardCopy[x][y].isAlive = true;
        } else {
          boardCopy[x][y].isAlive = false;
        }
      }
    }
    countNeighbors(boardCopy);
    setBoard(boardCopy);
    setGeneration((prevGen) => prevGen + 1);
  }

  return (
    <div className="App">
      <h1>Conway Game of Life</h1>
      <p className="generation">Generation # {generation}</p>
      <div className="board">
        {board.flat().map((cell, index) => {
          return (
            <div
              onClick={toggleCellLife}
              className={
                board[cell.coord.x][cell.coord.y].isAlive
                  ? "cell isAlive"
                  : "cell isDead"
              }
              key={index}
              data-coordx={cell.coord.x}
              data-coordy={cell.coord.y}
            ></div>
          );
        })}
      </div>
      <div className="control-panel">
        <button
          onClick={() => {
            setStart(true);
          }}
          className="start"
        >
          Start
        </button>
        <button
          onClick={() => {
            setStart(false);
            clearInterval(intervalID);
          }}
          className="pause"
        >
          Pause
        </button>
        <button
          onClick={() => {
            setStart(false);
            clearInterval(intervalID);
            setBoard(createBoard());
            setGeneration(0);
          }}
          className="clear"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default App;
