
# HK Podravka – Admin aplikacija (Vite + React + Tailwind)

**Boje**: crvena `#D21E2B`, zlatna `#C6A753`, bijela `#FFFFFF`  
**Logo**: `/src/assets/logo.svg` (zamjenjiv).  
**Kontakt**: hsk-podravka@gmail.com — Miklinovec 6a, 48000 Koprivnica — OIB 60911784858  
**Web**: hk-podravka.com

## Pokretanje

```bash
npm i
npm run dev
# build
npm run build
npm run preview
```

> Admin PIN je `0000` (promijeni ga u `.env` datoteci: `VITE_ADMIN_PIN=1234`).  
> Podaci se spremaju u `localStorage` – za produkciju preporučam backend (Supabase/Firebase/Django).

## Sekcije
- Osnovni podaci o klubu (uprava, nadzorni odbor, upload statuta i dokumenata, društvene mreže)
- Članovi (ručni unos + Excel import/export, slika, grupe, veteran, članarina, PDF *Pristupnica* i *Privola*, upozorenje 14 dana prije isteka pregleda – demo)
- Treneri (ugovori/dokumenti/slike)
- Natjecanja i rezultati (vrsta, stil, uzrast, statistika, treneri, galerija, bilteni, objave, rezultati po natjecatelju)
- Statistika (agregati po godini i uzrastima)
- Grupe (dodavanje/brisanje)
- Veterani (popis + brzo slanje obavijesti — demo)
- Prisustvo (trener, grupa, mjesto, sati, evidencija i brza statistika)
- Obavijesti (odabir članova + e-mail/WhatsApp — demo)
- Članarine (kreiranje, PDF uplatnice s barkodom, evidencija plaćanja)

## Uvoz/izvoz
- Predlošci za Excel generiraju se iz sučelja (ili pogledaj `/public/templates`).

## GitHub upute
1. Napravi repo (npr. `hk-podravka-admin`).
2. Kopiraj sadržaj ove mape u repo.
3. Pokreni:
   ```bash
   git init
   git add .
   git commit -m "Init HK Podravka app"
   git branch -M main
   git remote add origin <URL tvog repozitorija>
   git push -u origin main
   ```

## Napomene
- Ovo je **frontend prototip** (bez poslužitelja). Sve radi lokalno. Za e-mailove, WhatsApp, prijave roditelja i trajno čuvanje dokumenata treba dodati backend (npr. supabase storage + auth).
- PDF-ovi se generiraju klijentski (jsPDF). Tekstovi iz Statuta sažete su verzije — zamijeni punim tekstom po potrebi.
