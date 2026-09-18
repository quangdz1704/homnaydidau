import { BUDGET_OPTIONS, TIME_OPTIONS } from "./options";
import { eligibleActivities, shuffleActivity } from "./engine";
import { choicesForActivity } from "../../data/catalog/plan-choices";
import type { Activity, Category, PlanStep, ShuffleContext, ShuffleFilters, TimeKey } from "@/types";

const planConfig: Record<Exclude<TimeKey, "1h">, { count: number; minutes: number; title: string; description: string; emoji: string }> = {
  "3h": { count: 2, minutes: 180, title: "Một buổi vừa đủ vui", description: "Hai chặng nối tiếp, không vội mà cũng không bị loãng.", emoji: "🌤️" },
  evening: { count: 3, minutes: 270, title: "Tối nay có kèo", description: "Ăn một chút, chơi một chút, kết thúc bằng một điều đáng nhớ.", emoji: "🌇" },
  halfday: { count: 3, minutes: 360, title: "Nửa ngày đổi gió", description: "Ba chặng có mở đầu, có điểm nhấn và có khoảng thở.", emoji: "☀️" },
  allday: { count: 4, minutes: 600, title: "Một ngày để nhớ", description: "Một hành trình nhỏ từ lúc bắt đầu đến khi thành phố lên đèn.", emoji: "🗺️" },
};

const sequences: Record<ShuffleFilters["mood"], Category[]> = {
  chill: ["food", "cafe", "learn", "outdoor", "chill"],
  party: ["food", "game", "discover", "food", "cafe"],
  romantic: ["food", "cafe", "outdoor", "creative", "chill"],
  explore: ["food", "discover", "cafe", "learn", "outdoor"],
  wild: ["food", "game", "discover", "creative", "food"],
  any: ["food", "cafe", "discover", "learn", "outdoor"],
};

function categoriesFor(filters: ShuffleFilters) {
  if (filters.mood !== "any") return sequences[filters.mood];
  if (filters.mode === "couple") return sequences.romantic;
  if (filters.mode === "friends") return sequences.party;
  return sequences.chill;
}

function withPlannedDurations(activities: Activity[], targetMinutes: number) {
  const durations = activities.map((activity) => activity.durationMinutes.min);
  let spare = Math.max(0, targetMinutes - durations.reduce((sum, value) => sum + value, 0));
  activities.forEach((activity, index) => {
    const laterSteps = activities.length - index;
    const extra = Math.min(activity.durationMinutes.max - durations[index], Math.floor(spare / laterSteps));
    durations[index] += extra;
    spare -= extra;
  });
  return durations;
}

function toPlanStep(activity: Activity, index: number, durationMinutes: number): PlanStep {
  const choiceConfig = choicesForActivity(activity.title, activity.category);
  const choices = choiceConfig.choices.filter(
    (choice) => choice.localeCompare(activity.title, "vi", { sensitivity: "base" }) !== 0,
  );
  return {
    id: `step-${index + 1}-${activity.id}`,
    activityId: activity.id,
    title: activity.title,
    description: activity.description,
    emoji: activity.emoji,
    category: activity.category,
    durationMinutes,
    budget: activity.budget,
    choicePrompt: choiceConfig.prompt,
    choices: choices.length ? choices : ["Để xúc xắc chọn một cách làm mới"],
    searchQuery: choiceConfig.searchQuery,
  };
}

export function createTimeAwareResult(pool: Activity[], filters: ShuffleFilters, context: ShuffleContext = {}): Activity | null {
  const singles = pool.filter((activity) => activity.kind === "activity");
  if (filters.time === "1h") return shuffleActivity(singles, filters, context);

  const config = planConfig[filters.time];
  const maxBudget = BUDGET_OPTIONS.find((option) => option.value === filters.budget)?.max ?? Number.POSITIVE_INFINITY;
  const maxMinutes = TIME_OPTIONS.find((option) => option.value === filters.time)?.maxMinutes ?? config.minutes;
  const selectionFilters: ShuffleFilters = { ...filters, mood: "any" };
  const eligible = eligibleActivities(singles, selectionFilters, context);
  const selected: Activity[] = [];
  let remainingMinutes = Math.min(config.minutes, maxMinutes);
  let remainingBudget = maxBudget;

  for (const category of categoriesFor(filters).slice(0, config.count)) {
    const stepsLeft = config.count - selected.length - 1;
    const fits = (activity: Activity) =>
      !selected.some((item) => item.id === activity.id || item.title === activity.title) &&
      activity.durationMinutes.min <= remainingMinutes - stepsLeft * 30 &&
      activity.budget.min <= remainingBudget;
    const categoryPool = eligible.filter((activity) => activity.category === category && fits(activity));
    const openingBreakfast = selected.length === 0 && ["halfday", "allday"].includes(filters.time)
      ? categoryPool.filter((activity) => activity.title.toLowerCase().includes("sáng"))
      : [];
    const fallbackPool = eligible.filter(fits);
    const activity = shuffleActivity(openingBreakfast.length ? openingBreakfast : categoryPool.length ? categoryPool : fallbackPool, selectionFilters, {
      ...context,
      recentIds: [...selected.map((item) => item.id), ...(context.recentIds ?? [])],
    });
    if (!activity) continue;
    selected.push(activity);
    remainingMinutes -= activity.durationMinutes.min;
    remainingBudget -= activity.budget.min;
  }

  if (!selected.length) return null;
  if (selected.length === 1) return selected[0];

  const durations = withPlannedDurations(selected, Math.min(config.minutes, maxMinutes));
  const planDetails = selected.map((activity, index) => toPlanStep(activity, index, durations[index]));
  const minBudget = selected.reduce((sum, activity) => sum + activity.budget.min, 0);
  const naturalMaxBudget = selected.reduce((sum, activity) => sum + activity.budget.max, 0);
  const plannedMaxBudget = Number.isFinite(maxBudget) ? Math.min(naturalMaxBudget, maxBudget) : naturalMaxBudget;
  const totalMinutes = durations.reduce((sum, duration) => sum + duration, 0);

  return {
    id: `plan-${Date.now()}-${selected.map((activity) => activity.id).join("-")}`,
    kind: "mini-plan",
    title: config.title,
    description: config.description,
    emoji: config.emoji,
    modes: [filters.mode],
    moods: [filters.mood],
    category: selected[0].category,
    budget: { min: minBudget, max: Math.max(minBudget, plannedMaxBudget) },
    durationMinutes: { min: totalMinutes, max: totalMinutes },
    challenge: selected[Math.floor((context.random ?? Math.random)() * selected.length)].challenge,
    steps: selected.map((activity) => activity.title),
    planDetails,
    source: "built-in",
    enabled: true,
  };
}
