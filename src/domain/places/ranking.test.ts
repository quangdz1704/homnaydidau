import { describe, expect, it } from "vitest";
import { calculateFitScore, calculateQueryRelevance, formatDistance } from "./ranking";

describe("place ranking", () => {
  it("rewards nearby and query-relevant places", () => {
    const closeMatch = calculateFitScore({ distanceMeters: 800, rank: 0, relevance: 1 });
    const farResult = calculateFitScore({ distanceMeters: 9_000, rank: 4, relevance: 0 });
    expect(closeMatch).toBeGreaterThan(farResult);
    expect(closeMatch).toBeLessThanOrEqual(99);
  });

  it("matches Vietnamese text without accents", () => {
    expect(calculateQueryRelevance("phở bò", "Phở Bò Nam Định")).toBeGreaterThan(0.5);
  });

  it("formats walking-scale and city-scale distances", () => {
    expect(formatDistance(430)).toBe("450 m");
    expect(formatDistance(1_250)).toBe("1,3 km");
    expect(formatDistance()).toBeUndefined();
  });
});
