import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const input = resolve(root, 'previews/bridge-reel-150-master-4k-60fps.mp4');
const output = resolve(root, 'previews/bridge-reel-150-hq-60fps.mp4');
if (!existsSync(input)) throw new Error('Render the 4K master first.');
const ffmpeg = process.env.FFMPEG_EXECUTABLE || 'ffmpeg';
const result = spawnSync(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
  '-vf', 'scale=1080:1920:flags=lanczos:in_color_matrix=bt709:out_color_matrix=bt709',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-profile:v', 'high',
  '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709',
  '-color_trc', 'bt709', '-c:a', 'copy', '-movflags', '+faststart', output,
], {stdio: 'inherit'});
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`FFmpeg exited with code ${result.status}`);
console.log(output);
