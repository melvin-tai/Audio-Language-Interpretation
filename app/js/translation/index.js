/**
 * translation/index.js — routes text to a translation engine, with fallback.
 *
 * Analogy: a switchboard. 'auto' tries the best line first (Chrome's private,
 * on-device translator) and, if that line is dead for this language pair,
 * patches you through to the next (MyMemory online). NLLB is only used when
 * picked explicitly, because it's a ~895 MB download.
 */
import { chromeTranslator } from './chrome-builtin.js';
import { myMemoryTranslator } from './mymemory.js';
import { nllbTranslator } from './nllb.js';

export const TRANSLATION_ENGINES = [chromeTranslator, myMemoryTranslator, nllbTranslator];
const AUTO_ORDER = ['chrome', 'mymemory'];

export class TranslationRouter {
  /** @param {{ engines?: object[], onStatus?: (msg: string) => void }} opts */
  constructor({ engines = TRANSLATION_ENGINES, onStatus = () => {} } = {}) {
    this.engines = new Map(engines.map((e) => [e.id, e]));
    this.onStatus = onStatus;
    this.dead = new Map(); // 'engine|src|tgt' → reason, for combos that failed permanently
  }

  /** Engines to try, in order, for a given user choice. */
  candidates(choice) {
    const ids = choice === 'auto' ? AUTO_ORDER : [choice];
    return ids.map((id) => this.engines.get(id)).filter((e) => e && e.isSupported());
  }

  /** Warm up engines. Call synchronously inside a click handler (see chrome-builtin.js). */
  prepare(choice, src, tgt) {
    if (src.id === tgt.id) return;
    for (const e of this.candidates(choice)) e.prepare?.(src, tgt, this.onStatus);
  }

  /**
   * Translate `text` from language `src` to `tgt` (objects from config.LANGUAGES).
   * @returns {Promise<{ text: string, engine: string | null }>}
   */
  async translate(text, src, tgt, choice = 'auto') {
    if (src.id === tgt.id || !text.trim()) return { text, engine: null };
    const errors = [];
    const engines = this.candidates(choice);
    if (!engines.length) throw new Error(`No translation engine available for "${choice}" in this browser.`);
    for (const engine of engines) {
      const key = `${engine.id}|${src.id}|${tgt.id}`;
      if (this.dead.has(key)) { errors.push(`${engine.label}: ${this.dead.get(key)}`); continue; }
      try {
        const out = await engine.translate(text, src, tgt, this.onStatus);
        if (out) return { text: out, engine: engine.id };
        errors.push(`${engine.label}: empty result`);
      } catch (err) {
        if (err.permanent) this.dead.set(key, err.message);
        errors.push(`${engine.label}: ${err.message}`);
      }
    }
    throw new Error(errors.join(' · '));
  }
}
