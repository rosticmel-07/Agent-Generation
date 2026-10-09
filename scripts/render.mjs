import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const previews = resolve(root, 'previews');
mkdirSync(previews, {recursive: true});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ||
  (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts')});
const options = {serveUrl, id: 'BridgeReel', browserExecutable};
const composition = await selectComposition(options);
const targets = [
  ['01-profile', 1.1], ['02-price', 2.8], ['03-competitor', 3.95],
  ['04-direct', 7.4], ['05-answers', 13], ['06-website', 15.1],
  ['07-portfolio', 18.5], ['08-cta', 23.6],
];

if (process.argv.includes('--stills')) {
  const requested = process.argv.find(arg => arg.startsWith('--scene='))?.split('=')[1];
  const selected = requested ? targets.filter(([name]) => name === requested) : targets;
  if (selected.length === 0) throw new Error(`Unknown scene: ${requested}`);
  for (const [name, seconds] of selected) {
    await renderStill({
      serveUrl, composition, browserExecutable,
      output: resolve(previews, `${name}.png`),
      frame: Math.round(seconds * composition.fps),
      imageFormat: 'png',
    });
    console.log(`Rendered ${name} at ${seconds}s`);
  }
} else {
  let lastMilestone = -1;
  const version = process.argv.find(arg => arg.startsWith('--version='))?.split('=')[1] ?? 'v2';
  if (!/^v[1-9]\d*$/.test(version)) throw new Error(`Invalid version: ${version}`);
  const outputLocation = resolve(previews, `bridge-reel-${version}.mp4`);
  await renderMedia({
    serveUrl, composition, browserExecutable, outputLocation,
    codec: 'h264', audioCodec: 'aac', crf: 18, pixelFormat: 'yuv420p', colorSpace: 'bt709',
    concurrency: 2, imageFormat: 'png',
    onProgress: ({progress}) => {
      const milestone = Math.floor(progress * 10);
      if (milestone !== lastMilestone) {
        lastMilestone = milestone;
        console.log(`Rendering: ${Math.round(progress * 100)}%`);
      }
    },
  });
  console.log(outputLocation);
}
