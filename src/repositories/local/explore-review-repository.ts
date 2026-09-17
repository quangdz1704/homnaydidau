import type { ExploreReview } from "@/types";

const REVIEWS_KEY = "shuffle:explore-reviews";

function readReviews(): ExploreReview[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(REVIEWS_KEY) ?? "[]");
    return Array.isArray(value) ? value as ExploreReview[] : [];
  } catch {
    return [];
  }
}

export const exploreReviewRepository = {
  getAll() {
    return readReviews();
  },
  add(review: ExploreReview) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(REVIEWS_KEY, JSON.stringify([review, ...readReviews()].slice(0, 500)));
  },
};
