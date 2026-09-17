import type { Category } from "@/types";
import { normalizePlaceText } from "../domain/places/text";

const DEFAULT_CATEGORIES: Record<Category, string[]> = {
  food: ["catering.restaurant", "catering.fast_food", "catering.food_court"],
  cafe: ["catering.cafe", "catering.ice_cream"],
  movie: ["entertainment.cinema"],
  outdoor: ["leisure.park", "tourism.attraction", "tourism.sights"],
  creative: ["entertainment.culture.arts_centre", "commercial.art", "commercial.hobby.art"],
  game: ["entertainment.amusement_arcade", "entertainment.bowling_alley", "entertainment.escape_game"],
  discover: ["tourism", "entertainment.museum", "entertainment.culture"],
  chill: ["leisure.park", "catering.cafe", "education.library"],
  active: ["sport", "activity.sport_club"],
  learn: ["education.library", "entertainment.museum", "commercial.books"],
  home: [],
};

const QUERY_CATEGORY_RULES: Array<{ terms: string[]; categories: string[] }> = [
  { terms: ["sushi", "sashimi", "ramen", "udon", "yakitori", "nhat"], categories: ["catering.restaurant.japanese", "catering.restaurant.sushi", "catering.restaurant.ramen"] },
  { terms: ["tokbokki", "bibimbap", "kim chi", "han quoc"], categories: ["catering.restaurant.korean"] },
  { terms: ["tom yum", "pad thai", "mon thai", "lau thai"], categories: ["catering.restaurant.thai"] },
  { terms: ["dimsum", "tu xuyen", "duong chau", "vit quay", "mon trung"], categories: ["catering.restaurant.chinese"] },
  { terms: ["pizza"], categories: ["catering.fast_food.pizza", "catering.restaurant.pizza"] },
  { terms: ["hamburger", "burger"], categories: ["catering.fast_food.burger", "catering.restaurant.burger"] },
  { terms: ["ga ran"], categories: ["catering.fast_food", "catering.restaurant.chicken"] },
  { terms: ["boi", "be boi"], categories: ["sport.swimming_pool"] },
  { terms: ["gym", "phong tap"], categories: ["sport.fitness", "sport.fitness.gym"] },
  { terms: ["bowling"], categories: ["entertainment.bowling_alley"] },
  { terms: ["bao tang"], categories: ["entertainment.museum"] },
  { terms: ["nha sach"], categories: ["commercial.books"] },
  { terms: ["thu vien"], categories: ["education.library"] },
  { terms: ["sieu thi"], categories: ["commercial.supermarket"] },
  { terms: ["cong vien", "di dao", "chay bo"], categories: ["leisure.park"] },
  { terms: ["ca phe", "cafe", "tra", "matcha", "bac xiu"], categories: ["catering.cafe"] },
  { terms: ["rap", "xem phim"], categories: ["entertainment.cinema"] },
];

const CATEGORY_LABELS: Array<[string, string]> = [
  ["catering.restaurant", "Nhà hàng"],
  ["catering.fast_food", "Quán ăn nhanh"],
  ["catering.food_court", "Khu ẩm thực"],
  ["catering.cafe", "Quán cà phê"],
  ["catering.ice_cream", "Quán kem"],
  ["entertainment.cinema", "Rạp chiếu phim"],
  ["entertainment.museum", "Bảo tàng"],
  ["entertainment.bowling_alley", "Bowling"],
  ["entertainment.amusement_arcade", "Khu trò chơi"],
  ["entertainment", "Điểm vui chơi"],
  ["leisure.park", "Công viên"],
  ["sport.swimming_pool", "Bể bơi"],
  ["sport.fitness", "Phòng tập"],
  ["sport", "Địa điểm thể thao"],
  ["education.library", "Thư viện"],
  ["commercial.books", "Nhà sách"],
  ["commercial.supermarket", "Siêu thị"],
  ["tourism.sights", "Điểm tham quan"],
  ["tourism", "Điểm khám phá"],
];

export function getGeoapifyCategories(category: Category, query: string) {
  const normalizedQuery = normalizePlaceText(query);
  const matched = QUERY_CATEGORY_RULES.find((rule) => rule.terms.some((term) => normalizedQuery.includes(term)));
  return [...new Set([...(matched?.categories ?? []), ...DEFAULT_CATEGORIES[category]])];
}

export function getPlaceTypeLabel(categories: string[] = []) {
  return CATEGORY_LABELS.find(([category]) => categories.some((value) => value === category || value.startsWith(`${category}.`)))?.[1];
}
