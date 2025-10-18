// 📁 src/types/index.ts
export interface TranslationResult {
  targetLang: string;
  sourceLang: string;
  originText: string;
  translatedText: string;
}

export interface TextPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TranslationMode = "disabled" | "auto" | "manual";
export type SpeechState = "original" | "translated" | null;

export interface TranslationSettings {
  mode: TranslationMode;
  defaultTargetLang: string;
}

export interface TranslationState {
  result: TranslationResult | null;
  isLoading: boolean;
  error: string | null;
  sourceLang: string;
  targetLang: string;
  loadingText: string;
}
