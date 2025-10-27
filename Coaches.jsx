
import React, { useRef } from "react";
import { uid } from "../utils/storage.js";

export default function Coaches({ db, setDb }) {
  const fileRef = useRef();
  const add = () => {
    const name = prompt("Ime i prezime?"); if(!name) return;
    const c = { id: uid(), name, dob:"", oib:"", email:"", iban:"", group:"", contractUrl:"", docs:[], photoUrl:"" };
    setDb({ ...db, coaches: [c, ...db.coaches] });
  };
  const update = (id, p) => setDb({...db, coaches: db.coaches.map(c=>c.id===id?{...c, ...p}:c)});
  const remove = (id) => setDb({...db, coaches: db.coaches.filter(c=>c.id!==id)});

  const upload = (id, type) => {
    fileRef.current.click();
    fileRef.current.onchange = (e) => {
      const f = e.target.files[0]; if(!f) return;
      const url = URL.createObjectURL(f);
      if (type==="photo") update(id, { photoUrl:url });
      else if (type==="contract") update(id, { contractUrl:url });
      else update(id, { docs:[...(db.coaches.find(c=>c.id===id).docs||[]), {name:f.name,url}] });
      e.target.value = "";
    };
  };

  return (
    <div className="space-y-3">
      <button onClick={add} className="px-4 py-2 rounded-xl bg-[var(--klub-red)] text-white">Dodaj trenera</button>
      <input ref={fileRef} type="file" className="hidden" />
      {db.coaches.map(c=>(
        <div key={c.id} className="bg-white rounded-2xl shadow p-4">
          <div className="flex gap-3 items-center">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-red-50">{c.photoUrl?<img src={c.photoUrl} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Nema slike</div>}</div>
            <div className="font-bold text-lg">{c.name}</div>
            <button onClick={()=>remove(c.id)} className="ml-auto text-red-600 text-sm">Obriši</button>
          </div>
          <div className="mt-2 grid md:grid-cols-3 gap-2 text-sm">
            <Field label="Datum rođenja" value={c.dob} onChange={v=>update(c.id,{dob:v})}/>
            <Field label="OIB" value={c.oib} onChange={v=>update(c.id,{oib:v})}/>
            <Field label="E-mail" value={c.email} onChange={v=>update(c.id,{email:v})}/>
            <Field label="IBAN" value={c.iban} onChange={v=>update(c.id,{iban:v})}/>
            <Field label="Grupa koju vodi" value={c.group} onChange={v=>update(c.id,{group:v})}/>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded" onClick={()=>upload(c.id,'photo')}>Upload slika</button>
              <button className="px-2 py-1 border rounded" onClick={()=>upload(c.id,'contract')}>Upload ugovor</button>
              <button className="px-2 py-1 border rounded" onClick={()=>upload(c.id,'doc')}>Upload dokument</button>
            </div>
          </div>
          {c.contractUrl && <a className="text-sm text-[var(--klub-red)] underline" href={c.contractUrl} target="_blank">Ugovor</a>}
          {c.docs && c.docs.length>0 && <ul className="mt-2 text-sm list-disc ml-6">{c.docs.map((d,i)=>(<li key={i}><a href={d.url} target="_blank" className="underline">{d.name}</a></li>))}</ul>}
        </div>
      ))}
    </div>
  );
}

function Field({label,value,onChange}){
  return <label className="text-sm"><div className="text-gray-500">{label}</div><input className="w-full border rounded-lg p-2" value={value||""} onChange={e=>onChange(e.target.value)} /></label>
}
