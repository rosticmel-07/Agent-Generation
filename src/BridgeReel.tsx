import React from 'react';
import {
  AbsoluteFill, Audio, Easing, Img, Sequence, interpolate,
  spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import wordData from '../data/words.json';
import captionData from '../data/captions.json';
import sceneData from '../data/scenes.json';

const C = {red: '#ff2535', white: '#f5f4ef', muted: '#939594', bg: '#080a0a', panel: '#121515', line: '#282b2b'};
const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const smooth = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {...clamp, easing: Easing.bezier(.22, 1, .36, 1)});
const reveal = (frame: number, delay = 0) => ({
  opacity: smooth(frame, delay, delay + 10),
  transform: `translateY(${(1 - smooth(frame, delay, delay + 16)) * 38}px)`,
});
const shadow = '0 28px 90px rgba(0,0,0,.42)';

type IconName = 'arrow' | 'search' | 'send' | 'clock' | 'cursor' | 'site' | 'price' | 'bag' | 'check' | 'message' | 'heart' | 'grid' | 'close' | 'chevron' | 'user' | 'pin';
const paths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M4 12h15M13 5l7 7-7 7"/></>,
  search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
  send: <><path d="m3 3 19 8-8 3-3 8-8-19Z"/><path d="m3 3 11 11"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
  cursor: <path d="m5 3 14 11-7 1-3 6-4-18Z"/>,
  site: <><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M7 4v5"/></>,
  price: <><path d="m3 12 9-9h9v9l-9 9-9-9Z"/><circle cx="17" cy="7" r="1"/></>,
  bag: <><rect x="4" y="7" width="16" height="15" rx="3"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></>,
  check: <path d="m5 12 4 4L20 5"/>,
  message: <><path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z"/><path d="M8 10h8M8 14h5"/></>,
  heart: <path d="M12 21 3.5 12.5a5.5 5.5 0 0 1 8.5-7 5.5 5.5 0 0 1 8.5 7L12 21Z"/>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  close: <path d="m5 5 14 14M19 5 5 19"/>,
  chevron: <path d="m9 5 7 7-7 7"/>,
  user: <><circle cx="12" cy="7" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/></>,
  pin: <><path d="M20 9c0 6-8 13-8 13S4 15 4 9a8 8 0 0 1 16 0Z"/><circle cx="12" cy="9" r="3"/></>,
};
const Icon: React.FC<{name: IconName; size?: number; color?: string; style?: React.CSSProperties}> = ({name, size = 44, color = 'currentColor', style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0, ...style}}>{paths[name]}</svg>
);

const Kicker: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div className="small-label" style={{display: 'flex', alignItems: 'center', gap: 20, color: C.muted, ...style}}>
    <span style={{display: 'inline-block', width: 35, height: 2, background: C.red}}/>{children}
  </div>
);

const Heading: React.FC<{children: React.ReactNode; frame: number; label?: string; style?: React.CSSProperties}> = ({children, frame, label, style}) => (
  <div style={{position: 'absolute', top: 330, left: 100, width: 830, ...reveal(frame), ...style}}>
    {label ? <Kicker style={{marginBottom: 30}}>{label}</Kicker> : null}
    <div className="heading">{children}</div>
  </div>
);

const BridgeArc: React.FC<{progress: number; width?: number; height?: number; dim?: boolean}> = ({progress, width = 760, height = 280, dim}) => (
  <svg width={width} height={height} viewBox="0 0 760 280" overflow="visible">
    <defs><filter id="arc-glow"><feGaussianBlur stdDeviation="7"/></filter></defs>
    {Array.from({length: 13}, (_, i) => <path key={i} d={`M${60 + i * 53.33} 238V${92 + Math.abs(6 - i) * 12}`} stroke="#333635" strokeWidth="1" opacity=".48"/>)}
    <path d="M60 238C85 32 675 32 700 238" stroke={C.red} strokeWidth="2" fill="none" opacity=".13"/>
    <path d="M60 238C85 32 675 32 700 238" stroke={C.red} strokeWidth="10" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} opacity={dim ? .1 : .4} filter="url(#arc-glow)"/>
    <path d="M60 238C85 32 675 32 700 238" stroke={C.red} strokeWidth="4" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} opacity={dim ? .35 : 1}/>
    <circle cx="60" cy="238" r="7" fill={C.red}/>
    <circle cx="700" cy="238" r="7" fill={progress > .96 ? C.red : C.bg} stroke={C.red} strokeWidth="2"/>
  </svg>
);

