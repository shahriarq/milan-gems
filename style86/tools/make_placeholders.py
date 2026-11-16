"""Generate warm, dark placeholder frames so the layout and scroll film can be
previewed before the salon's real photos arrive. Replace with real photos via
tools/build_media.py."""
import random, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = Path(__file__).resolve().parent.parent / "media"
SHOTS = {
    # name: (width, height, label, light position (x,y as 0-1), hue)
    "hero-1": (2560, 1440, "Interno salone · ampio", (0.72, 0.30), (201, 163, 91)),
    "hero-2": (2560, 1440, "Poltrona & specchio", (0.35, 0.40), (186, 140, 82)),
    "hero-3": (2560, 1440, "Sfumatura · dettaglio mani", (0.55, 0.45), (214, 176, 112)),
    "hero-4": (2560, 1440, "Colore · schiaritura", (0.30, 0.35), (196, 120, 86)),
    "hero-5": (2560, 1440, "Ritratto risultato finale", (0.60, 0.38), (205, 168, 98)),
    "g-1": (1200, 1500, "Skin fade", (0.5, 0.3), (201, 163, 91)),
    "g-2": (1200, 1200, "Barba a macchina", (0.4, 0.4), (186, 140, 82)),
    "g-3": (1200, 1500, "Balayage", (0.6, 0.3), (196, 120, 86)),
    "g-4": (1200, 1200, "Piega", (0.5, 0.35), (214, 176, 112)),
    "g-5": (1200, 1500, "Interno", (0.3, 0.3), (205, 168, 98)),
    "g-6": (1200, 1200, "Prodotti Olaplex · Redken", (0.55, 0.4), (186, 140, 82)),
    "studio": (1600, 2000, "Sami al lavoro", (0.45, 0.32), (201, 163, 91)),
}

def font(size):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        try: return ImageFont.truetype(p, size)
        except OSError: pass
    return ImageFont.load_default()

def make(name, w, h, label, light, hue):
    rnd = random.Random(name)
    small = Image.new("RGB", (w // 8, h // 8), (14, 12, 10))
    d = ImageDraw.Draw(small)
    sw, sh = small.size
    # warm pools of light
    for i in range(5):
        cx = (light[0] + rnd.uniform(-0.25, 0.25)) * sw
        cy = (light[1] + rnd.uniform(-0.2, 0.3)) * sh
        r = rnd.uniform(0.12, 0.3) * sw
        a = rnd.uniform(0.35, 0.8)
        col = tuple(int(c * a) for c in hue)
        d.ellipse([cx - r, cy - r * 0.8, cx + r, cy + r * 0.8], fill=col)
    # vertical "mirror" panels
    for i in range(rnd.randint(2, 4)):
        x = rnd.uniform(0.05, 0.9) * sw
        d.rectangle([x, sh * 0.12, x + sw * rnd.uniform(0.08, 0.16), sh * 0.7], outline=tuple(int(c * 0.35) for c in hue), width=1)
    img = small.filter(ImageFilter.GaussianBlur(sw / 28)).resize((w, h), Image.BICUBIC)
    # grain
    noise = Image.effect_noise((w, h), 18).convert("RGB")
    img = Image.blend(img, noise, 0.06)
    d = ImageDraw.Draw(img)
    f = font(max(18, w // 70))
    text = f"PLACEHOLDER  ·  {label.upper()}"
    d.text((w * 0.04, h - h * 0.07), text, fill=(242, 236, 227), font=f)
    img.save(OUT / f"{name}.jpg", quality=86, optimize=True, progressive=True)

for n, (w, h, label, light, hue) in SHOTS.items():
    make(n, w, h, label, light, hue)
print("ok", len(SHOTS))
