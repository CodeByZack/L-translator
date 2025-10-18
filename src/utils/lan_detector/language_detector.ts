import { supported_languages } from "./supported_languages";

export interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
  method: "chrome-ai" | "fallback";
}

const checkLanguageDetectorAvailability = async () => {
  if (!("LanguageDetector" in self)) {
    return {
      available: false,
      error: "LanguageDetector API is not available in this browser"
    };
  }

  try {
    const availability = await (self as any).LanguageDetector.availability();
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
      error: `LanguageDetector API check failed: ${error}`
    };
  }
};

const detectLanguageWithChromeAI = async (
  text: string,
  onProgress?: (progress: string) => void
): Promise<LanguageDetectionResult[]> => {
  const availability = await checkLanguageDetectorAvailability();

  if (!availability.available) {
    throw new Error(
      availability.error || "Language Detector API not available"
    );
  }

  try {
    const detector = await (self as any).LanguageDetector.create({
      monitor(m: any) {
        if (availability.status === "downloadable") {
          onProgress?.(`LanguageDetector模型下载中... `);
          m.addEventListener("downloadprogress", (e: any) => {
            onProgress?.(`LanguageDetector模型下载中... ${e.loaded * 100}%`);
            console.log("LanguageDetector model download progress:", e.loaded);
          });
        }
      }
    });

    const results = await detector.detect(text);

    return results.map((result: any) => ({
      detectedLanguage: result.detectedLanguage,
      confidence: result.confidence,
      method: "chrome-ai" as const
    }));
  } catch (error) {
    throw new Error(`Chrome AI language detection failed: ${error}`);
  }
};

const detectLanguageWithFallback = (
  text: string
): LanguageDetectionResult[] => {
  const cleanText = text.trim().toLowerCase();

  if (cleanText.length < 3) {
    return [
      {
        detectedLanguage: "unknown",
        confidence: 0.1,
        method: "fallback"
      }
    ];
  }

  const results: LanguageDetectionResult[] = [];

  // 遍历所有语言模式
  for (const [langCode, langInfo] of Object.entries(supported_languages)) {
    let score = 0;

    // 1. 检查字符模式匹配
    const patternMatches = (cleanText.match(langInfo.pattern) || []).length;
    const patternScore = Math.min(patternMatches / cleanText.length, 1) * 0.6;

    // 2. 检查关键词匹配
    let keywordMatches = 0;
    const words = cleanText.split(/\s+/);

    for (const keyword of langInfo.keywords) {
      if (words.includes(keyword.toLowerCase())) {
        keywordMatches++;
      }
    }

    const keywordScore =
      Math.min(keywordMatches / Math.min(words.length, 10), 1) * 0.4;

    score = patternScore + keywordScore;

    // 特殊处理：中文检测
    if (langCode === "zh") {
      const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
      if (chineseChars > 0) {
        score = Math.max(score, (chineseChars / text.length) * 0.9);
      }
    }

    // 特殊处理：英文检测
    if (langCode === "en") {
      const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
      const hasNonLatin = /[^\u0000-\u007F\s]/.test(text);

      if (englishChars > 0 && !hasNonLatin) {
        score = Math.max(
          score,
          (englishChars / text.replace(/\s/g, "").length) * 0.8
        );
      }
    }

    if (score > 0.1) {
      results.push({
        detectedLanguage: langCode,
        confidence: Math.min(score, 0.95), // 避免过于自信
        method: "fallback"
      });
    }
  }

  // 按置信度排序
  results.sort((a, b) => b.confidence - a.confidence);

  // 如果没有可信的结果，返回未知
  if (results.length === 0 || results[0].confidence < 0.2) {
    return [
      {
        detectedLanguage: "unknown",
        confidence: 0.1,
        method: "fallback"
      }
    ];
  }

  return results.slice(0, 5); // 返回前5个最可能的结果
};

export const detectLanguage = async (
  text: string,
  options: {
    onProgress?: (progress: string) => void;
    confidenceThreshold?: number;
    maxResults?: number;
  } = {}
): Promise<LanguageDetectionResult[]> => {
  const { onProgress, confidenceThreshold = 0.3, maxResults = 3 } = options;

  if (!text || text.trim().length === 0) {
    return [
      {
        detectedLanguage: "unknown",
        confidence: 0,
        method: "fallback"
      }
    ];
  }

  try {
    const aiResults = await detectLanguageWithChromeAI(text, onProgress);

    const filteredResults = aiResults
      .filter((result) => supported_languages[result.detectedLanguage])
      .slice(0, maxResults);

    if (filteredResults.length > 0) {
      return filteredResults;
    }
  } catch (error) {
    console.warn(
      "Chrome AI language detection failed, falling back to simple detection:",
      error
    );
  }

  const fallbackResults = detectLanguageWithFallback(text);

  return fallbackResults
    .filter((result) => result.confidence >= Math.min(confidenceThreshold, 0.2))
    .slice(0, maxResults);
};

export const detectPrimaryLanguage = async (
  text: string,
  options: { onProgress?: (progress: string) => void } = {}
): Promise<LanguageDetectionResult> => {
  const results = await detectLanguage(text, { ...options, maxResults: 1 });
  return (
    results[0] || {
      detectedLanguage: "unknown",
      confidence: 0,
      method: "fallback"
    }
  );
};
