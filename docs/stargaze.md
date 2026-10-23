# Stargaze

Stargaze is an MIT-licensed Ghostty shader for a true-black (OLED) terminal: a
night sky with nothing behind it. Stars in amber, white, and blue twinkle slowly
at three depths as the sky turns, a meteor crosses now and then, and a few
fireflies drift over a low ember glow at the bottom edge. Empty sky stays
exactly black, so OLED pixels there stay switched off.

| Variant | What you get |
| --- | --- |
| `stargaze` | Stars, meteors, fireflies, and a low ember glow. |
| `stargaze-lite` | Only the stars. |
| `stargaze-galaxy` | Everything in `stargaze`, plus a dusty Milky Way and a fuller hearth glow. |

![Stargaze, Stargaze Lite, Stargaze Galaxy, and a meteor](../demo/stargaze/stargaze-contact-sheet.jpg)

Clockwise from top left: Stargaze, Stargaze Lite, a meteor, and Stargaze Galaxy.
The meteor frame is forced so it shows up in a still. Real meteors cross in fewer
than half of the 19-second windows, at a random moment.

## Use

```sh
bin/ghostty-aurora use stargaze
bin/ghostty-aurora use stargaze-lite
bin/ghostty-aurora use stargaze-galaxy
```

A shader can only add light to what Ghostty draws, so set the terminal
background to black too:

```conf
background = 000000
config-file = /path/to/ghostty-aurora/config/ghostty-aurora.conf
```

Then reload the config. Direct installation also works:

```conf
background = 000000
custom-shader = /absolute/path/to/stargaze.glsl
custom-shader-animation = true
```

## Tuning

Durable edits belong in `src/stargaze.template.glsl` and `src/variants.mjs`;
regenerate with `node scripts/build-variants.mjs`.

| Constant | What it does |
| --- | --- |
| `AURORA_INTENSITY` | Overall strength. Kept under this name so the switcher's `--intensity` and `intensity set` work. |
| `SKY_DRIFT` | Radians per second the sky turns around a pole above the window. |
| `SKY_TINT` | Faint indigo depth toward the top. `0.0` (all variants) keeps empty sky true black. |
| `MILKY_WAY` | Strength of the galaxy band. `0.0` removes it and its noise cost. |
| `SHOOTING_CHANCE` | Chance that a meteor crosses in each 19-second window. `0.0` disables meteors. |
| `FIREFLIES` | Number of fireflies. `0` removes the loop. |
| `HEARTH` | Strength of the warm glow along the bottom edge. |

## How it works

- Each star layer hashes its grid cell once. A star sits away from the cell
  edges, so one lookup never clips it. Brightness follows a cubic curve, so most
  stars are faint and a few are bright. The brightest stars in the nearest layer
  get thin cross glints.
- The sky turns around a pole above the window. Nearer layers turn slightly
  faster for a hint of parallax.
- Each meteor is a gaussian line with a fading tail, launched from one hash per
  19-second window.
- **True black:**
  - A black floor subtracts two 8-bit levels from all added light. The faint
    tails of halos and glows sit only a level or two above black, where they are
    invisible but would keep OLED pixels lit.
  - The hearth glow is cut off by the lower third of the window.
  - The anti-banding dither fades out wherever no light is added.
- A highlight knee leaves faint light untouched but rolls bright star and
  firefly cores off smoothly, so no point turns pure white and reads as a stray
  glyph.
- Text protection, alpha handling, and exact identity at zero intensity match
  Silk and Nocturne.

## Performance and validation

Measured on Apple M1 Pro, offscreen OpenGL via ModernGL, 45 warmup frames
and 180 measured frames per case, with Silk measured in the same run. This is a
shader microbenchmark, **not native Ghostty FPS**, nor a measure of Ghostty's
Metal pipeline, compositor, or battery cost.

| Shader | Resolution | Median | 95th percentile |
| --- | --- | --- | --- |
| Stargaze | 1920 × 1080 | 1.280 ms | 2.082 ms |
| Stargaze Lite | 1920 × 1080 | 0.730 ms | 1.618 ms |
| Stargaze Galaxy | 1920 × 1080 | 1.375 ms | 2.589 ms |
| Silk (same run) | 1920 × 1080 | 0.794 ms | 1.670 ms |
| Stargaze | 3840 × 2160 | 3.128 ms | 4.507 ms |
| Stargaze Lite | 3840 × 2160 | 1.987 ms | 3.265 ms |
| Stargaze Galaxy | 3840 × 2160 | 4.595 ms | 8.405 ms |
| Silk (same run) | 3840 × 2160 | 2.128 ms | 3.589 ms |

Raw data: `demo/stargaze/performance.json`.

`python scripts/verify-silk.py` covers all three Stargaze variants. On a black
1600 × 960 frame, about 73% of `stargaze` pixels and 96% of `stargaze-lite`
pixels stay exactly black. The script checks those shares at a smaller size,
where fixed-size star halos cover more of the frame. Its motion check counts the
share of pixels that change by at least two levels, rather than averaging over
the whole frame, because twinkling stars move only a small part of it.
Regenerate the stills and benchmark with:

```sh
python scripts/render-stargaze.py
python scripts/render-stargaze.py --benchmark
```
