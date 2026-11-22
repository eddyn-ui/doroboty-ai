import { describe, expect, it } from "vitest";
import { reviewApplications, reviewOrder } from "./data";
import {
  questionSourceFor,
  readAttempts,
  startModeFor,
  summarize,
  validatePicks,
  writeAttempts,
  type Attempt,
  type ReviewStorage,
} from "./session";

function memoryStorage(): ReviewStorage & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

const attempt: Attempt = {
  participant: 1,
  mode: "b",
  savedAt: "2026-11-22T10:00:00.000Z",
  seconds: 125,
  picks: [
    { applicationId: "app-025820", letter: "D", question: "Co ustaliłeś sam?", source: "edited" },
    { applicationId: "app-026124", letter: "F", question: "Jaki kompromis?", source: "suggested" },
    { applicationId: "app-022437", letter: "H", question: "Moje pytanie", source: "own" },
  ],
};

describe("screening review fixture", () => {
  it("covers every application once in both orders", () => {
    const ids = reviewApplications.map((item) => item.id).sort();
    expect([...reviewOrder.a].sort()).toEqual(ids);
    expect([...reviewOrder.b].sort()).toEqual(ids);
    expect(reviewOrder.b).not.toEqual(reviewOrder.a);
  });
  it("uses unique letters per mode", () => {
    for (const mode of ["a", "b"] as const) {
      const letters = reviewApplications.map((item) => item.letters[mode]);
      expect(new Set(letters).size).toBe(letters.length);
    }
  });
});

describe("screening review session", () => {
  it("classifies question sources", () => {
    expect(questionSourceFor("Moje", null)).toBe("own");
    expect(questionSourceFor("  Jaki   kompromis? ", "jaki kompromis?")).toBe("suggested");
    expect(questionSourceFor("Jaki kompromis i dlaczego?", "Jaki kompromis?")).toBe("edited");
  });
  it("requires three picks with questions", () => {
    expect(validatePicks([{ question: "a" }])).toBe("too-few");
    expect(validatePicks([{ question: "a" }, { question: " " }, { question: "c" }])).toBe(
      "missing-question",
    );
    expect(validatePicks([{ question: "a" }, { question: "b" }, { question: "c" }])).toBe("ok");
  });
  it("round-trips attempts and ignores corrupt storage", () => {
    const storage = memoryStorage();
    expect(writeAttempts(storage, [attempt])).toBe(true);
    expect(readAttempts(storage)).toEqual([attempt]);
    storage.data.set("doroboty.screening-review.v1", "{broken");
    expect(readAttempts(storage)).toEqual([]);
    expect(readAttempts(null)).toEqual([]);
  });
  it("summarizes suggestion use and time", () => {
    expect(summarize(attempt)).toEqual({ letters: "D, F, H", used: 2, minutes: 2, seconds: 5 });
  });
  it("alternates the starting mode by participant", () => {
    expect(startModeFor(1)).toBe("a");
    expect(startModeFor(2)).toBe("b");
  });
});
