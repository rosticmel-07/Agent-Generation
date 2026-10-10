import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate,
  spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background, Icon, PostArt, C, shadow} from './BridgeReel';
import plan from '../data/landing-150.json';
import wordData from '../data/words-150.json';

const left = 96;
const width = 804;
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
// Equivalent 30 fps frames keep motion durations consistent at 60 fps.
const useMotionFrame = () => useCurrentFrame() * 30 / useVideoConfig().fps;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1],
  {...clamp, easing: Easing.bezier(.2, .85, .25, 1)});
const settle = (f: number, delay = 0) => spring({frame: Math.max(0, f - delay), fps: 30,
  config: {damping: 22, stiffness: 170, mass: .85}});
const enter = (f: number, delay = 0, distance = 30) => ({
  opacity: ease(f, delay, delay + 6),
  transform: `translateY(${(1 - settle(f, delay)) * distance}px)`,
});
const panel: React.CSSProperties = {
  border: '1px solid #353b37', background: 'linear-gradient(125deg,#1b211d,#101411 80%)',
  borderRadius: 30, boxShadow: `${shadow}, 0 0 60px #f3233505`, overflow: 'hidden',
};

const SceneTitle: React.FC<{lines: [string, string]; size?: number; immediate?: boolean}> = ({lines, size = 78, immediate}) => {
  const f = useMotionFrame();
  return <div style={{position: 'absolute', left, top: 327, width, fontSize: size,
    fontWeight: 750, lineHeight: 1.12, letterSpacing: -3.2}}>
    {lines.map((line, i) => <div key={line} style={{overflow: 'hidden', paddingBottom: 6}}>
      <div style={{color: i ? C.red : C.white, ...(immediate ? {} : enter(f, i * 2, 38))}}>{line}</div>
    </div>)}
  </div>;
};
const Brand: React.FC = () => <Img src={staticFile('brand/logo.png')}
  style={{position: 'absolute', left, top: 160, width: 156, height: 103, objectFit: 'contain'}}/>;

const Problem: React.FC = () => {
  const f = useMotionFrame();
  const focus = ease(f, 21, 44);
  return <AbsoluteFill>
    <SceneTitle immediate lines={['У твоєму Instagram', 'не знаходять ціну?']}/>
    <div style={{position: 'absolute', left, top: 612, width, height: 704, ...panel,
      transform: `perspective(1700px) rotateX(${(1 - ease(f, 0, 19)) * 3}deg) rotateZ(${-(1 - ease(f, 0, 28)) * .55}deg)`}}>
      <div style={{height: 102, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 22,
        borderBottom: `1px solid ${C.line}`}}>
        <div style={{width: 50, height: 50, border: `2px solid ${C.red}`, borderRadius: '50%', background: '#262d28'}}/>
        <span style={{fontSize: 33, fontWeight: 700}}>Ваш бізнес</span><Icon name="grid" size={32} style={{marginLeft: 'auto'}}/>
      </div>
      <div style={{padding: '26px 36px 0'}}>
        <div style={{fontSize: 38, fontWeight: 700}}>Послуги для вас</div>
        <div style={{fontSize: 30, color: C.muted, marginTop: 9}}>Деталі — у повідомленнях</div>
      </div>
      <div style={{display: 'flex', gap: 10, padding: '24px 36px 0',
        transform: `translateY(${-ease(f, 5, 51) * 12}px)`}}>
        {[0, 1, 2].map((v) => <div key={v} style={{position: 'relative', borderRadius: 12, overflow: 'hidden', opacity: 1 - focus * .12}}>
          <PostArt variant={v} size={237}/>
          <div style={{position: 'absolute', left: 15, bottom: 16, fontSize: 29, fontWeight: 700,
            textShadow: '0 2px 10px #000'}}>{['Послуги', 'Роботи', 'Про нас'][v]}</div>
        </div>)}
      </div>
      <div style={{position: 'absolute', left: 36, right: 36, bottom: 31, height: 102,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 29px',
        border: `1px solid ${focus > .3 ? '#8b3a45' : '#384139'}`, borderRadius: 17,
        background: 'linear-gradient(100deg,#24211f,#1b201d)', transform: `scale(${1 + focus * .012})`,
        boxShadow: `0 0 ${focus * 32}px #f3233510`}}>
        <span style={{fontSize: 39, fontWeight: 700}}>Ціна</span>
        <span style={{fontSize: 67, fontWeight: 750, color: C.red, transform: `translateY(${(1 - settle(f, 24)) * -10}px)`}}>?</span>
      </div>
      <div style={{position: 'absolute', right: 116 - focus * 51, bottom: 160 - focus * 75,
        opacity: ease(f, 12, 21), filter: 'drop-shadow(0 4px 7px #0008)'}}><Icon name="cursor" size={47}/></div>
    </div>
  </AbsoluteFill>;
};

