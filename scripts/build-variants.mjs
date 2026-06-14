#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "src", "aurora.template.glsl");

const variants = [
  {
    outputFile: "aurora-lite.glsl",
    label: "Lite",
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
    outputFile: "aurora.glsl",
    label: "Aurora",
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
    outputFile: "aurora-rich.glsl",
    label: "Rich",
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
    outputFile: "polaris.glsl",
    label: "Polaris",
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
      NORTH_STAR_INTENSITY: "0.58",
      STARS_ENABLED: "1",
      POLARIS_MODE: "1"
    }
  }
];

function render(template, variant) {
  let output = template
    .replaceAll("@OUTPUT_FILE@", variant.outputFile)
    .replaceAll("@VARIANT_LABEL@", variant.label);

  for (const [key, value] of Object.entries(variant.values)) {
    output = output.replaceAll(`@${key}@`, value);
  }

  const unreplaced = output.match(/@[A-Z0-9_]+@/g);
  if (unreplaced) {
    throw new Error(`Unreplaced template tokens for ${variant.outputFile}: ${unreplaced.join(", ")}`);
  }

  return output;
}

const template = await readFile(templatePath, "utf8");

for (const variant of variants) {
  const output = render(template, variant);
  await writeFile(path.join(root, variant.outputFile), output);
  console.log(`generated ${variant.outputFile}`);
}
