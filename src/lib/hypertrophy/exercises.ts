import type { Exercise } from "./types";
export const EXERCISES: Exercise[] = [
  {id:"machine-row",name:"Machine Row",equipment:"machine",primary:["back"],secondary:["biceps"],repRange:[8,12],incrementKg:2.5},
  {id:"cable-curl",name:"Cable Biceps Curl",equipment:"cable",primary:["biceps"],secondary:[],repRange:[8,15],incrementKg:2.5},
  {id:"incline-db-curl",name:"Incline Dumbbell Curl",equipment:"dumbbell",primary:["biceps"],secondary:[],repRange:[8,15],incrementKg:1},
  {id:"weighted-dip",name:"Weighted Dip",equipment:"bodyweight",primary:["chest","triceps"],secondary:["frontDelts"],repRange:[5,10],incrementKg:2.5},
  {id:"jefferson-curl",name:"Jefferson Curl",equipment:"barbell",primary:["hamstrings"],secondary:["glutes"],repRange:[6,12],incrementKg:2.5},
  {id:"farmer-carry",name:"Farmer Carry",equipment:"dumbbell",primary:["back"],secondary:[],repRange:[10,20],incrementKg:2},

  {id:"incline-db-press",name:"Incline Dumbbell Press",equipment:"dumbbell",primary:["chest"],secondary:["frontDelts","triceps"],repRange:[6,10],incrementKg:2},
  {id:"flat-db-press",name:"Flat Dumbbell Press",equipment:"dumbbell",primary:["chest"],secondary:["frontDelts","triceps"],repRange:[8,12],incrementKg:2},
  {id:"weighted-pull-up",name:"Weighted Pull-up",equipment:"bodyweight",primary:["back"],secondary:["biceps"],repRange:[5,10],incrementKg:2.5},
  {id:"chest-supported-row",name:"Chest-supported Row",equipment:"machine",primary:["back"],secondary:["biceps"],repRange:[8,12],incrementKg:2.5},
  {id:"lat-pulldown",name:"Lat Pulldown",equipment:"cable",primary:["back"],secondary:["biceps"],repRange:[8,12],incrementKg:2.5},
  {id:"lateral-raise",name:"Dumbbell Lateral Raise",equipment:"dumbbell",primary:["sideDelts"],secondary:[],repRange:[10,20],incrementKg:1},
  {id:"db-shoulder-press",name:"Dumbbell Shoulder Press",equipment:"dumbbell",primary:["frontDelts"],secondary:["triceps","sideDelts"],repRange:[6,10],incrementKg:2},
  {id:"bayesian-curl",name:"Bayesian Cable Curl",equipment:"cable",primary:["biceps"],secondary:[],repRange:[8,15],incrementKg:2.5},
  {id:"triceps-pushdown",name:"Triceps Pushdown",equipment:"cable",primary:["triceps"],secondary:[],repRange:[8,15],incrementKg:2.5},
  {id:"rdl",name:"Romanian Deadlift",equipment:"barbell",primary:["hamstrings","glutes"],secondary:[],repRange:[6,10],incrementKg:2.5},
  {id:"leg-extension",name:"Leg Extension",equipment:"machine",primary:["quads"],secondary:[],repRange:[10,15],incrementKg:2.5},
  {id:"squat",name:"Squat",equipment:"barbell",primary:["quads"],secondary:["glutes"],repRange:[6,10],incrementKg:2.5},
  {id:"calf-raise",name:"Calf Raise",equipment:"machine",primary:["calves"],secondary:[],repRange:[10,20],incrementKg:2.5},
  {id:"cable-crunch",name:"Cable Crunch",equipment:"cable",primary:["abs"],secondary:[],repRange:[10,20],incrementKg:2.5},
];
