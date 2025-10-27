
import React, { useMemo, useState } from "react";

export default function Statistics({ db }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const data = useMemo(() => {
    const comps = db.competitions.filter(c => (c.dateFrom||'').startsWith(year));
    const totals = {
      count: comps.length,
      athletes: comps.reduce((a,c)=>a+(c.athletes?.length||0),0),
      wins: comps.reduce((a,c)=>a + (c.athletes||[]).reduce((x,y)=>x+Number(y.wins||0),0),0),
      losses: comps.reduce((a,c)=>a + (c.athletes||[]).reduce((x,y)=>x+Number(y.losses||0),0),0),
      medals: comps.reduce((a,c)=>a + (c.athletes||[]).filter(y=>['1','2','3'].includes(String(y.place))).length, 0)
    };
    const byAge = {};
    comps.forEach(c=>{
      const k = c.age || "NEPOZNATO";
      byAge[k] = byAge[k] || { comps:0, medals:0 };
      byAge[k].comps += 1;
      byAge[k].medals += (c.athletes||[]).filter(y=>['1','2','3'].includes(String(y.place))).length;
    });
    return { totals, byAge };
  }, [db, year]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <label className="text-sm">Godina</label>
        <input value={year} onChange={e=>setYear(e.target.value)} className="border rounded p-2 w-28"/>
      </div>
      <div className="grid md:grid-cols-4 gap-3">
        <Card title="Natjecanja" value={data.totals.count}/>
        <Card title="Nastupa" value={data.totals.athletes}/>
        <Card title="Pobjeda" value={data.totals.wins}/>
        <Card title="Poraza" value={data.totals.losses}/>
        <Card title="Medalja" value={data.totals.medals}/>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="font-semibold mb-2">Po uzrastima</div>
        <table className="w-full text-sm">
          <thead><tr className="text-left"><th className="p-2">Uzrast</th><th className="p-2">Natjecanja</th><th className="p-2">Medalje</th></tr></thead>
          <tbody>
            {Object.entries(data.byAge).map(([k,v])=>(<tr key={k} className="border-t"><td className="p-2">{k}</td><td className="p-2">{v.comps}</td><td className="p-2">{v.medals}</td></tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({title, value}){
  return <div className="bg-white rounded-2xl shadow p-4 text-center"><div className="text-xs text-gray-500">{title}</div><div className="text-2xl font-bold text-[var(--klub-red)]">{value}</div></div>
}
