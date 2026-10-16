import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Icon} from './BridgeReel';
import {ease, enter, useMotionFrame} from './BridgeLanding150';
import {CenteredBackground, CenteredBrand} from './BridgeDirectQuestions';
import plan from '../data/photos-choice.json';
import wordData from '../data/words-photos-choice.json';
import './two-offers-font.css';

const box = (w = 804): React.CSSProperties => ({position: 'absolute', left: 540 - w / 2, width: w});
const surface: React.CSSProperties = {border: '1px solid #44433e', borderRadius: 30,
  background: 'linear-gradient(130deg,#262923,#111612)', overflow: 'hidden', boxShadow: '0 25px 70px #0005, inset 0 1px 0 #ffffff13'};
type Kind = 'service' | 'product';

// Preserve the generated source asset. CSS selects one square from the diptych.
const Photo: React.FC<{kind: Kind; label?: string; style?: React.CSSProperties}> = ({kind, label, style}) => <div style={{position: 'relative', overflow: 'hidden', containerType: 'size', ...style}}>
  <div style={{position: 'absolute', width: 'max(100cqw,100cqh)', height: 'max(100cqw,100cqh)',
    left: '50%', top: '50%', transform: 'translate(-50%,-50%)', overflow: 'hidden'}}>
    <Img src={staticFile('illustrations/photos-choice/cleaning-and-furniture.png')} style={{position: 'absolute', width: '200%', maxWidth: 'none', height: 'auto',
      left: kind === 'service' ? 0 : '-100%', top: 0}}/>
  </div>
  {label && <>
    <AbsoluteFill style={{background: 'linear-gradient(transparent 42%,#090b0be8)'}}/>
    <div style={{position: 'absolute', left: 20, right: 20, bottom: 24, fontSize: 43, fontWeight: 750,
      textAlign: 'center', letterSpacing: -1, lineHeight: 1.15, textShadow: '0 2px 12px #0008'}}>{label}</div>
  </>}
</div>;

const Heading: React.FC<{lines: [string, string]; immediate?: boolean; size?: number}> = ({lines, immediate, size = 96}) => {
  const f = useMotionFrame();
  return <div data-center="heading" className="two-offers-display" style={{...box(), top: 326,
    fontSize: size, lineHeight: 1.12, textAlign: 'center', letterSpacing: -1.2}}>
    {lines.map((line, i) => <div key={line} style={{overflow: 'hidden', paddingBottom: 7}}>
      <div style={{color: i ? C.red : C.white, ...(immediate ? {} : enter(f, i * 2, 28))}}>{line}</div>
    </div>)}
  </div>;
};

const Choice: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Heading immediate lines={['Фото є.', 'А що обрати?']} size={104}/>
    <div data-center="photo-pair" style={{...box(), top: 610, height: 550, display: 'flex', gap: 24}}>
      {(['service', 'product'] as const).map((kind, i) => <div key={kind} style={{...surface, width: 390, height: 550,
        transform: `translateY(${-ease(f, 0, 42) * 10}px)`}}>
        <Photo kind={kind} label={i ? 'Товари' : 'Послуги'} style={{width: '100%', height: '100%'}}/>
      </div>)}
    </div>
    <div data-center="choice-question" style={{...box(700), top: 1210, height: 102, borderRadius: 51,
      border: '1px solid #8e3d49', background: '#221719', color: C.white, fontSize: 43, fontWeight: 650,
      display: 'flex', justifyContent: 'center', alignItems: 'center', ...enter(f, 31, 24)}}>
      Що мені підходить<span style={{color: C.red}}>?</span>
    </div>
  </AbsoluteFill>;
};

