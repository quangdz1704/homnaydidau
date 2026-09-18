"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock3,
  Heart,
  LocateFixed,
  LoaderCircle,
  RefreshCw,
  Share2,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ShuffMascot } from "@/components/mascot/shuff-mascot";
import { Button, Modal } from "@/components/ui/core";
import { CITY_OPTIONS } from "@/data/places";
import {
  BUDGET_OPTIONS,
  formatBudget,
  formatDuration,
  MODE_OPTIONS,
  MOOD_OPTIONS,
  TIME_OPTIONS,
} from "@/domain/shuffle/options";
import { useShuffleStore } from "@/stores/use-shuffle-store";
import type { Activity, Rating, ShuffleFilters } from "@/types";
import { PlanDetailModal } from "./plan-detail-modal";

const loadingCopy = [
  "Đang hỏi ý kiến xúc xắc...",
  "Đang trộn một chút hỗn loạn...",
  "Để số phận nấu...",
  "Đang tìm một kèo ngon...",
];
const timePlanHint: Record<ShuffleFilters["time"], string> = {
  "1h": "1 hoạt động gọn gàng, làm ngay.",
  "3h": "1–2 chặng nối tiếp, vừa đủ một buổi.",
  evening: "2–3 chặng từ ăn uống đến vui chơi.",
  halfday: "3 chặng có mở đầu, điểm nhấn và khoảng thở.",
  allday: "4 chặng thành một hành trình trọn ngày.",
};

