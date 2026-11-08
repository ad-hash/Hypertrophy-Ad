import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { exerciseProgress, previousExercise } from "./lib/hypertrophy/progress";
import { EXERCISES } from "./lib/hypertrophy/exercises";
import { generateWorkout, weeklyVolume } from "./lib/hypertrophy/engine";
import { loadWorkouts, saveWorkouts, exportWorkouts } from "./lib/hypertrophy/storage";
import type { LoggedSet, Prescription, Workout } from "./lib/hypertrophy/types";


const nameOf = (id: string) => EXERCISES.find(e => e.id === id)?.name ?? id;
const newSet = (weight: number | null): LoggedSet => ({weightKg:weight ?? 0,reps:8,rir:2,completed:true});
export default function HypertrophyPage() {
  const [history,setHistory] = useState<Workout[]>([]);
  const [ready,setReady] = useState(false);
  const [minutes,setMinutes] = useState(45);
  const [plan,setPlan] = useState<Prescription[]>([]);
  const [mode,setMode] = useState<"train"|"history"|"volume"|"progress">("train");
  const [trackedExercise,setTrackedExercise] = useState("incline-db-press");
  const progress=useMemo(()=>exerciseProgress(history,trackedExercise),[history,trackedExercise]);
  const [entries,setEntries] = useState<{exerciseId:string;sets:LoggedSet[]}[]>([]);
  useEffect(()=>{setHistory(loadWorkouts());setReady(true);},[]);
  useEffect(()=>{if(ready)saveWorkouts(history);},[history,ready]);
  const volume=useMemo(()=>weeklyVolume(history),[history]);
  const addExercise=(id:string)=>{
    if(entries.some(e=>e.exerciseId===id))return;
    setEntries(prev=>[...prev,{exerciseId:id,sets:[newSet(null),newSet(null)]}]);
  };
  const generate=()=>{
    const generated=generateWorkout(history,{durationMinutes:minutes});
    setPlan(generated);
    setEntries(generated.map(p=>({exerciseId:p.exerciseId,sets:Array.from({length:p.sets},()=>newSet(p.weightKg))})));
    setMode("train");
  };
  const changeSet=(exerciseIndex:number,setIndex:number,field:keyof LoggedSet,value:number|boolean|null)=>{
    setEntries(prev=>prev.map((e,i)=>i!==exerciseIndex?e:{...e,sets:e.sets.map((s,j)=>j!==setIndex?s:{...s,[field]:value})}));
  };
  const finish=()=>{
    if(!entries.length)return;
    const workout:Workout={id:globalThis.crypto?.randomUUID?.() ?? String(Date.now()),date:new Date().toISOString(),exercises:entries};
    setHistory(prev=>[...prev,workout]);
    setEntries([]);setPlan([]);setMode("history");
  };
  const download=()=>{
    const blob=new Blob([exportWorkouts(history)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download="hypertrophy-history.json";a.click();URL.revokeObjectURL(url);
  };
  return <main className="min-h-screen bg-background text-foreground px-4 py-8">
    <div className="mx-auto max-w-2xl space-y-6">
      <header><p className="text-xs uppercase tracking-widest text-muted-foreground">Strength training</p>
        <h1 className="text-3xl font-bold">Hypertrophy Coach</h1>
        <p className="text-sm text-muted-foreground">Adaptive workouts. Every rep counts.</p></header>
      <nav className="flex gap-2">{(["train","history","volume","progress"] as const).map(m=><button key={m} onClick={()=>setMode(m)} className={`rounded-xl px-4 py-2 capitalize ${mode===m?"bg-primary text-primary-foreground":"bg-muted"}`}>{m}</button>)}</nav>
      {mode==="train"&&<section className="space-y-4">
        <div className="rounded-2xl border p-4 space-y-3">
          <h2 className="font-semibold">Today's workout</h2>
          <label className="block text-sm">Time available
            <select className="ml-3 rounded-lg border bg-background p-2" value={minutes} onChange={e=>setMinutes(Number(e.target.value))}>
              {[20,30,45,60].map(n=><option key={n} value={n}>{n} min</option>)}
            </select></label>
          <button onClick={generate} className="w-full rounded-xl bg-primary p-3 font-semibold text-primary-foreground">Generate workout</button>
          <label className="block text-sm">Add an exercise manually
            <select className="mt-2 w-full rounded-lg border bg-background p-2" value="" onChange={e=>{if(e.target.value)addExercise(e.target.value);}}>
              <option value="">Choose exercise…</option>{EXERCISES.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
            </select></label>
        </div>
        {entries.map((entry,i)=><div key={entry.exerciseId} className="rounded-2xl border p-4 space-y-3">
          <div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold">{nameOf(entry.exerciseId)}</h3>
            <p className="text-xs text-muted-foreground">{plan.find(p=>p.exerciseId===entry.exerciseId)?.reason ?? "Manual exercise"}</p>
            {previousExercise(history,entry.exerciseId)&&<p className="mt-1 text-xs text-primary">Last: {previousExercise(history,entry.exerciseId)!.sets.map(s=>`${s.weightKg}kg × ${s.reps}`).join(" · ")}</p>}</div>
            <button className="text-sm text-muted-foreground" onClick={()=>setEntries(prev=>prev.filter((_,j)=>j!==i))}>Remove</button></div>
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground"><span>Set</span><span>kg</span><span>Reps</span><span>RIR</span></div>
          {entry.sets.map((s,j)=><div key={j} className="grid grid-cols-4 items-center gap-2">
            <span className="text-sm">{j+1}</span>
            {(["weightKg","reps","rir"] as const).map(field=><input key={field} aria-label={field+" set "+(j+1)} type="number" min={0} step={field==="weightKg"?"0.5":"1"}
              className="w-full min-w-0 rounded-lg border bg-background p-2" value={s[field]??""}
              onChange={e=>changeSet(i,j,field,e.target.value===""&&field==="rir"?null:Number(e.target.value))}/>)}
          </div>)}
          <button className="text-sm underline" onClick={()=>setEntries(prev=>prev.map((e,j)=>j===i?{...e,sets:[...e.sets,newSet(e.sets.at(-1)?.weightKg??null)]}:e))}>+ Add set</button>
        </div>)}
        {entries.length>0&&<button onClick={finish} className="w-full rounded-xl bg-primary p-3 font-semibold text-primary-foreground">Finish and save workout</button>}
      </section>}
      {mode==="history"&&<section className="space-y-3"><button onClick={download} className="rounded-lg border px-3 py-2 text-sm">Export history JSON</button>
        {history.length===0&&<p>No completed workouts yet.</p>}
        {[...history].reverse().map(w=><article key={w.id} className="rounded-xl border p-4"><h3 className="font-semibold">{new Date(w.date).toLocaleDateString()}</h3>
          {w.exercises.map(e=><p key={e.exerciseId} className="text-sm">{nameOf(e.exerciseId)} · {e.sets.map(s=>`${s.weightKg}kg × ${s.reps}`).join(", ")}</p>)}</article>)}
      </section>}
      {mode==="volume"&&<section className="space-y-3"><h2 className="font-semibold">Hard sets · last 7 days</h2>
        {Object.entries(volume).map(([muscle,count])=><div key={muscle}><div className="flex justify-between text-sm capitalize"><span>{muscle}</span><span>{count.toFixed(1)}</span></div>
          <div className="h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{width:`${Math.min(100,count/12*100)}%`}}/></div></div>)}</section>}
      {mode==="progress"&&<section className="space-y-4"><h2 className="font-semibold">Strength progression</h2>
        <select aria-label="Tracked exercise" className="w-full rounded-lg border bg-background p-2" value={trackedExercise} onChange={e=>setTrackedExercise(e.target.value)}>{EXERCISES.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select>
        {progress.length===0?<p className="text-sm text-muted-foreground">Log this exercise to see your progress.</p>:<div className="rounded-xl border p-3"><p className="mb-3 text-xs text-muted-foreground">Estimated 1RM (kg) · indicative, not a true max test</p><div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={progress}><CartesianGrid strokeDasharray="3 3" opacity={0.15}/><XAxis dataKey="date" tick={{fontSize:10}}/><YAxis domain={["auto","auto"]} width={35}/><Tooltip/><Line type="monotone" dataKey="estimatedOneRepMax" stroke="#f06a4b" strokeWidth={2} dot/></LineChart></ResponsiveContainer></div></div>}
      </section>}
      <footer className="text-xs text-muted-foreground">Saved on this device. Export your history regularly; browser data can be cleared.</footer>
    </div></main>;
}
