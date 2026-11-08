import type { Workout } from "./types";
const KEY = "hypertrophy-workouts-v1";
export function loadWorkouts(): Workout[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((w): w is Workout =>
      typeof w === "object" && w !== null && typeof w.id === "string" &&
      typeof w.date === "string" && Array.isArray(w.exercises)) : [];
  } catch { return []; }
}
export function saveWorkouts(workouts: Workout[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(workouts));
}
export function exportWorkouts(workouts: Workout[]): string {
  return JSON.stringify({version:1, exportedAt:new Date().toISOString(), workouts},null,2);
}
