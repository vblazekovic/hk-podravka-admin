
import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { uid } from "../utils/storage.js";

const CATS = ["PRVENSTVO HRVATSKE","MEĐUNARODNI TURNIR","REPREZENTATIVNI NASTUP","HRVAČKA LIGA ZA SENIORE","MEĐUNARODNA HRVAČKA LIGA ZA KADETE","REGIONALNO PRVENSTVO","LIGA ZA DJEVOJČICE","OSTALO"];
const REP_SUB = ["PRVENSTVO EUROPE","PRVENSTVO SVIJETA","PRVENSTVO BALKANA","UWW TURNIR"];
const STYLES = ["GR","FS","WW","BW","MODIFICIRANO"];
const AGE = ["POČETNICI","U11","U13","U15","U17","U20","U23","SENIORI"];

export default function Competitions({ db, setDb }) {
  const [form, setForm] = useState({id: uid(), cat:"", repSub:"", name:"", dateFrom:"", dateTo:"", place:"", style:"", age:"", country:"", countryCode:"", teamRank:"", clubCount:"", nationCount:"", athleteCount:"", athletes:[], coaches:[], notes:"", gallery:[], bulletinUrl:"", clubPostUrl:""});
  const fileRef = useRef();
  const addCoach = ()=>{
    const t = prompt("Trener:"); if(!t) return;
    setForm({...form, coaches:[...form.coaches, t]});
  };
  const addAthlete = ()=>{
    const who = prompt("Ime i prezime natjecatelja (odabrat ćeš detalje kasnije)"); if(!who) return;
    setForm({...form, athletes:[...form.athletes, {id: uid(), name: who, category:"", style:"", bouts:0, wins:0, losses:0, place:"", winsList:[], lossesList:[], note:""}]});
  };

  const save = ()=>{
    setDb({...db, competitions:[form, ...db.competitions]});
    setForm({id: uid(), cat:"", repSub:"", name:"", dateFrom:"", dateTo:"", place:"", style:"", age:"", country:"", countryCode:"", teamRank:"", clubCount:"", nationCount:"", athleteCount:"", athletes:[], coaches:[], notes:"", gallery:[], bulletinUrl:"", clubPostUrl:""});
  };

  const onUpload = ()=>{
    fileRef.current.click();
    fileRef.current.onchange = e=>{
      const f = e.target.files[0]; if(!f) return;
      const url = URL.createObjectURL(f);
      setForm({...form, gallery:[...form.gallery, {name:f.name, url}]});
      e.target.value = "";
    };
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--klub-red)]">Unos natjecanja</h3>
      <div className="bg-white rounded-2xl shadow p-4 grid md:grid-cols-3 gap-3 text-sm">
        <Select label="Vrsta natjecanja" value={form.cat} onChange={v=>setForm({...form, cat:v})} options={CATS}/>
        {form.cat==="REPREZENTATIVNI NASTUP" && <Select label="Podvrsta" value={form.repSub} onChange={v=>setForm({...form, repSub:v})} options={REP_SUB}/>}
        <Field label="Ime natjecanja" value={form.name} onChange={v=>setForm({...form, name:v})}/>
        <Field label="Datum od" value={form.dateFrom} onChange={v=>setForm({...form, dateFrom:v})}/>
        <Field label="Datum do (opcionalno)" value={form.dateTo} onChange={v=>setForm({...form, dateTo:v})}/>
        <Field label="Mjesto" value={form.place} onChange={v=>setForm({...form, place:v})}/>
        <Select label="Stil" value={form.style} onChange={v=>setForm({...form, style:v})} options={STYLES}/>
        <Select label="Uzrast" value={form.age} onChange={v=>setForm({...form, age:v})} options={AGE}/>
        <Field label="Država" value={form.country} onChange={v=>setForm({...form, country:v, countryCode:(v||'').slice(0,3).toUpperCase()})}/>
        <Field label="Kratica države (auto)" value={form.countryCode} onChange={v=>setForm({...form, countryCode:v})}/>
        <Field label="Ekipni poredak" value={form.teamRank} onChange={v=>setForm({...form, teamRank:v})}/>
        <Field label="Broj klubova" value={form.clubCount} onChange={v=>setForm({...form, clubCount:v})}/>
        <Field label="Broj zemalja" value={form.nationCount} onChange={v=>setForm({...form, nationCount:v})}/>
        <Field label="Broj natjecatelja" value={form.athleteCount} onChange={v=>setForm({...form, athleteCount:v})}/>
        <div className="col-span-full flex gap-2 items-center">
          <button onClick={addCoach} className="px-3 py-1 border rounded">Dodaj trenera</button>
          <div className="text-xs text-gray-600">Treneri: {form.coaches.join(", ")}</div>
        </div>
        <div className="col-span-full">
          <label className="text-sm text-gray-600">Zapažanje trenera / tekst za objavu</label>
          <textarea className="w-full border rounded-lg p-2" rows="3" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}></textarea>
        </div>
        <div className="col-span-full flex gap-2 items-center">
          <button onClick={onUpload} className="px-3 py-1 border rounded">Upload slika</button>
          <input type="file" ref={fileRef} className="hidden" accept="image/*"/>
          <div className="text-xs text-gray-600">Slike: {form.gallery.map(g=>g.name).join(", ")}</div>
        </div>
        <Field label="Rezultati / bilten (URL)" value={form.bulletinUrl} onChange={v=>setForm({...form, bulletinUrl:v})}/>
        <Field label="Objava na webu (URL)" value={form.clubPostUrl} onChange={v=>setForm({...form, clubPostUrl:v})}/>
        <div className="col-span-full">
          <button onClick={addAthlete} className="px-3 py-1 border rounded">Dodaj natjecatelja</button>
          <div className="mt-2 grid gap-2">
            {form.athletes.map(a=>(
              <div key={a.id} className="border rounded-xl p-2 grid md:grid-cols-6 gap-2">
                <Field label="Ime i prezime" value={a.name} onChange={v=>a.name=v} />
                <Field label="Kategorija" value={a.category} onChange={v=>a.category=v} />
                <Field label="Stil" value={a.style} onChange={v=>a.style=v} />
                <Field label="Ukupno borbi" value={a.bouts} onChange={v=>a.bouts=v} />
                <Field label="Pobjede" value={a.wins} onChange={v=>a.wins=v} />
                <Field label="Porazi" value={a.losses} onChange={v=>a.losses=v} />
                <Field label="Plasman" value={a.place} onChange={v=>a.place=v} />
                <Field label="Pobjede nad (ime/klub; + dodaj)" value={a.winsList.join("; ")} onChange={v=>a.winsList=v.split(";").map(s=>s.trim())} />
                <Field label="Porazi od (ime/klub; + dodaj)" value={a.lossesList.join("; ")} onChange={v=>a.lossesList=v.split(";").map(s=>s.trim())} />
                <label className="md:col-span-6 text-sm text-gray-600">Napomena<textarea className="w-full border rounded-lg p-2" rows="2" value={a.note} onChange={e=>a.note=e.target.value}></textarea></label>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-full">
          <button onClick={save} className="px-4 py-2 rounded-xl bg-[var(--klub-red)] text-white">Spremi natjecanje</button>
        </div>
      </div>

      <h3 className="text-xl font-bold">Spremljena natjecanja</h3>
      <div className="grid gap-2">
        {db.competitions.map(c=>(
          <div key={c.id} className="bg-white rounded-2xl shadow p-4">
            <div className="font-semibold">{c.name || c.cat} • {c.dateFrom}{c.dateTo?`–${c.dateTo}`:""} • {c.place}</div>
            <div className="text-xs text-gray-600">Treneri: {c.coaches.join(", ")}</div>
            <div className="text-xs text-gray-600">Athleti: {c.athletes.length}</div>
            {c.bulletinUrl && <a className="text-sm underline text-[var(--klub-red)]" href={c.bulletinUrl} target="_blank">Bilten/rezultati</a>}
            {c.clubPostUrl && <a className="ml-4 text-sm underline text-[var(--klub-red)]" href={c.clubPostUrl} target="_blank">Objava na webu</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({label,value,onChange}){ return <label className="text-sm"><div className="text-gray-500">{label}</div><input className="w-full border rounded-lg p-2" value={value||""} onChange={e=>onChange(e.target.value)} /></label>}
function Select({label,value,onChange,options}){ return <label className="text-sm"><div className="text-gray-500">{label}</div><select className="w-full border rounded-lg p-2" value={value||""} onChange={e=>onChange(e.target.value)}>{["",...options].map(o=><option key={o} value={o}>{o}</option>)}</select></label>}
