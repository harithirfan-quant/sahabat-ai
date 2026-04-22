/**
 * Database types for the Supabase client.
 *
 * Hand-rolled shape that mirrors /supabase/schema.sql. Replace with the
 * output of `supabase gen types typescript` once the project is linked.
 */

export type WellbeingTier = "green" | "yellow" | "orange" | "red";
export type ChatRole = "user" | "assistant" | "system";
export type BuddyStatus = "pending" | "active" | "declined" | "ended";
export type CrisisSeverity = "low" | "medium" | "high" | "critical";

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type UsersRow = {
  id: string;
  handle: string | null;
  language_pref: "en" | "bm";
  created_at: string;
};
type UsersInsert = {
  id: string;
  handle?: string | null;
  language_pref?: "en" | "bm";
  created_at?: string;
};

type JournalsRow = {
  id: string;
  user_id: string;
  mood_score: number;
  sleep_hours: number | null;
  note: string | null;
  sentiment_score: number | null;
  created_at: string;
};
type JournalsInsert = {
  id?: string;
  user_id: string;
  mood_score: number;
  sleep_hours?: number | null;
  note?: string | null;
  sentiment_score?: number | null;
  created_at?: string;
};

type ChatsRow = {
  id: string;
  user_id: string;
  role: ChatRole;
  content: string;
  sentiment: number | null;
  risk_flag: boolean;
  created_at: string;
};
type ChatsInsert = {
  id?: string;
  user_id: string;
  role: ChatRole;
  content: string;
  sentiment?: number | null;
  risk_flag?: boolean;
  created_at?: string;
};

type WellbeingScoresRow = {
  id: string;
  user_id: string;
  score: number;
  tier: WellbeingTier;
  computed_at: string;
};
type WellbeingScoresInsert = {
  id?: string;
  user_id: string;
  score: number;
  tier: WellbeingTier;
  computed_at?: string;
};

type ProgramsRow = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  url: string | null;
  embedding: number[] | null;
  created_at: string;
};
type ProgramsInsert = {
  id?: string;
  title: string;
  description: string;
  category?: string | null;
  location?: string | null;
  url?: string | null;
  embedding?: number[] | null;
  created_at?: string;
};

type BuddyMatchesRow = {
  id: string;
  user_a: string;
  user_b: string;
  similarity: number | null;
  status: BuddyStatus;
  created_at: string;
};
type BuddyMatchesInsert = {
  id?: string;
  user_a: string;
  user_b: string;
  similarity?: number | null;
  status?: BuddyStatus;
  created_at?: string;
};

type CrisisEventsRow = {
  id: string;
  user_id: string;
  severity: CrisisSeverity;
  action_taken: string;
  created_at: string;
};
type CrisisEventsInsert = {
  id?: string;
  user_id: string;
  severity: CrisisSeverity;
  action_taken: string;
  created_at?: string;
};

export type Database = {
  __InternalSupabase: { PostgrestVersion: "12" };
  public: {
    Tables: {
      users: Table<UsersRow, UsersInsert>;
      journals: Table<JournalsRow, JournalsInsert>;
      chats: Table<ChatsRow, ChatsInsert>;
      wellbeing_scores: Table<WellbeingScoresRow, WellbeingScoresInsert>;
      programs: Table<ProgramsRow, ProgramsInsert>;
      buddy_matches: Table<BuddyMatchesRow, BuddyMatchesInsert>;
      crisis_events: Table<CrisisEventsRow, CrisisEventsInsert>;
    };
    Views: Record<string, never>;
    Functions: {
      match_programs: {
        Args: {
          query_embedding: string;
          match_count: number;
          min_similarity: number;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          category: string | null;
          location: string | null;
          url: string | null;
          similarity: number;
        }[];
      };
    };
    Enums: {
      wellbeing_tier: WellbeingTier;
      chat_role: ChatRole;
      buddy_status: BuddyStatus;
      crisis_severity: CrisisSeverity;
    };
    CompositeTypes: Record<string, never>;
  };
};
