const defaultPalette = {
  MORNING_A: "vec3(0.63, 0.96, 0.90)",
  MORNING_B: "vec3(1.00, 0.67, 0.45)",
  EVENING_A: "vec3(0.28, 0.98, 0.72)",
  EVENING_B: "vec3(0.52, 0.36, 1.00)",
  NIGHT_A: "vec3(0.08, 0.52, 0.42)",
  NIGHT_B: "vec3(0.18, 0.16, 0.50)"
};

const palettes = {
  aurora: defaultPalette,
  polaris: {
    MORNING_A: "vec3(0.50, 0.86, 0.92)",
    MORNING_B: "vec3(0.68, 0.78, 1.00)",
    EVENING_A: "vec3(0.20, 0.88, 0.76)",
    EVENING_B: "vec3(0.42, 0.50, 1.00)",
    NIGHT_A: "vec3(0.05, 0.42, 0.40)",
    NIGHT_B: "vec3(0.12, 0.14, 0.38)"
  },
  arctic: {
    MORNING_A: "vec3(0.76, 1.00, 0.96)",
    MORNING_B: "vec3(0.58, 0.82, 1.00)",
    EVENING_A: "vec3(0.34, 0.98, 0.92)",
    EVENING_B: "vec3(0.42, 0.60, 1.00)",
    NIGHT_A: "vec3(0.06, 0.48, 0.52)",
    NIGHT_B: "vec3(0.08, 0.20, 0.46)"
  },
  nebula: {
    MORNING_A: "vec3(0.86, 0.72, 1.00)",
    MORNING_B: "vec3(1.00, 0.58, 0.76)",
    EVENING_A: "vec3(0.66, 0.34, 1.00)",
    EVENING_B: "vec3(0.18, 0.62, 1.00)",
    NIGHT_A: "vec3(0.18, 0.16, 0.50)",
    NIGHT_B: "vec3(0.42, 0.10, 0.54)"
  },
  fjord: {
    MORNING_A: "vec3(0.58, 0.96, 0.82)",
    MORNING_B: "vec3(0.62, 0.76, 1.00)",
    EVENING_A: "vec3(0.20, 0.78, 0.62)",
    EVENING_B: "vec3(0.18, 0.48, 0.82)",
    NIGHT_A: "vec3(0.06, 0.36, 0.34)",
    NIGHT_B: "vec3(0.08, 0.18, 0.36)"
  },
  midnight: {
    MORNING_A: "vec3(0.44, 0.76, 0.86)",
    MORNING_B: "vec3(0.38, 0.50, 0.82)",
    EVENING_A: "vec3(0.12, 0.52, 0.56)",
    EVENING_B: "vec3(0.18, 0.24, 0.64)",
    NIGHT_A: "vec3(0.03, 0.28, 0.30)",
    NIGHT_B: "vec3(0.05, 0.08, 0.28)"
  },
  solar: {
    MORNING_A: "vec3(0.90, 0.98, 0.72)",
    MORNING_B: "vec3(1.00, 0.48, 0.26)",
    EVENING_A: "vec3(0.62, 0.86, 0.46)",
    EVENING_B: "vec3(0.94, 0.38, 0.58)",
    NIGHT_A: "vec3(0.14, 0.42, 0.30)",
    NIGHT_B: "vec3(0.42, 0.12, 0.26)"
  },
  winter: {
    MORNING_A: "vec3(0.82, 0.98, 1.00)",
    MORNING_B: "vec3(0.66, 0.84, 1.00)",
    EVENING_A: "vec3(0.32, 0.84, 0.92)",
    EVENING_B: "vec3(0.46, 0.52, 0.96)",
    NIGHT_A: "vec3(0.06, 0.38, 0.44)",
    NIGHT_B: "vec3(0.10, 0.14, 0.40)"
  },
  spring: {
    MORNING_A: "vec3(0.74, 1.00, 0.76)",
    MORNING_B: "vec3(1.00, 0.68, 0.70)",
    EVENING_A: "vec3(0.34, 0.94, 0.58)",
    EVENING_B: "vec3(0.66, 0.44, 0.94)",
    NIGHT_A: "vec3(0.08, 0.46, 0.34)",
    NIGHT_B: "vec3(0.18, 0.16, 0.42)"
  },
  summerNight: {
    MORNING_A: "vec3(0.68, 0.96, 0.84)",
    MORNING_B: "vec3(1.00, 0.70, 0.40)",
    EVENING_A: "vec3(0.32, 0.92, 0.70)",
    EVENING_B: "vec3(0.26, 0.50, 0.96)",
    NIGHT_A: "vec3(0.04, 0.44, 0.38)",
    NIGHT_B: "vec3(0.06, 0.20, 0.46)"
  },
  autumn: {
    MORNING_A: "vec3(0.88, 0.94, 0.56)",
    MORNING_B: "vec3(1.00, 0.48, 0.24)",
    EVENING_A: "vec3(0.58, 0.78, 0.40)",
    EVENING_B: "vec3(0.86, 0.34, 0.54)",
    NIGHT_A: "vec3(0.14, 0.36, 0.28)",
    NIGHT_B: "vec3(0.34, 0.10, 0.30)"
  },
  deepWinter: {
    MORNING_A: "vec3(0.60, 0.86, 0.96)",
    MORNING_B: "vec3(0.48, 0.58, 0.88)",
    EVENING_A: "vec3(0.12, 0.64, 0.68)",
    EVENING_B: "vec3(0.24, 0.28, 0.78)",
    NIGHT_A: "vec3(0.02, 0.26, 0.30)",
    NIGHT_B: "vec3(0.03, 0.06, 0.22)"
  },
  themeOled: {
    MORNING_A: "vec3(0.36, 0.88, 0.78)",
    MORNING_B: "vec3(0.58, 0.50, 0.90)",
    EVENING_A: "vec3(0.16, 0.72, 0.62)",
    EVENING_B: "vec3(0.32, 0.30, 0.78)",
    NIGHT_A: "vec3(0.02, 0.30, 0.26)",
    NIGHT_B: "vec3(0.04, 0.06, 0.22)"
  },
  themeDark: {
    MORNING_A: "vec3(0.62, 0.94, 0.86)",
    MORNING_B: "vec3(0.78, 0.58, 0.96)",
    EVENING_A: "vec3(0.24, 0.88, 0.68)",
    EVENING_B: "vec3(0.42, 0.36, 0.92)",
    NIGHT_A: "vec3(0.06, 0.42, 0.36)",
    NIGHT_B: "vec3(0.12, 0.12, 0.42)"
  },
  themeWarm: {
    MORNING_A: "vec3(0.86, 0.90, 0.58)",
    MORNING_B: "vec3(0.98, 0.50, 0.36)",
    EVENING_A: "vec3(0.48, 0.78, 0.48)",
    EVENING_B: "vec3(0.80, 0.36, 0.62)",
    NIGHT_A: "vec3(0.12, 0.36, 0.28)",
    NIGHT_B: "vec3(0.30, 0.10, 0.28)"
  },
  themeTransparent: {
    MORNING_A: "vec3(0.52, 0.90, 0.86)",
    MORNING_B: "vec3(0.66, 0.62, 0.96)",
    EVENING_A: "vec3(0.20, 0.72, 0.64)",
    EVENING_B: "vec3(0.32, 0.42, 0.88)",
    NIGHT_A: "vec3(0.04, 0.34, 0.32)",
    NIGHT_B: "vec3(0.08, 0.12, 0.34)"
  },
  themeLight: {
    MORNING_A: "vec3(0.30, 0.68, 0.62)",
    MORNING_B: "vec3(0.62, 0.38, 0.72)",
    EVENING_A: "vec3(0.14, 0.58, 0.48)",
    EVENING_B: "vec3(0.34, 0.26, 0.70)",
    NIGHT_A: "vec3(0.06, 0.34, 0.30)",
    NIGHT_B: "vec3(0.12, 0.10, 0.36)"
  }
};

