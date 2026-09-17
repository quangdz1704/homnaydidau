import { describe, expect, it } from "vitest";
import { getGeoapifyCategories, getPlaceTypeLabel } from "./geoapify";

describe("Geoapify place configuration", () => {
  it("prioritizes cuisine categories from Vietnamese choices", () => {
    expect(getGeoapifyCategories("food", "Sushi và sashimi")).toContain("catering.restaurant.japanese");
    expect(getGeoapifyCategories("food", "Lẩu Thái")).toContain("catering.restaurant.thai");
    expect(getGeoapifyCategories("active", "Đi bơi")).toContain("sport.swimming_pool");
  });

  it("maps provider categories to Vietnamese labels", () => {
    expect(getPlaceTypeLabel(["sport.swimming_pool"])).toBe("Bể bơi");
    expect(getPlaceTypeLabel(["catering.restaurant.vietnamese"])).toBe("Nhà hàng");
  });
});
