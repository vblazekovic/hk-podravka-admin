
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import JsBarcode from "jsbarcode";

export function generatePristupnica(member, club) {
  const doc = new jsPDF();
  const title = "PRISTUPNICA – HRVAČKI KLUB PODRAVKA";
  doc.setFontSize(14);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`${club.name} ${club.cityZip}, ${club.street} | web: ${club.website} | e-mail: ${club.email}`, 14, 28);
  doc.text(`OIB:${club.oib}, žiro-račun: ${club.iban}`, 14, 34);
  doc.setFontSize(12);
  doc.text(`Ime i prezime: ${member.name || ""}`, 14, 46);
  doc.text(`Datum rođenja: ${member.dob || ""}`, 14, 54);
  doc.text(`OIB: ${member.oib || ""}`, 14, 62);
  const text = `STATUT KLUBA - ČLANSTVO... (skraćena verzija za ispis). Puna verzija dostupna je na ${club.website}/o-klubu`;
  doc.setFontSize(9);
  doc.text(text, 14, 74, { maxWidth: 180 });
  doc.text("POTPIS ČLANA: ____________________", 14, 120);
  doc.text("POTPIS RODITELJA/STARATELJA: ____________________", 14, 128);
  return doc;
}

export function generatePrivola(member, club) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("PRIVOLA ZA OBRADU OSOBNIH PODATAKA", 14, 20);
  doc.setFontSize(10);
  doc.text(`${club.name} | ${club.cityZip}, ${club.street}`, 14, 28);
  doc.text(`Član: ${member.name || ""} | OIB: ${member.oib || ""} | Datum rođenja: ${member.dob || ""}`, 14, 36);
  doc.setFontSize(9);
  const longText = `Sukladno Zakonu o zaštiti osobnih podataka... (skraćeno za demo).`;
  doc.text(longText, 14, 50, { maxWidth: 180 });
  doc.text("Član kluba: ____________________", 14, 120);
  doc.text("Potpis: ____________________", 14, 128);
  doc.text("Roditelj/staratelj: ____________________", 14, 136);
  return doc;
}

export function generateUplatnica(club, member, amount, ref) {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("Uplatnica – Članarina", 14, 18);
  doc.setFontSize(10);
  doc.text(`Primatelj: ${club.name}, ${club.street}, ${club.cityZip}`, 14, 30);
  doc.text(`IBAN: ${club.iban}`, 14, 38);
  doc.text(`Iznos: ${amount.toFixed(2)} EUR`, 14, 46);
  doc.text(`Poziv na broj: ${ref}`, 14, 54);
  // barcode
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, ref, { format: "CODE128" });
  const img = canvas.toDataURL("image/png");
  doc.addImage(img, "PNG", 14, 60, 100, 20);
  doc.text(`Platitelj: ${member.name}`, 14, 88);
  return doc;
}
