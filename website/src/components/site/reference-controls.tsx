"use client";

import { useCallback, useEffect, useId, useRef, useSyncExternalStore, type ReactNode } from "react";
import { ClickWheel } from "click-wheel";
import { Dialog } from "@base-ui/react/dialog";
import { IconNext, IconPause, IconPlay } from "./icons";

import { formatValue, settings, type ReferenceKind } from "./reference-data";
import { ReferenceAudioToolbar, useReferenceAudio } from "./reference-audio";

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-[#cf613e] focus-visible:ring-offset-2 data-[dragging]:cursor-grabbing cursor-grab";
const metal = "bg-[conic-gradient(from_25deg,#969898,#f8f8f5_16%,#9c9f9f_30%,#e4e4e1_48%,#888c8b_65%,#f7f7f4_82%,#969898)]";

function Scale({ labels, radius = 42, start = -135, sweep = 270, rotate = false, className = "" }: {
  labels: readonly (number | string)[]; radius?: number; start?: number; sweep?: number; rotate?: boolean; className?: string;
}) {
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
    {labels.map((label, i) => {
      const degrees = Number((start + i * sweep / (labels.length - 1)).toFixed(3));
      const angle = degrees * Math.PI / 180;
      return <span key={i} className="absolute leading-none" style={{ left: `${Number((50 + Math.sin(angle) * radius).toFixed(3))}%`, top: `${Number((50 - Math.cos(angle) * radius).toFixed(3))}%`, transform: `translate(-50%, -50%)${rotate ? ` rotate(${degrees}deg)` : ""}` }}>{label}</span>;
    })}
  </div>;
}

function Ticks({ count = 41, start = -140, sweep = 280, className = "" }: { count?: number; start?: number; sweep?: number; className?: string }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
    {Array.from({ length: count }, (_, i) => <span key={i} className="absolute inset-0" style={{ rotate: `${Number((start + i * sweep / (count - 1)).toFixed(3))}deg` }}>
      <span className={`absolute top-[3%] left-1/2 w-[0.6%] -translate-x-1/2 bg-current ${i % 5 === 0 ? "h-[5%]" : "h-[2.5%] opacity-60"}`} />
    </span>)}
  </div>;
}

function MovingFace({ children, className = "", start = -135, sweep = 270 }: { children?: ReactNode; className?: string; start?: number; sweep?: number }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-full will-change-transform ${className}`} style={{ rotate: `calc(${start}deg + var(--click-wheel-fraction) * ${sweep}deg)` }}>{children}</div>;
}

function Pointer({ className = "" }: { className?: string }) {
  return <span className={`absolute top-[7%] left-[48%] h-[24%] w-[4%] rounded-full bg-[#f1efdc] shadow-[0_0_2px_#fff6] ${className}`} />;
}

function Braun() {
  return <>
    {/* Keep the grain and lighting in a cached image while the indicator turns. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[url('/images/objects/braun-sk2-face.svg')] bg-cover" />
    <ClickWheel.Ring aria-label={settings.braun.label} aria-describedby="help-braun" getAriaValueText={value => formatValue("braun", value)} className={`absolute -top-[18.4%] -left-[5.9%] size-[115.8%] rounded-full ${focusRing}`}>
      {/* Cast the glass marker's shadow in a fixed light direction as it turns. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 [filter:drop-shadow(0.6cqw_1.3cqw_0.65cqw_#20251f80)]">
        <MovingFace start={75} sweep={settings.braun.sweep}>
          <span data-tuning-indicator className="absolute top-[20.25%] left-[48.4%] size-[3.2%] rounded-full bg-[#bd1709] shadow-[inset_0_0.4px_1px_#ed5032,0_0_1px_#820900]" />
        </MovingFace>
      </div>
    </ClickWheel.Ring>
    <ClickWheel.Center render={<div />} aria-hidden="true" className="absolute top-[21.8%] left-[34.3%] z-20 size-[35.4%] rounded-full" />
  </>;
}

function Sculptor() {
  return <>
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(115deg,#333630,#141612)]" /><div aria-hidden="true" className="absolute -top-[25%] left-[10%] h-[40%] w-[80%] rounded-b-[5cqw] bg-[linear-gradient(90deg,#131513,#62665d_7%,#242821_16%,#11150f_74%,#63685d_96%,#111)] shadow-[0_4px_6px_#000]" />
    <ClickWheel.Ring aria-label={settings.sculptor.label} aria-describedby="help-sculptor" getAriaValueText={value => formatValue("sculptor", value)} className={`absolute top-[10.8%] left-[9.2%] size-[81.3%] rounded-full bg-[repeating-conic-gradient(#111_0deg_1deg,#30322e_1deg_2deg)] shadow-[0_-4px_4px_#000,0_4px_8px_#000] ${focusRing}`}>
      <MovingFace start={0} sweep={settings.sculptor.sweep} className="inset-[2%]! bg-[radial-gradient(ellipse_at_30%_20%,#242723,#111310)] shadow-[inset_0_1px_2px_#5557]">
        <Ticks count={73} start={0} sweep={355} className="text-[#a3a79c]" />
        <Scale labels={Array.from({ length: 19 }, (_, i) => i)} radius={40} start={0} sweep={-settings.sculptor.sweep} rotate className="text-[5cqw] font-light text-[#aeb0a7]" />
      </MovingFace>
    </ClickWheel.Ring>
    <span aria-hidden="true" className="absolute top-[8%] left-[49.5%] h-[4%] w-[1%] bg-[#babbb3]" />
  </>;
}

function Amplifier() {
  return <>
    <div aria-hidden="true" className="absolute inset-0 bg-[#3e4648] bg-[radial-gradient(#9ea5a644_0.5px,transparent_0.9px)] bg-size-[3px_3px]" /><div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[24%] border-t-[1.5cqw] border-[#bcb99d] bg-[#514f43] bg-[repeating-linear-gradient(0deg,transparent_0_2px,#beb396_2px_3px),repeating-linear-gradient(90deg,#d6cbae99_0_1px,transparent_1px_4px)]" /><span aria-hidden="true" className="absolute top-[65%] left-[38.5%] -translate-x-1/2 text-[7cqw] font-bold tracking-[-0.03em] text-[#e4e6e0]">VOLUME</span><span aria-hidden="true" className="absolute top-[6%] left-[38%] h-[4%] w-[1%] bg-[#eee]" />
    <ClickWheel.Ring aria-label={settings.amplifier.label} aria-describedby="help-amplifier" getAriaValueText={value => formatValue("amplifier", value)} className={`absolute top-[8%] left-[11%] size-[55%] rounded-full bg-[#13191b] shadow-[3px_5px_9px_#000b,inset_0_1px_3px_#bbc5c555] ${focusRing}`}>
      <MovingFace start={-15} sweep={settings.amplifier.sweep}>
        <Scale labels={[1,2,3,4,5,6,7,8,9,10]} start={15} sweep={-settings.amplifier.sweep} radius={39} rotate className="[font-family:Arial,Helvetica,sans-serif] text-[7.5cqw] text-[#e9ebe4]" />
        <div className="absolute inset-[25%] rounded-full bg-[repeating-conic-gradient(#121818_0deg_4deg,#657071_4deg_6deg)] shadow-[2px_3px_4px_#000]">
          <div className={`absolute inset-[13%] rounded-full ${metal} shadow-[inset_0_0_3px_#fff]`} />
        </div>
      </MovingFace>
    </ClickWheel.Ring>
  </>;
}

function Guitar() {
  return <>
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,#f2f3ed,#e4e8df_70%,#d8ded3)]" /><div aria-hidden="true" className={`absolute -top-[5%] left-[43%] size-[15%] rounded-full ${metal} shadow-[0_2px_3px_#5556]`}><span className="absolute top-[46%] left-[20%] h-[7%] w-[60%] rotate-45 bg-[#555]" /></div>
    <ClickWheel.Ring aria-label={settings.guitar.label} aria-describedby="help-guitar" getAriaValueText={value => formatValue("guitar", value)} className={`absolute top-[15.5%] left-[16%] size-[67.5%] rounded-full bg-[linear-gradient(140deg,#fffef5,#cdd2c5)] shadow-[3px_6px_7px_#78806a66,inset_0_1px_2px_#fff] ${focusRing}`}>
      <MovingFace start={-150} sweep={settings.guitar.sweep}>
        <Scale labels={[0,1,2,3,4,5,6,7,8,9,10]} start={150} sweep={-settings.guitar.sweep} rotate radius={41} className="[font-family:Arial,Helvetica,sans-serif] text-[6.5cqw] text-[#9a845a] [text-shadow:0_1px_0_#fff]" />
        <div className="absolute inset-[18%] rounded-full bg-[repeating-conic-gradient(#bfc4b5_0deg_1deg,#f7f7ed_1deg_4deg)] shadow-[1px_4px_3px_#87907966]">
          <div className="absolute inset-[6%] flex items-center justify-center rounded-full bg-[linear-gradient(130deg,#fffffa,#e6e9df)] text-[5.2cqw] font-medium tracking-[-0.035em] text-[#a28f6d]">VOLUME</div>
        </div>
      </MovingFace>
    </ClickWheel.Ring>
  </>;
}

function Fellow() {
  return <>
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,#373b33,#282d24)]" /><div aria-hidden="true" className="absolute top-[62%] left-[3%] size-[22%] rounded-full border border-black bg-[linear-gradient(130deg,#494d43,#20231d)] shadow-[1px_2px_3px_#111]" />
    <ClickWheel.Ring aria-label={settings.fellow.label} aria-describedby="help-fellow" getAriaValueText={value => formatValue("fellow", value)} className={`absolute top-[24%] left-[31%] size-[62%] rounded-full border border-[#50534c] bg-[linear-gradient(145deg,#41453e,#262923)] shadow-[-3px_4px_6px_#111c,inset_1px_1px_1px_#74796944] ${focusRing}`}>
      <MovingFace><span className="absolute top-[7%] left-[49%] h-[8%] w-[1.2%] rounded-full bg-[#747b6b]" /></MovingFace>
    </ClickWheel.Ring>
  </>;
}

function Compressor() {
  return <>
    <div aria-hidden="true" className="absolute inset-0 bg-[#29202d] bg-[radial-gradient(#74657744_0.5px,transparent_1px)] bg-size-[3px_3px]" />
    <div className="absolute top-[12%] left-[14%] size-[75%] text-[#efe9e9]">
      <Scale labels={["∞",48,36,30,24,18,12,6,0]} radius={45} className="text-[5.5cqw] font-semibold" />
      <Ticks count={17} start={-135} sweep={270} className="inset-[8%]" />
    <ClickWheel.Ring aria-label={settings.compressor.label} aria-describedby="help-compressor" getAriaValueText={value => formatValue("compressor", value)} className={`absolute inset-[14.667%] rounded-full bg-[linear-gradient(135deg,#4e424b,#1a171d)] shadow-[1px_2px_2px_#0007] ${focusRing}`}>
    {/* The printed 36–48 interval spans twice the units of the other intervals. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full" style={{ rotate: "calc(-45deg - min(var(--click-wheel-fraction) * 270deg, 202.5deg) - max(0deg, var(--click-wheel-fraction) * 135deg - 101.25deg))" }}>
      <span data-compressor-pointer className="absolute bottom-[3%] left-1/2 h-[12%] w-[2%] -translate-x-1/2 bg-[#eee9e3]" />
      <div className="absolute inset-[17%] rounded-full bg-[repeating-conic-gradient(#09090c_0deg_4deg,#444049_4deg_6deg)] shadow-[2px_3px_3px_#000a]">
        <div className={`absolute inset-[13%] rounded-full ${metal}`} />
      </div>
    </div>
  </ClickWheel.Ring>
    </div>
    {[18,72].map(top => <div key={top} aria-hidden="true" className="absolute left-[4%] size-[7%] rounded-full border border-[#120f13] bg-[conic-gradient(#36313a,#09090a,#544b55,#151417,#36313a)] shadow-[1px_1px_3px_#000]" style={{top:`${top}%`}}><span className="absolute top-[44%] left-[20%] h-[10%] w-[60%] -rotate-45 bg-[#08080a]" /></div>)}
    <span aria-hidden="true" className="absolute top-[84%] left-[43%] text-[5cqw] font-bold text-[#eee7ed]">INPUT</span>
  </>;
}

function Espresso({ value }: { value: number }) {
  const id = useId();
  const angle = value / settings.espresso.max * settings.espresso.sweep;
  return <>
    <svg aria-hidden="true" viewBox="0 0 1000 1000" className="pointer-events-none absolute inset-0 size-full">
      <defs>
        <linearGradient id={`${id}-enamel`} x2="1" y2=".6"><stop stopColor="#f9fafc" /><stop offset=".6" stopColor="#e8ebef" /><stop offset="1" stopColor="#d9dfe3" /></linearGradient>
        <linearGradient id={`${id}-barrel`} x1="0" y1="0" x2=".25" y2="1"><stop stopColor="#8d9199" /><stop offset=".16" stopColor="#626770" /><stop offset=".35" stopColor="#33353e" /><stop offset=".57" stopColor="#494b52" /><stop offset=".77" stopColor="#13151c" /><stop offset="1" stopColor="#737782" /></linearGradient>
        <linearGradient id={`${id}-flute`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#9ca2ab" /><stop offset=".15" stopColor="#4a4e56" /><stop offset=".5" stopColor="#22242b" /><stop offset=".8" stopColor="#171920" /><stop offset="1" stopColor="#828892" /></linearGradient>
        <linearGradient id={`${id}-silver`} x1="0" y1="0" x2="1" y2=".7"><stop stopColor="#f3f5f5" /><stop offset=".35" stopColor="#d3d7d9" /><stop offset=".65" stopColor="#f0f1ee" /><stop offset="1" stopColor="#aeb5b8" /></linearGradient>
        <linearGradient id={`${id}-chrome`} x2="0" y2="1"><stop stopColor="#818993" /><stop offset=".13" stopColor="#f8fbff" /><stop offset=".28" stopColor="#30363d" /><stop offset=".42" stopColor="#d8e1e8" /><stop offset=".55" stopColor="#6a7781" /><stop offset=".8" stopColor="#f7f9fa" /><stop offset="1" stopColor="#333b45" /></linearGradient>
        <filter id={`${id}-shadow`} x="-.3" y="-.3" width="1.6" height="1.6"><feGaussianBlur stdDeviation="17" /></filter>
        <path id={`${id}-lettering`} d="M0-138A138 138 0 1 1-.01-138" />
      </defs>
      <rect width="1000" height="1000" fill={`url(#${id}-enamel)`} />
      <path d="M0 865H1000V1000H0Z" fill={`url(#${id}-chrome)`} />
      <path d="M0 875H1000M0 936H1000" stroke="#303a46" strokeWidth="5" />
      <ellipse cx="515" cy="499" rx="345" ry="348" fill="#39404d" opacity=".28" filter={`url(#${id}-shadow)`} />
      <g transform="translate(500 450) scale(1.45)">
        <circle r="239" fill={`url(#${id}-barrel)`} stroke="#a8aeb5" strokeWidth="3" />
        <circle r="219" fill="#353841" stroke="#10131b" strokeWidth="4" />
        <g transform={`rotate(${angle})`}>
          {Array.from({ length: 8 }, (_, i) => <path key={i} d="M-48-232L-40-205Q0-194 40-205L48-232Q0-245-48-232Z" fill={`url(#${id}-flute)`} stroke="#808993" strokeWidth="1.5" transform={`rotate(${i * 45})`} />)}
          <circle r="174" fill={`url(#${id}-silver)`} stroke="#090e16" strokeWidth="5" />
          <circle r="163" fill="none" stroke="#9aa3a9" strokeWidth="1.5" />
          <text fill="#737b82" fontFamily="Arial, sans-serif" fontSize="27" fontWeight="500" textLength="866" lengthAdjust="spacing">
            <textPath href={`#${id}-lettering`}>MICRA · MICRA · MICRA · MICRA · </textPath>
          </text>
          <path d="M-41-26A49 49 0 0 1 34-35M41 26A49 49 0 0 1-34 35" fill="none" stroke="#8a9299" strokeWidth="4" />
          <path d="M-42-28A49 49 0 0 1 32-38M42 28A49 49 0 0 1-32 38" fill="none" stroke="#f7f8f7" strokeWidth="3" />
          <path d="M-214-18L-153-16V17L-214 23ZM214-18L153-16V17L214 23Z" fill="#424955" stroke="#a0a8b1" strokeWidth="3" />
        </g>
      </g>
    </svg>
    <ClickWheel.Ring aria-label={settings.espresso.label} aria-describedby="help-espresso" getAriaValueText={current => formatValue("espresso", current)} className={`absolute top-[10.345%] left-[15.345%] size-[69.31%] rounded-full ${focusRing}`} />
  </>;
}

function IPod({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return <>
    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(120deg,#e1e6e5,#cdd6d8)]" />
    <ClickWheel.Ring aria-label={settings.ipod.label} aria-describedby="help-ipod" getAriaValueText={value => formatValue("ipod", value)} className={`absolute top-[7%] left-[6%] size-[88%] rounded-full border border-[#7e95a44d] bg-[linear-gradient(135deg,#a5b5c4,#93a7bb)] shadow-[inset_0_1px_2px_#d1dae0,0_1px_1px_#c4cdcc] ${focusRing}`}>
      <span aria-hidden="true" className="absolute top-[8%] left-1/2 -translate-x-1/2 text-[4.5cqw] font-bold text-[#e0e2d4]">MENU</span>
      <IconNext className="pointer-events-none absolute top-[45%] left-[7%] size-[9%] rotate-180 text-[#e0e2d4]" />
      <IconNext className="pointer-events-none absolute top-[45%] right-[7%] size-[9%] text-[#e0e2d4]" />
      <span aria-hidden="true" className="absolute bottom-[8%] left-[42%] flex h-[9%] w-[16%] text-[#e0e2d4]"><IconPlay className="size-full" /><IconPause className="size-full" /></span>
      <ClickWheel.Rotor className="pointer-events-none absolute inset-[2%] rounded-full opacity-0 transition-opacity duration-200 [background:conic-gradient(transparent_65%,#f6f7ee44_85%,transparent)] data-[dragging]:opacity-100" />
    </ClickWheel.Ring>
    <ClickWheel.Center onClick={onToggle} aria-label={playing ? "Pause iPod preview" : "Play iPod preview"} aria-pressed={playing} className="absolute top-[34%] left-[33%] z-20 flex size-[34%] cursor-pointer items-center justify-center rounded-full border border-[#97a7ae] bg-[linear-gradient(130deg,#d5dedb,#bac7c8)] text-[#8194a3] shadow-[inset_0_1px_1px_#e4e9e2] outline-none focus-visible:ring-2 focus-visible:ring-[#cf613e] active:shadow-[inset_0_2px_3px_#788d9955]">
      {playing ? <IconPause className="size-[30%]" /> : null}
    </ClickWheel.Center>
  </>;
}

function MXR() {
  return <>
    <div aria-hidden="true" className="absolute inset-0 bg-[#ff911f] bg-[radial-gradient(#ffd48b99_0.6px,transparent_0.9px),linear-gradient(110deg,#ffa333,#ff8d19)] bg-size-[3px_3px,100%_100%]" /><span aria-hidden="true" className="absolute top-[62%] left-1/2 -translate-x-1/2 text-[7cqw] font-black text-[#20140b]">SPEED</span><span aria-hidden="true" className="absolute top-[79%] left-[23%] flex h-[18%] w-[54%] items-center justify-center rounded-[4cqw] border-[1.7cqw] border-[#1f150c] text-[16cqw] leading-none font-black tracking-[-0.08em] text-[#1f150c]">MXR</span><span aria-hidden="true" className="absolute bottom-[6%] left-[2%] -rotate-90 text-[4cqw] font-bold text-[#2e1c0d]">OUTPUT</span><span aria-hidden="true" className="absolute bottom-[6%] right-[3%] rotate-90 text-[4cqw] font-bold text-[#2e1c0d]">INPUT</span>
    <ClickWheel.Ring aria-label={settings.mxr.label} aria-describedby="help-mxr" getAriaValueText={value => formatValue("mxr", value)} className={`absolute top-[12%] left-[27%] size-[46%] rounded-full bg-[#090a08] shadow-[3px_5px_7px_#71340999,inset_0_1px_2px_#63452d] ${focusRing}`}>
      <MovingFace className="bg-[conic-gradient(from_15deg,#0d0e0c_0deg,#4a4d49_22deg,#050605_60deg,#0b0c0a_165deg,#9fa5a3_230deg,#d4d8d3_260deg,#222724_285deg,#080908_315deg)]" start={-135} sweep={270}>
        <div className="absolute inset-[9%] bg-[#050605] [clip-path:polygon(50%_0%,73%_8%,89%_26%,100%_50%,90%_73%,73%_90%,50%_100%,26%_90%,9%_74%,0%_50%,9%_25%,26%_9%)]" />
        <Pointer />
      </MovingFace>
    </ClickWheel.Ring>
  </>;
}

function ReferenceDial({ kind, value, onValueChange, playing, onToggle, onInteractionChange, onValueCommitted, className = "" }: {
  kind: ReferenceKind;
  value: number;
  onValueChange: (value: number) => void;
  playing: boolean;
  onToggle: () => void;
  onInteractionChange: (active: boolean) => void;
  onValueCommitted: (value: number) => void;
  className?: string;
}) {
  const config = settings[kind];
  return <ClickWheel.Root
    value={value} onValueChange={onValueChange}
    onInteractionChange={onInteractionChange} onValueCommitted={onValueCommitted}
    min={config.min} max={config.max} step={config.step}
    unitsPerTurn={(config.max - config.min) * 360 / config.sweep}
    detent={kind === "braun" ? 1 : kind === "sculptor" ? 0.5 : config.step}
    className={`absolute inset-0 [&_[role=slider]]:z-10 ${className}`}
    aria-label={`${config.name} interactive preview`}
  >
    <div className="absolute inset-0 [&_[role=slider]]:touch-none">
      {kind === "braun" ? <Braun /> : kind === "sculptor" ? <Sculptor /> : kind === "amplifier" ? <Amplifier /> : kind === "guitar" ? <Guitar /> : kind === "fellow" ? <Fellow /> : kind === "compressor" ? <Compressor /> : kind === "espresso" ? <Espresso value={value} /> : kind === "ipod" ? <IPod playing={playing} onToggle={onToggle} /> : <MXR />}
    </div>
  </ClickWheel.Root>;
}

export function ReferenceControl({ kind, children }: { kind: ReferenceKind; children: ReactNode }) {
  const config = settings[kind];
  const engine = useReferenceAudio();
  const value = useSyncExternalStore(engine.subscribe, () => engine.getValue(kind), () => config.initial);
  const active = useSyncExternalStore(engine.subscribe, () => engine.getSnapshot().kind === kind, () => false);
  const playing = useSyncExternalStore(engine.subscribe, () => engine.getSnapshot().kind === kind && engine.getSnapshot().status === "playing", () => false);
  const figure = useRef<HTMLElement>(null);
  const state = useRef({ hovering: false, focused: false, interacting: false, expanded: false, timer: 0 });
  const activate = () => engine.activate(kind, engine.getValue(kind));
  const leave = useCallback(() => {
    const current = state.current;
    clearTimeout(current.timer);
    current.timer = 0;
    // A conditional control (such as Retry) can disappear without firing blur.
    const focused = current.focused && figure.current?.contains(document.activeElement);
    if (!current.hovering && !focused && !current.interacting && !current.expanded) engine.leave(kind);
  }, [engine, kind]);
  useEffect(() => {
    const current = state.current;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting && !current.expanded) {
        current.hovering = current.focused = false;
        clearTimeout(current.timer);
        current.timer = 0;
        engine.leave(kind);
      }
    });
    if (figure.current) observer.observe(figure.current);
    const nearby = kind === "braun" ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) engine.prepareRadio();
      else engine.coolRadio();
    }, { rootMargin: "180px" }) : null;
    if (figure.current) nearby?.observe(figure.current);
    return () => { clearTimeout(current.timer); observer.disconnect(); nearby?.disconnect(); };
  }, [engine, kind]);

  const dialProps = {
    kind, value, playing,
    onValueChange: (next: number) => engine.update(kind, next),
    onValueCommitted: (next: number) => { if (kind === "ipod") engine.seek(next); },
    onToggle: () => engine.toggleIpod(),
    onInteractionChange: (active: boolean) => {
      state.current.interacting = active;
      if (kind === "ipod") engine.setScrubbing(active);
      if (active) { activate(); engine.interact(); }
      else leave();
    },
  };
  return <Dialog.Root disablePointerDismissal onOpenChange={open => {
    state.current.expanded = open;
    if (open) { activate(); engine.interact(); }
    else { engine.setScrubbing(false); engine.leave(kind); }
  }}>
    <figure ref={figure} data-reference={kind} className="group/reference relative aspect-square min-w-0 overflow-clip bg-[#eeede7] [container-type:inline-size]">
      <div className="pointer-events-none absolute inset-0">{children}</div>
      <div
        className="absolute inset-0 hidden [@media(min-width:761px)_and_(hover:hover)]:block"
        onPointerEnter={event => {
          if (event.pointerType === "touch" || !event.currentTarget.contains(event.target as Node)) return;
          state.current.hovering = true;
          if (kind === "braun") engine.prepareRadio();
          if (engine.getSnapshot().kind === kind) engine.hold();
          clearTimeout(state.current.timer);
          state.current.timer = 0;
        }}
        onPointerMove={event => {
          if (event.pointerType === "touch" || !event.currentTarget.contains(event.target as Node) || engine.getSnapshot().kind === kind || state.current.timer) return;
          state.current.timer = window.setTimeout(() => { state.current.timer = 0; activate(); }, 150);
        }}
        onPointerLeave={event => {
          if (!event.currentTarget.contains(event.target as Node)) return;
          state.current.hovering = false; leave();
        }}
        onPointerDownCapture={event => {
          if ((event.target as Element).closest("[data-reference-audio-controls]")) return;
          clearTimeout(state.current.timer); state.current.timer = 0; activate(); engine.interact();
        }}
        onFocusCapture={event => {
          const toolbar = event.target.closest("[data-reference-audio-controls]");
          if (toolbar || event.target.matches(":focus-visible")) {
            state.current.focused = true;
            engine.hold();
            if (!toolbar) activate();
          }
        }}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) { state.current.focused = false; leave(); }
        }}
        onKeyDownCapture={event => {
          if ((event.target as Element).closest("[data-reference-audio-controls]")) return;
          if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) { activate(); engine.interact(); }
        }}
      >
        <ReferenceDial {...dialProps} className="opacity-0 transition-opacity duration-300 group-hover/reference:opacity-100 group-has-[:focus-visible]/reference:opacity-100 data-[dragging]:opacity-100 data-[coasting]:opacity-100 motion-reduce:transition-none" />
        {active ? <ReferenceAudioToolbar overlay /> : null}
      </div>
      <Dialog.Trigger aria-label={`Try ${config.name}`} className="absolute inset-0 cursor-zoom-in touch-manipulation outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#606b35] [@media(min-width:761px)_and_(hover:hover)]:hidden" />
      <figcaption className="sr-only">{config.name}. Interactive dial preview.</figcaption>
      <p className="sr-only" id={`help-${kind}`}>Drag around the dial, scroll, or use the arrow keys. Home and End select the limits.</p>
    </figure>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/35 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
      <Dialog.Popup className="fixed bottom-0 left-1/2 z-50 max-h-[calc(100svh-1rem)] w-full max-w-[520px] -translate-x-1/2 overflow-y-auto overscroll-contain rounded-t-2xl border border-[#cbcbbf] bg-[#eeede7] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-[#30332b] shadow-[0_-12px_60px_#0002] outline-none transition-[opacity,translate] duration-200 data-[starting-style]:translate-y-6 data-[ending-style]:translate-y-6 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Dialog.Title className="text-base font-medium tracking-tight">{config.name}</Dialog.Title>
          <Dialog.Close className="min-h-11 shrink-0 cursor-pointer rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Close</Dialog.Close>
        </div>
        <div data-reference-expanded={kind} className="relative mx-auto aspect-square w-[min(100%,calc(100svh-16rem))] overflow-clip bg-[#eeede7] [container-type:inline-size]">
          <ReferenceDial {...dialProps} />
        </div>
        <ReferenceAudioToolbar />
        <Dialog.Description className="mt-2 text-center text-xs leading-relaxed text-[#606354]">
          {kind === "ipod" ? "Drag to seek. Press the center to play or pause." : kind === "braun" ? "Turn to explore eight live stations around the world." : kind === "espresso" ? "Turn clockwise to open the steam valve." : kind === "fellow" ? "Turn up the temperature to preview a rolling boil." : "Drag around the dial to hear the difference."}
        </Dialog.Description>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>;
}
