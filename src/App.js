import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import Popup from "./components/Popup";
import "./App.css";
import "./themes.css";

const PRESETS = {
  Beginner: { rows: 9, cols: 9, mines: 10 },
  Intermediate: { rows: 16, cols: 16, mines: 40 },
  Expert: { rows: 16, cols: 30, mines: 99 },
};

function generateBoard(rows, cols, mines) {
  let board = Array(rows)
    .fill(null)
    .map(() =>
      Array(cols).fill({
        revealed: false,
        mine: false,
        flagged: false,
        value: 0,
      })
    );

  // letakkan mines
  let placedMines = 0;
  while (placedMines < mines) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c] = { ...board[r][c], mine: true };
      placedMines++;
    }
  }

  // hitung angka sekitar
  const dirs = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  board = board.map((row, r) =>
    row.map((cell, c) => {
      if (cell.mine) return cell;
      let value = 0;
      dirs.forEach(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine)
          value++;
      });
      return { ...cell, value };
    })
  );

  return board;
}

export default function App() {
  const [preset, setPreset] = useState("Beginner");
  const [rows, setRows] = useState(PRESETS[preset].rows);
  const [cols, setCols] = useState(PRESETS[preset].cols);
  const [mines, setMines] = useState(PRESETS[preset].mines);
  const [board, setBoard] = useState([]);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [theme, setTheme] = useState("theme-light");
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  // update rows/cols/mines ketika preset berubah
  useEffect(() => {
    setRows(PRESETS[preset].rows);
    setCols(PRESETS[preset].cols);
    setMines(PRESETS[preset].mines);
  }, [preset]);

  // buat board awal
  useEffect(() => {
    resetGame();
  }, [rows, cols, mines]);

  // timer
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  function resetGame() {
    setBoard(generateBoard(rows, cols, mines));
    setTimer(0);
    setRunning(false);
  }

  function reveal(r, c, tempBoard = [...board]) {
    const cell = tempBoard[r][c];
    if (cell.revealed || cell.flagged) return tempBoard;

    cell.revealed = true;
    if (cell.mine) {
      setPopup({ show: true, type: "lose", message: "You clicked on a mine!" });
      setRunning(false);
      return tempBoard;
    }
    if (cell.value === 0) {
      const dirs = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1],
      ];
      dirs.forEach(([dr, dc]) => {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          reveal(nr, nc, tempBoard);
        }
      });
    }
    return tempBoard;
  }

  function checkWin(tempBoard) {
    let revealedCount = 0;
    let totalCells = rows * cols;
    let mineCells = mines;

    tempBoard.forEach(row =>
      row.forEach(cell => {
        if (cell.revealed) revealedCount++;
      })
    );

    if (revealedCount === totalCells - mineCells) {
      setPopup({ show: true, type: "win", message: "You cleared the board!" });
      setRunning(false);
    }
  }

  function onCellClick(r, c) {
    if (!running) setRunning(true);
    let newBoard = reveal(r, c, [...board]);
    setBoard([...newBoard]);
    checkWin(newBoard);
  }

  function onRightClick(r, c) {
    let newBoard = [...board];
    const cell = newBoard[r][c];
    if (!cell.revealed) cell.flagged = !cell.flagged;
    setBoard([...newBoard]);
  }

  return (
    <div className={`app ${theme}`}>
      <Header
        timer={timer}
        minesLeft={mines}
        onReset={resetGame}
        preset={preset}
        setPreset={setPreset}
      />
      {board.length > 0 && (
        <Board
          board={board}
          onCellClick={onCellClick}
          onRightClick={onRightClick}
        />
      )}
      <div className="controls">
        <button onClick={() => setTheme("theme-light")}>🌞 Light</button>
        <button onClick={() => setTheme("theme-dark")}>🌙 Dark</button>
      </div>

      <Popup
        show={popup.show}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ show: false, type: "", message: "" })}
      />
    </div>
  );
}
