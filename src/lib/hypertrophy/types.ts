export type Muscle = "chest" | "back" | "sideDelts" | "frontDelts" | "biceps" | "triceps" | "quads" | "hamstrings" | "glutes" | "calves" | "abs";
export type Equipment = "dumbbell" | "barbell" | "machine" | "cable" | "bodyweight";
export interface Exercise { id: string; name: string; equipment: Equipment; primary: Muscle[]; secondary: Muscle[]; repRange: [number, number]; incrementKg: number; }
export interface LoggedSet { weightKg: number; reps: number; rir: number | null; completed: boolean; }
export interface LoggedExercise { exerciseId: string; sets: LoggedSet[]; }
export interface Workout { id: string; date: string; exercises: LoggedExercise[]; }
export interface Prescription { exerciseId: string; sets: number; reps: [number, number]; weightKg: number | null; reason: string; }
export interface GeneratorOptions { durationMinutes: number; focus?: Muscle[]; excludedExerciseIds?: string[]; availableEquipment?: Equipment[]; now?: Date; }
