"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronRight, Cloud, ExternalLink, Images, MapPin, MessageCircle, Pencil, Plus, Search, Settings2, Sparkles, Star, Trash2, X } from "lucide-react";
import { ActivityCard } from "@/components/activity/activity-card";
import { ShuffMascot } from "@/components/mascot/shuff-mascot";
import { Button, EmptyState, Modal } from "@/components/ui/core";
import { CATEGORY_META, MODE_OPTIONS } from "@/domain/shuffle/options";
import { useShuffleStore } from "@/stores/use-shuffle-store";
import { EXPLORE_ITEMS } from "@/data/explore";
import { CITY_OPTIONS } from "@/data/places";
import { exploreReviewRepository } from "@/repositories/local/explore-review-repository";
import type { Activity, Category, ExploreItem, ExploreItemKind, ExploreReview, Mode, Rating } from "@/types";

const modeLabels: Record<Mode, string> = { solo: "🙋 Một mình", couple: "💕 Couple", friends: "👯 Bạn bè" };
const ratingLabels: Record<Rating, string> = { love: "😍 Mê", fun: "🙂 Khá vui", okay: "😐 Cũng được", skip: "🙅 Lần sau né" };
const exploreFilters: Array<{ id: "all" | ExploreItemKind; label: string }> = [{ id: "all", label: "Tất cả" }, { id: "food", label: "Món ăn" }, { id: "drink", label: "Đồ uống" }, { id: "activity", label: "Hoạt động" }, { id: "place", label: "Địa điểm" }];
const kindLabels: Record<ExploreItemKind, string> = { food: "MÓN ĂN", drink: "ĐỒ UỐNG", activity: "HOẠT ĐỘNG", place: "ĐỊA ĐIỂM" };

function getWeeklyStreak(timestamps: number[]) {
  const monday = (timestamp: number) => {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return date.getTime();
  };
  const weeks = [...new Set(timestamps.map(monday))].sort((a, b) => b - a);
  if (!weeks.length || monday(Date.now()) - weeks[0] > 7 * 86_400_000) return 0;
  let streak = 1;
  while (weeks[streak - 1] - weeks[streak] === 7 * 86_400_000) streak += 1;
  return streak;
}

export function SavedView() {
  const { saved, toggleSaved, chooseActivity, setView } = useShuffleStore();
  const [filter, setFilter] = useState<"all" | Mode>("all");
  const visible = saved.filter((record) => filter === "all" || record.activity.modes.includes(filter));
  return (
    <section className="content-page">
      <PageHeading eyebrow="BỘ SƯU TẬP NHỎ" title="Để dành hôm khác 💌" text="Những kèo làm bạn phải: “Ồ, cái này được nè.”" />
      {saved.length === 0 ? <EmptyState mood="happy" title="Chưa để dành kèo nào." text="Đi tìm một kèo khiến bạn phải: “Ồ, cái này được nè 👀”" action={<Button onClick={() => setView("discover")}>🎲 Đi tìm kèo</Button>} /> : <>
        <div className="filter-tabs">{[{ id: "all", label: "Tất cả" }, ...MODE_OPTIONS.map((mode) => ({ id: mode.value, label: mode.label }))].map((item) => <button className={filter === item.id ? "is-active" : ""} key={item.id} onClick={() => setFilter(item.id as "all" | Mode)}>{item.label}</button>)}</div>
        {visible.length ? <div className="card-grid">{visible.map(({ activity }) => <ActivityCard key={activity.id} activity={activity} saved onSave={() => void toggleSaved(activity)} onPlay={() => chooseActivity(activity)} />)}</div> : <div className="small-empty">Chưa có kèo nào trong nhóm này nè.</div>}
      </>}
    </section>
  );
}

