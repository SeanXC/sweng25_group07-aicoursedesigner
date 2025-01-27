import React from "react";

export default function HomeDashboard() {
  return (
    <div style={{ height: "100vh", backgroundColor: "white" }}>
      <header
        style={{
          backgroundColor: "purple",
          color: "white",
          fontSize: "1.25rem",
          fontWeight: "bold",
          padding: "1rem 1.5rem",
        }}
      >
        Home Dashboard
      </header>
      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100% - 64px)",
        }}
      >
        <button
          style={{
            backgroundColor: "purple",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Generate Course
        </button>
      </main>
    </div>
  );
}