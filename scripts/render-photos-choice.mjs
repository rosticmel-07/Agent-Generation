import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const plan = JSON.parse(readFileSync(resolve(root, 'data/photos-choice.json'), 'utf8'));
const words = JSON.parse(readFileSync(resolve(root, 'data/words-photos-choice.json'), 'utf8')).words;
const stills = process.argv.includes('--stills');
const master = process.argv.includes('--master');
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || '/usr/bin/chromium';
if (!stills && (!plan.voiceover || !existsSync(resolve(root, 'public', plan.voiceover)) ||
  plan.timing_status !== 'audio_aligned' || !words.length || !plan.captions.length)) {
  throw new Error('This ad is awaiting its own voiceover and word alignment. Only --stills is available until then.');
}
if (plan.timing_status === 'audio_aligned') {
  if (plan.fps !== 60 || words.some(w => !(w.end > w.start))) throw new Error('Invalid frame rate or word duration.');
  if (plan.scenes[0].start !== 0 || plan.scenes.at(-1).end !== plan.duration ||
    plan.scenes.some((s, i) => s.end <= s.start || (i > 0 && s.start !== plan.scenes[i-1].end))) {
    throw new Error('Scene boundaries must cover the full video without gaps or overlaps.');
  }
  const ids = plan.captions.flatMap(c => c.word_ids);
  if (ids.length !== words.length || ids.some((id, i) => id !== i)) throw new Error('Captions must include every word exactly once.');
}
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'BridgePhotosChoice', browserExecutable,
  inputProps: {checkLayout: stills}});
const previews = resolve(root, 'previews');
mkdirSync(previews, {recursive: true});
if (stills) {
  const folder = resolve(previews, 'photos-choice-hq');
  mkdirSync(folder, {recursive: true});
  const targets = [
    ['00-first-frame',0], ['01-choice',2.10], ['02-services',5.10],
    ['03-products',8.50], ['04-adaptation',10.10], ['05-adapted-product',11.25],
    ['06-offer',14.10], ['07-final',21.20],
  ];
  const layoutChecks = [];
  for (const [name, time] of targets) {
    const frame = Math.round(time * composition.fps);
    let layout;
    await renderStill({serveUrl, composition, browserExecutable,
      output: resolve(folder, `${name}.png`), frame, imageFormat: 'png',
      logLevel: 'error',
      inputProps: {checkLayout: true},
      onBrowserLog: ({text}) => {
        if (text.startsWith('PHOTOS_CHOICE_CENTER_CHECK=')) {
          const result = JSON.parse(text.slice('PHOTOS_CHOICE_CENTER_CHECK='.length));
          if (result.frame === frame) layout = result;
        }
      }});
    if (!layout?.groups.length || !layout.oswald_loaded || layout.groups.some(g => Math.abs(g.center_x - 540) > .25) ||
      layout.prices.some(p => p.width_px > p.available_px + 1 || !p.font.startsWith('Oswald'))) {
      throw new Error(`Centering check failed at ${name}: ${JSON.stringify(layout)}`);
    }
    layoutChecks.push({scene: name, seconds: time, ...layout});
    console.log(`Checked ${name} at ${time.toFixed(2)}s`);
  }
  writeFileSync(resolve(root, 'data/photos-choice-centering-check.json'), JSON.stringify({
    method: 'Chromium DOM bounds after fonts loaded; centering, price width and Oswald loading checks',
    expected_center_x: 540, tolerance_px: .25, frames: layoutChecks,
  }, null, 2) + '\n');
} else {
  const outputLocation = resolve(previews, master
    ? 'bridge-reel-photos-choice-master-4k-60fps.mp4' : 'bridge-reel-photos-choice-hq-60fps.mp4');
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
