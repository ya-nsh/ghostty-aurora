#!/usr/bin/env python3
"""Deterministic offscreen stills and microbenchmark for the shipped Stargaze GLSL.
Reuses the Silk renderer. Requires scripts/silk-requirements.txt. See docs/stargaze.md.
"""
import argparse
import importlib.util
import json
import re
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'demo' / 'stargaze'
spec = importlib.util.spec_from_file_location('silk_renderer', ROOT / 'scripts/render-silk.py')
silk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(silk)


def terminal(size):
    im = Image.new('RGBA', size, '#1c2021')
    d = ImageDraw.Draw(im)
    x, y = 75, 72
    rows = [
        ('~/ghostty-aurora  main', '#a39baf'),
        ('❯ bin/ghostty-aurora use stargaze', '#f0e9de'),
        ('Ghostty Aurora variant set to stargaze (stargaze.glsl).', '#e3b08f'),
        ('', '#eee7de'),
        ('// Lights off. Kettle on. Look up.', '#999396'),
        ('const stargaze = {', '#e9e2d9'),
        ('  sky:       "dark, and slowly turning",', '#a9b6e6'),
        ('  stars:     ["amber", "white", "blue"],', '#dcd3c4'),
        ('  meteors:   "now and then",', '#b6c6c3'),
        ('  fireflies: 5,', '#e3c08f'),
        ('};', '#e9e2d9'),
        ('', '#eee7de'),
        ('❯ ', '#f0e9de'),
    ]
    for line, color in rows:
        d.text((x, y), line, font=silk.font(27, True), fill=color)
        y += 49
    d.rectangle((x, y + 8, x + 15, y + 36), fill='#d3c6bd')
    return im


def renderer(variant, size):
    """Silk's renderer with Stargaze sample text. `variant` is a .glsl path relative to the repo."""
    r = silk.Renderer(variant, size)
    r.textures[1].write(terminal(size).tobytes())
    return r


def stills():
    OUT.mkdir(parents=True, exist_ok=True)
    r = renderer('stargaze', (1600, 960))
    r.still(30).save(OUT / 'stargaze-terminal.png')
    r.still(30, False).save(OUT / 'stargaze-detail.png')
    frames = [r.still(t).convert('RGB') for t in (3, 30, 90)]
    r.ctx.release()
    # Real meteors are rare by design, so the fourth frame uses a copy of the shader that
    # always launches one at the start of each slot, then catches it mid-flight.
    meteor = OUT / '.meteor.glsl'
    source = (ROOT / 'stargaze.glsl').read_text()
    source = re.sub(r'const float SHOOTING_CHANCE = [0-9.]+;', 'const float SHOOTING_CHANCE = 1.0;', source)
    meteor.write_text(source.replace('h.z * (SLOT - DURATION)', '0.0'))
    try:
        r = renderer('demo/stargaze/.meteor', (1600, 960))
        frames.append(r.still(19.6).convert('RGB'))
        r.ctx.release()
    finally:
        meteor.unlink()
    sheet = Image.new('RGB', (1600, 960))
    for i, frame in enumerate(frames):
        sheet.paste(frame.resize((800, 480), Image.LANCZOS), ((i % 2) * 800, (i // 2) * 480))
    sheet.save(OUT / 'stargaze-contact-sheet.jpg', quality=90)


def benchmark():
    result = {'note': 'Offscreen OpenGL shader draw + GPU synchronization; not native Ghostty FPS.', 'measurements': []}
    for size in [(1920, 1080), (3840, 2160)]:
        for variant in ['stargaze', 'stargaze-lite', 'silk']:
            r = renderer(variant, size)
            result['gpu'] = r.ctx.info['GL_RENDERER']
            for i in range(45):
                r.draw(i / 60)
            r.ctx.finish()
            samples = []
            for i in range(180):
                start = time.perf_counter()
                r.draw(i / 60)
                r.ctx.finish()
                samples.append((time.perf_counter() - start) * 1000)
            result['measurements'].append({
                'variant': variant,
                'resolution': list(size),
                'median_ms': round(float(np.median(samples)), 3),
                'p95_ms': round(float(np.percentile(samples, 95)), 3),
            })
            r.ctx.release()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'performance.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--benchmark', action='store_true')
    args = parser.parse_args()
    benchmark() if args.benchmark else stills()
