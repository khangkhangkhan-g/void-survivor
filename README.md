# Void Survivor

GitHub-ready source split from the original single-file build.

## Play locally

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
