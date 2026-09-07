import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, cp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('Silk switches, handles default/zero intensity, rejects invalid values, and resets', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'silk-switcher-'));
  try {
    for (const name of ['bin', 'src']) await cp(path.join(root, name), path.join(dir, name), { recursive: true });
    for (const name of ['silk.glsl', 'silk-lite.glsl']) await cp(path.join(root, name), path.join(dir, name));
    await mkdir(path.join(dir, 'config'));
    const run = (...args) => execFileSync(process.execPath, [path.join(dir, 'bin/ghostty-aurora'), ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    run('use', 'silk');
    assert.equal(run('current'), 'silk');
    assert.equal(run('intensity', 'get'), '0.72');
    run('intensity', 'set', '0.72'); // Previously failed when replacement equals source.
    assert.equal(run('intensity', 'get'), '0.72');
    run('intensity', 'set', '0');
    assert.equal(run('intensity', 'get'), '0.0');
    const previous = await readFile(path.join(dir, 'config/ghostty-aurora.conf'), 'utf8');
    for (const value of ['-1', '2.1', 'NaN', '']) assert.throws(() => run('intensity', 'set', value));
    assert.equal(await readFile(path.join(dir, 'config/ghostty-aurora.conf'), 'utf8'), previous);
    run('intensity', 'reset');
    assert.equal(run('intensity', 'get'), '0.72');
    run('use', 'silk-lite');
    assert.equal(run('current'), 'silk-lite');
    assert.equal(run('intensity', 'get'), '0.60');
    assert.match(await readFile(path.join(dir, 'config/ghostty-aurora.conf'), 'utf8'), /custom-shader = .*silk-lite\.glsl/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
