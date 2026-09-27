# VOID SURVIVOR

> A game by **Nguyen Khang**

A browser-based survival game split into a clean, GitHub-ready project structure from the original single-file build.

---

## 🎮 Play the game

### Option 1 — Windows: easiest way

1. Download this repository as a ZIP.
2. Extract the ZIP to any folder.
3. Open the extracted `void-survivor-github` folder.
4. Double-click **`PLAY_GAME.bat`**.
5. The game opens in your default browser.

You can also open **`index.html`** directly.

### Option 2 — Run with a local server

Use this if your browser restricts features when opening `index.html` directly.

1. Open Terminal / Command Prompt inside the project folder.
2. Run:

```bash
python -m http.server 8080
```

3. Open this address in your browser:

```text
http://localhost:8080
```

> Python is only needed for this optional local-server method. It is **not required** if `PLAY_GAME.bat` or `index.html` already works normally.

---

## 📁 Project structure

```text
void-survivor-github/
├── index.html                     # Main game entry point
├── PLAY_GAME.bat                  # Quick launcher for Windows
│
├── css/                           # 73 extracted CSS blocks
├── js/                            # 88 extracted JavaScript blocks
│
├── legacy/
│   └── VOID_SURVIVOR_V14_MONOLITH.html
│                                    # Original all-in-one build for reference
│
├── README.md                      # Project guide
├── LICENSE                        # Nguyen Khang proprietary license
├── SOURCE_MAP.md                  # Original block → extracted-file map
├── source-map.json                # Machine-readable source map
└── .gitignore
```

---

## 🚀 Put the game on GitHub — step by step

### Method A — Upload through the GitHub website

This is the simplest method if you do not want to use Git commands.

1. Sign in to **GitHub**.
2. Click **New repository**.
3. Enter a repository name, for example:

```text
void-survivor
```

4. Choose **Public** or **Private**.
5. Do **not** add another README, `.gitignore`, or license when creating the repository, because this project already contains them.
6. Click **Create repository**.
7. On the empty repository page, choose **uploading an existing file**.
8. Open the extracted `void-survivor-github` folder on your computer.
9. Drag **the contents inside the folder** into GitHub — including:
   - `index.html`
   - `PLAY_GAME.bat`
   - `css/`
   - `js/`
   - `legacy/`
   - `README.md`
   - `LICENSE`
   - `SOURCE_MAP.md`
   - `source-map.json`
   - `.gitignore`
10. Enter a commit message such as:

```text
Initial release of Void Survivor
```

11. Click **Commit changes**.

Your source code is now on GitHub.

---

## 🌐 Publish it as a playable website with GitHub Pages

After uploading the project:

1. Open the GitHub repository.
2. Go to **Settings**.
3. In the sidebar, open **Pages**.
4. Under **Build and deployment**, choose:

```text
Source: Deploy from a branch
```

5. Select your main branch, normally:

```text
main
```

6. Select the folder:

```text
/ (root)
```

7. Click **Save**.
8. GitHub Pages will provide the public game URL from the Pages section once deployment is available.

Because `index.html` is already in the repository root, it is used as the website entry point.

---

## 🧑‍💻 Git method — optional

If you prefer Git commands, open a terminal inside this project folder and run:

```bash
git init
git add .
git commit -m "Initial release of Void Survivor"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/void-survivor.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## 🛠 Editing the game

The original build is patch-heavy, so the extracted files retain their original loading/execution order.

- Game page / markup → `index.html`
- Visual styling → `css/`
- Game logic and systems → `js/`
- Original all-in-one reference build → `legacy/VOID_SURVIVOR_V14_MONOLITH.html`

The numeric prefixes on CSS and JavaScript filenames represent their original source order. Avoid randomly changing that order unless you are intentionally refactoring dependencies.

---

## ✅ Build notes

This repository was created by externalizing the original monolithic build while preserving its behavior as closely as possible.

- **73 CSS blocks** extracted.
- **88 JavaScript blocks** extracted.
- JavaScript loading order preserved.
- CSS loading order preserved.
- Original monolithic build retained in `legacy/` as a fallback/reference copy.

---

## © License

**Copyright © 2026 Nguyen Khang. All Rights Reserved.**

VOID SURVIVOR is released under the **Nguyen Khang Proprietary License** included in [`LICENSE`](./LICENSE).

You may download, run, inspect, and modify the project privately for personal and non-commercial purposes. Redistribution, republication, commercial use, sublicensing, claiming authorship, or publishing derivative versions requires prior permission from **Nguyen Khang**.

Third-party materials, if any, remain subject to the rights and licenses of their respective owners.

---

**Created by Nguyen Khang — 2026**

No install or build step is required.

1. Download or clone this repository.
2. Open `index.html` in a modern desktop browser.
3. Play.

If your browser blocks a local-file feature, serve the folder locally instead:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Project structure

```text
void-survivor-github/
├─ index.html                 # Game markup; preserves original tag order
├─ css/                       # 73 extracted CSS blocks
├─ js/                        # 88 extracted JavaScript blocks
├─ legacy/
│  └─ VOID_SURVIVOR_V14_MONOLITH.html
├─ SOURCE_MAP.md              # Original block → extracted file map
├─ README.md
└─ .gitignore
```

## Important implementation note

The original game is patch-heavy. CSS and JavaScript blocks were externalized **without reordering their execution/loading positions in `index.html`**. This minimizes behavioral changes versus the monolithic build.

The file in `legacy/` is retained as a reference/fallback and is not required for normal play.

## GitHub Pages

This repository is static and can be hosted directly with GitHub Pages. Set the Pages source to the repository root (or the branch/root option available in repository settings). `index.html` is the entry point.

## Development

Edit the relevant numbered file in `css/` or `js/`. The numeric prefix reflects the original source order; keep that order unless you intentionally refactor dependencies.

## License

No license has been added automatically. Add a license only if you have the right to license all code and assets in this project.
