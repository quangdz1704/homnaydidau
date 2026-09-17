import type { BudgetKey, Category, Mode, Mood, TimeKey } from "@/types";

export const MODE_OPTIONS: { value: Mode; emoji: string; label: string; note: string }[] = [
  { value: "solo", emoji: "🙋", label: "Mình tôi", note: "Self-date cũng vui mà." },
  { value: "couple", emoji: "💕", label: "Người thương", note: "Bất ngờ một chút." },
  { value: "friends", emoji: "👯", label: "Hội bạn", note: "Càng đông càng vui." },
];

export const MOOD_OPTIONS: { value: Mood; emoji: string; label: string }[] = [
  { value: "chill", emoji: "😴", label: "Chill" },
  { value: "party", emoji: "🔥", label: "Quẩy" },
  { value: "romantic", emoji: "💕", label: "Lãng mạn" },
  { value: "explore", emoji: "🌿", label: "Khám phá" },
  { value: "wild", emoji: "🤪", label: "Hơi điên" },
  { value: "any", emoji: "✨", label: "Gì cũng được" },
];

export const BUDGET_OPTIONS: { value: BudgetKey; label: string; max: number }[] = [
  { value: "free", label: "Miễn phí", max: 0 },
  { value: "100k", label: "< 100k", max: 100_000 },
  { value: "300k", label: "~300k", max: 300_000 },
  { value: "500k", label: "~500k", max: 500_000 },
  { value: "1m", label: "1 triệu+", max: 1_500_000 },
  { value: "any", label: "Không quan trọng", max: Number.POSITIVE_INFINITY },
];

export const TIME_OPTIONS: { value: TimeKey; emoji: string; label: string; maxMinutes: number }[] = [
  { value: "1h", emoji: "⚡", label: "1 tiếng", maxMinutes: 60 },
  { value: "3h", emoji: "🌤", label: "2–3 tiếng", maxMinutes: 180 },
  { value: "evening", emoji: "🌇", label: "Buổi tối", maxMinutes: 300 },
  { value: "halfday", emoji: "☀️", label: "Nửa ngày", maxMinutes: 360 },
  { value: "allday", emoji: "🗺", label: "Cả ngày", maxMinutes: 720 },
];

export const CATEGORY_META: Record<Category, { label: string; emoji: string }> = {
  food: { label: "Ăn uống", emoji: "🍜" },
  cafe: { label: "Cafe", emoji: "☕" },
  movie: { label: "Phim", emoji: "🎬" },
  outdoor: { label: "Ngoài trời", emoji: "🌿" },
  creative: { label: "Sáng tạo", emoji: "🎨" },
  game: { label: "Game", emoji: "🎮" },
  discover: { label: "Khám phá", emoji: "📸" },
  chill: { label: "Chill", emoji: "🧘" },
  active: { label: "Vận động", emoji: "🏃" },
  learn: { label: "Thử cái mới", emoji: "📚" },
  home: { label: "Ở nhà", emoji: "🏠" },
};

export function formatBudget({ min, max }: { min: number; max: number }) {
  if (max === 0) return "Miễn phí";
  const format = (value: number) => `${Math.round(value / 1000)}k`;
  return min === max ? `~${format(max)}` : `~${format(min)}–${format(max)}`;
}

export function formatDuration({ min, max }: { min: number; max: number }) {
  const format = (minutes: number) => {
    const roundedMinutes = Math.max(0, Math.round(minutes / 5) * 5);
    const hours = Math.floor(roundedMinutes / 60);
    const remainingMinutes = roundedMinutes % 60;
    if (hours === 0) return `${remainingMinutes} phút`;
    if (remainingMinutes === 0) return `${hours} giờ`;
    return `${hours} giờ ${remainingMinutes} phút`;
  };
  const formattedMin = format(min);
  const formattedMax = format(max);
  return formattedMin === formattedMax ? formattedMin : `${formattedMin}–${formattedMax}`;
}
