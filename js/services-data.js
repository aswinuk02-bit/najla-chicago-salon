/* =========================================================================
   Najla Chicago Salon — Services menu: data + configuration
   This is the single source of truth for the Services section. Editing a
   name/price here re-renders it in both languages; nothing else to touch.
   ========================================================================= */

/* ---------- Menu configuration ----------
   Everything that changes how the menu behaves, in one place. */
const SERVICES_CONFIG = {
  // Shown before the amount, e.g. "AED 40". Arabic renders it after.
  currency: { en: "AED", ar: "د.إ" },

  // Prices exist in the data below for every service, but are hidden by
  // default — pricing was deliberately taken off the public site. Flip to
  // true to show them on the cards (and in "Build your visit" totals).
  showPrices: false,

  // Durations render only where a service actually declares
  // `durationMinutes` (see "Optional per-service fields" below). No
  // service has one yet, so nothing renders until you add them.
  showDurations: true,

  // "Build your visit" — Add buttons + a running summary with a WhatsApp
  // handoff. Off by default; flip to true to enable.
  bookingMode: false,

  // Soft card shown under short subcategories so the panel doesn't end in
  // dead space. `minServices` is the threshold: a subcategory with fewer
  // visible services than this gets the card.
  helperCard: {
    enabled: true,
    minServices: 8,
    // "whatsapp" — offer to help choose over WhatsApp.
    // "popular"  — list the subcategory's `popular: true` services.
    type: "whatsapp"
  }
};

/* ---------- Services data ----------
   Compact tuple: [English name, Arabic name, price (number|string)]

   Optional per-service fields go in a 4th slot as an object, e.g.
     ["Hair Spa", "سبا الشعر", 85, { durationMinutes: 45, popular: true }]

   Supported keys:
     id              override the auto-generated slug (rarely needed)
     description     { en, ar } — one short line under the name
     durationMinutes number — renders as "45 min"
     priceFrom       true — renders the price as "from AED 85"
     isAddOn         true/false — overrides the "Add On …" name detection
     addOnFor        { en, ar } — what the add-on attaches to; defaults to
                     the subcategory name
     popular         true — eligible for the "popular" helper card

   Missing fields are simply not rendered — no blanks, no "undefined". */
function t(list) {
  return list.map((entry) => {
    const [en, ar, price, extra] = entry;
    return Object.assign({ en, ar, price }, extra || null);
  });
}

