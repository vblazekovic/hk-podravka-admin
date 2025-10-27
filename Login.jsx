
import React, { useState } from "react";

export default function Login({ setRole, setSection }) {
  const [email, setEmail] = useState("");
  const [oib, setOib] = useState("");
  const [adminPin, setAdminPin] = useState("");

  const loginAdmin = () => {
    if (adminPin === (import.meta.env.VITE_ADMIN_PIN || "0000")) {
      setRole("admin"); setSection("club");
    } else {
      alert("Pogrešan PIN.");
    }
  };

  const loginParent = () => {
    if (email && oib) {
      setRole("parent"); setSection("members");
    } else {
      alert("Unesite e-mail i OIB za roditeljski pristup.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-[var(--klub-red)]">HK Podravka – Prijava</h1>
        <div className="space-y-2">
          <div className="font-semibold">Admin / trener</div>
          <input className="w-full border rounded-lg p-2" placeholder="Admin PIN (default 0000)" value={adminPin} onChange={e=>setAdminPin(e.target.value)} />
          <button onClick={loginAdmin} className="w-full bg-[var(--klub-red)] text-white rounded-lg py-2 font-semibold">Prijava (admin)</button>
        </div>
        <hr/>
        <div className="space-y-2">
          <div className="font-semibold">Roditelj / sportaš</div>
          <input className="w-full border rounded-lg p-2" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-lg p-2" placeholder="OIB člana" value={oib} onChange={e=>setOib(e.target.value)} />
          <button onClick={loginParent} className="w-full bg-[var(--klub-gold)] text-black rounded-lg py-2 font-semibold">Prijava (roditelj)</button>
        </div>
        <p className="text-xs text-gray-500 text-center">Napomena: Ovo je lokalna (bez poslužitelja) verzija za testiranje. Svi podaci se spremaju u preglednik (localStorage).</p>
      </div>
    </div>
  );
}
