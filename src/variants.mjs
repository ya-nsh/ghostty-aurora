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
    description: "Balanced aurora with a darker north-star sky.",
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
      STAR_INTENSITY: "0.20",
      NORTH_STAR_INTENSITY: "0.18",
      STARS_ENABLED: "1",
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
