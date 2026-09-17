import { ACTIVITY_SEEDS } from "./catalog/activity-seeds";
import { FOOD_AND_DRINK_CATALOG } from "./catalog/food-and-drinks";
import type { MenuOption } from "./catalog/food-and-drinks";
import { getAllPlaceSuggestions } from "./places";
import type { Category, ExploreItem } from "@/types";

const groupLabels: Record<string, string> = {
  lightSnacks: "Ăn vặt",
  drinks: "Đồ uống",
  quickMeals: "Món ăn nhanh",
  vietnameseMeals: "Món Việt",
  bacNinhSpecialties: "Đặc sản Kinh Bắc",
  japanese: "Món Nhật",
  korean: "Món Hàn",
  thai: "Món Thái",
  chinese: "Món Trung",
};

const slugify = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const foodItems: ExploreItem[] = Object.entries(FOOD_AND_DRINK_CATALOG).flatMap(([group, options]) => options.map((option) => ({
  id: `food-${slugify(option.name)}`,
  kind: group === "drinks" ? "drink" as const : "food" as const,
  title: option.name,
  description: `${groupLabels[group] ?? "Gợi ý ăn uống"} · chọn một nơi hợp gu để thử món này.`,
  emoji: option.emoji,
  image: (option as MenuOption).image,
  category: group === "drinks" ? "cafe" as Category : "food" as Category,
})));

const activityItems: ExploreItem[] = ACTIVITY_SEEDS.map((activity, index) => ({
  id: `activity-${index + 1}`,
  kind: "activity",
  title: activity.title,
  description: activity.description,
  emoji: activity.emoji,
  image: activity.image,
  category: activity.category,
  city: activity.cities?.[0],
}));

const placeItems: ExploreItem[] = getAllPlaceSuggestions().map((place) => ({
  id: `place-${place.id}`,
  kind: "place",
  title: place.title,
  description: place.description,
  emoji: place.emoji,
  image: place.image,
  category: place.categories[0] ?? "discover",
  city: place.cities?.[0],
  query: place.query,
}));

export const EXPLORE_ITEMS: ExploreItem[] = [...foodItems, ...activityItems, ...placeItems];