const Waiting: React.FC = () => {
  const f = useMotionFrame();
  const message = 'Скільки коштує?';
  const typed = message.slice(0, Math.ceil(ease(f, 5, 18) * message.length));
  return <AbsoluteFill>
    <SceneTitle lines={['Писати. Чекати.', 'Чи шукати далі?']}/>
    <div style={{position: 'absolute', left, top: 635, width, height: 658, ...panel, ...enter(f, 2, 46)}}>
      <div style={{height: 115, padding: '0 38px', display: 'flex', alignItems: 'center', gap: 23,
        borderBottom: `1px solid ${C.line}`}}>
        <Icon name="message" size={41} color={C.red}/><span style={{fontSize: 35, fontWeight: 700}}>Ваш бізнес</span>
      </div>
      <div style={{margin: '71px 35px 0 111px', minHeight: 112, background: 'linear-gradient(100deg,#35352e,#252c28)',
        border: '1px solid #42453a', borderRadius: '26px 26px 7px 26px', padding: '26px 30px',
        fontSize: 44, fontWeight: 650, transformOrigin: 'right bottom',
        opacity: ease(f, 4, 9), transform: `translateX(${(1 - settle(f, 4)) * 35}px) scale(${.94 + settle(f, 4) * .06})`}}>
        {typed}<span style={{color: C.red, opacity: f < 20 ? 1 : 0}}>|</span>
      </div>
      <div style={{marginTop: 20, marginRight: 42, display: 'flex', justifyContent: 'flex-end', gap: 13,
        alignItems: 'center', fontSize: 28, color: C.muted, ...enter(f, 19)}}>Надіслано<Icon name="check" size={28}/></div>
      <div style={{position: 'absolute', left: 38, bottom: 70, display: 'flex', gap: 22, alignItems: 'center', color: C.muted, ...enter(f, 25)}}>
        <div style={{transform: `rotate(${ease(f, 25, 57) * 30}deg)`}}><Icon name="clock" size={44} color={C.red}/></div>
        <span style={{fontSize: 35}}>Очікування відповіді</span>
        <span style={{display: 'flex', gap: 7}}>{[0, 1, 2].map(i => <span key={i} style={{width: 7, height: 7,
          borderRadius: '50%', background: C.muted, opacity: .45 + .25 * Math.sin(f / 8 - i)}}/>)}</span>
      </div>
    </div>
  </AbsoluteFill>;
};

const Solution: React.FC = () => {
  const f = useMotionFrame();
  const accents = [6.04, 6.9, 7.7, 8.36].map(t => (t - plan.scenes[2].start) * 30);
  return <AbsoluteFill>
    <SceneTitle size={74} lines={['Усе про твої послуги —', 'за одним посиланням.']}/>
    <div style={{position: 'absolute', left, top: 620, width, height: 715, ...panel,
      ...enter(f, 2, 45), transform: `perspective(1800px) rotateX(${(1 - settle(f, 2)) * 5}deg) translateY(${(1 - settle(f, 2)) * 40}px)`}}>
      <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 9, padding: '0 29px', background: '#202622'}}>
        {[0, 1, 2].map(i => <span key={i} style={{width: 9, height: 9, background: '#68736a', borderRadius: '50%'}}/>)}
        <Icon name="site" size={27} color={C.muted} style={{marginLeft: 'auto'}}/>
      </div>
      <div style={{padding: '30px 32px'}}>
        <div style={{fontSize: 46, fontWeight: 750, letterSpacing: -1.7}}>Твоя послуга.<br/><span style={{color: '#dadfd6'}}>Зрозуміла пропозиція.</span></div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 30}}>
          {[
            ['Послуги', 'site'], ['Приклади робіт', 'grid'], ['Ціни', 'price'], ['Заявка', 'message'],
          ].map(([label, icon], i) => {
            const pulse = Math.sin(Math.PI * ease(f, accents[i], accents[i] + 24));
            return <div key={label} style={{height: 132, padding: '19px 20px', border: `1px solid ${pulse > .3 ? '#8a3c46' : '#35423a'}`,
              borderRadius: 17, background: 'linear-gradient(135deg,#242922,#161d19)', ...enter(f, 6 + i * 3, 32),
              boxShadow: `inset 0 0 24px rgba(243,35,53,${pulse * .055})`}}>
              <Icon name={icon as 'site' | 'grid' | 'price' | 'message'} size={34} color={C.red}/>
              <div style={{fontSize: label === 'Приклади робіт' ? 30 : 34, fontWeight: 650, marginTop: 10}}>{label}</div>
            </div>;
          })}
        </div>
        <div style={{height: 83, marginTop: 24, borderRadius: 18, background: C.red, padding: '0 26px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 33,
          fontWeight: 700, ...enter(f, 19)}}>Залишити заявку<Icon name="arrow" size={37}/></div>
      </div>
    </div>
  </AbsoluteFill>;
};

