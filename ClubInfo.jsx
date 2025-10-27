
import React, { useRef } from "react";
import { uid } from "../utils/storage.js";

export default function ClubInfo({ db, setDb }) {
  const fileRef = useRef();

  const update = (patch) => setDb({ ...db, club: { ...db.club, ...patch }});

  const addPerson = (key) => {
    const name = prompt("Ime i prezime?"); if(!name) return;
    const phone = prompt("Kontakt broj?")||"";
    const email = prompt("E-mail?")||"";
    setDb({ ...db, club: { ...db.club, [key]: [...db.club[key], { id: uid(), name, phone, email }] } });
  };

  const removePerson = (key, id) => {
    setDb({ ...db, club: { ...db.club, [key]: db.club[key].filter(p=>p.id!==id) } });
  };

  const uploadDoc = (type) => {
    fileRef.current.click();
    fileRef.current.onchange = (e) => {
      const f = e.target.files[0]; if(!f) return;
      const url = URL.createObjectURL(f);
      setDb({ ...db, club: { ...db.club, documents: [...db.club.documents, { id: uid(), type, name: f.name, url }] } });
      e.target.value = "";
    };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[var(--klub-red)]">Osnovni podaci o klubu</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow space-y-2">
          <label className="text-sm">Naziv</label>
          <input value={db.club.name} onChange={e=>update({name:e.target.value})} className="w-full border rounded-lg p-2"/>
          <label className="text-sm">Ulica i broj</label>
          <input value={db.club.street} onChange={e=>update({street:e.target.value})} className="w-full border rounded-lg p-2"/>
          <label className="text-sm">Grad i poštanski broj</label>
          <input value={db.club.cityZip} onChange={e=>update({cityZip:e.target.value})} className="w-full border rounded-lg p-2"/>
          <label className="text-sm">IBAN</label>
          <input value={db.club.iban} onChange={e=>update({iban:e.target.value})} className="w-full border rounded-lg p-2"/>
          <label className="text-sm">OIB</label>
          <input value={db.club.oib} onChange={e=>update({oib:e.target.value})} className="w-full border rounded-lg p-2"/>
          <label className="text-sm">E-mail</label>
          <input value={db.club.email} onChange={e=>update({email:e.target.value})} className="w-full border rounded-lg p-2"/>
          <label className="text-sm">Web</label>
          <input value={db.club.website} onChange={e=>update({website:e.target.value})} className="w-full border rounded-lg p-2"/>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Instagram link" value={db.club.socials.instagram} onChange={e=>update({socials:{...db.club.socials, instagram:e.target.value}})} className="border rounded-lg p-2"/>
            <input placeholder="Facebook link" value={db.club.socials.facebook} onChange={e=>update({socials:{...db.club.socials, facebook:e.target.value}})} className="border rounded-lg p-2"/>
            <input placeholder="TikTok link" value={db.club.socials.tiktok} onChange={e=>update({socials:{...db.club.socials, tiktok:e.target.value}})} className="border rounded-lg p-2"/>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold">Predsjednik</div>
            <button onClick={()=>addPerson('president')} className="text-sm px-3 py-1 rounded bg-red-100">Dodaj</button>
          </div>
          <ul className="space-y-1">
            {db.club.president.map(p=>(
              <li key={p.id} className="flex items-center justify-between border rounded-lg p-2">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.phone} · {p.email}</div>
                </div>
                <button onClick={()=>removePerson('president', p.id)} className="text-xs text-red-600">Ukloni</button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-4">
            <div className="font-semibold">Tajnik</div>
            <button onClick={()=>addPerson('secretary')} className="text-sm px-3 py-1 rounded bg-red-100">Dodaj</button>
          </div>
          <ul className="space-y-1">
            {db.club.secretary.map(p=>(
              <li key={p.id} className="flex items-center justify-between border rounded-lg p-2">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.phone} · {p.email}</div>
                </div>
                <button onClick={()=>removePerson('secretary', p.id)} className="text-xs text-red-600">Ukloni</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RoleList title="Predsjedništvo" list={db.club.board} onAdd={()=>addPerson('board')} onRemove={(id)=>removePerson('board', id)} />
        <RoleList title="Nadzorni odbor" list={db.club.supervisory} onAdd={()=>addPerson('supervisory')} onRemove={(id)=>removePerson('supervisory', id)} />
      </div>

      <div className="bg-white rounded-2xl p-4 shadow">
        <div className="flex items-center gap-2">
          <button onClick={()=>uploadDoc('Statut')} className="px-3 py-2 rounded-lg bg-[var(--klub-gold)]">Upload Statuta</button>
          <button onClick={()=>uploadDoc('Dokument')} className="px-3 py-2 rounded-lg bg-red-100">Upload dokumenta</button>
          <input type="file" ref={fileRef} className="hidden" />
        </div>
        <ul className="mt-4 grid md:grid-cols-2 gap-2">
          {db.club.documents.map(d=>(
            <li key={d.id} className="border rounded-lg p-2 flex items-center justify-between">
              <div><span className="text-xs bg-red-50 px-2 py-1 rounded mr-2">{d.type}</span>{d.name}</div>
              <a href={d.url} target="_blank" className="text-sm text-[var(--klub-red)] underline">Otvori</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RoleList({ title, list, onAdd, onRemove }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{title}</div>
        <button onClick={onAdd} className="text-sm px-3 py-1 rounded bg-red-100">Dodaj</button>
      </div>
      <ul className="mt-2 space-y-1">
        {list.map(p=>(
          <li key={p.id} className="flex items-center justify-between border rounded-lg p-2">
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-gray-500">{p.phone} · {p.email}</div>
            </div>
            <button onClick={()=>onRemove(p.id)} className="text-xs text-red-600">Ukloni</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
