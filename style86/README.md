# Style86: sito vetrina (concept)

Static site, no build step. Open `index.html` through any static server:

    python3 -m http.server 8686

## Swapping in the salon's real photos
Replace the files in `media/` keeping the same names (JPG, ~2560px wide for `hero-*`, ~1200–1600px for the rest):

| File | Use |
|------|-----|
| hero-1 … hero-5 | Scroll film shots, in order: wide interior → chair/mirror → fade detail → colour → final portrait |
| studio | Portrait of Sami at work (4:5) |
| g-1 … g-6 | Gallery: fade, beard, balayage, blow-dry, interior, products |

Camera moves for each hero shot are in `SHOTS` at the top of `app.js`.

## To confirm with the salon
- Prices on items marked `data-confirm="1"` in `index.html` are estimates.
- WhatsApp on +39 366 305 7307 (assumed).
- Hours: Treatwell lists Tue–Sat 9–20, Sun 10–16, Mon closed; Instagram says Mon–Sat 9–19:30.
