
import React from "react";
import logo from "../assets/logo.svg";

const items = [
  { id: "club", label: "Osnovni podaci" },
  { id: "members", label: "Članovi" },
  { id: "coaches", label: "Treneri" },
  { id: "competitions", label: "Natjecanja i rezultati" },
  { id: "statistics", label: "Statistika" },
  { id: "groups", label: "Grupe" },
  { id: "veterans", label: "Veterani" },
  { id: "attendance", label: "Prisustvo" },
  { id: "messaging", label: "Obavijesti" },
  { id: "fees", label: "Članarine" },
];

export default function Navbar({ section, setSection, role, logout }) {
  return (
    <header className="bg-white/90 sticky top-0 z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
        <img src={logo} alt="HK Podravka" className="w-10 h-10" />
        <div className="text-xl font-bold text-[var(--klub-red)]">HK Podravka – Admin</div>
        <nav className="ml-auto hidden md:flex gap-2 flex-wrap">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setSection(it.id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-50 ${section === it.id ? "bg-red-100 text-red-800" : "text-gray-700"}`}
            >
              {it.label}
            </button>
          ))}
        </nav>
        <div className="ml-auto md:ml-2 flex items-center gap-2">
          <span className="text-xs text-gray-600 bg-red-50 px-2 py-1 rounded-lg">Uloga: {role}</span>
          <button onClick={logout} className="text-sm px-3 py-1 rounded-lg border border-red-300 hover:bg-red-50">Odjava</button>
        </div>
      </div>
      <div className="md:hidden px-4 pb-2 flex gap-2 flex-wrap">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setSection(it.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-50 ${section === it.id ? "bg-red-100 text-red-800" : "text-gray-700"}`}
          >
            {it.label}
          </button>
        ))}
      </div>
    </header>
  );
}
