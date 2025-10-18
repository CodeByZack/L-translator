// 📁 src/hooks/useSpeech.ts
import { useCallback, useEffect, useState } from "react";

import { SpeechService } from "../services/speech_service";
import type { SpeechState } from "../types";

export const useSpeech = () => {
  const [speakingState, setSpeakingState] = useState<SpeechState>(null);

  const speak = useCallback((text: string, lang: string, type: SpeechState) => {
    SpeechService.speak(
      text,
      lang,
      () => setSpeakingState(type),
      () => setSpeakingState(null),
      () => setSpeakingState(null)
    );
  }, []);

  const stopSpeaking = useCallback(() => {
    SpeechService.stop();
    setSpeakingState(null);
  }, []);

  useEffect(() => {
    return () => {
      SpeechService.stop();
    };
  }, []);

  return { speakingState, speak, stopSpeaking };
};
