# 🎙️ Live Interpreter

**Speak in one language, read it in another — live, on your phone or computer.**

Works with **English, French, German, Mandarin Chinese, Japanese and Indonesian**, in any direction. It's free, has no ads, needs no account and no app to install. It's simply a web page.

| Step | What you do |
|---|---|
| 1 | Pick **I speak** and **Translate to** |
| 2 | Press the big blue **microphone** button |
| 3 | Talk. Each sentence appears with its translation underneath |
| 4 | Press the button again to stop |

---

## Contents

- [Using it](#using-it)
- [Get your own free link (5 minutes, no installing)](#get-your-own-free-link-5-minutes-no-installing)
- [Phones and tablets](#phones-and-tablets)
- [Tips for good results](#tips-for-good-results)
- [Privacy, in plain words](#privacy-in-plain-words)
- [Settings explained](#settings-explained)
- [Something not working?](#something-not-working)
- [What's in this folder](#whats-in-this-folder)

---

## Using it

1. Open the website link.
2. Choose the language you will **speak** and the language you want to **read**. The ⇄ button swaps them, which is handy when two people take turns.
3. Press the **microphone** button. The first time, your browser asks whether this site may use the microphone. Choose **Allow**.
4. Speak normally. A grey box shows the words as they're being heard. When you finish a sentence, a card appears:
   - in small grey text, **what you said**
   - in large text, **the translation**

   The newest card is always at the top.
5. Press the button again (it now shows a ■ square) to stop.

**Copy all** copies the whole conversation, and **Clear** empties the list.

> 💡 Choose the **same language** in both boxes and it works as a simple dictation tool. It writes down what you say without translating.

---

## Get your own free link (5 minutes, no installing)

GitHub (a free website owned by Microsoft) can host this page for you at no cost. You only need a web browser on a **computer**. Once it's set up, anyone can use the link on any phone or computer.

**1. Make a free GitHub account**
Go to **[github.com/signup](https://github.com/signup)** and follow the steps. Skip this if you already have one.

**2. Create a new "repository" (a project folder)**
- Click the **+** at the top right, then **New repository**.
- **Repository name:** type `live-interpreter`, or any name you like. It becomes part of your link.
- Select **Public**. Free hosting needs this. Only the website's code is public; nothing you say is ever stored there.
- Click **Create repository**.

**3. Upload the files**
- First **unzip** the download. On Windows, right-click it and choose **Extract All**. On a Mac, double-click it.
- On the new repository page, click the link **"uploading an existing file"**.
- Open the unzipped `live-interpreter` folder. Select **everything inside it** (`Ctrl+A` on Windows, `⌘+A` on Mac) and **drag** it onto the GitHub page.
  ⚠️ Drag the files that are *inside* the folder, not the folder itself. `index.html` must end up at the top level.
- Wait for the files to finish listing, then click the green **Commit changes** button at the bottom.

**4. Turn on the website**
- In your repository, click **Settings** (top bar), then **Pages** (left menu).
- Under **Build and deployment → Source**, choose **Deploy from a branch**.
- Under **Branch**, choose **main** and leave the folder as **/ (root)**. Click **Save**.

**5. Open your link**
After a minute or two, refresh the Pages settings screen. Your link appears at the top:

```
https://YOUR-USERNAME.github.io/live-interpreter/
```

Open it on your phone, bookmark it, and share it. 🎉

> To **update** the site later, upload the changed files the same way. The website refreshes itself within a few minutes.

---

## Phones and tablets

- **Android:** use **Chrome**. It gives the fastest results.
- **iPhone / iPad:** use **Safari**. If speech isn't recognised, check that **Settings → General → Keyboard → Enable Dictation** is switched on.
- **Add it to your home screen** so it opens like an app:
  - In Chrome on Android, tap **⋮ → Add to Home screen**.
  - In Safari on iPhone, tap **Share → Add to Home Screen**.
  - Note: on iPhone, the home-screen version may not be able to use speech recognition. If it doesn't work, open the link in Safari instead.
- **Keep the page open and the screen on** while you're using it. The app tries to stop the screen from locking, but if the phone sleeps or you switch apps, listening stops. Press the button again to continue.
- **Data use:** normal use sends only small amounts of data. The optional *On this device* mode downloads 41 MB once, so use Wi-Fi for that.

---

## Tips for good results

- **Speak in full sentences and pause briefly between them.** A short pause tells the app the sentence is finished.
- **Get close to the microphone** and avoid background music or TV.
- **One person at a time.** If two people talk at once, both get mixed up.
- **Choose the right "I speak" language before starting.** The app does not guess the language.
- **Names and slang** may be misheard or translated literally. That's normal for automatic translation.
- Treat translations as a helpful guide, not a certified interpreter. For legal, medical or other important matters, use a qualified human interpreter.

---

## Privacy, in plain words

Nothing is saved by this website. It has no server and no database, and it keeps no recordings. Close the tab and everything is gone.

What can leave your device depends on the settings:

| Setting | What happens to your voice | What happens to the text |
|---|---|---|
| **Automatic** (default) | Chrome sends it to Google and Safari to Apple to turn speech into text, the same as voice typing on your phone | Chrome on a computer translates on your own device. Otherwise the text is sent to the MyMemory translation service |
| **On this device** | **Stays on your device**. A one-time download is needed | Same as above, unless you also choose *Chrome's built-in* or the *Offline translator* |

For **maximum privacy**, on a computer choose **Speech recognition: On this device** and **Translation: Chrome's built-in** (in Chrome) or the **Offline translator**. After the one-time downloads, nothing leaves your computer, and it even works without internet.

---

## Settings explained

Tap **Settings** at the bottom of the page. You'll never *need* to change these; **Automatic** picks the best option for your device.

| Setting | Choices |
|---|---|
| **Speech recognition** | **Automatic**: the fastest option your browser supports.<br>**Browser's built-in**: words appear as you speak (Chrome and Safari).<br>**On this device**: private, works in every browser (including Firefox), and text appears after each pause. |
| **On-device download size** | Only used by *On this device*.<br>**Quick** (41 MB, the default on phones).<br>**Balanced** (77 MB, the default on computers).<br>**Most accurate** (249 MB, computers only). Downloaded once, then remembered. |
| **Translation** | **Automatic**: uses Chrome's built-in translator when available, otherwise MyMemory.<br>**Chrome's built-in**: private, on computers only.<br>**MyMemory online**: works everywhere, with a free daily limit.<br>**Offline translator**: private, but a very large one-time download (895 MB). Computers only. |

At the bottom of Settings, a short checklist shows what your current browser supports.

Your choices are remembered on that device.

**Share a link with the languages already set** by adding them to the end of the address. For example, this opens with Japanese → English:

```
https://YOUR-USERNAME.github.io/live-interpreter/?from=ja&to=en
```

Language codes: `en` English · `fr` French · `de` German · `zh` Mandarin · `ja` Japanese · `id` Indonesian.

---

## Something not working?

| What you see | What to do |
|---|---|
| A page saying **"Almost there!"** | You opened the file from your computer. Use your `https://…github.io/…` link instead (see the setup steps above). |
| **"Microphone access was blocked"** | Tap the 🔒 or ⓘ icon next to the web address, set **Microphone** to **Allow**, and reload. On iPhone, also check **Settings → Apps → Safari → Microphone** (on older iOS: **Settings → Safari → Microphone**). |
| GitHub shows **"404 – There isn't a GitHub Pages site here"** | Wait 2 minutes and refresh. If it persists, check that `index.html` is at the top level of your repository and not inside another folder. |
| Nothing appears when I speak | Check that the right **I speak** language is selected and the microphone isn't muted. Pause briefly after each sentence. |
| **"…switched to on-device recognition"** | Your browser's own speech service didn't work, which is common in Edge, Brave and Opera. The app switched automatically. The first time takes a moment to download. |
| **"Getting speech recognition ready — one-time download"** | This is normal the first time you use *On this device*. Wait for it to finish; next time it's instant. |
| **"Today's free translation limit has been reached"** | The free MyMemory service allows about 5,000 characters per day per internet connection. Try again tomorrow, or use Chrome on a computer. |
| A translation looks odd | Automatic translation isn't perfect, especially for very short phrases. Try saying the full sentence. On a computer, Chrome's built-in translator usually does better. |
| Chinese appears in Traditional characters | This can happen in *On this device* mode. Use the browser's built-in recognition for Simplified Chinese. |

---

## What's in this folder

```
live-interpreter/
├── index.html     ← the web page
├── app/           ← everything the page needs (styles and code)
├── README.md      ← this guide
├── LICENSE        ← free to use, change and share (MIT licence)
└── developer/     ← for programmers only: tests, tools and technical docs
```

You never need to open `app/` or `developer/`. Programmers should start at **[developer/README.md](developer/README.md)**.

---

### Credits

Speech recognition uses your browser's built-in service or OpenAI's **Whisper** model (via Hugging Face **transformers.js**). Translation uses Chrome's built-in **Translator**, the **MyMemory** service by Translated, or Meta's **NLLB-200** model. NLLB-200 is licensed for **non-commercial use only**. Everything else here is MIT-licensed.
