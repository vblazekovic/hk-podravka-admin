
import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import ClubInfo from "./sections/ClubInfo.jsx";
import Members from "./sections/Members.jsx";
import Coaches from "./sections/Coaches.jsx";
import Competitions from "./sections/Competitions.jsx";
import Statistics from "./sections/Statistics.jsx";
import Groups from "./sections/Groups.jsx";
import Veterans from "./sections/Veterans.jsx";
import Attendance from "./sections/Attendance.jsx";
import Messaging from "./sections/Messaging.jsx";
import MembershipFees from "./sections/MembershipFees.jsx";
import { loadAll, saveAll, defaultData } from "./utils/storage.js";

export default function App() {
  const [db, setDb] = useState(defaultData());
  const [section, setSection] = useState("club");
  const [role, setRole] = useState("admin"); // 'admin' or 'parent'

  useEffect(() => {
    const loaded = loadAll();
    setDb(loaded);
  }, []);

  useEffect(() => {
    saveAll(db);
  }, [db]);

  const logout = () => setRole(null);

  if (!role) return <Login setRole={setRole} setSection={setSection} />;

  return (
    <div className="min-h-screen body-gradient">
      <Navbar section={section} setSection={setSection} role={role} logout={logout} />
      <div className="max-w-7xl mx-auto p-4">
        {section === "club" && <ClubInfo db={db} setDb={setDb} />}
        {section === "members" && <Members db={db} setDb={setDb} />}
        {section === "coaches" && <Coaches db={db} setDb={setDb} />}
        {section === "competitions" && <Competitions db={db} setDb={setDb} />}
        {section === "statistics" && <Statistics db={db} />}
        {section === "groups" && <Groups db={db} setDb={setDb} />}
        {section === "veterans" && <Veterans db={db} setDb={setDb} />}
        {section === "attendance" && <Attendance db={db} setDb={setDb} />}
        {section === "messaging" && <Messaging db={db} />}
        {section === "fees" && <MembershipFees db={db} setDb={setDb} />}
      </div>
    </div>
  );
}
