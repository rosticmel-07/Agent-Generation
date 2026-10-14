import React from 'react';
import {AbsoluteFill, Audio, Sequence, cancelRender, continueRender, delayRender, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
import {Icon, C} from './BridgeReel';
import {ease, enter, useMotionFrame} from './BridgeLanding150';
import {CenteredBackground, CenteredBrand} from './BridgeDirectQuestions';
import plan from '../data/two-offers.json';
import wordData from '../data/words-two-offers.json';
import './two-offers-font.css';

const box = (w = plan.content_width): React.CSSProperties => ({position: 'absolute', left: plan.center_x - w / 2, width: w});

const Heading: React.FC<{lines: [string, string]; immediate?: boolean; size?: number}> = ({lines, immediate = false, size = 92}) => {
  const f = useMotionFrame();
  return <div data-center="heading" className="two-offers-display" style={{...box(), top: 326,
    fontSize: size, lineHeight: 1.12, textAlign: 'center', letterSpacing: -1.2}}>
    {lines.map((line, i) => <div key={line} style={{overflow: 'hidden', paddingBottom: 7}}>
      <div style={{color: i ? C.red : C.white, ...(immediate ? {} : enter(f, i * 2, 30))}}>{line}</div>
    </div>)}
  </div>;
};
const Owner: React.FC = () => <Heading immediate size={98} lines={['Власник', 'малого бізнесу?']}/>;
const Proposal: React.FC = () => <Heading size={90} lines={['Є пропозиція', 'для твого бізнесу.']}/>;
const Landing: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Heading size={90} lines={['Одна пропозиція.', 'Одна сторінка.']}/>
    <div data-center="landing-payment" style={{...box(), top: 1230, padding: '18px 24px', borderRadius: 22,
      border: '1px solid #484138', background: 'linear-gradient(100deg,#22261f,#121813)',
      textAlign: 'center', fontSize: 36, fontWeight: 650, lineHeight: 1.28, ...enter(f, 5, 18)}}>
      Лендінг: перші <span style={{color: C.red}}>50%</span> — після<br/>затвердження дизайну
    </div>
  </AbsoluteFill>;
};
const MultiPage: React.FC = () => <Heading size={90} lines={['Кілька сторінок.', 'Один сайт.']}/>;

const Included: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Heading size={90} lines={['Дизайн. Тексти.', 'Розробка.']}/>
    <div data-center="service-blocks" style={{...box(), top: 1220, display: 'flex', gap: 16}}>
      {['Дизайн', 'Тексти', 'Розробка'].map((label, i) => <div key={label} style={{flex: 1, height: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 34, fontWeight: 700,
        background: 'linear-gradient(#252b25,#141b16)', border: '1px solid #3c453c', borderRadius: 20,
        ...enter(f, i * 5, 22)}}><Icon name="check" size={25} color={C.red}/>{label}</div>)}
    </div>
    <div data-center="hosting" style={{...box(), top: 1330, fontSize: 33, lineHeight: 1.3,
      textAlign: 'center', color: '#b7bdb7', ...enter(f, 12, 14)}}>Домен і хостинг оплачуються окремо</div>
  </AbsoluteFill>;
};

const PageSketch: React.FC<{multiple: boolean; f: number; accent: number}> = ({multiple, f, accent}) => {
  const reveal = ease(f, 0, 25);
  const page = (i: number) => <div key={i} style={{position: 'absolute', top: multiple ? 9 + i * 8 : 8,
    left: multiple ? 19 + i * (30 + reveal * 7) : 12, width: multiple ? 230 : 310, height: 166,
    borderRadius: 16, border: '1px solid #536052', overflow: 'hidden',
    background: 'linear-gradient(130deg,#29352c,#151d18)',
    transform: `translateY(${multiple ? (1 - ease(f, i * 4, i * 4 + 14)) * (i * 7) : 0}px)`}}>
    <div style={{height: 28, background: '#303a30', display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 14}}>
      {[0, 1, 2].map(n => <span key={n} style={{width: 5, height: 5, borderRadius: '50%', background: '#84917e'}}/>)}
    </div>
    <div style={{padding: '16px 16px 0'}}>
      <div style={{width: multiple ? 126 : 177, height: 11, background: '#bcc6b5', borderRadius: 3}}/>
      <div style={{width: multiple ? 96 : 137, height: 7, marginTop: 10, background: '#657461', borderRadius: 3}}/>
      <div style={{display: 'flex', gap: 7, marginTop: 16, opacity: .6 + .4 * reveal}}>
        {[0, 1, 2].map(n => <span key={n} style={{flex: 1, height: 23, border: '1px solid #63725d', borderRadius: 5, background: '#3e4c3830'}}/>)}
      </div>
      <div style={{height: 17, width: multiple ? 90 : 130, marginTop: 13, borderRadius: 5,
        background: C.red, opacity: .45 + accent * .55}}/>
    </div>
  </div>;
  return <div style={{position: 'absolute', left: 28, right: 28, top: 345, height: 190}}>
    {(multiple ? [0, 1, 2] : [0]).map(page)}
  </div>;
};

