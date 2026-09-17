"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MODE_OPTIONS } from "@/domain/shuffle/options";
import { ShuffMascot } from "@/components/mascot/shuff-mascot";
import { Brand, Button } from "@/components/ui/core";
import type { Mode } from "@/types";

export function Onboarding({ onComplete }: { onComplete: (mode: Mode) => void }) {
  const [step, setStep] = useState<"hello" | "mode">("hello");
  const [mode, setMode] = useState<Mode>("solo");

  return (
    <main className="onboarding">
      <div className="onboarding__orb onboarding__orb--yellow" />
      <div className="onboarding__orb onboarding__orb--mint" />
      <div className="onboarding__orb onboarding__orb--lavender" />
      <div className="onboarding__shell">
        <Brand />
        <AnimatePresence mode="wait">
          {step === "hello" ? (
            <motion.section key="hello" className="onboarding__content" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -24 }}>
              <ShuffMascot size="large" />
              <div>
                <span className="eyebrow">ÍT NGHĨ HƠN · VUI HƠN</span>
                <h1>Chào bạn!<br />Mình đi chơi nhé?</h1>
                <p>Dù chỉ có một mình, đi cùng người thương hay quậy cùng hội bạn — Shuffle luôn có một ý hay.</p>
              </div>
              <Button onClick={() => setStep("mode")}>Bắt đầu thôi <ArrowRight size={19} /></Button>
            </motion.section>
          ) : (
            <motion.section key="mode" className="onboarding__content onboarding__content--mode" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
              <ShuffMascot size="medium" mood="thinking" />
              <div>
                <span className="eyebrow">MỘT CÂU NỮA THÔI</span>
                <h1>Hôm nay đi cùng ai?</h1>
                <p>Chọn nhanh để Shuff tìm đúng kiểu kèo cho bạn.</p>
              </div>
              <div className="onboarding-modes">
                {MODE_OPTIONS.map((item) => (
                  <button key={item.value} className={mode === item.value ? "is-selected" : ""} onClick={() => setMode(item.value)}>
                    <span>{item.emoji}</span><strong>{item.label}</strong><small>{item.note}</small>
                  </button>
                ))}
              </div>
              <Button onClick={() => onComplete(mode)}>Đi thôi <ArrowRight size={19} /></Button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