const defaults = {
  AURORA_INTENSITY: "0.62",
  RIBBON_SPEED: "0.035",
  RIBBON_SCALE: "1.00",
  TEXT_PROTECT: "0.88",
  RIBBON_LAYERS: "5",
  FBM_OCTAVES: "4",
  CURTAIN_STRENGTH: "0.78",
  HAZE_STRENGTH: "0.110",
  STAR_INTENSITY: "0.0",
  NORTH_STAR_INTENSITY: "0.0",
  TIME_MODE: "0",
  TIME_LAPSE_ENABLED: "0.0",
  TIME_LAPSE_MINUTES: "30.0",
  TIME_LAPSE_PHASE_OFFSET: "0.0",
  TIME_LAPSE_SMOOTHING: "0.70",
  STARS_ENABLED: "0",
  POLARIS_MODE: "0",
  ...defaultPalette
};

function variant({ values = {}, palette = palettes.aurora, ...metadata }) {
  return {
    ...metadata,
    values: {
      ...defaults,
      ...palette,
      ...values
    }
  };
}

export const variants = [
  variant({
    id: "lite",
    label: "Lite",
    category: "core",
    file: "aurora-lite.glsl",
    description: "Calmer, cheaper, and extra conservative around text.",
    performanceTier: "low",
    values: {
      AURORA_INTENSITY: "0.46",
      RIBBON_SPEED: "0.028",
      RIBBON_SCALE: "0.92",
      TEXT_PROTECT: "0.92",
      RIBBON_LAYERS: "3",
      FBM_OCTAVES: "3",
      CURTAIN_STRENGTH: "0.58",
      HAZE_STRENGTH: "0.070"
    }
  }),
  variant({
    id: "minimal",
    label: "Minimal",
    category: "core",
    file: "aurora-minimal.glsl",
    description: "Aurora-only, low haze, and very calm for daily use.",
    performanceTier: "low",
    values: {
      AURORA_INTENSITY: "0.38",
      RIBBON_SPEED: "0.022",
      RIBBON_SCALE: "0.86",
      TEXT_PROTECT: "0.94",
      RIBBON_LAYERS: "2",
      FBM_OCTAVES: "3",
      CURTAIN_STRENGTH: "0.42",
      HAZE_STRENGTH: "0.030"
    }
  }),
  variant({
    id: "aurora",
    label: "Aurora",
    category: "core",
    file: "aurora.glsl",
    description: "Balanced default and recommended daily driver.",
    performanceTier: "medium"
  }),
  variant({
    id: "rich",
    label: "Rich",
    category: "core",
    file: "aurora-rich.glsl",
    description: "Deeper curtains and faint static stars.",
    performanceTier: "high",
    values: {
      AURORA_INTENSITY: "0.74",
      RIBBON_SPEED: "0.039",
      RIBBON_SCALE: "1.08",
      TEXT_PROTECT: "0.86",
      RIBBON_LAYERS: "6",
      FBM_OCTAVES: "5",
      CURTAIN_STRENGTH: "0.96",
      HAZE_STRENGTH: "0.145",
      STAR_INTENSITY: "0.075",
      STARS_ENABLED: "1"
    }
  }),
  variant({
    id: "polaris",
    label: "Polaris",
    category: "core",
    file: "polaris.glsl",
    description: "Cold no-star aurora with a darker polar palette.",
    performanceTier: "medium",
    palette: palettes.polaris,
    values: {
      AURORA_INTENSITY: "0.54",
      RIBBON_SPEED: "0.026",
      RIBBON_SCALE: "0.98",
      TEXT_PROTECT: "0.90",
      RIBBON_LAYERS: "4",
      CURTAIN_STRENGTH: "0.70",
      HAZE_STRENGTH: "0.085",
      POLARIS_MODE: "1"
    }
  }),
  variant({
    id: "timelapse",
    label: "Time-Lapse",
    category: "core",
    file: "aurora-timelapse.glsl",
    description: "Cycles through morning, evening, and night moods using iTime.",
    performanceTier: "medium",
    values: {
      AURORA_INTENSITY: "0.58",
      RIBBON_SPEED: "0.030",
      RIBBON_SCALE: "1.00",
      TEXT_PROTECT: "0.90",
      RIBBON_LAYERS: "5",
      CURTAIN_STRENGTH: "0.76",
      HAZE_STRENGTH: "0.092",
      TIME_MODE: "3",
      TIME_LAPSE_ENABLED: "1.0",
      TIME_LAPSE_MINUTES: "30.0",
      TIME_LAPSE_SMOOTHING: "0.75"
    }
  }),
  variant({
    id: "arctic",
    label: "Arctic",
    category: "preset",
    file: "aurora-arctic.glsl",
    description: "Bright teal and glacial blue ribbons with a crisp cold feel.",
    performanceTier: "medium",
    palette: palettes.arctic,
    values: {
      AURORA_INTENSITY: "0.58",
      RIBBON_SPEED: "0.030",
      RIBBON_SCALE: "1.02",
      RIBBON_LAYERS: "5",
      CURTAIN_STRENGTH: "0.82",
      HAZE_STRENGTH: "0.100"
    }
  }),
  variant({
    id: "nebula",
    label: "Nebula",
    category: "preset",
    file: "aurora-nebula.glsl",
    description: "Purple, magenta, and blue ribbons with a richer sci-fi mood.",
    performanceTier: "high",
    palette: palettes.nebula,
    values: {
      AURORA_INTENSITY: "0.70",
      RIBBON_SPEED: "0.038",
      RIBBON_SCALE: "1.10",
      TEXT_PROTECT: "0.87",
      RIBBON_LAYERS: "6",
      FBM_OCTAVES: "5",
      CURTAIN_STRENGTH: "0.94",
      HAZE_STRENGTH: "0.135",
      STAR_INTENSITY: "0.040",
      STARS_ENABLED: "1"
    }
  }),
  variant({
    id: "fjord",
    label: "Fjord",
    category: "preset",
    file: "aurora-fjord.glsl",
    description: "Green, teal, and deep-water blue with slower calm motion.",
    performanceTier: "medium",
    palette: palettes.fjord,
    values: {
      AURORA_INTENSITY: "0.52",
      RIBBON_SPEED: "0.026",
      RIBBON_SCALE: "0.96",
      TEXT_PROTECT: "0.90",
      RIBBON_LAYERS: "4",
      CURTAIN_STRENGTH: "0.72",
      HAZE_STRENGTH: "0.080"
    }
  }),
  variant({
    id: "midnight",
    label: "Midnight",
    category: "preset",
    file: "aurora-midnight.glsl",
    description: "Deep low-intensity blue-green for late-night sessions.",
    performanceTier: "low",
    palette: palettes.midnight,
    values: {
      AURORA_INTENSITY: "0.42",
      RIBBON_SPEED: "0.020",
      RIBBON_SCALE: "0.92",
      TEXT_PROTECT: "0.93",
      RIBBON_LAYERS: "3",
      FBM_OCTAVES: "3",
      CURTAIN_STRENGTH: "0.56",
      HAZE_STRENGTH: "0.055"
    }
  }),
  variant({
    id: "solar",
    label: "Solar",
    category: "preset",
    file: "aurora-solar.glsl",
    description: "Warmer sunrise amber and teal ribbons without getting loud.",
    performanceTier: "medium",
    palette: palettes.solar,
    values: {
      AURORA_INTENSITY: "0.57",
      RIBBON_SPEED: "0.034",
      RIBBON_SCALE: "1.00",
      TEXT_PROTECT: "0.89",
      RIBBON_LAYERS: "5",
      CURTAIN_STRENGTH: "0.76",
      HAZE_STRENGTH: "0.095"
    }
  }),
  variant({
    id: "winter",
    label: "Winter",
    category: "seasonal",
    file: "aurora-winter.glsl",
    description: "Icy blue-green ribbons with soft snow-night restraint.",
    performanceTier: "medium",
    palette: palettes.winter,
    values: {
      AURORA_INTENSITY: "0.55",
      RIBBON_SPEED: "0.027",
      RIBBON_SCALE: "0.98",
      RIBBON_LAYERS: "4",
      CURTAIN_STRENGTH: "0.74",
      HAZE_STRENGTH: "0.080"
    }
  }),
  variant({
    id: "spring",
    label: "Spring",
    category: "seasonal",
    file: "aurora-spring.glsl",
    description: "Fresh green with light coral morning tones.",
    performanceTier: "medium",
    palette: palettes.spring,
    values: {
      AURORA_INTENSITY: "0.56",
      RIBBON_SPEED: "0.034",
      RIBBON_SCALE: "0.98",
      RIBBON_LAYERS: "5",
      CURTAIN_STRENGTH: "0.76",
      HAZE_STRENGTH: "0.092"
    }
  }),
  variant({
    id: "summer-night",
    label: "Summer Night",
    category: "seasonal",
    file: "aurora-summer-night.glsl",
    description: "Warm dusk edges with relaxed blue-green night ribbons.",
    performanceTier: "medium",
    palette: palettes.summerNight,
    values: {
      AURORA_INTENSITY: "0.60",
      RIBBON_SPEED: "0.032",
      RIBBON_SCALE: "1.04",
      TEXT_PROTECT: "0.89",
      RIBBON_LAYERS: "5",
      CURTAIN_STRENGTH: "0.82",
      HAZE_STRENGTH: "0.105",
      STAR_INTENSITY: "0.030",
      STARS_ENABLED: "1"
    }
  }),
  variant({
    id: "autumn",
    label: "Autumn",
    category: "seasonal",
    file: "aurora-autumn.glsl",
    description: "Muted gold, moss, and rose ribbons for a warmer terminal.",
    performanceTier: "medium",
    palette: palettes.autumn,
    values: {
      AURORA_INTENSITY: "0.54",
      RIBBON_SPEED: "0.030",
      RIBBON_SCALE: "0.98",
      TEXT_PROTECT: "0.90",
      RIBBON_LAYERS: "4",
      CURTAIN_STRENGTH: "0.72",
      HAZE_STRENGTH: "0.082"
    }
  }),
  variant({
    id: "deep-winter",
    label: "Deep Winter",
    category: "seasonal",
    file: "aurora-deep-winter.glsl",
    description: "Dark, slow, and extra conservative for long night use.",
    performanceTier: "low",
    palette: palettes.deepWinter,
    values: {
      AURORA_INTENSITY: "0.40",
      RIBBON_SPEED: "0.018",
      RIBBON_SCALE: "0.90",
      TEXT_PROTECT: "0.94",
      RIBBON_LAYERS: "3",
      FBM_OCTAVES: "3",
      CURTAIN_STRENGTH: "0.52",
      HAZE_STRENGTH: "0.045"
    }
  }),
  variant({
    id: "theme-oled",
    label: "Theme OLED",
    category: "theme",
    file: "aurora-theme-oled.glsl",
    description: "Lowest glow and strongest text protection for near-black OLED themes.",
    performanceTier: "low",
    palette: palettes.themeOled,
    values: {
      AURORA_INTENSITY: "0.34",
      RIBBON_SPEED: "0.020",
      RIBBON_SCALE: "0.92",
      TEXT_PROTECT: "0.96",
      RIBBON_LAYERS: "3",
      FBM_OCTAVES: "3",
      CURTAIN_STRENGTH: "0.50",
      HAZE_STRENGTH: "0.025"
    }
  }),
  variant({
    id: "theme-dark",
    label: "Theme Dark",
    category: "theme",
    file: "aurora-theme-dark.glsl",
    description: "Balanced contrast for typical dark terminal themes.",
    performanceTier: "medium",
    palette: palettes.themeDark,
    values: {
      AURORA_INTENSITY: "0.56",
      RIBBON_SPEED: "0.032",
      RIBBON_SCALE: "1.00",
      TEXT_PROTECT: "0.90",
      RIBBON_LAYERS: "5",
      CURTAIN_STRENGTH: "0.76",
      HAZE_STRENGTH: "0.092"
    }
  }),
  variant({
    id: "theme-warm",
    label: "Theme Warm",
    category: "theme",
    file: "aurora-theme-warm.glsl",
    description: "Muted gold, green, and rose for warm dark palettes.",
    performanceTier: "medium",
    palette: palettes.themeWarm,
    values: {
      AURORA_INTENSITY: "0.50",
      RIBBON_SPEED: "0.028",
      RIBBON_SCALE: "0.96",
      TEXT_PROTECT: "0.92",
      RIBBON_LAYERS: "4",
      CURTAIN_STRENGTH: "0.66",
      HAZE_STRENGTH: "0.070"
    }
  }),
  variant({
    id: "theme-transparent",
    label: "Theme Transparent",
    category: "theme",
    file: "aurora-theme-transparent.glsl",
    description: "Lower haze for transparent windows where the desktop already adds texture.",
    performanceTier: "low",
    palette: palettes.themeTransparent,
    values: {
      AURORA_INTENSITY: "0.42",
      RIBBON_SPEED: "0.024",
      RIBBON_SCALE: "0.94",
      TEXT_PROTECT: "0.94",
      RIBBON_LAYERS: "3",
      FBM_OCTAVES: "3",
      CURTAIN_STRENGTH: "0.54",
      HAZE_STRENGTH: "0.018"
    }
  }),
  variant({
    id: "theme-light",
    label: "Theme Light",
    category: "theme",
    file: "aurora-theme-light.glsl",
    description: "Very restrained overlay for light or light-ish terminal backgrounds.",
    performanceTier: "low",
    palette: palettes.themeLight,
    values: {
      AURORA_INTENSITY: "0.24",
      RIBBON_SPEED: "0.018",
      RIBBON_SCALE: "0.88",
      TEXT_PROTECT: "0.98",
      RIBBON_LAYERS: "2",
      FBM_OCTAVES: "3",
      CURTAIN_STRENGTH: "0.38",
      HAZE_STRENGTH: "0.010"
    }
  })
];

export function variantIds() {
  return variants.map((variant) => variant.id);
}

export function findVariant(id) {
  return variants.find((variant) => variant.id === id);
}
