export const supported_languages = {
  // 中文 (包括简体、繁体)
  zh: {
    pattern: /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/,
    name: "Chinese",
    keywords: [
      "的",
      "了",
      "在",
      "是",
      "我",
      "有",
      "他",
      "这",
      "中",
      "一",
      "国",
      "和",
      "大",
      "会",
      "也",
      "不",
      "能",
      "说",
      "要",
      "以",
      "上"
    ]
  },
  // 英语
  en: {
    pattern: /^[a-zA-Z\s.,!?;:'"()\-\d]*$/,
    name: "English",
    keywords: [
      "the",
      "be",
      "to",
      "of",
      "and",
      "a",
      "in",
      "that",
      "have",
      "i",
      "it",
      "for",
      "not",
      "on",
      "with",
      "he",
      "as",
      "you",
      "do",
      "at"
    ]
  },
  // 日语
  ja: {
    pattern: /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/,
    name: "Japanese",
    keywords: [
      "の",
      "に",
      "は",
      "を",
      "た",
      "が",
      "で",
      "て",
      "と",
      "し",
      "れ",
      "さ",
      "ある",
      "いる",
      "も",
      "する",
      "から",
      "な",
      "こと",
      "として"
    ]
  },
  // 韩语
  ko: {
    pattern: /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/,
    name: "Korean",
    keywords: [
      "이",
      "그",
      "에",
      "의",
      "는",
      "가",
      "을",
      "를",
      "로",
      "으로",
      "와",
      "과",
      "도",
      "만",
      "부터",
      "까지",
      "에서",
      "한",
      "하다",
      "있다"
    ]
  },
  // 俄语
  ru: {
    pattern: /[\u0400-\u04ff]/,
    name: "Russian",
    keywords: [
      "в",
      "и",
      "не",
      "на",
      "я",
      "быть",
      "тот",
      "он",
      "весь",
      "а",
      "как",
      "она",
      "так",
      "его",
      "но",
      "да",
      "ты",
      "к",
      "у",
      "же"
    ]
  },
  // 德语
  de: {
    pattern: /[a-zA-ZäöüßÄÖÜ\s.,!?;:'"()\-\d]*$/,
    name: "German",
    keywords: [
      "der",
      "die",
      "und",
      "in",
      "den",
      "von",
      "zu",
      "das",
      "mit",
      "sich",
      "des",
      "auf",
      "für",
      "ist",
      "im",
      "dem",
      "nicht",
      "ein",
      "eine",
      "als"
    ]
  },
  // 法语
  fr: {
    pattern: /[a-zA-ZàâäéèêëîïôöùûüÿçÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇ\s.,!?;:'"()\-\d]*$/,
    name: "French",
    keywords: [
      "de",
      "le",
      "et",
      "à",
      "un",
      "il",
      "être",
      "et",
      "en",
      "avoir",
      "que",
      "pour",
      "dans",
      "ce",
      "son",
      "une",
      "sur",
      "avec",
      "ne",
      "se"
    ]
  },
  // 西班牙语
  es: {
    pattern: /[a-zA-ZñáéíóúüÑÁÉÍÓÚÜ\s.,!?;:'"()\-\d]*$/,
    name: "Spanish",
    keywords: [
      "de",
      "la",
      "que",
      "el",
      "en",
      "y",
      "a",
      "es",
      "se",
      "no",
      "te",
      "lo",
      "le",
      "da",
      "su",
      "por",
      "son",
      "con",
      "para",
      "al"
    ]
  },
  // 意大利语
  it: {
    pattern: /[a-zA-ZàèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ\s.,!?;:'"()\-\d]*$/,
    name: "Italian",
    keywords: [
      "di",
      "a",
      "da",
      "in",
      "con",
      "su",
      "per",
      "tra",
      "fra",
      "il",
      "lo",
      "la",
      "i",
      "gli",
      "le",
      "un",
      "una",
      "e",
      "che",
      "non"
    ]
  },
  // 葡萄牙语
  pt: {
    pattern: /[a-zA-ZãâáàçêéèíîõôóòúûüÃÂÁÀÇÊÉÈÍÎÕÔÓÒÚÛÜ\s.,!?;:'"()\-\d]*$/,
    name: "Portuguese",
    keywords: [
      "de",
      "a",
      "o",
      "e",
      "do",
      "da",
      "em",
      "um",
      "para",
      "é",
      "com",
      "não",
      "uma",
      "os",
      "no",
      "se",
      "na",
      "por",
      "mais",
      "as"
    ]
  }
};

export const supported_languages_keys = Object.keys(supported_languages);
