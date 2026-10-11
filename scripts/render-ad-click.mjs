import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const plan = JSON.parse(readFileSync(resolve(root, 'data/ad-click.json'), 'utf8'));
const words = JSON.parse(readFileSync(resolve(root, 'data/words-ad-click.json'), 'utf8')).words;
const stills = process.argv.includes('--stills');
const master = process.argv.includes('--master');
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || '/usr/bin/chromium';
if (!stills && (!plan.voiceover || !existsSync(resolve(root, 'public', plan.voiceover)) ||
  plan.timing_status !== 'audio_aligned' || !words.length || !plan.captions.length)) {
  throw new Error('This ad is awaiting its own voiceover and word alignment. Only --stills is available until then.');
}
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'BridgeAdClick', browserExecutable});
const previews = resolve(root, 'previews');
mkdirSync(previews, {recursive: true});
if (stills) {
  const folder = resolve(previews, 'ad-click-work');
  mkdirSync(folder, {recursive: true});
  const targets = [
    ['01-first-frame', 0], ['01-after-click', plan.scenes[0].end - .8],
    ['02-clarity', plan.scenes[1].start + 1.5],
    ['03-landing', plan.scenes[2].end - .6],
    ['04-case', plan.scenes[3].end - .4],
    ['05-offer', plan.scenes[4].end - .7],
    ['06-action', plan.duration - 1.5],
  ];
  for (const [name, time] of targets) {
    await renderStill({serveUrl, composition, browserExecutable,
      output: resolve(folder, `${name}.png`), frame: Math.round(time * composition.fps), imageFormat: 'png'});
    console.log(`Checked ${name} at ${time.toFixed(2)}s`);
  }
} else {
  const outputLocation = resolve(previews, master
    ? 'bridge-reel-ad-click-master-4k-60fps.mp4' : 'bridge-reel-ad-click-hq-60fps.mp4');
  let milestone = -1;
  await renderMedia({serveUrl, composition, browserExecutable, outputLocation,
    codec: 'h264', audioCodec: 'aac', crf: 12, x264Preset: 'slow', audioBitrate: '320k',
    scale: master ? 2 : 1, pixelFormat: 'yuv420p', colorSpace: 'bt709', concurrency: 2, imageFormat: 'png',
    metadata: {comment: `bridge_mix_gain_db=${plan.mix_gain_db}`},
    onProgress: ({progress}) => {
      const next = Math.floor(progress * 10);
      if (next !== milestone) {milestone = next; console.log(`Rendering: ${Math.round(progress * 100)}%`);}
    }});
  console.log(outputLocation);
}