const PostArt: React.FC<{variant: number; size?: number}> = ({variant, size = 190}) => (
  <div style={{width: size, height: size, position: 'relative', overflow: 'hidden', background: ['#242929', '#291b1d', '#202929'][variant % 3]}}>
    <svg width="100%" height="100%" viewBox="0 0 200 200">
      <defs><linearGradient id={`art-${variant}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={variant % 3 === 1 ? '#9a323b' : '#52605b'}/><stop offset="1" stopColor="#17201e"/></linearGradient></defs>
      {variant % 3 === 0 ? <><rect x="42" y="32" width="115" height="132" rx="58" fill={`url(#art-${variant})`}/><path d="M22 139 119 48l69 64-96 68Z" fill="#b8c1b0" opacity=".45"/><circle cx="130" cy="132" r="30" stroke="#dbe2d3" fill="none" strokeWidth="2"/></> : variant % 3 === 1 ? <><circle cx="100" cy="105" r="70" fill={`url(#art-${variant})`}/><path d="M46 127c20-93 105-93 108 0" stroke="#e1b1ad" strokeWidth="3" fill="none"/><path d="m51 78 63 68" stroke="#ee777f" strokeWidth="23"/></> : <><rect x="37" y="34" width="130" height="135" rx="18" fill={`url(#art-${variant})`} transform="rotate(-12 100 100)"/><path d="m60 58 96 71M65 135l81-83" stroke="#a6beb4" strokeWidth="12"/><circle cx="102" cy="98" r="43" fill="none" stroke="#172b23" strokeWidth="3"/></>}
    </svg>
  </div>
);

const ProfilePhone: React.FC<{frame: number; competitor?: boolean}> = ({frame, competitor}) => {
  const {fps} = useVideoConfig();
  const entrance = spring({frame: frame + 10, fps, config: {damping: 24, stiffness: 95}});
  return <div style={{position: 'absolute', left: 176, top: 603, width: 620, height: 792, padding: '30px 28px', background: '#111414', border: '2px solid #343737', borderRadius: 55, boxShadow: shadow, transform: `translateY(${(1 - entrance) * 80}px) rotate(${interpolate(frame, [0, 60], [-2, -1], clamp)}deg)`, overflow: 'hidden'}}>
    <div style={{position: 'absolute', top: 15, left: 245, width: 130, height: 17, background: '#070909', borderRadius: 20}}/>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 34, marginBottom: 28}}>
      <span style={{fontSize: 30, fontWeight: 800}}>{competitor ? 'other.business' : 'your.business'}</span><Icon name="grid" size={30}/>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 25}}>
      <div style={{width: 105, height: 105, padding: 5, borderRadius: '50%', border: `2px solid ${competitor ? '#71938b' : C.red}`}}><div style={{height: '100%', borderRadius: '50%', background: '#242a28', display: 'grid', placeItems: 'center', fontSize: 33, fontWeight: 800}}>{competitor ? 'OB' : 'YB'}</div></div>
      <div style={{flex: 1, display: 'flex', justifyContent: 'space-around', textAlign: 'center', fontSize: 21}}>{[['24', 'дописи'], ['1 204', 'читачі'], ['180', 'стежить']].map(([n, l]) => <div key={l}><strong style={{fontSize: 27}}>{n}</strong><div style={{color: '#b5b7b5', marginTop: 5}}>{l}</div></div>)}</div>
    </div>
    <div style={{fontSize: 25, fontWeight: 800, marginTop: 25}}>Ваш бізнес</div>
    <div style={{fontSize: 23, lineHeight: 1.5, marginTop: 7, color: '#b5b7b5'}}>Послуги для вас<br/>Напишіть нам у Direct</div>
    <div style={{display: 'flex', gap: 9, marginTop: 20, marginBottom: 27}}><div style={{flex: 1, textAlign: 'center', background: '#282c2c', borderRadius: 11, padding: 13, fontSize: 22, fontWeight: 700}}>Стежити</div><div style={{flex: 1, textAlign: 'center', background: '#282c2c', borderRadius: 11, padding: 13, fontSize: 22, fontWeight: 700}}>Повідомлення</div></div>
    <div style={{display: 'flex', gap: 6, flexWrap: 'wrap'}}>{[0, 1, 2, 3, 4, 5].map(v => <div key={v} style={{position: 'relative'}}><PostArt variant={v} size={179}/>{v < 3 ? <div style={{position: 'absolute', left: 14, bottom: 14, fontSize: 17, fontWeight: 800, textShadow: '0 2px 9px #000'}}>{['Послуги', 'Наші роботи', 'Про нас'][v]}</div> : null}</div>)}</div>
    {!competitor ? <div style={{position: 'absolute', left: 340, top: 568, color: C.white, transform: `translate(${interpolate(frame, [0, 35, 52], [70, 0, 0], clamp)}px, ${interpolate(frame, [0, 35, 52], [80, 0, 0], clamp)}px)`, opacity: smooth(frame, 15, 25), filter: 'drop-shadow(0 3px 5px #000)'}}><Icon name="cursor" size={66}/><div style={{position: 'absolute', top: 5, left: 5, width: 38, height: 38, borderRadius: '50%', border: `2px solid ${C.red}`, opacity: interpolate(frame, [38, 48, 55], [0, 1, 0], clamp), transform: `scale(${interpolate(frame, [38, 55], [1, 3], clamp)})`}}/></div> : null}
  </div>;
};

