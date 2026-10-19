import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Icon} from './BridgeReel';
import {ease, enter, useMotionFrame} from './BridgeLanding150';
import {CenteredBrand} from './BridgeDirectQuestions';
import sourcePlan from '../data/auto-service.json';
import './two-offers-font.css';

const plan = sourcePlan as Omit<typeof sourcePlan, 'voiceover' | 'icon' | 'captions'> & {
  voiceover: string | null; icon: string | null;
  captions: Array<{start: number; end: number; lines: string[]}>;
};
const box = (width = 804): React.CSSProperties => ({position: 'absolute', left: 540 - width / 2, width});
const panel: React.CSSProperties = {border: '1px solid #ffffff24', borderRadius: 30, overflow: 'hidden',
  background: 'linear-gradient(140deg,#25272a,#101114 70%)', boxShadow: 'inset 0 1px 0 #ffffff23,0 30px 90px #0009'};
const fit = (text: React.ReactNode) => <span data-auto-fit style={{display: 'inline-block', whiteSpace: 'nowrap'}}>{text}</span>;

const Backdrop: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill style={{background: '#08090b'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 53%,#6f17272c,transparent 60%)'}}/>
    <div style={{position: 'absolute', inset: '580px -300px -400px', transform: 'perspective(700px) rotateX(62deg)',
      backgroundImage: 'linear-gradient(#ffffff08 1px,transparent 1px),linear-gradient(90deg,#ffffff08 1px,transparent 1px)',
      backgroundSize: '100px 100px', maskImage: 'radial-gradient(ellipse,#0007,transparent 65%)'}}/>
    {Array.from({length: 18}, (_, i) => <div key={i} style={{position: 'absolute', left: 120 + ((i * 137) % 840),
      top: 290 + ((i * 173 - f * (i % 3 + 1) * .3 + 16000) % 1280), width: i % 3 ? 3 : 5, height: i % 3 ? 3 : 5,
      borderRadius: '50%', background: i % 4 ? '#fff' : C.red, opacity: .07 + i % 3 * .025}}/>)}
  </AbsoluteFill>;
};

const Title: React.FC<{lines: string[]; accent?: number; size?: number; immediate?: boolean}> = ({lines, accent = 1, size = 106, immediate = false}) => {
  const f = useMotionFrame();
  return <div data-auto-center="title" className="two-offers-display" style={{...box(), top: 318, fontSize: size, lineHeight: 1.12, letterSpacing: -1.7, textAlign: 'center'}}>
    {lines.map((line, i) => <div key={line} style={{overflow: 'hidden', paddingBottom: 7}}><div style={{color: i === accent ? C.red : C.white,
      ...(immediate ? {} : enter(f, i * 1.5, 24))}}>{fit(line)}</div></div>)}
  </div>;
};

const BridgeTile: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => <div style={{width: size, height: size,
  borderRadius: size * .23, background: 'linear-gradient(135deg,#3a3c40,#08090b 45%)', border: '1px solid #ffffff29',
  boxShadow: 'inset 0 2px 2px #ffffff25,0 10px 40px #0009,0 0 50px #f3233518', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', ...style}}>
  <Img src={staticFile(plan.icon || 'brand/logo.png')} style={{width: plan.icon ? '100%' : '84%', height: plan.icon ? '100%' : '60%', objectFit: 'contain'}}/>
</div>;

const CarPhoto: React.FC = () => {
  const f = useMotionFrame();
  return <Img src={staticFile('illustrations/auto-service/diagnostics.png')} style={{width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: '50% 48%', transform: `scale(${1 + ease(f, 0, 110) * .035})`}}/>;
};

const Hook: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill><Title immediate lines={['Ти під авто.', 'Клієнт чекає?']}/>
    <div data-auto-center="workshop" style={{...box(), top: 620, height: 760, ...panel}}>
      <AbsoluteFill><CarPhoto/><AbsoluteFill style={{background: 'linear-gradient(transparent 43%,#090b0dbf 65%,#090b0dfa 100%)'}}/></AbsoluteFill>
      <div style={{position: 'absolute', left: 40, right: 40, top: 458, paddingTop: 0,
        textAlign: 'center', fontSize: 49, lineHeight: 1.28, fontWeight: 750}}>{fit('Скільки коштує')}<br/>{fit('діагностика?')}</div>
      <div style={{position: 'absolute', left: 56, right: 56, bottom: 40, borderRadius: 20, padding: '21px 12px', textAlign: 'center',
        border: '1px solid #8b3c48', background: '#f3233511', fontSize: 44, fontWeight: 650, ...enter(f, 34, 18)}}>{fit('Коли можна під’їхати?')}</div>
    </div>
  </AbsoluteFill>;
};

const Questions: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill><Title lines={['Запити в чатах.', 'Робота — у тебе.']} size={97}/>
    <div data-auto-center="messages" style={{...box(), top: 650, height: 700}}>
      {['Яка вартість?', 'Які послуги є?', 'Як записатися?'].map((text, i) => <div key={text} style={{...panel, position: 'absolute', left: 0, right: 0,
        top: i * 220, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 25, fontSize: 58, fontWeight: 750,
        ...enter(f, i * 4, 22)}}><Icon name="message" size={46} color={C.red}/>{fit(text)}</div>)}
    </div>
  </AbsoluteFill>;
};

const Website: React.FC = () => {
  const f = useMotionFrame();
  const detailed = ease(f, 35, 49);
  return <AbsoluteFill><Title lines={['Послуги — на сайті.', 'Запит — поруч.']} size={95}/>
    <div data-auto-center="website" style={{...box(), top: 610, height: 790, ...panel,
      transform: `perspective(2200px) rotateY(${(1 - ease(f, 0, 18)) * 5}deg)`}}>
      <div style={{height: 65, background: '#ffffff07', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
        {[0, 1, 2].map(i => <span key={i} style={{width: 9, height: 9, borderRadius: '50%', background: i ? '#74757a' : C.red}}/>)}</div>
      <div style={{height: 190, margin: '0 25px'}}><CarPhoto/></div>
      <div style={{textAlign: 'center', fontSize: 58, fontWeight: 800, letterSpacing: -2}}>{fit('Твій автосервіс')}</div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 14, marginTop: 25, fontSize: 39, fontWeight: 650, opacity: detailed}}>
        {['Послуги', 'Про нас', 'Контакти'].map(t => <span key={t} style={{padding: '12px 18px', border: '1px solid #ffffff24', borderRadius: 13}}>{t}</span>)}</div>
      <div style={{position: 'absolute', top: 465, left: 36, right: 36, fontSize: 47, fontWeight: 650, textAlign: 'center', letterSpacing: -1.2}}>
        <div>{fit('Діагностика • Ремонт')}</div><div style={{marginTop: 16, color: '#c7c8ca'}}>{fit('Обслуговування авто')}</div>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, bottom: 40, height: 110, borderRadius: 22, background: C.red,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 49, fontWeight: 750}}>{fit('Залишити запит')}<Icon name="arrow" size={38}/></div>
    </div>
  </AbsoluteFill>;
};

