import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Icon} from './BridgeReel';
import {ease, enter, useMotionFrame} from './BridgeLanding150';
import {CenteredBackground, CenteredBrand} from './BridgeDirectQuestions';
import plan from '../data/cleaning.json';
import words from '../data/words-cleaning.json';
import './two-offers-font.css';

const box = (width = 760): React.CSSProperties => ({position: 'absolute', left: 540 - width / 2, width});
const surface: React.CSSProperties = {background: 'linear-gradient(130deg,#242821,#101511)', border: '1px solid #41473c',
  borderRadius: 28, overflow: 'hidden', boxShadow: '0 22px 60px #0004,inset 0 1px 0 #ffffff10'};

// Only the cleaning half is ever visible; the previous furniture example is excluded.
const CleaningPhoto: React.FC<{label?: boolean; style?: React.CSSProperties}> = ({label = false, style}) => <div style={{position: 'relative', overflow: 'hidden', containerType: 'size', ...style}}>
  <div style={{position: 'absolute', width: 'max(100cqw,100cqh)', height: 'max(100cqw,100cqh)', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', overflow: 'hidden'}}>
    <Img src={staticFile('illustrations/photos-choice/cleaning-and-furniture.png')} style={{position: 'absolute', width: '200%', maxWidth: 'none', height: 'auto', left: 0, top: 0}}/>
  </div>
  {label && <>
    <AbsoluteFill style={{background: 'linear-gradient(transparent 30%,#090b0be8)'}}/>
    <div style={{position: 'absolute', left: 15, right: 15, bottom: 20, textAlign: 'center', fontSize: 48, lineHeight: 1.2, fontWeight: 750, letterSpacing: -1}}>Прибирання квартири</div>
  </>}
</div>;

const Heading: React.FC<{lines: string[]; size?: number; immediate?: boolean; accentLast?: boolean; top?: number}> =
  ({lines, size = 88, immediate = false, accentLast = true, top = 300}) => {
    const f = useMotionFrame();
    return <div data-center="heading" className="two-offers-display" style={{...box(), top, fontSize: size, lineHeight: 1.12, textAlign: 'center', letterSpacing: -.7}}>
      {lines.map((text, i) => <div key={text} style={{overflow: 'hidden', paddingBottom: 5}}>
        <div style={{color: accentLast && i === lines.length - 1 ? C.red : C.white, ...(immediate ? {} : enter(f, i * 1.5, 20))}}>
          <span data-text-fit style={{display: 'inline-block'}}>{text}</span>
        </div>
      </div>)}
    </div>;
  };

const Problem: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Heading immediate size={80} lines={['Клієнти постійно', 'питають:', '«Що входить у ціну?»']}/>
    <div data-center="cleaning-photo" style={{...box(), top: 620, height: 330, ...surface}}><CleaningPhoto style={{height: '100%'}}/></div>
    {['А кухня входить?', 'А вікна — окремо?'].map((text, i) => <div data-center={`question-${i}`} key={text}
      style={{...box(700), top: 982 + i * 116, height: 98, border: '1px solid #6c3b43', background: 'linear-gradient(110deg,#2b2021,#171918)',
        borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, fontWeight: 650,
        ...enter(f, i ? 48 : 19, 20)}}><span data-text-fit>{text}</span></div>)}
  </AbsoluteFill>;
};

const Service: React.FC = () => {
  const f = useMotionFrame(); const move = ease(f, 0, 10);
  return <AbsoluteFill>
    <Heading lines={['Покажи на сайті', 'склад послуги']}/>
    <div data-center="service-composition" style={{...box(), top: 566, height: 720}}>
      <div style={{...surface, position: 'absolute', width: '100%', top: 54 * (1 - move), height: 330 - 30 * move}}>
        <CleaningPhoto label style={{height: '100%'}}/>
      </div>
      <div style={{position: 'absolute', top: 326, width: '100%', display: 'flex', flexDirection: 'column', gap: 14}}>
        {['Кухня', 'Санвузол', 'Підлога'].map((text, i) => <div key={text} style={{height: 82, display: 'flex', alignItems: 'center', gap: 22,
          borderBottom: '1px solid #42483c', padding: '0 26px', borderRadius: 16, background: 'linear-gradient(90deg,#2a2f2480,transparent)',
          fontSize: 48, lineHeight: 1.2, fontWeight: 650, ...enter(f, 10 + i * 5, 18)}}><Icon name="check" size={32} color={C.red}/>{text}</div>)}
      </div>
      <div style={{position: 'absolute', width: '100%', top: 635, textAlign: 'center', fontSize: 44, lineHeight: 1.3, fontWeight: 650,
        ...enter(f, 29, 16)}}><span data-text-fit>Миття вікон — <span style={{color: C.red}}>додатково</span></span></div>
    </div>
    <div data-center="example-label" style={{...box(), top: 1310, fontSize: 42, lineHeight: 1.25, textAlign: 'center', color: '#c0c6ba', ...enter(f, 15, 12)}}>Приклад структури</div>
  </AbsoluteFill>;
};

const Website: React.FC = () => {
  const f = useMotionFrame();
  const shell = ease(f, 0, 8);
  const openAt = (plan.form_open - plan.scenes[2].start) * 30;
  const open = ease(f, openAt, openAt + 8);
  const press = Math.sin(Math.PI * ease(f, openAt - 3, openAt + 3));
  return <AbsoluteFill>
    <Heading lines={['Умови зрозумілі.', 'Заявка — поруч']}/>
    <div data-center="mobile-page-form" style={{...box(), top: 566, height: 756, ...surface}}>
      <div style={{height: 54 * shell, opacity: shell, overflow: 'hidden', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#2b3027', fontSize: 42, fontWeight: 650}}>Приклад сторінки</div>
      <div style={{opacity: 1 - open}}>
        <CleaningPhoto label style={{height: 300 - 70 * shell}}/>
        <div style={{position: 'absolute', left: 28, right: 28, top: 326 - 20 * shell}}>
          {['Кухня', 'Санвузол', 'Підлога'].map(text => <div key={text} style={{height: 82 - 14 * shell, marginBottom: 14 * (1 - shell), display: 'flex', gap: 20, alignItems: 'center',
            fontSize: 48 - 4 * shell, fontWeight: 650, borderBottom: '1px solid #41493b'}}><Icon name="check" size={27} color={C.red}/>{text}</div>)}
          <div style={{fontSize: 42, lineHeight: 1.3, fontWeight: 650, marginTop: 26, textAlign: 'center'}}>Миття вікон — додатково</div>
        </div>
        <div style={{position: 'absolute', left: 28, right: 28, top: 632, height: 94, borderRadius: 47, background: C.red,
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, fontSize: 46, fontWeight: 700,
          opacity: ease(f, 1, 6), transform: `scale(${1 - .025 * press})`}}>Запитати вартість<Icon name="arrow" size={33}/></div>
        <div style={{position: 'absolute', top: 674 - 22 * ease(f, 4, openAt), left: 603 - 30 * ease(f, 4, openAt), opacity: ease(f, 2, 7), filter: 'drop-shadow(0 3px 7px #0009)'}}><Icon name="cursor" size={45}/></div>
      </div>
      <div style={{position: 'absolute', top: 54, bottom: 0, left: 0, right: 0, padding: '37px 28px', background: 'linear-gradient(130deg,#252b22,#111812)',
        opacity: open, transform: `translateY(${(1 - open) * 28}px)`}}>
        <div style={{fontSize: 52, lineHeight: 1.2, fontWeight: 750, textAlign: 'center', letterSpacing: -1}}>Запитати вартість</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24, marginTop: 49}}>
          {['Ім’я', 'Телефон', 'Площа квартири, м²'].map(text => <div key={text} style={{height: 108, display: 'flex', alignItems: 'center',
            padding: '0 25px', border: '1px solid #66705b', background: '#0e150fcc', borderRadius: 18,
            fontSize: 46, fontWeight: 600, color: '#e6e9df'}}>{text}</div>)}
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};

const Offer: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Heading immediate accentLast={false} lines={['Лендінг', 'для клінінгу']}/>
    <div data-center="offer-price" style={{...box(), top: 540, height: 280, ...surface, borderColor: '#7b3e48',
      background: 'radial-gradient(ellipse at 50% 0%,#71313c3d,transparent 80%),linear-gradient(125deg,#292721,#111612)', textAlign: 'center'}}>
      <div style={{position: 'absolute', left: 20, right: 20, top: 3, overflow: 'hidden'}}>
        <span data-fit="price" className="two-offers-display" style={{display: 'inline-block', fontSize: 224, lineHeight: 1.16, letterSpacing: -4, color: C.red, ...enter(f, 0, 38)}}>$150</span>
      </div>
    </div>
    <div data-center="included-services" style={{...box(), top: 864, fontSize: 48, fontWeight: 650, lineHeight: 1.3, textAlign: 'center', ...enter(f, 3, 12)}}>
      <span data-text-fit>Дизайн • Тексти • Розробка</span>
    </div>
    <div data-center="payment-terms" style={{...box(), top: 998, fontSize: 48, fontWeight: 650, lineHeight: 1.3, textAlign: 'center', ...enter(f, 5, 12)}}>
      <span data-text-fit style={{display: 'inline-block'}}>Перші <span style={{color: C.red}}>50%</span> — після</span><br/><span data-text-fit style={{display: 'inline-block'}}>затвердження дизайну</span>
    </div>
    <div data-center="domain-hosting-terms" style={{...box(), top: 1205, fontSize: 48, fontWeight: 650, lineHeight: 1.3, textAlign: 'center', color: C.white, ...enter(f, 7, 12)}}>
      <span data-text-fit style={{display: 'inline-block'}}>Домен і хостинг</span><br/><span data-text-fit style={{display: 'inline-block'}}>оплачуються окремо</span>
    </div>
  </AbsoluteFill>;
};

