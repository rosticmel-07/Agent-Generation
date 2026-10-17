import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Icon} from './BridgeReel';
import {ease, enter, useMotionFrame} from './BridgeLanding150';
import {CenteredBackground, CenteredBrand} from './BridgeDirectQuestions';
import plan from '../data/cleaning-premium.json';
import wordData from '../data/words-cleaning-premium.json';
import './two-offers-font.css';

const box = (w = 804): React.CSSProperties => ({position: 'absolute', left: 540 - w / 2, width: w});
const surface: React.CSSProperties = {border: '1px solid #52433f', borderRadius: 30, overflow: 'hidden',
  background: 'linear-gradient(130deg,#242521,#111411)', boxShadow: '0 26px 80px #0006,inset 0 1px 0 #ffffff15'};
const fit = (children: React.ReactNode, style?: React.CSSProperties) => <span data-text-fit style={{display: 'inline-block', whiteSpace: 'nowrap', ...style}}>{children}</span>;

// The existing reference contains two square photos. Only its left, cleaning
// photograph is ever exposed; the original file is preserved unchanged.
const CleaningPhoto: React.FC<{height: number}> = ({height}) => <div style={{position: 'relative', height, width: '100%', overflow: 'hidden', containerType: 'size'}}>
  <div style={{position: 'absolute', width: 'max(100cqw,100cqh)', height: 'max(100cqw,100cqh)', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', overflow: 'hidden'}}>
    <Img src={staticFile('illustrations/photos-choice/cleaning-and-furniture.png')} style={{position: 'absolute', width: '200%', maxWidth: 'none', height: 'auto', left: 0, top: 0}}/>
  </div>
</div>;

const Heading: React.FC<{children: React.ReactNode; size?: number; tracking?: number}> = ({children, size = 96, tracking = -1.4}) => <div
  data-center="heading" className="two-offers-display" style={{...box(), top: 410, textAlign: 'center', fontSize: size, lineHeight: 1.18, letterSpacing: tracking}}>
  {fit(children)}
</div>;

const Questions: React.FC<{f: number; fade?: number}> = ({f, fade = 1}) => <div style={{position: 'absolute', inset: 0, opacity: fade}}>
  <AbsoluteFill style={{background: 'linear-gradient(transparent 35%,#0c100d25 48%,#0c100de8 100%)'}}/>
  {['А кухня входить?', 'А вікна — окремо?'].map((text, i) => <div key={text} style={{position: 'absolute', left: 52, right: 52, top: 460 + i * 128, height: 108,
    border: `1px solid ${i ? '#97424c' : '#ffffff38'}`, borderRadius: 24, background: i ? '#321a20f2' : '#151b17f2',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 700, letterSpacing: -1.1,
    boxShadow: '0 12px 32px #0004', ...enter(f, i ? 43 : 12, 24)}}>{fit(text)}</div>)}
</div>;

const Problem: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Heading>Що входить <span style={{color: C.red}}>у ціну?</span></Heading>
    <div data-center="cleaning-photo" style={{...box(), top: 600, height: 760, ...surface}}>
      <CleaningPhoto height={760}/><Questions f={f}/>
    </div>
  </AbsoluteFill>;
};

const Website: React.FC = () => {
  const f = useMotionFrame();
  const morph = ease(f, 0, 14);
  const focus = Math.sin(Math.PI * ease(f, (5.86 - 3.3) * 30, (6.62 - 3.3) * 30 + 6));
  return <AbsoluteFill>
    <Heading>Поясни це <span style={{color: C.red}}>на сайті</span></Heading>
    <div data-center="service-website" style={{...box(), top: 600, height: 760, ...surface}}>
      <div style={{position: 'relative', height: 760 - 460 * morph, overflow: 'hidden'}}>
        <CleaningPhoto height={760 - 460 * morph}/>
        <AbsoluteFill style={{opacity: morph, background: 'linear-gradient(transparent 20%,#0d110ecf 100%)'}}/>
        <div style={{position: 'absolute', bottom: 27, left: 25, right: 25, fontSize: 54, fontWeight: 750, letterSpacing: -1.8,
          textAlign: 'center', opacity: ease(f, 5, 12)}}>{fit('Прибирання квартири')}</div>
      </div>
      {morph < 1 && <Questions f={99} fade={1 - ease(f, 0, 5)}/>}
      <div style={{position: 'absolute', top: 345, left: 30, right: 30, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 46, fontWeight: 700, letterSpacing: -1.4, ...enter(f, 7, 20)}}>{fit(<>Кухня <span style={{color: C.red}}>•</span> Санвузол <span style={{color: C.red}}>•</span> Підлога</>)}</div>
      <div style={{position: 'absolute', top: 443, left: 30, right: 30, paddingTop: 25, borderTop: '1px solid #ffffff1a',
        textAlign: 'center', fontSize: 46, fontWeight: 650, letterSpacing: -1.6, ...enter(f, 13, 20)}}>
        {fit(<>Миття вікон — <span style={{color: '#ff6b78'}}>додатково</span></>)}
      </div>
      <div style={{position: 'absolute', left: 48, right: 48, top: 600, height: 112, borderRadius: 22, background: 'linear-gradient(105deg,#fa3042,#d91227)',
        boxShadow: `inset 0 1px 0 #ffffff36,0 0 ${20 + focus * 20}px #f32335${focus > .2 ? '30' : '08'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, fontSize: 47, fontWeight: 750, letterSpacing: -1.2,
        ...enter(f, 18, 22)}}>{fit('Запитати вартість')}<Icon name="arrow" size={38}/></div>
    </div>
  </AbsoluteFill>;
};

const Offer: React.FC = () => {
  const f = useMotionFrame();
  const inclusion = ease(f, (10.72 - 8.36) * 30, (10.72 - 8.36) * 30 + 8);
  const payment = ease(f, (12.96 - 8.36) * 30, (12.96 - 8.36) * 30 + 8);
  return <AbsoluteFill>
    <Heading size={76} tracking={-2.5}>Лендінг для <span style={{color: C.red}}>твого бізнесу</span></Heading>
    <div data-center="landing-offer" style={{...box(), top: 600, height: 760, ...surface, borderColor: '#80404a',
      background: 'radial-gradient(ellipse at 50% 0%,#9833453d,transparent 70%),linear-gradient(135deg,#262521,#101510)'}}>
      <div style={{position: 'absolute', top: 0, left: 36, right: 36, height: 320, overflow: 'hidden', textAlign: 'center'}}>
        <span data-fit="price" className="two-offers-display" style={{display: 'inline-flex', alignItems: 'baseline', fontSize: 260,
          lineHeight: 1.2, letterSpacing: -6, color: C.red}}>
          {'$150'.split('').map((letter, i) => <span key={i} style={{display: 'inline-block', ...enter(f, i * 1.5, 120)}}>{letter}</span>)}
        </span>
      </div>
      <div style={{position: 'absolute', top: 327, left: 24, right: 24, height: 85, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderTop: '1px solid #ffffff14', borderBottom: '1px solid #ffffff14', background: `rgba(243,35,53,${.015 + inclusion * .05})`,
        fontSize: 47, fontWeight: 700, letterSpacing: -1.5}}>{fit(<>Дизайн <span style={{color: C.red}}>•</span> Тексти <span style={{color: C.red}}>•</span> Розробка</>)}</div>
      <div style={{position: 'absolute', top: 458, left: 28, right: 28, textAlign: 'center', fontSize: 48, fontWeight: 650,
        lineHeight: 1.35, letterSpacing: -1.5, color: payment ? C.white : '#e2ded7'}}>
        <div>{fit(<>Перші <span style={{color: '#ff5d6d', fontWeight: 800}}>50%</span> — після</>)}</div>
        <div>{fit('затвердження дизайну')}</div>
      </div>
      <div style={{position: 'absolute', top: 655, left: 24, right: 24, textAlign: 'center', fontSize: 44, fontWeight: 600,
        color: '#d4d0c8', letterSpacing: -1.3}}>{fit('Домен і хостинг — окремо')}</div>
    </div>
  </AbsoluteFill>;
};

const Message: React.FC = () => <AbsoluteFill>
  <div data-center="message-title" className="two-offers-display" style={{...box(), top: 657, textAlign: 'center', fontSize: 116, lineHeight: 1.2, letterSpacing: -2.2}}>
    {fit(<>Напиши <span style={{color: C.red}}>«САЙТ»</span></>)}
  </div>
  <div data-center="message-destination" style={{...box(), top: 842, textAlign: 'center', fontSize: 53, fontWeight: 650, letterSpacing: -1.5}}>
    {fit('у приватні повідомлення')}
  </div>
  <div data-center="message-accent" style={{...box(112), top: 980, height: 3, background: C.red, opacity: .65}}/>
</AbsoluteFill>;

const Captions: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cue = plan.captions.find(c => t >= c.start && t < c.end);
  // Once the final title appears, it takes over this identical CTA phrase.
  if (!cue || (cue.kind === 'cta' && t >= plan.scenes[3].start)) return null;
  return <div data-center="captions" className="two-offers-captions" style={{...box(), top: cue.kind === 'audit' ? 1130 : 1430,
    fontSize: 49, lineHeight: 1.3, letterSpacing: -1.7, textAlign: 'center', textShadow: '0 2px 14px #0009', zIndex: 20}}>
    {cue.line_word_ids.map((ids, line) => <div key={line}>{fit(ids.map((id, i) => {
      const word = wordData.words[id];
      const text = cue.kind === 'problem' && id === 2 ? 'питають…' : cue.kind === 'audit' && id === 39 ? 'Та' : word.text;
      return <React.Fragment key={id}>{i > 0 && ' '}<span style={{color: t >= word.start && t < word.end ? C.red : C.white}}>{text}</span></React.Fragment>;
    }))}</div>)}
  </div>;
};

const FontsReady: React.FC = () => {
  React.useLayoutEffect(() => {
    const handle = delayRender('Load full Ukrainian display and body fonts'); let active = true;
    Promise.all([document.fonts.load('700 96px Oswald', 'Що входить у ціну? $150 «САЙТ»'),
      document.fonts.load('700 49px Manrope', 'Клієнти постійно питають'), document.fonts.load('650 53px Manrope', 'у приватні повідомлення')])
      .then(() => {if (active) {active = false; continueRender(handle);}}).catch(cancelRender);
    return () => {if (active) {active = false; continueRender(handle);}};
  }, []); return null;
};

const LayoutCheck: React.FC = () => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {
    const handle = delayRender('Measure premium cleaning layout'); let active = true;
    document.fonts.ready.then(() => {
      if (!active) return;
      const root = document.querySelector('[data-cleaning-premium-root]')!.getBoundingClientRect(); const scale = root.width / 1080;
      const groups = Array.from(document.querySelectorAll('[data-center]')).map(el => {const r = el.getBoundingClientRect();
        return {name: el.getAttribute('data-center'), center_x: (r.left + r.width / 2 - root.left) / scale,
          left: (r.left - root.left) / scale, right: (r.right - root.left) / scale, bottom: (r.bottom - root.top) / scale};});
      const prices = Array.from(document.querySelectorAll('[data-fit]')).map(el => {const r = el.getBoundingClientRect(); const p = el.parentElement!.getBoundingClientRect();
        return {text: el.textContent, width_px: r.width / scale, available_px: p.width / scale, font: getComputedStyle(el).fontFamily};});
      const text_fits = Array.from(document.querySelectorAll('[data-text-fit]')).map(el => {const r = el.getBoundingClientRect(); const p = el.parentElement!.getBoundingClientRect();
        return {text: el.textContent, width_px: r.width / scale, available_px: p.width / scale, font_size_px: parseFloat(getComputedStyle(el).fontSize)};});
      console.log(`CLEANING_PREMIUM_LAYOUT_CHECK=${JSON.stringify({frame, groups, prices, text_fits,
        oswald_loaded: document.fonts.check('700 96px Oswald', 'Що входить у ціну? $150 «САЙТ»')})}`);
      active = false; continueRender(handle);
    }); return () => {if (active) {active = false; continueRender(handle);}};
  }, [frame]); return null;
};

const scenes = [Problem, Website, Offer, Message];
export const BridgeCleaningPremium: React.FC<{checkLayout?: boolean}> = ({checkLayout = false}) => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill data-cleaning-premium-root className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <FontsReady/><CenteredBackground/>
    <Audio src={staticFile(plan.atmosphere)} volume={.8}/>
    <Audio src={staticFile(plan.voiceover)} volume={plan.voiceover_volume}/>
    {plan.scenes.map((s, i) => {const Component = scenes[i]; const from = Math.round(s.start * fps);
      return <Sequence key={s.id} from={from} durationInFrames={Math.round(s.end * fps) - from}><Component/></Sequence>;})}
    <CenteredBrand/><Captions/>{checkLayout && <LayoutCheck/>}
  </AbsoluteFill>;
};
