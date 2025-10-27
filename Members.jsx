
import React, { useRef, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { uid } from "../utils/storage.js";
import { generatePristupnica, generatePrivola } from "../utils/pdf.js";

const TEMPLATE_HEADERS = [
  "Ime i prezime","Datum rođenja (YYYY-MM-DD)","Spol (M/Ž)","OIB","Mjesto prebivališta",
  "Email sportaša","Email roditelja","Broj osobne iskaznice","Osobna vrijedi do","Osobnu izdao",
  "Broj putovnice","Putovnica vrijedi do","Putovnicu izdao","Aktivni (DA/NE)","Veteran (DA/NE)",
  "Plaća članarinu (DA/NE)","Iznos članarine (EUR)","Grupa (naziv)"
];

export default function Members({ db, setDb }) {
  const inputRef = useRef();
  const photoRef = useRef();
  const [filter, setFilter] = useState("");

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ClanoviTemplate");
    const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array' });
    saveAs(new Blob([wbout]), "template_clanovi.xlsx");
  };

  const exportMembers = () => {
    const rows = db.members.map(m => [
      m.name,m.dob,m.sex,m.oib,m.city,m.emailAthlete,m.emailParent,
      m.idCardNumber,m.idCardValidTo,m.idCardIssuer,m.passportNumber,m.passportValidTo,m.passportIssuer,
      m.active?"DA":"NE", m.veteran?"DA":"NE", m.paysFee?"DA":"NE", m.feeAmount || 30, m.groupName || ""
    ]);
    const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, ...rows]);
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Clanovi");
    const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array' });
    saveAs(new Blob([wbout]), "clanovi_export.xlsx");
  };

  const importMembers = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type:'array'});
      const first = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(first, { header:1 });
      const [header, ...rest] = rows;
      const get = (row, name) => row[header.indexOf(name)] || "";
      const newMembers = rest.filter(r=>r.length>0).map(r => ({
        id: uid(),
        name: get(r, "Ime i prezime"),
        dob: get(r, "Datum rođenja (YYYY-MM-DD)"),
        sex: get(r, "Spol (M/Ž)"),
        oib: get(r, "OIB"),
        city: get(r, "Mjesto prebivališta"),
        emailAthlete: get(r, "Email sportaša"),
        emailParent: get(r, "Email roditelja"),
        idCardNumber: get(r, "Broj osobne iskaznice"),
        idCardValidTo: get(r, "Osobna vrijedi do"),
        idCardIssuer: get(r, "Osobnu izdao"),
        passportNumber: get(r, "Broj putovnice"),
        passportValidTo: get(r, "Putovnica vrijedi do"),
        passportIssuer: get(r, "Putovnicu izdao"),
        active: (get(r, "Aktivni (DA/NE)")||"").toUpperCase()==="DA",
        veteran: (get(r, "Veteran (DA/NE)")||"").toUpperCase()==="DA",
        paysFee: (get(r, "Plaća članarinu (DA/NE)")||"").toUpperCase()==="DA",
        feeAmount: Number(get(r, "Iznos članarine (EUR)")||30),
        groupName: get(r, "Grupa (naziv)"),
        photoUrl: "",
        consentCheckedAt: ""
      }));
      setDb({ ...db, members: [...db.members, ...newMembers] });
    };
    reader.readAsArrayBuffer(file);
  };

  const addMember = () => {
    const name = prompt("Ime i prezime?"); if(!name) return;
    const m = { id: uid(), name, dob:"", sex:"", oib:"", city:"", emailAthlete:"", emailParent:"", idCardNumber:"", idCardValidTo:"", idCardIssuer:"", passportNumber:"", passportValidTo:"", passportIssuer:"", active:false, veteran:false, paysFee:false, feeAmount:30, groupName:"", photoUrl:"", consentCheckedAt:"" };
    setDb({ ...db, members: [m, ...db.members] });
  };

  const update = (id, patch) => setDb({ ...db, members: db.members.map(m=>m.id===id?{...m, ...patch}:m) });
  const remove = (id) => setDb({ ...db, members: db.members.filter(m=>m.id!==id) });

  const filtered = useMemo(()=> db.members.filter(m=> (m.name||"").toLowerCase().includes(filter.toLowerCase())), [db.members, filter]);

  const onPhoto = (id, file) => {
    const url = URL.createObjectURL(file);
    update(id, { photoUrl: url });
  };

  const savePristupnica = (m) => {
    const doc = generatePristupnica(m, db.club);
    doc.save(`pristupnica_${m.name||"clan"}.pdf`);
  };
  const savePrivola = (m) => {
    const doc = generatePrivola(m, db.club);
    doc.save(`privola_${m.name||"clan"}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={addMember} className="px-4 py-2 rounded-xl bg-[var(--klub-red)] text-white">Novi član</button>
        <button onClick={exportMembers} className="px-4 py-2 rounded-xl bg-red-100">Skidanje datoteke s članovima</button>
        <button onClick={downloadTemplate} className="px-4 py-2 rounded-xl bg-[var(--klub-gold)]">Predložak (Excel)</button>
        <input type="file" ref={inputRef} className="hidden" accept=".xlsx,.xls" onChange={e=>importMembers(e.target.files[0])}/>
        <button onClick={()=>inputRef.current.click()} className="px-4 py-2 rounded-xl border">Upload Excel</button>
        <input placeholder="Pretraga..." className="ml-auto border rounded-lg p-2" value={filter} onChange={e=>setFilter(e.target.value)} />
      </div>
      <div className="grid gap-3">
        {filtered.map(m => (
          <div key={m.id} className={`bg-white rounded-2xl shadow p-4 ${daysToExpiry(m) <= 14 ? "ring-2 ring-red-400" : ""}`}>
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-red-50 rounded-xl overflow-hidden">
                {m.photoUrl ? <img src={m.photoUrl} className="w-full h-full object-cover"/> :
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Nema slike</div>}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg">{m.name}</div>
                <div className="text-sm text-gray-600">{m.dob} • OIB {m.oib} • {m.city}</div>
                <div className="text-xs text-gray-500">ID: {m.id}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={()=>remove(m.id)} className="text-red-600 text-sm">Obriši</button>
                <button onClick={()=>savePristupnica(m)} className="text-sm underline">Pristupnica (PDF)</button>
                <button onClick={()=>savePrivola(m)} className="text-sm underline">Privola (PDF)</button>
              </div>
            </div>
            <div className="mt-3 grid md:grid-cols-3 gap-2 text-sm">
              <Field label="Datum rođenja" value={m.dob} onChange={v=>update(m.id,{dob:v})}/>
              <Field label="Spol (M/Ž)" value={m.sex} onChange={v=>update(m.id,{sex:v})}/>
              <Field label="OIB" value={m.oib} onChange={v=>update(m.id,{oib:v})}/>
              <Field label="Mjesto prebivališta" value={m.city} onChange={v=>update(m.id,{city:v})}/>
              <Field label="Email sportaša" value={m.emailAthlete} onChange={v=>update(m.id,{emailAthlete:v})}/>
              <Field label="Email roditelja" value={m.emailParent} onChange={v=>update(m.id,{emailParent:v})}/>
              <Field label="Osobna (broj)" value={m.idCardNumber} onChange={v=>update(m.id,{idCardNumber:v})}/>
              <Field label="Osobna vrijedi do" value={m.idCardValidTo} onChange={v=>update(m.id,{idCardValidTo:v})}/>
              <Field label="Osobnu izdao" value={m.idCardIssuer} onChange={v=>update(m.id,{idCardIssuer:v})}/>
              <Field label="Putovnica (broj)" value={m.passportNumber} onChange={v=>update(m.id,{passportNumber:v})}/>
              <Field label="Putovnica vrijedi do" value={m.passportValidTo} onChange={v=>update(m.id,{passportValidTo:v})}/>
              <Field label="Putovnicu izdao" value={m.passportIssuer} onChange={v=>update(m.id,{passportIssuer:v})}/>
              <div className="flex items-center gap-2">
                <label><input type="checkbox" checked={m.active} onChange={e=>update(m.id,{active:e.target.checked})}/> Aktivni</label>
                <label><input type="checkbox" checked={m.veteran} onChange={e=>update(m.id,{veteran:e.target.checked})}/> Veteran</label>
                <label><input type="checkbox" checked={m.paysFee} onChange={e=>update(m.id,{paysFee:e.target.checked})}/> Plaća članarinu</label>
              </div>
              <Field label="Iznos članarine (EUR)" value={m.feeAmount} type="number" onChange={v=>update(m.id,{feeAmount:Number(v)})}/>
              <Field label="Grupa" value={m.groupName} onChange={v=>update(m.id,{groupName:v})} placeholder="npr. U13"/>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 border rounded" onClick={()=>photoRef.current.click()}>Upload slika</button>
                <input type="file" ref={photoRef} className="hidden" accept="image/*" onChange={e=>onPhoto(m.id,e.target.files[0])}/>
              </div>
              <div className="col-span-full text-xs text-gray-600">
                {daysToExpiry(m) <= 14 && <span className="text-red-600 font-semibold">Upozorenje: pregled ističe za {daysToExpiry(m)} dana</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <label className="text-sm">
      <div className="text-gray-500">{label}</div>
      <input className="w-full border rounded-lg p-2" value={value||""} type={type} placeholder={placeholder} onChange={e=>onChange(e.target.value)} />
    </label>
  );
}

function daysToExpiry(m) {
  const d = m.medicalValidTo || m.passportValidTo || m.idCardValidTo;
  if (!d) return 999;
  const dt = new Date(d);
  const diff = Math.ceil((dt - new Date())/ (1000*60*60*24));
  return diff;
}
