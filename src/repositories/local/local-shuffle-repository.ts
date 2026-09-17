import type { ShuffleRepository } from "../shuffle-repository";
import type { Activity, HistoryEntry, Preferences, SavedActivity } from "@/types";

const DATABASE_NAME = "shuffle-local";
const DATABASE_VERSION = 1;
const PREFERENCES_KEY = "shuffle:preferences";
const PREFERENCES_VERSION = 3;
const defaults: Preferences = {
  onboardingComplete: false,
  mode: "solo",
  city: "bacninh",
  reducedMotion: false,
  excludedCategories: [],
};

type StoreName = "saved" | "history" | "custom";
let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("saved")) database.createObjectStore("saved", { keyPath: "id" });
      if (!database.objectStoreNames.contains("history")) database.createObjectStore("history", { keyPath: "id" });
      if (!database.objectStoreNames.contains("custom")) database.createObjectStore("custom", { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      databasePromise = undefined;
      reject(request.error);
    };
  });
  return databasePromise;
}

async function getAll<T>(storeName: StoreName): Promise<T[]> {
  if (typeof indexedDB === "undefined") return [];
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

async function put<T>(storeName: StoreName, value: T) {
  if (typeof indexedDB === "undefined") return;
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = database.transaction(storeName, "readwrite").objectStore(storeName).put(value);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function remove(storeName: StoreName, key: string) {
  if (typeof indexedDB === "undefined") return;
  const database = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const request = database.transaction(storeName, "readwrite").objectStore(storeName).delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export class LocalShuffleRepository implements ShuffleRepository {
  getPreferences() {
    if (typeof localStorage === "undefined") return defaults;
    try {
      const stored = JSON.parse(localStorage.getItem(PREFERENCES_KEY) ?? "{}") as { version?: number; data?: Partial<Preferences> } & Partial<Preferences>;
      const data = stored.data ?? stored;
      const migrateToNorthernDefault = (stored.version ?? 0) < PREFERENCES_VERSION && (data.city === "hcm" || data.city === "danang");
      return { ...defaults, ...data, ...(migrateToNorthernDefault ? { city: "bacninh" as const } : {}) } as Preferences;
    } catch {
      return defaults;
    }
  }

  savePreferences(preferences: Preferences) {
    if (typeof localStorage !== "undefined") localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ version: PREFERENCES_VERSION, data: preferences }));
  }

  async getSavedActivities() {
    const records = await getAll<SavedActivity>("saved");
    return records.sort((a, b) => b.savedAt - a.savedAt);
  }

  async saveActivity(activity: Activity) {
    await put<SavedActivity>("saved", { id: activity.id, activity, savedAt: Date.now() });
  }

  async removeSavedActivity(activityId: string) {
    await remove("saved", activityId);
  }

  async getHistory() {
    const records = await getAll<HistoryEntry>("history");
    return records.sort((a, b) => b.completedAt - a.completedAt);
  }

  async addHistory(entry: HistoryEntry) {
    await put("history", entry);
  }

  async getCustomActivities() {
    return getAll<Activity>("custom");
  }

  async addCustomActivity(activity: Activity) {
    await put("custom", activity);
  }

  async updateCustomActivity(activity: Activity) {
    await put("custom", activity);
  }

  async deleteCustomActivity(activityId: string) {
    await remove("custom", activityId);
  }
}

export const shuffleRepository = new LocalShuffleRepository();
