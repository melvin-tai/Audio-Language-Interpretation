/**
 * nllb.js — Meta's NLLB-200 translation model running inside the page.
 *
 * Fully offline and private after a one-time ~895 MB download (cached by the
 * browser). Opt-in only because of that size. Slower than the other engines.
 */
import { callWorker } from '../workers/ml-client.js';
import { NLLB_MODEL } from '../config.js';

export const nllbTranslator = {
  id: 'nllb',
  label: 'Offline translator (NLLB-200)',
  isSupported: () => typeof Worker === 'function',
  prepare() {
    callWorker('load', { model: NLLB_MODEL, for: 'translate' }).catch(() => {});
  },
  translate(text, src, tgt) {
    return callWorker('translate', { model: NLLB_MODEL, text, src: src.nllb, tgt: tgt.nllb });
  },
};
