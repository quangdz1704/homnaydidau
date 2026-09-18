"use client";

import { useState } from "react";
import { Check, Clock3, MapPin, RefreshCw, WalletCards, X } from "lucide-react";
import { motion } from "motion/react";
import { Button, Modal } from "@/components/ui/core";
import { formatBudget, formatDuration } from "@/domain/shuffle/options";
import type { Activity, CityKey, CurrentLocation, PlaceSuggestion } from "@/types";
import { PlaceDiscovery } from "./place-discovery";

export function PlanDetailModal({ activity, city, currentLocation, onClose, onChoose, onChoosePlace, onLock }: { activity: Activity; city: CityKey; currentLocation: CurrentLocation | null; onClose: () => void; onChoose: (stepId: string, choice: string) => void; onChoosePlace: (stepId: string, place: PlaceSuggestion) => void; onLock: () => void }) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const steps = activity.planDetails ?? [];
  const progress = steps.length ? Math.round((completed.size / steps.length) * 100) : 0;

  function randomize(stepId: string, choices: string[]) {
    const step = steps.find((item) => item.id === stepId);
    const available = choices.filter((choice) => choice !== step?.selectedChoice);
    const pool = available.length ? available : choices;
    onChoose(stepId, pool[Math.floor(Math.random() * pool.length)]);
  }

  function toggleComplete(stepId: string) {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(stepId)) next.delete(stepId); else next.add(stepId);
      return next;
    });
  }

  return (
    <Modal label={`Chi tiết plan ${activity.title}`} onClose={onClose}>
      <div className="plan-detail">
        <header className="plan-detail__header">
          <div><span className="eyebrow">PLAN CỦA BẠN · {steps.length} CHẶNG</span><h2>{activity.emoji} {activity.title}</h2><p>{activity.description}</p></div>
          <button className="plan-detail__close" onClick={onClose} aria-label="Đóng chi tiết plan"><X /></button>
        </header>
        <div className="plan-overview">
          <span><Clock3 size={16} />{formatDuration(activity.durationMinutes)}</span>
          <span><WalletCards size={16} />{formatBudget(activity.budget)}</span>
          <div className="plan-progress" aria-label={`Đã hoàn thành ${progress}%`}><i style={{ width: `${progress}%` }} /></div>
        </div>

        <ol className="detailed-timeline">
          {steps.map((step, index) => {
            const done = completed.has(step.id);
            return (
              <li key={step.id} className={done ? "is-done" : ""}>
                <div className="detailed-timeline__rail"><button onClick={() => toggleComplete(step.id)} aria-label={done ? `Bỏ đánh dấu ${step.title}` : `Đánh dấu xong ${step.title}`}>{done ? <Check size={17} /> : index + 1}</button>{index < steps.length - 1 && <i />}</div>
                <motion.article layout className="plan-step-card">
                  <div className="plan-step-card__heading"><span>{step.emoji}</span><div><small>CHẶNG {index + 1} · {formatDuration({ min: step.durationMinutes, max: step.durationMinutes })}</small><h3>{step.title}</h3></div></div>
                  <p>{step.description}</p>
                  <div className="step-choice">
                    <div><small>{step.choicePrompt}</small><strong>{step.selectedChoice ?? "Để xúc xắc chọn hộ"}</strong></div>
                    <button onClick={() => randomize(step.id, step.choices)}><RefreshCw size={15} /> {step.selectedChoice ? "Đổi" : "Random"}</button>
                  </div>
                  {step.selectedPlace && <div className="selected-place"><MapPin size={16} /><div><small>ĐỊA ĐIỂM ĐÃ CHỐT</small><strong>{step.selectedPlace.name}</strong><span>{step.selectedPlace.address}</span></div></div>}
                  <PlaceDiscovery key={`${step.id}-${step.selectedChoice ?? "default"}-${city}`} step={step} city={city} currentLocation={currentLocation} onChoosePlace={(place) => onChoosePlace(step.id, place)} />
                </motion.article>
                {index < steps.length - 1 && <div className="transition-note">≈ 10–15 phút để nghỉ hoặc di chuyển</div>}
              </li>
            );
          })}
        </ol>

        <div className="plan-detail__footer"><p>{progress === 100 ? "Xong hết rồi! Kèo này đáng được ăn mừng 🎉" : "Bạn có thể random từng chặng ngay bây giờ hoặc quyết định lúc đi."}</p><Button onClick={() => { onClose(); onLock(); }}>Chốt plan này 🚀</Button></div>
      </div>
    </Modal>
  );
}
