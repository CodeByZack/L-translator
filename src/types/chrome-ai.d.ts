// Chrome AI APIs类型声明
declare global {
  interface Window {
    Translator?: {
      availability(options: {
        sourceLanguage: string;
        targetLanguage: string;
      }): Promise<"available" | "downloadable" | "not-available">;

      create(options: {
        sourceLanguage: string;
        targetLanguage: string;
        monitor?: (monitor: {
          addEventListener: (
            event: "downloadprogress",
            callback: (e: { loaded: number }) => void
          ) => void;
        }) => void;
      }): Promise<{
        translate(text: string): Promise<string>;
        translateStreaming(text: string): AsyncIterable<string>;
      }>;
    };

    LanguageDetector?: {
      availability(): Promise<"available" | "downloadable" | "not-available">;

      create(options?: {
        monitor?: (monitor: {
          addEventListener: (
            event: "downloadprogress",
            callback: (e: { loaded: number }) => void
          ) => void;
        }) => void;
      }): Promise<{
        detect(text: string): Promise<
          Array<{
            detectedLanguage: string;
            confidence: number;
          }>
        >;
      }>;
    };
  }

  // 在self中也声明（用于Web Worker等环境）
  var Translator: Window["Translator"];
  var LanguageDetector: Window["LanguageDetector"];
}

export {};
