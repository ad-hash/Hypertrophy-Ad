import type { Workout } from "./types";
export interface ProgressPoint { date: string; bestWeight: number; bestReps: number; estimatedOneRepMax: number; totalVolumeKg: number; }
export function exerciseProgress(history: Workout[], exerciseId: string): ProgressPoint[] {
  return [...history].sort((a,b)=>a.date.localeCompare(b.date)).flatMap(w=>{
    const sets=w.exercises.filter(e=>e.exerciseId===exerciseId).flatMap(e=>e.sets).filter(s=>s.completed&&s.reps>0&&s.weightKg>=0);
    if(!sets.length)return [];
    const heaviest=[...sets].sort((a,b)=>b.weightKg-a.weightKg||b.reps-a.reps)[0];
    const estimatedOneRepMax=Math.max(...sets.map(s=>s.weightKg*(1+s.reps/30)));
    return [{date:w.date.slice(0,10),bestWeight:heaviest.weightKg,bestReps:heaviest.reps,estimatedOneRepMax:Math.round(estimatedOneRepMax*10)/10,totalVolumeKg:Math.round(sets.reduce((sum,s)=>sum+s.weightKg*s.reps,0))}];
  });
}
export function previousExercise(history: Workout[],exerciseId:string){
  return [...history].sort((a,b)=>b.date.localeCompare(a.date)).flatMap(w=>w.exercises.filter(e=>e.exerciseId===exerciseId))[0]??null;
}