const SERVICES_DATA = [
  {
    id: "hair",
    icon: "hair",
    image: "hair-2.jpg",
    name: { en: "Hair", ar: "الشعر" },
    subcategories: [
      {
        name: { en: "Hair Wash", ar: "غسيل الشعر" },
        items: t([
          ["Normal Hair Wash", "غسيل شعر عادي", 40],
          ["Add On – 15 Minute Massage", "إضافة – مساج 15 دقيقة", 20],
          ["Add On – Hair Treatment", "إضافة – علاج الشعر", 25]
        ])
      },
      {
        name: { en: "Hair Treatment", ar: "علاج الشعر" },
        items: t([
          ["Hot Oil", "زيت ساخن", 60],
          ["Hair Spa", "سبا الشعر", 85],
          ["Anti-Dandruff", "علاج القشرة", 150],
          ["Organic Treatment", "علاج عضوي", 120],
          ["Hair Repair Nourishment Mask (Short–Medium)", "ماسك تغذية وإصلاح الشعر (قصير – متوسط)", 130],
          ["Hair Repair Nourishment Mask (Long–E.Long)", "ماسك تغذية وإصلاح الشعر (طويل – طويل جدًا)", 175],
          ["Anti-Frizz Collagen Mask (Short–Medium)", "ماسك كولاجين مضاد للتجعد (قصير – متوسط)", 130],
          ["Anti-Frizz Collagen Mask (Long–E.Long)", "ماسك كولاجين مضاد للتجعد (طويل – طويل جدًا)", 175],
          ["Own Henna Application (Short–Medium)", "تطبيق حناء العميلة (قصير – متوسط)", 40],
          ["Own Henna Application (Long–E.Long)", "تطبيق حناء العميلة (طويل – طويل جدًا)", 80],
          ["Henna Treatment – Short", "علاج الحناء – قصير", 60],
          ["Henna Treatment – Medium", "علاج الحناء – متوسط", 80],
          ["Henna Treatment – Long", "علاج الحناء – طويل", 100],
          ["Henna Treatment – E.Long", "علاج الحناء – طويل جدًا", 125],
          ["Nourishing Hair Spa Treatment (Fenola)", "علاج سبا الشعر المغذي (فينولا)", 175]
        ])
      },
      {
        name: { en: "Hair Cut", ar: "قص الشعر" },
        items: t([
          ["Kids Hair Cut (1–5 Years)", "قص شعر أطفال (1 – 5 سنوات)", 35],
          ["Kids Hair Cut (6–10 Years)", "قص شعر أطفال (6 – 10 سنوات)", 65],
          ["Fringe Cut", "قص الغرة", 30],
          ["Hair Trim", "تقليم أطراف الشعر", 40],
          ["Bob Cut", "قصة بوب", 100],
          ["Straight Hair Cut", "قص شعر مستقيم", 55],
          ["U Shape Hair Cut", "قصة على شكل U", 70],
          ["V Shape Hair Cut", "قصة على شكل V", 70],
          ["Professional Hair Cut – Short", "قص شعر احترافي – قصير", 75],
          ["Professional Hair Cut – Medium", "قص شعر احترافي – متوسط", 90],
          ["Professional Hair Cut – Long", "قص شعر احترافي – طويل", 110],
          ["Professional Hair Cut – E.Long", "قص شعر احترافي – طويل جدًا", 130],
          ["Add On – Hair Wash", "إضافة – غسيل الشعر", 25]
        ])
      },
      {
        name: { en: "Blow Dry", ar: "سشوار" },
        items: t([
          ["Short Hair", "شعر قصير", 60],
          ["Medium Hair", "شعر متوسط", 80],
          ["Long Hair", "شعر طويل", 100],
          ["Extra Long Hair", "شعر طويل جدًا", 125],
          ["Add On – Hair Wash", "إضافة – غسيل الشعر", 25],
          ["Add On – Ironing", "إضافة – فرد بالمكواة", 30],
          ["Add On – Curling Tong", "إضافة – تجعيد بالمكواة", 30],
          ["Add On – Ironing and Curling", "إضافة – فرد وتجعيد", 50]
        ])
      },
      {
        name: { en: "Brazilian Blow Dry", ar: "سشوار برازيلي" },
        items: t([
          ["Short Hair", "شعر قصير", 70],
          ["Medium Hair", "شعر متوسط", 90],
          ["Long Hair", "شعر طويل", 110],
          ["Extra Long Hair", "شعر طويل جدًا", 130],
          ["Add On – Hair Wash", "إضافة – غسيل الشعر", 25],
          ["Add On – Volume", "إضافة – فوليوم", 30]
        ])
      },
      {
        name: { en: "Hair Coloring", ar: "صبغة الشعر" },
        items: t([
          ["Root Color (up to 4cm)", "صبغة الجذور (حتى 4 سم)", 60],
          ["Root Colour (up to 1 inch)", "صبغة الجذور (حتى 1 إنش)", 90],
          ["Own Colour – Roots Apply", "صبغة العميلة – تطبيق الجذور", 45],
          ["Own Colour – Full Apply (Short–Medium)", "صبغة العميلة – تطبيق كامل (قصير – متوسط)", 75],
          ["Own Colour – Full Apply (Long–E.Long)", "صبغة العميلة – تطبيق كامل (طويل – طويل جدًا)", 120],
          ["Full Hair Colour – Short", "صبغة كاملة – قصير", 130],
          ["Full Hair Colour – Medium", "صبغة كاملة – متوسط", 160],
          ["Full Hair Colour – Long", "صبغة كاملة – طويل", 200],
          ["Full Hair Colour – E.Long", "صبغة كاملة – طويل جدًا", 250],
          ["Add On – Volume", "إضافة – فوليوم", 30],
          ["Add On – Ammonia Free", "إضافة – بدون أمونيا", 40],
          ["Rinsage", "رينساج", 150],
          ["Gommage / Scrubbing Colour", "جوماج / تقشير الصبغة", 200],
          ["Add On – Volume (Short–Medium)", "إضافة – فوليوم (قصير – متوسط)", 30],
          ["Add On – Volume (Long–E.Long)", "إضافة – فوليوم (طويل – طويل جدًا)", 60]
        ])
      },
      {
        name: { en: "Highlight / Lowlight / Balayage / Ombre", ar: "هايلايت / لولايت / بالياج / أومبير" },
        items: t([
          ["Per Foil Apply", "تطبيق لكل ورقة فويل", 15],
          ["Colour Per Foil", "صبغة لكل ورقة فويل", 20],
          ["Hair Contouring – Face Line", "تحديد خطوط الوجه بالشعر", 150],
          ["Hair Contouring – Face Line (Extended)", "تحديد خطوط الوجه بالشعر (موسّع)", 200],
          ["Short Hair", "شعر قصير", 180],
          ["Medium Hair", "شعر متوسط", 250],
          ["Long Hair", "شعر طويل", 330],
          ["Extra Long Hair", "شعر طويل جدًا", 400],
          ["Add On – Volume", "إضافة – فوليوم", 50]
        ])
      },
      {
        name: { en: "Full Highlight", ar: "هايلايت كامل" },
        items: t([
          ["Short Hair", "شعر قصير", 350],
          ["Medium Hair", "شعر متوسط", 450],
          ["Long Hair", "شعر طويل", 550],
          ["Extra Long Hair", "شعر طويل جدًا", 650],
          ["Add On – Volume", "إضافة – فوليوم", 50]
        ])
      },
      {
        name: { en: "Smoothening Hair Treatment", ar: "علاج فرد وتنعيم الشعر" },
        items: t([
          ["Nano Plastia – Short", "نانو بلاستيا – قصير", 150],
          ["Nano Plastia – Medium", "نانو بلاستيا – متوسط", 200],
          ["Nano Plastia – Long", "نانو بلاستيا – طويل", 275],
          ["Nano Plastia – E.Long", "نانو بلاستيا – طويل جدًا", 350],
          ["Keratin – Short", "كيراتين – قصير", 200],
          ["Keratin – Medium", "كيراتين – متوسط", 325],
          ["Keratin – Long", "كيراتين – طويل", 450],
          ["Keratin – E.Long", "كيراتين – طويل جدًا", 575],
          ["Protein – Short", "بروتين – قصير", 250],
          ["Protein – Medium", "بروتين – متوسط", 375],
          ["Protein – Long", "بروتين – طويل", 499],
          ["Protein – E.Long", "بروتين – طويل جدًا", 599],
          ["Add On – Volume", "إضافة – فوليوم", 50]
        ])
      },
      {
        name: { en: "Hair Style", ar: "تصفيف الشعر" },
        items: t([
          ["Normal Up Style", "تصفيف علوي عادي", 100],
          ["Professional / Specific Up Style", "تصفيف علوي احترافي / مخصص", 200],
          ["3D Up Style / Bridal Hair Style", "تصفيف ثلاثي الأبعاد / تسريحة عروس", 350],
          ["Hair Braiding", "ضفائر الشعر", 50],
          ["Add On – Hair Braiding (Short–Medium)", "إضافة – ضفائر (قصير – متوسط)", 100],
          ["Add On – Hair Braiding (Long–E.Long)", "إضافة – ضفائر (طويل – طويل جدًا)", 150]
        ])
      }
    ]
  },

  {
    id: "waxing-threading",
    icon: "waxing",
    image: "waxing.jpg",
    name: { en: "Waxing & Threading", ar: "الشمع والخيط" },
    subcategories: [
      {
        name: { en: "Waxing", ar: "إزالة الشعر بالشمع" },
        items: t([
          ["Eyebrow", "الحاجب", 25],
          ["Upper Lip", "الشفة العليا", 15],
          ["Chin", "الذقن", 15],
          ["Nose Inside", "داخل الأنف", 15],
          ["Nose Outside", "خارج الأنف", 20],
          ["Neck", "الرقبة", 25],
          ["Forehead", "الجبهة", 15],
          ["Face Side", "جانب الوجه", 20],
          ["Full Face", "الوجه كامل", 70],
          ["Half Arm", "نصف الذراع", 35],
          ["Full Arm", "الذراع كامل", 50],
          ["Half Leg", "نصف الساق", 45],
          ["Full Leg", "الساق كامل", 70],
          ["Underarm – Normal", "تحت الإبط – عادي", 20],
          ["Underarm – Special", "تحت الإبط – خاص", 35],
          ["Back Wax", "شمع الظهر", 50],
          ["Front Wax", "شمع الصدر", 50],
          ["Full Body Wax", "شمع الجسم كامل", 210],
          ["Bikini Line", "خط البكيني", 50],
          ["Brazilian Wax – Normal", "شمع برازيلي – عادي", 70],
          ["Brazilian Wax – Special", "شمع برازيلي – خاص", 100],
          ["Full Body with Brazilian – Normal", "الجسم كامل مع البرازيلي – عادي", 260],
          ["Full Body with Brazilian – Special", "الجسم كامل مع البرازيلي – خاص", 290]
        ])
      },
      {
        name: { en: "Threading", ar: "الخيط" },
        items: t([
          ["Eyebrow", "الحاجب", 20],
          ["Upper Lip", "الشفة العليا", 10],
          ["Chin", "الذقن", 10],
          ["Side Face", "جانب الوجه", 15],
          ["Full Face", "الوجه كامل", 50],
          ["Forehead", "الجبهة", 10]
        ])
      }
    ]
  },

  {
    id: "skin",
    icon: "skin",
    image: "skin.jpg",
    name: { en: "Skin", ar: "البشرة" },
    subcategories: [
      {
        name: { en: "Skin Treatment", ar: "علاج البشرة" },
        items: t([
          ["Face Bleach", "تفتيح الوجه", 50],
          ["Face Clean-up", "تنظيف الوجه", 70],
          ["Basic Facial", "فيشل أساسي", 80],
          ["Herbal Facial", "فيشل عشبي", 80],
          ["Brightening Facial", "فيشل تفتيح", 90],
          ["Acne Treatment", "علاج حب الشباب", 90],
          ["Anti-Aging Treatment", "علاج مضاد للشيخوخة", 90],
          ["Under Arm Facial", "فيشل تحت الإبط", 75],
          ["Back Facial", "فيشل الظهر", 110],
          ["Add On – LED Mask", "إضافة – ماسك LED", 30],
          ["Add On – Korean Sheet Mask", "إضافة – ماسك كوري ورقي", 20],
          ["Add On – Lemon Peeling", "إضافة – تقشير الليمون", 30],
          ["Add On – Snail Scrub", "إضافة – سكراب الحلزون", 20],
          ["Add On – Gold Mask", "إضافة – ماسك الذهب", 30],
          ["Add On – Peel Off Mask", "إضافة – ماسك بيل أوف", 30],
          ["Add On – Soothing Mask", "إضافة – ماسك مهدئ", 30],
          ["Add On – Vtox Lifting Mask", "إضافة – ماسك شد فيتوكس", 30]
        ])
      },
      {
        name: { en: "Korean Skin Treatment", ar: "علاج البشرة الكوري" },
        items: t([
          ["Korean Facial", "فيشل كوري", 90],
          ["Instant Glow Treatment", "علاج توهج فوري", 120],
          ["Purifying Treatment", "علاج تنقية", 120],
          ["Rejuvenating Treatment", "علاج تجديد", 120],
          ["Glow and Go Facial", "فيشل التوهج السريع", 250]
        ])
      }
    ]
  },

  {
    id: "nails",
    icon: "nails",
    image: "nail-salon-1.jpg",
    name: { en: "Nails", ar: "الأظافر" },
    subcategories: [
      {
        name: { en: "Nail", ar: "الأظافر" },
        items: t([
          ["Classic Manicure", "مانيكير كلاسيكي", 35],
          ["Classic Pedicure", "باديكير كلاسيكي", 50],
          ["Spa Manicure", "مانيكير سبا", 50],
          ["Spa Pedicure", "باديكير سبا", 70],
          ["Add On – Gel Polish", "إضافة – طلاء جل", 50],
          ["Add On – Callus Treatment", "إضافة – علاج الكالو", 35],
          ["Add On – Paraffin Hand", "إضافة – بارافين لليد", 40],
          ["Add On – Paraffin Feet", "إضافة – بارافين للقدم", 50],
          ["Add On – Foot Scrubbing", "إضافة – تقشير القدم", 35],
          ["Add On – Ingrown Removal", "إضافة – إزالة الظفر الناشب", 40]
        ])
      },
      {
        name: { en: "Nails Enhancement", ar: "تطويل وتقوية الأظافر" },
        items: t([
          ["Nail Repair (One Finger)", "إصلاح ظفر (إصبع واحد)", 25],
          ["Gel Polish Removal", "إزالة طلاء الجل", 25],
          ["Soak Off", "إزالة بالنقع", 50],
          ["Acrylic Full Set Natural", "أكريليك طقم كامل طبيعي", 200],
          ["Acrylic Full Set Ombre", "أكريليك طقم كامل أومبير", 250],
          ["Acrylic Overlay Natural", "أكريليك تغطية طبيعي", 150],
          ["Acrylic Overlay Ombre", "أكريليك تغطية أومبير", 200],
          ["Hard Gel Full Set Natural", "هارد جل طقم كامل طبيعي", 230],
          ["Hard Gel Full Set Ombre", "هارد جل طقم كامل أومبير", 275],
          ["Hard Gel Overlay Natural", "هارد جل تغطية طبيعي", 180],
          ["Hard Gel Overlay Ombre", "هارد جل تغطية أومبير", 220],
          ["Refill Add On – Natural (Hard Gel)", "تعبئة إضافية – طبيعي (هارد جل)", 125],
          ["Refill Add On – Ombre (Hard Gel)", "تعبئة إضافية – أومبير (هارد جل)", 175],
          ["Polygel Full Set Natural", "بولي جل طقم كامل طبيعي", 175],
          ["Polygel Full Set Ombre", "بولي جل طقم كامل أومبير", 225],
          ["Polygel Overlay Natural", "بولي جل تغطية طبيعي", 125],
          ["Polygel Overlay Ombre", "بولي جل تغطية أومبير", 175],
          ["Refill Add On – Natural (Polygel)", "تعبئة إضافية – طبيعي (بولي جل)", 90],
          ["Refill Add On – Ombre (Polygel)", "تعبئة إضافية – أومبير (بولي جل)", 125],
          ["French Application – Normal", "فرنسي – عادي", 30],
          ["French Application – Gel", "فرنسي – جل", 50],
          ["Chrome Application – Half", "كروم – نصف", 45],
          ["Chrome Application – Full", "كروم – كامل", 100],
          ["Cat-Eye Design – Half", "تصميم عين القطة – نصف", 55],
          ["Cat-Eye Design – Full", "تصميم عين القطة – كامل", 120],
          ["Rubber Base Application", "طبقة أساس مطاطية", 40],
          ["Nail Art – Simple (per design)", "رسم أظافر – بسيط (لكل تصميم)", 5],
          ["Nail Art – Medium (per design)", "رسم أظافر – متوسط (لكل تصميم)", 10],
          ["Nail Art – Detailed (per design)", "رسم أظافر – مفصّل (لكل تصميم)", 20]
        ])
      }
    ]
  },

  {
    id: "lash-brow",
    icon: "lash",
    image: "eyelash-eyebrow.jpg",
    name: { en: "Eyelash & Eyebrow", ar: "الرموش والحواجب" },
    subcategories: [
      {
        name: { en: "Eyelash & Eyebrow", ar: "الرموش والحواجب" },
        items: t([
          ["Classic Lashes", "رموش كلاسيك", 150],
          ["Volume Lashes", "رموش فوليوم", 200],
          ["Cat Eye Lashes", "رموش عين القطة", 240],
          ["Hybrid Lashes", "رموش هايبرد", 275],
          ["Russian Volume Lashes", "رموش فوليوم روسي", 350],
          ["Eyelash Lifting", "رفع الرموش", 150],
          ["Eyelash Tinting", "صبغ الرموش", 180],
          ["Eyebrow Lamination", "لامينيشن الحواجب", 200],
          ["Eyebrow Tinting", "صبغ الحواجب", 250],
          ["Eyelash Removal", "إزالة الرموش", 60],
          ["Eyelash Refill – 1 Week", "تعبئة الرموش – أسبوع واحد", 60],
          ["Eyelash Refill – 2 Weeks", "تعبئة الرموش – أسبوعين", 90]
        ])
      }
    ]
  },

  {
    id: "massage",
    icon: "massage",
    image: "massage-1.jpg",
    name: { en: "Massage", ar: "المساج" },
    subcategories: [
      {
        name: { en: "Massage", ar: "المساج" },
        items: t([
          ["Face Massage – 30 Min", "مساج الوجه – 30 دقيقة", 50],
          ["Hand Massage – 15 Min", "مساج اليد – 15 دقيقة", 40],
          ["Hand Massage – 30 Min", "مساج اليد – 30 دقيقة", 80],
          ["Leg Massage – 15 Min", "مساج الساق – 15 دقيقة", 60],
          ["Leg Massage – 30 Min", "مساج الساق – 30 دقيقة", 110],
          ["Foot Massage – 15 Min", "مساج القدم – 15 دقيقة", 35],
          ["Foot Massage – 30 Min", "مساج القدم – 30 دقيقة", 70],
          ["Neck & Shoulder – 15 Min", "الرقبة والكتف – 15 دقيقة", 50],
          ["Neck & Shoulder – 30 Min", "الرقبة والكتف – 30 دقيقة", 90],
          ["Head, Neck & Shoulder – 30 Min", "الرأس والرقبة والكتف – 30 دقيقة", 80],
          ["Back Massage – 15 Min", "مساج الظهر – 15 دقيقة", 75],
          ["Back Massage – 30 Min", "مساج الظهر – 30 دقيقة", 140],
          ["Relaxing Massage – 45 Min", "مساج استرخاء – 45 دقيقة", 150],
          ["Potli Massage – 45 Min", "مساج بوتلي بالأعشاب – 45 دقيقة", 180],
          ["Swedish Massage – 60 Min", "مساج سويدي – 60 دقيقة", 200],
          ["Swedish Massage – 90 Min", "مساج سويدي – 90 دقيقة", 275],
          ["Slimming Massage – 60 Min", "مساج تنحيف – 60 دقيقة", 350]
        ])
      }
    ]
  },

  {
    id: "moroccan-bath",
    icon: "bath",
    image: "moroccan-bath.jpg",
    name: { en: "Moroccan Bath", ar: "الحمام المغربي" },
    subcategories: [
      {
        name: { en: "Moroccan Bath", ar: "الحمام المغربي" },
        items: t([
          ["Classic Moroccan Bath", "حمام مغربي كلاسيكي", 100],
          ["Moroccan Hammam", "حمام مغربي", 150],
          ["Oriental Hammam", "حمام شرقي", 200],
          ["Spa Hammam", "حمام سبا", 250],
          ["Coffee Scrubbing Treatment", "تقشير بالقهوة", 180]
        ])
      }
    ]
  },

  {
    id: "henna",
    icon: "henna",
    image: "henna.jpg",
    name: { en: "Henna", ar: "الحناء" },
    subcategories: [
      {
        name: { en: "Henna Design", ar: "نقش الحناء" },
        items: t([
          ["Kids Hand Henna (5–10Y) – Fingers", "حناء يد أطفال (5–10 سنوات) – الأصابع", 5],
          ["Kids Hand Henna (5–10Y) – 1/2 Hand One Side", "حناء يد أطفال (5–10 سنوات) – نصف اليد وجه واحد", 10],
          ["Kids Hand Henna (5–10Y) – 2/3 Hand One Side", "حناء يد أطفال (5–10 سنوات) – ثلثي اليد وجه واحد", 15],
          ["Kids Hand Henna (5–10Y) – Full Hand One Side", "حناء يد أطفال (5–10 سنوات) – اليد كاملة وجه واحد", 30],
          ["Hand Henna – Fingers", "حناء اليد – الأصابع", 10],
          ["Hand Henna – 1/2 Hand One Side", "حناء اليد – نصف اليد وجه واحد", 20],
          ["Hand Henna – 2/3 Hand One Side", "حناء اليد – ثلثي اليد وجه واحد", 35],
          ["Hand Henna – Full Hand One Side", "حناء اليد – اليد كاملة وجه واحد", 50],
          ["Feet Henna – Fingers", "حناء القدم – الأصابع", 20],
          ["Feet Henna – Full Feet", "حناء القدم – كاملة", 45],
          ["Back Henna – Half Tattoo Line", "حناء الظهر – نصف خط وشم", 45],
          ["Back Henna – Full Tattoo Line", "حناء الظهر – خط وشم كامل", 90],
          ["Henna Add On – Medium Design", "إضافة حناء – تصميم متوسط (حسب الفئة)", "5–25"],
          ["Henna Add On – Heavy Design", "إضافة حناء – تصميم كثيف (حسب الفئة)", "10–40"]
        ])
      }
    ]
  }
];
