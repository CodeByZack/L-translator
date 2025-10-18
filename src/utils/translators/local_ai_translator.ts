import { detectPrimaryLanguage } from "../lan_detector/language_detector";
import {
  supported_languages,
  supported_languages_keys
} from "../lan_detector/supported_languages";

export type TranslationResult = {
  targetLang: string;
  sourceLang: string;
  originText: string;
  translatedText: string;
};

const checkTranslatorAvailability = async (
  sourceLanguage: string,
  targetLanguage: string
) => {
  if (!("Translator" in self)) {
    return {
      available: false,
      error: "Translator API is not available in this browser."
    };
  }

  try {
    const availability = await (self as any).Translator.availability({
      sourceLanguage,
      targetLanguage
    });

    return {
      available:
        availability === "available" || availability === "downloadable",
      status: availability,
      error: null
    };
  } catch (error) {
    return {
      available: false,
      status: "error",
      error: `Language pair ${sourceLanguage}->${targetLanguage} not supported`
    };
  }
};

const translateWithAutoDetection = async (
  text: string,
  targetLang: string,
  onProgress?: (progressText: string) => void
) => {
  if (!text.trim()) {
    throw new Error("Translation text cannot be empty");
  }

  const languageResult = await detectPrimaryLanguage(text, { onProgress });

  const detectedLang = languageResult.detectedLanguage;

  if (detectedLang === "unknown") {
    throw new Error("Unable to detect source language reliably");
  }

  if (
    !supported_languages_keys.includes(detectedLang) ||
    !supported_languages_keys.includes(targetLang)
  ) {
    throw new Error(
      `Translation pair ${detectedLang}->${targetLang} is not supported`
    );
  }

  if (detectedLang === targetLang) {
    return {
      targetLang,
      sourceLang: detectedLang,
      originText: text,
      translatedText: text
    };
  }

  const result = await translate(text, targetLang, detectedLang, onProgress);
  return result;
};

const translate = async (
  text: string,
  targetLang: string,
  sourceLang: string = "en",
  onProgress?: (progressText: string) => void
) => {
  if (!text.trim())
    return {
      targetLang,
      sourceLang,
      originText: text,
      translatedText: text
    };

  const availability = await checkTranslatorAvailability(
    sourceLang,
    targetLang
  );
  if (!availability.available) {
    throw new Error(availability.error || "Translation not available");
  }

  try {
    const translator = await (self as any).Translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      monitor(m: any) {
        if (availability.status === "downloadable") {
          onProgress?.(`${sourceLang}->${targetLang}:首次翻译下载模型中...`);
          m.addEventListener("downloadprogress", (e: any) => {
            onProgress?.(
              `${sourceLang}->${targetLang}:首次翻译下载模型中... ${e.loaded * 100}%`
            );
            console.log("Translation model download progress:", e.loaded);
          });
        }
      }
    });

    const translatedText = await translator.translate(text);
    return { targetLang, sourceLang, originText: text, translatedText };
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(`Translation failed: ${error}`);
  }
};

export { translate, translateWithAutoDetection };
