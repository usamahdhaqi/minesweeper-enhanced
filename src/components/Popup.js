import React from "react";
import "./Popup.css";

export default function Popup({ show, type, message, onClose }) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className={`popup-card ${type}`}>
        <h2>{type === "win" ? "🎉 Congratulations!" : "💥 Game Over!"}</h2>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
