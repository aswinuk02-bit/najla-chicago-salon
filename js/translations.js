/* =========================================================================
   Najla Chicago Salon — bilingual content (EN / AR)
   Edit strings here; no HTML duplication needed per language.
   ========================================================================= */

/* ---------- UI strings (nav, sections, buttons, misc copy) ---------- */
const UI = {
  en: {
    dir: "ltr",
    lang: "en",
    siteName: "Najla Chicago Salon",
    siteNameShort: "Najla Chicago",
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      gallery: "Gallery",
      contact: "Contact",
      bookNow: "Book Now"
    },
    hero: {
      eyebrow: "Skin • Hair • MakeUp • Nails",
      headlineLine1: "Look Good,",
      headlineAccent: "Feel",
      headlineEnd: "Amazing",
      slogan: "Beauty starts with confidence",
      ctaPrimary: "Book an Appointment",
      ctaSecondary: "View Services",
      sideText: "Chicago's Beauty Destination",
      scriptLine: "Beauty starts here",
      scriptSub: "In the heart of Chicago",
      highlights: {
        hair: "Hair Styling",
        skin: "Skin Care",
        nails: "Nail Care",
        henna: "Bridal Henna"
      }
    },
    about: {
      eyebrow: "About Us",
      title: "Beauty, Crafted With Care",
      p1: "Najla Chicago Salon is a premium destination for women who want to look and feel their best. Our salon blends international techniques with a personal, attentive touch for every client who walks through our doors.",
      p2: "Our licensed specialists are trained across hair, skin, nails and beauty, using trusted professional-grade products in a clean, relaxing and fully hygienic environment.",
      p3: "From a quick blow-dry to a full bridal transformation, we treat every appointment as a chance to make you feel confident, refreshed and radiant.",
      stats: [
        { value: "10+", label: "Years of Experience" },
        { value: "300+", label: "Services Offered" },
        { value: "5000+", label: "Happy Clients" },
        { value: "4.9★", label: "Average Rating" }
      ]
    },
    services: {
      eyebrow: "Our Menu",
      title: "Services & Treatments",
      subtitle: "Explore our full range of treatments, organized by category.",
      categoriesLabel: "Service categories",
      subcategoriesLabel: "Subcategories",
      searchPlaceholder: "Search in this category…",
      searchLabel: "Search in this category",
      searchClear: "Clear search",
      noResults: "No services match your search in this category.",
      addOn: "Add-on",
      addOnsHeading: "Add-ons",
      addOnFor: "Add-on for {name}",
      book: "Book",
      bookAria: "Book {name} on WhatsApp",
      bookMessage: "Hi Najla Chicago Salon! I'd like to book: {name}.",
      bookThis: "Book This",
      itemsCount: "services",
      itemsCountOne: "service",
      minutes: "{n} min",
      priceFrom: "from {price}",
      popularTag: "Popular",
      resultsAnnounced: "{n} services shown in {name}.",
      helpTitle: "Not sure which one to book?",
      helpText: "Tell us what you're after and we'll match you with the right treatment.",
      helpCta: "Ask on WhatsApp",
      popularTitle: "Popular here",
      // "Build your visit" (SERVICES_CONFIG.bookingMode)
      add: "Add",
      added: "Added",
      removeAria: "Remove {name} from your visit",
      visitTitle: "Your visit",
      visitEmpty: "Add services to build your visit.",
      visitCount: "{n} selected",
      visitTotalTime: "Total time",
      visitTotalPrice: "Total",
      visitBook: "Book on WhatsApp",
      visitClear: "Clear",
      visitMessage: "Hi Najla Chicago Salon! I'd like to book:"
    },
    gallery: {
      eyebrow: "Our Work",
      title: "Salon Gallery",
      subtitle: "A glimpse of our space and our work."
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What Our Clients Say",
      subtitle: "Real experiences from our valued guests."
    },
    contact: {
      eyebrow: "Visit Us",
      title: "Location & Contact",
      subtitle: "We'd love to welcome you — reach out or drop by any day of the week.",
      addressLabel: "Address",
      addressValue: "Al Nahda, Sharjah, United Arab Emirates",
      phoneLabel: "Phone / WhatsApp",
      emailLabel: "Email",
      emailValue: "info@najlachicagosalon.ae",
      hoursLabel: "Opening Hours",
      hours: [
        { day: "Saturday – Thursday", time: "10:00 AM – 10:00 PM" },
        { day: "Friday", time: "2:00 PM – 10:00 PM" }
      ],
      formTitle: "Send Us a Message",
      formName: "Your Name",
      formPhone: "Phone Number",
      formMessage: "Your Message",
      formSubmit: "Send via WhatsApp",
      mapTitle: "Find Us on the Map"
    },
    footer: {
      about: "A premium beauty salon in the UAE offering hair, skin, nail and makeup services in a warm, elegant setting.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      followUs: "Follow Us",
      rights: "All rights reserved.",
      credit: "Website crafted with care."
    },
    whatsappFab: "Chat on WhatsApp",
    langToggle: "عربي"
  },

  ar: {
    dir: "rtl",
    lang: "ar",
    siteName: "صالون نجلاء شيكاغو",
    siteNameShort: "نجلاء شيكاغو",
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "الخدمات",
      gallery: "معرض الصور",
      contact: "تواصل معنا",
      bookNow: "احجزي الآن"
    },
    hero: {
      eyebrow: "بشرة • شعر • مكياج • أظافر",
      headlineLine1: "إطلالة مذهلة",
      headlineAccent: "ثقة",
      headlineEnd: "لا حدود لها",
      slogan: "الجمال يبدأ بالثقة",
      ctaPrimary: "احجزي موعدك",
      ctaSecondary: "استعرضي الخدمات",
      sideText: "وجهة الجمال في شيكاغو",
      scriptLine: "الجمال يبدأ من هنا",
      scriptSub: "في قلب شيكاغو",
      highlights: {
        hair: "تصفيف الشعر",
        skin: "العناية بالبشرة",
        nails: "العناية بالأظافر",
        henna: "حناء العروس"
      }
    },
    about: {
      eyebrow: "من نحن",
      title: "جمالكِ، بعناية فائقة",
      p1: "صالون نجلاء شيكاغو وجهة راقية لكل امرأة تبحث عن إطلالة وشعور استثنائيين. يجمع صالوننا بين أحدث التقنيات العالمية ولمسة شخصية دافئة لكل عميلة تدخل أبوابنا.",
      p2: "فريقنا من الأخصائيات المرخّصات مدرّب في مجالات الشعر والبشرة والأظافر والتجميل، ويستخدم منتجات احترافية موثوقة ضمن بيئة نظيفة ومريحة وصحية بالكامل.",
      p3: "من تسريحة سريعة إلى تحضير عروس متكامل، نتعامل مع كل موعد كفرصة لنمنحكِ الثقة والانتعاش والإشراقة.",
      stats: [
        { value: "+10", label: "سنوات خبرة" },
        { value: "+300", label: "خدمة متنوعة" },
        { value: "+5000", label: "عميلة سعيدة" },
        { value: "4.9★", label: "متوسط التقييم" }
      ]
    },
    services: {
      eyebrow: "قائمتنا",
      title: "الخدمات والعلاجات",
      subtitle: "تصفحي مجموعتنا الكاملة من الخدمات، مصنّفة حسب الفئة.",
      categoriesLabel: "فئات الخدمات",
      subcategoriesLabel: "الفئات الفرعية",
      searchPlaceholder: "ابحثي ضمن هذه الفئة…",
      searchLabel: "ابحثي ضمن هذه الفئة",
      searchClear: "مسح البحث",
      noResults: "لا توجد خدمات مطابقة لبحثك ضمن هذه الفئة.",
      addOn: "إضافة",
      addOnsHeading: "الإضافات",
      addOnFor: "إضافة إلى {name}",
      book: "احجزي",
      bookAria: "احجزي {name} عبر واتساب",
      bookMessage: "مرحبًا صالون نجلاء شيكاغو! أرغب في حجز: {name}.",
      bookThis: "احجزي هذه الخدمة",
      itemsCount: "خدمة",
      itemsCountOne: "خدمة",
      minutes: "{n} دقيقة",
      priceFrom: "تبدأ من {price}",
      popularTag: "الأكثر طلبًا",
      resultsAnnounced: "يتم عرض {n} خدمة ضمن {name}.",
      helpTitle: "لست متأكدة من الخدمة المناسبة؟",
      helpText: "أخبرينا بما تبحثين عنه وسنساعدك في اختيار العلاج الأنسب.",
      helpCta: "اسألينا عبر واتساب",
      popularTitle: "الأكثر طلبًا هنا",
      // "Build your visit" (SERVICES_CONFIG.bookingMode)
      add: "أضيفي",
      added: "تمت الإضافة",
      removeAria: "إزالة {name} من زيارتك",
      visitTitle: "زيارتك",
      visitEmpty: "أضيفي الخدمات لتجهيز زيارتك.",
      visitCount: "{n} مختارة",
      visitTotalTime: "المدة الإجمالية",
      visitTotalPrice: "الإجمالي",
      visitBook: "احجزي عبر واتساب",
      visitClear: "مسح",
      visitMessage: "مرحبًا صالون نجلاء شيكاغو! أرغب في حجز:"
    },
    gallery: {
      eyebrow: "أعمالنا",
      title: "معرض الصالون",
      subtitle: "لمحة عن أجواء صالوننا وأعمالنا."
    },
    testimonials: {
      eyebrow: "آراء العميلات",
      title: "ماذا يقول عملاؤنا",
      subtitle: "تجارب حقيقية من ضيفاتنا الكريمات."
    },
    contact: {
      eyebrow: "زورونا",
      title: "الموقع والتواصل",
      subtitle: "يسعدنا استقبالكِ — تواصلي معنا أو مرّي علينا في أي يوم من أيام الأسبوع.",
      addressLabel: "العنوان",
      addressValue: "النهضة، الشارقة، الإمارات العربية المتحدة",
      phoneLabel: "الهاتف / واتساب",
      emailLabel: "البريد الإلكتروني",
      emailValue: "info@najlachicagosalon.ae",
      hoursLabel: "ساعات العمل",
      hours: [
        { day: "السبت – الخميس", time: "10:00 صباحًا – 10:00 مساءً" },
        { day: "الجمعة", time: "2:00 ظهرًا – 10:00 مساءً" }
      ],
      formTitle: "أرسلي لنا رسالة",
      formName: "الاسم",
      formPhone: "رقم الهاتف",
      formMessage: "رسالتك",
      formSubmit: "إرسال عبر واتساب",
      mapTitle: "موقعنا على الخريطة"
    },
    footer: {
      about: "صالون تجميل راقٍ في الإمارات يقدّم خدمات الشعر والبشرة والأظافر والمكياج ضمن أجواء دافئة وأنيقة.",
      quickLinks: "روابط سريعة",
      contactUs: "تواصلي معنا",
      followUs: "تابعينا",
      rights: "جميع الحقوق محفوظة.",
      credit: "تصميم الموقع بعناية."
    },
    whatsappFab: "تواصلي عبر واتساب",
    langToggle: "EN"
  }
};

