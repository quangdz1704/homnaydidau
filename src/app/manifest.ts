import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shuffle — Ít nghĩ thôi. Đi chơi nào!",
    short_name: "Shuffle",
    description: "Hết ý tưởng? Để xúc xắc nghĩ hộ.",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#FFF9F3",
    theme_color: "#FF7D8A",
    lang: "vi",
    categories: ["lifestyle", "travel", "food"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
