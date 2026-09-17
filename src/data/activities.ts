import { ACTIVITY_SEEDS } from "./catalog/activity-seeds";
import type { Activity } from "@/types";

const modeCopy = {
  solo: "Tự dành cho mình một buổi thật dễ chịu.",
  couple: "Cùng nhau biến nó thành một buổi hẹn nhỏ.",
  friends: "Rủ hội bạn đi cùng cho vui.",
} as const;

export const activities: Activity[] = ACTIVITY_SEEDS.flatMap(
  (seed, seedIndex) =>
    (["solo", "couple", "friends"] as const).map((mode) => ({
      id: `built-in-${seedIndex + 1}-${mode}`,
      kind: "activity" as const,
      title: seed.title,
      description: `${seed.description} ${modeCopy[mode]}`,
      emoji: seed.emoji,
      image: seed.image,
      modes: [mode],
      moods: seed.moods,
      category: seed.category,
      cities: seed.cities,
      budget: { min: seed.budget[0], max: seed.budget[1] },
      durationMinutes: { min: seed.minutes[0], max: seed.minutes[1] },
      challenge: seed.challenge,
      source: "built-in" as const,
      enabled: true,
    })),
);

export const builtInPool = activities;
