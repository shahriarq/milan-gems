#!/usr/bin/env python3
"""
Procedural "realistic" macro-mineral placeholder generator for Milan Gems.

The brief for the cinematic redesign explicitly forbids abstract geometric
SVG facets as the site's defining visual and asks for realistic-feeling
macro gemstone photography (mineral texture, matrix veining, studio
lighting, dark cinematic environment) instead. Real stock photography can't
be fetched from this sandbox, so this script procedurally paints raster
textures with fractal noise, veining/banding structure and directional
studio-style lighting that read as photographic macro shots rather than
flat vector facets.

Output goes under /public/assets/stones/<slug>/realistic/ — the original
SVG facet placeholders are left untouched as fallback assets per the brief
("current placeholders can remain in the repository as fallback assets").

Run: python3 scripts/generate-realistic-media.py
Requires: Pillow, numpy, scipy (all present in this environment).
"""

import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
from scipy.ndimage import gaussian_filter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public", "assets", "stones")


def fractal_noise(h, w, octaves=5, seed=0, persistence=0.55):
    rng = np.random.default_rng(seed)
    result = np.zeros((h, w), dtype=np.float64)
    amp = 1.0
    total_amp = 0.0
    for o in range(octaves):
        scale = 2 ** o
        sh, sw = max(2, h // (2 ** (octaves - o) * 2)), max(2, w // (2 ** (octaves - o) * 2))
        layer = rng.random((sh, sw))
        layer_img = Image.fromarray((layer * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        layer_arr = np.asarray(layer_img, dtype=np.float64) / 255.0
        result += layer_arr * amp
        total_amp += amp
        amp *= persistence
    result /= total_amp
    result = gaussian_filter(result, sigma=max(1, min(h, w) * 0.002))
    result -= result.min()
    result /= max(result.max(), 1e-6)
    return result


def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def colorize(noise, stops):
    """stops: list of (threshold 0..1, rgb) sorted ascending."""
    h, w = noise.shape
    out = np.zeros((h, w, 3), dtype=np.uint8)
    flat = noise.flatten()
    result = np.zeros((flat.shape[0], 3), dtype=np.uint8)
    for i, (t0, c0) in enumerate(stops[:-1]):
        t1, c1 = stops[i + 1]
        mask = (flat >= t0) & (flat <= t1)
        if not np.any(mask):
            continue
        local_t = (flat[mask] - t0) / max(t1 - t0, 1e-6)
        for ch in range(3):
            result[mask, ch] = (c0[ch] + (c1[ch] - c0[ch]) * local_t).astype(np.uint8)
    out = result.reshape(h, w, 3)
    return Image.fromarray(out, mode="RGB")


def add_grain(img, amount=10, seed=0):
    rng = np.random.default_rng(seed)
    arr = np.asarray(img, dtype=np.int16)
    noise = rng.normal(0, amount, arr.shape[:2])[:, :, None]
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


def studio_light(img, cx_frac, cy_frac, strength=0.55, radius_frac=0.65, dark_edges=0.7):
    w, h = img.size
    y, x = np.mgrid[0:h, 0:w]
    cx, cy = w * cx_frac, h * cy_frac
    dist = np.sqrt(((x - cx) / w) ** 2 + ((y - cy) / h) ** 2)
    radius = radius_frac
    light = np.clip(1 - dist / radius, 0, 1) ** 1.6
    vignette = np.clip(1 - dist * dark_edges, 0.08, 1)
    factor = (vignette + light * strength)
    arr = np.asarray(img, dtype=np.float64)
    arr *= factor[:, :, None]
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


def draw_veins(img, seed, count, color, width_range=(1, 3), alpha=140):
    """Spiderweb-style matrix veining (turquoise matrix)."""
    rng = random.Random(seed)
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    nodes = [(rng.uniform(0, w), rng.uniform(0, h)) for _ in range(count)]
    for i, (x, y) in enumerate(nodes):
        others = sorted(nodes, key=lambda p: (p[0] - x) ** 2 + (p[1] - y) ** 2)[1:3]
        for ox, oy in others:
            segs = rng.randint(3, 6)
            pts = [(x, y)]
            for s in range(1, segs):
                t = s / segs
                jitter = rng.uniform(-18, 18)
                px = x + (ox - x) * t + jitter
                py = y + (oy - y) * t + rng.uniform(-18, 18)
                pts.append((px, py))
            pts.append((ox, oy))
            lw = rng.randint(*width_range)
            draw.line(pts, fill=(*color, alpha), width=lw, joint="curve")
    overlay = overlay.filter(ImageFilter.GaussianBlur(0.6))
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, overlay)
    return img.convert("RGB")


def draw_bands(noise, seed, rng_bands=10):
    """Concentric distorted bands for agate."""
    h, w = noise.shape
    y, x = np.mgrid[0:h, 0:w]
    cx, cy = w * 0.5, h * 0.42
    dist = np.sqrt(((x - cx)) ** 2 + ((y - cy) * 1.15) ** 2)
    dist = dist / dist.max()
    banded = (np.sin((dist + noise * 0.35) * rng_bands * math.pi) + 1) / 2
    return banded


def draw_facet_highlights(img, seed, count=14, color=(255, 246, 225)):
    """Soft, blurred specular hotspots — reads as light catching facets
    rather than pasted flat shapes."""
    rng = random.Random(seed)
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _ in range(count):
        cx, cy = rng.uniform(0.15, 0.85) * w, rng.uniform(0.15, 0.85) * h
        r = rng.uniform(0.015, 0.05) * min(w, h)
        sides = rng.randint(3, 5)
        pts = []
        base_angle = rng.uniform(0, math.pi)
        for i in range(sides):
            angle = base_angle + i * (2 * math.pi / sides)
            rr = r * rng.uniform(0.7, 1.05)
            pts.append((cx + math.cos(angle) * rr, cy + math.sin(angle) * rr))
        alpha = rng.randint(18, 46)
        draw.polygon(pts, fill=(*color, alpha))
    overlay = overlay.filter(ImageFilter.GaussianBlur(9))
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, overlay)
    return img.convert("RGB")


def draw_widmanstatten(img, seed, color=(210, 212, 216)):
    """Crosshatched etched-metal pattern for meteorite."""
    rng = random.Random(seed)
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for angle_set, alpha in ((28, 55), (-32, 40)):
        spacing = rng.uniform(22, 30)
        rad = math.radians(angle_set)
        length = math.hypot(w, h) * 1.4
        n = int(length / spacing)
        for i in range(-n, n):
            cx, cy = w / 2, h / 2
            offset = i * spacing
            x0 = cx + offset * math.cos(rad + math.pi / 2) - length / 2 * math.cos(rad)
            y0 = cy + offset * math.sin(rad + math.pi / 2) - length / 2 * math.sin(rad)
            x1 = cx + offset * math.cos(rad + math.pi / 2) + length / 2 * math.cos(rad)
            y1 = cy + offset * math.sin(rad + math.pi / 2) + length / 2 * math.sin(rad)
            draw.line([(x0, y0), (x1, y1)], fill=(*color, alpha), width=1)
    overlay = overlay.filter(ImageFilter.GaussianBlur(0.5))
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, overlay)
    return img.convert("RGB")


