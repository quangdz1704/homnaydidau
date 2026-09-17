import { describe, expect, it } from "vitest";
import { activities } from "../../data/activities";
import { createTimeAwareResult } from "./planner";
import type { ShuffleFilters } from "@/types";

const base: ShuffleFilters = { mode: "solo", mood: "chill", budget: "500k", time: "1h" };
const context = { random: () => 0.13 };

describe("time-aware planner", () => {
  it("một giờ chỉ trả một hoạt động", () => {
    const result = createTimeAwareResult(activities, base, context);
    expect(result?.kind).toBe("activity");
    expect(result?.planDetails).toBeUndefined();
  });

  it("2–3 giờ tạo plan tối đa hai chặng", () => {
    const result = createTimeAwareResult(activities, { ...base, time: "3h" }, context);
    expect(result?.kind).toBe("mini-plan");
    expect(result?.planDetails).toHaveLength(2);
    expect(result!.durationMinutes.max).toBeLessThanOrEqual(180);
  });

  it("nửa ngày tạo ba chặng khác nhau và có lựa chọn chi tiết", () => {
    const result = createTimeAwareResult(activities, { ...base, time: "halfday" }, context);
    expect(result?.planDetails).toHaveLength(3);
    expect(new Set(result?.planDetails?.map((step) => step.activityId)).size).toBe(3);
    expect(result?.planDetails?.every((step) => step.choices.length > 0)).toBe(true);
  });

  it.each([
    ["evening", 3],
    ["allday", 4],
  ] as const)("%s tạo đúng số chặng theo nhịp plan", (time, expected) => {
    const result = createTimeAwareResult(activities, { ...base, time, budget: "any" }, context);
    expect(result?.planDetails).toHaveLength(expected);
  });

  it("giữ tổng budget tối thiểu trong mức đã chọn", () => {
    const result = createTimeAwareResult(activities, { ...base, budget: "300k", time: "halfday" }, context);
    expect(result!.budget.min).toBeLessThanOrEqual(300_000);
  });
});
