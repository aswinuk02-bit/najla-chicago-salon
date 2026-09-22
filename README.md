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
| **Services (all of them)** | `js/services-data.js` → `SERVICES_DATA`, with the menu's behaviour in `SERVICES_CONFIG` at the top of the same file. See [The Services menu](#the-services-menu) below. |

## How the bilingual system works

- All UI copy lives in `js/translations.js` and all service data in
  `js/services-data.js`, each split into an `en` and `ar` version of every
  string (no duplicated HTML per language).
- The language toggle (`EN` / `عربي`) in the header calls `setLanguage()` in
  `js/main.js`, which:
  - Sets `lang` and `dir` on `<html>` (`dir="rtl"` flips the entire layout,
    not just the text — CSS handles mirrored paddings, icons and alignment
    via logical properties and a handful of `[dir="rtl"]` overrides).
  - Re-renders all dynamic sections (services, stats, gallery captions,
    testimonials, opening hours) from the translation data.
  - Persists the choice to `localStorage` so it's remembered on the next
    visit.
- Pricing is intentionally not rendered — see `showPrices` under
  [The Services menu](#the-services-menu).

## Project structure

```
/
├── index.html              Page markup / section structure
├── css/style.css           All styling (responsive, RTL-aware)
├── js/translations.js      Bilingual UI strings (nav, sections, buttons, labels)
├── js/services-data.js     Every service + the Services menu configuration
├── js/main.js              Language switching, RTL, Services menu, search, WhatsApp links
├── assets/images/          Logo + downloaded photos (originals) + optimized/ (web-sized copies actually used by the site)
└── README.md
```

## The Services menu

Category pills (sticky under the header) → a subcategory rail (a sidebar
from 768px up, a horizontal chip row below) → a panel of service cards.

### Category photos

Each top-level category (Hair, Waxing & Threading, Skin, Nails, Eyelash &
Eyebrow, Massage, Moroccan Bath, Henna) carries an `image` field in
`js/services-data.js`, pointing at a file in `assets/images/optimized/`:

```js
{
  id: "massage",
  icon: "massage",
  image: "massage-1.jpg",   // ← this
  name: { en: "Massage", ar: "المساج" },
  ...
}
```

It renders as the backdrop for the *entire* panel — header and card list
both — with the same light dark-overlay wash used for the Services banner
and Hero elsewhere on the site, so light text stays readable over any
photo. Swap the filename to change a category's photo; omit `image`
entirely to fall back to a plain white panel with opaque cards (no photo
to show through).

The panel itself is a fixed height (`clamp(420px, 74vh, 640px)`, shorter
on mobile) with only the card list (`.svc-panel-body`) scrolling inside
it — the header stays put. Service cards turn into translucent, blurred
"frosted glass" tiles over the photo (`.services-panel.has-photo .svc-card`
in `css/style.css`) rather than opaque tiles sitting on top of it; a soft
fade appears at the bottom of the list only while there's actually more
to scroll to (`updatePanelFade()` in `js/main.js`), and disappears once
scrolled to the end.

### Editing services

Everything is in `js/services-data.js`. A service is a compact tuple:

```js
["Normal Hair Wash", "غسيل شعر عادي", 40]
//  English name      Arabic name      price
```

Optional extras go in a 4th slot, and anything you leave out simply isn't
rendered — no blanks, no "undefined":

```js
["Hair Spa", "سبا الشعر", 85, {
  durationMinutes: 45,                              // renders "45 min"
  description: { en: "…", ar: "…" },                // one line under the name
  priceFrom: true,                                  // renders "from AED 85"
  popular: true,                                    // eligible for the "popular" helper card
  addOnFor: { en: "Hair Wash", ar: "غسيل الشعر" }   // add-ons only; defaults to the subcategory
}]
```

Add-ons are detected from the name (anything starting "Add On" / "إضافة"),
grouped at the bottom of the panel under an **Add-ons** heading with a pill
badge and a "Add-on for …" line. Set `isAddOn: true/false` to override.

Ids and deep-link slugs are generated from the English name
(`#hair/hair-style`), so renaming a service changes its link — pass an
explicit `id` if you need one pinned.

### Configuration (`SERVICES_CONFIG`)

| Setting | Default | What it does |
|---|---|---|
| `currency` | `{ en: "AED", ar: "د.إ" }` | Currency label; placed before the amount in English, after it in Arabic. |
| `showPrices` | `false` | Prices exist for every service but are hidden, as pricing was deliberately taken off the public site. Flip to `true` to show them on cards and in "Build your visit" totals. |
| `showDurations` | `true` | Durations render only where a service declares `durationMinutes`. None do yet, so nothing renders until you add them. |
| `bookingMode` | `false` | "Build your visit" — see below. |
| `helperCard` | `{ enabled: true, minServices: 8, type: "whatsapp" }` | The soft card under short subcategories, so a 6-service panel doesn't end in dead space. `type: "popular"` lists that subcategory's `popular: true` services instead. Set `enabled: false` to switch off. |

### "Build your visit" (optional, off by default)

Set `bookingMode: true` in `SERVICES_CONFIG`. Every card swaps its **Book**
button for **Add**, and a running summary appears — a panel at the bottom
corner on desktop, a docked bar on mobile — listing the selection with a
total time (when the services have durations) and total price (when
`showPrices` is on and every selected price is a plain number). **Book on
WhatsApp** hands the whole list off as a pre-filled message.

### Missing data

No service currently has a `durationMinutes` or a `description` — **all 231**
would need them if you want those on the cards. Nothing was invented to fill
the gap; the card just omits the element. Prices are present for all 231.

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
| `banner-image-5.jpg` | **Hero** background (`#home`) | Close-up flowing-hair shot with the face at one edge, hair already weighted toward the other side. On desktop (≥769px) `.hero-bg` zooms it in (`background-size: 140% auto`) purely to get horizontal pan room — at true `cover` this photo's aspect ratio (1.75:1) is close enough to most viewports' that it leaves little to no slack — then pans (`4% 26%`) to shift the hair further off the text column; `html[dir="rtl"] .hero-bg` mirrors that pan (`96% 26%`). Under 769px the same width-based zoom would badly under-cover a narrow/tall phone screen (it's sized off width, and a portrait viewport needs far more height than that yields), so a mobile override switches to plain `cover` at a fixed `64% center` — text is centered under 640px anyway, so there's no side left to keep clear. Preloaded via `<link rel="preload">` so it doesn't flash in late. |
| `banner-image-4.jpg` | **Services & Treatments** banner | Editorial back-of-head hair shot, subject centered with plain background on both sides. Its heading is centered, not off to one side, so it keeps plain `cover` with no pan needed. |
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
the site. `nail-salon-2.jpg`, `nail-salon-3.jpg`, a second appearance of
every category photo above, plus six gallery-only shots (`hair-gallery.jpg`,
`waxing-gallery.jpg`, `threading-gallery.jpg`, `henna-gallery.jpg`,
`henna-gallery-2.jpg`, `equipment-gallery.jpg`) power the **Gallery** grid
too — see `CONFIG.galleryImages` in `js/main.js` to add, remove or reorder
them.

**If you add more/replace these images:** re-run them through a compressor
(e.g. [squoosh.app](https://squoosh.app), target JPEG ~75–85 quality, longest
edge ~1800–2000px for a full-bleed background) before dropping them into
`assets/images/optimized/` — shipping multi-MB originals directly as CSS
backgrounds will noticeably slow the page down, especially on mobile.

## Scroll animations & backgrounds — how it works

- **Hero**: `css/style.css` → `.hero-bg` layers a directional dark scrim
  gradient over `assets/images/optimized/banner-image-5.jpg` (zoomed and
  panned per the image table above), and `background-attachment: fixed` on
  desktop (disabled — falls back to `scroll`, with different `background-size`/
  `-position` values — under 768px, since fixed backgrounds cause scroll jank
  on iOS/Android and, separately, the desktop zoom's own math needs the wider
  aspect ratio desktop viewports actually have).
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
- **Staggered card cascade** (the about-stats boxes, gallery tiles and
  testimonial cards): each item carries a `.reveal-item` class baked in from
  the moment it's rendered — it does *not* get added right before revealing,
  because doing both back-to-back lets the browser's CSS transition
  "reversal shortening" collapse the animation to near-zero duration.
  `staggerReveal()` in `js/main.js` sets an incrementing `transition-delay`
  per item, then adds `.in-view`, producing a cards-pop-in-one-after-another
  effect — inspired by the cascading icon/card grids on
  [kuruvaislandresort.com](https://kuruvaislandresort.com/), which use
  WOW.js + animate.css with the same incremental-delay approach.
- **Services menu motion** is separate from the above and lives in
  `animatePanelIn()`: service cards rise and fade in with a stagger
  (`--svc-stagger`, capped by `--svc-stagger-total`), and switching main
  category slides the panel in from the side the tab sits on. Durations,
  easing and travel are the `--svc-*` variables on `.services` in
  `css/style.css`. Both sliding indicators (pill + sidebar) move with
  `transform` only.
- **Hover lift**: testimonial cards and the about-stats boxes lift slightly
  on hover (`transform: translateY(-6px)`), matching the interactive card
  feel of the reference site.

## Notes

- The Services menu is documented in its own section above. Accessibility
  notes: the category pills are a real tablist (`role="tablist"/"tab"`,
  `aria-selected`, roving `tabindex`, Left/Right/Home/End), the rail items
  are buttons carrying `aria-current` with Up/Down/Home/End, result counts
  are announced through an `aria-live="polite"` region, and the panel holds
  its measured height across a swap so nothing jumps. Deep links
  (`#hair/hair-style`) are written on interaction and restored on reload;
  plain anchors like `#services` are left alone.
- The in-panel search filters the **current category** in both languages,
  hides non-matching subcategories from the rail, and jumps to the first
  subcategory that still has a match.
- Each category no longer has its own background photo behind the menu (a
  previous design) — those photos (`hair-2.jpg`, `waxing.jpg`, `skin.jpg`,
  etc.) are still in active use via the **Gallery** grid, just not here.
- A WhatsApp floating button is pinned to the corner on every section for
  one-tap booking.
- Basic SEO meta tags (title, description in both languages, Open Graph) are
  already in place in `index.html` — update the description/OG image once
  real branding assets are in place.
