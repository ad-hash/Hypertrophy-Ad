import type { Workout } from "./types";
/** Historical sessions transcribed from the user's dated workout logs.
 * Only explicitly reported sets/reps are included. Unknown reps are 0 and excluded from volume/strength calculations.
 * RIR was generally not recorded; null means unknown, not zero.
 * Dumbbell loads are per dumbbell; weighted pull-up/dip loads are additional weight.
 */
const records: Array<[string,Array<[string,Array<[number,number]>]>]> = [["2026-07-17",[["incline-db-press",[[24,10],[24,8],[22,7]]]]],["2026-07-20",[["flat-db-press",[[18,12],[18,16],[18,13]]]]],["2026-07-21",[["machine-row",[[50,12],[55,12]]]]],["2026-07-24",[["incline-db-press",[[26,5],[26,3],[24,5]]]]],["2026-07-30",[["incline-db-press",[[26,7],[24,10]]]]],["2026-08-09",[["lat-pulldown",[[55,12],[65,5],[45,8]]],["incline-db-press",[[26,2],[22,10]]],["cable-curl",[[40,16],[31,12],[18,12]]],["farmer-carry",[[28,0],[24,0]]],["lateral-raise",[[8,10],[5,20]]]]],["2026-08-31",[["incline-db-press",[[22,10],[24,4],[22,10]]],["machine-row",[[59,8],[52,10],[52,10],[45,10],[45,10]]],["lateral-raise",[[6,12],[6,12]]]]],["2026-09-08",[["incline-db-press",[[24,10],[24,7],[22,9]]],["db-shoulder-press",[[18,6]]],["weighted-pull-up",[[0,6],[0,6],[0,6]]],["machine-row",[[55,7],[40,9],[40,9]]]]],["2026-09-26",[["incline-db-press",[[24,4],[20,12],[20,10],[20,10],[20,10]]],["weighted-pull-up",[[0,8],[0,8],[0,8]]],["squat",[[40,10],[60,3]]]]],["2026-09-29",[["incline-db-press",[[24,5],[24,3],[22,10],[22,10]]]]],["2026-10-10",[["incline-db-press",[[24,8],[24,6],[22,10]]],["machine-row",[[50,10],[60,8],[65,5],[55,7]]],["triceps-pushdown",[[27,12]]],["cable-curl",[[40,8],[30,8],[30,8]]]]],["2026-10-18",[["incline-db-press",[[24,9],[22,8],[18,10]]]]],["2026-10-20",[["weighted-pull-up",[[10,5],[10,4],[0,10]]],["jefferson-curl",[[30,0]]],["rdl",[[60,0]]],["weighted-dip",[[10,5]]],["machine-row",[[40,5],[40,5],[40,5]]]]],["2026-10-21",[["incline-db-press",[[24,10],[24,7],[18,4]]],["rdl",[[50,12]]]]],["2026-10-28",[["incline-db-press",[[26,7],[26,4],[22,6],[22,4]]],["db-shoulder-press",[[18,5]]],["incline-db-curl",[[10,12],[10,8]]]]],["2026-10-31",[["incline-db-press",[[26,1],[24,4],[22,8],[22,4]]]]],["2026-11-05",[["incline-db-press",[[26,5],[24,6]]]]],["2026-11-06",[["incline-db-press",[[26,4],[22,6],[22,6]]]]],["2026-11-08",[["incline-db-press",[[24,9],[24,8],[24,7]]]]]];
export const HISTORICAL_WORKOUTS: Workout[] = records.map(([date, exercises])=>({
 id:`chat-history-${date}`,
 date:`${date}T12:00:00.000Z`,
 exercises:exercises.map(([exerciseId,sets])=>({
  exerciseId,sets:sets.map(([weightKg,reps])=>({weightKg,reps,rir:null,completed:reps>0}))
 }))
}));
