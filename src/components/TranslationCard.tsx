// 📁 src/components/TranslationCard.tsx
import React, { useMemo } from "react";
import Icon from "react:~/assets/icon.svg";

import type { SpeechState, TextPosition, TranslationState } from "../types";
import { supported_languages } from "../utils/lan_detector/supported_languages";
import { LanguageSelector } from "./LanguageSelector";
import { LoadingSpinner } from "./LoadingSpinner";
import { SpeakerButton } from "./SpeakerButton";
import { VocabularyButton } from "./VocabularyButton";

const getLanguageName = (code: string): string =>
  supported_languages[code].name || code.toUpperCase();

interface TranslationCardProps {
  position: TextPosition;
  translationState: TranslationState;
  speakingState: SpeechState;
  selectedText: string; // 添加选中的原始文本
  vocabularyEnabled: boolean; // 添加单词本开关
  onSourceLangChange: (lang: string) => void;
  onTargetLangChange: (lang: string) => void;
  onSpeak: (text: string, lang: string, type: SpeechState) => void;
}

export const TranslationCard: React.FC<TranslationCardProps> = ({
  position,
  translationState,
  speakingState,
  selectedText,
  vocabularyEnabled,
  onSourceLangChange,
  onTargetLangChange,
  onSpeak
}) => {
  const { result, isLoading, error, sourceLang, targetLang, loadingText } =
    translationState;

  console.log("TranslationCard rendered with position:", position);
  console.log("window.scroll:", window.scrollX, window.scrollY);

  const { left, top } = useMemo(() => {
    return {
      left: position.x + window.scrollX,
      top: position.y + position.height + 5 + window.scrollY
    };
  }, [position]);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        zIndex: 10000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        color: "#222",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "16px 20px",
        fontSize: "15px",
        width: "max-content",
        maxWidth: "450px",
        minWidth: "280px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        backdropFilter: "blur(12px)",
        fontFamily: "system-ui, sans-serif"
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}>
      {/* 加载状态 */}
      {isLoading && !result && <LoadingSpinner text={loadingText} />}

      {/* 错误状态 */}
      {error && (
        <div
          style={{
            color: "#d93025",
            backgroundColor: "rgba(217, 48, 37, 0.1)",
            padding: "10px 12px",
            borderRadius: "6px",
            marginBottom: "12px",
            fontSize: "14px"
          }}>
          ❌ {error}
        </div>
      )}

      {/* 翻译结果 */}
      {result && (
        <div
          style={{
            opacity: isLoading ? 0.7 : 1,
            transition: "opacity 0.3s ease-in-out"
          }}>
          {/* 语言选择和状态 */}
          <div
            style={{
              marginBottom: "12px",
              fontSize: "13px",
              color: "#666",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <LanguageSelector
                value={sourceLang}
                onChange={onSourceLangChange}
                type="source"
              />
              <span style={{ color: "#aaa", fontSize: "16px" }}>→</span>
              <LanguageSelector
                value={targetLang}
                onChange={onTargetLangChange}
                type="target"
              />
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {isLoading && result && (
                <LoadingSpinner size={12} text="重新翻译中..." />
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}>
                <Icon width={16} height={16} style={{ marginRight: 2 }} />
                <a
                  style={{ fontSize: 12, fontWeight: 600, color: "#333" }}
                  href="https://github.com/CodeByZack/L-translator"
                  target="__blank">
                  L-Translator
                </a>
              </div>

              {/* 单词本按钮 - 移到右上角 */}
              {/* {vocabularyEnabled && result && (
                <VocabularyButton
                  word={result.originText}
                  translation={result.translatedText}
                  context={selectedText}
                  sourceLang={result.sourceLang}
                  targetLang={result.targetLang}
                />
              )} */}
            </div>
          </div>

          {/* 原文 */}
          <div
            style={{
              marginBottom: "10px",
              fontSize: "14px",
              color: "#333",
              padding: "8px 10px",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderRadius: "6px",
              maxHeight: "80px",
              overflow: "auto",
              position: "relative"
            }}>
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "13px"
              }}>
              <span>原文 ({getLanguageName(result.sourceLang)}):</span>
              <SpeakerButton
                text={result.originText}
                lang={result.sourceLang}
                type="original"
                speakingState={speakingState}
                onSpeak={onSpeak}
              />
            </div>
            <div
              style={{
                lineHeight: "1.4",
                wordBreak: "break-word"
              }}>
              {result.originText}
            </div>
          </div>

          {/* 译文 */}
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "rgba(76, 175, 80, 0.08)",
              borderRadius: "8px",
              borderLeft: "4px solid #4CAF50",
              color: "#2e7d32",
              wordBreak: "break-word",
              lineHeight: "1.5"
            }}>
            <div
              style={{
                fontSize: "13px",
                color: "#555",
                marginBottom: "6px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
              <span>译文 ({getLanguageName(result.targetLang)}):</span>
              <SpeakerButton
                text={result.translatedText}
                lang={result.targetLang}
                type="translated"
                speakingState={speakingState}
                onSpeak={onSpeak}
              />
            </div>
            <div style={{ fontSize: "15px", fontWeight: "500" }}>
              {result.translatedText}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
