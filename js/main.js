/* =========================================================================
   Najla Chicago Salon — site behavior
   Language toggle + RTL switch, services tabs/accordion/search,
   dynamic rendering of stats/gallery/testimonials/hours, nav + WhatsApp FAB.
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
      { file: "banner-image.jpg", alt: { en: "Hair styling at Najla Chicago Salon", ar: "تصفيف الشعر في صالون نجلاء شيكاغو" } },
      { file: "hair-image.jpg", alt: { en: "Stylist finishing a client's hair", ar: "أخصائية تنهي تصفيف شعر العميلة" } },
      { file: "hair-2.jpg", alt: { en: "Hair wash at the basin", ar: "غسيل الشعر" } },
      { file: "skin.jpg", alt: { en: "Facial skin treatment", ar: "علاج البشرة" } },
      { file: "nail-salon-1.jpg", alt: { en: "Manicure finish", ar: "لمسة نهائية للمانيكير" } },
      { file: "nail-salon-2.jpg", alt: { en: "Nail polish colour selection", ar: "اختيار ألوان طلاء الأظافر" } },
      { file: "nail-salon-3.jpg", alt: { en: "Nail polish application", ar: "تطبيق طلاء الأظافر" } },
      { file: "massage-1.jpg", alt: { en: "Hot stone massage treatment", ar: "علاج مساج بالأحجار الساخنة" } },
      { file: "massage-2.jpg", alt: { en: "Relaxing massage session", ar: "جلسة مساج استرخاء" } },
      { file: "eyelash-eyebrow.jpg", alt: { en: "Eyelash extension application", ar: "تركيب رموش صناعية" } },
      { file: "henna.jpg", alt: { en: "Bridal henna design", ar: "نقش حناء للعروس" } },
      { file: "waxing.jpg", alt: { en: "Facial treatment in progress", ar: "جلسة علاج للوجه" } }
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
     Services: category tabs + a sidebar/content "menu" per category
     (subcategory names listed down the left, selected one's items shown
     on the right) + search.
     --------------------------------------------------------------------- */
  let activeCategoryId = SERVICES_DATA[0].id;
  // Remembers which subcategory was last selected per top-level category
  // (keyed by category id), so switching tabs and back doesn't reset it.
  const activeSubIndexByCat = {};

  function isAddOn(name) {
    return /^add\s*on|^إضافة/i.test(name.trim());
  }

  function getActiveSubIndex(cat) {
    const idx = activeSubIndexByCat[cat.id];
    return (typeof idx === "number" && idx < cat.subcategories.length) ? idx : 0;
  }

  function renderServices() {
    const tabsEl = $("#servicesTabs");
    const panelsEl = $("#servicesPanels");
    if (!tabsEl || !panelsEl) return;

    indicatorReady = false;
    tabsEl.innerHTML = `<span class="tab-indicator" id="tabIndicator" aria-hidden="true"></span>` +
      SERVICES_DATA.map((cat) => `
      <button type="button" class="services-tab${cat.id === activeCategoryId ? " active" : ""}" data-cat="${cat.id}" role="tab" aria-selected="${cat.id === activeCategoryId}">
        ${cat.name[currentLang]}
      </button>
    `).join("");

    panelsEl.innerHTML = SERVICES_DATA.map((cat) => {
      const activeSub = getActiveSubIndex(cat);
      return `
      <div class="services-panel${cat.id === activeCategoryId ? " active" : ""}" data-cat-panel="${cat.id}" role="tabpanel">
        <div class="services-menu">
          <div class="services-sidebar" role="tablist" aria-orientation="vertical" aria-label="${cat.name[currentLang]}">
            ${cat.subcategories.map((sub, i) => `
              <button type="button" class="sidebar-item reveal-item${i === activeSub ? " active" : ""}" data-sub-index="${i}" role="tab" aria-selected="${i === activeSub}" aria-controls="subpanel-${cat.id}-${i}" id="subtab-${cat.id}-${i}">
                <span class="sidebar-item-name">${sub.name[currentLang]}</span>
                <span class="sidebar-item-count">${sub.items.length}</span>
              </button>
            `).join("")}
          </div>
          <div class="services-content">
            ${cat.subcategories.map((sub, i) => `
              <div class="sub-panel${i === activeSub ? " active" : ""}" data-sub-panel="${i}" id="subpanel-${cat.id}-${i}" role="tabpanel" aria-labelledby="subtab-${cat.id}-${i}">
                <div class="sub-panel-header">
                  <h4 class="sub-panel-title">${sub.name[currentLang]}</h4>
                  <span class="sub-panel-count">${sub.items.length} ${UI[currentLang].services.itemsCount}</span>
                </div>
                <div class="service-list">
                  ${sub.items.map((item) => `
                    <div class="service-row" data-search="${(item.en + " " + item.ar).toLowerCase()}">
                      <span class="service-name">${isAddOn(item.en) ? `<span class="addon-tag">${UI[currentLang].services.addOn}</span>` : ""}${item[currentLang]}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>`;
    }).join("");

    bindServiceEvents();
    filterServices($("#serviceSearch") ? $("#serviceSearch").value : "");

    positionTabIndicator($(".services-tab.active"));
    const activePanel = $(`.services-panel[data-cat-panel="${activeCategoryId}"]`);
    if (activePanel) revealActiveRows(activePanel);
  }

  function bindServiceEvents() {
    $$(".services-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchCategory(btn.getAttribute("data-cat")));
    });

    $$(".sidebar-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.closest(".services-panel");
        switchSubcategory(panel.getAttribute("data-cat-panel"), parseInt(btn.getAttribute("data-sub-index"), 10));
      });
    });

    // Up/Down (+ Home/End) moves focus within one category's sidebar and
    // switches to that subcategory, mirroring how Left/Right drives the
    // top-level category tabs.
    $$(".services-sidebar").forEach((sidebar) => {
      sidebar.addEventListener("keydown", (e) => {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
        const items = $$(".sidebar-item", sidebar);
        const currentIndex = items.indexOf(document.activeElement);
        if (currentIndex === -1) return;
        e.preventDefault();

        let nextIndex = currentIndex;
        if (e.key === "Home") nextIndex = 0;
        else if (e.key === "End") nextIndex = items.length - 1;
        else if (e.key === "ArrowDown") nextIndex = Math.min(currentIndex + 1, items.length - 1);
        else nextIndex = Math.max(currentIndex - 1, 0);

        const nextItem = items[nextIndex];
        if (nextItem && nextItem !== document.activeElement) {
          nextItem.focus();
          const panel = nextItem.closest(".services-panel");
          switchSubcategory(panel.getAttribute("data-cat-panel"), nextIndex);
        }
      });
    });
  }

  // Switches which subcategory is shown within one category's panel — the
  // sidebar selection and its matching content pane. `animate` is turned
  // off while the visitor is actively typing in the search box (see
  // filterServices), where a cascading entrance would just add lag.
  function switchSubcategory(catId, subIndex, { animate = true } = {}) {
    activeSubIndexByCat[catId] = subIndex;
    const panel = $(`.services-panel[data-cat-panel="${catId}"]`);
    if (!panel) return;

    $$(".sidebar-item", panel).forEach((btn) => {
      const on = parseInt(btn.getAttribute("data-sub-index"), 10) === subIndex;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on);
    });
    $$(".sub-panel", panel).forEach((sp) => {
      sp.classList.toggle("active", parseInt(sp.getAttribute("data-sub-panel"), 10) === subIndex);
    });

    if (catId !== activeCategoryId) return; // an inactive tab's panel isn't visible; nothing to animate
    const activeSubPanel = $(".sub-panel.active", panel);
    if (!activeSubPanel) return;
    if (animate) staggerRows($$(".service-row", activeSubPanel));
    else ensureRowsVisible(activeSubPanel);
  }

  /* ---------------------------------------------------------------------
     Services — sliding tab indicator
     --------------------------------------------------------------------- */
  let indicatorReady = false;

  function positionTabIndicator(activeBtn) {
    const tabsEl = $("#servicesTabs");
    const indicator = $("#tabIndicator");
    if (!tabsEl || !indicator || !activeBtn) return;

    const tabsRect = tabsEl.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const x = btnRect.left - tabsRect.left + tabsEl.scrollLeft;
    const y = btnRect.top - tabsRect.top;

    // Width/height are assigned directly rather than transitioned — the
    // motion rules call for animating transform/opacity only, so a pill
    // moving to a wider/narrower tab snaps to the new size and slides via
    // translate, instead of animating width (which is what actually costs
    // layout on cheap phones).
    indicator.style.width = btnRect.width + "px";
    indicator.style.height = btnRect.height + "px";

    if (!indicatorReady) {
      indicator.classList.add("no-anim");
      indicator.style.transform = `translate(${x}px, ${y}px)`;
      void indicator.offsetWidth;
      indicator.classList.remove("no-anim");
      indicatorReady = true;
    } else {
      indicator.style.transform = `translate(${x}px, ${y}px)`;
    }
  }

  function updateTabsUI() {
    $$(".services-tab").forEach((b) => {
      const on = b.getAttribute("data-cat") === activeCategoryId;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on);
      if (on) positionTabIndicator(b);
    });
  }

  function scrollActiveTabIntoView() {
    const btn = $(`.services-tab[data-cat="${activeCategoryId}"]`);
    if (!btn) return;
    btn.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", inline: "center", block: "nearest" });
  }

  /* ---------------------------------------------------------------------
     Services — staggered row entrance
     --------------------------------------------------------------------- */
  function staggerRows(rows) {
    const list = Array.from(rows || []).filter((r) => !r.classList.contains("hidden-by-search"));
    if (!list.length) return;
    const reduced = prefersReducedMotion();
    const stepMs = getCssNumber("--row-stagger-step", 50);
    const maxMs = getCssNumber("--row-stagger-max", 600);
    const step = list.length > 1 ? Math.min(stepMs, maxMs / (list.length - 1)) : 0;

    list.forEach((el, i) => {
      el.classList.remove("row-in");
      el.style.transitionDelay = reduced ? "0ms" : Math.round(i * step) + "ms";
      el.style.willChange = "transform, opacity";
    });

    // Force a reflow so the removal above commits before "row-in" is
    // re-added — see staggerReveal()'s comment for why this matters.
    void list[0].offsetHeight;

    requestAnimationFrame(() => {
      list.forEach((el) => el.classList.add("row-in"));
      const rowDuration = getCssNumber("--row-duration", 380);
      const total = Math.round((list.length - 1) * step) + rowDuration + 60;
      setTimeout(() => {
        list.forEach((el) => {
          el.style.transitionDelay = "";
          el.style.willChange = "";
        });
      }, total);
    });
  }

  // Staggers in the rows of whichever subcategory is currently active
  // within a category panel.
  function revealActiveRows(panel) {
    if (!panel) return;
    const activeSubPanel = $(".sub-panel.active", panel);
    if (activeSubPanel) staggerRows($$(".service-row", activeSubPanel));
  }

  // Makes a newly-shown panel's sidebar items appear instantly, bypassing
  // their own reveal-item transition. The panel itself carries the
  // entrance motion on a tab switch (see switchCategory), so the items
  // riding along with it shouldn't also run their own separate fade-up —
  // that would look like two animations fighting each other.
  function revealSidebarInstant(panel) {
    $$(".sidebar-item", panel).forEach((el) => {
      el.style.transition = "none";
      el.classList.add("in-view");
      void el.offsetHeight;
      el.style.transition = "";
    });
  }

  // Instantly (no stagger) marks a sub-panel's rows visible — used when it's
  // brought into view as a side effect of the search filter, where a
  // cascading entrance would just add lag to every keystroke.
  function ensureRowsVisible(subPanel) {
    $$(".service-row", subPanel).forEach((r) => {
      r.style.transitionDelay = "";
      r.classList.add("row-in");
    });
  }

  /* ---------------------------------------------------------------------
     Services — directional category switch
     --------------------------------------------------------------------- */
  let switchToken = 0;
  const pendingSwitchTimers = [];

  function resetPanelMotion(panel) {
    if (!panel) return;
    panel.classList.remove("slide-out", "slide-in", "slide-in-start");
    panel.style.willChange = "";
  }

  function switchCategory(newId) {
    if (!newId || newId === activeCategoryId) return;
    const newPanel = $(`.services-panel[data-cat-panel="${newId}"]`);
    if (!newPanel) return;

    activeCategoryId = newId;
    const myToken = ++switchToken;

    // Cancel anything left over from an interrupted switch so it can't
    // fire stale callbacks against this new one.
    pendingSwitchTimers.forEach(clearTimeout);
    pendingSwitchTimers.length = 0;

    updateTabsUI();
    scrollActiveTabIntoView();

    // Whichever panel is currently visible in the DOM — including one
    // still mid-exit from a rapid previous click — is the real "old" one.
    // Any other stray .active panel (shouldn't normally happen, but a fast
    // double-click could race here) is force-settled with no animation.
    const oldPanel = $$(".services-panel.active").find((p) => p !== newPanel) || null;
    $$(".services-panel").forEach((p) => {
      if (p !== oldPanel && p !== newPanel && p.classList.contains("active")) {
        p.classList.remove("active");
        resetPanelMotion(p);
      }
    });

    const oldCatId = oldPanel ? oldPanel.getAttribute("data-cat-panel") : null;
    const oldIndex = SERVICES_DATA.findIndex((c) => c.id === oldCatId);
    const newIndex = SERVICES_DATA.findIndex((c) => c.id === newId);
    const dir = newIndex >= oldIndex ? 1 : -1;

    revealSidebarInstant(newPanel);

    const reduced = prefersReducedMotion();
    if (reduced || !oldPanel || oldPanel === newPanel) {
      if (oldPanel && oldPanel !== newPanel) {
        oldPanel.classList.remove("active");
        resetPanelMotion(oldPanel);
      }
      resetPanelMotion(newPanel);
      newPanel.classList.add("active");
      revealActiveRows(newPanel);
      return;
    }

    oldPanel.style.setProperty("--slide-dir", dir);
    oldPanel.style.willChange = "transform, opacity";
    oldPanel.classList.add("slide-out");

    const finishExit = () => {
      if (myToken !== switchToken) return;
      oldPanel.classList.remove("active");
      resetPanelMotion(oldPanel);
      beginEnter();
    };
    oldPanel.addEventListener("transitionend", function onExitEnd(e) {
      if (e.target !== oldPanel) return;
      oldPanel.removeEventListener("transitionend", onExitEnd);
      finishExit();
    });
    pendingSwitchTimers.push(setTimeout(finishExit, getCssNumber("--motion-exit-duration", 160) + 80));

    function beginEnter() {
      if (myToken !== switchToken) return;
      newPanel.style.setProperty("--slide-dir", dir);
      newPanel.style.willChange = "transform, opacity";
      newPanel.classList.add("active", "slide-in-start");
      void newPanel.offsetWidth;

      requestAnimationFrame(() => {
        if (myToken !== switchToken) return;
        newPanel.classList.remove("slide-in-start");
        newPanel.classList.add("slide-in");
        revealActiveRows(newPanel);
      });

      const finishEnter = () => {
        if (myToken !== switchToken) return;
        resetPanelMotion(newPanel);
      };
      newPanel.addEventListener("transitionend", function onEnterEnd(e) {
        if (e.target !== newPanel) return;
        newPanel.removeEventListener("transitionend", onEnterEnd);
        finishEnter();
      });
      pendingSwitchTimers.push(setTimeout(finishEnter, getCssNumber("--motion-duration", 300) + 100));
    }
  }

  /* ---------------------------------------------------------------------
     Services — keyboard tab navigation (Left/Right/Home/End) and mobile
     swipe. Both funnel through switchCategory() so they animate exactly
     like a click.
     --------------------------------------------------------------------- */
  function initTabsKeyboardNav() {
    const tabsEl = $("#servicesTabs");
    if (!tabsEl) return;
    tabsEl.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
      const tabs = $$(".services-tab").filter((b) => b.style.display !== "none");
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;
      e.preventDefault();

      const rtl = document.documentElement.getAttribute("dir") === "rtl";
      let nextIndex = currentIndex;
      if (e.key === "Home") nextIndex = 0;
      else if (e.key === "End") nextIndex = tabs.length - 1;
      else {
        const forward = (e.key === "ArrowRight") !== rtl;
        nextIndex = forward ? Math.min(currentIndex + 1, tabs.length - 1) : Math.max(currentIndex - 1, 0);
      }

      const nextTab = tabs[nextIndex];
      if (nextTab && nextTab !== document.activeElement) {
        nextTab.focus();
        switchCategory(nextTab.getAttribute("data-cat"));
      }
    });
  }

  function initServicesSwipe() {
    const panelsEl = $("#servicesPanels");
    if (!panelsEl) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let axis = null; // "h" | "v" | null (undecided)

    panelsEl.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
      axis = null;
    }, { passive: true });

    panelsEl.addEventListener("touchmove", (e) => {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (axis === null && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        axis = Math.abs(dx) > Math.abs(dy) * 1.3 ? "h" : "v";
      }
      // Only steal the gesture once it's clearly horizontal — vertical and
      // undecided gestures are left alone so page scroll is never hijacked.
      if (axis === "h" && e.cancelable) e.preventDefault();
    }, { passive: false });

    function onTouchEnd(e) {
      if (!tracking) return;
      tracking = false;
      if (axis !== "h") return;
      const dx = e.changedTouches[0].clientX - startX;
      const SWIPE_THRESHOLD = 48;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;

      const idx = SERVICES_DATA.findIndex((c) => c.id === activeCategoryId);
      // Physical swipe direction, same convention as OS-level carousels:
      // swipe left -> next category, swipe right -> previous, regardless
      // of text direction.
      if (dx < 0 && idx < SERVICES_DATA.length - 1) switchCategory(SERVICES_DATA[idx + 1].id);
      else if (dx > 0 && idx > 0) switchCategory(SERVICES_DATA[idx - 1].id);
    }
    panelsEl.addEventListener("touchend", onTouchEnd);
    panelsEl.addEventListener("touchcancel", () => { tracking = false; axis = null; });
  }

  function filterServices(query) {
    const q = (query || "").trim().toLowerCase();
    const noResultsEl = $("#servicesNoResults");
    let anyVisibleGlobal = false;

    // matchingSubIndexes[cat.id] = indexes of that category's subcategories
    // that have at least one row matching the query.
    const matchingSubIndexes = {};

    SERVICES_DATA.forEach((cat) => {
      const panel = $(`.services-panel[data-cat-panel="${cat.id}"]`);
      if (!panel) return;
      const matches = [];

      cat.subcategories.forEach((sub, i) => {
        const subPanel = $(`.sub-panel[data-sub-panel="${i}"]`, panel);
        const sidebarItem = $(`.sidebar-item[data-sub-index="${i}"]`, panel);
        if (!subPanel) return;
        let subHasMatch = false;
        $$(".service-row", subPanel).forEach((row) => {
          const match = !q || row.getAttribute("data-search").includes(q);
          row.classList.toggle("hidden-by-search", !match);
          if (match) subHasMatch = true;
        });
        if (sidebarItem) sidebarItem.hidden = Boolean(q) && !subHasMatch;
        if (subHasMatch) matches.push(i);
      });

      matchingSubIndexes[cat.id] = matches;
      const categoryHasMatch = matches.length > 0;

      const tabBtn = $(`.services-tab[data-cat="${cat.id}"]`);
      if (tabBtn) tabBtn.style.display = q && !categoryHasMatch ? "none" : "";
      if (categoryHasMatch) anyVisibleGlobal = true;
    });

    // Hiding/showing tabs above just reflowed the tab bar — the gold pill
    // indicator is positioned in JS against measured tab coordinates, so it
    // needs to be told to re-measure or it's left floating over whatever
    // used to be there.
    positionTabIndicator($(".services-tab.active"));

    if (q) {
      // If the active category tab now has no matches, jump to the first
      // one that does — same as before.
      let targetCatId = activeCategoryId;
      if (!(matchingSubIndexes[activeCategoryId] || []).length) {
        const firstMatchCat = SERVICES_DATA.find((cat) => (matchingSubIndexes[cat.id] || []).length);
        if (firstMatchCat) {
          targetCatId = firstMatchCat.id;
          activeCategoryId = targetCatId;
          updateTabsUI();
          $$(".services-panel").forEach((p) => p.classList.toggle("active", p.getAttribute("data-cat-panel") === activeCategoryId));
        }
      }

      // Within whichever category ends up active, make sure the selected
      // subcategory (sidebar item + content pane) is one that actually has
      // a match — jumping to the first one that does, no stagger while
      // typing.
      const targetMatches = matchingSubIndexes[targetCatId] || [];
      const targetCat = SERVICES_DATA.find((c) => c.id === targetCatId);
      if (targetMatches.length) {
        const currentSub = targetCat ? getActiveSubIndex(targetCat) : 0;
        if (!targetMatches.includes(currentSub)) {
          switchSubcategory(targetCatId, targetMatches[0], { animate: false });
        } else {
          const panel = $(`.services-panel[data-cat-panel="${targetCatId}"]`);
          const activeSubPanel = panel && $(".sub-panel.active", panel);
          if (activeSubPanel) ensureRowsVisible(activeSubPanel);
        }
      }
    }

    if (noResultsEl) noResultsEl.hidden = anyVisibleGlobal || !q;
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

    const activePanel = $(".services-panel.active");
    if (activePanel && isInViewport(activePanel)) {
      staggerReveal($$(".sidebar-item", activePanel), { step: 60 });
      revealActiveRows(activePanel);
    }
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

    // The Services section's active tab panel also gets a scroll-triggered
    // cascade, matching the others.
    const panelsEl = $("#servicesPanels");
    if (panelsEl && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activePanel = $(".services-panel.active");
            staggerReveal($$(".sidebar-item", activePanel), { step: 60 });
            revealActiveRows(activePanel);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      io.observe(panelsEl);
    }
  }

  /* ---------------------------------------------------------------------
     Tab indicator — recalculate whenever the layout it's measured against
     could have changed: viewport resize, or web fonts swapping in (which
     can reflow button widths after the indicator's first measurement).
     --------------------------------------------------------------------- */
  function initTabIndicatorSync() {
    let resizeRaf = null;
    window.addEventListener("resize", () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => positionTabIndicator($(".services-tab.active")));
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => positionTabIndicator($(".services-tab.active")));
    }
  }

  /* ---------------------------------------------------------------------
     Init
     --------------------------------------------------------------------- */
  function init() {
    $("#footerYear").textContent = new Date().getFullYear();

    $("#langToggle").addEventListener("click", () => {
      setLanguage(currentLang === "en" ? "ar" : "en");
    });

    $("#serviceSearch").addEventListener("input", (e) => filterServices(e.target.value));

    initHeader();
    setLanguage(currentLang);
    initScrollReveal();
    initStaggerGroups();
    initTabsKeyboardNav();
    initServicesSwipe();
    initTabIndicatorSync();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
