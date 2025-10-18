// 📁 src/hooks/useTextSelection.ts
import { useEffect, useState } from "react";

import type { TextPosition } from "../types";

export const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState("");
  const [textPosition, setTextPosition] = useState<TextPosition | null>(null);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const mouseUpHandler = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setTimeout(() => {
        const selection = window.getSelection();
        const text = (selection?.toString() ?? "").trim();

        if (text && selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setSelectedText(text);
          setTextPosition({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
          });
        }
      });
    };

    const mouseDownHandler = () => {
      setSelectedText("");
      setTextPosition(null);
    };

    document.addEventListener("mouseup", mouseUpHandler);
    document.addEventListener("mousedown", mouseDownHandler);

    return () => {
      document.removeEventListener("mouseup", mouseUpHandler);
      document.removeEventListener("mousedown", mouseDownHandler);
    };
  }, []);

  return { selectedText, textPosition, mousePosition };
};
