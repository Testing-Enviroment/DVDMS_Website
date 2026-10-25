# DVD Moslavačka Slatina – web stranica

Statička web stranica (HTML + CSS + malo JavaScripta), bez build koraka. Prilagođena mobitelima.

## Objava na GitHub Pages
1. Napravite repozitorij na GitHubu i učitajte sve datoteke iz ove mape (uključujući skrivenu `.nojekyll`).
2. **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, branch `main`, folder `/ (root)`.
3. Stranica će biti na `https://<korisnik>.github.io/<repozitorij>/`.
4. Vlastita domena: dodajte datoteku `CNAME` s imenom domene i podesite DNS.

## Što urediti
- Tekstovi i novosti: `index.html`. Boje: vrh `assets/css/style.css`.
- Fotografije: `assets/img/` (`dom.jpg`, `banner.jpg`). Ilustracije (`*.svg`) zamijenite stvarnim fotografijama.
- Slike spremite kao JPG (ne HEIC) i smanjite na oko 1600 px širine.

## Lokalni pregled
`python3 -m http.server` pa otvorite http://localhost:8000

## Provjerite
Adresa (Put kroz selo 52) preuzeta je iz javnog registra tvrtki. Potvrdite da je točna. Novosti su primjeri.

## Slike
Slike držite u `assets/img/` unutar repozitorija (GitHub Pages ih poslužuje besplatno). Povezivanje slika s Google Drivea ne preporučuje se jer Drive ne služi slike pouzdano za druge stranice.
Ilustracije su u `assets/img/ilustracije/` i trenutno se ne koriste.

## Izvori tekstova o povijesti i okolici
- Grad Popovača, objava o skupštini DVD-a (2011.): popovaca.hr
- 044Portal, skupština DVD-a Moslavačka Slatina (17. 2. 2025.): 044portal.hr
- Javni registar tvrtki (companywall.hr): adresa i datum upisa 19. 1. 1998.
- Popis stanovništva 2021. (citypopulation.de): 68 stanovnika
- Hrvatski restauratorski zavod, Jelengrad (hrz.hr); Kulturna dobra općine Velika Ludina (Košutgrad)
- Turističke priče, Moslavina (turistickeprice.hr)
Tekstove prije objave provjerite i dopunite podacima iz kronike društva.

## Galerija
Početna stranica prikazuje nekoliko fotografija, a `galerija.html` sve, po 6 na stranici (1, 2, 3 ...). Broj po stranici je `PER` u `assets/js/gallery-page.js`.
Nove fotografije: stavite ih u `nove-slike/` i pokrenite `python3 tools/dodaj_slike.py`. Skripta ih smanji i doda u galeriju.
Mali pregledi (thumb) učitavaju se na stranici, a velika slika tek kad kliknete.
