import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon, C} from './BridgeReel';
import {useMotionFrame, ease, enter, settle, panel} from './BridgeLanding150';
import plan from '../data/direct-questions.json';
import wordData from '../data/words-direct-questions.json';

// Every principal group shares the actual frame center, including its animation.
const center = plan.center_x;
const width = plan.content_width;
const box = (w = width): React.CSSProperties => ({position: 'absolute', left: center - w / 2, width: w});
const relativeWord = (id: number, scene: number) => (wordData.words[id].start - plan.scenes[scene].start) * 30;

const CenteredBackground: React.FC = () => <AbsoluteFill style={{background: C.bg}}>
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 34%,#57212a1c,transparent 60%),radial-gradient(ellipse at 50% 76%,#24433012,transparent 55%)'}}/>
  <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff02 1px,transparent 1px),linear-gradient(90deg,#ffffff02 1px,transparent 1px)',
    backgroundSize: '108px 108px', maskImage: 'linear-gradient(#000,transparent 65%)'}}/>
</AbsoluteFill>;

const CenteredBrand: React.FC = () => <div data-center="brand" style={{...box(156), top: 160, height: 103, overflow: 'hidden'}}>
  {/* Compensate for the uneven empty margins in the original PDF logo crop. */}
  <Img src={staticFile('brand/logo.png')} style={{position: 'absolute', width: 156, height: 156 * 200 / 304,
    left: 78 - (13 + 272) / 2 * 156 / 304, top: 51.5 - (23 + 171) / 2 * 156 / 304, mixBlendMode: 'screen'}}/>
</div>;

const Title: React.FC<{lines: [string, string]; size?: number; immediate?: boolean}> = ({lines, size = 76, immediate = false}) => {
  const f = useMotionFrame();
  return <div data-center="title" style={{...box(), top: 327, textAlign: 'center', fontSize: size,
    fontWeight: 750, lineHeight: 1.14, letterSpacing: -2.7}}>
    {lines.map((line, i) => <div key={line} style={{overflow: 'hidden', paddingBottom: 6}}>
      <div style={{color: i ? C.red : C.white, ...(immediate ? {} : enter(f, i * 2, 34))}}>{line}</div>
    </div>)}
  </div>;
};

const Questions: React.FC = () => {
  const f = useMotionFrame();
  const at = [relativeWord(4, 0), relativeWord(5, 0), relativeWord(8, 0)];
  return <AbsoluteFill>
    <Title immediate lines={['Знову ті самі', 'питання в директі?']}/>
    <div data-center="question-stack" style={{...box(760), top: 606, display: 'flex', flexDirection: 'column', gap: 25}}>
      {['Яка ціна?', 'Що входить?', 'Як замовити?'].map((text, i) => {
        const accent = Math.sin(Math.PI * ease(f, at[i], at[i] + 18));
        return <div key={text} style={{...panel, height: 173, padding: '25px 31px',
          borderColor: accent > .25 ? '#8a3c46' : '#353b37', ...(i ? enter(f, at[i] - 3, 36) : {})}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12, color: C.muted, fontSize: 29, fontWeight: 600}}>
            <Icon name="user" size={29} color={C.red}/>Клієнт
          </div>
          <div style={{fontSize: 49, fontWeight: 700, letterSpacing: -1.2, marginTop: 13}}>{text}</div>
        </div>;
      })}
    </div>
  </AbsoluteFill>;
};

const Repeat: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Title size={71} lines={['Ті самі питання.', 'Наступному клієнту.']}/>
    <div data-center="next-dialog" style={{...box(760), top: 630, height: 618, ...panel, ...enter(f, 2, 36)}}>
      <div style={{height: 108, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        borderBottom: `1px solid ${C.line}`, fontSize: 35, fontWeight: 650}}><Icon name="message" size={35} color={C.red}/>Новий діалог</div>
      <div style={{padding: '35px 43px', display: 'flex', flexDirection: 'column', gap: 18}}>
        {['Ціна?', 'Умови?', 'Як замовити?'].map((text, i) => <div key={text} style={{height: 95,
          border: '1px solid #42453a', borderRadius: 24, background: 'linear-gradient(110deg,#30332b,#1d2420)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 47, fontWeight: 650,
          ...enter(f, 4 + i * 7, 27)}}>{text}</div>)}
      </div>
      <div style={{position: 'absolute', bottom: 34, left: 0, width: '100%', textAlign: 'center',
        fontSize: 34, color: C.muted, ...enter(f, 26, 15)}}>Пояснювати спочатку.</div>
    </div>
  </AbsoluteFill>;
};

