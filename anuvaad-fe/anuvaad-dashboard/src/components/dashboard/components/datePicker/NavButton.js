import React from "react";

export default function NavButton({ children, onClick }) {
  return (
    <button
      type="button"
      className="mt-4"
      onClick={onClick}
      style={{
        border: "1px solid transparent",
        background: "#4448AA",
        padding: "8px",
        fontSize: "12px",
        height: "5vh",
        color: "white"
      }}
    >
      {children}
    </button>
  );
}
