// 📁 src/components/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 16,
  color = "#ffd700",
  text
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", color }}>
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `2px solid ${color}`,
        borderTop: "2px solid transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }}
    />
    {text && <span>{text}</span>}
  </div>
);
