
import React, { useState } from "react";
import { uid } from "../utils/storage.js";

const PLACES = ["DVORANA SJEVER","IGRALIŠTE ANG","IGRALIŠTE SREDNJA","DRUGO"];

export default function Attendance({ db, setDb }) {
  const [t, setT] = useState({ id: uid(), date: new Date().toISOString().slice(0,10), coach:"", group:"", from:"18:00", to:"19:30", place:"DVORANA SJEVER", athletes:[] });

  const save = ()=>{
    setDb({...db, attendance:{...db.attendance, trainings:[t, ...(db.attendance.trainings||[])]}});
    setT({ id: uid(), date: new Date().toISOString().slice(0,10), coach:"", group:"", from:"18:00", to:"19:30", place:"DVORANA SJEVER", athletes:[] });
  };

  const toggleAthlete = (m) => {
    const has = t.athletes.includes(m.id);
    setT({...t, athletes: has ? t.athletes.filter(x=>x!==m.id) : [...t.athletes, m.id]});
  };

  const countByCoach = Object.values((db.attendance.trainings||[]).reduce((acc, tr)=>{
    const k = tr.coach||"NEPOZNATO";
    acc[k] = acc[k] || { sessions:0, hours:0 };
    acc[k].sessions += 1;
    const [fh,fm] = (tr.from||"0:0").split(":").map(Number);
    const [th,tm] = (tr.to||"0:0").split(":").map(Number);
    acc[k].hours += ((th+tm/60)-(fh+fm/60));
    return acc;
  }, {}));

  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold text-[var(--klub-red)]">Upis prisustva</h3>
      <div className="bg-white rounded-2xl shadow p-4 grid md:grid-cols-3 gap-2 text-sm">
        <Field label="Datum" value={t.date} onChange={v=>setT({...t,date:v})}/>
        <Field label="Trener" value={t.coach} onChange={v=>setT({...t,coach:v})}/>
        <Field label="Grupa" value={t.group} onChange={v=>setT({...t,group:v})}/>
        <Field label="Od" value={t.from} onChange={v=>setT({...t,from:v})}/>
        <Field label="Do" value={t.to} onChange={v=>setT({...t,to:v})}/>
        <Select label="Mjesto" value={t.place} onChange={v=>setT({...t,place:v})} options={PLACES}/>
        <div className="col-span-full">
          <div className="text-sm text-gray-600 mb-1">Odaberi sportaše</div>
          <div className="flex flex-wrap gap-2">
            {db.members.map(m=>(
              <button key={m.id} onClick={()=>toggleAthlete(m)} className={`px-2 py-1 rounded border text-xs ${t.athletes.includes(m.id)?'bg-red-100 border-red-300':'bg-white'}`}>{m.name}</button>
            ))}
          </div>
        </div>
        <div className="col-span-full">
          <button onClick={save} className="px-4 py-2 rounded-xl bg-[var(--klub-red)] text-white">Spremi prisustvo</button>
        </div>
      </div>

      <h3 className="font-semibold">Statistika (mjesečno, grubo)</h3>
      <table className="w-full text-sm bg-white rounded-2xl shadow overflow-hidden">
        <thead><tr className="text-left bg-red-50"><th className="p-2">Trener</th><th className="p-2">Broj treninga</th><th className="p-2">Sati</th></tr></thead>
        <tbody>
          {Object.entries((db.attendance.trainings||[]).reduce((acc,tr)=>{ const k=tr.coach||"NEPOZNATO"; acc[k]=(acc[k]||0)+1; return acc; },{})).map(([k,count])=>{
            const hours = (db.attendance.trainings||[]).filter(x=>x.coach===k).reduce((a,tr)=>{const [fh,fm]=(tr.from||"0:0").split(":").map(Number);const [th,tm]=(tr.to||"0:0").split(":").map(Number);return a+((th+tm/60)-(fh+fm/60));},0);
            return <tr key={k} className="border-t"><td className="p-2">{k}</td><td className="p-2">{count}</td><td className="p-2">{hours.toFixed(1)}</td></tr>
          })}
        </tbody>
      </table>
    </div>
  );
}

function Field({label,value,onChange}){ return <label className="text-sm"><div className="text-gray-500">{label}</div><input className="w-full border rounded p-2" value={value||""} onChange={e=>onChange(e.target.value)} /></label>}
function Select({label,value,onChange,options}){ return <label className="text-sm"><div className="text-gray-500">{label}</div><select className="w-full border rounded p-2" value={value||""} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></label>}
