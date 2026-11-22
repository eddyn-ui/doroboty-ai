import { z } from "zod";
import type { Mode } from "./data";

export const REVIEW_STORAGE_KEY = "doroboty.screening-review.v1";
export const REQUIRED_PICKS = 3;

const questionSource = z.enum(["suggested", "edited", "own"]);
export type QuestionSource = z.infer<typeof questionSource>;

export const attemptSchema = z.object({
  participant: z.number().int().min(1).max(99),
  mode: z.enum(["a", "b"]),
  savedAt: z.iso.datetime(),
  seconds: z.number().int().min(0).max(86_400),
  picks: z
    .array(
      z.object({
        applicationId: z.string().min(1).max(100),
        letter: z.string().min(1).max(2),
        question: z.string().trim().min(1).max(1000),
        source: questionSource,
      }),
    )
    .length(REQUIRED_PICKS),
});
export type Attempt = z.infer<typeof attemptSchema>;
const attemptsSchema = z.array(attemptSchema).max(500);

export interface ReviewStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function browserStorage(): ReviewStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readAttempts(storage: ReviewStorage | null): Attempt[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(REVIEW_STORAGE_KEY);
    return raw ? attemptsSchema.parse(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function writeAttempts(storage: ReviewStorage | null, attempts: Attempt[]) {
  if (!storage) return false;
  try {
    storage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(attemptsSchema.parse(attempts)));
    return true;
  } catch {
    return false;
  }
}

export function clearAttempts(storage: ReviewStorage | null) {
  try {
    storage?.removeItem(REVIEW_STORAGE_KEY);
  } catch {
    // Nothing to clear when storage is blocked.
  }
}

/** Compares the typed question with the suggestion it started from. */
export function questionSourceFor(question: string, suggestion: string | null): QuestionSource {
  if (!suggestion) return "own";
  const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase("pl");
  return normalize(question) === normalize(suggestion) ? "suggested" : "edited";
}

export function validatePicks(
  picks: { question: string }[],
): "ok" | "too-few" | "missing-question" {
  if (picks.length !== REQUIRED_PICKS) return "too-few";
  return picks.every((pick) => pick.question.trim().length > 0) ? "ok" : "missing-question";
}

export function summarize(attempt: Attempt) {
  const used = attempt.picks.filter((pick) => pick.source !== "own").length;
  return {
    letters: attempt.picks.map((pick) => pick.letter).join(", "),
    used,
    minutes: Math.floor(attempt.seconds / 60),
    seconds: attempt.seconds % 60,
  };
}

export const sourceLabels: Record<QuestionSource, string> = {
  suggested: "pytanie z propozycji",
  edited: "propozycja zmieniona",
  own: "własne pytanie",
};

export const startModeFor = (participant: number): Mode => (participant % 2 === 1 ? "a" : "b");
