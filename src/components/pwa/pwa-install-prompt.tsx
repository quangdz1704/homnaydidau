"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

type InstallChoice = { outcome: "accepted" | "dismissed"; platform: string };
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<InstallChoice> };

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [standalone, setStandalone] = useState(() => typeof window === "undefined" || isStandalone());
  const [isIOS] = useState(() => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent));
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setStandalone(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome !== "accepted") setDismissed(true);
    setInstallEvent(null);
  }

  if (standalone || dismissed || (!installEvent && !isIOS)) return null;
  return <aside className="pwa-install" aria-label="Cài Shuffle"><button className="pwa-install__close" type="button" onClick={() => setDismissed(true)} aria-label="Đóng gợi ý cài ứng dụng"><X size={16} /></button><span className="pwa-install__icon">🎲</span><div><strong>Cài Shuffle lên màn hình chính</strong>{installEvent ? <small>Mở nhanh như một ứng dụng riêng, không cần tìm lại trong trình duyệt.</small> : <small>Trên Safari, chạm <Share size={13} /> Chia sẻ rồi chọn “Thêm vào Màn hình chính”.</small>}</div>{installEvent ? <button className="pwa-install__action" type="button" onClick={() => void install()}><Download size={16} /> Cài</button> : <span className="pwa-install__share"><Share size={17} /></span>}</aside>;
}
