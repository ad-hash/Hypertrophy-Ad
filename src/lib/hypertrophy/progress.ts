import type { Workout } from "./types";
export interface ProgressPoint { date: string; bestWeight: number; bestReps: number; estimatedOneRepMax: number; }
export function exerciseProgress(history: Workout[], exerciseId: string): ProgressPoint[] {
  return [...history].sort((a,b)=>a.date.localeCompare(b.date)).flatMap(w=>{
    const sets=w.exercises.filter(e=>e.exerciseId===exerciseId).flatMap(e=>e.sets).filter(s=>s.completed&&s.reps>0&&s.weightKg>=0);
    if(!sets.length)return [];
    const best=[...sets].sort((a,b)=>(b.weightKg*(1+b.reps/30))-(a.weightKg*(1+a.reps/30)))[0];
    return [{date:w.date.slice(0,10),bestWeight:best.weightKg,bestReps:best.reps,estimatedOneRepMax:Math.round(best.weightKg*(1+best.reps/30)*10)/10}];
  });
}
export function previousExercise(history: Workout[],exerciseId:string){
  return [...history].sort((a,b)=>b.date.localeCompare(a.date)).flatMap(w=>w.exercises.filter(e=>e.exerciseId===exerciseId))[0]??null;
}
