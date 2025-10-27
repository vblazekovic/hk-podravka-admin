
import React, { useState } from "react";
import { uid } from "../utils/storage.js";

export default function Groups({ db, setDb }) {
  const [name, setName] = useState("");
  const add = ()=>{
    if(!name) return;
    setDb({...db, groups:[...db.groups, {id: uid(), name}]});
    setName("");
  };
  const remove = (id)=> setDb({...db, groups: db.groups.filter(g=>g.id!==id)});

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <input className="border rounded p-2" placeholder="Naziv grupe" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={add} className="px-3 py-2 rounded bg-[var(--klub-red)] text-white">Dodaj grupu</button>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        {db.groups.map(g=>(
          <div key={g.id} className="bg-white rounded-2xl shadow p-3 flex items-center justify-between">
            <div className="font-semibold">{g.name}</div>
            <button onClick={()=>remove(g.id)} className="text-sm text-red-600">Obriši</button>
          </div>
        ))}
      </div>
    </div>
  );
}
