# Najla Chicago Salon — Website

A lightweight, static, bilingual (English / Arabic) website for Najla Chicago
Salon (صالون نجلاء شيكاغو). Built with plain HTML, CSS and
vanilla JavaScript — no build step, no framework, no dependencies.

## Running it locally

You can simply double-click `index.html` to open it in a browser. For best
results (so the Google Font preconnects and relative paths behave exactly as
in production), serve it with any static file server, for example:

```bash
# Python
python -m http.server 8080

# Node (if you have it)
npx serve .
```

Then visit `http://localhost:8080`.

## Deploying

This is a fully static site — drag-and-drop the project folder onto
**Cloudflare Pages**, **Netlify**, or **Vercel** and it will work with zero
build configuration (no build command, output directory = project root).

## What to edit before going live

| What | Where |
|---|---|
| **Logo** | Already wired up — uses `assets/images/logo.jpeg` (compressed to `assets/images/optimized/logo.jpeg`, 512×512) in the header, hero, footer, favicon and social-share (Open Graph) image. Replace `assets/images/logo.jpeg` with a new file of the same name to update it everywhere, then re-run the compression step below. |
| **WhatsApp number** | `js/main.js` → `CONFIG.whatsappNumber` (digits only, with country code, e.g. `"971501234567"`). This single value powers the header "Book Now" button, hero CTA, the floating WhatsApp button, and the WhatsApp icon in Contact/Footer. |
| **Instagram link** | `js/main.js` → `CONFIG.instagramUrl` |
| **Address, email, opening hours** | `js/translations.js` → `UI.en.contact` and `UI.ar.contact` (edit both languages) |
| **Google Map** | `index.html` → the `<iframe src="https://www.google.com/maps?q=...">` inside the Contact section. It currently geocodes the `q=` text query (`Al+Nahda,+Sharjah,+United+Arab+Emirates`) live; swap in a more exact address, or paste a coordinate/embed URL from Google Maps ("Share" → "Embed a map") for a precise pin. |
| **About text & stats** | `js/translations.js` → `UI.en.about` / `UI.ar.about` |
| **Testimonials** | `js/translations.js` → `TESTIMONIALS` array |
| **Gallery photos** | Uses your real photos only (no external placeholder service) — `js/main.js` → `CONFIG.galleryImages`, each entry `{ file, alt: { en, ar } }` pointing at a file in `assets/images/optimized/`. Add/remove/reorder entries there; drop new originals in `assets/images/` and compress them into `assets/images/optimized/` first (see the compression note below). |
| **Service names** | `js/translations.js` → `SERVICES_DATA`. Everything is grouped by top-level category (Hair, Waxing & Threading, Skin, Nails, Eyelash & Eyebrow, Massage, Moroccan Bath, Henna) and then by subcategory. Add, remove or rename items here — the site re-renders from this single source of truth in both languages. Each item still carries a `price` field from the original price list, but the site no longer displays it (see below); it's dormant data, not deleted, in case pricing comes back later. |

## How the bilingual system works

- All UI copy and service data lives in `js/translations.js`, split into an
  `en` and `ar` version of every string (no duplicated HTML per language).
- The language toggle (`EN` / `عربي`) in the header calls `setLanguage()` in
  `js/main.js`, which:
  - Sets `lang` and `dir` on `<html>` (`dir="rtl"` flips the entire layout,
    not just the text — CSS handles mirrored paddings, icons and alignment
    via logical properties and a handful of `[dir="rtl"]` overrides).
  - Re-renders all dynamic sections (services, stats, gallery captions,
    testimonials, opening hours) from the translation data.
  - Persists the choice to `localStorage` so it's remembered on the next
    visit.
- Pricing is intentionally not rendered — `renderServices()` in `js/main.js`
  only outputs each item's name (and its "Add-on" tag where applicable),
  ignoring the `price` field still present in `SERVICES_DATA`.

## Project structure

```
/
├── index.html              Page markup / section structure
├── css/style.css           All styling (responsive, RTL-aware, light/dark)
├── js/translations.js      Bilingual UI strings + full service list
├── js/main.js              Language switching, RTL, tabs/accordion, search, WhatsApp links
├── assets/images/          Logo + downloaded photos (originals) + optimized/ (web-sized copies actually used by the site)
└── README.md
```

## Photo backgrounds — which file went where

Section/category background photos are wired up in `css/style.css` (the Hero
background) and via CSS attribute selectors keyed to the Services tab id
(`.services-panel[data-cat-panel="…"]`). All of them read from
`assets/images/optimized/`, not the originals, since the originals you drop
into `assets/images/` typically run 1–11MB each — too heavy to ship directly
as backgrounds or inline gallery images. Each one is resized to a max
dimension of 1800px on the long edge and re-compressed to JPEG quality 82,
which keeps every optimized file under ~300KB with no visible quality loss
at the sizes they're displayed. The originals are left untouched in
`assets/images/` in case you want to re-crop or re-export them yourself
later.

