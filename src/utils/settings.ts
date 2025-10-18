// 翻译模式配置
export type TranslationMode = "disabled" | "auto" | "manual";

export interface TranslationSettings {
  mode: TranslationMode;
  defaultTargetLang: string;
  // 新增单词本设置
  vocabularyEnabled: boolean;
  autoSaveWords: boolean;
}

// 默认设置
const DEFAULT_SETTINGS: TranslationSettings = {
  mode: "auto", // 默认为自动翻译模式
  defaultTargetLang: "en", // 默认目标语言为英语
  vocabularyEnabled: true, // 默认启用单词本功能
  autoSaveWords: false // 默认不自动保存单词
};

// 设置存储键名
const SETTINGS_KEY = "translation-settings";

// 获取设置
export const getSettings = async (): Promise<TranslationSettings> => {
  try {
    const result = await chrome.storage.sync.get(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS, ...result[SETTINGS_KEY] };
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
};

// 保存设置
export const saveSettings = async (
  settings: Partial<TranslationSettings>
): Promise<void> => {
  try {
    const currentSettings = await getSettings();
    const newSettings = { ...currentSettings, ...settings };
    await chrome.storage.sync.set({ [SETTINGS_KEY]: newSettings });
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

// 监听设置变化
export const onSettingsChanged = (
  callback: (settings: TranslationSettings) => void
) => {
  const handleChange = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    if (changes[SETTINGS_KEY]) {
      const newSettings = {
        ...DEFAULT_SETTINGS,
        ...changes[SETTINGS_KEY].newValue
      };
      callback(newSettings);
    }
  };

  chrome.storage.onChanged.addListener(handleChange);

  // 返回清理函数
  return () => {
    chrome.storage.onChanged.removeListener(handleChange);
  };
};

// 模式描述
export const getModeDescription = (mode: TranslationMode): string => {
  switch (mode) {
    case "disabled":
      return "已关闭 - 翻译功能完全禁用";
    case "auto":
      return "自动翻译 - 选中文字立即翻译";
    case "manual":
      return "手动翻译 - 选中文字后点击图标翻译";
    default:
      return "未知模式";
  }
};
