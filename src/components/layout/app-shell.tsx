"use client";

import { useEffect } from "react";
import { Clock3, Compass, Heart, Images, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Brand } from "@/components/ui/core";
import { PwaInstallPrompt } from "@/components/pwa/pwa-install-prompt";
import { Onboarding } from "@/features/onboarding/onboarding";
import { ShuffleHome } from "@/features/shuffle/shuffle-home";
import { CatalogView, HistoryView, MeView, SavedView } from "@/features/views/views";
import { useShuffleStore } from "@/stores/use-shuffle-store";

const nav = [
  { id: "discover" as const, label: "Khám phá", icon: Compass },
  { id: "library" as const, label: "Kho gợi ý", icon: Images },
  { id: "saved" as const, label: "Đã lưu", icon: Heart },
  { id: "history" as const, label: "Kỷ niệm", icon: Clock3 },
  { id: "me" as const, label: "Tôi", icon: UserRound },
];

export function AppShell() {
  const { hydrated, hydrate, view, setView, preferences, completeOnboarding } = useShuffleStore();
  useEffect(() => {
    void hydrate();
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
    }
  }, [hydrate]);

  useEffect(() => {
    // instant thay vì smooth: view mới có thể thấp hơn, scroll đang chạy sẽ bị clamp giữa đường.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view, preferences.onboardingComplete]);

  if (!hydrated) return <div className="app-loader"><span>🎲</span><p>Đang đánh thức Shuff...</p></div>;
  if (!preferences.onboardingComplete) return <Onboarding onComplete={completeOnboarding} />;

  return (
    <div className="app-shell">
      <header className="desktop-nav">
        <button className="brand-button" onClick={() => setView("discover")}><Brand /></button>
        <nav aria-label="Điều hướng chính">
          {nav.slice(0, 4).map((item) => <button key={item.id} className={view === item.id ? "is-active" : ""} onClick={() => setView(item.id)}>{item.label}</button>)}
        </nav>
        <button className={`profile-pill ${view === "me" ? "is-active" : ""}`} onClick={() => setView("me")}><UserRound size={18} /> Tôi</button>
      </header>

      <AnimatePresence mode="wait">
        <motion.main key={view} className="page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: preferences.reducedMotion ? 0 : 0.2 }}>
          {view === "discover" && <ShuffleHome />}
          {view === "library" && <CatalogView />}
          {view === "saved" && <SavedView />}
          {view === "history" && <HistoryView />}
          {view === "me" && <MeView />}
        </motion.main>
      </AnimatePresence>

      <nav className="bottom-nav" aria-label="Điều hướng dưới">
        {nav.map((item) => {
          const Icon = item.icon;
          return <button key={item.id} className={view === item.id ? "is-active" : ""} onClick={() => setView(item.id)}><Icon size={21} /><span>{item.label}</span></button>;
        })}
      </nav>
      <PwaInstallPrompt />
    </div>
  );
}
