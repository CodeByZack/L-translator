import { useEffect, useState } from "react";
import Icon from "react:~/assets/icon.svg";

import { supported_languages } from "./utils/lan_detector/supported_languages";
import {
  getModeDescription,
  getSettings,
  saveSettings,
  type TranslationMode,
  type TranslationSettings
} from "./utils/settings";

function IndexPopup() {
  const [settings, setSettings] = useState<TranslationSettings>({
    mode: "auto",
    defaultTargetLang: "en",
    vocabularyEnabled: true,
    autoSaveWords: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleModeChange = async (mode: TranslationMode) => {
    setIsSaving(true);
    try {
      await saveSettings({ mode });
      setSettings((prev) => ({ ...prev, mode }));
    } catch (error) {
      console.error("Failed to save mode:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLanguageChange = async (defaultTargetLang: string) => {
    setIsSaving(true);
    try {
      await saveSettings({ defaultTargetLang });
      setSettings((prev) => ({ ...prev, defaultTargetLang }));
    } catch (error) {
      console.error("Failed to save language:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // 保存单词本设置
  const handleVocabularyToggle = async (vocabularyEnabled: boolean) => {
    setIsSaving(true);
    try {
      await saveSettings({ vocabularyEnabled });
      setSettings((prev) => ({ ...prev, vocabularyEnabled }));
    } catch (error) {
      console.error("Failed to save vocabulary setting:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: 12, width: 280, textAlign: "center" }}>
        <div style={{ color: "#666", fontSize: 12 }}>⏳ 加载中...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 12,
        width: 280,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: "#fff"
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16
        }}>
        <Icon width={20} height={20} style={{ marginRight: 8 }} />
        <a
          style={{ fontSize: 16, fontWeight: 600, color: "#333" }}
          href="https://github.com/CodeByZack/L-translator"
          target="__blank">
          L-Translator
        </a>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
          翻译模式
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["disabled", "auto", "manual"] as TranslationMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              disabled={isSaving}
              style={{
                flex: 1,
                padding: "6px 8px",
                fontSize: 11,
                border: "1px solid #ddd",
                borderRadius: 4,
                background: settings.mode === mode ? "#667eea" : "#fff",
                color: settings.mode === mode ? "#fff" : "#666",
                cursor: "pointer",
                transition: "all 0.2s"
              }}>
              {mode === "disabled" && "🚫 关闭"}
              {mode === "auto" && "⚡ 自动"}
              {mode === "manual" && "👆 手动"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
          翻译语言
        </div>
        <select
          value={settings.defaultTargetLang}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={isSaving}
          style={{
            width: "100%",
            padding: "6px 8px",
            borderRadius: 4,
            border: "1px solid #ddd",
            fontSize: 12,
            backgroundColor: "#fff"
          }}>
          {Object.entries(supported_languages).map(([langCode, langInfo]) => (
            <option key={langCode} value={langCode}>
              {langInfo.name} ({langCode.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* 单词本设置 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
          单词本功能
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6
          }}>
          <input
            type="checkbox"
            checked={settings.vocabularyEnabled}
            onChange={(e) => handleVocabularyToggle(e.target.checked)}
            disabled={isSaving}
            style={{ marginRight: 4 }}
          />
          <span style={{ fontSize: 12, color: "#333" }}>启用单词本</span>
        </div>
        {settings.vocabularyEnabled && (
          <div style={{ fontSize: 10, color: "#999", paddingLeft: 20 }}>
            在翻译卡片中显示"加入单词本"按钮
          </div>
        )}
      </div>

      <div
        style={{
          padding: "6px 8px",
          borderRadius: 4,
          fontSize: 11,
          background: settings.mode === "disabled" ? "#ffeaa7" : "#74b9ff",
          color: settings.mode === "disabled" ? "#d63031" : "#fff",
          textAlign: "center"
        }}>
        {isSaving
          ? "⏳ 保存中..."
          : settings.mode === "disabled"
            ? "翻译已关闭"
            : `${settings.mode === "auto" ? "自动" : "手动"}翻译至${supported_languages[settings.defaultTargetLang]?.name} (${settings.defaultTargetLang.toUpperCase()})`}
      </div>
    </div>
  );
}

export default IndexPopup;
