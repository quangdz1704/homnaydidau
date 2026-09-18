import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { EXPLORE_ITEMS } from "../explore";

describe("catalog image assets", () => {
  it("assigns a WebP image to every explore item", () => {
    const missingImage = EXPLORE_ITEMS.filter((item) => !item.image);
    const nonWebpImage = EXPLORE_ITEMS.filter(
      (item) => item.image && !item.image.endsWith(".webp"),
    );

    expect(missingImage.map((item) => item.title)).toEqual([]);
    expect(nonWebpImage.map((item) => item.title)).toEqual([]);
  });

  it("references image files that exist in public assets", () => {
    const missingFiles = EXPLORE_ITEMS.filter(
      (item) =>
        !item.image ||
        !existsSync(join(process.cwd(), "public", item.image)),
    );

    expect(missingFiles.map((item) => `${item.kind}: ${item.title}`)).toEqual(
      [],
    );
  });
});