| File used | Mapped to | Notes |
|---|---|---|
| `banner-image-4.jpg` | **Hero** background (`#home`) and **Services & Treatments** banner | Editorial back-of-head hair shot, subject centered with plain background on both sides. The Hero zooms it in (`background-size: 165% auto`) purely to get horizontal pan room — at true `cover` this photo's aspect ratio leaves zero slack — then pans (`8% 22%`) to shift the hair off to one side so it doesn't sit directly behind the headline; `html[dir="rtl"] .hero-bg` mirrors that pan (`92% 22%`) so the hair swaps sides along with the text column. The Services banner keeps plain `cover` since its heading is centered, not off to one side. Preloaded via `<link rel="preload">` so it doesn't flash in late. |
| `banner-image.jpg` | **Gallery** only | The original banner photo — kept in the Gallery grid via `CONFIG.galleryImages` in `js/main.js`. |
| `hair-image.jpg` | **About** section photo frame | Salon-interior shot of a stylist finishing a client's hair — the framed portrait image next to the About text. |
| `hair-2.jpg` | **Hair** tab background (Services → Hair) | Hair-wash-at-the-basin shot. |
| `waxing.jpg` | **Waxing & Threading** tab background | |
| `skin.jpg` | **Skin** tab background (Services → Skin) | Facial treatment close-up. |
| `nail-salon-1.jpg` | **Nails** tab background (Services → Nails) | Even, neutral backdrop behind the manicured hand. |
| `eyelash-eyebrow.jpg` | **Eyelash & Eyebrow** tab background | |
| `massage-1.jpg` | **Massage** and **Moroccan Bath** tabs background | Both tabs currently share this one image; swap in a second photo per tab later if you'd like them visually distinct. |
| `henna.jpg` | **Henna** tab background | |

Every Services category now has its own tab background, so
`.services-panel[data-cat-panel="…"]::before` in `css/style.css` applies to
every panel rather than an opt-in list of category ids — see the "Category
photo backgrounds" comment there.

Every photo currently in `assets/images/optimized/` is in use somewhere on
the site. `nail-salon-2.jpg`, `nail-salon-3.jpg`, `massage-2.jpg`, plus a
second appearance of every category photo above, power the **Gallery** grid
too — see `CONFIG.galleryImages` in `js/main.js` to add, remove or reorder
them.

**If you add more/replace these images:** re-run them through a compressor
(e.g. [squoosh.app](https://squoosh.app), target JPEG ~75–85 quality, longest
edge ~1800–2000px for a full-bleed background) before dropping them into
`assets/images/optimized/` — shipping multi-MB originals directly as CSS
backgrounds will noticeably slow the page down, especially on mobile.

## Scroll animations & backgrounds — how it works

- **Hero**: `css/style.css` → `.hero-bg` layers a directional dark scrim
  gradient over `assets/images/optimized/banner-image-4.jpg` (zoomed and
  panned per the image table above), and `background-attachment: fixed` on
  desktop (disabled — falls back to `scroll` — under 768px, since fixed
  backgrounds cause scroll jank on iOS/Android).
- **Overlay gradient direction flips in RTL**: the Services banner's dark
  overlay uses `linear-gradient(var(--overlay-dir), …)`, where
  `--overlay-dir` is `to bottom right` by default and flips to
  `to bottom left` under `html[dir="rtl"]` (see `:root` and
  `html[dir="rtl"]` at the top of `css/style.css`). No JS involved — it
  follows the same `dir` attribute the language toggle already sets.
- **Fade-in/scale-in on scroll**: any element with the `.reveal` class (the
  section headings, the about/services/gallery/testimonials/contact content
  blocks) starts at `opacity:0` + a slight `translateY`/`scale`, and
  `initScrollReveal()` in `js/main.js` uses an `IntersectionObserver` to add
  `.in-view` the first time each one enters the viewport, which triggers the
  CSS transition. Respects `prefers-reduced-motion`.
- **Staggered card cascade** (the about-stats boxes, gallery tiles,
  testimonial cards, and the Services sidebar items): each item carries a
  `.reveal-item` class baked in from the moment it's rendered — it does *not*
  get added right before revealing, because doing both back-to-back lets the
  browser's CSS transition "reversal shortening" collapse the animation to
  near-zero duration. `staggerReveal()` in `js/main.js` sets an incrementing
  `transition-delay` per item, then adds `.in-view`, producing a
  cards-pop-in-one-after-another effect. Triggered once on scroll (via the
  same `IntersectionObserver` pattern) for the about/gallery/testimonials
  grids and the default Services tab; it also **replays every time a
  Services tab is switched** (see `revealSidebarInstant()` /
  `switchCategory()` in `js/main.js`) — inspired by the cascading icon/card
  grids on [kuruvaislandresort.com](https://kuruvaislandresort.com/), which
  use WOW.js + animate.css with the same incremental-delay approach.
- **Hover lift**: testimonial cards and the about-stats boxes lift slightly
  on hover (`transform: translateY(-6px)`), matching the interactive card
  feel of the reference site.

## Notes

- The Services section is organized as tabs (top-level categories, e.g.
  Hair, Skin, Nails) containing a sidebar/content menu — subcategory names
  listed down the left (`.services-sidebar`), the selected one's items shown
  in the panel on the right (`.services-content`) — so the ~300-item service
  list stays scannable instead of one long page. Stacks into a horizontally
  scrollable chip row above the content on narrow screens (<768px). The
  search box filters across both languages' service names live, hiding
  non-matching subcategories from the sidebar and jumping to the first
  category/subcategory that still has a match.
- Each category no longer has its own background photo behind the menu (a
  previous design) — those photos (`hair-2.jpg`, `waxing.jpg`, `skin.jpg`,
  etc.) are still in active use via the **Gallery** grid, just not here.
- A WhatsApp floating button is pinned to the corner on every section for
  one-tap booking.
- Basic SEO meta tags (title, description in both languages, Open Graph) are
  already in place in `index.html` — update the description/OG image once
  real branding assets are in place.
