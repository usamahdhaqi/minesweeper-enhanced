import React from "react";

export default function Header({ timer, minesLeft, onReset, preset, setPreset }) {
  return (
    <div className="header">
      <div>
        <label>Mode: </label>
        <select value={preset} onChange={(e) => setPreset(e.target.value)}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>
      </div>
      <div>Mines Left: {minesLeft}</div>
      <div>Time: {timer}s</div>
      <button onClick={onReset}>😊 Reset</button>
    </div>
  );
}