const Answers: React.FC = () => {
  const f = useMotionFrame();
  const worksAt = relativeWord(17, 2);
  const formAt = relativeWord(20, 2);
  const works = ease(f, worksAt, worksAt + 9);
  const form = ease(f, formAt, formAt + 9);
  const opens = [1 - works, works * (1 - form), form];
  return <AbsoluteFill>
    <Title size={71} lines={['Відповіді — на сайті.', 'Заявка — поруч.']}/>
    <div data-center="answers-site" style={{...box(), top: 602, height: 723, ...panel, ...enter(f, 2, 35)}}>
      <div style={{height: 58, display: 'flex', alignItems: 'center', gap: 9, padding: '0 28px', background: '#202622'}}>
        {[0, 1, 2].map(i => <span key={i} style={{width: 9, height: 9, background: '#68736a', borderRadius: '50%'}}/>)}
        <span style={{marginLeft: 'auto', fontSize: 25, color: C.muted}}>Твій сайт</span>
      </div>
      <div style={{padding: '27px 30px'}}>
        <div style={{textAlign: 'center', fontSize: 45, fontWeight: 750, letterSpacing: -1.4}}>Твоя пропозиція</div>
        <div style={{textAlign: 'center', marginTop: 8, fontSize: 32, color: C.muted}}>Усе для вибору й замовлення</div>
        <div style={{marginTop: 27, display: 'flex', flexDirection: 'column', gap: 14}}>
          {['Ціна й умови', 'Приклади робіт', 'Заявка'].map((label, i) => <div key={label} style={{height: 88 + opens[i] * 134,
            overflow: 'hidden', borderRadius: 19, border: `1px solid ${opens[i] > .4 ? '#75404a' : '#35423a'}`,
            background: 'linear-gradient(125deg,#242922,#161d19)'}}>
            <div style={{height: 88, padding: '0 24px', display: 'flex', gap: 18, alignItems: 'center'}}>
              <Icon name={(['price', 'grid', 'message'] as const)[i]} size={33} color={C.red}/>
              <span style={{fontSize: 38, fontWeight: 700}}>{label}</span>
              <Icon name="chevron" size={28} style={{marginLeft: 'auto', transform: `rotate(${opens[i] * 90}deg)`}}/>
            </div>
            <div style={{padding: '1px 24px 20px', opacity: opens[i]}}>
              {i === 0 ? <div style={{fontSize: 36, color: '#d1d7cf', lineHeight: 1.3}}>Що входить у замовлення<br/>та як його оформити</div> : i === 1 ?
                <div style={{display: 'flex', gap: 13}}>{[0, 1, 2].map(n => <div key={n} style={{flex: 1,
                  height: 91, border: '1px solid #424c43', borderRadius: 13,
                  background: ['linear-gradient(135deg,#313f37,#151d18)', 'linear-gradient(135deg,#542a2c,#211819)', 'linear-gradient(135deg,#333b35,#151c19)'][n],
                  display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon name={(['site', 'grid', 'bag'] as const)[n]} size={42} color="#b6c0b4"/></div>)}</div> :
                <div style={{height: 91, borderRadius: 16, background: C.red, display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '0 25px', fontSize: 36, fontWeight: 700}}>Залишити заявку<Icon name="arrow" size={33}/></div>}
            </div>
          </div>)}
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};

const BeforeChat: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <Title size={72} lines={['Спочатку — умови.', 'Потім — розмова.']}/>
    {[['На сайті', 'Ціна й умови'], ['У повідомленні', 'Конкретний запит']].map(([label, text], i) => <div key={label}
      data-center={`step-${i}`} style={{...box(), top: 640 + i * 302, height: 211, ...panel,
        padding: '26px 32px', textAlign: 'center', ...enter(f, i ? 22 : 2, 30)}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
        fontSize: 34, color: C.muted, fontWeight: 600}}><Icon name={i ? 'message' : 'site'} size={31} color={C.red}/>{label}</div>
      <div style={{fontSize: 53, fontWeight: 750, marginTop: 20, letterSpacing: -1.5}}>{text}</div>
    </div>)}
    <div data-center="step-arrow" style={{...box(42), top: 883, color: C.red, ...enter(f, 14, 12)}}>
      <Icon name="arrow" size={42} style={{transform: 'rotate(90deg)'}}/>
    </div>
  </AbsoluteFill>;
};