def finish(img, out_path, light_pos=(0.42, 0.36), strength=0.5, grain=9, seed=0, dark=0.75):
    img = studio_light(img, *light_pos, strength=strength, dark_edges=dark)
    img = img.filter(ImageFilter.GaussianBlur(0.4))
    img = add_grain(img, amount=grain, seed=seed)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "JPEG", quality=91)
    print("wrote", out_path)


# ---------------------------------------------------------------------------
# Material generators
# ---------------------------------------------------------------------------

def gen_turquoise(w, h, seed, matrix_density=9):
    noise = fractal_noise(h, w, octaves=6, seed=seed)
    stops = [
        (0.0, (10, 22, 22)),
        (0.28, (18, 58, 58)),
        (0.5, (41, 110, 104)),
        (0.68, (78, 158, 146)),
        (0.82, (128, 196, 178)),
        (1.0, (176, 224, 206)),
    ]
    img = colorize(noise, stops)
    img = draw_veins(img, seed, matrix_density, color=(15, 12, 10), width_range=(1, 4), alpha=190)
    img = draw_veins(img, seed + 1, max(2, matrix_density // 3), color=(70, 55, 40), width_range=(1, 2), alpha=90)
    img = img.filter(ImageFilter.GaussianBlur(0.3))
    return img


def gen_agate(w, h, seed):
    noise = fractal_noise(h, w, octaves=5, seed=seed)
    bands = draw_bands(noise, seed, rng_bands=12)
    stops = [
        (0.0, (18, 12, 8)),
        (0.25, (58, 38, 24)),
        (0.5, (110, 74, 42)),
        (0.72, (160, 118, 70)),
        (1.0, (214, 178, 128)),
    ]
    img = colorize(bands, stops)
    img = Image.blend(img, colorize(noise, stops), 0.25)
    return img


def gen_garnet(w, h, seed):
    noise = fractal_noise(h, w, octaves=6, seed=seed)
    stops = [
        (0.0, (10, 3, 4)),
        (0.3, (46, 8, 12)),
        (0.55, (94, 16, 22)),
        (0.75, (150, 30, 34)),
        (1.0, (206, 60, 52)),
    ]
    img = colorize(noise, stops)
    img = draw_facet_highlights(img, seed, count=18, color=(255, 214, 190))
    return img


def gen_meteorite(w, h, seed):
    noise = fractal_noise(h, w, octaves=6, seed=seed)
    stops = [
        (0.0, (8, 8, 9)),
        (0.35, (28, 29, 32)),
        (0.6, (58, 60, 65)),
        (0.8, (98, 101, 108)),
        (1.0, (150, 153, 160)),
    ]
    img = colorize(noise, stops)
    img = draw_widmanstatten(img, seed, color=(220, 222, 226))
    return img


def gen_hero(w, h, seed):
    """Cinematic hero: turquoise-forward macro, very dark surrounding field."""
    noise = fractal_noise(h, w, octaves=6, seed=seed)
    stops = [
        (0.0, (4, 4, 4)),
        (0.22, (7, 7, 7)),
        (0.42, (14, 34, 33)),
        (0.6, (24, 64, 60)),
        (0.78, (52, 108, 96)),
        (1.0, (104, 160, 140)),
    ]
    img = colorize(noise, stops)
    img = draw_veins(img, seed, 7, color=(6, 6, 6), width_range=(1, 4), alpha=200)
    # push most of the frame toward black so the specimen reads as an
    # isolated object in a dark studio rather than filling the frame
    mask = fractal_noise(h, w, octaves=3, seed=seed + 5)
    mask_img = Image.fromarray((np.clip(mask * 1.4 - 0.25, 0, 1) * 255).astype(np.uint8))
    black = Image.new("RGB", (w, h), (5, 5, 5))
    img = Image.composite(img, black, mask_img)
    return img


def crop_variant(img, seed, size):
    rng = random.Random(seed)
    w, h = img.size
    cw, ch = size
    scale = rng.uniform(1.0, 1.35)
    tw, th = int(cw * scale), int(ch * scale)
    if tw > w or th > h:
        ratio = max(tw / w, th / h)
        img = img.resize((int(w * ratio) + 2, int(h * ratio) + 2))
        w, h = img.size
    x0 = rng.randint(0, max(0, w - tw))
    y0 = rng.randint(0, max(0, h - th))
    crop = img.crop((x0, y0, x0 + tw, y0 + th)).resize(size, Image.LANCZOS)
    return crop


def main():
    random.seed(7)

    jobs = [
        ("turquoise", gen_turquoise, dict(matrix_density=10)),
        ("agate", gen_agate, {}),
        ("garnet", gen_garnet, {}),
        ("meteorite", gen_meteorite, {}),
    ]

    for slug, gen_fn, kwargs in jobs:
        base_seed = abs(hash(slug)) % 10_000
        big = gen_fn(2200, 2750, base_seed, **kwargs) if kwargs else gen_fn(2200, 2750, base_seed)

        hero_light = (0.4, 0.34) if slug != "meteorite" else (0.5, 0.3)
        hero = finish_copy(big, light_pos=hero_light, strength=0.55, seed=base_seed)
        save(hero, f"{slug}/realistic/{slug}-hero.jpg", size=(1600, 2000))

        for idx in range(1, 3 if slug == "turquoise" else 2):
            main_seed = base_seed + idx * 17
            main_crop = crop_variant(big, main_seed, (1500, 1500))
            main_img = finish_copy(main_crop, light_pos=(0.38, 0.34), strength=0.6, seed=main_seed)
            save(main_img, f"{slug}/realistic/{slug}-specimen-{idx:02d}-main.jpg", size=(1200, 1200))

            for letter, dseed in (("a", main_seed + 3), ("b", main_seed + 6)):
                if letter == "b" and idx == 2:
                    continue
                detail_crop = crop_variant(big, dseed, (1500, 1500))
                detail_img = finish_copy(detail_crop, light_pos=(0.55, 0.45), strength=0.45, seed=dseed)
                save(detail_img, f"{slug}/realistic/{slug}-specimen-{idx:02d}-detail-{letter}.jpg", size=(1200, 1200))

    hero_big = gen_hero(1920, 2400, 42)
    hero_final = finish_copy(hero_big, light_pos=(0.5, 0.32), strength=0.6, dark=0.85, seed=42)
    save(hero_final, "hero/realistic/hero-cinematic.jpg", size=(1920, 2400))


def finish_copy(img, light_pos, strength, seed, dark=0.75):
    out = studio_light(img, *light_pos, strength=strength, dark_edges=dark)
    out = out.filter(ImageFilter.GaussianBlur(0.35))
    out = add_grain(out, amount=8, seed=seed)
    return out


def save(img, rel_path, size):
    if img.size != size:
        img = img.resize(size, Image.LANCZOS)
    out_path = os.path.join(PUBLIC, rel_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "JPEG", quality=91)
    print("wrote", out_path)


if __name__ == "__main__":
    main()
