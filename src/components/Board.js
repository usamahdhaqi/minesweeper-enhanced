import React from "react";
import Cell from "./Cell";

export default function Board({ board, onCellClick, onRightClick }) {
  if (!board || board.length === 0) return null;

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${board[0].length}, 35px)`,
      }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            onClick={() => onCellClick(r, c)}
            onRightClick={() => onRightClick(r, c)}
          />
        ))
      )}
    </div>
  );
}
