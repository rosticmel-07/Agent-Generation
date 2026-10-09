import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, Icon, PostArt, C, shadow, smooth, reveal} from './BridgeReel';
import plan from '../data/landing-150.json';

// Critical content: x=96..900, y=160..1550. Leave the right and bottom
// portions available for platform controls; check against the actual ad UI.
const left = 96;
const width = 804;
const panel: React.CSSProperties = {
  border: `1px solid ${C.line}`, background: C.panel,
  borderRadius: 30, boxShadow: shadow, overflow: 'hidden',
};
const SceneTitle: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 78}) => (
  <div style={{position: 'absolute', left, top: 327, width, fontSize: size,
    fontWeight: 750, lineHeight: 1.12, letterSpacing: -3.2}}>{children}</div>
);
const Brand: React.FC = () => <Img src={staticFile('brand/logo.png')}
  style={{position: 'absolute', left, top: 160, width: 156, height: 103, objectFit: 'contain'}}/>;

const Problem: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    {/* The complete hook is opaque on the first frame. */}
    <SceneTitle>У твоєму Instagram<br/><span style={{color: C.red}}>не знаходять ціну?</span></SceneTitle>
    <div style={{position: 'absolute', left, top: 612, width, height: 704, ...panel}}>
      <div style={{height: 102, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 22,
        borderBottom: `1px solid ${C.line}`}}>
        <div style={{width: 50, height: 50, border: `2px solid ${C.red}`, borderRadius: '50%', background: '#262d28'}}/>
        <span style={{fontSize: 33, fontWeight: 700}}>Ваш бізнес</span>
        <Icon name="grid" size={32} style={{marginLeft: 'auto'}}/>
      </div>
      <div style={{padding: '26px 36px 0'}}>
        <div style={{fontSize: 38, fontWeight: 700}}>Послуги для вас</div>
        <div style={{fontSize: 30, color: C.muted, marginTop: 9}}>Деталі — у повідомленнях</div>
      </div>
      <div style={{display: 'flex', gap: 10, padding: '24px 36px 0',
        transform: `translateY(${-smooth(f, 10, 65) * 10}px)`}}>
        {[0, 1, 2].map((v) => <div key={v} style={{position: 'relative', borderRadius: 12, overflow: 'hidden'}}>
          <PostArt variant={v} size={237}/>
          <div style={{position: 'absolute', left: 15, bottom: 16, fontSize: 29, fontWeight: 700,
            textShadow: '0 2px 10px #000'}}>{['Послуги', 'Роботи', 'Про нас'][v]}</div>
        </div>)}
      </div>
      <div style={{position: 'absolute', left: 36, right: 36, bottom: 31, height: 102,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 29px',
        border: `1px solid ${f > 22 ? '#85434a' : '#384139'}`, borderRadius: 17, background: '#1b201d'}}>
        <span style={{fontSize: 39, fontWeight: 700}}>Ціна</span>
        <span style={{fontSize: 67, fontWeight: 750, color: C.red}}>?</span>
      </div>
    </div>
  </AbsoluteFill>;
};

const Waiting: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <SceneTitle>Писати. Чекати.<br/><span style={{color: C.red}}>Чи шукати далі?</span></SceneTitle>
    <div style={{position: 'absolute', left, top: 635, width, height: 658, ...panel, ...reveal(f, 0)}}>
      <div style={{height: 115, padding: '0 38px', display: 'flex', alignItems: 'center', gap: 23,
        borderBottom: `1px solid ${C.line}`}}>
        <Icon name="message" size={41} color={C.red}/><span style={{fontSize: 35, fontWeight: 700}}>Ваш бізнес</span>
      </div>
      <div style={{margin: '71px 35px 0 111px', background: '#292f2b', borderRadius: '26px 26px 7px 26px',
        padding: '28px 30px', fontSize: 44, fontWeight: 650, ...reveal(f, 6)}}>Скільки коштує?</div>
      <div style={{marginTop: 20, marginRight: 42, textAlign: 'right', fontSize: 28, color: C.muted,
        ...reveal(f, 14)}}>Надіслано</div>
      <div style={{position: 'absolute', left: 38, bottom: 70, display: 'flex', gap: 22, alignItems: 'center',
        color: C.muted, ...reveal(f, 21)}}><Icon name="clock" size={44} color={C.red}/>
        <span style={{fontSize: 35}}>Очікування відповіді</span>
        <span style={{display: 'flex', gap: 7, marginLeft: 5}}>{[0, 1, 2].map(i => <span key={i}
          style={{width: 7, height: 7, borderRadius: '50%', background: C.muted,
            opacity: .35 + .3 * Math.sin(f / 12 - i)}}/>)}</span>
      </div>
    </div>
  </AbsoluteFill>;
};

