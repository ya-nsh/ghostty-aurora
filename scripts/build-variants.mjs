#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { variants } from "../src/variants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatePath = path.join(root, "src", "aurora.template.glsl");

function render(template, variant) {
  let output = template
    .replaceAll("@OUTPUT_FILE@", variant.file)
    .replaceAll("@VARIANT_LABEL@", variant.label);

  for (const [key, value] of Object.entries(variant.values)) {
    output = output.replaceAll(`@${key}@`, value);
  }

  const unreplaced = output.match(/@[A-Z0-9_]+@/g);
  if (unreplaced) {
    throw new Error(`Unreplaced template tokens for ${variant.file}: ${unreplaced.join(", ")}`);
  }

  return output;
}

const template = await readFile(templatePath, "utf8");

for (const variant of variants) {
  const output = render(template, variant);
  await writeFile(path.join(root, variant.file), output);
  console.log(`generated ${variant.file}`);
}
