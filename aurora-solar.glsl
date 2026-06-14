// aurora-solar.glsl - generated from src/aurora.template.glsl.
// Variant: Solar
//
// Ghostty setup:
//   custom-shader = /path/to/ghostty-aurora/aurora-solar.glsl
//   custom-shader-animation = true
//
// The shader is self-contained and samples iChannel0, the terminal surface,
// so terminal text stays readable while the aurora sits mostly in the dark.

// Overall brightness of the aurora overlay.
const float AURORA_INTENSITY = 0.57;

// Motion and scale of the ribbon field.
const float RIBBON_SPEED = 0.034;
const float RIBBON_SCALE = 1.00;

// Manual daypart mix used while Ghostty's iDate uniform is unavailable.
// Suggested presets:
//   Morning: MORNING_MIX 1.0, EVENING_MIX 0.0, NIGHT_MIX 0.0
//   Evening: MORNING_MIX 0.0, EVENING_MIX 1.0, NIGHT_MIX 0.0
//   Night:   MORNING_MIX 0.0, EVENING_MIX 0.0, NIGHT_MIX 1.0
const float MORNING_MIX = 0.0;
const float EVENING_MIX = 1.0;
const float NIGHT_MIX = 0.0;

// 0 = manual mix above, 1 = preview cycle from iTime, 2 = future iDate auto.
// Ghostty currently declares iDate but does not populate it, so keep 0 for
// normal use until Ghostty wires wall-clock values into custom shaders.
#define TIME_MODE 0

// Higher values protect bright text and glyph edges more aggressively.
const float TEXT_PROTECT = 0.89;

const int RIBBON_LAYERS = 5;
const int FBM_OCTAVES = 4;
const float CURTAIN_STRENGTH = 0.76;
const float HAZE_STRENGTH = 0.095;
const float STAR_INTENSITY = 0.0;
const float NORTH_STAR_INTENSITY = 0.0;

const vec3 MORNING_A = vec3(0.90, 0.98, 0.72);
const vec3 MORNING_B = vec3(1.00, 0.48, 0.26);
const vec3 EVENING_A = vec3(0.62, 0.86, 0.46);
const vec3 EVENING_B = vec3(0.94, 0.38, 0.58);
const vec3 NIGHT_A = vec3(0.14, 0.42, 0.30);
const vec3 NIGHT_B = vec3(0.42, 0.12, 0.26);

#define STARS_ENABLED 0
#define POLARIS_MODE 0

float sat(float x) {
    return clamp(x, 0.0, 1.0);
}

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);

    for (int i = 0; i < FBM_OCTAVES; i++) {
        sum += amp * noise(p);
        p = turn * p * 2.04 + 17.7;
        amp *= 0.5;
    }

    return sum;
}

vec3 palette(float phase, vec3 mood) {
    vec3 morning = mix(MORNING_A, MORNING_B, phase);
    vec3 evening = mix(EVENING_A, EVENING_B, phase);
    vec3 night = mix(NIGHT_A, NIGHT_B, phase);

    return morning * mood.x + evening * mood.y + night * mood.z;
}

vec3 moodManual() {
    vec3 mood = max(vec3(MORNING_MIX, EVENING_MIX, NIGHT_MIX), vec3(0.0));
    float total = max(dot(mood, vec3(1.0)), 0.001);
    return mood / total;
}

vec3 moodPreview(float t) {
    float h = fract(t / 96.0);
    float morning = smoothstep(0.00, 0.16, h) * (1.0 - smoothstep(0.30, 0.42, h));
    float evening = smoothstep(0.25, 0.45, h) * (1.0 - smoothstep(0.66, 0.78, h));
    float night = 1.0 - max(morning, evening);
    vec3 mood = vec3(morning, evening, night);
    return mood / max(dot(mood, vec3(1.0)), 0.001);
}

vec3 moodFromDate() {
    float seconds = iDate.w;
    float hour = seconds / 3600.0;

    float morning = smoothstep(5.0, 8.0, hour) * (1.0 - smoothstep(11.0, 13.0, hour));
    float evening = smoothstep(16.0, 19.0, hour) * (1.0 - smoothstep(22.0, 24.0, hour));
    float night = 1.0 - max(morning, evening);

    vec3 mood = vec3(morning, evening, night);
    return mood / max(dot(mood, vec3(1.0)), 0.001);
}

vec3 currentMood(float t) {
    vec3 mood = moodManual();

    #if TIME_MODE == 1
    mood = moodPreview(t);
    #elif TIME_MODE == 2
    mood = moodFromDate();
    #endif

    return mood;
}