const Case: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <SceneTitle size={76} lines={['Ось як це', 'може виглядати.']}/>
    <div style={{position: 'absolute', left, top: 647, width, height: 665, ...panel,
      transform: `scale(${.976 + ease(f, 0, 14) * .024})`, transformOrigin: 'center top'}}>
      <div style={{height: 62, display: 'flex', alignItems: 'center', gap: 9, padding: '0 29px', background: '#202622'}}>
        {[0, 1, 2].map(i => <span key={i} style={{width: 9, height: 9, background: '#68736a', borderRadius: '50%'}}/>)}
        <span style={{marginLeft: 'auto', fontSize: 28, color: '#bbc6bc'}}>Композитна сітка</span>
      </div>
      <div style={{position: 'absolute', top: 62, bottom: 0, left: 0, right: 0, overflow: 'hidden'}}>
        <OffthreadVideo src={staticFile(plan.case_clip)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
      </div>
    </div>
    <div style={{position: 'absolute', left, top: 1340, width, fontSize: 32, fontWeight: 600,
      color: '#b7bdb7', display: 'flex', alignItems: 'center', gap: 14, ...enter(f, 7, 15)}}>
      <span style={{width: 8, height: 8, borderRadius: '50%', background: C.red}}/>Реальний проєкт Bridge Agency
    </div>
  </AbsoluteFill>;
};

// One persistent card spans offer + CTA. Compact it once, then hold still.
const OfferDeck: React.FC = () => {
  const f = useMotionFrame();
  const start = plan.scenes[4].start * 30;
  if (f < start) return null;
  const local = f - start;
  const compact = ease(f, plan.scenes[5].start * 30, plan.scenes[5].start * 30 + 13);
  const land = settle(local);
  const height = 638 - compact * 320;
  const gloss = ease(local, 17, 55);
  return <div style={{position: 'absolute', zIndex: 8, left, top: 350 - compact * 17, width, height,
    borderRadius: 34, overflow: 'hidden', border: '1px solid #634048',
    background: 'radial-gradient(ellipse at 100% 0%,#64192460,transparent 58%),linear-gradient(125deg,#282727,#121714 76%)',
    boxShadow: '0 30px 90px #0006, inset 0 1px 0 #ffffff19', opacity: ease(local, 0, 5),
    transform: `perspective(1800px) translateY(${(1 - land) * -44}px) rotateX(${(1 - land) * 7}deg)`}}>
    <div style={{position: 'absolute', left: 0, top: 35, width: 3, height: height - 70,
      background: 'linear-gradient(transparent,#f32335,transparent)', opacity: .8}}/>
    <div style={{position: 'absolute', left: -480 + gloss * 1900, top: -250, width: 210, height: 1200,
      transform: 'rotate(24deg)', opacity: (1 - compact) * .32,
      background: 'linear-gradient(90deg,transparent,#ffffff0a,transparent)', pointerEvents: 'none'}}/>
    <div style={{position: 'absolute', left: 35, top: 33, fontSize: 76 - compact * 24, fontWeight: 750,
      letterSpacing: -2.8, lineHeight: 1.15, ...enter(local, 3, 22)}}>Лендінг за</div>
    <div style={{position: 'absolute', right: 32, top: 34, color: '#db3547', opacity: .9}}><Icon name="site" size={60 - compact * 13}/></div>
    <div style={{position: 'absolute', top: 148 - compact * 48, left: 31, display: 'flex', overflow: 'hidden',
      fontSize: 182 - compact * 47, fontWeight: 800, letterSpacing: -5.5, lineHeight: 1.2, color: C.red}}>
      {'$150'.split('').map((digit, i) => <span key={i} style={{display: 'block',
        opacity: ease(local, 6 + i * 1.7, 10 + i * 1.7),
        transform: `translateY(${(1 - settle(local, 6 + i * 1.7)) * 155}px)`}}>{digit}</span>)}
    </div>
    <div style={{position: 'absolute', left: 35, right: 35, top: 418, height: 1, background: '#ffffff15', opacity: 1 - compact}}/>
    <div style={{position: 'absolute', left: 35, right: 35, top: 475, display: 'flex', gap: 14,
      opacity: 1 - compact, transform: `translateY(${-compact * 30}px)`}}>
      {['Дизайн', 'Тексти', 'Розробка'].map((label, i) => <div key={label} style={{flex: 1, height: 103,
        background: 'linear-gradient(#ffffff06,#ffffff02)', border: '1px solid #ffffff15', borderRadius: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 33,
        fontWeight: 650, ...enter(local, 16 + i * 3, 28)}}><Icon name="check" size={25} color={C.red}/>{label}</div>)}
    </div>
  </div>;
};