export function CatalogView() {
  const [filter, setFilter] = useState<"all" | ExploreItemKind>("all");
  const [query, setQuery] = useState("");
  const [detailTarget, setDetailTarget] = useState<ExploreItem | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ExploreItem | null>(null);
  const [reviews, setReviews] = useState<ExploreReview[]>(() => exploreReviewRepository.getAll());
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return EXPLORE_ITEMS.filter((item) => (filter === "all" || item.kind === filter) && (!normalized || `${item.title} ${item.description}`.toLowerCase().includes(normalized)));
  }, [filter, query]);

  function addReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reviewTarget) return;
    const data = new FormData(event.currentTarget);
    const review: ExploreReview = { id: crypto.randomUUID?.() ?? `review-${Date.now()}`, itemId: reviewTarget.id, rating: Number(data.get("rating") ?? 5), comment: String(data.get("comment") ?? "").trim(), createdAt: Date.now() };
    if (!review.comment) return;
    exploreReviewRepository.add(review);
    setReviews(exploreReviewRepository.getAll());
    setReviewTarget(null);
  }

  return (
    <section className="content-page explore-library">
      <PageHeading eyebrow="KHO Ý TƯỞNG CÓ ẢNH" title="Ăn gì, đi đâu, làm gì? ✨" text="Mỗi gợi ý có một hình ảnh riêng để bạn dễ hình dung trước khi chốt kèo." />
      <div className="explore-toolbar"><label className="explore-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm bún chả, bơi, Hồ Gươm..." aria-label="Tìm trong kho gợi ý" /></label><div className="filter-tabs">{exploreFilters.map((item) => <button key={item.id} className={filter === item.id ? "is-active" : ""} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div></div>
      {visible.length ? <div className="explore-grid">{visible.map((item) => {
        const itemReviews = reviews.filter((review) => review.itemId === item.id);
        const average = itemReviews.length ? itemReviews.reduce((sum, review) => sum + review.rating, 0) / itemReviews.length : 0;
        return <article className="explore-card" key={item.id}><button className="explore-card__open" onClick={() => setDetailTarget(item)} aria-label={`Xem chi tiết ${item.title}`}><div className="explore-card__image">{item.image ? <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 50vw, 360px" style={{ objectFit: "cover" }} /> : <span>{item.emoji}</span>}<span className="explore-card__kind">{kindLabels[item.kind]}</span></div><div className="explore-card__body"><div className="explore-card__title"><span>{item.emoji}</span><h2>{item.title}</h2></div><p>{item.description}</p></div></button><div className="explore-card__footer"><span>{average ? <><Star size={14} fill="currentColor" /> {average.toFixed(1)} · {itemReviews.length} nhận xét</> : <><MessageCircle size={14} /> Chưa có nhận xét</>}</span><button onClick={() => setReviewTarget(item)}>Đánh giá</button></div></article>;
      })}</div> : <div className="small-empty"><Images size={22} /> Chưa có gợi ý khớp với từ khóa này.</div>}
      {detailTarget && <ExploreDetailModal item={detailTarget} reviews={reviews.filter((review) => review.itemId === detailTarget.id)} onClose={() => setDetailTarget(null)} onReview={() => { setDetailTarget(null); setReviewTarget(detailTarget); }} />}
      {reviewTarget && <Modal label={`Đánh giá ${reviewTarget.title}`} onClose={() => setReviewTarget(null)}><form className="review-form" onSubmit={addReview}><div className="modal-heading"><div><span className="eyebrow">GÓP Ý CHO CỘNG ĐỒNG</span><h2>{reviewTarget.emoji} {reviewTarget.title}</h2></div><button type="button" onClick={() => setReviewTarget(null)} aria-label="Đóng"><X /></button></div><label className="field"><span>Điểm của bạn</span><select name="rating" defaultValue="5"><option value="5">★★★★★ Rất đáng thử</option><option value="4">★★★★ Khá ổn</option><option value="3">★★★ Bình thường</option><option value="2">★★ Chưa hợp gu</option><option value="1">★ Không hợp</option></select></label><label className="field"><span>Nhận xét</span><textarea name="comment" placeholder="Ví dụ: quán nào ở Bắc Ninh ăn món này ngon?" required maxLength={280} /></label><Button type="submit">Lưu nhận xét</Button></form></Modal>}
    </section>
  );
}

function ExploreDetailModal({ item, reviews, onClose, onReview }: { item: ExploreItem; reviews: ExploreReview[]; onClose: () => void; onReview: () => void }) {
  const cityLabel = item.city ? CITY_OPTIONS.find((city) => city.value === item.city)?.label : undefined;
  const mapsQuery = [item.query ?? item.title, cityLabel].filter(Boolean).join(" ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return <Modal label={`Chi tiết ${item.title}`} onClose={onClose}><article className="explore-detail"><div className="modal-heading"><div><span className="eyebrow">{kindLabels[item.kind]}</span><h2>{item.emoji} {item.title}</h2></div><button type="button" onClick={onClose} aria-label="Đóng"><X /></button></div><div className="explore-detail__image">{item.image ? <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 100vw, 590px" style={{ objectFit: "cover" }} /> : <span>{item.emoji}</span>}</div><div className="explore-detail__summary"><p>{item.description}</p>{cityLabel && <span><MapPin size={15} /> Gợi ý tại {cityLabel}</span>}</div><a className="explore-detail__maps" href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17} /> Tìm trên Google Maps <ExternalLink size={14} /></a><section className="review-list"><div className="review-list__heading"><div><span className="eyebrow">NHẬN XÉT CỘNG ĐỒNG</span><strong>{average ? <><Star size={15} fill="currentColor" /> {average.toFixed(1)} · {reviews.length} nhận xét</> : "Chưa có nhận xét"}</strong></div><button type="button" onClick={onReview}>Viết nhận xét</button></div>{reviews.length ? <div className="review-list__items">{reviews.slice(0, 8).map((review) => <article className="review-entry" key={review.id}><div><span>{"★".repeat(review.rating)}<i>{"★".repeat(5 - review.rating)}</i></span><time dateTime={new Date(review.createdAt).toISOString()}>{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(review.createdAt)}</time></div><p>{review.comment}</p></article>)}</div> : <p className="review-list__empty">Bạn có thể là người đầu tiên chia sẻ chỗ ngon, mẹo hay hoặc trải nghiệm của mình.</p>}</section></article></Modal>;
}

export function HistoryView() {
  const { history, setView } = useShuffleStore();
  const favorite = useMemo(() => {
    const counts = history.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.activity.category]: (acc[item.activity.category] ?? 0) + (item.rating === "love" ? 2 : 1) }), {});
    const id = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as Category | undefined;
    return id ? CATEGORY_META[id] : null;
  }, [history]);
  const streak = getWeeklyStreak(history.map((entry) => entry.completedAt));

  return (
    <section className="content-page history-page">
      <div>
        <PageHeading eyebrow="NHẬT KÝ ĐI CHƠI" title="Những kèo đã qua 🗺️" text="Không cần đi xa, chỉ cần có chuyện để nhớ." />
        {history.length === 0 ? <EmptyState mood="sleep" title="Chưa có kỷ niệm nào." text="Có vẻ cuối tuần của bạn đang hơi trống đấy 👀" action={<Button onClick={() => setView("discover")}>🎲 Lắc một kèo</Button>} /> : <div className="timeline">{history.map((entry) => <article key={entry.id} className="timeline-item"><div className="timeline-item__date">{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "short" }).format(entry.completedAt)}</div><div className="timeline-item__dot">{entry.activity.emoji}</div><div className="timeline-item__card"><span>{modeLabels[entry.activity.modes[0]]}</span><h3>{entry.activity.title}</h3><p>{ratingLabels[entry.rating]}{entry.note ? ` · “${entry.note}”` : ""}</p></div></article>)}</div>}
      </div>
      {history.length > 0 && <aside className="memory-sidebar"><ShuffMascot mood="celebrate" size="medium" /><h2>Khá chăm đi chơi đó!</h2><div className="stat-grid"><div><strong>{history.length}</strong><span>kèo đã xong</span></div><div><strong>{Math.max(1, streak)}</strong><span>tuần liên tiếp</span></div><div><strong>{favorite?.emoji ?? "✨"}</strong><span>Gu: {favorite?.label ?? "đang khám phá"}</span></div></div><p>Không cần streak hoàn hảo. Một kỷ niệm vui vẫn là một kỷ niệm vui.</p></aside>}
    </section>
  );
}

