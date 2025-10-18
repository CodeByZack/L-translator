// 📁 src/components/SpeakerButton.tsx
import React from "react";

import type { SpeechState } from "../types";

interface SpeakerButtonProps {
  text: string;
  lang: string;
  type: "original" | "translated";
  speakingState: SpeechState;
  onSpeak: (text: string, lang: string, type: SpeechState) => void;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  text,
  lang,
  type,
  speakingState,
  onSpeak
}) => {
  const isActive = speakingState === type;
  const color = type === "original" ? "#ffd700" : "#90EE90";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onSpeak(text, lang, type);
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      style={{
        background: "transparent",
        border: "none",
        color: isActive ? color : "#999",
        cursor: "pointer",
        fontSize: "16px",
        padding: "4px 6px",
        borderRadius: "4px",
        transition: "all 0.2s ease"
      }}
      title={
        isActive
          ? "点击停止朗读"
          : `点击朗读${type === "original" ? "原文" : "译文"}`
      }>
      {isActive ? "🔇" : "🔊"}
    </button>
  );
};