const Bot: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill><Title lines={['Звернення — в боті.', 'Без плутанини.']} size={95}/>
    <div data-auto-center="telegram" style={{...box(), top: 610, height: 790, ...panel, borderRadius: 44, borderWidth: 5,
      transform: `perspective(2200px) rotateY(${(1 - ease(f, 0, 18)) * -5}deg)`}}>
      <div style={{height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, borderBottom: '1px solid #ffffff20', fontSize: 45, fontWeight: 750}}>
        <Icon name="message" size={42} color={C.red}/>{fit('Бот автосервісу')}</div>
      {['Що потрібно перевірити?', 'Діагностика авто', 'Залиш номер для зв’язку'].map((text, i) => <div key={text} style={{position: 'absolute', left: 32, right: 32,
        top: 163 + i * 166, height: 128, borderRadius: 23, border: `1px solid ${i === 1 ? '#9b3b4b' : '#ffffff20'}`, background: i === 1 ? '#431b26' : '#1d2025',
        fontSize: 44, fontWeight: 650, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: -1.5, ...enter(f, 5 + i * 13, 22)}}>{fit(text)}</div>)}
      <div style={{position: 'absolute', bottom: 27, left: 32, right: 32, height: 72, border: '1px solid #ffffff20', borderRadius: 36,
        display: 'flex', alignItems: 'center', paddingLeft: 28, fontSize: 37, color: '#9b9ea5', ...enter(f, 44, 18)}}>+380…</div>
    </div>
  </AbsoluteFill>;
};

const Services: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill><Title lines={['Рішення під задачу.', 'Твій бізнес — у центрі.']} size={85}/>
    <div data-auto-center="services" style={{...box(), top: 610, height: 790}}>
      <svg width="804" height="790" style={{position: 'absolute', inset: 0}}><path d="M196 168H402V622H608M608 168H402M196 622H402" stroke={C.red} strokeWidth="3" fill="none" opacity=".5"/></svg>
      {plan.services.map((service, i) => <div key={service.id} style={{...panel, position: 'absolute', left: i % 2 * 426, top: Math.floor(i / 2) * 440,
        width: 378, height: 350, paddingTop: 46, textAlign: 'center', ...enter(f, i * 3, 24)}}>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 35}}><Icon name={(['grid', 'site', 'message', 'arrow'] as const)[i]} size={62} color={C.red}/></div>
        <div className="two-offers-display" style={{fontSize: 53, lineHeight: 1.18, letterSpacing: -.9}}>{service.title.map(t => <div key={t}>{fit(t)}</div>)}</div>
      </div>)}
      <BridgeTile size={106} style={{position: 'absolute', left: 349, top: 342}}/>
    </div>
  </AbsoluteFill>;
};

