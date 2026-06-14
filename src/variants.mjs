export const variants = [
  {
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
      HAZE_STRENGTH: "0.070",
      STAR_INTENSITY: "0.0",
      NORTH_STAR_INTENSITY: "0.0",
      STARS_ENABLED: "0",
      POLARIS_MODE: "0"
    }
  },
  {
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
      HAZE_STRENGTH: "0.030",
      STAR_INTENSITY: "0.0",
      NORTH_STAR_INTENSITY: "0.0",
      STARS_ENABLED: "0",
      POLARIS_MODE: "0"
    }
  },
  {
    id: "aurora",
    label: "Aurora",
    category: "core",
    file: "aurora.glsl",
    description: "Balanced default and recommended daily driver.",
    performanceTier: "medium",
    values: {
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
      STARS_ENABLED: "0",
      POLARIS_MODE: "0"
    }
  },
  {
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
      NORTH_STAR_INTENSITY: "0.0",
      STARS_ENABLED: "1",
      POLARIS_MODE: "0"
    }
  },
  {
    id: "polaris",
    label: "Polaris",
    category: "core",
    file: "polaris.glsl",
    description: "Cold no-star aurora with a darker polar palette.",
    performanceTier: "medium",
    values: {
      AURORA_INTENSITY: "0.54",
      RIBBON_SPEED: "0.026",
      RIBBON_SCALE: "0.98",
      TEXT_PROTECT: "0.90",
      RIBBON_LAYERS: "4",
      FBM_OCTAVES: "4",
      CURTAIN_STRENGTH: "0.70",
      HAZE_STRENGTH: "0.085",
      STAR_INTENSITY: "0.0",
      NORTH_STAR_INTENSITY: "0.0",
      STARS_ENABLED: "0",
      POLARIS_MODE: "1"
    }
  }
];

export function variantIds() {
  return variants.map((variant) => variant.id);
}

export function findVariant(id) {
  return variants.find((variant) => variant.id === id);
}
