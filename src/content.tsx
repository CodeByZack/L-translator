import type { PlasmoCSConfig } from "plasmo";
import React, { useEffect } from "react";

import { ManualTrigger } from "./components/ManualTrigger";
import { TranslationCard } from "./components/TranslationCard";
import { useSettings } from "./hooks/useSettings";
import { useSpeech } from "./hooks/useSpeech";
import { useTextSelection } from "./hooks/useTextSelection";
import { useTranslation } from "./hooks/useTranslation";
import type { SpeechState } from "./types";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
};

// 主翻译组件
const ContentScript: React.FC = () => {
  const { settings } = useSettings();
  const {
    selectedText,
    textPosition: position,
    mousePosition
  } = useTextSelection();

  const {
    state: { result, isLoading, error, sourceLang, targetLang, loadingText },
    translate,
    clearTranslation: resetTranslation
  } = useTranslation();

  const { speakingState, speak } = useSpeech();

  // 自动翻译逻辑
  useEffect(() => {
    if (!selectedText || settings.mode === "disabled") {
      resetTranslation();
      return;
    }

    if (settings.mode === "auto" && selectedText.length > 2) {
      const targetLang =
        settings.defaultTargetLang === "auto"
          ? /[\u4e00-\u9fff]/.test(selectedText)
            ? "en"
            : "zh"
          : settings.defaultTargetLang;
      translate(selectedText, targetLang);
    }
  }, [
    selectedText,
    settings.mode,
    settings.defaultTargetLang,
    translate,
    resetTranslation
  ]);

  const handleManualTranslate = () => {
    if (selectedText && settings.mode === "manual") {
      const targetLang =
        settings.defaultTargetLang === "auto"
          ? /[\u4e00-\u9fff]/.test(selectedText)
            ? "en"
            : "zh"
          : settings.defaultTargetLang;
      translate(selectedText, targetLang);
    }
  };

  const handleSpeak = (text: string, lang: string, type: SpeechState) => {
    speak(text, lang, type);
  };

  const handleLangChange = () => {
    const source = (newSourceLang: string) => {
      if (selectedText && targetLang) {
        translate(selectedText, targetLang, newSourceLang);
      }
    };
    const target = (newTargetLang: string) => {
      if (selectedText && sourceLang) {
        translate(selectedText, newTargetLang, sourceLang);
      }
    };
    return { source, target };
  };

  if (settings.mode === "disabled") {
    return null;
  }

  if (!selectedText || !position) {
    return null;
  }

  const translationState = {
    result,
    isLoading,
    error,
    sourceLang,
    targetLang,
    loadingText
  };

  return (
    <>
      {settings.mode === "manual" && !result && (
        <ManualTrigger
          mousePosition={mousePosition}
          onTranslate={handleManualTranslate}
        />
      )}

      {(result || isLoading || error) && (
        <TranslationCard
          position={position}
          translationState={translationState}
          speakingState={speakingState}
          selectedText={selectedText}
          vocabularyEnabled={settings.vocabularyEnabled}
          onSourceLangChange={handleLangChange().source}
          onTargetLangChange={handleLangChange().target}
          onSpeak={handleSpeak}
        />
      )}
    </>
  );
};

export default ContentScript;
