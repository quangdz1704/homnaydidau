import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shuffle — Ít nghĩ thôi. Đi chơi nào!",
    short_name: "Shuffle",
    description: "Hết ý tưởng? Để xúc xắc nghĩ hộ.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9F3",
    theme_color: "#FF7D8A",
    lang: "vi",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" }
    ]
  };
}
