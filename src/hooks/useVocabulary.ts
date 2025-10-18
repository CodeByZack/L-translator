// 📁 src/hooks/useVocabulary.ts
import { useCallback, useEffect, useState } from "react";

import {
  addWord,
  getVocabulary,
  getVocabularyStats,
  onVocabularyChanged,
  removeWord,
  searchWords,
  type VocabularyItem
} from "../utils/vocabulary";

export const useVocabulary = () => {
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载单词本数据
  const loadWords = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [wordsData, statsData] = await Promise.all([
        getVocabulary(),
        getVocabularyStats()
      ]);
      setWords(wordsData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
      console.error("Failed to load vocabulary:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 添加单词
  const addToVocabulary = useCallback(
    async (
      word: string,
      translation: string,
      context: string,
      sourceLang: string,
      targetLang: string
    ) => {
      try {
        setError(null);
        await addWord(word, translation, context, sourceLang, targetLang);
        await loadWords(); // 重新加载数据
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "添加失败";
        setError(errorMessage);
        throw err;
      }
    },
    [loadWords]
  );

  // 删除单词
  const removeFromVocabulary = useCallback(
    async (wordId: string) => {
      try {
        setError(null);
        await removeWord(wordId);
        await loadWords(); // 重新加载数据
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "删除失败";
        setError(errorMessage);
        throw err;
      }
    },
    [loadWords]
  );

  // 搜索单词
  const searchVocabulary = useCallback(async (query: string) => {
    try {
      setError(null);
      if (query.trim()) {
        const results = await searchWords(query);
        setWords(results);
      } else {
        const allWords = await getVocabulary();
        setWords(allWords);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "搜索失败");
      throw err;
    }
  }, []);

  // 监听单词本变化
  useEffect(() => {
    const unsubscribe = onVocabularyChanged((newWords) => {
      setWords(newWords.sort((a, b) => b.addedAt - a.addedAt));
    });

    return unsubscribe;
  }, []);

  // 初始加载
  useEffect(() => {
    loadWords();
  }, [loadWords]);

  return {
    words,
    stats,
    isLoading,
    error,
    addToVocabulary,
    removeFromVocabulary,
    searchVocabulary,
    refreshVocabulary: loadWords
  };
};