const OfferPair: React.FC = () => {
  const f = useMotionFrame();
  const compact = ease(f, plan.scenes[5].start * 30, plan.scenes[5].start * 30 + 13);
  const lp = ease(f, plan.scenes[2].start * 30, plan.scenes[2].start * 30 + 9) *
    (1 - ease(f, plan.scenes[3].start * 30, plan.scenes[3].start * 30 + 9));
  const multi = ease(f, plan.scenes[3].start * 30, plan.scenes[3].start * 30 + 9) *
    (1 - ease(f, plan.scenes[4].start * 30, plan.scenes[4].start * 30 + 9));
  return <div data-center="offer-pair" style={{...box(), top: 620 - compact * 270,
    height: 560 - compact * 264, display: 'flex', gap: 24, zIndex: 8}}>
    {[
      {title: 'Лендінг', format: 'Одна сторінка', price: '$150', active: lp, start: plan.scenes[2].start, multiple: false},
      {title: 'Сайт', format: 'Кілька сторінок', price: '$300', active: multi, start: plan.scenes[3].start, multiple: true},
    ].map((offer, i) => <div key={offer.price} style={{position: 'relative', flex: 1, overflow: 'hidden', borderRadius: 30,
      border: `1px solid ${offer.active > .2 ? '#ad3c4e' : '#4a433f'}`,
      background: `radial-gradient(ellipse at 50% 0%,rgba(132,28,45,${.11 + offer.active * .18}),transparent 67%),linear-gradient(125deg,#272928,#111713)`,
      boxShadow: `0 24px 70px #0005, inset 0 1px 0 #ffffff17, 0 0 35px rgba(243,35,53,${offer.active * .06})`,
      transform: `translateY(${-offer.active * 6 * (1 - compact)}px)`}}>
      <div className="two-offers-display" style={{position: 'absolute', top: 23, left: 20, right: 20,
        textAlign: 'center', fontSize: 54 - compact * 10, lineHeight: 1.18}}>{offer.title}</div>
      <div style={{position: 'absolute', top: 96 - compact * 18, left: 15, right: 15, fontSize: 34 - compact * 7,
        textAlign: 'center', fontWeight: 650, color: '#bec6b9', lineHeight: 1.2}}>{offer.format}</div>
      <div style={{position: 'absolute', left: 26, right: 26, top: 149 - compact * 30, textAlign: 'center', overflow: 'hidden'}}>
        <span data-fit={`price-${i}`} className="two-offers-display" style={{display: 'inline-block', color: C.red,
          fontSize: 156 - compact * 44, lineHeight: 1.1, letterSpacing: -2.4}}>{offer.price}</span>
      </div>
      <div style={{opacity: 1 - compact, transform: `translateY(${-compact * 24}px)`}}>
        <PageSketch multiple={offer.multiple} f={f - offer.start * 30} accent={offer.active}/>
      </div>
    </div>)}
  </div>;
};

