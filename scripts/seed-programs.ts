/**
 * scripts/seed-programs.ts
 *
 * Seeds the `programs` table with 30 realistic Malaysian youth programs,
 * embedding each one locally via MiniLM-L6-v2 (384 dims) so the pgvector
 * index can do cosine similarity search at serve time.
 *
 * Run
 * ---
 *   npx tsx scripts/seed-programs.ts            # upsert (safe to re-run)
 *   npx tsx scripts/seed-programs.ts --wipe     # TRUNCATE first, then seed
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * First run downloads the ~23MB MiniLM weights to
 *   ~/.cache/huggingface/transformers/  (reused on subsequent runs)
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "node:path";
import { embedMany, toPgVector } from "../src/lib/embedding";
import type { Database } from "../src/lib/supabase/types";

// Load .env.local first (Next.js convention), then .env as a fallback.
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// ---------------------------------------------------------------------------
// Program catalogue — curated, realistic programs aimed at Malaysian youth.
// Keep descriptions ~2-3 sentences; they're what gets embedded.
// ---------------------------------------------------------------------------

type SeedProgram = {
  title: string;
  description: string;
  category: string;
  location: string;
  url?: string;
};

const PROGRAMS: SeedProgram[] = [
  // ---- UPM ----
  {
    title: "UPM Counselling Drop-in",
    description:
      "Non-clinical 20-minute conversations with trained UPM counsellors. Walk in, no referral needed, confidential. Ideal when you need a human to talk to before things escalate.",
    category: "counselling",
    location: "UPM Serdang — Student Wellness Centre",
    url: "https://upm.edu.my/counselling",
  },
  {
    title: "UPM Mindful Mornings",
    description:
      "Ten-minute guided breathwork and grounding exercises held before the first lecture block on Tuesdays and Fridays. Drop in; no attendance list, no pressure.",
    category: "mindfulness",
    location: "UPM Serdang — Quad",
  },
  {
    title: "UPM Student Peer Buddies",
    description:
      "Opt-in peer mentoring for first-year students feeling homesick or overwhelmed. Matched with senior students trained in active listening and campus navigation.",
    category: "peer-support",
    location: "UPM Serdang",
  },
  {
    title: "UPM Sleep Reset Workshop",
    description:
      "Four-week cognitive behavioural workshop for students with chronic sleep struggles. Learn practical wind-down routines tailored for Malaysian student schedules.",
    category: "sleep",
    location: "UPM Serdang — Hybrid",
  },
  {
    title: "UPM Exam Stress Circle",
    description:
      "Small group sessions during midterm and final weeks, led by counsellors. Share what you're carrying, learn micro-coping tools, leave before the hour's up.",
    category: "academic-stress",
    location: "UPM Serdang",
  },

  // ---- MIASA (Malaysian Mental Health Association of Singapore Alternatives) ----
  {
    title: "MIASA Peer Support Circle",
    description:
      "Small, safe peer support group for youth experiencing anxiety, depression, or isolation. Facilitated by trained MIASA volunteers. Free, confidential, no diagnosis required.",
    category: "peer-support",
    location: "PJ — Weekly",
    url: "https://miasa.org.my",
  },
  {
    title: "MIASA Mental Health First Aid",
    description:
      "Two-day workshop teaching youth how to respond when a friend discloses distress. Covers listening skills, boundaries, and how to route peers to professional help.",
    category: "training",
    location: "KL — Monthly",
  },
  {
    title: "MIASA Caregiver Support Group",
    description:
      "For youth supporting a parent or sibling living with mental illness. A quiet space to talk about the weight of caregiving without having to explain it.",
    category: "caregiver",
    location: "PJ — Monthly",
  },
  {
    title: "MIASA Recovery Art Jam",
    description:
      "Monthly art night where lived-experience peers and newcomers paint, journal, or zine together. No art skills required — the craft is the excuse, the room is the point.",
    category: "creative",
    location: "PJ",
  },

  // ---- Befrienders ----
  {
    title: "Befrienders KL 24/7 Line",
    description:
      "Free, confidential emotional support by phone, any time, any reason. Staffed by trained volunteer listeners. Not counselling — real humans who listen without judgement.",
    category: "helpline",
    location: "Nationwide — phone",
    url: "https://www.befrienders.org.my",
  },
  {
    title: "Befrienders KL Volunteer Night",
    description:
      "Monthly open meetup for current and prospective listening volunteers. Share experiences, shadow a shift, decide if the work fits you before committing.",
    category: "volunteer",
    location: "KL — Monthly",
  },
  {
    title: "Befrienders Youth Listening Training",
    description:
      "Intensive training program for youth volunteers aged 18-30. Learn active listening, suicide intervention basics, and self-care for helpers.",
    category: "training",
    location: "KL",
  },

  // ---- KBS / MyBelia ----
  {
    title: "KBS MyBelia Sukan Harian",
    description:
      "Daily 30-minute community sport meetups organised by the Ministry of Youth and Sports. Futsal, badminton, casual runs — no membership, just show up.",
    category: "movement",
    location: "Nationwide — daily",
    url: "https://mybelia.gov.my",
  },
  {
    title: "MyBelia Community Service Corps",
    description:
      "Weekend volunteering trips — tree planting, flood relief packing, soup kitchen shifts. Great for youth who feel purposeless and want to be around people doing something real.",
    category: "volunteer",
    location: "Nationwide",
  },
  {
    title: "KBS Youth Innovation Challenge",
    description:
      "Quarterly hackathons for youth aged 18-25 to pitch community solutions. Free mentorship, small grants for shortlisted teams, plus a real network of Malaysian builders.",
    category: "innovation",
    location: "KL — Quarterly",
  },
  {
    title: "KBS Rakan Muda Camps",
    description:
      "Three-day residential camps in kampung settings focused on outdoor challenge, identity, and resilience. Nominal fee, scholarships available for B40 youth.",
    category: "outdoor",
    location: "Various states",
  },

  // ---- R.AGE ----
  {
    title: "R.AGE Youth Storytelling Lab",
    description:
      "Monthly writing and podcasting workshops teaching youth to turn their own stories into published pieces. Past cohorts have covered mental health, identity, and migration.",
    category: "creative",
    location: "KL — Hybrid, Monthly",
    url: "https://rage.com.my",
  },
  {
    title: "R.AGE Youth Journalism Fellowship",
    description:
      "Paid three-month fellowship for Malaysian youth aged 18-25 interested in investigative and social-impact journalism. Learn from Star Media mentors on a real published project.",
    category: "journalism",
    location: "KL",
  },
  {
    title: "R.AGE Open Mic Nights",
    description:
      "Monthly open-mic for youth — spoken word, music, comedy, anything. Low-pressure room, free entry, supportive crowd. Great first step if you're processing through creativity.",
    category: "creative",
    location: "KL — Monthly",
  },

  // ---- Universities & students ----
  {
    title: "UM Student Mental Health Collective",
    description:
      "Student-run peer group at Universiti Malaya hosting weekly hangouts and monthly awareness talks. Open to students across Klang Valley universities.",
    category: "peer-support",
    location: "UM — Weekly",
  },
  {
    title: "Monash Malaysia Wellness Hub",
    description:
      "Drop-in wellness centre open to all Monash students, offering short consults, mindfulness sessions, and study-life coaching. Free for enrolled students.",
    category: "counselling",
    location: "Monash Sunway",
  },
  {
    title: "Taylor's Mindful Campus Initiative",
    description:
      "Weekly group meditation, yoga, and stress-management workshops open to all Taylor's students. No experience needed; mats provided.",
    category: "mindfulness",
    location: "Taylor's Lakeside",
  },

  // ---- Youth employment / financial ----
  {
    title: "PenjanaKerjaya Youth Career Coaching",
    description:
      "Free one-on-one career coaching for unemployed Malaysian graduates aged 20-30. Covers CV review, interview prep, and mental health support during the job search.",
    category: "career",
    location: "Nationwide — online",
  },
  {
    title: "AKPK Youth Money Clinic",
    description:
      "Free confidential financial coaching from Bank Negara's AKPK, tailored for young Malaysians juggling loans, cost of living, and family obligations.",
    category: "financial",
    location: "Nationwide",
    url: "https://akpk.org.my",
  },

  // ---- Religious / cultural / community ----
  {
    title: "IIUM Qalbu Sejahtera Program",
    description:
      "Islamic-framed mental wellness circles integrating Quranic reflection, counselling, and peer sharing. Open to all students; Muslim-friendly but inclusive tone.",
    category: "faith",
    location: "IIUM Gombak",
  },
  {
    title: "Buddhist Gem Fellowship Youth Dharma",
    description:
      "Weekly dharma classes and meditation circles for youth, with optional peer support chats after. English medium, open to people of all faiths.",
    category: "faith",
    location: "PJ — Weekly",
  },

  // ---- LGBTQ / marginalised ----
  {
    title: "PT Foundation Youth Night",
    description:
      "Safe-space drop-in for LGBTQ+ youth under 30. Confidential, no registration. Snacks, low-key hangouts, and access to counsellors if you want one.",
    category: "safe-space",
    location: "KL",
  },

  // ---- Crisis / acute support ----
  {
    title: "Talian Kasih 15999",
    description:
      "Malaysia's national 24/7 helpline for mental health distress, domestic abuse, and child protection. Free call, BM and English. Anonymous.",
    category: "helpline",
    location: "Nationwide — phone",
  },

  // ---- Mentorship ----
  {
    title: "MyFutureHub Youth Mentorship",
    description:
      "Matched mentorship pairing young professionals aged 22-30 with mentors in their industry of interest. Monthly 1-hour calls, 6-month commitment, fully remote.",
    category: "mentorship",
    location: "Online",
  },
  {
    title: "Leaderonomics Youth Leader Lab",
    description:
      "Nine-week cohort-based program teaching leadership, communication, and resilience for Malaysian youth preparing to enter the workforce.",
    category: "leadership",
    location: "KL + online",
  },
];

// ---------------------------------------------------------------------------

type CliArgs = { wipe: boolean };

function parseArgs(argv: string[]): CliArgs {
  return { wipe: argv.includes("--wipe") };
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required in .env.local`);
  return v;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const supabase = createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  console.log(`[seed] ${PROGRAMS.length} programs queued`);

  if (args.wipe) {
    console.log("[seed] --wipe: clearing existing programs");
    const { error } = await supabase
      .from("programs")
      .delete()
      .not("id", "is", null);
    if (error) throw error;
  }

  // Build the text we want to embed. Title + description + category makes the
  // retrieval much more precise than description alone.
  const inputs = PROGRAMS.map(
    (p) => `${p.title}. ${p.description} Category: ${p.category}. Location: ${p.location}.`,
  );

  console.log(
    `[seed] embedding ${inputs.length} programs via MiniLM-L6-v2 (local)…`,
  );
  const vectors = await embedMany(inputs);

  if (vectors.length !== PROGRAMS.length) {
    throw new Error(
      `Embedding count mismatch: got ${vectors.length}, expected ${PROGRAMS.length}`,
    );
  }

  const rows = PROGRAMS.map((p, i) => ({
    title: p.title,
    description: p.description,
    category: p.category,
    location: p.location,
    url: p.url ?? null,
    // pgvector accepts either number[] or its text form; we use the text form
    // for cross-driver stability.
    embedding: toPgVector(vectors[i]) as unknown as number[],
  }));

  // Upsert by title to keep the script idempotent.
  const { error } = await supabase
    .from("programs")
    .upsert(rows, { onConflict: "title", ignoreDuplicates: false });

  if (error) {
    console.error("[seed] upsert failed:", error);
    process.exit(1);
  }

  console.log(`[seed] ✓ ${rows.length} programs seeded`);
}

main().catch((err) => {
  console.error("[seed] fatal:", err);
  process.exit(1);
});
