// Build reusable transparent CTA videos from index.html. No athlete footage is baked in.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';

const dir = path.dirname(new URL(import.meta.url).pathname);
const lib = process.env.LEMO_OPUSCAR || path.join(os.homedir(), 'lemo-opuscar');
const { openDemo, closeServer } = await import(pathToFileURL(path.join(lib, 'core/render/page.mjs')).href);
const frames = path.join(dir, '.render-frames');
fs.mkdirSync(frames, { recursive: true });
const { browser, page } = await openDemo(dir, { w: 1080, h: 1920, warnings: true });
try {
  const count = Math.ceil(5.941 * 30);
  for (let i = 0; i < count; i++) {
    await page.evaluate(t => window.render(t), i / 30);
    await page.screenshot({ path: path.join(frames, `${String(i).padStart(4, '0')}.png`), type: 'png', omitBackground: true });
    if (i === 120) fs.copyFileSync(path.join(frames, '0120.png'), path.join(dir, 'preview.png'));
    if (i % 30 === 0) process.stdout.write(`frame ${i}/${count}\n`);
  }
} finally {
  await browser.close(); closeServer();
}
const input = path.join(frames, '%04d.png');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', input,
  '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-auto-alt-ref', '0', '-b:v', '0', '-crf', '24',
  path.join(dir, 'follow-overlay.webm')], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', input,
  '-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', '-alpha_bits', '16',
  path.join(dir, 'follow-overlay.mov')], { stdio: 'inherit' });
fs.rmSync(frames, { recursive: true, force: true });
console.log('transparent CTA:', path.join(dir, 'follow-overlay.webm'), 'and follow-overlay.mov');
