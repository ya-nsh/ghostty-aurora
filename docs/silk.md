# Silk

Silk is an MIT-licensed Ghostty shader made from four analytic folds in champagne
and lilac. Silk Lite uses two folds. Both are standalone GLSL files, require only
`iChannel0`, `iResolution`, and `iTime`, and keep the terminal's alpha and bright
or saturated text colors intact. No image assets, textures beyond the terminal,
noise octaves, ray marching, or feedback buffers are needed.

## Use

```sh
bin/ghostty-aurora use silk
bin/ghostty-aurora use silk-lite
bin/ghostty-aurora use silk --intensity 0.5
```

Include `config/ghostty-aurora.conf` in your Ghostty config, then reload the config.
Use Ghostty's Reload Configuration menu item or your configured reload binding.
The checked-in config fragment uses a shader path relative to its own directory.
The switcher writes an absolute path when you select a preset.

Direct installation also works:

```conf
custom-shader = /absolute/path/to/silk.glsl
custom-shader-animation = true
```

Do not add both installation methods: repeated `custom-shader` entries stack
passes. To disable Silk, remove its include or shader line and reload config.

`SILK_SPEED` controls the continuous wave motion. `AURORA_INTENSITY` retains the
existing switcher's public intensity control. `SILK_FOLDS` controls actual work.
Durable edits belong in `src/silk.template.glsl` and `src/variants.mjs`; regenerate
with `node scripts/build-variants.mjs`. Silk has no daypart mode.

## Performance and validation

Measured on Apple M1 Pro, using offscreen OpenGL via ModernGL. Each measurement
includes the draw and a GPU synchronization. There are 45 warmup frames and 180
measured frames per case. This is a shader microbenchmark, **not native Ghostty
FPS**, nor a measurement of its full Metal rendering pipeline, compositor, or
battery cost. Capture/encoding is excluded. A 60 Hz frame budget is 16.67 ms.

| Shader | Resolution | Median | 95th percentile |
| --- | --- | --- | --- |
| Silk | 1920 × 1080 | 0.927 ms | 1.755 ms |
| Silk Lite | 1920 × 1080 | 0.768 ms | 1.589 ms |
| Silk | 3840 × 2160 | 2.195 ms | 2.833 ms |
| Silk Lite | 3840 × 2160 | 1.430 ms | 2.035 ms |

Raw data: `demo/silk/performance.json`. Timings vary with GPU load and power mode.

`python scripts/verify-silk.py` checks rendering of bright and saturated colors,
light backgrounds, transparent pixels, visible animation, and identity at zero
intensity. It also compiles every generated GLSL file. The node switcher test
runs against temporary files and verifies default/zero intensity, invalid input,
and reset behavior. Ghostty 1.3.1's native config validator also passed locally.
Native Ghostty frame rate has not been measured. The videos are offscreen
previews and are not evidence of native terminal performance.

## Video deliverables

- `demo/silk/silk-twitter.mp4`: 1920 × 1080, 60 FPS, 27 seconds.
- `demo/silk/silk-twitter-portrait.mp4`: 1080 × 1350, 60 FPS, 27 seconds.
- `demo/silk/silk-twitter-upload.mp4`: portrait upload copy at 30 FPS.
- `demo/silk/silk-original-score.wav`: original synthesized ambient score.
- `demo/silk/silk-terminal.png`: still from the actual shader with demo text.

The films use the **shipped GLSL shader**, deterministic 1/60-second animation
steps, smooth camera zooms, detail shots, typography, fades, and an original
synthesized score. They are offscreen shader previews with composed terminal
chrome and sample text, **not native Ghostty screen recordings**. The editorial
left-side darkening and camera movement apply only to the film, not the shader.
All exports use H.264, yuv420p, AAC stereo at 48 kHz, and MP4 fast-start metadata.

X's [standard upload help](https://help.x.com/en/using-x/x-videos) lists a 40 FPS
maximum, while [Media Studio](https://help.x.com/en/using-x/media-studio-faqs)
lists 60 FPS. Use the 30 FPS upload copy for broad compatibility; keep the
60 FPS masters for supported upload paths. The shader itself remains continuously
animated regardless of which video export you choose.

The source code and score-generation code are MIT licensed. No external music,
samples, or stock assets are used. Local system fonts are rasterized into the
film; the font files are not redistributed. The end card links to this project
and its MIT-licensed source.

## Reproduce

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/silk-requirements.txt
node scripts/build-variants.mjs
node --test tests/switcher.test.mjs
.venv/bin/python scripts/verify-silk.py
.venv/bin/python scripts/render-silk.py --benchmark
.venv/bin/python scripts/render-silk.py --stills
.venv/bin/python scripts/render-silk.py
.venv/bin/python scripts/render-silk.py --portrait
ffmpeg -i demo/silk/silk-twitter-portrait.mp4 -vf fps=30 -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart demo/silk/silk-twitter-upload.mp4
```

The renderer requires a working OpenGL 3.3 context and `ffmpeg` on PATH. The
current font defaults are macOS Helvetica Neue and Menlo; edit `FONT` and `MONO`
for another OS. Shaders themselves have no Python or video-tool dependencies.