export function MeView() {
  const store = useShuffleStore();
  const [customOpen, setCustomOpen] = useState(false);
  const [editingCustom, setEditingCustom] = useState<Activity | null>(null);
  const favorite = useMemo(() => {
    const counts = store.history.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.activity.category]: (acc[item.activity.category] ?? 0) + 1 }), {});
    const id = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as Category | undefined;
    return id ? CATEGORY_META[id] : null;
  }, [store.history]);
  return (
    <section className="content-page me-page">
      <PageHeading eyebrow="GÓC NHỎ CỦA BẠN" title="Hello, nhà thám hiểm 👋" text="Mọi thứ ở đây đều nằm gọn trên thiết bị này." />
      <div className="profile-hero"><ShuffMascot size="medium" /><div className="stat-grid"><div><strong>{store.history.length}</strong><span>kèo đã xong</span></div><div><strong>{favorite?.emoji ?? "👀"}</strong><span>Gu: {favorite?.label ?? "đang tìm"}</span></div><div><strong>{new Set(store.history.map((item) => item.activity.category)).size}</strong><span>kiểu mới đã thử</span></div></div></div>

      <div className="settings-grid">
        <section className="settings-card"><div className="section-title"><div><span className="eyebrow">GU CỦA BẠN</span><h2>Sở thích của tôi</h2></div><Settings2 /></div><p>Bỏ những nhóm bạn không muốn thấy trong Shuffle.</p><div className="preference-chips">{Object.entries(CATEGORY_META).map(([id, meta]) => { const excluded = store.preferences.excludedCategories.includes(id as Category); return <button className={excluded ? "is-excluded" : ""} key={id} onClick={() => store.toggleCategory(id as Category)}>{meta.emoji} {meta.label}{excluded && " ×"}</button>; })}</div><label className="toggle-row"><span><strong>Giảm chuyển động</strong><small>Dành cho mắt thích mọi thứ nhẹ nhàng.</small></span><input type="checkbox" checked={store.preferences.reducedMotion} onChange={(event) => store.setReducedMotion(event.target.checked)} /></label></section>

        <section className="settings-card custom-list"><div className="section-title"><div><span className="eyebrow">TỰ BIÊN TỰ DIỄN</span><h2>Kèo của tôi ✨</h2></div><Button variant="secondary" onClick={() => setCustomOpen(true)}><Plus size={17} /> Thêm kèo</Button></div><p>Ý hay của riêng bạn cũng được tham gia vòng quay.</p>{store.custom.length === 0 ? <div className="inline-empty">Chưa có kèo tự tạo. Thêm một chiếc xem sao?</div> : store.custom.map((activity) => <div className="custom-row" key={activity.id}><span>{activity.emoji}</span><div><strong>{activity.title}</strong><small>{modeLabels[activity.modes[0]]} · {activity.enabled ? "Đang trong Shuffle" : "Đã tắt"}</small></div><label className="custom-row__toggle"><input type="checkbox" checked={activity.enabled} onChange={(event) => void store.updateCustom({ ...activity, enabled: event.target.checked })} /><span>{activity.enabled ? "Bật" : "Tắt"}</span></label><button onClick={() => { setEditingCustom(activity); setCustomOpen(true); }} aria-label={`Sửa ${activity.title}`}><Pencil size={17} /></button><button onClick={() => void store.deleteCustom(activity.id)} aria-label={`Xoá ${activity.title}`}><Trash2 size={18} /></button></div>)}</section>

        <section className="settings-card coming-soon"><Cloud /><div><span className="eyebrow">SẮP CÓ ✨</span><h2>Đồng bộ hành trình</h2><p>Sau này bạn có thể mang kèo và kỷ niệm sang nhiều thiết bị.</p></div></section>
        <section className="settings-card about-card"><Sparkles /><div><h2>Shuffle phiên bản 0.1</h2><p>Làm ra để những câu “đi đâu ta?” có câu trả lời vui hơn.</p></div><ChevronRight /></section>
      </div>
      {customOpen && <CustomActivityModal activity={editingCustom} onClose={() => { setCustomOpen(false); setEditingCustom(null); }} />}
    </section>
  );
}

