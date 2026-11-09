# Word of the Day

A new word every day on your sleep screen, with its meaning and an example.
It's meant for the **Word of the day** sleep theme.

Needs a board with SD plugins: X4 Pro, X4C or Picco.

## Install

1. Copy this `word-of-the-day` folder to `/plugins/` on the SD card.
2. On the reader, turn on **Settings > System > Enable Plugins**.
3. Pick the **Word of the day** sleep theme (Settings > Sleep Theme > Get More Themes).

## How it works

`sleep-vars-daily.jsonl` holds 366 words, one per line. Each time the reader
goes to sleep it picks today's line by the date, so the word changes once a
day with no WiFi and no code running. If the reader doesn't know the date
yet, it shows the word in `sleep-vars.json` instead.

Make your own list by editing `sleep-vars-daily.jsonl`. Each line is one JSON
object with `word`, `kind`, `definition` and `example`. Keep each line under
2 KB, and stick to plain ASCII unless your theme's fonts include other
characters.
