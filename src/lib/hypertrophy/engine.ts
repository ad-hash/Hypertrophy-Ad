import { EXERCISES } from "./exercises";
import type { Exercise, GeneratorOptions, Muscle, Prescription, Workout } from "./types";

export const WEEKLY_TARGETS: Partial<Record<Muscle, number>> = {
  chest:10, back:12, sideDelts:10, frontDelts:4, biceps:8, triceps:8,
  quads:10, hamstrings:8, glutes:8, calves:8, abs:6
};

export function weeklyVolume(history: Workout[], now = new Date()): Record<Muscle, number> {
  const result = Object.fromEntries(Object.keys(WEEKLY_TARGETS).map(k => [k, 0])) as Record<Muscle, number>;
  const cutoff = now.getTime() - 7 * 86400000;
  for (const workout of history) {
    const time = new Date(workout.date).getTime();
    if (!Number.isFinite(time) || time > now.getTime() || time < cutoff) continue;
    for (const entry of workout.exercises) {
      const exercise = EXERCISES.find(e => e.id === entry.exerciseId);
      if (!exercise) continue;
      const hardSets = entry.sets.filter(s => s.completed && s.reps > 0 && (s.rir === null || s.rir <= 3)).length;
      for (const muscle of exercise.primary) result[muscle] = (result[muscle] ?? 0) + hardSets;
      for (const muscle of exercise.secondary) result[muscle] = (result[muscle] ?? 0) + hardSets * 0.5;
    }
  }
  return result;
}

export function suggestLoad(exercise: Exercise, history: Workout[]): number | null {
  const previous = [...history].sort((a,b) => b.date.localeCompare(a.date))
    .flatMap(w => w.exercises.filter(e => e.exerciseId === exercise.id))[0];
  if (!previous) return null;
  const sets = previous.sets.filter(s => s.completed && s.reps > 0);
  if (!sets.length) return null;
  const weight = sets[0].weightKg;
  if (!sets.every(s => s.weightKg === weight)) return weight;
  const ready = sets.every(s => s.reps >= exercise.repRange[1] && (s.rir === null || s.rir >= 1));
  return ready ? weight + exercise.incrementKg : weight;
}

export function generateWorkout(history: Workout[], options: GeneratorOptions): Prescription[] {
  const now = options.now ?? new Date();
  const volume = weeklyVolume(history, now);
  const allowed = EXERCISES.filter(e =>
    !options.excludedExerciseIds?.includes(e.id) &&
    (!options.availableEquipment || options.availableEquipment.includes(e.equipment)) &&
    (!options.focus?.length || e.primary.some(m => options.focus!.includes(m)))
  );
  const recent = new Map<string, number>();
  for (const w of history) for (const e of w.exercises) {
    const t = new Date(w.date).getTime();
    if (t <= now.getTime() && t > (recent.get(e.exerciseId) ?? -Infinity)) recent.set(e.exerciseId, t);
  }
  const score = (e: Exercise) => {
    const deficit = e.primary.reduce((s,m) => s + Math.max(0, 1 - (volume[m] ?? 0) / (WEEKLY_TARGETS[m] ?? 8)), 0) / e.primary.length;
    const days = (now.getTime() - (recent.get(e.id) ?? 0)) / 86400000;
    const recovery = recent.has(e.id) && days < 2 ? -2 : 0;
    return deficit + recovery;
  };
  const candidates = [...allowed].sort((a,b) => score(b)-score(a));
  const maxExercises = Math.min(7, Math.max(1, Math.floor(options.durationMinutes / 8)));
  const selected: Exercise[] = [];
  const represented = new Set<Muscle>();
  for (const e of candidates) {
    if (selected.length >= maxExercises) break;
    if (e.primary.every(m => represented.has(m))) continue;
    selected.push(e);
    e.primary.forEach(m => represented.add(m));
  }
  for (const e of candidates) {
    if (selected.length >= maxExercises) break;
    if (!selected.includes(e)) selected.push(e);
  }
  return selected.map(e => ({
    exerciseId:e.id, sets: Math.min(3,Math.max(2,Math.floor(options.durationMinutes / Math.max(1,selected.length * 3)))),
    reps:e.repRange, weightKg:suggestLoad(e,history),
    reason: e.primary.map(m => `${m}: ${(volume[m] ?? 0).toFixed(1)}/${WEEKLY_TARGETS[m] ?? 8} recent sets`).join("; ")
  }));
}
