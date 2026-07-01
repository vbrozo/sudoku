import { describe, expect, it } from "vitest";
import { formatElapsedTime } from "./time";

describe("formatElapsedTime", () => {
  it("formats zero as MM:SS", () => {
    expect(formatElapsedTime(0)).toBe("00:00");
  });

  it("formats seconds under a minute", () => {
    expect(formatElapsedTime(45)).toBe("00:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatElapsedTime(125)).toBe("02:05");
  });

  it("switches to HH:MM:SS after an hour", () => {
    expect(formatElapsedTime(3661)).toBe("01:01:01");
  });

  it("pads hours, minutes, and seconds to two digits", () => {
    expect(formatElapsedTime(3600 * 10 + 60 * 5 + 9)).toBe("10:05:09");
  });
});
