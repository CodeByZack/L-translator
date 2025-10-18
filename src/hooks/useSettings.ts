import { useEffect, useState } from "react";

import {
  getSettings,
  onSettingsChanged,
  type TranslationSettings
} from "../utils/settings";

export const useSettings = () => {
  const [settings, setSettings] = useState<TranslationSettings>({
    mode: "auto",
    defaultTargetLang: "en",
    vocabularyEnabled: true,
    autoSaveWords: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentSettings = await getSettings();
        setSettings(currentSettings);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    onSettingsChanged(setSettings);
  }, []);

  return { settings, isLoading };
};
