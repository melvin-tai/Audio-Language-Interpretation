/**
 * recognition/index.js — picks a speech-to-text engine.
 *
 * 'auto' prefers the browser's built-in recognition (instant, word-by-word) and
 * uses on-device Whisper where it's missing (e.g. Firefox). The controller also
 * switches to Whisper if the built-in one fails at runtime (e.g. Brave, Edge).
 */
import { WebSpeechEngine, isWebSpeechSupported } from './webspeech.js';
import { WhisperEngine } from './whisper.js';
import { WHISPER_MODELS } from '../config.js';

/**
 * @param {'auto'|'webspeech'|'whisper'} choice
 * @param {string} whisperModelKey  key of WHISPER_MODELS
 * @param {{ phone?: boolean }} device  phones use phrase-by-phrase built-in recognition
 */
export function createRecognitionEngine(choice, whisperModelKey, { phone = false } = {}) {
  const whisper = () => new WhisperEngine({ modelId: (WHISPER_MODELS[whisperModelKey] || WHISPER_MODELS.base).id });
  const builtIn = () => new WebSpeechEngine({ continuous: !phone });
  if (choice === 'whisper') return whisper();
  if (choice === 'webspeech') return builtIn();
  return isWebSpeechSupported() ? builtIn() : whisper();
}

export { isWebSpeechSupported };
