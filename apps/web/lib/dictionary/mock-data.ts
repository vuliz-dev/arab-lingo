export type Language = 'en' | 'ar' | 'vi';

export type Definition = {
  text: string;
  example?: string;
  exampleTranslation?: string;
};

export type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
};

export type Translation = {
  language: Language;
  word: string;
  ipa?: string;
  meanings: Meaning[];
};

export type WordEntry = {
  id: string;
  slug: string;
  arabic: string;
  english: string;
  vietnamese: string;
  ipa: string;
  root?: string;
  arabicPlural?: string;
  audioUrl?: string;
  translations: Translation[];
  synonyms: string[];
  antonyms: string[];
  homophones?: string[];
  references?: { title: string; url: string }[];
  saved?: boolean;
};

export const LANG_LABEL: Record<Language, string> = {
  en: 'EN',
  ar: 'AR',
  vi: 'VI',
};

export const LANG_COLOR: Record<Language, string> = {
  en: 'bg-blue-50 text-blue-700 border-blue-200',
  ar: 'bg-primary/10 text-primary border-primary/20',
  vi: 'bg-red-50 text-red-700 border-red-200',
};
