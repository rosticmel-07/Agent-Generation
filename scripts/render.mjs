import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const previews = resolve(root, 'previews');
mkdirSync(previews, {recursive: true});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ||
  (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const compositionId = process.argv.find(arg => arg.startsWith('--composition='))?.split('=')[1] ?? 'BridgeReel';
if (!['BridgeReel', 'BridgeLanding150'].includes(compositionId)) throw new Error(`Unknown composition: ${compositionId}`);
const landing = compositionId === 'BridgeLanding150';
const finalExport = process.argv.includes('--final');
if (landing && finalExport) {
  const plan = JSON.parse(readFileSync(resolve(root, 'data/landing-150.json'), 'utf8'));
  if (!plan.voiceover || !existsSync(resolve(root, 'public', plan.voiceover)) || plan.timing_status !== 'audio_aligned') {
    throw new Error('Final export requires the new voiceover and captions aligned to that audio. Use the layout preview while they are pending.');
  }
}
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts')});
const options = {serveUrl, id: compositionId, browserExecutable};
const composition = await selectComposition(options);
const targets = landing ? [
  ['150-00-first-frame', 0], ['150-01-problem', 1.9], ['150-02-waiting', 4.8],
  ['150-03-solution', 8.8], ['150-04-case-start', 10.5], ['150-04-case', 12.7], ['150-05-offer', 16.9],
  ['150-06-action', 20.5],
] : [
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
  const outputLocation = resolve(previews, landing
    ? (finalExport ? 'bridge-reel-150.mp4' : 'bridge-reel-150-layout.mp4')
    : `bridge-reel-${version}.mp4`);
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
