import { describe, expect, it } from "vitest";
import { generateWorkout, suggestLoad, weeklyVolume } from "../lib/hypertrophy/engine";
import { EXERCISES } from "../lib/hypertrophy/exercises";
import type { Workout } from "../lib/hypertrophy/types";
const history: Workout[] = [{
  id:"1", date:"2026-11-08T12:00:00.000Z",
  exercises:[{exerciseId:"incline-db-press",sets:[
    {weightKg:24,reps:10,rir:2,completed:true},
    {weightKg:24,reps:10,rir:2,completed:true},
    {weightKg:24,reps:10,rir:1,completed:true}
  ]}]
}];
describe("hypertrophy engine",()=>{
  it("credits primary and secondary muscle sets",()=>{
    const v=weeklyVolume(history,new Date("2026-11-09T12:00:00.000Z"));
    expect(v.chest).toBe(3);
    expect(v.triceps).toBe(1.5);
  });
  it("increases load when all sets reach top of range",()=>{
    expect(suggestLoad(EXERCISES[0],history)).toBe(26);
  });
  it("respects equipment and exclusions",()=>{
    const p=generateWorkout(history,{durationMinutes:30,availableEquipment:["dumbbell"],excludedExerciseIds:["incline-db-press"],now:new Date("2026-11-09T12:00:00.000Z")});
    expect(p.length).toBeGreaterThan(0);
    expect(p.every(x=>EXERCISES.find(e=>e.id===x.exerciseId)?.equipment==="dumbbell")).toBe(true);
    expect(p.some(x=>x.exerciseId==="incline-db-press")).toBe(false);
  });
});
