/**
 * config.js — the single source of truth for languages and engine settings.
 *
 * Every engine speaks a slightly different "language-code dialect", so each
 * language lists the code each engine expects. To add a language, add one
 * entry here; nothing else in the app needs to change.
 *
 *  speech     → Web Speech API (BCP-47). First entry is tried first; later
 *               entries are fallbacks if the browser rejects the first.
 *  whisper    → Whisper language code (ISO-639-1).
 *  translator → Chrome built-in Translator API (BCP-47 short code).
 *  mymemory   → MyMemory REST API.
 *  nllb       → NLLB-200 / FLORES-200 code.
 */
export const LANGUAGES = Object.freeze([
  { id: 'en', name: 'English',    native: 'English',          speech: ['en-US', 'en-GB'],        whisper: 'en', translator: 'en', mymemory: 'en',    nllb: 'eng_Latn' },
  { id: 'fr', name: 'French',     native: 'Français',         speech: ['fr-FR'],                 whisper: 'fr', translator: 'fr', mymemory: 'fr',    nllb: 'fra_Latn' },
  { id: 'de', name: 'German',     native: 'Deutsch',          speech: ['de-DE'],                 whisper: 'de', translator: 'de', mymemory: 'de',    nllb: 'deu_Latn' },
  { id: 'zh', name: 'Mandarin',   native: '中文',              speech: ['cmn-Hans-CN', 'zh-CN'],  whisper: 'zh', translator: 'zh', mymemory: 'zh-CN', nllb: 'zho_Hans' },
  { id: 'ja', name: 'Japanese',   native: '日本語',            speech: ['ja-JP'],                 whisper: 'ja', translator: 'ja', mymemory: 'ja',    nllb: 'jpn_Jpan' },
  { id: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', speech: ['id-ID'],                 whisper: 'id', translator: 'id', mymemory: 'id',    nllb: 'ind_Latn' },
]);

/** Look up a language by id; throws on unknown ids so typos fail loudly. */
export function getLanguage(id) {
  const lang = LANGUAGES.find((l) => l.id === id);
  if (!lang) throw new Error(`Unknown language id "${id}"`);
  return lang;
}

/** transformers.js is loaded from a CDN, pinned to an exact version. */
export const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1';

/** Whisper checkpoints (multilingual). Sizes are the q8 download, cached after first use. */
export const WHISPER_MODELS = Object.freeze({
  tiny:  { id: 'onnx-community/whisper-tiny',  label: 'Quick — 41 MB download (good for phones)' },
  base:  { id: 'onnx-community/whisper-base',  label: 'Balanced — 77 MB download' },
  small: { id: 'onnx-community/whisper-small', label: 'Most accurate — 249 MB download (computers)' },
});

/** Offline translation model (q8 ≈ 895 MB download — opt-in only). */
export const NLLB_MODEL = 'Xenova/nllb-200-distilled-600M';

export const MYMEMORY = Object.freeze({
  endpoint: 'https://api.mymemory.translated.net/get',
  /** API limit is 500 *bytes* of query per request. */
  maxQueryBytes: 500,
  /**
   * Optional contact e-mail. Anonymous use is limited to ~5,000 chars/day per IP;
   * adding an e-mail raises it to ~50,000 chars/day. Leave empty to stay anonymous.
   */
  email: '',
});

/** Voice-activity segmenter used by the Whisper engine (see audio/segmenter.js). */
export const SEGMENTER = Object.freeze({
  sampleRate: 16000,     // Whisper expects 16 kHz mono
  frameMs: 30,           // analysis frame
  minThreshold: 0.008,   // absolute RMS floor that counts as "speech"
  noiseRatio: 3,         // speech must be this many × louder than the running noise floor
  minSpeechMs: 300,      // ignore blips shorter than this
  maxSilenceMs: 700,     // a pause this long ends an utterance
  maxSegmentMs: 15000,   // force a cut so long monologues still stream out
  preRollMs: 300,        // keep a little audio from before speech started
});

export const DEFAULT_SETTINGS = Object.freeze({
  source: 'en',
  target: 'fr',
  recognition: 'auto',   // 'auto' | 'webspeech' | 'whisper'
  whisperModel: 'base',  // key of WHISPER_MODELS
  translation: 'auto',   // 'auto' | 'chrome' | 'mymemory' | 'nllb'
});
