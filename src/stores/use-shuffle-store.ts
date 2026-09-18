"use client";

import { create } from "zustand";
import { builtInPool } from "@/data/activities";
import { createTimeAwareResult } from "@/domain/shuffle/planner";
import { shuffleRepository } from "@/repositories/local/local-shuffle-repository";
import type { Activity, BudgetKey, Category, CityKey, CurrentLocation, HistoryEntry, Mode, Mood, Preferences, Rating, SavedActivity, ShuffleFilters, TimeKey } from "@/types";

type View = "discover" | "library" | "saved" | "history" | "me";

interface ShuffleState {
  hydrated: boolean;
  hydrating: boolean;
  view: View;
  preferences: Preferences;
  filters: ShuffleFilters;
  current: Activity | null;
  shuffleAttempted: boolean;
  isShuffling: boolean;
  recentIds: string[];
  saved: SavedActivity[];
  history: HistoryEntry[];
  custom: Activity[];
  currentLocation: CurrentLocation | null;
  hydrate: () => Promise<void>;
  setView: (view: View) => void;
  setFilter: <K extends keyof ShuffleFilters>(key: K, value: ShuffleFilters[K]) => void;
  surprise: () => void;
  shuffle: () => Promise<void>;
  completeOnboarding: (mode: Mode) => void;
  toggleSaved: (activity: Activity) => Promise<void>;
  completeActivity: (activity: Activity, rating: Rating, note?: string) => Promise<void>;
  addCustom: (activity: Activity) => Promise<void>;
  deleteCustom: (id: string) => Promise<void>;
  toggleCategory: (category: Category) => void;
  setCity: (city: CityKey) => void;
  setCurrentLocation: (location: CurrentLocation | null) => void;
  setReducedMotion: (value: boolean) => void;
  chooseActivity: (activity: Activity) => void;
  choosePlanStepOption: (stepId: string, choice: string) => void;
}

const initialPreferences: Preferences = { onboardingComplete: false, mode: "solo", city: "bacninh", reducedMotion: false, excludedCategories: [] };
const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export const useShuffleStore = create<ShuffleState>((set, get) => ({
  hydrated: false,
  hydrating: false,
  view: "discover",
  preferences: initialPreferences,
  filters: { mode: "solo", mood: "chill", budget: "300k", time: "3h" },
  current: null,
  shuffleAttempted: false,
  isShuffling: false,
  recentIds: [],
  saved: [],
  history: [],
  custom: [],
  currentLocation: null,

  hydrate: async () => {
    if (get().hydrated || get().hydrating) return;
    set({ hydrating: true });
    const preferences = shuffleRepository.getPreferences();
    try {
      const [saved, history, custom] = await Promise.all([
        shuffleRepository.getSavedActivities(),
        shuffleRepository.getHistory(),
        shuffleRepository.getCustomActivities(),
      ]);
      set({ preferences, filters: { ...get().filters, mode: preferences.mode }, saved, history, custom, hydrated: true, hydrating: false });
    } catch {
      set({ preferences, filters: { ...get().filters, mode: preferences.mode }, hydrated: true, hydrating: false });
    }
  },

  setView: (view) => set({ view }),
  setFilter: (key, value) => {
    set((state) => ({ filters: { ...state.filters, [key]: value } }));
    if (key === "mode") {
      const preferences = { ...get().preferences, mode: value as Mode };
      shuffleRepository.savePreferences(preferences);
      set({ preferences });
    }
  },
  surprise: () => set((state) => ({
    filters: {
      mode: state.filters.mode,
      mood: "any" as Mood,
      budget: "any" as BudgetKey,
      time: (["1h", "3h", "evening", "halfday", "allday"] as TimeKey[])[Math.floor(Math.random() * 5)],
    },
  })),
  shuffle: async () => {
    const state = get();
    set({ isShuffling: true });
    await wait(state.preferences.reducedMotion ? 250 : 1050);
    const ratings = Object.fromEntries(state.history.map((entry) => [entry.activity.id, entry.rating]));
    const favoriteCategories = state.history.filter((entry) => entry.rating === "love").map((entry) => entry.activity.category);
    const activity = createTimeAwareResult([...builtInPool, ...state.custom], state.filters, {
      city: state.preferences.city,
      recentIds: state.recentIds,
      ratings,
      favoriteCategories,
      excludedCategories: state.preferences.excludedCategories,
    });
    set({
      current: activity,
      shuffleAttempted: true,
      isShuffling: false,
      recentIds: activity ? [activity.id, ...state.recentIds.filter((id) => id !== activity.id)].slice(0, 8) : state.recentIds,
    });
  },
  completeOnboarding: (mode) => {
    const preferences = { ...get().preferences, onboardingComplete: true, mode };
    shuffleRepository.savePreferences(preferences);
    set((state) => ({ preferences, filters: { ...state.filters, mode } }));
  },
  toggleSaved: async (activity) => {
    const exists = get().saved.some((record) => record.id === activity.id);
    if (exists) await shuffleRepository.removeSavedActivity(activity.id);
    else await shuffleRepository.saveActivity(activity);
    set({ saved: await shuffleRepository.getSavedActivities() });
  },
  completeActivity: async (activity, rating, note) => {
    await shuffleRepository.addHistory({ id: `${activity.id}-${Date.now()}`, activity, completedAt: Date.now(), rating, note });
    set({ history: await shuffleRepository.getHistory(), current: null, view: "history" });
  },
  addCustom: async (activity) => {
    await shuffleRepository.addCustomActivity(activity);
    set({ custom: await shuffleRepository.getCustomActivities() });
  },
  deleteCustom: async (id) => {
    await shuffleRepository.deleteCustomActivity(id);
    set({ custom: await shuffleRepository.getCustomActivities() });
  },
  toggleCategory: (category) => {
    const current = get().preferences.excludedCategories;
    const excludedCategories = current.includes(category) ? current.filter((item) => item !== category) : [...current, category];
    const preferences = { ...get().preferences, excludedCategories };
    shuffleRepository.savePreferences(preferences);
    set({ preferences });
  },
  setCity: (city) => {
    const preferences = { ...get().preferences, city };
    shuffleRepository.savePreferences(preferences);
    set({ preferences });
  },
  setCurrentLocation: (currentLocation) => set({ currentLocation }),
  setReducedMotion: (reducedMotion) => {
    const preferences = { ...get().preferences, reducedMotion };
    shuffleRepository.savePreferences(preferences);
    set({ preferences });
  },
  chooseActivity: (current) => set({ current, shuffleAttempted: true, view: "discover" }),
  choosePlanStepOption: (stepId, choice) => set((state) => ({
    current: state.current?.planDetails ? {
      ...state.current,
      planDetails: state.current.planDetails.map((step) => step.id === stepId ? { ...step, selectedChoice: choice } : step),
    } : state.current,
  })),
}));
