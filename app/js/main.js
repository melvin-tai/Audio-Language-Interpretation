/**
 * main.js — page entry point. Builds the controls, implements the "view" the
 * Interpreter reports to, and wires up the buttons. Only page/DOM code lives here.
 */
import { LANGUAGES, DEFAULT_SETTINGS } from './config.js';
import { loadSettings, saveSettings } from './settings.js';
import { Interpreter } from './interpreter.js';
import { TranslationRouter } from './translation/index.js';
import { isWebSpeechSupported } from './recognition/index.js';
import { onModelProgress, describeProgress } from './workers/ml-client.js';
import { isPhoneOrTablet, createWakeLock } from './device.js';

const $ = (id) => document.getElementById(id);
const el = {
  source: $('source'), target: $('target'), swap: $('swap'),
  record: $('record'), recordText: $('record-text'), recordLabel: $('record-label'),
  status: $('status'), live: $('live'), phrases: $('phrases'), empty: $('empty'),
  toolbar: $('toolbar'), copy: $('copy'), clear: $('clear'),
};
const lockedWhileRecording = [el.source, el.target, el.swap];

const phone = isPhoneOrTablet();
const tapWord = phone ? 'Tap' : 'Click';
const wakeLock = createWakeLock();

// ---------- build the controls ----------
const option = (value, text) => Object.assign(document.createElement('option'), { value, textContent: text });
for (const l of LANGUAGES) {
  const text = l.native === l.name ? l.name : `${l.name} · ${l.native}`;
  el.source.append(option(l.id, text));
  el.target.append(option(l.id, text));
}

// Everything except the two languages is chosen automatically. (Advanced users
// can still override engines with URL parameters — see developer/README.md.)
// Phones get the smallest on-device model by default (less data, less memory).
const settings = loadSettings({ defaults: phone ? { ...DEFAULT_SETTINGS, whisperModel: 'tiny' } : DEFAULT_SETTINGS });
el.source.value = settings.source;
el.target.value = settings.target;
const readSettings = () => ({ ...settings, source: el.source.value, target: el.target.value });
for (const c of lockedWhileRecording) c.addEventListener('change', () => saveSettings(readSettings()));

// ---------- the view the Interpreter talks to ----------
const view = {
  setStatus(msg, kind = '') {
    el.status.textContent = msg;
    el.status.className = `status ${kind}`.trim();
  },
  setLive(text) {
    el.live.textContent = text;
    el.live.hidden = !text;
  },
  setRecording(on) {
    el.record.setAttribute('aria-pressed', String(on));
    el.recordText.textContent = on ? 'Stop listening' : 'Start listening';
    el.recordLabel.textContent = `${tapWord} to ${on ? 'stop' : 'start'}`;
    for (const c of lockedWhileRecording) c.disabled = on; // languages are fixed while listening
    on ? wakeLock.on() : wakeLock.off();
  },
  addPhrase(text) {
    const li = document.createElement('li');
    li.className = 'phrase';
    const original = Object.assign(document.createElement('p'), { className: 'original', textContent: text, lang: el.source.value });
    const translated = Object.assign(document.createElement('p'), { className: 'translated pending', textContent: 'Translating…' });
    translated.lang = el.target.value; // right font for Japanese vs Chinese, etc.
    li.append(original, translated);
    el.phrases.prepend(li); // newest first: no scrolling needed on phones
    el.empty.hidden = true;
    el.toolbar.hidden = false;
    return { li, original, translated };
  },
  setTranslation({ original, translated }, text, { passthrough = false, failed = false } = {}) {
    translated.classList.remove('pending');
    if (failed) {
      translated.classList.add('failed');
      translated.textContent = 'Couldn’t translate this one.';
      return;
    }
    translated.textContent = text;
    if (passthrough) { original.hidden = true; translated.lang = original.lang; } // same language: just show the words
  },
};

const router = new TranslationRouter({ onStatus: (m) => view.setStatus(m) });
const interpreter = new Interpreter({ view, router, device: { phone } });
onModelProgress((p) => {
  if (!interpreter.isRunning) return;
  const msg = describeProgress(p);
  if (msg) view.setStatus(msg);
});

// ---------- buttons ----------
el.record.addEventListener('click', async () => {
  el.record.disabled = true; // ignore double taps while starting/stopping
  try {
    if (interpreter.isRunning) await interpreter.stop();
    else await interpreter.start(readSettings());
  } finally {
    el.record.disabled = false;
  }
});

el.swap.addEventListener('click', () => {
  [el.source.value, el.target.value] = [el.target.value, el.source.value];
  saveSettings(readSettings());
});

el.clear.addEventListener('click', () => {
  el.phrases.replaceChildren();
  el.empty.hidden = false;
  el.toolbar.hidden = true;
});

el.copy.addEventListener('click', async () => {
  // Oldest first, as a readable transcript.
  const text = [...el.phrases.children].reverse().map((li) =>
    [...li.querySelectorAll('p')].filter((p) => !p.hidden).map((p) => p.textContent).join('\n'),
  ).join('\n\n');
  try {
    await navigator.clipboard.writeText(text);
    view.setStatus('Copied!');
  } catch {
    view.setStatus('Copying isn’t allowed here — press and hold the text to copy it instead.', 'warn');
  }
});

el.recordLabel.textContent = `${tapWord} to start`;

const canListen = isWebSpeechSupported() || !!navigator.mediaDevices?.getUserMedia;
if (!window.isSecureContext) {
  view.setStatus('The microphone only works on secure web pages. Please open https://melvin-tai.github.io/Audio-Language-Interpretation/', 'error');
} else if (!canListen) {
  view.setStatus('This browser can’t use the microphone. Please try Chrome, Safari, Edge or Firefox.', 'error');
}
