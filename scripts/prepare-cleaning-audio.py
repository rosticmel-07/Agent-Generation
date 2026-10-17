"""Keep the original MP3; trim only the unrequested audit tail in a separate mix."""
from pathlib import Path
import json,re,subprocess
r=Path(__file__).resolve().parent.parent
source=r/'public/audio/voiceover-cleaning.mp3';target=r/'public/audio/voiceover-cleaning-mix.wav'
trim='atrim=end=18.76,afade=t=out:st=18.744:d=0.016,asetpts=PTS-STARTPTS'
a=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(source),'-af',trim+',loudnorm=I=-17:TP=-2:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
s=json.loads(re.findall(r'\{[^{}]+\}',a.stderr)[-1])
normal=('loudnorm=I=-17:TP=-2:LRA=11:'+f"measured_I={s['input_i']}:measured_TP={s['input_tp']}:measured_LRA={s['input_lra']}:measured_thresh={s['input_thresh']}:offset={s['target_offset']}:linear=true")
subprocess.run(['ffmpeg','-hide_banner','-v','error','-y','-i',str(source),'-af',trim+','+normal,'-ar','48000','-c:a','pcm_s24le',str(target)],check=True)
(r/'data/cleaning-audio-processing.json').write_text(json.dumps({'source':str(source.relative_to(r)),'output':str(target.relative_to(r)),'voice_time_stretch':False,'voice_pitch_shift':False,'trim_end_seconds':18.76,'fade_out_seconds':.016,'source_measurements':s,'filter':trim+','+normal},ensure_ascii=False,indent=2)+'\n')
print('Prepared separate18.76s normalized WAV; source MP3 unchanged.')
