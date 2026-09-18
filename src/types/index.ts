export type Mode = "solo" | "couple" | "friends";
export type CityKey = "bacninh" | "hanoi" | "hcm" | "danang";
export type Mood = "chill" | "party" | "romantic" | "explore" | "wild" | "any";
export type BudgetKey = "free" | "100k" | "300k" | "500k" | "1m" | "any";
export type TimeKey = "1h" | "3h" | "evening" | "halfday" | "allday";
export type Category =
  | "food"
  | "cafe"
  | "movie"
  | "outdoor"
  | "creative"
  | "game"
  | "discover"
  | "chill"
  | "active"
  | "learn"
  | "home";

export interface PlanStep {
  id: string;
  activityId: string;
  title: string;
  description: string;
  emoji: string;
  category: Category;
  durationMinutes: number;
  budget: { min: number; max: number };
  choicePrompt: string;
  choices: string[];
  selectedChoice?: string;
  searchQuery?: string;
}

export interface Activity {
  id: string;
  kind: "activity" | "mini-plan";
  title: string;
  description: string;
  emoji: string;
  image?: string;
  modes: Mode[];
  moods: Mood[];
  category: Category;
  cities?: CityKey[];
  budget: { min: number; max: number };
  durationMinutes: { min: number; max: number };
  challenge: string;
  steps?: string[];
  planDetails?: PlanStep[];
  source: "built-in" | "custom";
  enabled: boolean;
}

export interface ShuffleFilters {
  mode: Mode;
  mood: Mood;
  budget: BudgetKey;
  time: TimeKey;
}

export type Rating = "love" | "fun" | "okay" | "skip";

export interface SavedActivity {
  id: string;
  activity: Activity;
  savedAt: number;
}

export interface HistoryEntry {
  id: string;
  activity: Activity;
  completedAt: number;
  rating: Rating;
  note?: string;
}

export interface Preferences {
  onboardingComplete: boolean;
  mode: Mode;
  city: CityKey;
  reducedMotion: boolean;
  excludedCategories: Category[];
}

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  label?: string;
  accuracyMeters?: number;
}

export interface PlaceSuggestion {
  id: string;
  name: string;
  address: string;
  distanceMeters?: number;
  googleMapsUri: string;
  primaryType?: string;
  fitScore: number;
}

export interface TrendSuggestion {
  id: string;
  title: string;
  emoji: string;
  description: string;
  query: string;
  categories: Category[];
  cities?: CityKey[];
  image?: string;
}

export interface ExploreReview {
  id: string;
  itemId: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export type ExploreItemKind = "food" | "drink" | "activity" | "place";

export interface ExploreItem {
  id: string;
  kind: ExploreItemKind;
  title: string;
  description: string;
  emoji: string;
  image?: string;
  category: Category;
  city?: CityKey;
  query?: string;
}

export type PlaceSearchResponse =
  | { source: "geoapify"; places: PlaceSuggestion[]; attribution: string }
  | { source: "trend-pack"; trends: TrendSuggestion[]; message: string };

export interface ShuffleContext {
  city?: CityKey;
  recentIds?: string[];
  ratings?: Record<string, Rating>;
  favoriteCategories?: Category[];
  excludedCategories?: Category[];
  random?: () => number;
}