/* ---------- Testimonials (placeholder — edit freely) ---------- */
const TESTIMONIALS = [
  {
    name: { en: "Fatima R.", ar: "فاطمة ر." },
    rating: 5,
    text: {
      en: "The best salon experience I've had in Dubai. My hair colour turned out exactly as I wanted and the staff were so warm and professional.",
      ar: "أفضل تجربة صالون عشتها في دبي. لون شعري طلع بالضبط زي ما كنت أتمنى، والطاقم كان ودود واحترافي جدًا."
    }
  },
  {
    name: { en: "Sara M.", ar: "سارة م." },
    rating: 5,
    text: {
      en: "I go for my Moroccan bath every month now — so relaxing, and the place is spotless. Highly recommend Najla Chicago Salon!",
      ar: "صرت أروح للحمام المغربي كل شهر — استرخاء حقيقي، والمكان نظيف جدًا. أنصح فيه بقوة!"
    }
  },
  {
    name: { en: "Lena K.", ar: "لينا ك." },
    rating: 5,
    text: {
      en: "Did my bridal hair and makeup trial here and I was blown away. Booking them for my big day without a doubt.",
      ar: "جربت تسريحة ومكياج العروس هنا وانبهرت بالنتيجة. حاجزة معاهم ليوم زفافي بدون تردد."
    }
  }
];