const Services: React.FC = () => {
  const f = useMotionFrame();
  const expand = ease(f, 0, 12);
  return <AbsoluteFill>
    <Heading lines={['Що входить', 'у послугу?']}/>
    <div data-center="service-example" style={{...box(), top: 610, height: 700}}>
      <div style={{...surface, position: 'absolute', left: 0, top: 0, width: 390 + 414 * expand, height: 550 - 216 * expand}}>
        <Photo kind="service" label="Прибирання квартири" style={{height: '100%'}}/>
      </div>
      {expand < 1 && <div style={{...surface, position: 'absolute', left: 414 + expand * 470, top: 0, width: 390, height: 550, opacity: 1 - expand}}>
        <Photo kind="product" label="Товари" style={{height: '100%'}}/>
      </div>}
      <div style={{position: 'absolute', top: 360, width: '100%', display: 'flex', flexDirection: 'column', gap: 14}}>
        {['Кухня', 'Санвузол', 'Підлога'].map((label, i) => <div key={label} style={{height: 96,
          borderBottom: '1px solid #43453b', display: 'flex', alignItems: 'center', padding: '0 36px', gap: 24,
          fontSize: 43, fontWeight: 650, background: 'linear-gradient(90deg,#272b2280,transparent)', borderRadius: 18,
          ...enter(f, 13 + i * 7, 24)}}>
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48,
            borderRadius: '50%', background: '#f3233517'}}><Icon name="check" size={28} color={C.red}/></span>{label}
        </div>)}
      </div>
    </div>
  </AbsoluteFill>;
};

