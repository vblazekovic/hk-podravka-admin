
import React, { useState } from "react";
import { generateUplatnica } from "../utils/pdf.js";

export default function MembershipFees({ db, setDb }) {
  const [month, setMonth] = useState(String(new Date().getMonth()+1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [scope, setScope] = useState("ALL");

  const createFees = ()=>{
    const list = db.members.filter(m=>scope==="ALL" ? m.paysFee : scope===m.id);
    const newFees = list.map(m=>{
      const amount = Number(m.feeAmount||30);
      const ref = `${m.oib || "00000000000"}-${m.id.slice(0,6)}-${month}/${year}`;
      return { id: `${m.id}-${year}-${month}`, memberId: m.id, amount, month, year, ref, paid:false };
    });
    setDb({...db, fees: [...newFees, ...db.fees]});
    alert(`Kreirano ${newFees.length} uplatnica.`);
  };

  const mark = (id, paid)=> setDb({...db, fees: db.fees.map(f=>f.id===id?{...f, paid}:f)});

  const fees = db.fees.filter(f=>f.month===month && f.year===year);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <label className="text-sm">Mjesec<input className="border rounded p-2 w-24" value={month} onChange={e=>setMonth(e.target.value)}/></label>
        <label className="text-sm">Godina<input className="border rounded p-2 w-24" value={year} onChange={e=>setYear(e.target.value)}/></label>
        <select className="border rounded p-2" value={scope} onChange={e=>setScope(e.target.value)}>
          <option value="ALL">Svi članovi koji plaćaju</option>
          {db.members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <button onClick={createFees} className="px-4 py-2 rounded-xl bg-[var(--klub-red)] text-white">Kreiraj članarine</button>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Član</th><th className="p-2">Iznos</th><th className="p-2">Poziv na broj</th><th className="p-2">Plaćeno</th><th className="p-2">PDF</th></tr></thead>
          <tbody>
            {fees.map(f=>{
              const m = db.members.find(x=>x.id===f.memberId)||{name:"(obrisan)"};
              return (
                <tr key={f.id} className="border-t">
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{f.amount.toFixed(2)} €</td>
                  <td className="p-2">{f.ref}</td>
                  <td className="p-2"><input type="checkbox" checked={f.paid} onChange={e=>mark(f.id, e.target.checked)} /></td>
                  <td className="p-2"><button onClick={()=>{ const doc = generateUplatnica(db.club, m, f.amount, f.ref); doc.save(`uplatnica_${m.name}_${f.month}-${f.year}.pdf`); }} className="text-sm underline">Skini</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
