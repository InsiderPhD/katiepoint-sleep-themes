# Adding a theme to the store

1. Make it in the [bench](https://insiderphd.github.io/katiepoint-sleep-themes/bench/) and
   check it on both devices (the Device menu: X4 and X3) with no errors in Checks.
2. Make a folder `themes/<id>/`. The id is lowercase letters, digits and `-`, up to 31
   characters; it is the folder name on the reader's SD card.
3. Put the bench's `theme.html` in it, with any SVG or image files it uses. Inter and the
   bench's icon fonts and Lucide icons are added at build time; other fonts go in the
   folder.
4. Add `theme.json`:

   ```json
   {
     "name": "Bedside clock",
     "description": "One sentence on what it shows, as the store lists it.",
     "order": 70
   }
   ```

5. Run `npm install` and `npm run check` (the bench's checks at both screen sizes), then
   `npm run build` to see `dist/<size>/<id>/preview.png`.
6. Open a pull request. The Action rebuilds `dist/` and the bench when it merges; don't
   hand-edit either.

Things that keep a theme working on every reader:

- Lay out with flex and percentages: the X3 screen is 528×792, the others 480×800.
- At most 4 live font/size pairs, 64 live elements and 4096 bytes of templates.
- `data-glyphs="digits"` on big numbers.
- Live text off greyscale images, and overlay themes with no page background.

When the firmware's compiler changes, `tools/sync-compiler.sh <firmware checkout>` copies
it into `tools/compiler/`; commit that and the Action rebuilds every theme with it.
