export type Locale = "en" | "bm";

export const LOCALES: Locale[] = ["en", "bm"];

type DictionaryShape = {
  nav: Record<
    "chat" | "journal" | "dashboard" | "discover" | "buddy" | "login" | "signup" | "getStarted",
    string
  >;
  landing: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    tryDemo: string;
    seeFeatures: string;
    problemStat: string;
    problemTitle: string;
    problemBody: string;
    featuresTitle: string;
    featuresSubtitle: string;
    features: { title: string; body: string }[];
    ctaTitle: string;
    ctaBody: string;
    demoTitle: string;
    demoSubtitle: string;
    archTitle: string;
    archSubtitle: string;
    tryDemoInstant: string;
  };
  chat: { title: string; subtitle: string; placeholder: string; send: string };
  journal: {
    title: string;
    subtitle: string;
    mood: string;
    sleep: string;
    note: string;
    save: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    score: string;
    trend: string;
    suggestion: string;
    streak: string;
  };
  discover: { title: string; subtitle: string };
  buddy: { title: string; subtitle: string; cta: string };
  admin: { title: string; subtitle: string };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    signupTitle: string;
    signupSubtitle: string;
    email: string;
    password: string;
    handle: string;
    login: string;
    signup: string;
    noAccount: string;
    hasAccount: string;
  };
  crisis: { label: string; taliankasih: string; befrienders: string };
};