const Offer: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <div style={{position: 'absolute', left, top: 1044, width, fontSize: 45, fontWeight: 650,
      lineHeight: 1.3, padding: '28px 31px', borderRadius: 24, border: '1px solid #3e4139',
      background: 'linear-gradient(110deg,#20261f,#121813)', ...enter(f, 22, 28)}}>
      Перші <span style={{color: C.red}}>50%</span> — після<br/>затвердження дизайну
    </div>
    <div style={{position: 'absolute', left, top: 1253, width, color: '#b7bdb7', fontSize: 34,
      lineHeight: 1.4, ...enter(f, 26, 20)}}>Домен і хостинг оплачуються окремо</div>
  </AbsoluteFill>;
};

const Action: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <div style={{position: 'absolute', left, top: 784, width, fontSize: 74, fontWeight: 750,
      lineHeight: 1.12, letterSpacing: -2.8, ...enter(f, 5, 34)}}>Залиш заявку —<br/>обговоримо твій сайт</div>
    <div style={{position: 'absolute', left, top: 1056, width, fontSize: 43, fontWeight: 650,
      letterSpacing: -1, ...enter(f, 9, 20)}}>bridgeagency.com.ua</div>
    <div style={{position: 'absolute', left, top: 1150, width, height: 120, borderRadius: 60,
      background: 'linear-gradient(105deg,#f52739,#dc1024)', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 40px', fontSize: 40, fontWeight: 700,
      boxShadow: 'inset 0 1px 0 #ffffff30, 0 18px 45px #00000030', ...enter(f, 12, 26)}}>
      Залишити заявку<Icon name="arrow" size={45}/>
    </div>
  </AbsoluteFill>;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cue = plan.captions.find(c => t >= c.start && t < c.end);
  if (!cue) return null;
  return <div style={{position: 'absolute', left: 85, top: 1440, width: 830, zIndex: 20,
    textAlign: 'center', fontSize: 48, fontWeight: 650, letterSpacing: -.9, lineHeight: 1.3,
    textShadow: '0 2px 12px #000', opacity: t < .12 ? 1 : ease((t - cue.start) * 30, 0, 2)}}>
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 12, rowGap: 4}}>
      {cue.word_ids.map(id => {
        const word = wordData.words[id];
        return <span key={id} style={{color: t >= word.start && t < word.end ? C.red : C.white}}>{word.text}</span>;
      })}
    </div>
  </div>;
};

const scenes = [Problem, Waiting, Solution, Case, Offer, Action];
export const BridgeLanding150: React.FC = () => {
  const {fps} = useVideoConfig();
  const mixGain = Math.pow(10, plan.mix_gain_db / 20);
  return <AbsoluteFill className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <Background/>
    <Audio src={staticFile('audio/atmosphere-150.wav')} volume={(f) => (f / fps < 22.6 ? .75 : 1) * mixGain}/>
    <Audio src={staticFile(plan.voiceover)} volume={plan.voiceover_volume * mixGain}/>
    {plan.scenes.map((scene, i) => {
      const Component = scenes[i];
      const from = Math.round(scene.start * fps);
      return <Sequence key={scene.id} from={from} durationInFrames={Math.round(scene.end * fps) - from}><Component/></Sequence>;
    })}
    <OfferDeck/>
    <Brand/>
    <Captions/>
  </AbsoluteFill>;
};
