import type { Activity, HistoryEntry, Preferences, SavedActivity } from "@/types";

export interface ShuffleRepository {
  getPreferences(): Preferences;
  savePreferences(preferences: Preferences): void;
  getSavedActivities(): Promise<SavedActivity[]>;
  saveActivity(activity: Activity): Promise<void>;
  removeSavedActivity(activityId: string): Promise<void>;
  getHistory(): Promise<HistoryEntry[]>;
  addHistory(entry: HistoryEntry): Promise<void>;
  getCustomActivities(): Promise<Activity[]>;
  addCustomActivity(activity: Activity): Promise<void>;
  updateCustomActivity(activity: Activity): Promise<void>;
  deleteCustomActivity(activityId: string): Promise<void>;
}
