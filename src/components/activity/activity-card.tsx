"use client";

import Image from "next/image";
import { Clock3, Heart, WalletCards } from "lucide-react";
import { motion } from "motion/react";
import { CATEGORY_META, formatBudget, formatDuration } from "@/domain/shuffle/options";
import type { Activity } from "@/types";

export function ActivityCard({ activity, saved = false, onSave, onPlay, compact = false }: { activity: Activity; saved?: boolean; onSave?: () => void; onPlay?: () => void; compact?: boolean }) {
  const isExternalImage = /^https?:\/\//i.test(activity.image ?? "");
  return (
    <motion.article className={`activity-card ${compact ? "activity-card--compact" : ""}`} layout whileHover={{ y: -3 }}>
      {activity.image ? <div className="activity-card__image">{isExternalImage ? <img /* eslint-disable-line @next/next/no-img-element -- User-supplied hosts cannot safely use Next's allowlist. */ src={activity.image} alt={activity.title} loading="lazy" /> : <Image src={activity.image} alt={activity.title} fill sizes="(max-width: 640px) 100vw, 720px" style={{ objectFit: "cover" }} />}</div> : null}
      <div className="activity-card__top">
        <span className="activity-card__emoji">{activity.emoji}</span>
        {onSave && (
          <button className={`icon-button ${saved ? "is-saved" : ""}`} onClick={onSave} aria-label={saved ? "Bỏ lưu" : "Lưu kèo"}>
            <Heart size={20} fill={saved ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <span className="eyebrow">{activity.kind === "mini-plan" ? "MINI PLAN" : CATEGORY_META[activity.category].label.toUpperCase()}</span>
      <h3>{activity.title}</h3>
      <p>{activity.description}</p>
      <div className="meta-row">
        <span><WalletCards size={16} />{formatBudget(activity.budget)}</span>
        <span><Clock3 size={16} />{formatDuration(activity.durationMinutes)}</span>
      </div>
      {onPlay && <button className="text-action" onClick={onPlay}>🎲 Chơi kèo này <span>→</span></button>}
    </motion.article>
  );
}