function FilterSection<T extends string>({
  title,
  options,
  value,
  onChange,
  variant = "chips",
}: {
  title: string;
  options: { value: T; label: string; emoji?: string; note?: string }[];
  value: T | undefined;
  onChange: (value: T) => void;
  variant?: "chips" | "cards";
}) {
  return (
    <fieldset className="filter-section">
      <legend>{title}</legend>
      <div className={`option-grid option-grid--${variant}`}>
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            className={value === option.value ? "is-selected" : ""}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {option.emoji && <span>{option.emoji}</span>}
            <strong>{option.label}</strong>
            {option.note && <small>{option.note}</small>}
            {value === option.value && (
              <i>
                <Check size={12} />
              </i>
            )}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function ShuffleHome() {
  const store = useShuffleStore();
  const resultRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState<Rating>("love");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "requesting" | "granted" | "unavailable"
  >("idle");

  useEffect(() => {
    if (!store.isShuffling) return;
    const timer = window.setInterval(
      () => setLoadingIndex((index) => (index + 1) % loadingCopy.length),
      330,
    );
    return () => window.clearInterval(timer);
  }, [store.isShuffling]);

  async function doShuffle() {
    setLocked(false);
    setDetailOpen(false);
    await store.shuffle();
    if (window.innerWidth < 900)
      window.setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: store.preferences.reducedMotion ? "auto" : "smooth",
            block: "start",
          }),
        50,
      );
  }

  function setFilter<K extends keyof ShuffleFilters>(
    key: K,
    value: ShuffleFilters[K],
  ) {
    store.setFilter(key, value);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracyMeters: Math.round(position.coords.accuracy),
        };
        store.setCurrentLocation(location);
        setLocationStatus("granted");
        void fetch(
          `/api/places/search?mode=reverse&latitude=${location.latitude}&longitude=${location.longitude}`,
        )
          .then(async (response) =>
            response.ok
              ? (response.json() as Promise<{ label?: string | null }>)
              : null,
          )
          .then((result) => {
            if (result?.label)
              store.setCurrentLocation({ ...location, label: result.label });
          })
          .catch(() => undefined);
      },
      () => setLocationStatus("unavailable"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }

  const isSaved = store.current
    ? store.saved.some((item) => item.id === store.current?.id)
    : false;

  return (
    <div className="home-page">
      <section className="home-heading">
        <span className="eyebrow">ÍT NGHĨ THÔI · ĐI CHƠI NÀO</span>
        <h1>
          Hôm nay làm gì? <span>👀</span>
        </h1>
        <p>Chọn vài thứ, còn lại để xúc xắc lo.</p>
      </section>
      <div className="shuffle-workspace">
        <section className="control-panel">
          <div className="location-filter">
            <FilterSection
              title="Bạn đang ở đâu? 📍"
              options={CITY_OPTIONS}
              value={store.currentLocation ? undefined : store.preferences.city}
              onChange={(city) => {
                store.setCity(city);
                store.setCurrentLocation(null);
                setLocationStatus("idle");
              }}
            />
            <button
              type="button"
              className={`current-location-button ${store.currentLocation ? "is-selected" : ""}`}
              onClick={useCurrentLocation}
              disabled={locationStatus === "requesting"}
            >
              {locationStatus === "requesting" ? (
                <LoaderCircle className="is-spinning" size={17} />
              ) : (
                <LocateFixed size={17} />
              )}
              <strong>
                {locationStatus === "requesting"
                  ? "Đang lấy vị trí..."
                  : (store.currentLocation?.label ?? "Vị trí hiện tại")}
              </strong>
            </button>
            {store.currentLocation && (
              <small className="location-filter__hint">
                Sai số GPS khoảng {store.currentLocation.accuracyMeters ?? "?"}{" "}
                m
                {store.currentLocation.label
                  ? " · kiểm tra rồi hãy chốt kèo nhé"
                  : ` · ${store.currentLocation.latitude.toFixed(4)}, ${store.currentLocation.longitude.toFixed(4)}`}
              </small>
            )}
            {locationStatus === "unavailable" && (
              <small className="location-filter__hint">
                Chưa lấy được vị trí, mình vẫn dùng khu vực đã chọn nhé.
              </small>
            )}
          </div>
          <FilterSection
            title="Đi cùng ai?"
            options={MODE_OPTIONS}
            value={store.filters.mode}
            onChange={(value) => setFilter("mode", value)}
            variant="cards"
          />
          <FilterSection
            title="Hôm nay mood gì?"
            options={MOOD_OPTIONS.map((item) =>
              item.value === "romantic" && store.filters.mode === "solo"
                ? { ...item, emoji: "🌱", label: "Reset" }
                : item,
            )}
            value={store.filters.mood}
            onChange={(value) => setFilter("mood", value)}
          />
          <FilterSection
            title="Ví còn bao nhiêu? 💸"
            options={BUDGET_OPTIONS}
            value={store.filters.budget}
            onChange={(value) => setFilter("budget", value)}
          />
          <FilterSection
            title="Có bao nhiêu thời gian?"
            options={TIME_OPTIONS}
            value={store.filters.time}
            onChange={(value) => setFilter("time", value)}
          />
          <div className="plan-hint">
            <span>🧩</span>
            <div>
              <strong>Shuff sẽ xếp thành plan</strong>
              <small>{timePlanHint[store.filters.time]}</small>
            </div>
          </div>
          <div className="shuffle-actions">
            <Button
              onClick={() => void doShuffle()}
              disabled={store.isShuffling}
            >
              <span className="dice-icon">🎲</span> LẮC KÈO
            </Button>
            <button
              className="surprise-button"
              onClick={() => {
                store.surprise();
                window.setTimeout(() => void doShuffle(), 0);
              }}
            >
              <Sparkles size={17} /> Để số phận chọn hết
            </button>
          </div>
        </section>

        <div className="result-panel" ref={resultRef}>
          <AnimatePresence mode="wait">
            {store.isShuffling ? (
              <motion.div
                className="waiting-state"
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ShuffMascot mood="rolling" size="large" />
                <p>{loadingCopy[loadingIndex]}</p>
              </motion.div>
            ) : store.current ? (
              <ResultCard
                key={store.current.id}
                activity={store.current}
                saved={isSaved}
                onSave={() => void store.toggleSaved(store.current!)}
                onShuffle={() => void doShuffle()}
                onLock={() => setLocked(true)}
                onDetails={() => setDetailOpen(true)}
              />
            ) : store.shuffleAttempted ? (
              <motion.div
                className="waiting-state"
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ShuffMascot mood="confused" size="large" />
                <h2>Xúc xắc cũng chịu rồi 🥲</h2>
                <p>Thử nới budget hoặc thời gian một chút nhé.</p>
                <Button
                  onClick={() => {
                    store.surprise();
                    window.setTimeout(() => void doShuffle(), 0);
                  }}
                >
                  ✨ Để số phận chọn
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="waiting-state"
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ShuffMascot mood="thinking" size="large" />
                <h2>Chưa biết làm gì à?</h2>
                <p>
                  Chọn vài thứ bên trái,
                  <br />
                  còn lại để mình lo.
                </p>
                <div className="hint-pill">
                  Mách nhỏ: thử mood “Hơi điên” 🤪
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {detailOpen && store.current?.planDetails && (
        <PlanDetailModal
          activity={store.current}
          city={store.preferences.city}
          currentLocation={store.currentLocation}
          onClose={() => setDetailOpen(false)}
          onChoose={store.choosePlanStepOption}
          onChoosePlace={store.choosePlanStepPlace}
          onLock={() => setLocked(true)}
        />
      )}

      {locked && store.current && (
        <Modal label="Kèo đã chốt" onClose={() => setLocked(false)}>
          <div className="celebrate-modal">
            <ShuffMascot mood="celebrate" size="medium" />
            <span className="eyebrow">XÚC XẮC ĐÃ LÊN TIẾNG</span>
            <h2>Kèo đã chốt! 🎉</h2>
            <p>Đi tạo một kỷ niệm nhỏ thôi.</p>
            <div className="modal-actions">
              <Button
                onClick={() => {
                  setLocked(false);
                  setRatingOpen(true);
                }}
              >
                ✓ Xong rồi
              </Button>
              <Button
                variant="secondary"
                onClick={() => void store.toggleSaved(store.current!)}
              >
                {isSaved ? "♥ Đã lưu" : "♡ Lưu"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => void shareActivity(store.current!)}
              >
                <Share2 size={18} /> Chia sẻ
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {ratingOpen && store.current && (
        <Modal label="Đánh giá kèo" onClose={() => setRatingOpen(false)}>
          <div className="rating-modal">
            <span className="eyebrow">THÊM MỘT KỶ NIỆM NHỎ</span>
            <h2>Kèo này thế nào?</h2>
            <div className="rating-grid">
              {(
                [
                  { id: "love", emoji: "😍", label: "Mê" },
                  { id: "fun", emoji: "🙂", label: "Khá vui" },
                  { id: "okay", emoji: "😐", label: "Cũng được" },
                  { id: "skip", emoji: "🙅", label: "Lần sau né" },
                ] as { id: Rating; emoji: string; label: string }[]
              ).map((item) => (
                <button
                  key={item.id}
                  className={rating === item.id ? "is-selected" : ""}
                  onClick={() => setRating(item.id)}
                >
                  <span>{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </div>
            <label className="field">
              <span>Viết vài chữ để nhớ...</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Hôm nay vui nhất là..."
              />
            </label>
            <Button
              onClick={() =>
                void store.completeActivity(
                  store.current!,
                  rating,
                  note.trim() || undefined,
                )
              }
            >
              Lưu kỷ niệm ✨
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ResultCard({
  activity,
  saved,
  onSave,
  onShuffle,
  onLock,
  onDetails,
}: {
  activity: Activity;
  saved: boolean;
  onSave: () => void;
  onShuffle: () => void;
  onLock: () => void;
  onDetails: () => void;
}) {
  return (
    <motion.article
      className="result-card"
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 210, damping: 20 }}
    >
      <div className="result-card__decor result-card__decor--one" />
      <div className="result-card__decor result-card__decor--two" />
      <div className="result-card__header">
        <span className="eyebrow">
          {activity.kind === "mini-plan"
            ? "MINI PLAN CHO BẠN"
            : "KÈO TIẾP THEO CỦA BẠN"}
        </span>
        <button
          className={`icon-button ${saved ? "is-saved" : ""}`}
          onClick={onSave}
          aria-label={saved ? "Bỏ lưu" : "Lưu kèo"}
        >
          <Heart fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="result-card__emoji">{activity.emoji}</div>
      <h2>{activity.title}</h2>
      <p>{activity.description}</p>
      <div className="meta-row meta-row--large">
        <span>
          <WalletCards size={18} />
          {formatBudget(activity.budget)}
        </span>
        <span>
          <Clock3 size={18} />
          {formatDuration(activity.durationMinutes)}
        </span>
      </div>
      {activity.steps && (
        <ol className="plan-steps">
          {activity.steps.map((step, index) => (
            <li key={`${step}-${index}`}>
              <span>{index + 1}</span>
              <div>
                <strong>{step}</strong>
                {activity.planDetails?.[index] && (
                  <small>
                    {formatDuration({
                      min: activity.planDetails[index].durationMinutes,
                      max: activity.planDetails[index].durationMinutes,
                    })}
                  </small>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      {activity.planDetails && (
        <button className="plan-detail-trigger" onClick={onDetails}>
          <span>
            <strong>Xem plan chi tiết</strong>
            <small>Random từng chặng, xem gợi ý và đánh dấu tiến độ</small>
          </span>
          <ChevronRight size={20} />
        </button>
      )}
      <div className="challenge-card">
        <span>✨ THỬ THÁCH NHỎ</span>
        <p>{activity.challenge}</p>
        <button onClick={onShuffle}>
          <RefreshCw size={15} /> Đổi thử thách
        </button>
      </div>
      <div className="result-actions">
        <Button onClick={onLock}>Chốt kèo! 🚀</Button>
        <Button variant="secondary" onClick={onShuffle}>
          🔀 Không ưng, lắc lại
        </Button>
      </div>
    </motion.article>
  );
}

async function shareActivity(activity: Activity) {
  const text = `Kèo hôm nay: ${activity.emoji} ${activity.title}\n${activity.description}`;
  try {
    if (navigator.share) await navigator.share({ title: "Shuffle 🎲", text });
    else await navigator.clipboard?.writeText(text);
  } catch {
    // Người dùng hủy hoặc hệ điều hành chặn chia sẻ — coi như xong, không báo lỗi.
  }
}