const Action: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <div data-center="action-heading" className="two-offers-display" style={{...box(), top: 782,
      fontSize: 88, lineHeight: 1.14, textAlign: 'center', ...enter(f, 4, 28)}}>
      Залиш заявку —<br/>обговоримо твій сайт
    </div>
    <div data-center="address" style={{...box(), top: 1040, textAlign: 'center', fontSize: 43,
      fontWeight: 650, letterSpacing: -1, ...enter(f, 8, 18)}}>bridgeagency.com.ua</div>
    <div data-center="action-button" style={{...box(), top: 1142, height: 120, borderRadius: 60,
      background: 'linear-gradient(105deg,#f52739,#dc1024)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 28, fontSize: 40, fontWeight: 700,
      boxShadow: 'inset 0 1px 0 #ffffff30, 0 18px 45px #0003', ...enter(f, 11, 24)}}>
      Залишити заявку<Icon name="arrow" size={42}/>
    </div>
  </AbsoluteFill>;
};

const Captions: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cue = plan.captions.find(c => t >= c.start && t < c.end);
  if (!cue) return null;
  return <div data-center="captions" className="two-offers-captions" style={{...box(plan.caption_width), top: 1440,
    zIndex: 20, fontSize: 49, letterSpacing: -.9, lineHeight: 1.3, textAlign: 'center',
    textShadow: '0 2px 12px #000', opacity: t < .12 ? 1 : ease((t - cue.start) * 30, 0, 2)}}>
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 12, rowGap: 4}}>
      {cue.word_ids.map(id => {
        const word = wordData.words[id];
        return <span key={id} style={{color: t >= word.start && t < word.end ? C.red : C.white}}>{word.text}</span>;
      })}
    </div>
  </div>;
};

const LayoutCheck: React.FC = () => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {
    const handle = delayRender('Check two-offer centering and Oswald');
    let active = true;
    document.fonts.ready.then(() => {
      if (!active) return;
      const root = document.querySelector('[data-two-offers-root]')!.getBoundingClientRect();
      const scale = root.width / 1080;
      const groups = Array.from(document.querySelectorAll('[data-center]')).map(el => {
        const rect = el.getBoundingClientRect();
        return {name: el.getAttribute('data-center'), center_x: (rect.left + rect.width / 2 - root.left) / scale};
      });
      const prices = Array.from(document.querySelectorAll('[data-fit]')).map(el => {
        const rect = el.getBoundingClientRect();
        const parent = el.parentElement!.getBoundingClientRect();
        return {text: el.textContent, width_px: rect.width / scale, available_px: parent.width / scale,
          font: getComputedStyle(el).fontFamily};
      });
      console.log(`TWO_OFFERS_CENTER_CHECK=${JSON.stringify({frame, groups, prices,
        oswald_loaded: document.fonts.check('700 100px Oswald', 'Власник малого бізнесу? $150 $300')})}`);
      active = false; continueRender(handle);
    });
    return () => {if (active) {active = false; continueRender(handle);}};
  }, [frame]);
  return null;
};

const scenes = [Owner, Proposal, Landing, MultiPage, Included, Action];
const FontsReady: React.FC = () => {
  React.useLayoutEffect(() => {
    const handle = delayRender('Load Ukrainian display font and captions');
    let active = true;
    Promise.all([
      document.fonts.load('700 98px Oswald', 'Власник малого бізнесу? Є пропозиція'),
      document.fonts.load('700 156px Oswald', '$150 $300'),
      document.fonts.load('700 49px Manrope', 'Залиш заявку — обговоримо сайт'),
    ]).then(() => {if (active) {active = false; continueRender(handle);}})
      .catch(error => cancelRender(error));
    return () => {if (active) {active = false; continueRender(handle);}};
  }, []);
  return null;
};
export const BridgeTwoOffers: React.FC<{checkLayout?: boolean}> = ({checkLayout = false}) => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill data-two-offers-root className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <FontsReady/>
    <CenteredBackground/>
    <Audio src={staticFile(plan.atmosphere)} volume={f => f / fps < plan.voice_end ? .75 : 1}/>
    <Audio src={staticFile(plan.voiceover)} volume={plan.voiceover_volume}/>
    {plan.scenes.map((scene, i) => {
      const Component = scenes[i]; const from = Math.round(scene.start * fps);
      return <Sequence key={scene.id} from={from} durationInFrames={Math.round(scene.end * fps) - from}><Component/></Sequence>;
    })}
    <OfferPair/>
    <CenteredBrand/>
    <Captions/>
    {checkLayout && <LayoutCheck/>}
  </AbsoluteFill>;
};
