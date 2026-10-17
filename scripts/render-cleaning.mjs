import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const plan = JSON.parse(readFileSync(resolve(root, 'data/cleaning.json'), 'utf8'));
const words = JSON.parse(readFileSync(resolve(root, 'data/words-cleaning.json'), 'utf8')).words;
const stills = process.argv.includes('--stills');
const master = process.argv.includes('--master');
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || '/usr/bin/chromium';
if (!stills && (!plan.voiceover || !existsSync(resolve(root, 'public', plan.voiceover)) ||
  plan.timing_status !== 'audio_aligned' || !words.length || !plan.captions.length)) {
  throw new Error('The cleaning ad needs its own voiceover and word alignment before a video render.');
}
if (plan.fps !== 60 || words.some(w => !(w.end > w.start))) {
  throw new Error('Invalid frame rate or word duration.');
}
if (plan.scenes.length !== 5 || plan.scenes[0].start !== 0 ||
  plan.scenes.at(-1).end !== plan.duration || plan.scenes.some((s, i) =>
    s.end <= s.start || (i > 0 && Math.abs(s.start - plan.scenes[i - 1].end) > 1e-6))) {
  throw new Error('Five contiguous scenes must cover the full video.');
}
if (Math.abs(plan.scenes.at(-1).end - plan.scenes.at(-1).start - 3) > 1e-6) {
  throw new Error('The final scene must last exactly three seconds.');
}
for (const caption of plan.captions) {
  if (!(caption.end > caption.start && caption.start >= 0 && caption.end <= plan.duration)) {
    throw new Error('Invalid caption cue boundaries.');
  }
  if (!caption.text && !(caption.word_ids?.length)) throw new Error('Caption has no text.');
  for (const id of caption.word_ids ?? []) {
    const word = words[id];
    if (!Number.isInteger(id) || !word || word.start < caption.start - 1e-6 || word.end > caption.end + 1e-6) {
      throw new Error(`Caption word ${id} falls outside its cue.`);
    }
  }
}
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'BridgeCleaning', browserExecutable,
  inputProps: {checkLayout: stills}});
if (composition.fps !== plan.fps || composition.durationInFrames !== Math.round(plan.duration * plan.fps) ||
  composition.width !== 1080 || composition.height !== 1920) {
  throw new Error('Composition dimensions, frame rate or duration differ from the approved plan.');
}
const previews = resolve(root, 'previews');
mkdirSync(previews, {recursive: true});
if (stills) {
  const folder = resolve(previews, 'cleaning-hq');
  mkdirSync(folder, {recursive: true});
  const at = (scene, fraction) => scene.start + (scene.end - scene.start) * fraction;
  const [problem, compositionScene, website, offer, final] = plan.scenes;
  const targets = [
    ['00-first-frame', 0],
    ['01-client-questions', at(problem, .82)],
    ['02-service-composition', at(compositionScene, .82)],
    ['03-mobile-website', plan.preview_times?.mobile ?? at(website, .25)],
    ['04-request-form', plan.preview_times?.form ?? at(website, .82)],
    ['05-landing-offer', at(offer, .22)],
    ['06-payment-hosting-terms', at(offer, .82)],
    ['07-final-message', at(final, .60)],
  ];
  const frames = [];
  for (const [name, time] of targets) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(time * composition.fps));
    let layout;
    await renderStill({serveUrl, composition, browserExecutable,
      output: resolve(folder, `${name}.png`), frame, imageFormat: 'png', logLevel: 'error',
      inputProps: {checkLayout: true},
      onBrowserLog: ({text}) => {
        if (text.startsWith('CLEANING_LAYOUT_CHECK=')) {
          const result = JSON.parse(text.slice('CLEANING_LAYOUT_CHECK='.length));
          if (result.frame === frame) layout = result;
        }
      }});
    if (!layout?.groups?.length || !layout.oswald_loaded ||
      layout.groups.some(g => Math.abs(g.center_x - 540) > .5 || g.left < 159 || g.right > 921 || g.bottom > 1601) ||
      layout.prices.some(p => p.width_px > p.available_px + 1 || !p.font.startsWith('Oswald'))) {
      throw new Error(`Safe-area or font check failed at ${name}: ${JSON.stringify(layout)}`);
    }
    frames.push({scene: name, seconds: frame / composition.fps, ...layout});
    console.log(`Checked ${name} at ${(frame / composition.fps).toFixed(2)}s`);
  }
  writeFileSync(resolve(root, 'data/cleaning-layout-check.json'), JSON.stringify({
    method: 'Chromium DOM bounds after font loading; principal groups, platform safe area and price fit',
    expected_center_x: 540, tolerance_px: .5,
    safe_area: {left: 160, right: 920, bottom: 1600, measurement_tolerance_px: 1}, frames,
  }, null, 2) + '\n');
} else {
  const outputLocation = resolve(previews, master
    ? 'bridge-reel-cleaning-master-4k-60fps.mp4' : 'bridge-reel-cleaning-hq-60fps.mp4');
  let milestone = -1;
  await renderMedia({serveUrl, composition, browserExecutable, outputLocation,
    codec: 'h264', audioCodec: 'aac', crf: 12, x264Preset: 'slow', audioBitrate: '320k',
    scale: master ? 2 : 1, pixelFormat: 'yuv420p', colorSpace: 'bt709', concurrency: 2, imageFormat: 'png',
    metadata: {comment: `bridge_mix_gain_db=${plan.mix_gain_db ?? 0}`},
    onProgress: ({progress}) => {
      const next = Math.floor(progress * 10);
      if (next !== milestone) {milestone = next; console.log(`Rendering: ${Math.round(progress * 100)}%`);}
    }});
  console.log(outputLocation);
}