const Message: React.FC = () => <AbsoluteFill>
  <div data-center="message-action" className="two-offers-display" style={{...box(), top: 540, fontSize: 94, lineHeight: 1.17, textAlign: 'center', letterSpacing: -.9}}>
    <span data-text-fit style={{display: 'inline-block'}}>Напиши <span style={{color: C.red}}>«САЙТ»</span></span><br/>
    <span data-text-fit style={{display: 'inline-block'}}>у приватні</span><br/>
    <span data-text-fit style={{display: 'inline-block'}}>повідомлення</span>
  </div>
  <div data-center="project-discussion" style={{...box(), top: 1070, fontSize: 48, fontWeight: 650, lineHeight: 1.3, textAlign: 'center'}}>
    <span data-text-fit>Обговоримо твій проєкт</span>
  </div>
</AbsoluteFill>;

const Captions: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cue = plan.captions.find(c => t >= c.start && t < c.end);
  if (!cue) return null;
  return <div data-center="captions" className="two-offers-captions" style={{...box(), top: 1440, fontSize: 46, lineHeight: 1.25,
    textAlign: 'center', letterSpacing: -.6, textShadow: '0 2px 10px #000', zIndex: 20, opacity: ease((t - cue.start) * 30, 0, 1.5)}}>
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 12, rowGap: 4}}>{cue.word_ids.map(id => {
      const w = words.words[id]; return <span key={id} style={{color: t >= w.start && t < w.end ? C.red : C.white}}>{w.text}</span>;
    })}</div>
  </div>;
};

