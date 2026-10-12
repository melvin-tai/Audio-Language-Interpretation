/**
 * translation/index.js — routes text to a translation engine, with fallback.
 *
 * Analogy: a switchboard that always tries the phone line inside the building
 * before dialling out. 'auto' uses, in order:
 *   1. anything that works with NO internet right now
 *        Chrome's built-in translator (if its language pack is installed),
 *        then the on-device models from "Download for offline use";
 *   2. only if the device is online: Chrome's translator (small download),
 *        then MyMemory (online service, with a short timeout).
 * So a slow or missing connection never blocks a pair that's been downloaded.
 */
import { chromeTranslator } from './chrome-builtin.js';
import { myMemoryTranslator } from './mymemory.js';
import { createOnDeviceTranslator } from './on-device.js';
import { offlinePacks } from '../offline/packs.js';

export const onDeviceTranslator = createOnDeviceTranslator({ isReady: (a, b) => offlinePacks.isPairReady(a, b) });
export const TRANSLATION_ENGINES = [chromeTranslator, onDeviceTranslator, myMemoryTranslator];
const AUTO_ORDER = ['chrome', 'on-device', 'mymemory'];
/** An engine that can't say within this time whether it's usable is skipped (some browsers never answer). */
const AVAILABILITY_TIMEOUT_MS = 1500;
/** Availability answers are reused for this long, so sentences after the first never wait. */
const AVAILABILITY_TTL_MS = 30_000;

function withTimeout(promise, ms, fallback) {
  let timer;
  return Promise.race([
    Promise.resolve(promise).finally(() => clearTimeout(timer)),
    new Promise((resolve) => { timer = setTimeout(() => resolve(fallback), ms); }),
  ]);
}

/** Thrown when there's no internet and nothing usable is stored on the device. */
export class OfflineNotReadyError extends Error {
  constructor() {
    super('No internet connection, and this language pair isn’t downloaded for offline use.');
    this.code = 'offline-not-ready';
  }
}

export class TranslationRouter {
  /**
   * @param {{ engines?: object[], onStatus?: (msg: string) => void, isOnline?: () => boolean }} opts
   */
  constructor({
    engines = TRANSLATION_ENGINES,
    onStatus = () => {},
    isOnline = () => globalThis.navigator?.onLine !== false,
    availabilityTimeoutMs = AVAILABILITY_TIMEOUT_MS,
  } = {}) {
    this.engines = new Map(engines.map((e) => [e.id, e]));
    Object.assign(this, { onStatus, isOnline, availabilityTimeoutMs });
    this.known = new Map(); // 'engine|src|tgt|explicit' → { value: Promise<string>, at }
    this.dead = new Map(); // 'engine|src|tgt' → reason, for combos that failed permanently
  }

  /** Engines this browser supports, in priority order, for a given user choice. */
  candidates(choice) {
    const ids = choice === 'auto' ? AUTO_ORDER : [choice];
    return ids.map((id) => this.engines.get(id)).filter((e) => e && e.isSupported());
  }

  /** Forget remembered availability (call after a download, or when the connection changes). */
  invalidate() {
    this.known.clear();
  }

  /** Is this engine usable for the pair? Checked once, then remembered briefly; never waits long. */
  availability(engine, src, tgt, explicit) {
    if (!engine.availability) return Promise.resolve('needs-network');
    const key = `${engine.id}|${src.id}|${tgt.id}|${explicit}`;
    const hit = this.known.get(key);
    if (hit && Date.now() - hit.at < AVAILABILITY_TTL_MS) return hit.value;
    const value = (async () => {
      try {
        return await withTimeout(engine.availability(src, tgt, { explicit }), this.availabilityTimeoutMs, 'unavailable');
      } catch {
        return 'unavailable';
      }
    })();
    this.known.set(key, { value, at: Date.now() });
    return value;
  }

  /**
   * Order engines for this pair: everything usable offline first, then (only if
   * online) everything that needs the network. All engines are asked at once.
   */
  async plan(choice, src, tgt) {
    const explicit = choice !== 'auto';
    const engines = this.candidates(choice);
    const answers = await Promise.all(engines.map((e) => this.availability(e, src, tgt, explicit)));
    const ready = engines.filter((_, i) => answers[i] === 'ready');
    const network = engines.filter((_, i) => answers[i] === 'needs-network');
    return this.isOnline() ? [...ready, ...network] : ready;
  }

  /** Warm up engines. Call synchronously inside a click handler (see chrome-builtin.js). */
  prepare(choice, src, tgt) {
    if (src.id === tgt.id) return;
    for (const e of this.candidates(choice)) e.prepare?.(src, tgt, this.onStatus);
    this.plan(choice, src, tgt).catch(() => {}); // answer availability now, not on the first sentence
  }

  /**
   * Translate `text` from language `src` to `tgt` (objects from config.LANGUAGES).
   * @returns {Promise<{ text: string, engine: string | null }>}
   */
  async translate(text, src, tgt, choice = 'auto') {
    if (src.id === tgt.id || !text.trim()) return { text, engine: null };
    if (!this.candidates(choice).length) throw new Error(`No translation engine available for "${choice}" in this browser.`);
    const engines = await this.plan(choice, src, tgt);
    if (!engines.length) throw new OfflineNotReadyError();
    const errors = [];
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
