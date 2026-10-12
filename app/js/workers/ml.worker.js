/**
 * ml.worker.js — runs AI models (Whisper speech-to-text, NLLB translation)
 * off the main thread so the page never freezes.
 *
 * Models come from the Hugging Face Hub via transformers.js and are cached by
 * the browser (Cache Storage) after the first download, so later visits work
 * offline for these engines.
 *
 * Protocol (main → worker):
 *   { id, op: 'transcribe', model, audio: Float32Array (16 kHz mono), language }
 *   { id, op: 'translate',  model, text, src, tgt }
 *   { id, op: 'load',       model, for: 'transcribe' | 'translate' }
 * Replies (worker → main):
 *   { id, result }            on success
 *   { id, error }             on failure
 *   { type: 'progress', op, model, info }   while models download/load
 */
import { TRANSFORMERS_URL } from '../config.js';

let lib = null;                 // the transformers.js module, imported on first use
const pipelines = new Map();    // `${task}|${model}` → Promise<pipeline>

async function getPipeline(task, model, op) {
  const key = `${task}|${model}`;
  if (!pipelines.has(key)) {
    const p = (async () => {
      lib ??= await import(TRANSFORMERS_URL);
      lib.env.allowLocalModels = false;
      return lib.pipeline(task, model, {
        dtype: 'q8',      // 8-bit weights: ~4× smaller than fp32, small accuracy cost
        device: 'wasm',   // runs everywhere; WebGPU could be faster but is less reliable
        progress_callback: (info) => self.postMessage({ type: 'progress', op, model, info }),
      });
    })();
    p.catch(() => pipelines.delete(key)); // let a failed load be retried
    pipelines.set(key, p);
  }
  return pipelines.get(key);
}

const TASKS = { transcribe: 'automatic-speech-recognition', translate: 'translation' };

const handlers = {
  /** Pre-load a model so the first real request isn't slowed by the download. */
  async load({ model, for: op }) {
    await getPipeline(TASKS[op], model, op);
    return true;
  },

  async transcribe({ model, audio, language }) {
    const asr = await getPipeline(TASKS.transcribe, model, 'transcribe');
    const longer = audio.length > 30 * 16000; // Whisper's window is 30 s
    const out = await asr(audio, { language, task: 'transcribe', ...(longer ? { chunk_length_s: 30 } : {}) });
    return (out.text || '').trim();
  },

  async translate({ model, text, src, tgt }) {
    const mt = await getPipeline(TASKS.translate, model, 'translate');
    const out = await mt(text, { src_lang: src, tgt_lang: tgt, max_new_tokens: 512 });
    return (out[0]?.translation_text || '').trim();
  },
};

self.onmessage = async ({ data }) => {
  const { id, op, ...payload } = data;
  try {
    if (!handlers[op]) throw new Error(`Unknown op "${op}"`);
    self.postMessage({ id, result: await handlers[op](payload) });
  } catch (err) {
    self.postMessage({ id, error: err?.message || String(err) });
  }
};
