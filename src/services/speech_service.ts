// 📁 src/services/SpeechService.ts
export class SpeechService {
  private static speechLangMap: Record<string, string> = {
    zh: "zh-CN",
    en: "en-US",
    ja: "ja-JP",
    ko: "ko-KR",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    ru: "ru-RU",
    it: "it-IT",
    pt: "pt-BR"
  };

  static isSupported(): boolean {
    return "speechSynthesis" in window;
  }

  static speak(
    text: string,
    lang: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ): void {
    if (!this.isSupported()) {
      console.error("浏览器不支持语音合成");
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.speechLangMap[lang] || "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = onStart || (() => {});
    utterance.onend = onEnd || (() => {});
    utterance.onerror = onError || (() => {});

    speechSynthesis.speak(utterance);
  }

  static stop(): void {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }
}
