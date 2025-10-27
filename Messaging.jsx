
import React, { useState } from "react";

export default function Messaging({ db }) {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState([]);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id]);

  const send = () => {
    const recipients = db.members.filter(m=>selected.includes(m.id));
    alert(`(Demo) Slanje e-maila ${recipients.length} primatelja.\n\nNaslov: Obavijest HK Podravka\nTekst: ${text.slice(0,120)}...`);
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-gray-600">Odaberi primatelje</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {db.members.map(m=>(
            <button key={m.id} onClick={()=>toggle(m.id)} className={`px-2 py-1 rounded border text-xs ${selected.includes(m.id)?'bg-red-100 border-red-300':'bg-white'}`}>{m.name}</button>
          ))}
        </div>
        <textarea className="w-full border rounded-lg p-2 mt-3" rows="4" placeholder="Poruka..." value={text} onChange={e=>setText(e.target.value)}></textarea>
        <div className="mt-2 flex gap-2">
          <button onClick={send} className="px-3 py-2 rounded bg-[var(--klub-red)] text-white">Pošalji e-mail</button>
          <button onClick={()=>alert('(Demo) WhatsApp poruke prema označenima.')} className="px-3 py-2 rounded bg-red-100">WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
