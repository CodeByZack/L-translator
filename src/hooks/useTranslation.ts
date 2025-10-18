// 📁 src/hooks/useTranslation.ts
import { useCallback, useState } from "react";

import { TranslationService } from "../services/translation_service";
import type { TranslationState } from "../types";

export const useTranslation = () => {
  const [state, setState] = useState<TranslationState>({
    result: null,
    isLoading: false,
    error: null,
    sourceLang: "",
    targetLang: "",
    loadingText: ""
  });

  const translate = useCallback(
    async (text: string, targetLang: string, sourceLang?: string) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        loadingText: "翻译中..."
      }));

      const onProgress = (progressText: string) => {
        setState((prev) => ({ ...prev, loadingText: progressText }));
      };

      try {
        const result = await TranslationService.translateText(
          text,
          targetLang,
          sourceLang,
          onProgress
        );
        setState({
          result,
          isLoading: false,
          error: null,
          sourceLang: result.sourceLang,
          targetLang: result.targetLang,
          loadingText: ""
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Translation failed"
        }));
      }
    },
    []
  );

  const clearTranslation = useCallback(() => {
    setState({
      result: null,
      isLoading: false,
      error: null,
      sourceLang: "",
      targetLang: "",
      loadingText: ""
    });
  }, []);

  return { state, translate, clearTranslation };
};
