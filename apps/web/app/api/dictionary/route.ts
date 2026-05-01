import { NextRequest, NextResponse } from 'next/server';
import type { WordEntry, Meaning } from '@/lib/dictionary/mock-data';

const FREE_DICT   = 'https://api.dictionaryapi.dev/api/v2/entries';
const MYMEMORY    = 'https://api.mymemory.translated.net/get';
const EN_WIKI_API = 'https://en.wiktionary.org/w/api.php';
const AR_WIKI_API = 'https://ar.wiktionary.org/w/api.php';

// ─── utils ──────────────────────────────────────────────────────────────────

function detectLanguage(text: string): 'ar' | 'vi' | 'en' {
  if (/[؀-ۿ]/.test(text)) return 'ar';
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựởữỳýỵỷỹđ]/i.test(text))
    return 'vi';
  return 'en';
}

/** Strip Arabic diacritics for wikitext page lookups */
function stripDiacritics(s: string) {
  return s.replace(/[ً-ٰٟ]/g, '');
}

async function fetchFreeDictionary(word: string, lang = 'en') {
  try {
    const res = await fetch(`${FREE_DICT}/${lang}/${encodeURIComponent(word)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function translate(text: string, from: string, to: string): Promise<string> {
  if (!text.trim()) return '';
  try {
    const res = await fetch(
      `${MYMEMORY}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const t: string = data.responseData?.translatedText ?? '';
    // Filter MyMemory error / placeholder responses
    if (
      !t ||
      t === text ||
      t.toUpperCase().startsWith('PLEASE SELECT') ||
      t.includes('MYMEMORY') ||
      (t.includes('[') && t.includes(']') && t.toLowerCase().includes(text.toLowerCase()))
    ) return '';
    return t;
  } catch { return ''; }
}

async function fetchWikiPage(apiBase: string, title: string): Promise<string> {
  try {
    const url = `${apiBase}?action=query&titles=${encodeURIComponent(title)}&prop=revisions&rvprop=content&format=json&rvslots=main`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return '';
    const page = Object.values(pages)[0] as any;
    const content: string =
      page?.revisions?.[0]?.slots?.main?.['*'] ??
      page?.revisions?.[0]?.['*'] ?? '';
    if (content.includes('#REDIRECT') || content.length < 10) return '';
    return content;
  } catch { return ''; }
}

function stripWikiMarkup(s: string): string {
  return s
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1') // [[link|text]] → text
    .replace(/\{\{[^}]+\}\}/g, '')                      // remove {{templates}}
    .replace(/'{2,}/g, '')                               // remove bold/italic ''
    .replace(/&lt;[^>]+&gt;/g, '')                       // remove HTML entities
    .trim();
}

// ─── English Wiktionary: get AR + VI translations and page content ───────────

interface EnWikiData {
  arabicWord?: string;
  arabicRoman?: string;
  vietnameseWord?: string;
  /** Wikitext of the Arabic section within the English word's page */
  arabicSectionContent: string;
}

const AR_POS_MAP: Record<string, string> = {
  noun: 'اسم', verb: 'فعل', adjective: 'صفة', adverb: 'ظرف',
  particle: 'حرف', pronoun: 'ضمير', preposition: 'حرف جر', interjection: 'تعجّب',
};

const VI_POS_MAP: Record<string, string> = {
  noun: 'danh từ', verb: 'động từ', adjective: 'tính từ', adverb: 'trạng từ',
  particle: 'trợ từ', pronoun: 'đại từ', preposition: 'giới từ', interjection: 'thán từ',
  exclamation: 'thán từ', conjunction: 'liên từ',
};

async function fetchEnWikiData(englishWord: string): Promise<EnWikiData> {
  const content = await fetchWikiPage(EN_WIKI_API, englishWord);
  if (!content) return { arabicSectionContent: '' };

  // Arabic translation line: * Arabic: {{t|ar|مَرْحَبًا|tr=marħaban|...}}
  const arLine = content.match(/\*\s*Arabic:[^\n]*/)?.[0] ?? '';
  const arabicWord  = arLine.match(/\{\{t[+*]?\|ar\|([^|}]+)/)?.[1]?.trim();
  const arabicRoman = arLine.match(/\btr=([^|},\n]+)/)?.[1]?.trim();

  // Vietnamese translation: * Vietnamese: {{t|vi|xin chào|...}}
  const viMatch = content.match(/\*\s*Vietnamese:[^\n]*\{\{t[+*]?\|vi\|([^|}]+)/);
  const vietnameseWord = viMatch?.[1]?.trim();

  return { arabicWord, arabicRoman, vietnameseWord, arabicSectionContent: '' };
}

// ─── English Wiktionary: Arabic word's own entry ────────────────────────────

interface EnWikiArabicEntry {
  root?: string;
  plural?: string;
  ipa?: string;
  partOfSpeech: string;
  /** English-language definitions from this entry */
  enDefinitions: string[];
  examples: Array<{ ar: string; en?: string }>;
}

async function fetchEnWikiArabicEntry(arabicWord: string): Promise<EnWikiArabicEntry> {
  const fallback: EnWikiArabicEntry = { partOfSpeech: 'اسم', enDefinitions: [], examples: [] };
  const content = await fetchWikiPage(EN_WIKI_API, stripDiacritics(arabicWord));
  if (!content) return fallback;

  // Isolate ==Arabic== section
  const secMatch = content.match(/==Arabic==([\s\S]*?)(?:\n==[^=]|$)/);
  const sec = secMatch?.[1] ?? content;

  const result: EnWikiArabicEntry = { partOfSpeech: 'اسم', enDefinitions: [], examples: [] };

  // IPA
  result.ipa =
    sec.match(/\{\{ar-IPA\|([^|}]+)/)?.[1]?.trim() ??
    sec.match(/\{\{IPA\|ar\|([^|}]+)/)?.[1]?.trim();

  // Part of speech
  const posH = sec.match(/===+(Noun|Verb|Adjective|Adverb|Particle|Pronoun|Preposition|Interjection)===+/i);
  if (posH?.[1]) result.partOfSpeech = AR_POS_MAP[posH[1].toLowerCase()] ?? posH[1];

  // Root
  const rootM = sec.match(/\{\{ar-root\|([^}]+)\}\}/);
  if (rootM?.[1]) {
    const parts = rootM[1].split('|').map((p) => p.trim()).filter((p) => p && !p.includes('='));
    if (parts.length >= 2) result.root = parts.join('-');
  }

  // Plural — named param first, then positional
  const arNoun = sec.match(/\{\{ar-noun\|([^}]+)\}\}/)?.[1] ?? '';
  const plNamed = arNoun.match(/(?:^|\|)pl=([^\|]+)/)?.[1]?.trim();
  if (plNamed) {
    result.plural = plNamed;
  } else {
    const pos3 = arNoun.split('|')[2]?.trim();
    if (pos3 && !pos3.includes('=')) result.plural = pos3;
  }
  if (!result.plural) result.plural = sec.match(/\|pl=([^\|\}\n]+)/)?.[1]?.trim();

  // Definitions (lines starting with `# `)
  result.enDefinitions = Array.from(sec.matchAll(/^# ([^#*\n].+)$/gm))
    .slice(0, 3)
    .map((m) => stripWikiMarkup(m[1] ?? ''))
    .filter(Boolean);

  // Examples {{ux|ar|Arabic|t=English}} or {{ux|ar|Arabic|English}}
  result.examples = Array.from(sec.matchAll(/\{\{ux\|ar\|([^|]+)\|(?:t=)?([^|}]+)/g))
    .slice(0, 3)
    .map((m) => ({ ar: m[1]?.trim() ?? '', en: m[2]?.trim() }));

  return result;
}

// ─── Arabic Wiktionary: native Arabic definitions ───────────────────────────

interface ArWikiData {
  partOfSpeech?: string;
  definitions: Array<{ text: string; example?: string }>;
  ipa?: string;
  root?: string;
  synonyms: string[];
  antonyms: string[];
}

function parseWikiWordList(content: string, sectionAr: string, templateName: string): string[] {
  // From ====section==== block: * [[word]] entries
  const secMatch = content.match(
    new RegExp(`====\\s*${sectionAr}\\s*====[\\s\\S]*?(?:\\n====|$)`)
  );
  const fromSection = secMatch
    ? Array.from(secMatch[0].matchAll(/\*\s*\[\[([^\]|#]+)/g)).map((m) => m[1]?.trim() ?? '')
    : [];
  // From {{template|ar|word1|word2}} inline
  const tmpl = content.match(new RegExp(`\\{\\{${templateName}\\|ar\\|([^}]+)\\}\\}`))?.[1];
  const fromTemplate = tmpl
    ? tmpl.split('|').map((p) => p.trim()).filter((p) => p && !p.includes('='))
    : [];
  return [...new Set([...fromSection, ...fromTemplate])].filter(Boolean).slice(0, 8);
}

async function fetchArWikiData(arabicWord: string): Promise<ArWikiData> {
  const empty: ArWikiData = { definitions: [], synonyms: [], antonyms: [] };
  const content = await fetchWikiPage(AR_WIKI_API, stripDiacritics(arabicWord));
  if (!content) return empty;

  // Find part of speech — Arabic Wiktionary uses Arabic headers
  const posM = content.match(/===\s*(اسم|فعل|صفة|ظرف|حرف|ضمير|مصدر|صوت)\s*===/);
  const partOfSpeech = posM?.[1];

  // IPA from {{ص ع|/…/}} or {{IPA|/…/}}
  const ipaM = content.match(/\{\{(?:ص ع|IPA)\|[^/]*\/([^/}]+)\//);
  const ipa = ipaM?.[1] ? `/${ipaM[1]}/` : undefined;

  // Root from {{جذر|...|ر|ح|ب}}
  const rootM = content.match(/\{\{جذر\|([^}]+)\}\}/);
  let root: string | undefined;
  if (rootM?.[1]) {
    const parts = rootM[1].split('|').filter((p) => p && !p.includes('=') && p !== 'ar');
    if (parts.length >= 2) root = parts.join('-');
  }

  // Synonyms: ====مرادفات==== or {{syn|ar|…}}
  const synonyms = parseWikiWordList(content, 'مرادفات', '(?:syn|مرادف)');
  // Antonyms: ====متضادات==== or {{ant|ar|…}}
  const antonyms = parseWikiWordList(content, 'متضادات', '(?:ant|متضاد)');

  // Definitions (# …), skip lines that are just templates or empty after stripping
  const rawDefs = Array.from(content.matchAll(/^# ([^#:\n].+)$/gm)).slice(0, 4);
  const exampleLines = Array.from(content.matchAll(/^#: (.+)$/gm));

  const definitions = rawDefs
    .map((m, i) => ({
      text:    stripWikiMarkup(m[1] ?? ''),
      example: stripWikiMarkup(exampleLines[i]?.[1] ?? ''),
    }))
    .filter((d) => d.text.length > 2);

  return { partOfSpeech, ipa, root, synonyms, antonyms, definitions };
}

const isRealWord = (s: string) => s.length > 3 && !s.includes('.');

// ─── main handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim();
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });

  const inputLang = detectLanguage(query);
  let englishWord  = query;
  let arabicWord   = '';
  let viWord       = '';

  // Phase 1 — normalize to English if needed
  if (inputLang === 'ar') {
    arabicWord  = query;
    englishWord = (await translate(query, 'ar', 'en')) || query;
  } else if (inputLang === 'vi') {
    viWord      = query;
    englishWord = (await translate(query, 'vi', 'en')) || query;
  }

  // Phase 2 — parallel: EN Free Dict + EN Wiktionary translations
  const [enData, enWiki] = await Promise.all([
    fetchFreeDictionary(englishWord.toLowerCase(), 'en'),
    inputLang === 'en' ? fetchEnWikiData(englishWord) : Promise.resolve<EnWikiData>({ arabicSectionContent: '' }),
  ]);

  // Resolve Arabic and Vietnamese words
  // Priority: Wiktionary translations > existing value > MyMemory
  if (!arabicWord) arabicWord = enWiki.arabicWord ?? (await translate(englishWord, 'en', 'ar')) ?? '';
  if (!viWord)     viWord     = enWiki.vietnameseWord ?? (await translate(englishWord, 'en', 'vi')) ?? '';
  arabicWord = arabicWord || englishWord;
  viWord     = viWord     || englishWord;

  // Extract EN entry early — needed to prepare defs for parallel translation
  const enEntry = enData?.[0];

  // Collect up to 3 richest definitions from EN Free Dict API (full sentence definitions)
  type DefItem = { text: string; example?: string };
  const enDefsRaw: DefItem[] = [];
  for (const m of ((enEntry?.meanings ?? []) as any[]).slice(0, 3)) {
    for (const d of ((m.definitions ?? []) as any[]).slice(0, 2)) {
      if (enDefsRaw.length < 3) {
        enDefsRaw.push({ text: d.definition as string, example: d.example as string | undefined });
      }
    }
  }

  // Collect English synonyms/antonyms for batch translation (before phase 3)
  const rawSynSet = new Set<string>();
  const rawAntSet = new Set<string>();
  for (const m of ((enEntry?.meanings ?? []) as any[])) {
    for (const s of (m.synonyms as string[] ?? [])) rawSynSet.add(s);
    for (const a of (m.antonyms as string[] ?? [])) rawAntSet.add(a);
    for (const d of ((m.definitions ?? []) as any[])) {
      for (const s of (d.synonyms as string[] ?? [])) rawSynSet.add(s);
      for (const a of (d.antonyms as string[] ?? [])) rawAntSet.add(a);
    }
  }
  const enSynStr = [...rawSynSet].filter(isRealWord).slice(0, 6).join(', ');
  const enAntStr = [...rawAntSet].filter(isRealWord).slice(0, 6).join(', ');

  // Phase 3 — all in parallel: Wiktionary fetches + translate EN defs → AR + VI
  //           + batch-translate EN synonyms/antonyms → VI
  const [enArEntry, arWiki, arDefTexts, viDefTexts, viSynStr, viAntStr] = await Promise.all([
    fetchEnWikiArabicEntry(arabicWord),
    fetchArWikiData(arabicWord),
    enDefsRaw.length > 0
      ? Promise.all(enDefsRaw.map((d) => translate(d.text, 'en', 'ar')))
      : Promise.resolve([] as string[]),
    enDefsRaw.length > 0
      ? Promise.all(enDefsRaw.map((d) => translate(d.text, 'en', 'vi')))
      : Promise.resolve([] as string[]),
    enSynStr ? translate(enSynStr, 'en', 'vi') : Promise.resolve(''),
    enAntStr ? translate(enAntStr, 'en', 'vi') : Promise.resolve(''),
  ]);

  // ── Build English meanings ───────────────────────────────────────────────
  const enMeanings: Meaning[] = (enEntry?.meanings ?? []).map((m: any) => ({
    partOfSpeech: m.partOfSpeech,
    definitions:  (m.definitions as any[]).slice(0, 3).map((d: any) => ({
      text:    d.definition as string,
      example: (d.example as string | undefined) || undefined,
    })),
    synonyms: [
      ...(m.synonyms as string[] ?? []),
      ...(m.definitions as any[]).flatMap((d: any) => d.synonyms as string[] ?? []),
    ].slice(0, 8),
    antonyms: [
      ...(m.antonyms as string[] ?? []),
      ...(m.definitions as any[]).flatMap((d: any) => d.antonyms as string[] ?? []),
    ].slice(0, 8),
  }));

  // ── Build Arabic meanings ────────────────────────────────────────────────
  const arPartOfSpeech = arWiki.partOfSpeech ?? enArEntry.partOfSpeech;

  // Collect all available Arabic example sentences (EN Wiktionary + AR Wiktionary)
  const arExamples = [
    ...enArEntry.examples,
    ...arWiki.definitions.filter((d) => d.example).map((d) => ({ ar: d.example!, en: undefined })),
  ];

  // Primary: translated EN Free Dict defs — these are full-sentence rich definitions
  const translatedDefs = arDefTexts
    .map((arDef, i) => ({
      text:               arDef || enDefsRaw[i]?.text || '',
      example:            arExamples[i]?.ar,
      exampleTranslation: arExamples[i]?.en,
    }))
    .filter((d) => d.text.length > 3);

  // Supplement: native Arabic Wiktionary defs that are substantial sentences (not just 1-2 words)
  const nativeDefs = arWiki.definitions
    .filter((d) => d.text.length > 15 && !translatedDefs.some((t) => t.text.includes(d.text)))
    .map((d) => ({ text: d.text, example: d.example || undefined, exampleTranslation: undefined }));

  // Merge: translated (primary) + native substantial (supplement), cap at 4
  const combinedArDefs = [...translatedDefs, ...nativeDefs].slice(0, 4);

  const arMeanings: Meaning[] = [{
    partOfSpeech: arPartOfSpeech,
    definitions: combinedArDefs.length > 0
      ? combinedArDefs
      : [{
          text:               arabicWord,
          example:            arExamples[0]?.ar,
          exampleTranslation: arExamples[0]?.en,
        }],
    synonyms: arWiki.synonyms.length > 0 ? arWiki.synonyms : undefined,
    antonyms: arWiki.antonyms.length > 0 ? arWiki.antonyms : undefined,
  }];

  // ── Build Vietnamese meanings ────────────────────────────────────────────
  const viPartOfSpeech =
    VI_POS_MAP[enMeanings[0]?.partOfSpeech?.toLowerCase() ?? ''] ??
    enMeanings[0]?.partOfSpeech ?? 'danh từ';

  const viTranslatedDefs = viDefTexts
    .map((viDef, i) => ({
      text:    viDef || enDefsRaw[i]?.text || '',
      example: undefined as string | undefined,
    }))
    .filter((d) => d.text.length > 3);

  const splitTranslated = (raw: string) =>
    [...new Set(raw ? raw.split(/[,،]/).map((s) => s.trim()).filter(isRealWord) : [])];

  const viMeanings: Meaning[] = [{
    partOfSpeech: viPartOfSpeech,
    definitions: viTranslatedDefs.length > 0
      ? viTranslatedDefs
      : [{ text: viWord }],
    synonyms: splitTranslated(viSynStr).length > 0 ? splitTranslated(viSynStr) : undefined,
    antonyms: splitTranslated(viAntStr).length > 0 ? splitTranslated(viAntStr) : undefined,
  }];

  // ── Phonetics & audio ────────────────────────────────────────────────────
  const phonetic  = enEntry?.phonetics?.find((p: any) => p.text)?.text  ?? '';
  const rawAudio  = enEntry?.phonetics?.find((p: any) => p.audio?.length > 4)?.audio ?? '';
  const audioUrl  = rawAudio.startsWith('//') ? 'https:' + rawAudio : rawAudio;
  // Only use Latin-script sources — Arabic script is already shown in the large display
  const arabicIpa =
    arWiki.ipa ||
    (enWiki.arabicRoman ? `/${enWiki.arabicRoman}/` : '');

  // ── Synonyms / antonyms (filter out abbreviations like "sci.", "pron.") ──
  const allSynonyms = [...new Set(enMeanings.flatMap((m) => m.synonyms ?? []))]
    .filter(isRealWord).slice(0, 10);
  const allAntonyms = [...new Set(enMeanings.flatMap((m) => m.antonyms ?? []))]
    .filter(isRealWord).slice(0, 10);

  // ── Root & plural (merge both Wiktionary sources) ────────────────────────
  const root        = enArEntry.root   ?? arWiki.root;
  const arabicPlural = enArEntry.plural;

  const canonicalWord = enEntry?.word ?? englishWord;

  const result: WordEntry = {
    id:           canonicalWord.toLowerCase(),
    slug:         canonicalWord.toLowerCase().replace(/\s+/g, '-'),
    arabic:       arabicWord,
    english:      canonicalWord,
    vietnamese:   viWord,
    ipa:          phonetic,
    root,
    arabicPlural,
    audioUrl,
    translations: [
      {
        language: 'en',
        word:     canonicalWord,
        ipa:      phonetic,
        meanings: enMeanings.length
          ? enMeanings
          : [{ partOfSpeech: 'noun', definitions: [{ text: canonicalWord }] }],
      },
      {
        language: 'ar',
        word:     arabicWord,
        ipa:      arabicIpa,
        meanings: arMeanings,
      },
      {
        language: 'vi',
        word:     viWord,
        ipa:      '',
        meanings: viMeanings,
      },
    ],
    synonyms:   allSynonyms,
    antonyms:   allAntonyms,
    references: [
      { title: 'Wiktionary', url: `https://en.wiktionary.org/wiki/${encodeURIComponent(canonicalWord)}` },
      { title: 'Wikipedia',  url: `https://en.wikipedia.org/wiki/${encodeURIComponent(canonicalWord)}` },
      { title: 'القاموس',    url: `https://ar.wiktionary.org/wiki/${encodeURIComponent(stripDiacritics(arabicWord))}` },
    ],
  };

  return NextResponse.json(result);
}