const Route: React.FC = () => {
  const f = useMotionFrame();
  const progress = ease(f, 0, 130);
  return <AbsoluteFill><Title lines={['Одна заявка.', 'Зрозумілий шлях.']} size={103}/>
    <div data-auto-center="request-route" style={{...box(), top: 640, height: 750}}>
      <svg width="804" height="750" style={{position: 'absolute', inset: 0}}><path d="M402 80V650" stroke="#ffffff20" strokeWidth="4"/>
        <path d="M402 80V650" stroke={C.red} strokeWidth="4" strokeDasharray="570" strokeDashoffset={570 * (1 - progress)}/>
        <circle cx="402" cy={80 + progress * 570} r="12" fill={C.red}/></svg>
      {['Реклама', 'Сайт із послугами', 'Звернення в Telegram'].map((label, i) => <div key={label} style={{...panel, position: 'absolute', left: 0, right: 0,
        top: i * 270, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, letterSpacing: -1.7,
        fontWeight: 750, borderColor: progress * 2 >= i ? '#a04452' : '#ffffff24', ...enter(f, i * 8, 18)}}>{fit(label)}</div>)}
    </div>
  </AbsoluteFill>;
};

const Message: React.FC = () => <AbsoluteFill>
  <div data-auto-center="final-icon" style={{...box(180), top: 415, height: 180}}><BridgeTile size={180}/></div>
  <div data-auto-center="cta" className="two-offers-display" style={{...box(), top: 770, fontSize: 118, textAlign: 'center', letterSpacing: -2.8}}>{fit(<>Напиши <span style={{color: C.red}}>«СТО»</span></>)}</div>
  <div data-auto-center="cta-place" style={{...box(), top: 960, fontSize: 52, fontWeight: 650, letterSpacing: -1.5, textAlign: 'center'}}>{fit('у приватні повідомлення')}</div>
  <div data-auto-center="cta-reason" style={{...box(), top: 1160, fontSize: 47, fontWeight: 600, color: '#c7c8ce', textAlign: 'center', lineHeight: 1.35}}>
    {fit('Підберемо рішення')}<br/>{fit('для твого бізнесу')}</div>
</AbsoluteFill>;

const Fonts: React.FC = () => {
  React.useLayoutEffect(() => {const h = delayRender('Load Ukrainian fonts'); let active = true;
    Promise.all([document.fonts.load('700 106px Oswald', 'Ти під авто. Клієнт чекає?'), document.fonts.load('750 49px Manrope', 'Запис Послуги Звернення')])
      .then(() => {if (active) {active = false; continueRender(h);}}).catch(cancelRender);
    return () => {if (active) {active = false; continueRender(h);}};
  }, []); return null;
};

const Check: React.FC = () => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {const h = delayRender('Check auto-service text'); let active = true;
    document.fonts.ready.then(() => {if (!active) return;
      const root = document.querySelector('[data-auto-root]')!.getBoundingClientRect(); const scale = root.width / 1080;
      const groups = Array.from(document.querySelectorAll('[data-auto-center]')).map(e => {const r = e.getBoundingClientRect();return {name: e.getAttribute('data-auto-center'),
        left: (r.left - root.left) / scale, right: (r.right - root.left) / scale, bottom: (r.bottom - root.top) / scale, center: (r.left + r.width / 2 - root.left) / scale};});
      const text = Array.from(document.querySelectorAll('[data-auto-fit]')).map(e => ({text: e.textContent, width: e.getBoundingClientRect().width / scale,
        available: e.parentElement!.getBoundingClientRect().width / scale}));
      console.log(`AUTO_LAYOUT=${JSON.stringify({frame, groups, text, fonts: document.fonts.check('700 106px Oswald', 'Клієнт')})}`);
      active = false; continueRender(h);
    });return () => {if (active) {active = false; continueRender(h);}};
  }, [frame]); return null;
};

const scenes = [Hook, Questions, Website, Bot, Services, Route, Message];
export const BridgeAutoService: React.FC<{checkLayout?: boolean}> = ({checkLayout = false}) => {
  const {fps} = useVideoConfig(); const t = useCurrentFrame() / fps;
  const caption = plan.captions.find(c => t >= c.start && t < c.end);
  return <AbsoluteFill data-auto-root className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <Fonts/><Backdrop/>{plan.voiceover && <Audio src={staticFile(plan.voiceover)}/>}
    {plan.scenes.map((s, i) => {const Scene = scenes[i]; const from = Math.round(s.start * fps); return <Sequence key={s.id} from={from}
      durationInFrames={Math.round(s.end * fps) - from}><Scene/></Sequence>;})}
    <CenteredBrand/>
    {caption && <div data-auto-center="captions" style={{...box(), top: 1450, fontSize: 48, fontWeight: 700, textAlign: 'center', lineHeight: 1.3}}>
      {caption.lines.map(line => <div key={line}>{fit(line)}</div>)}</div>}
    {checkLayout && <Check/>}
  </AbsoluteFill>;
};
