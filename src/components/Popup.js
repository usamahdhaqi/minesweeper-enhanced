import React from "react";
import "./Popup.css";

export default function Popup({ show, type, message, onClose, onRestart }) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className={`popup-card ${type}`}>
        <h2>{type === "win" ? "🎉 Congratulations!" : "💥 Game Over!"}</h2>
        <p>{message}</p>
        <div className="popup-actions">
          <button className="btn-ok" onClick={onClose}>OK</button>
          <button className="btn-restart" onClick={onRestart}>🔄 Play Again</button>
        </div>
      </div>
    </div>
  );
}
