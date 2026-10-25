#!/usr/bin/env python3
"""Dodaje nove fotografije u galeriju.
1. Stavite JPG/PNG datoteke u mapu `nove-slike/` (naziv datoteke postaje opis, npr. 'dan-otvorenih-vrata.jpg').
2. Pokrenite: python3 tools/dodaj_slike.py   (potreban je Pillow: pip install pillow)
3. Skripta napravi veliku (1400 px) i malu (720 px) sliku te ih upiše u assets/js/gallery-data.js.
Nove slike dolaze na početak galerije. Postojeće se ne mijenjaju."""
import json, re, sys
from pathlib import Path
from PIL import Image, ImageOps
root = Path(__file__).resolve().parent.parent
src = root / "nove-slike"; full = root / "assets/img/galerija/full"; thumb = root / "assets/img/galerija/thumb"
data_file = root / "assets/js/gallery-data.js"
txt = data_file.read_text(encoding="utf-8")
data = json.loads(txt[txt.index("["): txt.rindex("]") + 1])
known = {Path(d["full"]).stem for d in data}
new = []
for f in sorted(src.glob("*")) if src.exists() else []:
    if f.suffix.lower() not in (".jpg", ".jpeg", ".png"): continue
    name = re.sub(r"[^a-z0-9]+", "-", f.stem.lower()).strip("-")
    if name in known: continue
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    a = im.copy(); a.thumbnail((1400, 1400)); a.save(full / f"{name}.jpg", quality=78, optimize=True)
    b = im.copy(); b.thumbnail((720, 720)); b.save(thumb / f"{name}.jpg", quality=72, optimize=True)
    cap = f.stem.replace("-", " ").replace("_", " ").strip().capitalize()
    new.append({"full": f"assets/img/galerija/full/{name}.jpg", "thumb": f"assets/img/galerija/thumb/{name}.jpg",
                "w": b.width, "h": b.height, "alt": cap, "caption": cap})
    print("Dodano:", f.name)
if not new: sys.exit("Nema novih slika u mapi nove-slike/")
data_file.write_text("window.GALLERY = " + json.dumps(new + data, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
print("Gotovo. Ukupno slika:", len(new) + len(data))
