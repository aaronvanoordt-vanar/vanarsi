/* global React */
const { useState, useEffect, useRef, useMemo } = React;

/* ============ COUNT-UP ON VIEW ============ */
function CountUp({ value, duration = 1600, suffix = "", prefix = "", decimals = 0 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf, started = false, startTime;
    const num = parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const step = (t) => {
          if (!startTime) startTime = t;
          const p = Math.min((t - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(num * eased);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, duration]);
  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-US');
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

/* ============ CURSOR-TRACKING HERO GLOW ============ */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId;
    let tx = 50, ty = 30, cx = 50, cy = 30;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width) * 100;
      ty = ((e.clientY - rect.top) / rect.height) * 100;
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty('--mx', cx + '%');
      el.style.setProperty('--my', cy + '%');
      rafId = requestAnimationFrame(tick);
    };
    const host = el.parentElement;
    host.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      host.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);
  return <div ref={ref} className="cursor-glow" aria-hidden="true"></div>;
}

/* ============ CLIENT MARQUEE ============ */
function ClientMarquee({ t, lang }) {
  const clients = window.VANAR_CLIENTS;
  const row = [...clients, ...clients]; // duplicate for seamless loop
  return (
    <section className="clients-section" id="clients">
      <div className="marquee">
        <div className="marquee-track">
          {row.map((c, i) => (
            <div className="client-logo" key={i} title={c.n}>
              <div className="client-mono">{c.m}</div>
              <div className="client-name">{c.n}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="marquee marquee-reverse">
        <div className="marquee-track">
          {[...clients].reverse().concat([...clients].reverse()).map((c, i) => (
            <div className="client-logo alt" key={i} title={c.n}>
              <div className="client-name mono-sm">◆ {c.n}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ PAIN → SOLUTION SLIDER ============ */
function PainSolution({ lang }) {
  const copy = window.VANAR_EXTRA[lang].pain;
  const [idx, setIdx] = useState(0);
  const [pct, setPct] = useState(50);
  const [hasInteracted, setHasInteracted] = useState(false);
  const current = copy.items[idx];

  // Auto-demo: subtle bounce around 50 to hint at drag
  useEffect(() => {
    if (hasInteracted) return;
    let raf, start = null;
    const loop = (t) => {
      if (!start) start = t;
      const elapsed = t - start;
      if (elapsed > 3200) { setPct(50); return; }
      // Subtle ±3.5% oscillation — enough to notice, not disorienting
      const p = elapsed / 800;
      const wave = Math.sin(p * Math.PI * 2) * 3.5;
      setPct(50 + wave);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [hasInteracted]);

  const onSlide = (v) => { setPct(v); setHasInteracted(true); };
  const onTab = (i) => { setIdx(i); setHasInteracted(true); };

  return (
    <section className="section pain-section" id="pain">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 style={{marginTop: 24}}>
              {lang === 'en' ? (<>Five pains we hear <span className="serif">every week.</span></>) : (<>Cinco dolores que escuchamos <span className="serif">cada semana.</span></>)}
            </h2>
          </div>
          <p>{copy.sub}</p>
        </div>

        <div className="pain-tabs-row">
          <div className="pain-tabs-label">
            <span className="pain-tabs-label-n">01</span>
            <span className="pain-tabs-label-t">{lang === 'en' ? 'Pick a pain →' : 'Elige un dolor →'}</span>
          </div>
          <div className="pain-tabs-v2">
            {copy.items.map((it, i) => (
              <button key={i} className={`pain-chip${i === idx ? ' active' : ''}`} onClick={() => onTab(i)}>
                <span className="pain-chip-n">0{i+1}</span>
                <span className="pain-chip-t">{it.pain.length > 38 ? it.pain.substring(0, 36) + '…' : it.pain}</span>
                <span className="pain-chip-arrow">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pain-stage">
          <div className="pain-panel before" style={{clipPath: `inset(0 ${100 - pct}% 0 0)`}}>
            <div className="pain-panel-head">
              <span className="pain-label before-l">{lang === 'en' ? '← BEFORE — today' : '← ANTES — hoy'}</span>
              <span className="pain-label-num">SYM.0{idx+1}</span>
            </div>
            <div className="pain-quote">"{current.pain}"</div>
            <div className="pain-before-viz">
              <BeforeViz idx={idx} lang={lang} />
            </div>
            <div className="pain-foot">
              <span className="pain-foot-l">{lang === 'en' ? 'Status' : 'Estado'}</span>
              <span className="pain-foot-v pain-foot-risk">● {lang === 'en' ? 'Unmeasured · Reactive' : 'Sin medir · Reactivo'}</span>
            </div>
          </div>

          <div className="pain-panel after" style={{clipPath: `inset(0 0 0 ${pct}%)`}}>
            <div className="pain-panel-head">
              <span className="pain-label after-l">{lang === 'en' ? 'AFTER — with Vanar →' : 'DESPUÉS — con Vanar →'}</span>
              <span className="pain-label-num">VA.0{idx+1}</span>
            </div>
            <div className="pain-solution-text">{current.solution}</div>
            <div className="pain-after-viz">
              <AfterViz idx={idx} metric={current.metric} metric_l={current.metric_l} />
            </div>
            <div className="pain-foot">
              <span className="pain-foot-l">{lang === 'en' ? 'Status' : 'Estado'}</span>
              <span className="pain-foot-v pain-foot-ok">● {lang === 'en' ? 'Operating · Measured' : 'Operando · Medido'}</span>
            </div>
          </div>

          <div className={`pain-divider${hasInteracted ? '' : ' hinting'}`} style={{left: `${pct}%`}}>
            <div className="pain-divider-track"></div>
            <div className="pain-divider-handle">
              <span className="handle-arr handle-arr-l">←</span>
              <span className="handle-arr handle-arr-r">→</span>
            </div>
            {!hasInteracted && (
              <div className="pain-divider-tip">
                {lang === 'en' ? 'DRAG ME →' : '← ARRÁSTRAME →'}
              </div>
            )}
          </div>

          <input
            type="range" min="0" max="100" value={pct}
            onChange={(e) => onSlide(parseInt(e.target.value))}
            className="pain-range" aria-label="Before/After slider"
          />
        </div>
      </div>
    </section>
  );
}

function BeforeViz({ idx, lang }) {
  const vizzes = [
    <ForecastChaos key="0" lang={lang} />,
    <StarRepChaos key="1" lang={lang} />,
    <ConsultantChaos key="2" lang={lang} />,
    <CRMChaos key="3" lang={lang} />,
    <SilosChaos key="4" lang={lang} />,
  ];
  return vizzes[idx] || vizzes[0];
}

/* Pain 0 — Forecast: line chart trending down with ??? gaps */
function ForecastChaos({ lang }) {
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      <defs>
        <pattern id="bh0" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,133,119,0.12)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="400" height="200" fill="url(#bh0)" />
      {/* axis */}
      <line x1="10" y1="170" x2="390" y2="170" stroke="rgba(237,242,255,0.15)" strokeWidth="1"/>
      {/* Plan line (dashed, optimistic) */}
      <path d="M 10 160 Q 120 110, 210 70 T 390 20" stroke="rgba(135,176,255,0.5)" strokeWidth="1.5" fill="none" strokeDasharray="3 4"/>
      <text x="385" y="14" textAnchor="end" fill="#87B0FF" fontSize="9" fontFamily="JetBrains Mono" opacity="0.7">PLAN</text>
      {/* Actual line: erratic, drops below */}
      <path d="M 10 160 L 60 140 L 110 150 L 140 120 L 180 155 L 220 130 L 260 165 L 300 140 L 340 180 L 390 160"
        stroke="#FF8577" strokeWidth="2" fill="none"/>
      {/* ??? markers */}
      <g fill="#FFB070" fontFamily="JetBrains Mono" fontSize="14" fontWeight="700">
        <text x="140" y="110" textAnchor="middle">?</text>
        <text x="220" y="95" textAnchor="middle">?</text>
        <text x="310" y="100" textAnchor="middle">?</text>
      </g>
      {/* Dropped opportunity markers */}
      <g fill="#FF8577">
        <circle cx="140" cy="120" r="3.5"/>
        <circle cx="220" cy="130" r="3.5"/>
        <circle cx="340" cy="180" r="3.5"/>
      </g>
      <text x="200" y="192" textAnchor="middle" fill="#FF8577" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">
        {lang === 'en' ? '● FORECAST vs. REALITY — UNKNOWN' : '● FORECAST vs. REALIDAD — DESCONOCIDO'}
      </text>
    </svg>
  );
}

/* Pain 1 — Star rep: one huge node, many tiny dependent ones */
function StarRepChaos({ lang }) {
  const satellites = [
    {x: 80, y: 55}, {x: 110, y: 140}, {x: 320, y: 45}, {x: 345, y: 115},
    {x: 330, y: 165}, {x: 70, y: 110}, {x: 60, y: 160}, {x: 165, y: 40},
    {x: 275, y: 170}, {x: 145, y: 170},
  ];
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      {/* dependency lines from satellites to star */}
      {satellites.map((s, i) => (
        <line key={i} x1={s.x} y1={s.y} x2="210" y2="100"
          stroke="rgba(255,133,119,0.35)" strokeWidth="1" strokeDasharray="2 3"/>
      ))}
      {/* satellites (team) */}
      {satellites.map((s, i) => (
        <g key={i}>
          <circle cx={s.x} cy={s.y} r="5" fill="#6E7BA0" opacity="0.55"/>
        </g>
      ))}
      {/* star rep */}
      <circle cx="210" cy="100" r="36" fill="rgba(255,133,119,0.12)" stroke="#FF8577" strokeWidth="1.5"/>
      <circle cx="210" cy="100" r="22" fill="#FF8577"/>
      <text x="210" y="105" textAnchor="middle" fill="#0A1430" fontSize="16" fontWeight="700" fontFamily="Inter">★</text>
      <text x="210" y="155" textAnchor="middle" fill="#FF8577" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1.5">
        {lang === 'en' ? 'SINGLE POINT OF FAILURE' : 'PUNTO ÚNICO DE FALLA'}
      </text>
    </svg>
  );
}

/* Pain 2 — Consultants: stack of PPT decks with archive */
function ConsultantChaos({ lang }) {
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      {/* Stacked PPT decks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${60 + i * 6}, ${30 + i * 8})`} opacity={0.4 + i * 0.12}>
          <rect width="120" height="86" rx="2" fill="#1B2550" stroke="#2A3866" strokeWidth="1"/>
          <rect x="10" y="10" width="60" height="4" fill="#FF8577" opacity="0.6"/>
          <rect x="10" y="20" width="100" height="2" fill="#6E7BA0" opacity="0.5"/>
          <rect x="10" y="26" width="80" height="2" fill="#6E7BA0" opacity="0.4"/>
          <rect x="10" y="32" width="90" height="2" fill="#6E7BA0" opacity="0.4"/>
          <rect x="10" y="42" width="100" height="36" fill="#0A1430" opacity="0.7"/>
          <text x="60" y="64" textAnchor="middle" fill="#6E7BA0" fontSize="6" fontFamily="JetBrains Mono">.PPT</text>
        </g>
      ))}
      {/* Arrow to trash */}
      <path d="M 210 95 L 260 95" stroke="#FF8577" strokeWidth="1.5" fill="none" markerEnd="url(#arrHead)"/>
      <defs>
        <marker id="arrHead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF8577"/>
        </marker>
      </defs>
      {/* Trash/archive */}
      <g transform="translate(280, 60)">
        <rect x="0" y="14" width="70" height="60" rx="2" fill="rgba(255,133,119,0.08)" stroke="#FF8577" strokeWidth="1.2" strokeDasharray="3 3"/>
        <rect x="-5" y="6" width="80" height="10" rx="1" fill="#FF8577" opacity="0.2" stroke="#FF8577" strokeWidth="1"/>
        <text x="35" y="48" textAnchor="middle" fill="#FF8577" fontSize="20" fontWeight="300" fontFamily="Inter">✕</text>
      </g>
      <text x="200" y="192" textAnchor="middle" fill="#FF8577" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">
        {lang === 'en' ? '● RECOMMENDATION → ARCHIVE' : '● RECOMENDACIÓN → ARCHIVO'}
      </text>
    </svg>
  );
}

/* Pain 3 — CRM: messy grid with errors, missing data, duplicates */
function CRMChaos({ lang }) {
  const cells = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 10; c++) {
      const rnd = ((r * 31 + c * 17) % 13) / 13;
      let type;
      if (rnd < 0.22) type = 'err';
      else if (rnd < 0.45) type = 'empty';
      else if (rnd < 0.58) type = 'dup';
      else type = 'ok';
      cells.push({ r, c, type });
    }
  }
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      <rect width="400" height="200" fill="rgba(10,20,48,0.3)"/>
      {cells.map((cell, i) => {
        const x = 15 + cell.c * 37;
        const y = 20 + cell.r * 27;
        const colors = {
          err: { bg: 'rgba(255,133,119,0.2)', stroke: '#FF8577' },
          empty: { bg: 'rgba(110,123,160,0.08)', stroke: 'rgba(110,123,160,0.3)' },
          dup: { bg: 'rgba(255,176,112,0.15)', stroke: '#FFB070' },
          ok: { bg: 'rgba(90,139,255,0.1)', stroke: 'rgba(90,139,255,0.3)' },
        };
        const col = colors[cell.type];
        return (
          <g key={i}>
            <rect x={x} y={y} width="34" height="22" rx="1" fill={col.bg} stroke={col.stroke} strokeWidth="0.8"/>
            {cell.type === 'err' && <text x={x+17} y={y+15} textAnchor="middle" fill="#FF8577" fontSize="10" fontWeight="700">!</text>}
            {cell.type === 'empty' && <text x={x+17} y={y+15} textAnchor="middle" fill="rgba(110,123,160,0.5)" fontSize="10">—</text>}
            {cell.type === 'dup' && <text x={x+17} y={y+15} textAnchor="middle" fill="#FFB070" fontSize="9" fontFamily="JetBrains Mono">≡</text>}
            {cell.type === 'ok' && <rect x={x+6} y={y+8} width="22" height="2" fill="rgba(135,176,255,0.5)"/>}
          </g>
        );
      })}
      <text x="200" y="192" textAnchor="middle" fill="#FF8577" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">
        {lang === 'en' ? '● ERRORS · GAPS · DUPLICATES' : '● ERRORES · VACÍOS · DUPLICADOS'}
      </text>
    </svg>
  );
}

/* Pain 4 — Silos: 6 disconnected verticals, broken links */
function SilosChaos({ lang }) {
  const silos = [
    { x: 35, y: 40, label: 'COM' },
    { x: 145, y: 35, label: 'FIN' },
    { x: 255, y: 42, label: 'TEC' },
    { x: 35, y: 115, label: 'LOG' },
    { x: 145, y: 120, label: 'SEG' },
    { x: 255, y: 113, label: 'SAL' },
  ];
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      {/* broken connection lines */}
      {[
        [0,1], [1,2], [0,3], [1,4], [2,5], [3,4], [4,5]
      ].map(([a, b], i) => {
        const s1 = silos[a], s2 = silos[b];
        const mx = (s1.x + s2.x) / 2 + 40;
        const my = (s1.y + s2.y) / 2 + 20;
        return (
          <g key={i}>
            <line x1={s1.x + 40} y1={s1.y + 20} x2={mx - 8} y2={my}
              stroke="rgba(255,133,119,0.35)" strokeWidth="1" strokeDasharray="2 2"/>
            <line x1={mx + 8} y1={my} x2={s2.x + 40} y2={s2.y + 20}
              stroke="rgba(255,133,119,0.35)" strokeWidth="1" strokeDasharray="2 2"/>
            <text x={mx} y={my + 4} textAnchor="middle" fill="#FF8577" fontSize="11" fontWeight="700" fontFamily="Inter">✕</text>
          </g>
        );
      })}
      {/* silos */}
      {silos.map((s, i) => (
        <g key={i} transform={`translate(${s.x}, ${s.y})`}>
          <rect width="80" height="40" rx="2" fill="rgba(27,37,80,0.8)" stroke="#2A3866" strokeWidth="1"/>
          <text x="40" y="25" textAnchor="middle" fill="#6E7BA0" fontSize="12" fontWeight="600" fontFamily="JetBrains Mono" letterSpacing="2">{s.label}</text>
        </g>
      ))}
      <text x="200" y="192" textAnchor="middle" fill="#FF8577" fontSize="9" fontFamily="JetBrains Mono" letterSpacing="2">
        {lang === 'en' ? '● NO SHARED LANGUAGE · NO FLOW' : '● SIN LENGUAJE COMÚN · SIN FLUJO'}
      </text>
    </svg>
  );
}

function AfterViz({ idx, metric, metric_l }) {
  // Structured viz: depends on which pain
  const vizzes = [
    // 0: forecast
    <ForecastLine key="f" />,
    // 1: ramp
    <RampChart key="r" />,
    // 2: pay-for-execution
    <OperationBar key="o" />,
    // 3: clean CRM
    <CRMGrid key="c" />,
    // 4: verticals
    <VerticalHex key="h" />,
  ];
  return (
    <div className="after-viz-wrap">
      {vizzes[idx]}
      <div className="after-metric">
        <div className="after-metric-v">{metric}</div>
        <div className="after-metric-l">{metric_l}</div>
      </div>
    </div>
  );
}

function ForecastLine() {
  const pts = [10,18,22,30,38,42,52,60,72,80,92];
  const band = 6;
  const w = 400, h = 200;
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * w} ${h - (p / 100) * (h - 30) - 10}`).join(' ');
  const upper = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * w} ${h - ((p + band) / 100) * (h - 30) - 10}`).join(' ');
  const lower = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - ((p - band) / 100) * (h - 30) - 10}`).reverse().join(' L ');
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      <defs>
        <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A8BFF" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#5A8BFF" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line key={i} x1="0" y1={h * p} x2={w} y2={h * p} stroke="rgba(90,139,255,0.08)" strokeWidth="1"/>
      ))}
      <path d={`${upper} L ${lower} Z`} fill="url(#fg)" />
      <path d={path} stroke="#5A8BFF" strokeWidth="2" fill="none" />
      <path d={path.replace(/M/, 'M').replace('L 400', 'L 400').split('L').slice(0, -2).join('L')} stroke="#87B0FF" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.5"/>
      {pts.map((p, i) => (
        <circle key={i} cx={(i / (pts.length - 1)) * w} cy={h - (p / 100) * (h - 30) - 10} r="3" fill="#5A8BFF"/>
      ))}
    </svg>
  );
}

function RampChart() {
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      {[0, 30, 60, 90, 120, 150, 180].map((d, i) => (
        <g key={i}>
          <line x1={i * 60 + 20} y1="170" x2={i * 60 + 20} y2="175" stroke="#6E7BA0" strokeWidth="1"/>
          <text x={i * 60 + 20} y="190" textAnchor="middle" fill="#6E7BA0" fontSize="9" fontFamily="JetBrains Mono">D{d}</text>
        </g>
      ))}
      <line x1="20" y1="170" x2="380" y2="170" stroke="rgba(237,242,255,0.12)" strokeWidth="1"/>
      <path d="M 20 170 Q 100 150, 140 80 L 380 30" stroke="#5A8BFF" strokeWidth="2" fill="none"/>
      <path d="M 20 170 Q 150 165, 250 100 L 380 30" stroke="#FF8577" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.6"/>
      <g transform="translate(140, 70)">
        <rect x="-38" y="-14" width="76" height="22" rx="4" fill="rgba(90,139,255,0.15)" stroke="#5A8BFF"/>
        <text x="0" y="2" textAnchor="middle" fill="#87B0FF" fontSize="10" fontFamily="JetBrains Mono">VANAR 30d</text>
      </g>
      <g transform="translate(300, 110)">
        <rect x="-46" y="-14" width="92" height="22" rx="4" fill="rgba(255,133,119,0.1)" stroke="rgba(255,133,119,0.4)"/>
        <text x="0" y="2" textAnchor="middle" fill="#FF8577" fontSize="10" fontFamily="JetBrains Mono" opacity="0.8">INDUSTRY 180d</text>
      </g>
    </svg>
  );
}

function OperationBar() {
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      <g transform="translate(40, 30)">
        <text x="0" y="-8" fill="#6E7BA0" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">CONSULTORAS · DELIVERABLES</text>
        <rect x="0" y="0" width="320" height="28" rx="3" fill="rgba(255,133,119,0.1)" stroke="rgba(255,133,119,0.3)"/>
        <rect x="0" y="0" width="290" height="28" rx="3" fill="rgba(255,133,119,0.25)"/>
        <text x="10" y="18" fill="#FF8577" fontSize="11" fontFamily="JetBrains Mono">90% PPTX · 10% ejecutado</text>
      </g>
      <g transform="translate(40, 100)">
        <text x="0" y="-8" fill="#87B0FF" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">VANAR · OPERACIÓN</text>
        <rect x="0" y="0" width="320" height="28" rx="3" fill="rgba(90,139,255,0.1)" stroke="rgba(90,139,255,0.3)"/>
        <rect x="0" y="0" width="20" height="28" rx="3" fill="rgba(90,139,255,0.4)"/>
        <rect x="20" y="0" width="300" height="28" rx="3" fill="url(#opG)"/>
        <text x="30" y="18" fill="#EDF2FF" fontSize="11" fontFamily="JetBrains Mono">100% operado · en campo</text>
      </g>
      <defs>
        <linearGradient id="opG" x1="0" x2="1">
          <stop offset="0%" stopColor="#2E5FD5"/>
          <stop offset="100%" stopColor="#5A8BFF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function CRMGrid() {
  const cells = Array.from({length: 48}, (_, i) => ({
    ok: i % 5 !== 0 && i % 7 !== 3,
  }));
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      {cells.map((c, i) => {
        const x = (i % 12) * 30 + 20;
        const y = Math.floor(i / 12) * 30 + 30;
        return c.ok
          ? <rect key={i} x={x} y={y} width="24" height="24" rx="3" fill="rgba(90,139,255,0.12)" stroke="rgba(90,139,255,0.3)"/>
          : <rect key={i} x={x} y={y} width="24" height="24" rx="3" fill="rgba(75,211,154,0.3)" stroke="#4BD39A"/>;
      })}
      <text x="20" y="180" fill="#4BD39A" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">■ GOVERNED · AUDITED · OPERABLE</text>
    </svg>
  );
}

function VerticalHex() {
  const labels = ["Comercial", "Finanzas", "Tech", "Logística", "Seguros", "Salud"];
  const cx = 200, cy = 100, r = 70;
  return (
    <svg viewBox="0 0 400 200" className="viz-svg">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(90,139,255,0.15)" strokeDasharray="3 3"/>
      <circle cx={cx} cy={cy} r="14" fill="rgba(90,139,255,0.25)" stroke="#5A8BFF"/>
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#EDF2FF" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">VANAR</text>
      {labels.map((l, i) => {
        const angle = (i / labels.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(90,139,255,0.25)" strokeWidth="1"/>
            <circle cx={x} cy={y} r="6" fill="#5A8BFF"/>
            <text x={x} y={y - 10} textAnchor="middle" fill="#87B0FF" fontSize="9" fontFamily="JetBrains Mono">{l}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============ ROI CALCULATOR ============ */
function ROICalc({ lang }) {
  const copy = window.VANAR_EXTRA[lang].roi;
  // User inputs
  const [channels, setChannels] = useState(2);
  const [employees, setEmployees] = useState(10);
  const [conv, setConv] = useState(1.5); // %
  const [meetings, setMeetings] = useState(25); // qualified meetings/month

  // Vanar target model
  const V = { channels: 7, employees: 5, conv: 7.5, meetings: 12 }; // 12 high-quality meetings

  const COST_PER_EMP = 4.8; // K/month loaded cost per commercial headcount
  const DEAL_VALUE = 18; // K avg deal value (mid-market)
  const CLOSE_RATE_U = 0.18; // base close rate for user's meetings
  const CLOSE_RATE_V = 0.40; // Vanar close rate (quality over volume)

  // User metrics
  const userMonthlyCost = employees * COST_PER_EMP; // K
  const userMonthlyDeals = meetings * CLOSE_RATE_U;
  const userPipelineM = userMonthlyDeals * DEAL_VALUE / 1000; // in M
  const userRevenueY = userPipelineM * 12; // M/year
  const userROI = ((userRevenueY * 1000) / (userMonthlyCost * 12)).toFixed(1);

  // Vanar metrics (always shown for compare)
  const vanarMonthlyCost = V.employees * COST_PER_EMP;
  const vanarMonthlyDeals = V.meetings * CLOSE_RATE_V;
  const vanarPipelineM = vanarMonthlyDeals * DEAL_VALUE / 1000;
  const vanarRevenueY = vanarPipelineM * 12;
  const vanarROI = ((vanarRevenueY * 1000) / (vanarMonthlyCost * 12)).toFixed(1);

  const applyVanar = () => {
    setChannels(V.channels); setEmployees(V.employees);
    setConv(V.conv); setMeetings(V.meetings);
  };

  const fmtM = (v) => `$${v.toFixed(2)}M`;
  const fmtK = (v) => `$${Math.round(v)}K/mo`;

  return (
    <section className="section roi-section" id="roi">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h2 style={{marginTop: 24}}>
              {lang === 'en' ? (<>Adjust your company's <span className="serif">numbers.</span></>) : (<>Ajuste los números <span className="serif">de su empresa.</span></>)}
            </h2>
          </div>
          <p>{copy.sub}</p>
        </div>

        <div className="roi-grid-v2">
          <div className="roi-inputs-v2">
            <div className="roi-preset-row">
              <button className="roi-preset vanar" onClick={applyVanar}>◆ {copy.vanar_preset} →</button>
            </div>

            <RoiLever
              label={copy.channels_l}
              hint={copy.channels_h}
              value={channels} min={1} max={7} step={1}
              format={(v) => `${v} / 7`}
              onChange={setChannels}
              target={V.channels}
              segments={7}
              direction="more-better"
              lang={lang}
            />
            <RoiLever
              label={copy.employees_l}
              hint={copy.employees_h}
              value={employees} min={2} max={40} step={1}
              format={(v) => `${v}`}
              onChange={setEmployees}
              target={V.employees}
              direction="less-better"
              lang={lang}
            />
            <RoiLever
              label={copy.conv_l}
              hint={copy.conv_h}
              value={conv} min={0.5} max={10} step={0.1}
              format={(v) => `${v.toFixed(1)}%`}
              onChange={setConv}
              target={V.conv}
              direction="more-better"
              lang={lang}
            />
            <RoiLever
              label={copy.meetings_l}
              hint={copy.meetings_h}
              value={meetings} min={3} max={60} step={1}
              format={(v) => `${v}/mo`}
              onChange={setMeetings}
              target={V.meetings}
              direction="quality"
              lang={lang}
            />

            <div className="roi-disclaimer">◆ {copy.disclaimer}</div>
          </div>

          <div className="roi-output-v2">
            <div className="roi-compare">
              <div className="roi-col roi-col-you">
                <div className="roi-col-head">
                  <span className="roi-col-tag">{copy.your_preset.toUpperCase()}</span>
                </div>
                <div className="roi-col-metric">
                  <div className="roi-col-v">{fmtM(userPipelineM)}</div>
                  <div className="roi-col-l">{copy.out_pipeline} · /mo</div>
                </div>
                <div className="roi-col-bar"><div className="roi-col-fill you" style={{width: `${Math.min(100, (userPipelineM / vanarPipelineM) * 100)}%`}}></div></div>
                <div className="roi-col-rows">
                  <div><span>{copy.out_cost}</span><b>{fmtK(userMonthlyCost)}</b></div>
                  <div><span>{copy.out_conv}</span><b>{(CLOSE_RATE_U * 100).toFixed(0)}%</b></div>
                  <div><span>{copy.out_roi}</span><b>{userROI}×</b></div>
                </div>
              </div>

              <div className="roi-vs">VS</div>

              <div className="roi-col roi-col-vanar">
                <div className="roi-col-head">
                  <span className="roi-col-tag">◆ VANAR</span>
                </div>
                <div className="roi-col-metric">
                  <div className="roi-col-v serif">{fmtM(vanarPipelineM)}</div>
                  <div className="roi-col-l">{copy.out_pipeline} · /mo</div>
                </div>
                <div className="roi-col-bar"><div className="roi-col-fill vanar" style={{width: `100%`}}></div></div>
                <div className="roi-col-rows">
                  <div><span>{copy.out_cost}</span><b>{fmtK(vanarMonthlyCost)}</b></div>
                  <div><span>{copy.out_conv}</span><b>{(CLOSE_RATE_V * 100).toFixed(0)}%</b></div>
                  <div><span>{copy.out_roi}</span><b className="roi-vanar-strong">{vanarROI}×</b></div>
                </div>
              </div>
            </div>

            <div className="roi-delta-row">
              <div className="roi-delta">
                <span className="roi-delta-l">Δ {lang === 'en' ? 'Pipeline upside' : 'Upside de pipeline'}</span>
                <span className="roi-delta-v serif">+{fmtM(Math.max(0, vanarPipelineM - userPipelineM))}/mo</span>
              </div>
              <a href="#contact" className="btn btn-primary roi-cta">
                {lang === 'en' ? 'Validate with a diagnostic' : 'Validar con un diagnóstico'}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoiLever({ label, hint, value, min, max, step, format, onChange, target, direction, segments, lang }) {
  const pct = ((value - min) / (max - min)) * 100;
  const tgtPct = ((target - min) / (max - min)) * 100;
  // Quality for "less-better": lower is better; for "more-better" higher is better
  const atTarget = direction === 'less-better'
    ? value <= target
    : direction === 'quality'
      ? (value >= 7 && value <= 15)
      : value >= target;
  return (
    <div className={`roi-lever${atTarget ? ' at-target' : ''}`}>
      <div className="roi-lever-head">
        <span className="roi-lever-label">{label}</span>
        <span className="roi-lever-value serif">{format(value)}</span>
      </div>
      <div className="roi-lever-track">
        <div className="roi-lever-fill" style={{width: `${pct}%`}}></div>
        <div className="roi-lever-target" style={{left: `${tgtPct}%`}} title="Vanar target"></div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))}/>
      </div>
      <div className="roi-lever-hint">{hint}</div>
    </div>
  );
}

/* ============ REAL REVENUE OS DASHBOARD ============ */
function RevenueOS({ lang }) {
  const [tab, setTab] = useState('dashboard');
  return (
    <div className="revos">
      <div className="revos-chrome">
        <div className="revos-dots"><span></span><span></span><span></span></div>
        <div className="revos-url">⌕ predictableai.vanarsi.com</div>
        <div style={{flex:1}}></div>
        <span className="revos-mini">v2.6 · live</span>
      </div>
      <div className="revos-body">
        <aside className="revos-side">
          <div className="revos-brand">
            <div className="revos-brand-logo">P</div>
            <div>
              <div className="revos-brand-name">predictable<span style={{color:'var(--accent)'}}>.ai</span></div>
              <div className="revos-brand-sub">REVENUE OS</div>
            </div>
          </div>
          <div className="revos-section-l">OVERVIEW</div>
          <div className="revos-link active"><span className="revos-ico">◆</span>Dashboard</div>
          <div className="revos-section-l">MÓDULO 1</div>
          <div className="revos-link"><span className="revos-ico">▣</span>Market Intelligence <span className="revos-badge">3</span></div>
          <div className="revos-link sub">↳ Matriz de Input</div>
          <div className="revos-link sub">↳ Intelligence Hub</div>
          <div className="revos-link sub">↳ Accionables GTM</div>
          <div className="revos-section-l">MÓDULO 2</div>
          <div className="revos-link"><span className="revos-ico">◇</span>Prospección <span className="revos-badge">2</span></div>
          <div className="revos-link sub">↳ ICP Builder</div>
          <div className="revos-link sub">↳ Apollo Sequences</div>
          <div className="revos-link sub">↳ Mensajes & Cadencias</div>
          <div className="revos-section-l">MÓDULO 3</div>
          <div className="revos-link"><span className="revos-ico">◉</span>Ventas AI <span className="revos-badge">2</span></div>
          <div className="revos-link sub">↳ Meeting Coach</div>
          <div className="revos-link sub">↳ Reportes SDR</div>
          <div className="revos-side-foot">
            <div className="revos-avatar">AV</div>
            <div>
              <div className="revos-user-n">Aarón Vanoordt</div>
              <div className="revos-user-r">Admin · Vanar</div>
            </div>
          </div>
        </aside>

        <main className="revos-main">
          <div className="revos-main-head">
            <div>
              <h3 className="revos-title">Revenue OS</h3>
              <div className="revos-welcome">Bienvenido, Aarón · Semana 15 · Q2 2026</div>
            </div>
            <div className="revos-actions">
              <button className="revos-btn ghost">↗ Exportar</button>
              <button className="revos-btn primary">+ Nueva campaña</button>
            </div>
          </div>

          <div className="revos-kpis">
            <KPI label={lang === 'en' ? 'MEETINGS BOOKED' : 'REUNIONES GENERADAS'} v="42" delta="+13% vs mes anterior" positive/>
            <KPI label={lang === 'en' ? 'CONTACTS IN SEQ' : 'CONTACTOS EN SECUENCIA'} v="1,247" delta="+246 nuevos esta semana" positive/>
            <KPI label={lang === 'en' ? 'EMAIL OPEN RATE' : 'OPEN RATE EMAILS'} v="38.4%" delta="+4.1pp vs benchmark" positive/>
            <KPI label={lang === 'en' ? 'AVG REP SCORE' : 'SCORE VENDEDOR PROMEDIO'} v="74" delta="Basado en 12 meetings"/>
          </div>

          <div className="revos-two">
            <div className="revos-card">
              <div className="revos-card-head">
                <h4>Pipeline generado por semana</h4>
                <div className="revos-card-tabs">
                  <span className="active">4S</span><span>12S</span><span>YTD</span>
                </div>
              </div>
              <div className="revos-legend">
                <span className="lg-dot blue"></span>Emails enviados
                <span className="lg-dot teal"></span>Replies
                <span className="lg-dot green"></span>Meetings
              </div>
              <PipelineChart />
            </div>

            <div className="revos-card">
              <div className="revos-card-head">
                <h4>Canales activos</h4>
              </div>
              <Donut />
              <div className="donut-legend">
                <span><span className="lg-dot blue"></span>Email</span>
                <span><span className="lg-dot teal"></span>LinkedIn</span>
                <span><span className="lg-dot green"></span>WhatsApp</span>
              </div>
            </div>
          </div>

          <div className="revos-modules">
            <ModuleCard n="1" t="Market Intelligence" st="Activo" d="3 insights accionables · Actualizado hace 2h" prog="78% matriz completada"/>
            <ModuleCard n="2" t="Prospección" st="Activo" d="7 secuencias activas · 1,247 contactos" prog="ICP definido · Apollo conectado"/>
            <ModuleCard n="3" t="Ventas AI" st="2 hoy" d="2 reuniones hoy · 12 analizadas" prog="Coach activo · Reporte semanal listo"/>
          </div>
        </main>
      </div>
    </div>
  );
}

function KPI({ label, v, delta, positive }) {
  return (
    <div className="revos-kpi">
      <div className="revos-kpi-l">{label}</div>
      <div className="revos-kpi-v serif">{v}</div>
      <div className={`revos-kpi-d ${positive ? 'pos' : ''}`}>{positive ? '↑' : ''} {delta}</div>
    </div>
  );
}

function PipelineChart() {
  const weeks = [
    { l: 'Sem 12', a: 270, b: 55, c: 20 },
    { l: 'Sem 13', a: 285, b: 60, c: 22 },
    { l: 'Sem 14', a: 210, b: 45, c: 16 },
    { l: 'Sem 15', a: 325, b: 72, c: 28 },
  ];
  const max = 360;
  const w = 520, h = 200, leftPad = 32, rightPad = 12, bottomPad = 28, topPad = 10;
  const chartW = w - leftPad - rightPad;
  const chartH = h - bottomPad - topPad;
  const groupW = chartW / weeks.length;
  const barW = 14, gap = 3;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="pipe-svg">
      {[0, 100, 200, 300].map((v, i) => (
        <g key={i}>
          <line x1={leftPad} y1={topPad + chartH - (v / max) * chartH} x2={w - rightPad} y2={topPad + chartH - (v / max) * chartH} stroke="rgba(237,242,255,0.06)" strokeWidth="1"/>
          <text x={leftPad - 6} y={topPad + chartH - (v / max) * chartH + 3} textAnchor="end" fill="#6E7BA0" fontSize="9" fontFamily="JetBrains Mono">{v}</text>
        </g>
      ))}
      {weeks.map((wk, i) => {
        const cx = leftPad + groupW * i + groupW / 2;
        return (
          <g key={i}>
            <rect x={cx - barW * 1.5 - gap} y={topPad + chartH - (wk.a / max) * chartH} width={barW} height={(wk.a / max) * chartH} fill="#2E5FD5" rx="1"/>
            <rect x={cx - barW / 2} y={topPad + chartH - (wk.b / max) * chartH} width={barW} height={(wk.b / max) * chartH} fill="#4BD39A" rx="1"/>
            <rect x={cx + barW / 2 + gap} y={topPad + chartH - (wk.c / max) * chartH} width={barW} height={(wk.c / max) * chartH} fill="#87B0FF" rx="1"/>
            <text x={cx} y={h - 10} textAnchor="middle" fill="#A9B5D4" fontSize="10" fontFamily="JetBrains Mono">{wk.l}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Donut() {
  const segs = [
    { v: 52, c: '#2E5FD5', l: 'Email' },
    { v: 32, c: '#4BD39A', l: 'LinkedIn' },
    { v: 16, c: '#87B0FF', l: 'WhatsApp' },
  ];
  const total = 100;
  let acc = 0;
  const cx = 80, cy = 80, r = 60, stroke = 16;
  return (
    <svg viewBox="0 0 160 160" className="donut-svg">
      {segs.map((s, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += s.v;
        const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const large = s.v > 50 ? 1 : 0;
        const x1 = cx + Math.cos(start) * r, y1 = cy + Math.sin(start) * r;
        const x2 = cx + Math.cos(end) * r, y2 = cy + Math.sin(end) * r;
        return (
          <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
            stroke={s.c} strokeWidth={stroke} fill="none" strokeLinecap="butt"/>
        );
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fill="#EDF2FF" fontSize="22" fontFamily="Instrument Serif">100%</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="#6E7BA0" fontSize="9" fontFamily="JetBrains Mono">ACTIVOS</text>
    </svg>
  );
}

function ModuleCard({ n, t, st, d, prog }) {
  return (
    <div className="revos-module">
      <div className="revos-module-head">
        <span className="revos-module-n">MÓDULO {n}</span>
        <span className="revos-module-st">{st}</span>
      </div>
      <div className="revos-module-t">{t}</div>
      <div className="revos-module-d">{d}</div>
      <div className="revos-module-bar"><div style={{width: '72%'}}></div></div>
      <div className="revos-module-prog">{prog}</div>
    </div>
  );
}

Object.assign(window, {
  CountUp, CursorGlow, ClientMarquee, PainSolution, ROICalc, RevenueOS,
});
