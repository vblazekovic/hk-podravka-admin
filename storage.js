
export function defaultData() {
  return {
    club: {
      name: "HRVAČKI KLUB PODRAVKA",
      street: "Miklinovec 6a",
      cityZip: "48000 Koprivnica",
      iban: "HR6923860021100518154",
      oib: "60911784858",
      email: "hsk-podravka@gmail.com",
      website: "hk-podravka.com",
      socials: { instagram: "", facebook: "", tiktok: "" },
      president: [], // [{name, phone, email}]
      secretary: [],
      board: [],
      supervisory: [],
      documents: [] // {type:'Statut'|... , name, url}
    },
    groups: [
      { id: "g1", name: "Početnici" },
      { id: "g2", name: "U11" },
      { id: "g3", name: "U13" },
      { id: "g4", name: "U15" },
      { id: "g5", name: "U17" },
      { id: "g6", name: "U20/U23" },
      { id: "g7", name: "Seniori" },
      { id: "g8", name: "Djevojčice" },
      { id: "g9", name: "Veterani" }
    ],
    members: [],
    coaches: [],
    competitions: [],
    attendance: { coaches: [], trainings: [], camps: [] },
    fees: [],
    messages: []
  };
}

const KEY = "hk_podravka_db_v1";

export function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultData();
    return JSON.parse(raw);
  } catch (e) {
    console.error(e);
    return defaultData();
  }
}

export function saveAll(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

// helpers
export const uid = () => Math.random().toString(36).slice(2);
