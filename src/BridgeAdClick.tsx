import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Background, Icon, PostArt, C} from './BridgeReel';
import {SceneTitle, Brand, Case, OfferDeck, Offer, Action, Captions,
  useMotionFrame, ease, settle, enter, panel} from './BridgeLanding150';
import plan from '../data/ad-click.json';
import wordData from '../data/words-ad-click.json';

const left = 96;
const width = 804;

const AdClick: React.FC = () => {
  const f = useMotionFrame();
  const clicked = f >= 45;
  const tap = ease(f, 24, 42);
  return <AbsoluteFill>
    <SceneTitle immediate size={76} lines={['Платиш за рекламу.', 'А що після кліку?']}/>
    <div style={{position: 'absolute', left, top: 612, width, height: 704, ...panel}}>
      <div style={{height: 102, display: 'flex', alignItems: 'center', padding: '0 36px', gap: 22,
        borderBottom: `1px solid ${C.line}`}}>
        <div style={{width: 50, height: 50, border: `2px solid ${C.red}`, borderRadius: '50%', background: '#262d28'}}/>
        <span style={{fontSize: 33, fontWeight: 700}}>Ваш бізнес</span>
        <span style={{marginLeft: 'auto', fontSize: 28, color: C.muted}}>{clicked ? 'Профіль' : 'Реклама'}</span>
      </div>
      {clicked ? <div style={{padding: '25px 36px'}}>
        <div style={{fontSize: 37, fontWeight: 700, marginBottom: 24}}>Знайти умови серед постів?</div>
        <div style={{height: 373, overflow: 'hidden', borderRadius: 15}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 11,
            transform: `translateY(${-ease(f, 53, 111) * 118}px)`}}>
            {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{position: 'relative', overflow: 'hidden', borderRadius: 12}}>
              <PostArt variant={i} size={237}/>
              <div style={{position: 'absolute', left: 13, bottom: 16, fontSize: 29, fontWeight: 700,
                textShadow: '0 2px 10px #000'}}>{['Послуги', 'Про нас', 'Роботи', 'Новини', 'Умови', 'Поради'][i]}</div>
            </div>)}
          </div>
        </div>
        <div style={{marginTop: 26, display: 'flex', alignItems: 'center', gap: 17, fontSize: 37,
          fontWeight: 700, ...enter(f, 60, 15)}}><Icon name="search" color={C.red} size={36}/>Де конкретна пропозиція?</div>
      </div> : <div style={{padding: '27px 36px'}}>
        <div style={{fontSize: 43, fontWeight: 750}}>Твоя пропозиція</div>
        <div style={{height: 260, marginTop: 24, borderRadius: 17, overflow: 'hidden', position: 'relative', background: '#211b1c'}}>
          <div style={{position: 'absolute', right: 0, top: -44, transform: 'rotate(-8deg)'}}><PostArt variant={1} size={355}/></div>
          <div style={{position: 'absolute', left: 30, top: 50, fontSize: 47, fontWeight: 750, lineHeight: 1.17}}>Послуги<br/>для тебе</div>
        </div>
        <div style={{position: 'absolute', left: 36, right: 36, bottom: 43, height: 105, borderRadius: 20,
          background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 30px', fontSize: 38, fontWeight: 700,
          transform: `scale(${1 - ease(f, 39, 44) * .016})`}}>Дізнатися більше<Icon name="arrow" size={38}/></div>
        <div style={{position: 'absolute', right: 113 - tap * 31, bottom: 206 - tap * 115,
          opacity: ease(f, 17, 24), filter: 'drop-shadow(0 4px 7px #0008)'}}><Icon name="cursor" size={47}/></div>
      </div>}
    </div>
  </AbsoluteFill>;
};

