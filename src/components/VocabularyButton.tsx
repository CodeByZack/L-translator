// 📁 src/components/VocabularyButton.tsx
import React, { useState } from "react";

import { addWord } from "../utils/vocabulary";

interface VocabularyButtonProps {
  word: string;
  translation: string;
  context: string;
  sourceLang: string;
  targetLang: string;
  disabled?: boolean;
}

export const VocabularyButton: React.FC<VocabularyButtonProps> = ({
  word,
  translation,
  context,
  sourceLang,
  targetLang,
  disabled = false
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error" | "exists">(
    "idle"
  );

  const handleAddWord = async () => {
    if (isAdding || disabled) return;

    setIsAdding(true);
    setStatus("idle");

    try {
      await addWord(word, translation, context, sourceLang, targetLang);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000); // 2秒后恢复
    } catch (error) {
      if (error instanceof Error && error.message.includes("已存在")) {
        setStatus("exists");
      } else {
        setStatus("error");
        console.error("添加单词失败:", error);
      }
      setTimeout(() => setStatus("idle"), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = {
      background: "transparent",
      border: "1px solid #667eea",
      borderRadius: "6px",
      padding: "6px 12px",
      fontSize: "11px",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      opacity: disabled ? 0.5 : 1
    };

    switch (status) {
      case "success":
        return {
          ...baseStyle,
          background: "#10b981",
          color: "white",
          borderColor: "#10b981"
        };
      case "error":
        return {
          ...baseStyle,
          background: "#ef4444",
          color: "white",
          borderColor: "#ef4444"
        };
      case "exists":
        return {
          ...baseStyle,
          background: "#f59e0b",
          color: "white",
          borderColor: "#f59e0b"
        };
      default:
        return {
          ...baseStyle,
          color: "#667eea"
        };
    }
  };

  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <div
            style={{
              width: "10px",
              height: "10px",
              border: "1px solid currentColor",
              borderTop: "1px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}
          />
          <span>添加中...</span>
        </>
      );
    }

    switch (status) {
      case "success":
        return (
          <>
            <span>✓</span>
            <span>已添加</span>
          </>
        );
      case "error":
        return (
          <>
            <span>✗</span>
            <span>添加失败</span>
          </>
        );
      case "exists":
        return (
          <>
            <span>!</span>
            <span>已存在</span>
          </>
        );
      default:
        return (
          <>
            <span>📚</span>
            <span>加入单词本</span>
          </>
        );
    }
  };

  return (
    <>
      <button
        onClick={handleAddWord}
        disabled={disabled || isAdding}
        style={getButtonStyle()}
        onMouseDown={(e) => e.stopPropagation()}
        title={disabled ? "单词本功能已禁用" : "将此单词添加到单词本"}>
        {getButtonContent()}
      </button>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
