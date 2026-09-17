import { normalizePlaceText } from "./text";

const IGNORED_QUERY_WORDS = new Set(["quan", "dia", "diem", "ngon", "gan", "day", "duoc", "yeu", "thich", "xem", "choi", "o"]);

export function calculateQueryRelevance(query: string, name: string, categories: string[] = []) {
  const searchable = normalizePlaceText(`${name} ${categories.join(" ")}`);
  const terms = normalizePlaceText(query)
    .split(/\s+/)
    .filter((term) => term.length > 1 && !IGNORED_QUERY_WORDS.has(term));
  if (!terms.length) return 0;
  return Math.min(1, terms.filter((term) => searchable.includes(term)).length / Math.min(3, terms.length));
}

export function calculateFitScore({ distanceMeters, rank = 0, relevance = 0 }: { distanceMeters?: number; rank?: number; relevance?: number }) {
  const distancePoints = distanceMeters === undefined ? 38 : Math.max(12, 58 - (distanceMeters / 350));
  const rankPoints = Math.max(4, 22 - rank * 1.5);
  const relevancePoints = Math.max(0, Math.min(1, relevance)) * 20;
  return Math.round(Math.min(99, distancePoints + rankPoints + relevancePoints));
}

export function formatDistance(distanceMeters?: number) {
  if (distanceMeters === undefined) return undefined;
  if (distanceMeters < 1_000) return `${Math.max(50, Math.round(distanceMeters / 50) * 50)} m`;
  return `${(distanceMeters / 1_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} km`;
}
