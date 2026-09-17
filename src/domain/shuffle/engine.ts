import { BUDGET_OPTIONS, TIME_OPTIONS } from "./options";
import type { Activity, Rating, ShuffleContext, ShuffleFilters } from "@/types";

const ratingWeight: Record<Rating, number> = { love: 1.35, fun: 1.15, okay: 0.9, skip: 0.35 };

export function eligibleActivities(pool: Activity[], filters: ShuffleFilters, context: ShuffleContext = {}) {
  const maxBudget = BUDGET_OPTIONS.find((option) => option.value === filters.budget)?.max ?? Infinity;
  const maxMinutes = TIME_OPTIONS.find((option) => option.value === filters.time)?.maxMinutes ?? Infinity;

  return pool.filter((activity) => {
    if (!activity.enabled || !activity.modes.includes(filters.mode)) return false;
    if (context.city && activity.cities && !activity.cities.includes(context.city)) return false;
    if (context.excludedCategories?.includes(activity.category)) return false;
    if (activity.budget.min > maxBudget) return false;
    if (activity.durationMinutes.max > maxMinutes) return false;
    return filters.mood === "any" || activity.moods.includes("any") || activity.moods.includes(filters.mood);
  });
}

export function activityWeight(activity: Activity, context: ShuffleContext = {}) {
  let weight = 1;
  const recentIndex = context.recentIds?.indexOf(activity.id) ?? -1;
  if (recentIndex === 0) weight *= 0.03;
  else if (recentIndex > 0) weight *= Math.min(0.75, 0.25 + recentIndex * 0.1);
  if (context.favoriteCategories?.includes(activity.category)) weight *= 1.18;
  if (context.ratings?.[activity.id]) weight *= ratingWeight[context.ratings[activity.id]];
  if (activity.kind === "mini-plan") weight *= 0.42;
  if (activity.source === "custom") weight *= 1.2;
  return weight;
}

export function shuffleActivity(pool: Activity[], filters: ShuffleFilters, context: ShuffleContext = {}) {
  const eligible = eligibleActivities(pool, filters, context);
  if (eligible.length === 0) return null;
  const weighted = eligible.map((activity) => ({ activity, weight: activityWeight(activity, context) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let cursor = (context.random ?? Math.random)() * total;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) return item.activity;
  }
  return weighted.at(-1)?.activity ?? null;
}
