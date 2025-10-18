// 📁 src/components/ManualTrigger.tsx
import React from "react";
import Icon from "react:~/assets/icon.svg";

import type { TextPosition } from "../types";

interface ManualTriggerProps {
  mousePosition: { x: number; y: number };
  onTranslate: () => void;
}

export const ManualTrigger: React.FC<ManualTriggerProps> = ({
  mousePosition,
  onTranslate
}) => (
  <div
    style={{
      position: "fixed",
      left: mousePosition.x + 10,
      top: mousePosition.y + 10,
      zIndex: 10000,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      color: "white",
      border: "1px solid #333",
      borderRadius: "8px",
      padding: "2px",
      fontSize: "14px",
      cursor: "pointer",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease"
    }}
    onClick={onTranslate}
    onMouseDown={(e) => e.stopPropagation()}>
    <Icon width={18} height={18} />
  </div>
);
