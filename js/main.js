/* =========================================================================
   Najla Chicago Salon — site behavior
   Language toggle + RTL switch, the Services menu (category pills →
   subcategory rail → service cards, with search, deep links and the
   optional "Build your visit" mode), dynamic rendering of
   stats/gallery/testimonials/hours, nav + WhatsApp FAB.
   ========================================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     CONFIG — edit these placeholders when real business details arrive
     --------------------------------------------------------------------- */
  const CONFIG = {
    whatsappNumber: "971555965577", // primary — digits only, used for Book Now / hero / FAB / WhatsApp icon
    whatsappNumberSecondary: "971529527752", // shown as a second contact line, also click-to-WhatsApp
    whatsappDefaultMessage: {
      en: "Hi Najla Chicago Salon! I'd like to book an appointment.",
      ar: "مرحبًا صالون نجلاء شيكاغو! أرغب في حجز موعد."
    },
    instagramUrl: "https://instagram.com/",
    // Local photos only — no external placeholder services. Add/remove
    // entries here as real photos are swapped in under assets/images/.
    galleryImages: [
      { file: "hair-image.jpg", alt: { en: "Stylist finishing a client's hair", ar: "أخصائية تنهي تصفيف شعر العميلة" } },
      { file: "hair-2.jpg", alt: { en: "Hair wash at the basin", ar: "غسيل الشعر" } },
      { file: "hair-gallery.jpg", alt: { en: "Trimming freshly highlighted hair", ar: "تقليم الشعر المصبوغ حديثًا" } },
      { file: "skin.jpg", alt: { en: "Facial skin treatment", ar: "علاج البشرة" } },
      { file: "nail-salon-1.jpg", alt: { en: "Manicure finish", ar: "لمسة نهائية للمانيكير" } },
      { file: "nail-salon-2.jpg", alt: { en: "Nail polish colour selection", ar: "اختيار ألوان طلاء الأظافر" } },
      { file: "nail-salon-3.jpg", alt: { en: "Nail polish application", ar: "تطبيق طلاء الأظافر" } },
      { file: "massage-1.jpg", alt: { en: "Hot stone massage treatment", ar: "علاج مساج بالأحجار الساخنة" } },
      { file: "eyelash-eyebrow.jpg", alt: { en: "Eyelash extension application", ar: "تركيب رموش صناعية" } },
      { file: "threading-gallery.jpg", alt: { en: "Eyebrow threading", ar: "خيط الحواجب" } },
      { file: "waxing.jpg", alt: { en: "Facial treatment in progress", ar: "جلسة علاج للوجه" } },
      { file: "waxing-gallery.jpg", alt: { en: "Leg waxing treatment", ar: "إزالة شعر الساق بالشمع" } },
      { file: "henna.jpg", alt: { en: "Bridal henna design", ar: "نقش حناء للعروس" } },
      { file: "henna-gallery.jpg", alt: { en: "Intricate bridal henna on the palm", ar: "نقش حناء عروس دقيق على الكف" } },
      { file: "henna-gallery-2.jpg", alt: { en: "Applying henna by hand", ar: "تطبيق الحناء يدويًا" } },
      { file: "equipment-gallery.jpg", alt: { en: "Our professional styling tools", ar: "أدواتنا الاحترافية للتصفيف" } }
    ]
  };

  const STORAGE_KEY = "najla-lang";
  let currentLang = localStorage.getItem(STORAGE_KEY) || "en";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Reads a numeric CSS custom property (e.g. "50ms" / "32px") so the JS
  // stagger math stays in sync with whatever's tuned in style.css.
  function getCssNumber(varName, fallback) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : fallback;
  }

  /* ---------------------------------------------------------------------
     i18n helpers
     --------------------------------------------------------------------- */
  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  function applyStaticTranslations() {
    const dict = UI[currentLang];
    document.title = currentLang === "ar"
      ? "صالون نجلاء شيكاغو | بشرة، شعر، مكياج وأظافر"
      : "Najla Chicago Salon | Skin, Hair, MakeUp & Nails";

    $$("[data-i18n]").forEach((el) => {
      const value = getPath(dict, el.getAttribute("data-i18n"));
      if (value !== null) el.innerHTML = value;
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const value = getPath(dict, el.getAttribute("data-i18n-placeholder"));
      if (value !== null) el.setAttribute("placeholder", value);
    });

    $$("[data-i18n-aria-label]").forEach((el) => {
      const value = getPath(dict, el.getAttribute("data-i18n-aria-label"));
      if (value !== null) el.setAttribute("aria-label", value);
    });

    $("#langToggleLabel").textContent = dict.langToggle;
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", UI[lang].dir);

    applyStaticTranslations();
    renderAboutStats();
    renderServices();
    renderGallery();
    renderTestimonials();
    renderHours();
    updateBookingLinks();
    renderSocialIcons();

    // Re-rendering the sections above replaces their cards/tiles with fresh
    // DOM nodes that start hidden (see staggerReveal's comment). Any section
    // currently on-screen won't get a fresh IntersectionObserver trigger
    // (its visibility isn't changing), so it needs an immediate reveal here
    // — otherwise switching language while looking at e.g. the gallery
    // leaves the new images invisible.
    revealStaggerGroupsIfVisible();
  }

  /* ---------------------------------------------------------------------
     WhatsApp / booking links
     --------------------------------------------------------------------- */
  function buildWhatsAppLink(number) {
    const msg = encodeURIComponent(CONFIG.whatsappDefaultMessage[currentLang]);
    return `https://wa.me/${number || CONFIG.whatsappNumber}?text=${msg}`;
  }

  function formatPhone(number) {
    return "+" + number.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  }

  function updateBookingLinks() {
    const link = buildWhatsAppLink();
    ["bookNowBtn", "heroBookBtn", "whatsappFab"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute("href", link);
    });

    const callFab = $("#callFab");
    if (callFab) callFab.setAttribute("href", `tel:+${CONFIG.whatsappNumber}`);

    const numbers = [CONFIG.whatsappNumber, CONFIG.whatsappNumberSecondary];
    const phoneLinesHtml = numbers
      .map((n) => `<a href="${buildWhatsAppLink(n)}" target="_blank" rel="noopener" class="phone-link">${formatPhone(n)}</a>`)
      .join("<br>");

    const phoneDisplay = $("#contactPhoneDisplay");
    if (phoneDisplay) phoneDisplay.innerHTML = phoneLinesHtml;
    const footerPhone = $("#footerPhone");
    if (footerPhone) footerPhone.innerHTML = phoneLinesHtml;
  }

  function renderSocialIcons() {
    $$('.social-whatsapp').forEach((a) => a.setAttribute("href", buildWhatsAppLink()));
    $$('.social-instagram').forEach((a) => a.setAttribute("href", CONFIG.instagramUrl));

    const footerTarget = $("#footerSocialIcons");
    if (footerTarget && !footerTarget.dataset.built) {
      footerTarget.dataset.built = "1";
      footerTarget.innerHTML = `
        <a href="${buildWhatsAppLink()}" target="_blank" rel="noopener" aria-label="WhatsApp" class="social-icon social-whatsapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.464 3.484 1.345 5.001L2 22l5.126-1.345a9.958 9.958 0 004.878 1.242h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.069a9.93 9.93 0 00-7.073-2.928zm0 18.166h-.003a8.15 8.15 0 01-4.153-1.137l-.298-.177-3.043.799.812-2.967-.194-.304a8.156 8.156 0 01-1.253-4.36c0-4.511 3.671-8.181 8.185-8.181a8.13 8.13 0 015.789 2.398 8.129 8.129 0 012.396 5.792c-.001 4.512-3.672 8.182-8.184 8.182z"/></svg>
        </a>
        <a href="${CONFIG.instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram" class="social-icon social-instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
        </a>`;
    }
  }

  /* ---------------------------------------------------------------------
     About stats
     --------------------------------------------------------------------- */
  function renderAboutStats() {
    const container = $("#aboutStats");
    if (!container) return;
    const stats = UI[currentLang].about.stats;
    container.innerHTML = stats.map((s) => `
      <div class="stat-box reveal-item">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>`).join("");
  }

  /* ---------------------------------------------------------------------
     Services menu
     Category pills (a real tablist) → subcategory rail (vertical sidebar
     on desktop, horizontal chip row on mobile) → a panel of service
     cards. Everything renders from SERVICES_DATA + SERVICES_CONFIG in
     js/services-data.js.

     Only the active category's rail and the active subcategory's cards
     are in the DOM at any time — switching re-renders rather than
     toggling 231 hidden cards. The panel keeps its measured height across
     a swap so nothing on the page jumps.
     --------------------------------------------------------------------- */
  let activeCategoryId = SERVICES_DATA[0].id;
  let activeSubSlug = null;
  let servicesQuery = "";
  let hashTouched = false; // only start writing the URL hash after a real interaction

  function svcText(key, vars) {
    let out = UI[currentLang].services[key];
    if (typeof out !== "string") return "";
    if (vars) {
      Object.keys(vars).forEach((k) => {
        out = out.split("{" + k + "}").join(vars[k]);
      });
    }
    return out;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[‘’']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function isAddOnName(name) {
    return /^add\s*on|^إضافة/i.test(String(name).trim());
  }

  /* Annotates SERVICES_DATA in place with stable slugs/ids, the add-on
     flag and a lowercased search haystack. Runs once, before first paint.
     Slugs come from the English name unless the data sets an explicit
     `id`, and collisions within the same scope get a numeric suffix so
     deep links stay unique. */
  function indexServices() {
    SERVICES_DATA.forEach((cat) => {
      const usedSlugs = {};
      cat.subcategories.forEach((sub) => {
        let slug = sub.slug || slugify(sub.name.en);
        if (usedSlugs[slug]) slug += "-" + (++usedSlugs[slug]);
        else usedSlugs[slug] = 1;
        sub.slug = slug;

        const usedIds = {};
        sub.items.forEach((item) => {
          let id = item.id || slugify(item.en);
          if (usedIds[id]) id += "-" + (++usedIds[id]);
          else usedIds[id] = 1;
          item.id = id;
          item.uid = cat.id + "/" + sub.slug + "/" + id;
          if (typeof item.isAddOn !== "boolean") item.isAddOn = isAddOnName(item.en);
          item.search = (item.en + " " + item.ar).toLowerCase();
        });
      });
    });
  }

  function getCategory(id) {
    return SERVICES_DATA.find((c) => c.id === id) || SERVICES_DATA[0];
  }

  function getSubcategory(cat, slug) {
    return cat.subcategories.find((s) => s.slug === slug) || cat.subcategories[0];
  }

  function matchedItems(sub) {
    if (!servicesQuery) return sub.items;
    return sub.items.filter((item) => item.search.indexOf(servicesQuery) !== -1);
  }

  function countLabel(n) {
    return n + " " + svcText(n === 1 ? "itemsCountOne" : "itemsCount");
  }

  /* Both of these return "" when the underlying data isn't there, and the
     templates below drop the element entirely rather than render a blank
     or an "undefined". */
  function formatPrice(item) {
    if (!SERVICES_CONFIG.showPrices) return "";
    const raw = item.price;
    if (raw === undefined || raw === null || raw === "") return "";
    const currency = SERVICES_CONFIG.currency[currentLang] || SERVICES_CONFIG.currency.en;
    const amount = currentLang === "ar" ? raw + " " + currency : currency + " " + raw;
    return item.priceFrom ? svcText("priceFrom", { price: amount }) : amount;
  }

  function formatDuration(item) {
    if (!SERVICES_CONFIG.showDurations) return "";
    const mins = item.durationMinutes;
    if (typeof mins !== "number" || !isFinite(mins) || mins <= 0) return "";
    return svcText("minutes", { n: mins });
  }

  function bookServiceLink(name) {
    return "https://wa.me/" + CONFIG.whatsappNumber +
      "?text=" + encodeURIComponent(svcText("bookMessage", { name: name }));
  }

  /* Category icons, keyed by the `icon` field already on each category in
     services-data.js. Stroke-based to match the icons used in the hero. */
  const SERVICE_ICONS = {
    hair: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M20 5 8.5 13M20 19 8.5 11" stroke-linecap="round"/>',
    waxing: '<path d="M5.4 18.6 15 9" stroke-linecap="round"/><path d="M14.2 5.6a3.6 3.6 0 1 1 5.1 5.1l-2 2-5.1-5.1 2-2Z" stroke-linejoin="round"/>',
    skin: '<circle cx="12" cy="12" r="8.2"/><path d="M9.2 10.2h.01M14.8 10.2h.01" stroke-linecap="round" stroke-width="2.2"/><path d="M9 14.6c1.8 1.4 4.2 1.4 6 0" stroke-linecap="round"/>',
    nails: '<path d="M9.2 3h5.6v3.8l1.4 2.4V19a2 2 0 0 1-2 2h-4.4a2 2 0 0 1-2-2V9.2l1.4-2.4V3Z" stroke-linejoin="round"/><path d="M7.8 12.4h8.4" stroke-linecap="round"/>',
    lash: '<path d="M2.6 12s3.6-5.6 9.4-5.6S21.4 12 21.4 12s-3.6 5.6-9.4 5.6S2.6 12 2.6 12Z" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.6"/>',
    massage: '<ellipse cx="12" cy="16.4" rx="7.4" ry="3.2"/><ellipse cx="12" cy="8.6" rx="5.4" ry="2.8"/>',
    bath: '<path d="M3.6 12.4h16.8V15a5 5 0 0 1-5 5H8.6a5 5 0 0 1-5-5v-2.6Z" stroke-linejoin="round"/><path d="M7.4 12.4V6.6a2.2 2.2 0 0 1 4.4 0" stroke-linecap="round"/>',
    henna: '<circle cx="12" cy="12" r="2.7"/><circle cx="12" cy="5.2" r="1.8"/><circle cx="12" cy="18.8" r="1.8"/><circle cx="5.2" cy="12" r="1.8"/><circle cx="18.8" cy="12" r="1.8"/>'
  };

  function iconSvg(cat, size) {
    const paths = SERVICE_ICONS[cat.icon];
    if (!paths) return "";
    const s = size || 20;
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${paths}</svg>`;
  }

  /* ---------------------------------------------------------------------
     Services — templates
     --------------------------------------------------------------------- */
  /* Laid out as a row — icon, then the text column, then the action — so a
     service that only has a name (most of them, until durations and
     descriptions are filled in) still reads as one solid block instead of
     a name stranded at the top and a button stranded at the bottom. */
  function serviceCardHtml(item, sub, cat) {
    const name = item[currentLang];
    const desc = item.description ? item.description[currentLang] : "";
    const meta = [formatDuration(item), formatPrice(item)].filter(Boolean);
    const parentName = item.addOnFor ? item.addOnFor[currentLang] : sub.name[currentLang];
    const tags = [];
    if (item.isAddOn) tags.push(`<span class="svc-tag svc-tag-addon">${svcText("addOn")}</span>`);
    else if (item.popular) tags.push(`<span class="svc-tag svc-tag-popular">${svcText("popularTag")}</span>`);

    const added = isInVisit(item.uid);
    const action = SERVICES_CONFIG.bookingMode
      ? `<button type="button" class="svc-action svc-add${added ? " is-added" : ""}" data-uid="${escapeHtml(item.uid)}" aria-pressed="${added}">${added ? svcText("added") : svcText("add")}</button>`
      : `<a class="svc-action svc-book" href="${escapeHtml(bookServiceLink(name))}" target="_blank" rel="noopener" aria-label="${escapeHtml(svcText("bookAria", { name: name }))}">${svcText("book")}</a>`;

    return `
      <article class="svc-card${item.isAddOn ? " is-addon" : ""}">
        <span class="svc-card-icon" aria-hidden="true">${iconSvg(cat, 22)}</span>
        <div class="svc-card-main">
          ${tags.length ? `<div class="svc-card-tags">${tags.join("")}</div>` : ""}
          <h4 class="svc-card-name">${name}</h4>
          ${item.isAddOn ? `<p class="svc-card-parent">${svcText("addOnFor", { name: parentName })}</p>` : ""}
          ${desc ? `<p class="svc-card-desc">${desc}</p>` : ""}
          ${meta.length ? `<p class="svc-card-meta">${meta.map((m) => `<span>${m}</span>`).join("")}</p>` : ""}
        </div>
        ${action}
      </article>`;
  }

  /* Soft card that keeps a short subcategory from ending in dead space.
     Configurable via SERVICES_CONFIG.helperCard; never shown while a
     search is narrowing the list. */
  function helperCardHtml(sub, visibleCount) {
    const cfg = SERVICES_CONFIG.helperCard || {};
    if (!cfg.enabled || servicesQuery) return "";
    if (visibleCount >= (cfg.minServices || 0)) return "";

    if (cfg.type === "popular") {
      const popular = sub.items.filter((item) => item.popular);
      if (!popular.length) return "";
      return `
        <aside class="svc-helper">
          <h4 class="svc-helper-title">${svcText("popularTitle")}</h4>
          <ul class="svc-helper-list">
            ${popular.map((item) => `<li>${item[currentLang]}</li>`).join("")}
          </ul>
        </aside>`;
    }

    return `
      <aside class="svc-helper">
        <h4 class="svc-helper-title">${svcText("helpTitle")}</h4>
        <p class="svc-helper-text">${svcText("helpText")}</p>
        <a class="svc-helper-cta" href="${escapeHtml(buildWhatsAppLink())}" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.762.464 3.484 1.345 5.001L2 22l5.126-1.345a9.958 9.958 0 004.878 1.242h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.67-1.04-5.18-2.928-7.069a9.93 9.93 0 00-7.073-2.928zm0 18.166h-.003a8.15 8.15 0 01-4.153-1.137l-.298-.177-3.043.799.812-2.967-.194-.304a8.156 8.156 0 01-1.253-4.36c0-4.511 3.671-8.181 8.185-8.181a8.13 8.13 0 015.789 2.398 8.129 8.129 0 012.396 5.792c-.001 4.512-3.672 8.182-8.184 8.182z"/></svg>
          ${svcText("helpCta")}
        </a>
      </aside>`;
  }

  /* ---------------------------------------------------------------------
     Services — rendering
     --------------------------------------------------------------------- */
  function renderCategoryPills() {
    const tabsEl = $("#servicesTabs");
    if (!tabsEl) return;

    tabsEl.innerHTML = `<span class="tab-indicator" id="tabIndicator" aria-hidden="true"></span>` +
      SERVICES_DATA.map((cat) => {
        const on = cat.id === activeCategoryId;
        return `
        <button type="button" role="tab" id="svctab-${cat.id}" class="services-tab${on ? " active" : ""}"
                data-cat="${cat.id}" aria-selected="${on}" aria-controls="servicesPanel" tabindex="${on ? 0 : -1}">
          ${cat.name[currentLang]}
        </button>`;
      }).join("");

    indicatorReady = false;
    positionTabIndicator($(".services-tab.active"));
  }

  function renderRail() {
    const rail = $("#servicesRail");
    if (!rail) return;
    const cat = getCategory(activeCategoryId);

    // Four of the eight categories have a single subcategory; a one-item
    // rail earns nothing but a dead column, so the panel takes the width.
    const menu = $("#servicesMenu");
    if (menu) menu.classList.toggle("is-single", cat.subcategories.length < 2);

    rail.innerHTML = `<span class="rail-indicator" id="railIndicator" aria-hidden="true"></span>` +
      cat.subcategories.map((sub) => {
        const count = matchedItems(sub).length;
        const on = sub.slug === activeSubSlug;
        const hidden = servicesQuery && count === 0;
        return `
        <button type="button" class="rail-item${on ? " active" : ""}" data-sub="${sub.slug}"
                aria-current="${on ? "true" : "false"}"${hidden ? " hidden" : ""}>
          <span class="rail-item-name">${sub.name[currentLang]}</span>
          <span class="rail-item-count">${count}</span>
        </button>`;
      }).join("");

    railIndicatorReady = false;
    positionRailIndicator($(".rail-item.active"));
  }

  function renderPanel(options) {
    const opts = options || {};
    const body = $("#svcPanelBody");
    const panel = $("#servicesPanel");
    if (!body || !panel) return;

    const cat = getCategory(activeCategoryId);
    const sub = getSubcategory(cat, activeSubSlug);
    const items = matchedItems(sub);
    const main = items.filter((item) => !item.isAddOn);
    const addOns = items.filter((item) => item.isAddOn);

    const titleEl = $("#svcPanelTitle");
    const countEl = $("#svcPanelCount");
    const iconEl = $("#svcPanelIcon");
    if (titleEl) titleEl.textContent = sub.name[currentLang];
    if (countEl) countEl.textContent = items.length ? countLabel(items.length) : "";
    if (iconEl) iconEl.innerHTML = iconSvg(cat, 24);
    // Each category's own photo as the backdrop for the whole panel — head
    // and body both sit on it, with cards turning translucent (.has-photo,
    // in css/style.css) so the photo shows through around and behind them.
    // Same light dark-overlay wash the Services banner already uses
    // elsewhere; var(--overlay-dir) flips for RTL automatically.
    if (cat.image) {
      panel.style.backgroundImage =
        `linear-gradient(var(--overlay-dir), var(--overlay-light-from), var(--overlay-light-to)), url('assets/images/optimized/${cat.image}')`;
      panel.classList.add("has-photo");
    } else {
      panel.style.backgroundImage = "";
      panel.classList.remove("has-photo");
    }
    panel.setAttribute("aria-labelledby", "svctab-" + cat.id);

    // The panel has a fixed height (see css) with the body scrolling
    // inside it, so — unlike a height that used to change with content —
    // there's no longer a page-level layout jump to guard against when
    // switching between a short and a long subcategory.

    if (!items.length) {
      body.innerHTML = `<p class="svc-empty">${svcText("noResults")}</p>`;
    } else {
      body.innerHTML = `
        ${main.length ? `<div class="svc-grid">${main.map((item) => serviceCardHtml(item, sub, cat)).join("")}</div>` : ""}
        ${addOns.length ? `
          <section class="svc-addons">
            <h4 class="svc-addons-title">${svcText("addOnsHeading")}</h4>
            <div class="svc-grid">${addOns.map((item) => serviceCardHtml(item, sub, cat)).join("")}</div>
          </section>` : ""}
        ${helperCardHtml(sub, items.length)}`;
    }

    // A subcategory switch should always land at the top of the scrollable
    // body, not wherever the previous, unrelated list happened to leave
    // the scroll position.
    body.scrollTop = 0;

    animatePanelIn(body, opts.direction || 0, opts.animate !== false);
    announceResults(sub, items.length);
    // rAF: scrollHeight isn't reliable until the new content has laid out.
    requestAnimationFrame(updatePanelFade);
  }

  // Shows the bottom fade only while there's actually more to scroll to —
  // hidden for a list that fits, and once scrolled to the end.
  function updatePanelFade() {
    const body = $("#svcPanelBody");
    const fade = $("#svcPanelFade");
    if (!body || !fade) return;
    const scrollable = body.scrollHeight - body.clientHeight > 2;
    const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 2;
    fade.classList.toggle("is-visible", scrollable && !atBottom);
  }

  function renderServices() {
    const cat = getCategory(activeCategoryId);
    activeCategoryId = cat.id;
    if (!activeSubSlug || !cat.subcategories.some((s) => s.slug === activeSubSlug)) {
      activeSubSlug = cat.subcategories[0].slug;
    }
    renderCategoryPills();
    renderRail();
    renderPanel({ animate: false });
    renderVisitSummary();
  }

  function announceResults(sub, count) {
    const live = $("#servicesLive");
    if (!live) return;
    live.textContent = count
      ? svcText("resultsAnnounced", { n: count, name: sub.name[currentLang] })
      : svcText("noResults");
  }

  /* ---------------------------------------------------------------------
     Services — motion (transform/opacity only, all tunable from CSS vars)
     --------------------------------------------------------------------- */
  function animatePanelIn(body, direction, animate) {
    const cards = $$(".svc-card, .svc-helper", body);
    if (!animate || prefersReducedMotion()) {
      body.classList.remove("is-entering");
      body.style.removeProperty("--svc-dir");
      cards.forEach((card) => card.classList.add("is-in"));
      return;
    }

    body.style.setProperty("--svc-dir", direction);
    body.classList.remove("is-entering");
    void body.offsetWidth; // commit the removal before re-adding
    body.classList.add("is-entering");

    const step = getCssNumber("--svc-stagger", 50);
    const total = getCssNumber("--svc-stagger-total", 400);
    const perItem = cards.length > 1 ? Math.min(step, total / (cards.length - 1)) : 0;
    cards.forEach((card, i) => {
      card.style.transitionDelay = Math.round(i * perItem) + "ms";
    });

    requestAnimationFrame(() => {
      cards.forEach((card) => card.classList.add("is-in"));
    });

    const settle = Math.round((cards.length - 1) * perItem) + getCssNumber("--svc-duration", 320) + 80;
    setTimeout(() => {
      cards.forEach((card) => { card.style.transitionDelay = ""; });
      body.classList.remove("is-entering");
    }, settle);
  }

  /* ---------------------------------------------------------------------
     Services — sliding indicators
     Both are measured against the real button they sit behind and moved
     with transform only; width/height are assigned directly rather than
     transitioned, since animating those is what actually costs layout on
     cheap phones.
     --------------------------------------------------------------------- */
  let indicatorReady = false;
  let railIndicatorReady = false;

  function positionIndicator(container, indicator, target, readyFlag) {
    if (!container || !indicator || !target) return readyFlag;
    const box = container.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    const x = rect.left - box.left + container.scrollLeft;
    const y = rect.top - box.top + container.scrollTop;

    indicator.style.width = rect.width + "px";
    indicator.style.height = rect.height + "px";

    if (!readyFlag) {
      indicator.classList.add("no-anim");
      indicator.style.transform = `translate(${x}px, ${y}px)`;
      void indicator.offsetWidth;
      indicator.classList.remove("no-anim");
      return true;
    }
    indicator.style.transform = `translate(${x}px, ${y}px)`;
    return true;
  }

  function positionTabIndicator(target) {
    indicatorReady = positionIndicator($("#servicesTabs"), $("#tabIndicator"), target, indicatorReady);
  }

  function positionRailIndicator(target) {
    railIndicatorReady = positionIndicator($("#servicesRail"), $("#railIndicator"), target, railIndicatorReady);
  }

  // Scrolls a horizontally scrollable rail so the active item is centered,
  // without ever scrolling the page itself.
  function scrollItemIntoView(container, item) {
    if (!container || !item) return;
    if (container.scrollWidth <= container.clientWidth) return;
    const target = item.offsetLeft - (container.clientWidth - item.offsetWidth) / 2;
    const left = Math.max(0, Math.min(target, container.scrollWidth - container.clientWidth));
    if (typeof container.scrollTo === "function") {
      container.scrollTo({ left: left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    } else {
      container.scrollLeft = left;
    }
  }

  /* ---------------------------------------------------------------------
     Services — switching
     --------------------------------------------------------------------- */
  function switchCategory(newId, opts) {
    const options = opts || {};
    if (!newId || newId === activeCategoryId) return;
    const oldIndex = SERVICES_DATA.findIndex((c) => c.id === activeCategoryId);
    const newIndex = SERVICES_DATA.findIndex((c) => c.id === newId);
    if (newIndex === -1) return;

    activeCategoryId = newId;
    const cat = getCategory(newId);
    activeSubSlug = options.subSlug && cat.subcategories.some((s) => s.slug === options.subSlug)
      ? options.subSlug
      : cat.subcategories[0].slug;

    const rtl = document.documentElement.getAttribute("dir") === "rtl";
    const direction = (newIndex >= oldIndex ? 1 : -1) * (rtl ? -1 : 1);

    updatePillsUI();
    renderRail();
    renderPanel({ direction: direction });
    if (options.fromUser !== false) markHashDirty();
  }

  function switchSubcategory(slug, opts) {
    const options = opts || {};
    const cat = getCategory(activeCategoryId);
    if (!slug || !cat.subcategories.some((s) => s.slug === slug)) return;
    if (slug === activeSubSlug && options.force !== true) return;

    activeSubSlug = slug;
    updateRailUI();
    renderPanel({ direction: 0, animate: options.animate !== false });
    if (options.fromUser !== false) markHashDirty();
  }

  function updatePillsUI() {
    const tabs = $$(".services-tab");
    tabs.forEach((btn) => {
      const on = btn.getAttribute("data-cat") === activeCategoryId;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on);
      btn.setAttribute("tabindex", on ? "0" : "-1");
      if (on) {
        positionTabIndicator(btn);
        scrollItemIntoView($("#servicesTabs"), btn);
      }
    });
  }

  function updateRailUI() {
    $$(".rail-item").forEach((btn) => {
      const on = btn.getAttribute("data-sub") === activeSubSlug;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-current", on ? "true" : "false");
      if (on) {
        positionRailIndicator(btn);
        scrollItemIntoView($("#servicesRail"), btn);
      }
    });
  }

  /* ---------------------------------------------------------------------
     Services — search, scoped to the active category
     --------------------------------------------------------------------- */
  function applyServicesSearch(value) {
    servicesQuery = (value || "").trim().toLowerCase();
    const clearBtn = $("#serviceSearchClear");
    if (clearBtn) clearBtn.hidden = !servicesQuery;

    const cat = getCategory(activeCategoryId);
    // If the open subcategory has nothing left, move to the first one that does.
    if (servicesQuery) {
      const current = getSubcategory(cat, activeSubSlug);
      if (!matchedItems(current).length) {
        const firstHit = cat.subcategories.find((sub) => matchedItems(sub).length);
        if (firstHit) activeSubSlug = firstHit.slug;
      }
    }

    renderRail();
    renderPanel({ direction: 0, animate: false });
  }

  /* ---------------------------------------------------------------------
     Services — deep links (#category/subcategory), restored on reload
     --------------------------------------------------------------------- */
  function parseServicesHash() {
    const raw = (location.hash || "").replace(/^#/, "");
    if (!raw || raw.indexOf("/") === -1) return null; // plain #services, #about … aren't ours
    const parts = raw.split("/");
    const cat = SERVICES_DATA.find((c) => c.id === parts[0]);
    if (!cat) return null;
    const sub = cat.subcategories.find((s) => s.slug === parts[1]);
    return { categoryId: cat.id, subSlug: sub ? sub.slug : cat.subcategories[0].slug };
  }

  function markHashDirty() {
    hashTouched = true;
    writeServicesHash();
  }

  function writeServicesHash() {
    if (!hashTouched) return;
    const hash = "#" + activeCategoryId + "/" + activeSubSlug;
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }

  function applyServicesHash(opts) {
    const state = parseServicesHash();
    if (!state) return false;
    activeCategoryId = state.categoryId;
    activeSubSlug = state.subSlug;
    hashTouched = true;
    renderServices();
    if (opts && opts.scroll) {
      const section = $("#services");
      if (section) section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
    return true;
  }

  /* ---------------------------------------------------------------------
     Services — "Build your visit" (SERVICES_CONFIG.bookingMode)
     Off by default. Adds an Add button per card and a running summary:
     a sticky bar on mobile, a side panel on desktop, handing off to
     WhatsApp with the selection pre-filled.
     --------------------------------------------------------------------- */
  const visitItems = [];

  function isInVisit(uid) {
    return visitItems.some((entry) => entry.uid === uid);
  }

  function findServiceByUid(uid) {
    for (const cat of SERVICES_DATA) {
      for (const sub of cat.subcategories) {
        const hit = sub.items.find((item) => item.uid === uid);
        if (hit) return hit;
      }
    }
    return null;
  }

  function toggleVisitItem(uid) {
    const index = visitItems.findIndex((entry) => entry.uid === uid);
    if (index > -1) visitItems.splice(index, 1);
    else {
      const item = findServiceByUid(uid);
      if (item) visitItems.push({ uid: uid, item: item });
    }
    $$(`.svc-add[data-uid="${uid}"]`).forEach((btn) => {
      const added = isInVisit(uid);
      btn.classList.toggle("is-added", added);
      btn.setAttribute("aria-pressed", added);
      btn.textContent = added ? svcText("added") : svcText("add");
    });
    renderVisitSummary();
  }

  function visitTotals() {
    let minutes = 0;
    let price = 0;
    let allTimed = visitItems.length > 0;
    let allPriced = visitItems.length > 0;

    visitItems.forEach(({ item }) => {
      if (typeof item.durationMinutes === "number" && isFinite(item.durationMinutes)) minutes += item.durationMinutes;
      else allTimed = false;
      const numeric = typeof item.price === "number" ? item.price : parseFloat(item.price);
      if (isFinite(numeric) && String(item.price).match(/^\d+(\.\d+)?$/)) price += numeric;
      else allPriced = false;
    });

    return {
      minutes: allTimed ? minutes : null,
      price: allPriced && SERVICES_CONFIG.showPrices ? price : null
    };
  }

  function visitWhatsAppLink() {
    const lines = visitItems.map(({ item }) => "• " + item[currentLang]);
    const message = svcText("visitMessage") + "\n" + lines.join("\n");
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function renderVisitSummary() {
    const box = $("#visitSummary");
    if (!box) return;
    if (!SERVICES_CONFIG.bookingMode) {
      box.hidden = true;
      box.innerHTML = "";
      document.body.classList.remove("has-visit-summary");
      return;
    }

    document.body.classList.add("has-visit-summary");
    box.hidden = false;
    const totals = visitTotals();
    const rows = [];
    if (totals.minutes !== null) rows.push(`<p class="visit-total"><span>${svcText("visitTotalTime")}</span><strong>${svcText("minutes", { n: totals.minutes })}</strong></p>`);
    if (totals.price !== null) {
      const currency = SERVICES_CONFIG.currency[currentLang] || SERVICES_CONFIG.currency.en;
      const amount = currentLang === "ar" ? totals.price + " " + currency : currency + " " + totals.price;
      rows.push(`<p class="visit-total"><span>${svcText("visitTotalPrice")}</span><strong>${amount}</strong></p>`);
    }

    box.innerHTML = `
      <div class="visit-head">
        <h4 class="visit-title">${svcText("visitTitle")}</h4>
        ${visitItems.length ? `<span class="visit-count">${svcText("visitCount", { n: visitItems.length })}</span>` : ""}
      </div>
      ${visitItems.length ? `
        <ul class="visit-list">
          ${visitItems.map(({ uid, item }) => `
            <li class="visit-row">
              <span>${item[currentLang]}</span>
              <button type="button" class="visit-remove" data-uid="${escapeHtml(uid)}" aria-label="${escapeHtml(svcText("removeAria", { name: item[currentLang] }))}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
              </button>
            </li>`).join("")}
        </ul>
        ${rows.join("")}
        <div class="visit-actions">
          <a class="visit-book" href="${escapeHtml(visitWhatsAppLink())}" target="_blank" rel="noopener">${svcText("visitBook")}</a>
          <button type="button" class="visit-clear" id="visitClear">${svcText("visitClear")}</button>
        </div>`
      : `<p class="visit-empty">${svcText("visitEmpty")}</p>`}`;
  }

  /* ---------------------------------------------------------------------
     Services — events
     Delegated from the stable containers, so a re-render never drops a
     listener.
     --------------------------------------------------------------------- */
  function initServicesMenu() {
    const tabsEl = $("#servicesTabs");
    const railEl = $("#servicesRail");
    const panelEl = $("#servicesPanel");
    const bodyEl = $("#svcPanelBody");
    const searchEl = $("#serviceSearch");
    const clearEl = $("#serviceSearchClear");
    const summaryEl = $("#visitSummary");

    if (bodyEl) {
      bodyEl.addEventListener("scroll", updatePanelFade, { passive: true });
    }

    if (tabsEl) {
      tabsEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".services-tab");
        if (btn) switchCategory(btn.getAttribute("data-cat"));
      });
      tabsEl.addEventListener("keydown", (e) => {
        if (["ArrowRight", "ArrowLeft", "Home", "End"].indexOf(e.key) === -1) return;
        const tabs = $$(".services-tab", tabsEl);
        const current = tabs.indexOf(document.activeElement);
        if (current === -1) return;
        e.preventDefault();
        const rtl = document.documentElement.getAttribute("dir") === "rtl";
        let next = current;
        if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        else {
          const forward = (e.key === "ArrowRight") !== rtl;
          next = forward ? Math.min(current + 1, tabs.length - 1) : Math.max(current - 1, 0);
        }
        if (tabs[next] && tabs[next] !== document.activeElement) {
          tabs[next].focus();
          switchCategory(tabs[next].getAttribute("data-cat"));
        }
      });
    }

    if (railEl) {
      railEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".rail-item");
        if (btn) switchSubcategory(btn.getAttribute("data-sub"));
      });
      railEl.addEventListener("keydown", (e) => {
        if (["ArrowDown", "ArrowUp", "Home", "End"].indexOf(e.key) === -1) return;
        const items = $$(".rail-item", railEl).filter((b) => !b.hidden);
        const current = items.indexOf(document.activeElement);
        if (current === -1) return;
        e.preventDefault();
        let next = current;
        if (e.key === "Home") next = 0;
        else if (e.key === "End") next = items.length - 1;
        else if (e.key === "ArrowDown") next = Math.min(current + 1, items.length - 1);
        else next = Math.max(current - 1, 0);
        if (items[next] && items[next] !== document.activeElement) {
          items[next].focus();
          switchSubcategory(items[next].getAttribute("data-sub"));
        }
      });
    }

    if (panelEl) {
      panelEl.addEventListener("click", (e) => {
        const addBtn = e.target.closest(".svc-add");
        if (addBtn) toggleVisitItem(addBtn.getAttribute("data-uid"));
      });
    }

    if (searchEl) {
      searchEl.addEventListener("input", (e) => applyServicesSearch(e.target.value));
    }
    if (clearEl) {
      clearEl.addEventListener("click", () => {
        if (searchEl) searchEl.value = "";
        applyServicesSearch("");
        if (searchEl) searchEl.focus();
      });
    }

    if (summaryEl) {
      summaryEl.addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".visit-remove");
        if (removeBtn) { toggleVisitItem(removeBtn.getAttribute("data-uid")); return; }
        if (e.target.closest("#visitClear")) {
          visitItems.length = 0;
          $$(".svc-add").forEach((btn) => {
            btn.classList.remove("is-added");
            btn.setAttribute("aria-pressed", "false");
            btn.textContent = svcText("add");
          });
          renderVisitSummary();
        }
      });
    }

    window.addEventListener("hashchange", () => applyServicesHash({ scroll: false }));

    // Both indicators are measured from live geometry, so anything that
    // reflows the bars has to re-measure them.
    let resizeRaf = null;
    window.addEventListener("resize", () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        positionTabIndicator($(".services-tab.active"));
        positionRailIndicator($(".rail-item.active"));
        updatePanelFade();
      });
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        positionTabIndicator($(".services-tab.active"));
        positionRailIndicator($(".rail-item.active"));
        updatePanelFade();
      });
    }
  }

  /* Swipe across the panel to move between categories, matching the
     click/keyboard paths. */
  function initServicesSwipe() {
    const panelEl = $("#servicesPanel");
    if (!panelEl) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let axis = null;

    panelEl.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
      axis = null;
    }, { passive: true });

    panelEl.addEventListener("touchmove", (e) => {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (axis === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        axis = Math.abs(dx) > Math.abs(dy) * 1.3 ? "h" : "v";
      }
      if (axis === "h" && e.cancelable) e.preventDefault();
    }, { passive: false });

    panelEl.addEventListener("touchend", (e) => {
      if (!tracking) return;
      tracking = false;
      if (axis !== "h") return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 48) return;
      const index = SERVICES_DATA.findIndex((c) => c.id === activeCategoryId);
      if (dx < 0 && index < SERVICES_DATA.length - 1) switchCategory(SERVICES_DATA[index + 1].id);
      else if (dx > 0 && index > 0) switchCategory(SERVICES_DATA[index - 1].id);
    });
    panelEl.addEventListener("touchcancel", () => { tracking = false; axis = null; });
  }

  /* ---------------------------------------------------------------------
     Gallery — real salon photos from assets/images/ only, no external
     placeholder service. Re-render on language switch so alt text follows
     the active language.
     --------------------------------------------------------------------- */
  function renderGallery() {
    const grid = $("#galleryGrid");
    if (!grid) return;
    grid.innerHTML = CONFIG.galleryImages.map((img) => {
      const src = `assets/images/optimized/${img.file}`;
      const alt = img.alt[currentLang];
      return `
        <a href="${src}" target="_blank" rel="noopener" aria-label="${alt}" class="reveal-item">
          <img src="${src}" alt="${alt}" loading="lazy">
        </a>`;
    }).join("");
  }

  /* ---------------------------------------------------------------------
     Testimonials
     --------------------------------------------------------------------- */
  function renderTestimonials() {
    const grid = $("#testimonialsGrid");
    if (!grid) return;
    grid.innerHTML = TESTIMONIALS.map((rev) => `
      <div class="testimonial-card reveal-item">
        <div class="testimonial-stars">${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}</div>
        <p class="testimonial-text">"${rev.text[currentLang]}"</p>
        <p class="testimonial-name">${rev.name[currentLang]}</p>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------------------------
     Opening hours
     --------------------------------------------------------------------- */
  function renderHours() {
    const table = $("#hoursTable");
    if (!table) return;
    const hours = UI[currentLang].contact.hours;
    table.innerHTML = hours.map((h) => `<tr><td>${h.day}</td><td>${h.time}</td></tr>`).join("");
  }

  /* ---------------------------------------------------------------------
     Header scroll state + mobile menu
     --------------------------------------------------------------------- */
  function initHeader() {
    const header = $("#siteHeader");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const hamburger = $("#hamburgerBtn");
    const nav = $("#mainNav");
    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open);
    });

    $$("#mainNav a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — fade-in/scale-in each .reveal element the first time
     it enters the viewport. Elements whose innerHTML is re-rendered on
     language switch (search box, tabs, panels, grids) keep their node
     identity, so this only needs to run once on load.
     --------------------------------------------------------------------- */
  function initScrollReveal() {
    const targets = $$(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    targets.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     Staggered card cascade — pops a group of elements in one after another
     (inspired by the cascading icon/card grids on kuruvaislandresort.com,
     which use WOW.js + animate.css with incremental per-item delays).
     Re-triggerable: calling it again (e.g. on a services tab switch)
     restarts the cascade for that group's current elements.

     Elements must already carry the "reveal-item" class from the moment
     they're inserted into the DOM (baked into the render templates), NOT
     added here right before "in-view". Adding the hidden state and the
     visible state back-to-back would just retarget a transition that has
     barely started — CSS's spec'd "reversal shortening" then completes it
     in only a few milliseconds instead of the full duration, so it would
     look like no animation played at all. Resting at the hidden state for
     a real stretch of time first (since render, or since the panel was
     last hidden) is what makes the reveal actually visible.
     --------------------------------------------------------------------- */
  function staggerReveal(elements, { step = 80 } = {}) {
    const list = Array.from(elements || []);
    if (!list.length) return;

    list.forEach((el, i) => {
      el.classList.remove("in-view");
      el.style.transitionDelay = i * step + "ms";
    });

    // Force a reflow so the removal above is committed before "in-view" is
    // re-added on the next frame.
    void list[0].offsetHeight;

    requestAnimationFrame(() => {
      list.forEach((el) => el.classList.add("in-view"));
    });
  }

  /* ---------------------------------------------------------------------
     Scroll-triggered stagger groups — the about stats, gallery tiles and
     testimonial cards cascade in when their grid scrolls into view. The
     Services panel cascade targets whichever tab is currently active, so
     it stays correct even after the user switches tabs.

     These grids get their innerHTML replaced on every language switch
     (see renderGallery/renderTestimonials/renderAboutStats/renderServices),
     which drops in fresh "reveal-item" nodes starting hidden. The
     observers below are intentionally never unobserved, so a section that
     gets re-rendered while off-screen still reveals correctly the next
     time it's scrolled into view. A section that's re-rendered while
     already on-screen won't get a fresh intersection event though (its
     visibility isn't changing) — that case is handled separately by
     revealStaggerGroupsIfVisible(), called right after setLanguage()
     re-renders everything.
     --------------------------------------------------------------------- */
  function getStaggerGroups() {
    return [
      { el: $("#aboutStats"), step: 100 },
      { el: $("#galleryGrid"), step: 70 },
      { el: $("#testimonialsGrid"), step: 120 }
    ].filter((g) => g.el);
  }

  function isInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  function revealStaggerGroupsIfVisible() {
    getStaggerGroups().forEach((g) => {
      if (isInViewport(g.el)) staggerReveal(g.el.children, { step: g.step });
    });

  }

  function initStaggerGroups() {
    const groups = getStaggerGroups();
    if (!groups.length) return;

    if (!("IntersectionObserver" in window)) {
      groups.forEach((g) => staggerReveal(g.el.children, { step: g.step }));
      return;
    }

    groups.forEach((g) => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) staggerReveal(entry.target.children, { step: g.step });
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      io.observe(g.el);
    });

    // The Services menu is deliberately not in this list — its cards run
    // their own entrance on every category/subcategory switch (see
    // animatePanelIn), and a second cascade on top of that reads as two
    // animations fighting each other.
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  function init() {
    $("#footerYear").textContent = new Date().getFullYear();

    $("#langToggle").addEventListener("click", () => {
      setLanguage(currentLang === "en" ? "ar" : "en");
    });

    indexServices();

    initHeader();
    setLanguage(currentLang);          // renders the menu for the first time
    applyServicesHash({ scroll: true }); // #hair/hair-style deep links
    initServicesMenu();
    initScrollReveal();
    initStaggerGroups();
    initServicesSwipe();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
