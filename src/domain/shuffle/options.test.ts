import { describe, expect, it } from "vitest";
import { formatDuration } from "./options";

describe("formatDuration", () => {
  it.each([
    [30, "30 phút"],
    [60, "1 giờ"],
    [80, "1 giờ 20 phút"],
    [95, "1 giờ 35 phút"],
    [100, "1 giờ 40 phút"],
  ])("hiển thị %i phút thành %s", (minutes, expected) => {
    expect(formatDuration({ min: minutes, max: minutes })).toBe(expected);
  });

  it("làm tròn về mốc 5 phút gần nhất", () => {
    expect(formatDuration({ min: 93, max: 93 })).toBe("1 giờ 35 phút");
    expect(formatDuration({ min: 92, max: 92 })).toBe("1 giờ 30 phút");
  });

  it("thu gọn khoảng thời gian nếu hai đầu làm tròn giống nhau", () => {
    expect(formatDuration({ min: 58, max: 62 })).toBe("1 giờ");
  });
});