function CustomActivityModal({ activity: editing, onClose }: { activity: Activity | null; onClose: () => void }) {
  const addCustom = useShuffleStore((state) => state.addCustom);
  const updateCustom = useShuffleStore((state) => state.updateCustom);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const maxBudget = Number(data.get("budget")) * 1000;
    const maxDuration = Number(data.get("duration"));
    const image = String(data.get("image") ?? "").trim();
    const activity: Activity = { id: editing?.id ?? `custom-${crypto.randomUUID?.() ?? Date.now()}`, kind: "activity", title: String(data.get("title")), description: String(data.get("description")), emoji: String(data.get("emoji") || "✨"), image: image || undefined, modes: [String(data.get("mode")) as Mode], moods: ["any"], category: String(data.get("category")) as Category, budget: { min: 0, max: maxBudget }, durationMinutes: { min: Math.min(30, maxDuration), max: maxDuration }, challenge: String(data.get("challenge") || "Cứ làm theo cách vui nhất."), source: "custom", enabled: data.get("enabled") === "on" };
    if (editing) await updateCustom(activity); else await addCustom(activity); onClose();
  }
  return <Modal label={editing ? "Sửa kèo của bạn" : "Thêm kèo của bạn"} onClose={onClose}><form className="custom-form" onSubmit={(event) => void submit(event)}><div className="modal-heading"><div><span className="eyebrow">TỰ BIÊN TỰ DIỄN</span><h2>{editing ? "Sửa kèo này ✏️" : "Thêm kèo của bạn ✨"}</h2></div><button type="button" onClick={onClose} aria-label="Đóng"><X /></button></div><div className="form-row"><label className="field field--emoji"><span>Emoji</span><input name="emoji" defaultValue={editing?.emoji ?? "✨"} maxLength={3} /></label><label className="field"><span>Tên kèo</span><input name="title" defaultValue={editing?.title} placeholder="Ví dụ: Đi ăn ốc" required maxLength={60} /></label></div><label className="field"><span>Mô tả</span><textarea name="description" defaultValue={editing?.description} placeholder="Kèo này sẽ diễn ra thế nào?" required maxLength={220} /></label><label className="field"><span>Link ảnh <small>(dùng ngay, upload sẽ bổ sung sau)</small></span><input name="image" type="url" pattern="https?://.*" defaultValue={editing?.image} placeholder="https://example.com/keo-cua-toi.webp" title="Dùng link bắt đầu bằng http:// hoặc https://" /></label><div className="form-row"><label className="field"><span>Đi cùng ai?</span><select name="mode" defaultValue={editing?.modes[0]}>{MODE_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.emoji} {item.label}</option>)}</select></label><label className="field"><span>Nhóm</span><select name="category" defaultValue={editing?.category}>{Object.entries(CATEGORY_META).map(([id, item]) => <option key={id} value={id}>{item.emoji} {item.label}</option>)}</select></label></div><div className="form-row"><label className="field"><span>Budget tối đa (nghìn)</span><input name="budget" type="number" defaultValue={(editing?.budget.max ?? 100_000) / 1000} min={0} max={10000} /></label><label className="field"><span>Thời gian</span><select name="duration" defaultValue={editing?.durationMinutes.max ?? "120"}><option value="60">1 tiếng</option><option value="120">2 tiếng</option><option value="180">3 tiếng</option><option value="360">Nửa ngày</option><option value="720">Cả ngày</option></select></label></div><label className="field"><span>Thử thách nhỏ</span><input name="challenge" defaultValue={editing?.challenge} placeholder="Thêm chút gia vị cho kèo..." /></label><label className="check-row"><input name="enabled" type="checkbox" defaultChecked={editing?.enabled ?? true} /><span><strong>Cho kèo này vào Shuffle</strong><small>Tắt đi nếu chỉ muốn lưu làm ý tưởng.</small></span></label><Button type="submit">{editing ? "Lưu thay đổi" : "Lưu kèo này ✨"}</Button></form></Modal>;
}

function PageHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <header className="page-heading"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></header>;
}
