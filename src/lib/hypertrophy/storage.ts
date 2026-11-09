import type { Workout } from "./types";
import { HISTORICAL_WORKOUTS } from "./historical";
const KEY = "hypertrophy-workouts-v1";
export function loadWorkouts(): Workout[] {
  if (typeof window === "undefined") return HISTORICAL_WORKOUTS;
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    const saved = Array.isArray(value) ? value.filter((w): w is Workout =>
      typeof w === "object" && w !== null && typeof w.id === "string" &&
      typeof w.date === "string" && Array.isArray(w.exercises)) : [];
    const ids = new Set(saved.map(w=>w.id));
    return [...saved,...HISTORICAL_WORKOUTS.filter(w=>!ids.has(w.id))].sort((a,b)=>a.date.localeCompare(b.date));
  } catch { return HISTORICAL_WORKOUTS; }
}
export function saveWorkouts(workouts: Workout[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(workouts));
}
export function exportWorkouts(workouts: Workout[]): string {
  return JSON.stringify({version:1, exportedAt:new Date().toISOString(), workouts},null,2);
}
