import React from "react";

export default function Cell({ cell, onClick, onRightClick }) {
  let className = "cell";
  if (cell.revealed) className += " revealed";
  if (cell.flagged) className += " flagged";

  return (
    <div
      className={className}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    >
      {cell.revealed && cell.value !== 0 && !cell.mine ? cell.value : ""}
      {cell.revealed && cell.mine ? "💣" : ""}
      {!cell.revealed && cell.flagged ? "🚩" : ""}
    </div>
  );
}
