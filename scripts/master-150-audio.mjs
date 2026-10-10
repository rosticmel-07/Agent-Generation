// Upgrade an older untagged master without re-encoding any video frames.
// New renders already include this gain and are tagged, so they are skipped.
import {spawnSync} from 'node:child_process';
import {readFileSync, renameSync, mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const input = resolve(root, 'previews/bridge-reel-150-master-4k-60fps.mp4');
mkdirSync(resolve(root, 'out'), {recursive: true});
const target = resolve(root, 'out/master-150-audio.mp4');
const plan = JSON.parse(readFileSync(resolve(root, 'data/landing-150.json'), 'utf8'));
const probe = spawnSync(process.env.FFPROBE_EXECUTABLE || 'ffprobe', ['-v', 'error',
  '-show_entries', 'format_tags=comment', '-of', 'json', input], {encoding: 'utf8'});
if (probe.error) throw probe.error;
if (probe.status !== 0) throw new Error(probe.stderr);
const comment = JSON.parse(probe.stdout).format?.tags?.comment || '';
const current = Number(comment.match(/bridge_mix_gain_db=([-\d.]+)/)?.[1] ?? 0);
if (current === plan.mix_gain_db) {
  console.log('Master already has the configured gain.');
} else {
  const gain = plan.mix_gain_db - current;
  const result = spawnSync(process.env.FFMPEG_EXECUTABLE || 'ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
    '-map', '0:v:0', '-map', '0:a:0', '-c:v', 'copy',
    '-af', `volume=${gain}dB`, '-c:a', 'aac', '-b:a', '320k',
    '-metadata', `comment=bridge_mix_gain_db=${plan.mix_gain_db}`, '-movflags', '+faststart', target,
  ], {stdio: 'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`FFmpeg exited with code ${result.status}`);
  renameSync(target, input);
  console.log(`Applied ${gain} dB; video stream copied unchanged.`);
}