const FontsReady: React.FC = () => {
  React.useLayoutEffect(() => {
    const h = delayRender('Load cleaning-ad typography'); let active = true;
    Promise.all([document.fonts.load('700 94px Oswald', 'Клієнти Що входить у ціну? Напиши САЙТ'), document.fonts.load('700 224px Oswald', '$150'),
      document.fonts.load('650 48px Manrope', 'Домен і хостинг оплачуються окремо')]).then(() => {if (active) {active = false; continueRender(h);}}).catch(cancelRender);
    return () => {if (active) {active = false; continueRender(h);}};
  }, []); return null;
};

const LayoutCheck: React.FC = () => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {
    const h = delayRender('Check cleaning safe areas'); let active = true;
    document.fonts.ready.then(() => {
      if (!active) return;
      const root = document.querySelector('[data-cleaning-root]')!.getBoundingClientRect(); const scale = root.width / 1080;
      const groups = Array.from(document.querySelectorAll('[data-center]')).map(el => {const r = el.getBoundingClientRect();
        return {name: el.getAttribute('data-center'), center_x: (r.left + r.width / 2 - root.left) / scale, left: (r.left - root.left) / scale, right: (r.right - root.left) / scale, bottom: (r.bottom - root.top) / scale};});
      const prices = Array.from(document.querySelectorAll('[data-fit]')).map(el => {const r = el.getBoundingClientRect(); const p = el.parentElement!.getBoundingClientRect();
        return {text: el.textContent, width_px: r.width / scale, available_px: p.width / scale, font: getComputedStyle(el).fontFamily};});
      const text_samples = Array.from(document.querySelectorAll('[data-text-fit]')).map(el => ({text: el.textContent, width_px: el.getBoundingClientRect().width / scale, font_size: getComputedStyle(el).fontSize}));
      console.log(`CLEANING_LAYOUT_CHECK=${JSON.stringify({frame, groups, prices, text_samples, oswald_loaded: document.fonts.check('700 94px Oswald', 'Клієнти САЙТ $150')})}`);
      active = false; continueRender(h);
    }); return () => {if (active) {active = false; continueRender(h);}};
  }, [frame]); return null;
};

const scenes = [Problem, Service, Website, Offer, Message];
export const BridgeCleaning: React.FC<{checkLayout?: boolean}> = ({checkLayout = false}) => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill data-cleaning-root className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <FontsReady/><CenteredBackground/>
    <Audio src={staticFile(plan.atmosphere)} volume={f => f / fps < plan.voice_end ? .7 : .9}/>
    <Audio src={staticFile(plan.voiceover)} volume={plan.voiceover_volume}/>
    {plan.scenes.map((s, i) => {const Component = scenes[i]; const from = Math.round(s.start * fps);
      return <Sequence key={s.id} from={from} durationInFrames={Math.round(s.end * fps) - from}><Component/></Sequence>;})}
    <CenteredBrand/><Captions/>{checkLayout && <LayoutCheck/>}
  </AbsoluteFill>;
};
