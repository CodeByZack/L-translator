// 📁 src/components/LanguageSelector.tsx
import React from "react";

import { supported_languages } from "../utils/lan_detector/supported_languages";

const supportedLanguages = Object.entries(supported_languages).map(
  ([code, langInfo]) => ({
    code,
    name: langInfo.name || code.toUpperCase()
  })
);

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  type: "source" | "target";
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  type
}) => {
  const bgColor = type === "source" ? "#667eea" : "#28a745";

  return (
    <select
      value={value}
      onChange={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onChange(e.target.value);
      }}
      style={{
        background: bgColor,
        color: "white",
        padding: "4px 8px",
        borderRadius: "8px",
        fontSize: "12px",
        fontWeight: "500",
        border: "none",
        cursor: "pointer",
        outline: "none"
      }}>
      {supportedLanguages.map((lang) => (
        <option
          key={lang.code}
          value={lang.code}
          style={{ background: bgColor, color: "white" }}>
          {lang.code.toUpperCase()}
        </option>
      ))}
    </select>
  );
};