const Clarity: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <SceneTitle size={76} lines={['Клієнту потрібні', 'чіткі відповіді.']}/>
    <div style={{position: 'absolute', left, top: 635, width, display: 'flex', flexDirection: 'column', gap: 24}}>
      {(['Що я отримую?', 'Скільки коштує?', 'Як замовити?'] as const).map((text, i) => <div key={text}
        style={{height: 173, padding: '0 34px', display: 'flex', alignItems: 'center', gap: 29,
          ...panel, ...enter(f, i * 5, 43)}}>
        <div style={{width: 77, height: 77, borderRadius: 23, background: '#f3233510',
          border: '1px solid #f3233528', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name={(['site', 'price', 'message'] as const)[i]} size={40} color={C.red}/>
        </div>
        <span style={{fontSize: 48, fontWeight: 700, letterSpacing: -1.4}}>{text}</span>
      </div>)}
      <div style={{fontSize: 33, color: C.muted, padding: '11px 4px', ...enter(f, 23, 15)}}>Без пошуку по різних публікаціях</div>
    </div>
  </AbsoluteFill>;
};

const Landing: React.FC = () => {
  const f = useMotionFrame();
  return <AbsoluteFill>
    <SceneTitle size={76} lines={['Одна пропозиція.', 'Одна сторінка.']}/>
    <div style={{position: 'absolute', left, top: 620, width, height: 715, ...panel, ...enter(f, 2, 45)}}>
      <div style={{height: 64, display: 'flex', alignItems: 'center', gap: 9, padding: '0 29px', background: '#202622'}}>
        {[0, 1, 2].map(i => <span key={i} style={{width: 9, height: 9, background: '#68736a', borderRadius: '50%'}}/>)}
        <Icon name="site" size={27} color={C.muted} style={{marginLeft: 'auto'}}/>
      </div>
      <div style={{padding: '29px 32px'}}>
        <div style={{fontSize: 47, fontWeight: 750, letterSpacing: -1.7, lineHeight: 1.2}}>Твоя пропозиція.<br/><span style={{color: '#dadfd6'}}>Усе для рішення.</span></div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 30}}>
          {(['Пропозиція', 'Приклади робіт', 'Ціна й умови', 'Форма заявки'] as const).map((label, i) => {
            const pulse = Math.sin(Math.PI * ease(f, 12 + i * 9, 33 + i * 9));
            return <div key={label} style={{height: 132, padding: '19px 20px', borderRadius: 17,
              border: `1px solid ${pulse > .3 ? '#8a3c46' : '#35423a'}`,
              background: 'linear-gradient(135deg,#242922,#161d19)', ...enter(f, 6 + i * 3, 32),
              boxShadow: `inset 0 0 24px rgba(243,35,53,${pulse * .055})`}}>
              <Icon name={(['site', 'grid', 'price', 'message'] as const)[i]} size={34} color={C.red}/>
              <div style={{fontSize: 30, fontWeight: 650, marginTop: 10}}>{label}</div>
            </div>;
          })}
        </div>
        <div style={{height: 83, marginTop: 24, borderRadius: 18, background: C.red, padding: '0 26px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 33,
          fontWeight: 700, opacity: ease(f, 19, 25),
          transform: `translateY(${(1 - settle(f, 19)) * 24}px)`}}>Залишити заявку<Icon name="arrow" size={37}/></div>
      </div>
    </div>
  </AbsoluteFill>;
};

const RealCase: React.FC = () => <Case clip={plan.case_clip}/>;
const scenes = [AdClick, Clarity, Landing, RealCase, Offer, Action];

export const BridgeAdClick: React.FC = () => {
  const {fps} = useVideoConfig();
  const mixGain = Math.pow(10, plan.mix_gain_db / 20);
  return <AbsoluteFill className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <Background/>
    {plan.atmosphere && <Audio src={staticFile(plan.atmosphere)} volume={.75 * mixGain}/>}
    {plan.voiceover && <Audio src={staticFile(plan.voiceover)} volume={plan.voiceover_volume * mixGain}/>}
    {plan.scenes.map((scene, i) => {
      const Component = scenes[i];
      const from = Math.round(scene.start * fps);
      return <Sequence key={scene.id} from={from} durationInFrames={Math.round(scene.end * fps) - from}><Component/></Sequence>;
    })}
    <OfferDeck offerStart={plan.scenes[4].start} actionStart={plan.scenes[5].start}/>
    <Brand/>
    <Captions cues={plan.captions} words={wordData.words}/>
  </AbsoluteFill>;
};
