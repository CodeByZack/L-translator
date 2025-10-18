// 📁 src/services/TranslationService.ts
import type { on } from "events";

import type { TranslationResult } from "../types";
import {
  translate,
  translateWithAutoDetection
} from "../utils/translators/local_ai_translator";

export class TranslationService {
  static async translateText(
    text: string,
    targetLang: string,
    sourceLang?: string,
    onProgress?: (progressText: string) => void
  ): Promise<TranslationResult> {
    if (!text.trim()) {
      throw new Error("Translation text cannot be empty");
    }

    if (sourceLang) {
      return await translate(text, targetLang, sourceLang, onProgress);
    }

    return await translateWithAutoDetection(text, targetLang, onProgress);
  }

  static determineTargetLanguage(text: string, defaultLang: string): string {
    if (defaultLang !== "auto") return defaultLang;

    const isChinese = /[\u4e00-\u9fff]/.test(text);
    return isChinese ? "en" : "zh";
  }
}
