# Ghostty Aurora

A subtle northern-lights shader for [Ghostty](https://ghostty.org/) terminal backgrounds.

Ghostty Aurora paints soft procedural ribbons behind your terminal text: pale morning waves, purple-blue evening aurora, or darker low-motion night glow. It is a single GLSL file, has no daemon, and only samples Ghostty's built-in `iChannel0` terminal texture.

![Preview](preview/preview.svg)

## Install

Clone the repo:

```sh
git clone https://github.com/ya-nsh/ghostty-aurora.git
```

Add the shader to your Ghostty config:

```conf
custom-shader = /path/to/ghostty-aurora/aurora.glsl
custom-shader-animation = true
```

Reload Ghostty config or open a new window.

On macOS, Ghostty's config is usually at:

```text
~/Library/Application Support/com.mitchellh.ghostty/config
```

On Linux, it is usually at:

```text
~/.config/ghostty/config
```

## Tuning

Open `aurora.glsl` and edit the constants near the top.

```glsl
const float AURORA_INTENSITY = 0.62;
const float RIBBON_SPEED = 0.035;
const float RIBBON_SCALE = 1.0;
const float MORNING_MIX = 0.0;
const float EVENING_MIX = 1.0;
const float NIGHT_MIX = 0.0;
const float TEXT_PROTECT = 0.88;
#define TIME_MODE 0
```

Presets:

```glsl
// Morning
const float MORNING_MIX = 1.0;
const float EVENING_MIX = 0.0;
const float NIGHT_MIX = 0.0;

// Evening
const float MORNING_MIX = 0.0;
const float EVENING_MIX = 1.0;
const float NIGHT_MIX = 0.0;

// Night
const float MORNING_MIX = 0.0;
const float EVENING_MIX = 0.0;
const float NIGHT_MIX = 1.0;
```

`TIME_MODE`:

- `0`: manual mix using `MORNING_MIX`, `EVENING_MIX`, and `NIGHT_MIX`.
- `1`: preview cycle using `iTime`; useful for demo recordings.
- `2`: future wall-clock mode using `iDate.w`.

Ghostty currently documents `iDate` as not supported, so the committed default is manual mode. The shader keeps the `iDate` path in place so wall-clock dayparts can be enabled when Ghostty populates that uniform.

## Preview

The preview loads the production `aurora.glsl` file and compiles it in WebGL.

```sh
python3 -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765/preview/
```

Use the buttons to preview morning, evening, night, or the `iTime` cycle. These buttons patch constants in memory only; they do not rewrite `aurora.glsl`.

## Troubleshooting

- If the terminal goes black, remove or comment out `custom-shader`, reload Ghostty, and check the shader path.
- If the aurora does not animate, make sure `custom-shader-animation = true` is set.
- If the aurora is too strong, lower `AURORA_INTENSITY`.
- If text readability suffers, raise `TEXT_PROTECT`.
- If you use a light terminal theme, Aurora intentionally stays very subtle to protect contrast.

## License

MIT
