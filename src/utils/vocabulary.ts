// 单词本功能
export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  context: string; // 原始句子上下文
  sourceLang: string;
  targetLang: string;
  addedAt: number;
  reviewCount: number;
  lastReviewed?: number;
}

export interface VocabularySettings {
  autoSaveUnknownWords: boolean;
  maxWords: number; // 最大单词数量限制
}

// 默认设置
const DEFAULT_VOCAB_SETTINGS: VocabularySettings = {
  autoSaveUnknownWords: false,
  maxWords: 1000 // 默认最多保存1000个单词
};

// 存储键名
const VOCABULARY_KEY = "vocabulary-words";
const VOCABULARY_SETTINGS_KEY = "vocabulary-settings";

// 计算数据大小（KB）
const getDataSizeKB = (data: any): number => {
  return new Blob([JSON.stringify(data)]).size / 1024;
};

// 智能清理：删除最旧和最少复习的单词
const smartCleanup = (
  words: VocabularyItem[],
  targetSizeKB: number
): VocabularyItem[] => {
  let currentWords = [...words];

  while (
    getDataSizeKB(currentWords) > targetSizeKB &&
    currentWords.length > 10
  ) {
    // 按优先级排序：复习次数少 + 添加时间早 = 优先删除
    currentWords.sort((a, b) => {
      const scoreA =
        a.reviewCount + (Date.now() - a.addedAt) / (1000 * 60 * 60 * 24); // 天数
      const scoreB =
        b.reviewCount + (Date.now() - b.addedAt) / (1000 * 60 * 60 * 24);
      return scoreA - scoreB; // 分数低的排前面（优先删除）
    });

    // 删除前10%的单词
    const deleteCount = Math.max(1, Math.floor(currentWords.length * 0.1));
    currentWords = currentWords.slice(deleteCount);
  }

  return currentWords;
};

// 获取单词本设置
export const getVocabularySettings = async (): Promise<VocabularySettings> => {
  try {
    const result = await chrome.storage.sync.get(VOCABULARY_SETTINGS_KEY);
    return { ...DEFAULT_VOCAB_SETTINGS, ...result[VOCABULARY_SETTINGS_KEY] };
  } catch (error) {
    console.error("Error loading vocabulary settings:", error);
    return DEFAULT_VOCAB_SETTINGS;
  }
};

// 保存单词本设置
export const saveVocabularySettings = async (
  settings: Partial<VocabularySettings>
): Promise<void> => {
  try {
    const currentSettings = await getVocabularySettings();
    const newSettings = { ...currentSettings, ...settings };
    await chrome.storage.sync.set({ [VOCABULARY_SETTINGS_KEY]: newSettings });
  } catch (error) {
    console.error("Error saving vocabulary settings:", error);
    throw error;
  }
};

// 获取单词本
export const getVocabulary = async (): Promise<VocabularyItem[]> => {
  try {
    const result = await chrome.storage.sync.get(VOCABULARY_KEY);
    const words = result[VOCABULARY_KEY] || [];
    return words.sort(
      (a: VocabularyItem, b: VocabularyItem) => b.addedAt - a.addedAt
    );
  } catch (error) {
    console.error("Error loading vocabulary:", error);
    return [];
  }
};

// 添加新单词
export const addWord = async (
  word: string,
  translation: string,
  context: string,
  sourceLang: string,
  targetLang: string
): Promise<void> => {
  try {
    const [currentWords, settings] = await Promise.all([
      getVocabulary(),
      getVocabularySettings()
    ]);

    // 检查是否已存在
    const exists = currentWords.some(
      (w) =>
        w.word.toLowerCase() === word.toLowerCase() &&
        w.sourceLang === sourceLang
    );

    if (exists) {
      throw new Error("单词已存在于单词本中");
    }

    // 创建新单词
    const newWord: VocabularyItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      word: word.trim(),
      translation: translation.trim(),
      context: context.trim(),
      sourceLang,
      targetLang,
      addedAt: Date.now(),
      reviewCount: 0
    };

    // 添加到单词列表
    let updatedWords = [newWord, ...currentWords];

    // 检查数量限制
    if (updatedWords.length > settings.maxWords) {
      updatedWords = updatedWords.slice(0, settings.maxWords);
    }

    // 检查大小并智能清理
    let dataSize = getDataSizeKB(updatedWords);
    if (dataSize > 80) {
      console.warn(
        `单词本数据过大 (${dataSize.toFixed(1)}KB)，开始智能清理...`
      );
      updatedWords = smartCleanup(updatedWords, 75); // 清理到75KB以下
      console.log(
        `清理完成，新大小: ${getDataSizeKB(updatedWords).toFixed(1)}KB，剩余单词: ${updatedWords.length}`
      );
    }

    await chrome.storage.sync.set({ [VOCABULARY_KEY]: updatedWords });
  } catch (error) {
    console.error("Error adding word:", error);
    throw error;
  }
};

// 删除单词
export const removeWord = async (wordId: string): Promise<void> => {
  try {
    const currentWords = await getVocabulary();
    const filteredWords = currentWords.filter((w) => w.id !== wordId);
    await chrome.storage.sync.set({ [VOCABULARY_KEY]: filteredWords });
  } catch (error) {
    console.error("Error removing word:", error);
    throw error;
  }
};

// 更新单词（复习计数等）
export const updateWord = async (
  wordId: string,
  updates: Partial<VocabularyItem>
): Promise<void> => {
  try {
    const currentWords = await getVocabulary();
    const wordIndex = currentWords.findIndex((w) => w.id === wordId);

    if (wordIndex === -1) {
      throw new Error("单词未找到");
    }

    currentWords[wordIndex] = { ...currentWords[wordIndex], ...updates };
    await chrome.storage.sync.set({ [VOCABULARY_KEY]: currentWords });
  } catch (error) {
    console.error("Error updating word:", error);
    throw error;
  }
};

// 搜索单词
export const searchWords = async (query: string): Promise<VocabularyItem[]> => {
  const allWords = await getVocabulary();
  const lowerQuery = query.toLowerCase();

  return allWords.filter(
    (word) =>
      word.word.toLowerCase().includes(lowerQuery) ||
      word.translation.toLowerCase().includes(lowerQuery) ||
      word.context.toLowerCase().includes(lowerQuery)
  );
};

// 获取统计信息
export const getVocabularyStats = async () => {
  const words = await getVocabulary();
  const dataSize = getDataSizeKB(words);

  return {
    totalWords: words.length,
    dataSizeKB: Math.round(dataSize * 10) / 10,
    languagePairs: [
      ...new Set(words.map((w) => `${w.sourceLang}-${w.targetLang}`))
    ],
    recentWords: words.filter(
      (w) => Date.now() - w.addedAt < 7 * 24 * 60 * 60 * 1000
    ).length,
    oldestWord:
      words.length > 0
        ? new Date(Math.min(...words.map((w) => w.addedAt)))
        : null,
    newestWord:
      words.length > 0
        ? new Date(Math.max(...words.map((w) => w.addedAt)))
        : null
  };
};

// 监听单词本变化
export const onVocabularyChanged = (
  callback: (words: VocabularyItem[]) => void
) => {
  const handleChange = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    if (changes[VOCABULARY_KEY]) {
      const newWords = changes[VOCABULARY_KEY].newValue || [];
      callback(newWords);
    }
  };

  chrome.storage.onChanged.addListener(handleChange);

  // 返回清理函数
  return () => {
    chrome.storage.onChanged.removeListener(handleChange);
  };
};