const Solution: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <SceneTitle size={74}>Усе про твої послуги —<br/><span style={{color: C.red}}>за одним посиланням.</span></SceneTitle>
    <div style={{position: 'absolute', left, top: 620, width, height: 715, ...panel, ...reveal(f)}}>
      <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 9, padding: '0 29px', background: '#202622'}}>
        {[0, 1, 2].map(i => <span key={i} style={{width: 9, height: 9, background: '#68736a', borderRadius: '50%'}}/>)}
        <Icon name="site" size={27} color={C.muted} style={{marginLeft: 'auto'}}/>
      </div>
      <div style={{padding: '30px 32px'}}>
        <div style={{fontSize: 46, fontWeight: 750, letterSpacing: -1.7}}>Твоя послуга.<br/><span style={{color: '#b1c8a9'}}>Зрозуміла пропозиція.</span></div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 30}}>
          {[
            ['Послуги', 'site'], ['Приклади робіт', 'grid'], ['Ціни', 'price'], ['Заявка', 'message'],
          ].map(([label, icon], i) => <div key={label} style={{height: 132, padding: '19px 20px',
            border: '1px solid #35423a', borderRadius: 17, background: '#1b241f',
            ...reveal(f, 9 + i * 5)}}>
            <Icon name={icon as 'site' | 'grid' | 'price' | 'message'} size={34} color={C.red}/>
            <div style={{fontSize: label === 'Приклади робіт' ? 30 : 34, fontWeight: 650, marginTop: 10}}>{label}</div>
          </div>)}
        </div>
        <div style={{height: 83, marginTop: 24, borderRadius: 18, background: C.red, padding: '0 26px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 33,
          fontWeight: 700, ...reveal(f, 25)}}>Залишити заявку<Icon name="arrow" size={37}/></div>
      </div>
    </div>
  </AbsoluteFill>;
};