export const dictionary: Record<Locale, DictionaryShape> = {
  en: {
    nav: {
      chat: "Chat",
      journal: "Journal",
      dashboard: "Dashboard",
      discover: "Discover",
      buddy: "Buddy",
      login: "Log in",
      signup: "Sign up",
      getStarted: "Get started",
    },
    landing: {
      heroBadge: "For Malaysian youth · ICYOUTH 2026 · UPM",
      heroTitle: "A friend who listens.",
      heroSubtitle:
        "Your AI friend. Always listening. Always connecting you to the help you deserve.",
      tryDemo: "Mula sekarang — it's free",
      seeFeatures: "See how it works",
      problemStat: "1 in 3",
      problemTitle: "1 in 3 Malaysian youth report mental distress.",
      problemBody:
        "NHMS 2022 shows a quiet crisis. Existing services are reactive, fragmented, and rarely in the languages our youth actually speak. SAHABAT.AI was built to change that — prevent, support, reconnect.",
      featuresTitle: "A companion built for real life",
      featuresSubtitle:
        "Not just another chatbot. Six layers of AI working together to meet youth where they are.",
      features: [
        {
          title: "Empathetic companion",
          body: "Claude-powered, culturally tuned, listens without judgement in BM, EN, and Manglish.",
        },
        {
          title: "Wellbeing risk engine",
          body: "PHQ-9 aligned signals generate a 0–100 score and Green/Yellow/Orange/Red tier.",
        },
        {
          title: "Program recommender",
          body: "Vector-matched Malaysian NGO, UPM, and KBS programs tailored to your moment.",
        },
        {
          title: "Peer buddy matching",
          body: "Anonymous opt-in pairing with youth facing similar experiences.",
        },
        {
          title: "Crisis escalation",
          body: "Talian Kasih 15999 and Befrienders KL always one tap away, automatically.",
        },
        {
          title: "Gamified check-ins",
          body: "60-second daily check-in earns XP, unlocks community quests and streaks.",
        },
      ],
      ctaTitle: "Ready to meet your Sahabat?",
      ctaBody:
        "Free for all Malaysian youth. PDPA-compliant. Anonymous handle optional.",
      demoTitle: "See it in 2 minutes",
      demoSubtitle:
        "A quick walkthrough of the chat, risk engine, and program matching — no sign-up needed.",
      archTitle: "How it works",
      archSubtitle:
        "Six tightly-integrated layers that turn a single chat message into real, targeted support.",
      tryDemoInstant: "See the populated dashboard",
    },
    chat: {
      title: "Chat with Sahabat",
      subtitle: "A safe space. Talk in BM, EN, or Manglish — whatever feels right.",
      placeholder: "What's on your mind today?",
      send: "Send",
    },
    journal: {
      title: "60-second check-in",
      subtitle: "A tiny moment for yourself. How are you today?",
      mood: "How's your mood?",
      sleep: "How many hours did you sleep?",
      note: "Anything you want to note?",
      save: "Save check-in",
    },
    dashboard: {
      title: "Your wellbeing",
      subtitle: "A gentle mirror of the past 30 days.",
      score: "Wellbeing score",
      trend: "30-day trend",
      suggestion: "Today's suggestion",
      streak: "Day streak",
    },
    discover: {
      title: "Programs for you",
      subtitle: "Curated youth programs across Malaysia — picked for where you are today.",
    },
    buddy: {
      title: "Find a buddy",
      subtitle: "Anonymous peer matching with other youth walking a similar path.",
      cta: "Opt in to match",
    },
    admin: {
      title: "Partner dashboard",
      subtitle: "Anonymised wellbeing signals across your cohort.",
    },
    auth: {
      loginTitle: "Welcome back",
      loginSubtitle: "Your Sahabat has been waiting.",
      signupTitle: "Create your space",
      signupSubtitle: "Anonymous handles allowed. PDPA-compliant.",
      email: "Email",
      password: "Password",
      handle: "Handle (optional, anonymous)",
      login: "Log in",
      signup: "Create account",
      noAccount: "No account yet?",
      hasAccount: "Already with us?",
    },
    crisis: {
      label: "In crisis right now?",
      taliankasih: "Talian Kasih 15999",
      befrienders: "Befrienders KL 03-7627 2929",
    },
  },
  bm: {
    nav: {
      chat: "Sembang",
      journal: "Jurnal",
      dashboard: "Papan Pemuka",
      discover: "Terokai",
      buddy: "Rakan",
      login: "Log masuk",
      signup: "Daftar",
      getStarted: "Mula sekarang",
    },
    landing: {
      heroBadge: "Untuk belia Malaysia · ICYOUTH 2026 · UPM",
      heroTitle: "Sahabat yang mendengar.",
      heroSubtitle:
        "Kawan AI kamu. Sentiasa mendengar. Sentiasa menghubungkan kamu dengan bantuan yang kamu layak.",
      tryDemo: "Mula sekarang — percuma",
      seeFeatures: "Lihat cara ia bekerja",
      problemStat: "1 dari 3",
      problemTitle: "1 daripada 3 belia Malaysia mengalami tekanan mental.",
      problemBody:
        "NHMS 2022 menunjukkan krisis senyap. Perkhidmatan sedia ada reaktif, terpecah, dan jarang dalam bahasa belia kita. SAHABAT.AI dibina untuk mengubahnya — cegah, sokong, sambung semula.",
      featuresTitle: "Sahabat untuk kehidupan sebenar",
      featuresSubtitle:
        "Bukan sekadar chatbot. Enam lapisan AI bekerjasama menemui belia di mana mereka berada.",
      features: [
        {
          title: "Pendengar yang empati",
          body: "Dikuasakan Claude, memahami budaya, mendengar tanpa menghukum dalam BM, BI, dan Manglish.",
        },
        {
          title: "Enjin risiko kesejahteraan",
          body: "Isyarat selaras PHQ-9 menghasilkan skor 0–100 dan tahap Hijau/Kuning/Jingga/Merah.",
        },
        {
          title: "Pencadang program",
          body: "Program NGO, UPM, dan KBS yang dipadankan secara vektor untuk saat anda.",
        },
        {
          title: "Padanan rakan sebaya",
          body: "Padanan tanpa nama dengan belia lain yang melalui pengalaman serupa.",
        },
        {
          title: "Eskalasi krisis",
          body: "Talian Kasih 15999 dan Befrienders KL sentiasa dalam satu sentuhan.",
        },
        {
          title: "Semakan harian",
          body: "Semakan 60 saat setiap hari memperoleh XP, membuka quests komuniti.",
        },
      ],
      ctaTitle: "Bersedia untuk bertemu Sahabat anda?",
      ctaBody: "Percuma untuk semua belia Malaysia. Patuh PDPA. Nama samaran dibenarkan.",
      demoTitle: "Tonton dalam 2 minit",
      demoSubtitle:
        "Walkthrough ringkas — sembang, enjin risiko, dan padanan program. Tanpa pendaftaran.",
      archTitle: "Cara ia berfungsi",
      archSubtitle:
        "Enam lapisan bersepadu yang mengubah satu mesej sembang menjadi sokongan sebenar dan tersasar.",
      tryDemoInstant: "Lihat papan pemuka berisi",
    },
    chat: {
      title: "Sembang dengan Sahabat",
      subtitle: "Ruang selamat. Borak dalam BM, BI, atau Manglish — ikut selera kamu.",
      placeholder: "Apa yang bermain di fikiran anda hari ini?",
      send: "Hantar",
    },
    journal: {
      title: "Semakan 60 saat",
      subtitle: "Detik kecil untuk diri sendiri. Apa khabar hari ini?",
      mood: "Bagaimana mood anda?",
      sleep: "Berapa jam anda tidur?",
      note: "Ada apa yang ingin dicatat?",
      save: "Simpan semakan",
    },
    dashboard: {
      title: "Kesejahteraan anda",
      subtitle: "Cermin lembut 30 hari lalu.",
      score: "Skor kesejahteraan",
      trend: "Trend 30 hari",
      suggestion: "Cadangan hari ini",
      streak: "Hari berturut",
    },
    discover: {
      title: "Program untuk anda",
      subtitle: "Program belia seluruh Malaysia — dipilih untuk keadaan anda hari ini.",
    },
    buddy: {
      title: "Cari rakan",
      subtitle: "Padanan tanpa nama dengan belia lain yang meniti jalan serupa.",
      cta: "Sertai padanan",
    },
    admin: {
      title: "Papan pemuka rakan kongsi",
      subtitle: "Isyarat kesejahteraan tanpa nama merentas kohort anda.",
    },
    auth: {
      loginTitle: "Selamat kembali",
      loginSubtitle: "Sahabat anda sedia menanti.",
      signupTitle: "Cipta ruang anda",
      signupSubtitle: "Nama samaran dibenarkan. Patuh PDPA.",
      email: "E-mel",
      password: "Kata laluan",
      handle: "Nama samaran (pilihan)",
      login: "Log masuk",
      signup: "Cipta akaun",
      noAccount: "Belum ada akaun?",
      hasAccount: "Sudah bersama kami?",
    },
    crisis: {
      label: "Dalam krisis sekarang?",
      taliankasih: "Talian Kasih 15999",
      befrienders: "Befrienders KL 03-7627 2929",
    },
  },
};

export type Dictionary = DictionaryShape;
