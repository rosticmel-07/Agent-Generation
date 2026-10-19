"""Validate actual delivered media, complete narration, layout and archive integrity."""
from pathlib import Path
import hashlib,json,re,subprocess
R=Path(__file__).resolve().parent.parent
p=json.loads((R/'data/auto-service.json').read_text());w=json.loads((R/'data/words-auto-service.json').read_text())
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
def samples(f):return len(subprocess.check_output(['ffmpeg','-v','error','-i',str(f),'-ac','1','-ar','48000','-f','s16le','-']))//2
assert p['fps']==60 and p['duration']==26 and len(p['scenes'])==7
assert p['scenes'][0]['start']==0 and p['scenes'][-1]['end']==26
assert p['scenes'][-1]['start']==23
for i,s in enumerate(p['scenes']):
 assert s['end']>s['start']
 if i:assert s['start']==p['scenes'][i-1]['end']
assert len(w['words'])==50
for i,x in enumerate(w['words']):
 assert 0<=x['start']<x['end']<=26
 if i:assert x['start']>=w['words'][i-1]['end']-.001
covered=[]
for c in p['captions']:
 assert 0<=c['start']<c['end']<=26
 for id in c['word_ids']:
  x=w['words'][id];assert c['start']<=x['start']<x['end']<=c['end'];covered.append(id)
assert set(covered)==set(range(50))
source=R/'public'/p['original_voiceover'];mix=R/'public'/p['voiceover']
assert sha(source)==w['source_audio_sha256']
ns,nm=samples(source),samples(mix);assert abs(ns-nm)<=48
proc=json.loads((R/'data/auto-service-audio-processing.json').read_text())
assert not proc['voice_trim'] and not proc['voice_time_stretch'] and not proc['voice_pitch_shift']
assert not re.search(r'\b(?:atrim|atempo|asetrate|rubberband|silenceremove)\b',proc['filter'])
l=json.loads((R/'data/auto-service-layout-check.json').read_text());assert len(l['checks'])==8
for f in l['checks']:
 assert f['fonts']
 for g in f['groups']:assert abs(g['center']-540)<=.6 and g['left']>=120 and g['right']<=960 and g['bottom']<=1600
 for t in f['text']:assert t['width']<=t['available']+1
report={'duration_seconds':26,'fps':60,'video_frames':1560,'word_count':50,'caption_cues':len(p['captions']),'final_scene_seconds':3,
 'source_audio_sha256':w['source_audio_sha256'],'voice_trimmed':False,'voice_time_stretch':False,'voice_pitch_shift':False,
 'full_voice_verification':{'sample_rate':48000,'source_decoded_samples':ns,'mix_decoded_samples':nm,'difference_samples':nm-ns,'maximum_tolerance_ms':1},
 'master_render_scale':2,'main_downsample':'Lanczos2160x3840 ->1080x1920','crf':12,'preset':'slow',
 'brand_asset':p['icon_status'],'services_provenance':p['services_verification'],'illustration':p['illustration'],'files':[]}
for suffix,width,height in [('master-4k',2160,3840),('hq',1080,1920)]:
 name=f'previews/bridge-reel-auto-service-{suffix}-60fps.mp4';path=R/name
 meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
 v=next(x for x in meta['streams'] if x['codec_type']=='video');a=next(x for x in meta['streams'] if x['codec_type']=='audio')
 assert (v['width'],v['height'])==(width,height) and v['r_frame_rate']==v['avg_frame_rate']=='60/1'
 assert int(v['nb_frames'])==1560 and v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
 assert all(v[k]=='bt709' for k in ['color_space','color_transfer','color_primaries'])
 assert a['codec_name']=='aac' and a['channels']==2 and abs(float(meta['format']['duration'])-26)<.05
 subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(path),'-map','0:v:0','-map','0:a:0','-f','null','-'],check=True)
 loud=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',str(path),'-vn','-af','loudnorm=I=-17:TP=-2:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
 measured=json.loads(re.findall(r'\{[^{}]+\}',loud.stderr)[-1]);assert float(measured['input_tp'])<-1 and -19.5<=float(measured['input_i'])<=-15,measured
 report['files'].append({'file':name,'sha256':sha(path),'size_bytes':path.stat().st_size,'video_bitrate':int(v['bit_rate']),'profile':v['profile'],'audio_bitrate':int(a['bit_rate']),
 'container_duration':float(meta['format']['duration']),'integrated_lufs':float(measured['input_i']),'true_peak_dbtp':float(measured['input_tp']),'full_decode':'passed'})
 print('Checked',name,width,height,1560,measured['input_i'],'LUFS',flush=True)
oldfiles=[];oldsources={}
for campaign in ['landing-150','ad-click','direct-questions','two-offers','photos-choice','cleaning','cleaning-premium']:
 old=json.loads((R/f'data/{campaign}-export-report.json').read_text());op=json.loads((R/f'data/{campaign}.json').read_text())
 for f in old['files']:
  assert sha(R/f['file'])==f['sha256'];oldfiles.append({'file':f['file'],'sha256':f['sha256']})
 voice=op.get('original_voiceover','audio/voiceover-150.mp3');assert sha(R/'public'/voice)==old['source_audio_sha256'];oldsources[voice]=old['source_audio_sha256']
assert len(oldfiles)==14
report['previous_files']=oldfiles;report['previous_original_voiceovers']=oldsources
report['layout']={'sampled_frames':8,'center_x':540,'safe_area':{'left':120,'right':960,'bottom':1600},'max_center_error':max(abs(g['center']-540) for f in l['checks'] for g in f['groups'])}
report['checks']=['FullH264/AAC decode passed for both actualMP4 files.','26seconds/1560frames/60fps/BT709/stereoAAC verified.','Integrated loudness and true peaks measured on both files.','Complete original and normalized voice sample counts match within1ms; no trimming, tempo or pitch change.','All50spoken display units aligned and covered by complete caption cues, main dialogue or final CTA.','EightChromium font/safe-area/text-width/center checks passed.','Sevencontiguous scenes, final exactly3seconds.','Fourteenprevious MP4s and earlier original voiceovers SHA verified unchanged.']
(R/'data/auto-service-export-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