// A single horizontal offer remains visible through the closing CTA.
const OfferCard: React.FC = () => {
  const f = useMotionFrame();
  const local = f - plan.scenes[4].start * 30;
  if (local < 0) return null;
  const compact = ease(f, plan.scenes[5].start * 30, plan.scenes[5].start * 30 + 13);
  return <div data-center="offer-card" style={{...box(), top: 420 - compact * 55, height: 496 - compact * 260,
    zIndex: 8, overflow: 'hidden', borderRadius: 32, border: '1px solid #6a3a45',
    background: 'radial-gradient(ellipse at 50% 0%,#64192455,transparent 68%),linear-gradient(125deg,#252626,#121714)',
    boxShadow: '0 30px 90px #0006, inset 0 1px 0 #ffffff19', ...enter(local, 0, 34)}}>
    <div style={{position: 'absolute', left: 37, top: 90 - compact * 42, width: 320, fontWeight: 750,
      fontSize: 72 - compact * 18, lineHeight: 1.08, letterSpacing: -2.2, ...enter(local, 3, 20)}}>
      Лендінг<div style={{fontSize: 46 - compact * 9, color: '#c5c9c1', marginTop: 10}}>за</div>
    </div>
    <div style={{position: 'absolute', right: 36, top: 73 - compact * 22, color: C.red,
      fontSize: 160 - compact * 32, fontWeight: 800, letterSpacing: -4.7, lineHeight: 1.2,
      opacity: ease(local, 6, 13), transform: `scale(${.96 + settle(local, 6) * .04})`, transformOrigin: 'center'}}>$150</div>
    <div style={{position: 'absolute', left: 35, right: 35, top: 320, height: 1, background: '#ffffff17', opacity: 1 - compact}}/>
    <div style={{position: 'absolute', left: 35, right: 35, top: 353, display: 'flex', gap: 14,
      opacity: 1 - compact, transform: `translateY(${-compact * 24}px)`}}>
      {['Дизайн', 'Тексти', 'Розробка'].map((label, i) => <div key={label} style={{flex: 1, height: 86,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        fontSize: 33, fontWeight: 650, border: '1px solid #ffffff16', borderRadius: 18,
        background: 'linear-gradient(#ffffff06,#ffffff02)', ...enter(local, 14 + i * 3, 20)}}>
        <Icon name="check" size={23} color={C.red}/>{label}</div>)}
    </div>
  </div>;
};

const OfferTerms: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <div data-center="payment" style={{...box(), top: 988, padding: '28px 24px', textAlign: 'center',
      border: '1px solid #3e4139', borderRadius: 24, background: 'linear-gradient(110deg,#20261f,#121813)',
      fontSize: 45, fontWeight: 650, lineHeight: 1.3, ...enter(f, 21, 25)}}>
      Перші <span style={{color: C.red}}>50%</span> — після<br/>затвердження дизайну
    </div>
    <div data-center="hosting" style={{...box(), top: 1230, fontSize: 34, color: '#b7bdb7', textAlign: 'center',
      lineHeight: 1.4, ...enter(f, 25, 16)}}>Домен і хостинг оплачуються окремо</div>
  </AbsoluteFill>;
};

const Action: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <div data-center="action-title" style={{...box(), top: 770, textAlign: 'center', fontSize: 72,
      fontWeight: 750, lineHeight: 1.15, letterSpacing: -2.8, ...enter(f, 4, 28)}}>
      Залиш заявку —<br/>обговоримо твій сайт
    </div>
    <div data-center="address" style={{...box(), top: 1030, textAlign: 'center', fontSize: 43,
      fontWeight: 650, letterSpacing: -1, ...enter(f, 8, 18)}}>bridgeagency.com.ua</div>
    <div data-center="action-button" style={{...box(), top: 1142, height: 120, borderRadius: 60,
      background: 'linear-gradient(105deg,#f52739,#dc1024)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 28, fontSize: 40, fontWeight: 700,
      boxShadow: 'inset 0 1px 0 #ffffff30, 0 18px 45px #00000030', ...enter(f, 11, 24)}}>
      Залишити заявку<Icon name="arrow" size={42}/>
    </div>
  </AbsoluteFill>;
};

const CenteredCaptions: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const cue = plan.captions.find(c => t >= c.start && t < c.end);
  if (!cue) return null;
  return <div data-center="captions" style={{...box(plan.caption_width), top: 1440, zIndex: 20,
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

const scenes = [Questions, Repeat, Answers, BeforeChat, OfferTerms, Action];
const LayoutCheck: React.FC = () => {
  const frame = useCurrentFrame();
  React.useLayoutEffect(() => {
    const handle = delayRender('Measure centered groups after font loading');
    let active = true;
    document.fonts.ready.then(() => {
      if (!active) return;
      const root = document.querySelector('[data-direct-root]')!.getBoundingClientRect();
      const scale = root.width / 1080;
      const groups = Array.from(document.querySelectorAll('[data-center]')).map(el => {
        const rect = el.getBoundingClientRect();
        return {name: el.getAttribute('data-center'), center_x: (rect.left + rect.width / 2 - root.left) / scale};
      });
      console.log(`DIRECT_CENTER_CHECK=${JSON.stringify({frame, groups})}`);
      active = false;
      continueRender(handle);
    });
    return () => {if (active) {active = false; continueRender(handle);}};
  }, [frame]);
  return null;
};

export const BridgeDirectQuestions: React.FC<{checkLayout?: boolean}> = ({checkLayout = false}) => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill data-direct-root className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <CenteredBackground/>
    <Audio src={staticFile(plan.atmosphere)} volume={f => f / fps < plan.voice_end ? .75 : 1}/>
    <Audio src={staticFile(plan.voiceover)} volume={plan.voiceover_volume}/>
    {plan.scenes.map((scene, i) => {
      const Component = scenes[i];
      const from = Math.round(scene.start * fps);
      return <Sequence key={scene.id} from={from} durationInFrames={Math.round(scene.end * fps) - from}><Component/></Sequence>;
    })}
    <OfferCard/>
    <CenteredBrand/>
    <CenteredCaptions/>
    {checkLayout && <LayoutCheck/>}
  </AbsoluteFill>;
};
