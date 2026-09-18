import { describe, expect, it } from "vitest";
import { getTrendSuggestions } from "../places";
import { ACTIVITY_SEEDS } from "./activity-seeds";
import { FOOD_AND_DRINK_CATALOG, FOOD_OPTIONS } from "./food-and-drinks";
import { choicesForActivity } from "./plan-choices";

describe("Vietnamese content catalog", () => {
  it("contains a varied list of unique activities", () => {
    const titles = ACTIVITY_SEEDS.map((activity) => activity.title);
    expect(titles.length).toBeGreaterThanOrEqual(60);
    expect(new Set(titles).size).toBe(titles.length);
    expect(titles).toEqual(expect.arrayContaining(["Đi bơi", "Đi siêu thị", "Xem phim ngoài rạp", "Xem phim tại nhà", "Dạo công viên"]));
  });

  it("keeps food groups separately manageable", () => {
    expect(FOOD_AND_DRINK_CATALOG.lightSnacks.length).toBeGreaterThanOrEqual(10);
    expect(FOOD_AND_DRINK_CATALOG.drinks.length).toBeGreaterThanOrEqual(10);
    expect(FOOD_AND_DRINK_CATALOG.japanese.length).toBeGreaterThanOrEqual(5);
    expect(FOOD_AND_DRINK_CATALOG.korean.length).toBeGreaterThanOrEqual(5);
    expect(FOOD_AND_DRINK_CATALOG.thai.length).toBeGreaterThanOrEqual(5);
    expect(FOOD_AND_DRINK_CATALOG.chinese.length).toBeGreaterThanOrEqual(5);
    expect(FOOD_OPTIONS.length).toBeGreaterThanOrEqual(50);
  });

  it("uses cuisine-specific choices instead of mixing every food", () => {
    expect(choicesForActivity("Ăn món Nhật", "food").choices).toContain("Sushi và sashimi");
    expect(choicesForActivity("Nếm đặc sản Kinh Bắc", "food").choices).toContain("Nem Bùi");
    expect(choicesForActivity("Kèo bún đậu mắm tôm", "food").choices).not.toContain("Gà rán Hàn Quốc");
    expect(choicesForActivity("Kèo bún đậu mắm tôm", "food").choices[0]).toContain("Mẹt");
    expect(choicesForActivity("Chơi game cùng nhau", "game").choices).not.toContain("Chơi game cùng nhau");
  });

  it("prioritizes suggestions belonging to the selected city", () => {
    expect(getTrendSuggestions("discover", "bacninh")[0].cities).toContain("bacninh");
    expect(getTrendSuggestions("outdoor", "hanoi")[0].cities).toContain("hanoi");
  });
});
