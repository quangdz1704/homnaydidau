import { describe, expect, it } from "vitest";
import { activityWeight, eligibleActivities, shuffleActivity } from "./engine";
import type { Activity, ShuffleFilters } from "@/types";

const base: Activity = {
  id: "base", kind: "activity", title: "Kèo test", description: "Một kèo để test", emoji: "🎲",
  modes: ["solo"], moods: ["chill"], category: "chill", budget: { min: 0, max: 0 },
  durationMinutes: { min: 30, max: 60 }, challenge: "Vui lên", source: "built-in", enabled: true,
};
const filters: ShuffleFilters = { mode: "solo", mood: "chill", budget: "100k", time: "1h" };

describe("shuffle engine", () => {
  it("không trả kèo chỉ dành cho couple khi đang solo", () => {
    expect(eligibleActivities([{ ...base, modes: ["couple"] }], filters)).toHaveLength(0);
  });
  it("budget 100k không trả kèo tối thiểu 500k", () => {
    expect(eligibleActivities([{ ...base, budget: { min: 500_000, max: 700_000 } }], filters)).toHaveLength(0);
  });
  it("một giờ không trả kèo cần cả ngày", () => {
    expect(eligibleActivities([{ ...base, durationMinutes: { min: 300, max: 600 } }], filters)).toHaveLength(0);
  });
  it("kèo vừa xuất hiện bị giảm mạnh trọng số", () => {
    expect(activityWeight(base, { recentIds: [base.id] })).toBeLessThan(activityWeight(base));
  });
  it("custom activity tham gia pool", () => {
    const custom = { ...base, id: "custom", source: "custom" as const };
    expect(shuffleActivity([custom], filters, { random: () => 0.5 })).toEqual(custom);
  });
  it("trả null khi không có kèo phù hợp", () => {
    expect(shuffleActivity([{ ...base, enabled: false }], filters)).toBeNull();
  });
  it("không trả hoạt động địa phương của thành phố khác", () => {
    const bacNinhOnly = { ...base, cities: ["bacninh" as const] };
    expect(eligibleActivities([bacNinhOnly], filters, { city: "hanoi" })).toHaveLength(0);
    expect(eligibleActivities([bacNinhOnly], filters, { city: "bacninh" })).toHaveLength(1);
  });
});