const ProductRows: React.FC<{f: number}> = ({f}) => <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
  {['Матеріал', 'Розмір', 'Доставка'].map((label, i) => <div key={label} style={{height: 96, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 29px', borderRadius: 18, border: '1px solid #40443b', background: 'linear-gradient(110deg,#242a22,#131a15)', ...enter(f, 10 + i * 7, 22)}}>
    <span style={{fontSize: 41, fontWeight: 650}}>{label}</span>
    {i === 0 ? <div style={{display: 'flex', gap: 12}}>{['#c7b99d', '#7a7465', '#434840'].map((color, n) => <span key={color}
      style={{display: 'block', width: 48, height: 48, background: color, borderRadius: '50%', border: `3px solid ${n === 0 ? C.red : '#ffffff18'}`, boxShadow: n === 0 ? '0 0 0 4px #f3233515' : 'none'}}/>)}</div>
      : <span style={{fontSize: 34, color: '#c3c7bb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 14}}>{i === 1 ? 'Під замовлення' : 'Умови'}<Icon name="arrow" color={C.red} size={29}/></span>}
  </div>)}
</div>;

const Products: React.FC = () => {
  const f = useMotionFrame();
  const move = ease(f, 0, 11);
  return <AbsoluteFill>
    <Heading lines={['Варіанти.', 'Умови замовлення.']} size={89}/>
    <div data-center="product-example" style={{...box(), top: 610, height: 700, overflow: 'hidden'}}>
      {move < 1 && <div style={{...surface, position: 'absolute', left: -move * 840, width: 804, height: 334, opacity: 1 - move}}>
        <Photo kind="service" label="Прибирання квартири" style={{height: '100%'}}/>
      </div>}
      <div style={{...surface, position: 'absolute', left: (1 - move) * 840, width: 804, height: 334}}>
        <Photo kind="product" label="Меблі на замовлення" style={{height: '100%'}}/>
      </div>
      <div style={{position: 'absolute', top: 360, width: '100%'}}><ProductRows f={f}/></div>
    </div>
  </AbsoluteFill>;
};

const Adaptation: React.FC = () => {
  const f = useMotionFrame();
  const shell = ease(f, 0, 12);
  const service = f < 33;
  // Two large tabs show the same page adapted to the two example businesses.
  const kind = service ? 'service' : 'product';
  return <AbsoluteFill>
    <Heading lines={['Твій бізнес.', 'Твій сайт.']}/>
    <div data-center="adapted-website" style={{...box(), top: 610, height: 334 + shell * 366, ...surface}}>
      <div style={{height: 54 * shell, opacity: shell, background: '#2c3028', display: 'flex', gap: 8, paddingLeft: 26, alignItems: 'center'}}>
        {[0, 1, 2].map(n => <span key={n} style={{width: 8, height: 8, borderRadius: '50%', background: '#8e9486'}}/>)}
      </div>
      <div style={{height: 76 * shell, opacity: shell, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
        {['Послуги', 'Товари'].map((text, i) => <div key={text} style={{width: 210, textAlign: 'center', padding: '10px 20px', borderRadius: 28,
          fontSize: 31, fontWeight: 700, background: (i === 0) === service ? C.red : '#2a3027', color: C.white}}>{text}</div>)}
      </div>
      <Photo kind={kind} style={{height: 334 - 44 * shell, width: '100%'}}/>
      <div style={{padding: '24px 28px', textAlign: 'center', opacity: shell}}>
        <div style={{fontSize: 43, fontWeight: 750, letterSpacing: -1, lineHeight: 1.14}}>{service ? 'Прибирання квартири' : 'Меблі на замовлення'}</div>
        <div style={{fontSize: 33, color: '#bac2b2', fontWeight: 600, marginTop: 13}}>{service ? 'Кухня • Санвузол • Підлога' : 'Матеріал • Розмір • Доставка'}</div>
        <div style={{height: 78, background: C.red, borderRadius: 39, marginTop: 24, fontSize: 33,
          fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18}}>
          {service ? 'Замовити прибирання' : 'Обговорити замовлення'}<Icon name="arrow" size={31}/>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};

const OfferTitle: React.FC = () => <Heading immediate size={91} lines={['Твоя пропозиція.', 'Твій лендінг.']}/>;

const Offer: React.FC = () => {
  const f = useMotionFrame();
  const compact = ease(f, (plan.scenes[5].start - plan.scenes[4].start) * 30,
    (plan.scenes[5].start - plan.scenes[4].start) * 30 + 13);
  return <div data-center="price-card" style={{...box(), top: 610 - 260 * compact, height: 528 - 232 * compact,
    ...surface, borderColor: '#7f3c46', background: 'radial-gradient(ellipse at 50% 10%,#742b3650,transparent 75%),linear-gradient(125deg,#292721,#121713)',
    ...enter(f, 0, 20), opacity: 1}}>
    <div className="two-offers-display" style={{position: 'absolute', top: 25, width: '100%', textAlign: 'center',
      fontSize: 51 - 7 * compact, color: C.white}}>Лендінг під твій бізнес</div>
    <div style={{position: 'absolute', left: 28, right: 28, top: 97 - 15 * compact, textAlign: 'center', overflow: 'hidden'}}>
      <span data-fit="price" className="two-offers-display" style={{display: 'inline-flex', alignItems: 'baseline', color: C.red,
        fontSize: 248 - compact * 90, lineHeight: 1.15, letterSpacing: -5}}>
        {'$150'.split('').map((letter, i) => <span key={i} style={{display: 'inline-block', ...enter(f, 3 + i * 2, 180)}}>{letter}</span>)}
      </span>
    </div>
    <div style={{position: 'absolute', top: 416, left: 24, right: 24, opacity: 1 - compact,
      display: 'flex', justifyContent: 'center', gap: 12}}>
      {['Дизайн', 'Тексти', 'Розробка'].map((label, i) => <div key={label} style={{padding: '15px 22px', fontSize: 32, fontWeight: 700,
        border: '1px solid #5b4c45', borderRadius: 16, background: '#ffffff05', ...enter(f, 13 + i * 3, 19)}}>{label}</div>)}
    </div>
  </div>;
};

const Terms: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <div data-center="payment-terms" style={{...box(), top: 1180, textAlign: 'center', fontSize: 36, lineHeight: 1.34,
      fontWeight: 600, ...enter(f, 8, 18)}}>Перші <span style={{color: C.red}}>50%</span> — після<br/>затвердження дизайну</div>
    <div data-center="hosting-terms" style={{...box(), top: 1310, textAlign: 'center', fontSize: 32, color: '#b7bdb1',
      ...enter(f, 14, 12)}}>Домен і хостинг оплачуються окремо</div>
  </AbsoluteFill>;
};

const Action: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <div data-center="action-heading" className="two-offers-display" style={{...box(), top: 780, fontSize: 88, lineHeight: 1.14,
      textAlign: 'center', ...enter(f, 4, 28)}}>Залиш заявку —<br/>обговоримо твій сайт</div>
    <div data-center="address" style={{...box(), top: 1040, textAlign: 'center', fontSize: 43, fontWeight: 650,
      letterSpacing: -1, ...enter(f, 8, 18)}}>bridgeagency.com.ua</div>
    <div data-center="action-button" style={{...box(), top: 1142, height: 120, borderRadius: 60, background: 'linear-gradient(105deg,#f52739,#dc1024)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, fontSize: 40, fontWeight: 700,
      boxShadow: 'inset 0 1px 0 #ffffff30,0 20px 50px #0004', ...enter(f, 11, 24)}}>Залишити заявку<Icon name="arrow" size={42}/></div>
  </AbsoluteFill>;
};

const Captions: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cue = plan.captions.find(c => t >= c.start && t < c.end);
  if (!cue) return null;
  return <div data-center="captions" className="two-offers-captions" style={{...box(830), top: 1440, fontSize: 49,
    zIndex: 20, letterSpacing: -.9, lineHeight: 1.3, textAlign: 'center', textShadow: '0 2px 12px #000',
    opacity: t < .12 ? 1 : ease((t - cue.start) * 30, 0, 2)}}>
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 12, rowGap: 4}}>
      {cue.word_ids.map(id => {const word = wordData.words[id]; return <span key={id}
        style={{color: t >= word.start && t < word.end ? C.red : C.white}}>{word.text}</span>;})}
    </div>
  </div>;
};

const FontsReady: React.FC = () => {
  React.useLayoutEffect(() => {
    const handle = delayRender('Load Ukrainian Oswald and Manrope'); let active = true;
    Promise.all([document.fonts.load('700 104px Oswald', 'Фото є. А що обрати?'),
      document.fonts.load('700 248px Oswald', '$150'), document.fonts.load('700 49px Manrope', 'Односторінковий сайт за')])
      .then(() => {if (active) {active = false; continueRender(handle);}}).catch(cancelRender);
    return () => {if (active) {active = false; continueRender(handle);}};
  }, []); return null;
};

const LayoutCheck: React.FC = () => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {
    const handle = delayRender('Measure photo-choice layout'); let active = true;
    document.fonts.ready.then(() => {
      if (!active) return;
      const root = document.querySelector('[data-photos-choice-root]')!.getBoundingClientRect(); const scale = root.width / 1080;
      const groups = Array.from(document.querySelectorAll('[data-center]')).map(el => {const r = el.getBoundingClientRect();
        return {name: el.getAttribute('data-center'), center_x: (r.left + r.width / 2 - root.left) / scale,
          left: (r.left - root.left) / scale, right: (r.right - root.left) / scale, bottom: (r.bottom - root.top) / scale};});
      const prices = Array.from(document.querySelectorAll('[data-fit]')).map(el => {const r = el.getBoundingClientRect(); const p = el.parentElement!.getBoundingClientRect();
        return {text: el.textContent, width_px: r.width / scale, available_px: p.width / scale, font: getComputedStyle(el).fontFamily};});
      console.log(`PHOTOS_CHOICE_CENTER_CHECK=${JSON.stringify({frame, groups, prices,
        oswald_loaded: document.fonts.check('700 104px Oswald', 'Фото є. А що обрати? $150')})}`);
      active = false; continueRender(handle);
    }); return () => {if (active) {active = false; continueRender(handle);}};
  }, [frame]); return null;
};

const scenes = [Choice, Services, Products, Adaptation, OfferTitle, Action];
export const BridgePhotosChoice: React.FC<{checkLayout?: boolean}> = ({checkLayout = false}) => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill data-photos-choice-root className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <FontsReady/><CenteredBackground/>
    <Audio src={staticFile(plan.atmosphere)} volume={f => f / fps < plan.voice_end ? .75 : 1}/>
    <Audio src={staticFile(plan.voiceover)} volume={plan.voiceover_volume}/>
    {plan.scenes.map((s, i) => {const Component = scenes[i]; const from = Math.round(s.start * fps);
      return <Sequence key={s.id} from={from} durationInFrames={Math.round(s.end * fps) - from}><Component/></Sequence>;})}
    <Sequence from={Math.round(plan.scenes[4].start * fps)}><Offer/></Sequence>
    <Sequence from={Math.round(plan.scenes[4].start * fps)} durationInFrames={Math.round(plan.scenes[5].start * fps) - Math.round(plan.scenes[4].start * fps)}><Terms/></Sequence>
    <CenteredBrand/><Captions/>{checkLayout && <LayoutCheck/>}
  </AbsoluteFill>;
};
