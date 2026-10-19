import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const plan = JSON.parse(readFileSync(resolve(root, 'data/auto-service.json'), 'utf8'));
const stills = process.argv.includes('--stills');
if (!stills) {
  if (!plan.voiceover || !existsSync(resolve(root, 'public', plan.voiceover)) || plan.timing_status !== 'audio_aligned' || !plan.captions.length) {
    throw new Error('Final export needs this campaign’s own complete voiceover, aligned scene boundaries and synchronous captions. Layout timing is provisional.');
  }
  if (!plan.icon || !existsSync(resolve(root, 'public', plan.icon))) throw new Error('Final export needs the original supplied Bridge icon file.');
  if (!['live_site', 'user_confirmed'].includes(plan.services_verification.status)) throw new Error('Verify the current service list before final export; historical PDF is not a live-site check.');
}
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || '/usr/bin/chromium';
const serveUrl = await bundle({entryPoint: resolve(root, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'BridgeAutoService', browserExecutable, inputProps: {checkLayout: stills}});
if (stills) {
  const folder = resolve(root, 'previews/auto-service-layout'); mkdirSync(folder, {recursive: true});
  const targets = [['00-first-frame', 0], ...plan.scenes.map((s, i) => [`${String(i + 1).padStart(2, '0')}-${s.id}`, s.start + (s.end - s.start) * .7])];
  const checks = [];
  for (const [name, time] of targets) {
    const frame = Math.round(time * plan.fps); let layout;
    await renderStill({serveUrl, composition, browserExecutable, frame, imageFormat: 'png', output: resolve(folder, `${name}.png`),
      inputProps: {checkLayout: true}, logLevel: 'error', onBrowserLog: ({text}) => {
        if (text.startsWith('AUTO_LAYOUT=')) {const d = JSON.parse(text.slice('AUTO_LAYOUT='.length)); if (d.frame === frame) layout = d;}
      }});
    if (!layout?.fonts || layout.groups.some(g => Math.abs(g.center - 540) > .6 || g.left < 120 || g.right > 960 || g.bottom > 1600) ||
      layout.text.some(t => t.width > t.available + 1)) throw new Error(`Layout check failed: ${name}: ${JSON.stringify(layout)}`);
    checks.push({name, ...layout}); console.log(`Checked ${name}`);
  }
  writeFileSync(resolve(root, 'data/auto-service-layout-check.json'), JSON.stringify({status: 'layout_only_not_audio_aligned',
    icon: 'Original file pending; existing PDF logo used only as stand-in', center_x: 540, checks}, null, 2) + '\n');
} else {
  const master = process.argv.includes('--master'); let milestone = -1;
  await renderMedia({serveUrl, composition, browserExecutable, outputLocation: resolve(root, `previews/bridge-reel-auto-service-${master ? 'master-4k' : 'hq'}-60fps.mp4`),
    codec: 'h264', audioCodec: 'aac', crf: 12, x264Preset: 'slow', audioBitrate: '320k', scale: master ? 2 : 1,
    pixelFormat: 'yuv420p', colorSpace: 'bt709', imageFormat: 'png', concurrency: 2,
    onProgress: ({progress}) => {const n = Math.floor(progress * 10); if (n !== milestone) {milestone = n; console.log(`Rendering ${Math.round(progress * 100)}%`);}}});
}
