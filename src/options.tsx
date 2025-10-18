// 📁 src/options.tsx - 单词本管理页面
import { useEffect, useState } from "react";

import { SpeakerButton } from "~components/SpeakerButton";
import { useSpeech } from "~hooks/useSpeech";
import type { SpeechState } from "~types";

import {
  getVocabulary,
  getVocabularyStats,
  removeWord,
  searchWords,
  type VocabularyItem
} from "./utils/vocabulary";

function OptionsPage() {
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());

  const { speakingState, speak } = useSpeech();

  // 加载单词本数据
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [vocabularyData, statsData] = await Promise.all([
        getVocabulary(),
        getVocabularyStats()
      ]);
      setWords(vocabularyData);
      setStats(statsData);
    } catch (error) {
      console.error("加载数据失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索单词
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await searchWords(query);
      setWords(results);
    } else {
      const allWords = await getVocabulary();
      setWords(allWords);
    }
  };

  // 删除单词
  const handleDelete = async (wordId: string) => {
    try {
      await removeWord(wordId);
      await loadData(); // 重新加载数据
      setSelectedWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordId);
        return newSet;
      });
    } catch (error) {
      console.error("删除失败:", error);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedWords.size === 0) return;

    try {
      await Promise.all(Array.from(selectedWords).map((id) => removeWord(id)));
      await loadData();
      setSelectedWords(new Set());
    } catch (error) {
      console.error("批量删除失败:", error);
    }
  };

  // 导出单词本
  const handleExport = () => {
    const dataStr = JSON.stringify(words, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vocabulary-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
        }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, marginBottom: 10 }}>📚</div>
          <div>加载单词本...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 20,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif"
      }}>
      {/* 头部 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30,
          paddingBottom: 20,
          borderBottom: "1px solid #eee"
        }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, color: "#333" }}>
            📚 我的单词本
          </h1>
          {stats && (
            <div style={{ marginTop: 8, fontSize: 14, color: "#666" }}>
              共 {stats.totalWords} 个单词 • {stats.dataSizeKB} KB •{" "}
              {stats.recentWords} 个近期添加
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleExport}
            disabled={words.length === 0}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: words.length === 0 ? "not-allowed" : "pointer",
              opacity: words.length === 0 ? 0.5 : 1
            }}>
            📤 导出
          </button>

          {selectedWords.size > 0 && (
            <button
              onClick={handleBatchDelete}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer"
              }}>
              🗑️ 删除选中 ({selectedWords.size})
            </button>
          )}
        </div>
      </div>

      {/* 搜索栏 */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="搜索单词、翻译或上下文..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 14,
            outline: "none"
          }}
        />
      </div>

      {/* 单词列表 */}
      {words.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            color: "#666",
            fontSize: 16
          }}>
          {searchQuery
            ? "未找到匹配的单词"
            : "单词本为空\n开始翻译单词并添加到单词本吧！"}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))"
          }}>
          {words.map((word) => (
            <div
              key={word.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 20,
                position: "relative",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
              {/* 选择框 */}
              <input
                type="checkbox"
                checked={selectedWords.has(word.id)}
                onChange={(e) => {
                  const newSet = new Set(selectedWords);
                  if (e.target.checked) {
                    newSet.add(word.id);
                  } else {
                    newSet.delete(word.id);
                  }
                  setSelectedWords(newSet);
                }}
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12
                }}
              />

              {/* 删除按钮 */}
              <button
                onClick={() => handleDelete(word.id)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "transparent",
                  border: "none",
                  fontSize: 16,
                  cursor: "pointer",
                  opacity: 0.6,
                  transition: "opacity 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                title="删除单词">
                🗑️
              </button>

              {/* 语言标识 */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 12,
                  marginTop: 20
                }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: "#e0e7ff",
                    color: "#3730a3",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}>
                  {word.sourceLang.toUpperCase()}
                </span>
                <span style={{ color: "#666", fontSize: 12 }}>→</span>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 12,
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: 11,
                    fontWeight: "bold"
                  }}>
                  {word.targetLang.toUpperCase()}
                </span>
              </div>

              {/* 单词内容 */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: 4
                  }}>
                  {word.word}
                  <SpeakerButton
                    text={word.word}
                    lang={word.sourceLang}
                    type={"original"}
                    speakingState={speakingState}
                    onSpeak={() => {
                      speak(word.word, word.sourceLang, "original");
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#059669",
                    fontWeight: "500"
                  }}>
                  {word.translation}
                  <SpeakerButton
                    text={word.translation}
                    lang={word.targetLang}
                    type={"translated"}
                    speakingState={speakingState}
                    onSpeak={() => {
                      speak(word.translation, word.targetLang, "translated");
                    }}
                  />
                </div>
              </div>

              {/* 上下文 */}
              {word.context && (
                <div
                  style={{
                    padding: 12,
                    background: "#f9fafb",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "#6b7280",
                    lineHeight: 1.4,
                    marginBottom: 12,
                    fontStyle: "italic"
                  }}>
                  "{word.context}"
                </div>
              )}

              {/* 元信息 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 11,
                  color: "#9ca3af"
                }}>
                <span>
                  {new Date(word.addedAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
                <span>复习 {word.reviewCount} 次</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OptionsPage;
