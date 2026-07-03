# Fellas Haberdashery &amp; Salon — Website

A dark, cinematic single-page marketing site for **Fellas Haberdashery &amp; Salon**
(1804 St. Clair Ave, St. Paul, MN). Built to match a modern, luxury barbershop
aesthetic — condensed display type, warm amber accents, full-bleed atmospheric
imagery, and smooth scroll reveals.

## Sections

- **Hero** — brand statement + primary "Book Your Chair" / call actions
- **Every Detail Intentional** — the shop's story (founders Justin &amp; Amy Iovinella)
- **Where the Modern Man Sits** — full-bleed ambiance moment
- **The Haberdashery** — the retail collection (apparel, grooming, footwear, accessories)
- **Services &amp; Pricing** — the grooming menu
- **Take the Chair** — booking call-to-action
- **Pull Up** — address, hours, contact, socials, and an embedded map

## Tech

Plain, dependency-free static site:

```
index.html
assets/
  css/styles.css
  js/main.js
```

- Google Fonts: Bebas Neue, Oswald, Playfair Display, Inter
- Vanilla JS: sticky nav, mobile menu, IntersectionObserver scroll reveals
- Responsive down to mobile; respects `prefers-reduced-motion`

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing content

All copy lives in `index.html`. Key spots to update:

- **Services &amp; pricing** — the `.services__grid` cards. Prices are shown as
  "from $—" starting points; confirm against the salon's current booking rates.
- **Booking link** — the "Book Online" / "Shop the Collection" buttons point to
  `https://www.fellassalon.com`. Swap in the direct Vagaro booking URL if preferred.
- **Social links** — update the Instagram/Facebook hrefs in the Visit section.
- **Imagery** — background photos are loaded from Unsplash as placeholders.
  Replace the URLs in `assets/css/styles.css` with the salon's own photography
  for the final launch.

> Note: service names and starting prices are representative placeholders based
> on a typical men's salon menu. Replace with the salon's exact menu before going live.
