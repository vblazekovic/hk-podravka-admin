
import React from "react";

export default function Veterans({ db, setDb }) {
  const vets = db.members.filter(m=>m.veteran);
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600">Ukupno veterana: {vets.length}</div>
      <div className="grid gap-2">
        {vets.map(v=>(
          <div key={v.id} className="bg-white rounded-2xl shadow p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{v.name}</div>
              <div className="text-xs text-gray-500">{v.emailAthlete || v.emailParent}</div>
            </div>
            <div className="flex gap-2">
              <button className="text-sm underline">E-mail</button>
              <button className="text-sm underline">WhatsApp</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