const Case: React.FC = () => {
  const f = useCurrentFrame();
  const capture = plan.case_capture as string | null;
  const clip = plan.case_clip as string | null;
  const fullCase = Boolean(capture || clip);
  return <AbsoluteFill>
    <SceneTitle size={76}>Ось як це<br/><span style={{color: C.red}}>може виглядати.</span></SceneTitle>
    <div style={{position: 'absolute', left, top: 647, width, height: fullCase ? 665 : 480, ...panel}}>
      <div style={{height: 62, display: 'flex', alignItems: 'center', gap: 9, padding: '0 29px', background: '#202622'}}>
        {[0, 1, 2].map(i => <span key={i} style={{width: 9, height: 9, background: '#68736a', borderRadius: '50%'}}/>)}
        <span style={{marginLeft: 'auto', fontSize: 28, color: '#bbc6bc'}}>Композитна сітка</span>
      </div>
      <div style={{position: 'absolute', top: 62, bottom: 0, left: 0, right: 0, overflow: 'hidden'}}>
        {clip ? <OffthreadVideo src={staticFile(clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
        : <Img src={staticFile(capture ?? 'brand/portfolio.png')} style={{display: 'block', width: capture ? '100%' : '114%',
          maxWidth: 'none', marginLeft: capture ? 0 : '-7%',
          transform: capture
            ? `translateY(${-smooth(f, 19, 88) * plan.case_scroll_pixels}px)`
            : `translateY(${-smooth(f, 16, 90) * 7}px)`, transformOrigin: 'center top'}}/>}
      </div>
    </div>
    <div style={{position: 'absolute', left, top: fullCase ? 1340 : 1190, width,
      fontSize: 32, fontWeight: 600, color: '#b7bdb7'}}>Реальний проєкт Bridge Agency</div>
  </AbsoluteFill>;
};

const Price: React.FC = () => <div style={{position: 'absolute', left, top: 348, width}}>
  <div style={{fontSize: 91, fontWeight: 750, letterSpacing: -3.8, lineHeight: 1.1}}>Лендінг за</div>
  <div style={{fontSize: 185, fontWeight: 800, letterSpacing: -7, color: C.red, lineHeight: 1.16, marginTop: 17}}>$150</div>
</div>;

const Offer: React.FC = () => <AbsoluteFill>
  <Price/>
  <div style={{position: 'absolute', left, top: 791, width, fontSize: 43, fontWeight: 650,
    letterSpacing: -.8}}>Дизайн <span style={{color: C.red}}>•</span> Тексти <span style={{color: C.red}}>•</span> Розробка</div>
  <div style={{position: 'absolute', left, top: 916, width, fontSize: 47, fontWeight: 650,
    lineHeight: 1.3, padding: '28px 30px', borderRadius: 23, border: `1px solid ${C.line}`, background: '#151b17'}}>
    Перші <span style={{color: C.red}}>50%</span> — після<br/>затвердження дизайну
  </div>
  <div style={{position: 'absolute', left, top: 1184, width, color: '#b7bdb7', fontSize: 35, lineHeight: 1.4}}>
    Домен і хостинг<br/>оплачуються окремо
  </div>
</AbsoluteFill>;

const Action: React.FC = () => <AbsoluteFill>
  {/* Same price position as the offer; no title crossfade or moving CTA. */}
  <Price/>
  <div style={{position: 'absolute', left, top: 784, width, fontSize: 74, fontWeight: 750,
    lineHeight: 1.12, letterSpacing: -2.8}}>Залиш заявку —<br/>обговоримо твій сайт</div>
  <div style={{position: 'absolute', left, top: 1056, width, fontSize: 43, fontWeight: 650,
    letterSpacing: -1}}>bridgeagency.com.ua</div>
  <div style={{position: 'absolute', left, top: 1150, width, height: 120, borderRadius: 60,
    background: 'linear-gradient(105deg,#f52739,#dc1024)', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '0 40px', fontSize: 40, fontWeight: 700,
    boxShadow: 'inset 0 1px 0 #ffffff20, 0 18px 45px #00000030'}}>Залишити заявку<Icon name="arrow" size={45}/></div>
</AbsoluteFill>;

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cue = plan.captions.find(c => t >= c.start && t < c.end);
  if (!cue) return null;
  return <div style={{position: 'absolute', left: 85, top: 1420, width: 830, zIndex: 20,
    textAlign: 'center', fontSize: 43, fontWeight: 650, letterSpacing: -.8, lineHeight: 1.32,
    textShadow: '0 2px 12px #000'}}>{cue.text}</div>;
};

const scenes = [Problem, Waiting, Solution, Case, Offer, Action];
export const BridgeLanding150: React.FC = () => {
  const {fps} = useVideoConfig();
  const voiceover = plan.voiceover as string | null;
  return <AbsoluteFill className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <Background/>
    <Audio src={staticFile('audio/atmosphere-150.wav')}/>
    {voiceover ? <Audio src={staticFile(voiceover)} volume={plan.voiceover_volume}/> : null}
    {plan.scenes.map((scene, i) => {
      const Component = scenes[i];
      const from = Math.round(scene.start * fps);
      return <Sequence key={scene.id} from={from} durationInFrames={Math.round(scene.end * fps) - from}>
        <Component/>
      </Sequence>;
    })}
    <Brand/>
    <Captions/>
  </AbsoluteFill>;
};
