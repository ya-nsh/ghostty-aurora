#!/usr/bin/env python3
"""Deterministic offscreen stills and microbenchmark for the shipped Nocturne GLSL.
Reuses the Silk renderer. Requires scripts/silk-requirements.txt. See docs/nocturne.md.
"""
import argparse
import importlib.util
import json
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'demo' / 'nocturne'
spec = importlib.util.spec_from_file_location('silk_renderer', ROOT / 'scripts/render-silk.py')
silk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(silk)


def terminal(size):
    im = Image.new('RGBA', size, '#1c2021')
    d = ImageDraw.Draw(im)
    x, y = 75, 72
    rows = [
        ('~/ghostty-aurora  main', '#a39baf'),
        ('❯ bin/ghostty-aurora use nocturne', '#f0e9de'),
        ('Ghostty Aurora variant set to nocturne (nocturne.glsl).', '#9fb4d8'),
        ('', '#eee7de'),
        ('// Twilight, held still for a while.', '#999396'),
        ('const nocturne = {', '#e9e2d9'),
        ('  sky:     ["indigo", "jade", "plum"],', '#a9b6e6'),
        ('  horizon: "ember",', '#e3b08f'),
        ('  stars:   "faint, and only where it is dark",', '#b6c6c3'),
        ('  passes:  1,', '#c4accf'),
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
    r = silk.Renderer(variant, size)
    r.textures[1].write(terminal(size).tobytes())
    return r


def stills():
    OUT.mkdir(parents=True, exist_ok=True)
    r = renderer('nocturne', (1600, 960))
    r.still(90).save(OUT / 'nocturne-terminal.png')
    r.still(90, False).save(OUT / 'nocturne-detail.png')
    frames = [r.still(t).convert('RGB') for t in (0, 40, 90, 160)]
    r.ctx.release()
    sheet = Image.new('RGB', (1600, 960))
    for i, frame in enumerate(frames):
        sheet.paste(frame.resize((800, 480), Image.LANCZOS), ((i % 2) * 800, (i // 2) * 480))
    sheet.save(OUT / 'nocturne-contact-sheet.jpg', quality=90)


def benchmark():
    result = {'note': 'Offscreen OpenGL shader draw + GPU synchronization; not native Ghostty FPS.', 'measurements': []}
    for size in [(1920, 1080), (3840, 2160)]:
        for variant in ['nocturne', 'nocturne-lite', 'silk']:
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