float ribbon(vec2 uv, float t, float layer, float nightCalm) {
    float speed = RIBBON_SPEED * mix(1.35, 0.45, nightCalm);
    float drift = t * speed * (0.75 + layer * 0.18);
    vec2 p = vec2(uv.x * (2.0 + layer * 0.65) * RIBBON_SCALE + drift,
                  uv.y * (2.8 + layer * 0.38) - layer * 3.1);

    float large = fbm(p + vec2(0.0, drift * 0.55));
    float small = fbm(p * 2.2 - vec2(drift * 0.70, 0.0));
    float center = 0.18 + layer * 0.095 + 0.18 * large;
    float width = 0.055 + 0.020 * small;
    float band = exp(-pow((uv.y - center) / width, 2.0));

    float curtainNoise = fbm(vec2(uv.x * (12.0 + layer * 4.0) - drift * 8.0,
                                  layer * 9.0 + t * 0.025));
    float curtains = pow(0.28 + 0.72 * curtainNoise, mix(2.6, 1.8, CURTAIN_STRENGTH));
    float verticalFalloff = smoothstep(0.92, 0.15, uv.y) * smoothstep(-0.05, 0.20, uv.y);

    return band * curtains * verticalFalloff;
}

vec3 aurora(vec2 uv, float t, vec3 mood) {
    float glow = 0.0;
    vec3 color = vec3(0.0);

    for (int i = 0; i < RIBBON_LAYERS; i++) {
        float fi = float(i);
        float r = ribbon(uv, t, fi, mood.z);
        float phase = fract(fi * 0.27 + fbm(vec2(uv.x * 1.4 + t * 0.01, fi)));
        color += palette(phase, mood) * r * (1.0 - fi * 0.10);
        glow += r;
    }

    float upperHaze = smoothstep(0.88, 0.08, uv.y) * smoothstep(-0.05, 0.28, uv.y);
    color += palette(0.18 + 0.08 * sin(t * 0.05), mood) * upperHaze * glow * HAZE_STRENGTH;

    return color;
}

float starCell(vec2 cell, float threshold) {
    float h = hash21(cell);
    return smoothstep(threshold, 1.0, h);
}

vec3 stars(vec2 uv, float t) {
    #if STARS_ENABLED == 1
    vec2 field = vec2(uv.x * 110.0, uv.y * 68.0);
    vec2 cell = floor(field);
    vec2 local = fract(field) - 0.5;
    float star = starCell(cell, 0.984);
    float shape = exp(-dot(local, local) * 90.0);
    float twinkle = 0.86 + 0.14 * hash21(cell + 14.3);
    float skyMask = smoothstep(0.96, 0.18, uv.y);
    vec3 color = vec3(0.65, 0.78, 1.0) * star * shape * twinkle * skyMask * STAR_INTENSITY;

    #if POLARIS_MODE == 1
    vec2 north = vec2(0.76, 0.18);
    vec2 d = vec2((uv.x - north.x) * 1.78, uv.y - north.y);
    float core = exp(-dot(d, d) * 2600.0);
    float halo = exp(-dot(d, d) * 220.0);
    color += vec3(0.58, 0.74, 0.86) * (core * 0.70 + halo * 0.030) * NORTH_STAR_INTENSITY;
    #endif

    return color;
    #else
    return vec3(0.0);
    #endif
}

float readabilityMask(vec2 uv, vec3 base) {
    float luma = dot(base, vec3(0.2126, 0.7152, 0.0722));
    vec2 px = 1.0 / iResolution.xy;
    float lx = dot(texture(iChannel0, uv + vec2(px.x, 0.0)).rgb, vec3(0.2126, 0.7152, 0.0722));
    float ly = dot(texture(iChannel0, uv + vec2(0.0, px.y)).rgb, vec3(0.2126, 0.7152, 0.0722));
    float edge = max(abs(luma - lx), abs(luma - ly));

    float brightText = smoothstep(0.32, 0.82, luma);
    float glyphEdge = smoothstep(0.025, 0.14, edge);
    float protect = max(brightText, glyphEdge * TEXT_PROTECT);

    return 1.0 - sat(protect);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec3 base = texture(iChannel0, uv).rgb;

    float aspect = iResolution.x / max(iResolution.y, 1.0);
    vec2 fieldUv = vec2((uv.x - 0.5) * aspect + 0.5, uv.y);

    vec3 mood = currentMood(iTime);
    float nightCalm = mood.z;
    float intensity = AURORA_INTENSITY * mix(1.0, 0.58, nightCalm);
    vec3 lights = aurora(fieldUv, iTime, mood);
    lights += stars(uv, iTime);

    float mask = readabilityMask(uv, base);
    float backgroundDepth = 1.0 - smoothstep(0.12, 0.74, dot(base, vec3(0.2126, 0.7152, 0.0722)));
    float blendMask = mask * mix(0.18, 1.0, backgroundDepth);

    vec3 lifted = base + lights * intensity * blendMask;
    vec3 toned = 1.0 - exp(-lifted);
    vec3 color = mix(lifted, toned, 0.28);

    fragColor = vec4(color, 1.0);
}