const ProfileScene: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <Heading frame={f + 9} label="Перший клік">Клієнт<br/><span style={{color: C.red}}>уже тут.</span></Heading>
    <ProfilePhone frame={f}/>
  </AbsoluteFill>;
};

const PriceScene: React.FC = () => {
  const f = useCurrentFrame();
  const seconds = f / 30 + 2;
  return <AbsoluteFill>
    <Heading frame={f} label="А далі?">А ціна<br/><span style={{color: C.red}}>де?</span></Heading>
    <div style={{position: 'absolute', left: 100, top: 640, width: 820, height: 697, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 35, overflow: 'hidden', boxShadow: shadow, ...reveal(f, 2)}}>
      <div style={{height: 305, background: '#1c2420', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}><div style={{transform: 'rotate(-12deg) scale(1.5)'}}><PostArt variant={0} size={305}/></div><div style={{position: 'absolute', top: 24, left: 30, fontSize: 21, color: '#d6dfd4'}}>your.business</div><Icon name="heart" size={34} style={{position: 'absolute', top: 24, right: 30}}/></div>
      <div style={{padding: '35px 40px'}}><div style={{fontSize: 45, fontWeight: 800, letterSpacing: -2}}>Ваші послуги</div><div style={{fontSize: 27, color: C.muted, marginTop: 12}}>Деталі — у повідомленнях</div><div style={{marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', border: `1px solid ${seconds >= 2.6 ? C.red : C.line}`, borderRadius: 15, background: seconds >= 2.6 ? '#251114' : '#181b1b'}}><span style={{fontSize: 34, fontWeight: 700}}>Ціна</span><span style={{fontSize: 64, color: C.red, fontWeight: 800, lineHeight: 1}}>?</span></div></div>
    </div>
    <div style={{position: 'absolute', left: 155, top: 1370, width: 710, height: 5, background: '#272b29'}}><div style={{height: 5, width: `${smooth(f, 0, 21) * 50}%`, background: C.red}}/><span style={{position: 'absolute', left: '50%', top: -11, width: 26, height: 26, background: C.bg, border: `2px solid ${C.red}`, transform: 'rotate(45deg)'}}/></div>
  </AbsoluteFill>;
};

const CompetitorScene: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <Heading frame={f} label="Втрачений клієнт" style={{top: 360}}><span style={{display: 'block'}}>Пішов</span><span style={{display: 'block', fontSize: 73, marginTop: 14}}>до</span><span style={{display: 'block', color: C.red, fontSize: 100}}>конкурента.</span></Heading>
    <div style={{position: 'absolute', top: 0, left: -smooth(f, 0, 14) * 1100, opacity: 1 - smooth(f, 0, 14)}}><ProfilePhone frame={25}/></div>
    <div style={{position: 'absolute', left: 100, top: 910, width: 820, ...reveal(f, 5)}}>
      <div style={{display: 'flex', gap: 30, alignItems: 'center', padding: '36px', background: C.panel, border: `1px solid ${C.line}`, borderRadius: 25}}><div style={{width: 92, height: 92, background: '#27372f', borderRadius: 22, display: 'grid', placeItems: 'center'}}><Icon name="site" size={53} color="#c7dbc9"/></div><div style={{flex: 1}}><div style={{fontSize: 36, fontWeight: 800}}>Інший бізнес</div><div style={{fontSize: 25, marginTop: 8, color: C.muted}}>Послуга · ціна · замовлення</div></div><Icon name="arrow" color={C.red}/></div>
      <div style={{marginTop: 50, display: 'flex', alignItems: 'center', gap: 20}}><div style={{width: 18, height: 18, background: C.red, borderRadius: '50%'}}/><div style={{height: 2, background: C.red, width: smooth(f, 6, 26) * 660}}/><Icon name="arrow" color={C.red}/></div>
    </div>
  </AbsoluteFill>;
};

const DirectScene: React.FC = () => {
  const f = useCurrentFrame();
  const globalTime = f / 30 + 4.62;
  const text = 'Добрий день, скільки коштує?';
  const typed = text.slice(0, Math.floor(interpolate(globalTime, [6.06, 6.82], [0, text.length], clamp)));
  return <AbsoluteFill>
    <Heading frame={f} label="Директ — ще один крок">Ще писати.<br/><span style={{color: C.red}}>Ще чекати.</span></Heading>
    <div style={{position: 'absolute', left: 100, top: 659, width: 820, height: 658, borderRadius: 35, background: C.panel, border: `1px solid ${C.line}`, boxShadow: shadow, overflow: 'hidden', ...reveal(f, 5)}}>
      <div style={{height: 120, padding: '30px 35px', display: 'flex', gap: 20, alignItems: 'center', borderBottom: `1px solid ${C.line}`}}><div style={{width: 64, height: 64, background: '#292e2b', display: 'grid', placeItems: 'center', borderRadius: '50%', fontSize: 24, fontWeight: 800}}>YB</div><div style={{fontSize: 29, fontWeight: 800}}>your.business</div><Icon name="message" size={36} style={{marginLeft: 'auto'}}/></div>
      <div style={{padding: '34px', fontSize: 23, color: '#646b67', textAlign: 'center'}}>Сьогодні</div>
      <div style={{margin: '10px 30px 0 72px', minHeight: 160, borderRadius: '26px 26px 7px 26px', padding: '27px 32px', background: '#252b28', fontSize: 36, fontWeight: 600, lineHeight: 1.35, opacity: smooth(f, 32, 40)}}>{typed}<span style={{color: C.red, opacity: globalTime < 6.85 ? 1 : 0}}>|</span></div>
      <div style={{position: 'absolute', right: 50, top: 392, fontSize: 23, color: C.muted, opacity: smooth(f, 73, 81)}}>Надіслано</div>
      <div style={{position: 'absolute', left: 44, bottom: 51, display: 'flex', alignItems: 'center', gap: 20, color: C.muted, opacity: smooth(f, 73, 82)}}><Icon name="clock" size={46} color={C.red}/><span style={{fontSize: 29}}>Очікування відповіді</span></div>
    </div>
  </AbsoluteFill>;
};

const AnswerCard: React.FC<{label: string; icon: IconName; index: number; frame: number; revealAt: number}> = ({label, icon, index, frame, revealAt}) => {
  const {fps} = useVideoConfig();
  const local = frame - revealAt;
  const enter = spring({frame: Math.max(local, 0), fps, config: {damping: 20, stiffness: 110}});
  return <div style={{height: 172, position: 'relative', display: 'flex', gap: 29, alignItems: 'center', padding: '30px 36px', background: 'linear-gradient(105deg,#1e1315,#111615 68%)', border: `1px solid ${local >= 0 ? '#6a2830' : C.line}`, borderRadius: 22, opacity: local < 0 ? .16 : interpolate(enter, [0, 1], [.16, 1]), transform: `translateX(${local < 0 ? 28 : (1 - enter) * 28}px)`}}>
    <div style={{width: 90, height: 90, borderRadius: 21, background: '#2c1419', display: 'grid', placeItems: 'center'}}><Icon name={icon} size={50} color={C.red}/></div>
    <span style={{fontSize: 49, fontWeight: 800, letterSpacing: -2}}>{label}</span>
    <span style={{marginLeft: 'auto', fontSize: 25, color: C.muted, fontWeight: 700}}>0{index + 1}</span>
  </div>;
};

const AnswersScene: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <Heading frame={f} label="Три прості відповіді">Клієнт хоче<br/><span style={{color: C.red}}>зрозуміти.</span></Heading>
    <div style={{position: 'absolute', left: 100, top: 688, width: 820, display: 'flex', flexDirection: 'column', gap: 25}}>
      <AnswerCard label="Послуга" icon="site" index={0} frame={f} revealAt={Math.round((9.84 - 8.26) * 30)}/>
      <AnswerCard label="Ціна" icon="price" index={1} frame={f} revealAt={Math.round((11.16 - 8.26) * 30)}/>
      <AnswerCard label="Замовлення" icon="bag" index={2} frame={f} revealAt={Math.round((12.34 - 8.26) * 30)}/>
    </div>
  </AbsoluteFill>;
};

const SiteCard: React.FC<{frame: number}> = ({frame}) => {
  const globalTime = frame / 30 + 13.66;
  const form = smooth(frame, Math.round((16.24 - 13.66) * 30), Math.round((16.24 - 13.66) * 30) + 9);
  return <div style={{position: 'relative', width: 820, height: 583, borderRadius: 27, border: `1px solid #353b37`, background: '#101614', boxShadow: shadow, overflow: 'hidden'}}>
    <div style={{height: 57, background: '#1d2420', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 8}}>{['#575f5a', '#575f5a', '#575f5a'].map((v, i) => <span key={i} style={{width: 10, height: 10, borderRadius: '50%', background: v}}/>)}<div style={{fontSize: 19, color: '#a9b2ab', textAlign: 'center', flex: 1}}>ваш-бізнес.ua</div><Icon name="site" size={22} color="#a9b2ab"/></div>
    <div style={{position: 'absolute', inset: '57px 0 0', opacity: 1 - form, transform: `translateY(${-form * 35}px)`, padding: '42px'}}>
      <div style={{fontSize: 19, color: '#b5c9bb', letterSpacing: 2}}>ВАШ БІЗНЕС</div>
      <div style={{marginTop: 15, fontSize: 65, fontWeight: 800, letterSpacing: -3, lineHeight: 1.05}}>Ваша послуга.<br/><span style={{color: '#b1c8a9'}}>Чітка пропозиція.</span></div>
      <div style={{marginTop: 22, fontSize: 25, color: '#abb6ae'}}>Усе, що потрібно знати для замовлення.</div>
      <div style={{marginTop: 29, display: 'flex', gap: 15}}>{['Що входить', 'Вартість', 'Як замовити'].map((v, i) => <div key={v} style={{padding: '14px 18px', border: '1px solid #35463c', borderRadius: 13, fontSize: 21, color: '#c9d5cc', background: '#1c2922', opacity: smooth(frame, 7 + i * 4, 17 + i * 4)}}>{v}</div>)}</div>
      <div style={{marginTop: 34, width: 369, height: 75, borderRadius: 15, background: C.red, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px', fontSize: 27, fontWeight: 800, boxShadow: globalTime > 15.72 ? '0 0 45px #ff253533' : undefined}}>Залишити заявку<Icon name="arrow" size={32}/></div>
      <div style={{position: 'absolute', top: 420, left: 360, opacity: smooth(frame, 58, 66), transform: `translate(${(1 - smooth(frame, 60, 77)) * 90}px,${(1 - smooth(frame, 60, 77)) * 70}px)`}}><Icon name="cursor" size={62}/></div>
    </div>
    <div style={{position: 'absolute', inset: '57px 0 0', opacity: form, transform: `translateY(${(1 - form) * 25}px)`, padding: '35px 42px'}}>
      <div style={{fontSize: 48, fontWeight: 800, letterSpacing: -2}}>Залишити заявку</div><div style={{fontSize: 25, color: C.muted, marginTop: 7}}>Ми зв’яжемося з вами</div>
      {['Ваше ім’я', 'Контакт для зв’язку'].map((s, i) => <div key={s} style={{marginTop: i ? 15 : 26, border: '1px solid #35423c', background: '#1b2420', borderRadius: 13, padding: '18px 22px', color: '#b5c4b9', fontSize: 27}}>{s}</div>)}
      <div style={{marginTop: 26, height: 72, background: C.red, borderRadius: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 26px', fontSize: 27, fontWeight: 800}}>Надіслати заявку<Icon name="arrow" size={33}/></div>
    </div>
  </div>;
};

const WebsiteScene: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <Heading frame={f} label="Від першого кліку">В одному місці.<br/><span style={{color: C.red}}>До заявки.</span></Heading>
    <div style={{position: 'absolute', left: 100, top: 691, ...reveal(f)}}><SiteCard frame={f}/></div>
    <div style={{position: 'absolute', left: 120, top: 1194, transform: 'scaleY(.5)', transformOrigin: 'top', pointerEvents: 'none'}}><BridgeArc progress={smooth(f, 28, 73)}/></div>
  </AbsoluteFill>;
};

const PortfolioScene: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill>
    <Heading frame={f} label="Bridge Agency">Створюємо<br/><span style={{color: C.red}}>такі сайти.</span></Heading>
    <div style={{position: 'absolute', left: 100, top: 703, width: 820, border: '1px solid #3b413d', borderRadius: 27, overflow: 'hidden', boxShadow: shadow, ...reveal(f, 3)}}>
      <div style={{height: 58, background: '#202522', display: 'flex', alignItems: 'center', gap: 9, padding: '0 26px'}}>{[0, 1, 2].map(i => <span key={i} style={{width: 10, height: 10, background: '#6a756d', borderRadius: '50%'}}/>)}<span style={{fontSize: 20, color: '#bdc7be', marginLeft: 'auto'}}>Лендинг · реальний проєкт</span></div>
      <div style={{height: 400, overflow: 'hidden', position: 'relative'}}><Img src={staticFile('brand/portfolio.png')} style={{width: '100%', height: 'auto', transform: `scale(${1.02 + smooth(f, 0, 69) * .045}) translateY(${-smooth(f, 0, 69) * 7}px)`, transformOrigin: 'center top'}}/></div>
    </div>
    <div style={{position: 'absolute', left: 104, top: 1220, display: 'flex', gap: 18, alignItems: 'center', ...reveal(f, 9)}}><div style={{width: 10, height: 10, background: C.red, borderRadius: '50%'}}/><span style={{fontSize: 28, color: '#b7bdb7'}}>Композитна сітка — лендинг під заявки</span></div>
  </AbsoluteFill>;
};

const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const change = smooth(f, Math.round((21.42 - 19.36) * 30), Math.round((21.42 - 19.36) * 30) + 8);
  return <AbsoluteFill>
    <div style={{position: 'absolute', top: 304, left: 100, ...reveal(f)}}><Img src={staticFile('brand/logo.png')} style={{width: 232, height: 153, objectFit: 'contain'}}/></div>
    <div style={{position: 'absolute', top: 507, left: 100, width: 830, height: 275, ...reveal(f, 4)}}>
      <div className="heading" style={{position: 'absolute', inset: 0, opacity: 1 - change, transform: `translateY(${-change * 22}px)`}}>Залиш заявку<br/><span style={{color: C.red}}>на сайті.</span></div>
      <div className="heading" style={{position: 'absolute', inset: 0, opacity: change, transform: `translateY(${(1 - change) * 22}px)`}}>Обговоримо<br/><span style={{color: C.red}}>твій бізнес.</span></div>
    </div>
    <div style={{position: 'absolute', top: 787, left: 130, opacity: smooth(f, 8, 18)}}><BridgeArc progress={smooth(f, 10, 68)}/></div>
    <div style={{position: 'absolute', top: 1100, left: 100, width: 820, ...reveal(f, 7)}}>
      <div style={{fontSize: 43, fontWeight: 700, letterSpacing: -1.7, color: C.white, marginBottom: 32}}>bridgeagency.com.ua</div>
      <div style={{height: 130, borderRadius: 65, padding: '0 45px', background: 'linear-gradient(100deg,#ff2739,#e9091c)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 18px 65px #ff253529', fontSize: 41, fontWeight: 800, letterSpacing: -1}}>Залишити заявку<Icon name="arrow" size={52}/></div>
    </div>
  </AbsoluteFill>;
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const cue = captionData.cues.find(c => t >= c.start && t < c.end);
  if (!cue || (t >= 3.34 && t < 4.62)) return null;
  const frameInCue = f - Math.round(cue.start * fps);
  return <div style={{position: 'absolute', top: 1455, left: 83, width: 854, textAlign: 'center', zIndex: 30, opacity: smooth(frameInCue, 0, 3)}}>
    <div style={{display: 'inline-flex', maxWidth: '100%', flexWrap: 'wrap', justifyContent: 'center', columnGap: 14, rowGap: 5, fontSize: 51, fontWeight: 800, letterSpacing: -1.6, lineHeight: 1.27, padding: '17px 25px', background: '#080a0aee', border: '1px solid #ffffff0b', borderRadius: 19}}>
      {cue.word_ids.map(id => {
        const word = wordData.words[id];
        const active = t >= word.start && t < word.end;
        return <span key={id} style={{color: active ? C.red : C.white}}>{word.text}</span>;
      })}
    </div>
  </div>;
};

const Background: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 80% 47%,#64131c29,transparent 48%),radial-gradient(ellipse at 5% 90%,#162c221a,transparent 42%)'}}/>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff04 1px,transparent 1px),linear-gradient(90deg,#ffffff04 1px,transparent 1px)', backgroundSize: '108px 108px', maskImage: 'linear-gradient(#000,transparent 80%)'}}/>
    <div style={{position: 'absolute', top: 1667, left: -15, whiteSpace: 'nowrap', fontSize: 151, fontWeight: 800, letterSpacing: -9, color: '#ffffff03'}}>BRIDGE AGENCY</div>
  </AbsoluteFill>
);

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const index = sceneData.scenes.findIndex(s => t >= s.start && t < s.end);
  const closing = index === 7;
  return <>
    {!closing ? <div style={{position: 'absolute', left: 100, right: 160, top: 149, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><Img src={staticFile('brand/logo.png')} style={{width: 142, height: 94, objectFit: 'contain'}}/><div style={{textAlign: 'right'}}><div style={{fontSize: 20, letterSpacing: 3.4, color: '#b8beb8', fontWeight: 700}}>САЙТИ ДЛЯ БІЗНЕСУ</div><div style={{fontSize: 20, letterSpacing: 2, color: '#6c726e', marginTop: 9}}>BRIDGE AGENCY</div></div></div> : null}
    {!closing ? <div style={{position: 'absolute', top: 276, left: 100, width: 820, height: 1, background: '#ffffff12'}}><div style={{width: 53, height: 2, background: C.red}}/></div> : null}
    <div style={{position: 'absolute', left: 100, top: 1640, width: 820, display: 'flex', gap: 10}}>{sceneData.scenes.map((_, i) => <div key={i} style={{height: 3, flex: 1, background: i <= index ? C.red : '#262c28', opacity: i === index ? 1 : .5}}/>)}</div>
  </>;
};

const components = [ProfileScene, PriceScene, CompetitorScene, DirectScene, AnswersScene, WebsiteScene, PortfolioScene, CtaScene];

export const BridgeReel: React.FC = () => {
  const {fps} = useVideoConfig();
  return <AbsoluteFill className="brand-font" style={{color: C.white, overflow: 'hidden'}}>
    <Background/>
    <Audio src={staticFile('audio/voiceover.mp3')} volume={1.5}/>
    {sceneData.scenes.map((scene, i) => {
      const Component = components[i];
      const from = Math.round(scene.start * fps);
      const end = Math.round(scene.end * fps);
      return <Sequence key={scene.id} from={from} durationInFrames={end - from}><Component/></Sequence>;
    })}
    <Header/>
    <Captions/>
  </AbsoluteFill>;
};
