# Performance Guide

Ghostty Aurora variants are single-pass shaders that sample only Ghostty's terminal texture through `iChannel0`. This guide uses relative shader cost rather than FPS numbers because real performance depends on window size, GPU, display refresh rate, transparency settings, and terminal workload.

## Cost Signals

The main cost knobs are:

- `RIBBON_LAYERS`: more layers means more ribbon and noise work per pixel.
- `FBM_OCTAVES`: more octaves means more procedural noise per ribbon.
- `STARS_ENABLED`: faint stars add a small amount of extra work.
- Window size: larger terminal windows shade more pixels.

The shader keeps text readable from the existing base terminal sample and uses derivative-based edge detection for glyph protection. That avoids extra neighbor texture samples while still fading the aurora away from bright text and hard glyph edges.

The ribbon field is intentionally shared within each layer: one lower-cost FBM pass drives band position, width, and color phase, while cheaper single-noise curtain shaping adds vertical texture. This keeps the aurora recognizable without the older stack of multiple FBM calls per layer.

## Relative Tiers

Low:

- `lite`
- `minimal`
- `midnight`
- `deep-winter`
- `theme-oled`
- `theme-transparent`
- `theme-light`

These use fewer ribbon layers, lower haze, or fewer FBM octaves. Start here for laptops on battery, very large terminal windows, transparent windows, or long daily sessions.

Medium:

- `aurora`
- `polaris`
- `arctic`
- `fjord`
- `solar`
- `winter`
- `spring`
- `summer-night`
- `autumn`
- `theme-dark`
- `theme-warm`

These are the daily-driver range: enough ribbon depth to feel alive, but still conservative about stars and heavy noise.

High:

- `rich`
- `nebula`

These use more ribbon depth, stronger curtains, and faint stars. They are best when the terminal is the visual focus and the machine has headroom.

## Practical Tuning

If animation feels expensive, try this order:

1. Switch from `rich` or `nebula` to `aurora`, `theme-dark`, or `fjord`.
2. Switch from a medium variant to `lite`, `minimal`, or `midnight`.
3. Lower local intensity with `bin/ghostty-aurora intensity set 0.45`.
4. Use a smaller terminal window or disable transparency in the terminal/window manager.

Lowering intensity does not reduce shader work by itself, but it can make a cheaper variant visually satisfying enough that you do not need a richer one.

## Variant Development Notes

When adding variants, prefer changing palette, intensity, speed, curtain strength, and haze before increasing `RIBBON_LAYERS` or `FBM_OCTAVES`. If a variant enables stars, keep the star threshold high and the intensity low unless the variant is intentionally a showcase mode. Avoid combining the highest layer counts with the highest octave counts; that is the fastest way to make a variant expensive again.
