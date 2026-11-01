# KatiePoint sleep themes

Sleep screens for KatiePoint on the Xteink X4, X4 Pro, X4C and X3. Each one is an HTML/CSS
page: the static parts are baked into a black-and-white picture, and the live parts (your
reading stats, the book you're on, the time, your covers) are filled in by the reader every
time it goes to sleep.

**[Open the Sleep Theme Bench](https://insiderphd.github.io/katiepoint-sleep-themes/bench/)**
to try any theme with sample values, change it, or make your own.

## Install a theme

- **On the reader:** Settings → sleep theme picker → get more themes. Pick one and it
  downloads over WiFi.
- **From a computer:** connect the reader to WiFi, open its web page, go to
  **Sleep Themes**, and press Install on a theme in the store.

Both download the build for your reader's screen from `dist/` here.

## The themes

| Theme | Shows |
|---|---|
| Book cover | The cover of the book you're reading, in greys; Sleeping when no book is open |
| Book cover, full screen | The cover cropped to fill the screen |
| Your pictures | A random BMP from the `/sleep` folder on the SD card (the old Custom screen) |
| Cover on your pictures | The book's cover on top of one of your pictures |
| Sleeping, dark / light | An open book, Sleeping and the time you put it down |
| Blank | A white screen |
| Page with a moon | Overlay: leaves the page on screen, with a moon and the time in a corner |
| Page with your stats | Overlay: the page, with a card of your streak, today's reading and your goal |
| Bookmark | Progress in huge type, time left at your pace, title and cover |
| Shelf | The book you're reading beside your recent ones |
| Reading habit | Your streak, your best run and this week's goal days as moons |
| Year in books | Books finished this year and month, top authors and shelves |
| Reading rhythm | Morning, afternoon, evening and night bars, and which kind of reader you are |
| Reader profile | Your reader score and its four parts |
| Bedside clock | The time, date, battery and how far into the chapter you got |
| Library card | The book as a checkout card: borrowed, days out, sittings, time |
| The Nightly Gazette | A newspaper front page with a headline written from your stats |
| Spines | Recent books as spines on a shelf, titles rotated up them |
| Departures | A split-flap board of hours, streak and minutes this week |
| Finished-book ticket | A tilted cover, a READ stamp and a ticket with the time it took |

Previews are in `dist/800x480/<id>/preview.png` (X4, X4 Pro, X4C) and
`dist/792x528/<id>/preview.png` (X3).

## Make a theme

1. Open the [bench](https://insiderphd.github.io/katiepoint-sleep-themes/bench/), pick a
   starting point, and drag values, text, covers and icons onto the screen. It checks the
   reader's limits as you go.
2. **Save .zip**, then on the reader's **Sleep Themes** web page choose the zip, Compile,
   and Install.

The format reference (every attribute, value, expression and limit) is
[docs/sleep-themes/README.md](https://github.com/InsiderPhD/crosspoint-reader/blob/master/docs/sleep-themes/README.md)
in the firmware repo. To add yours to the store, see [CONTRIBUTING.md](CONTRIBUTING.md).

## How this repo is built

```
themes/<id>/theme.html   the theme (plus theme.json: name, description, order; and any SVGs)
fonts/                   Inter, added to any theme that uses it
tools/compiler/          the firmware's compiler page, run headless
tools/compile.mjs        compiles every theme for every screen into dist/
tools/build-bench.mjs    writes every theme into the bench's Start from list
tools/check-themes.mjs   runs the bench's checks on every theme, at both sizes
bench/index.html         the Sleep Theme Bench (GitHub Pages)
dist/index.json          the store catalog the reader and its web page read
```

`npm run build` (or the GitHub Action, on every push to `themes/`, `tools/` or `fonts/`)
regenerates `bench/` and `dist/`. Locally, `CHROME_PATH` can point at an installed Chrome
instead of Puppeteer's download.

## Licences

Code: MIT ([LICENSE](LICENSE)). Inter: SIL Open Font License 1.1
([fonts/OFL-Inter.txt](fonts/OFL-Inter.txt)). Lucide icons in the bench: ISC.
