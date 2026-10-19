"""Extract actual MP4 frames for visual review; never edits delivered video."""
from pathlib import Path
import hashlib,json,subprocess
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parent.parent;p=json.loads((R/'data/auto-service.json').read_text());f=R/'previews/bridge-reel-auto-service-hq-60fps.mp4';out=R/'out/auto-service-video-check';out.mkdir(parents=True,exist_ok=True)
frames={0,1,448,454,460,472,1558,1559}
for s in p['scenes'][1:]:
 n=round(s['start']*60);frames.update([n-1,n,n+2,n+6,n+12])
for s in p['scenes']:frames.add(round((s['start']+(s['end']-s['start'])*.7)*60))
for c in p['captions']:frames.add(round((c['start']+c['end'])/2*60))
frames=sorted(frames);select='+'.join(f'eq(n\\,{n})' for n in frames)
subprocess.run(['ffmpeg','-v','error','-xerror','-y','-i',str(f),'-vf',f'select={select},scale=360:640:flags=lanczos','-fps_mode','vfr','-start_number','0',str(out/'frame-%03d.png')],check=True)
images=sorted(out.glob('frame-*.png'));assert len(images)==len(frames)
sheets=[]
for k in range(0,len(frames),6):
 page=frames[k:k+6];c=Image.new('RGB',(1080,1360),'#242424');d=ImageDraw.Draw(c)
 for j,n in enumerate(page):
  with Image.open(images[k+j]) as im:c.paste(im.convert('RGB'),(j%3*360,j//3*680))
  d.text((j%3*360+10,j//3*680+645),f'frame{n} / {n/60:.3f}s',fill='white')
 name=f'contact-{k//6:02d}.jpg';c.save(out/name,quality=95,subsampling=0);sheets.append(name)
d={'status':'awaiting_visual_review','source':str(f.relative_to(R)),'source_sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'frames':frames,'frames_extracted':len(frames),'contact_sheets':sheets,'phone_frame_dimensions':[360,640]}
(out/'frames.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print(json.dumps(d,ensure_ascii=False))
