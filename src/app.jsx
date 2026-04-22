/* global React */
const { useState, useEffect } = React;

function Logo({ withSub = false }) {
  return (
    <div className="logo">
      <img src="assets/vanar-logo-sm.png?v=5" alt="Vanar — Soluciones Integrales" className="logo-img" />
    </div>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle">
      <button className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')}>ES</button>
      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
    </div>
  );
}

function Nav({ t, lang, setLang }) {
  return (
    <nav className="nav">
      <div className="container nav-row">
        <Logo />
        <div className="nav-links">
          <a href="#pillars">{t.nav.services}</a>
          <a href="#how">{t.nav.what}</a>
          <a href="#product">{t.nav.product}</a>
          <a href="#proof">{t.nav.proof}</a>
          <a href="#contact">{t.nav.contact}</a>
        </div>
        <div className="nav-right">
          <LangToggle lang={lang} setLang={setLang} />
          <a href="#contact" className="btn btn-primary" style={{padding: '10px 18px', fontSize: '13.5px'}}>
            {t.nav.cta} <ArrowIcon />
          </a>
        </div>
      </div>
    </nav>
  );
}

function ArrowIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="arrow">
      <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Hero({ t, lang }) {
  const pillarsShort = t.pillars.items.map((p, i) => ({ code: p.code, name: p.t, w: [95, 72, 80, 65, 58, 70][i] + '%' }));
  return (
    <section className="hero">
      <div className="grid-bg"></div>
      <div className="hero-glow"></div>
      <CursorGlow />
      <div className="container">
        <div className="hero-two">
          <div className="hero-left">
        <div className="hero-eyebrow-row">
          <span className="status-dot"></span>
          <span className="eyebrow" style={{paddingLeft: 0}}>{t.hero.eyebrow}</span>
        </div>
        <h1 className="hero-title">
          {t.hero.title_1} <span className="serif">{t.hero.title_2}</span> {t.hero.title_3}
        </h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-primary">{t.hero.cta_primary} <ArrowIcon /></a>
          <a href="#product" className="btn btn-ghost">{t.hero.cta_secondary}</a>
        </div>
        <div className="hero-meta">
          <span>{t.hero.meta_a}</span>
          <span>{t.hero.meta_b}</span>
          <span>{t.hero.meta_c}</span>
        </div>
          </div>
          <div className="hero-right">
            <Globe />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub, titleRender }) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 style={{marginTop: 24}}>{titleRender ? titleRender() : title}</h2>
      </div>
      <div>{sub && <p>{sub}</p>}</div>
    </div>
  );
}

function PillarIcon({ idx }) {
  const icons = [
    // P.01 Commercial — ascending bars with arrow
    <svg key="0" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="30" width="6" height="12"/>
      <rect x="16" y="24" width="6" height="18"/>
      <rect x="26" y="16" width="6" height="26"/>
      <rect x="36" y="8" width="6" height="34"/>
      <path d="M4 14 L16 10 L28 6 L40 2" strokeDasharray="2 3"/>
      <circle cx="40" cy="2" r="2" fill="currentColor" stroke="none"/>
    </svg>,
    // P.02 Finance — stacked coins
    <svg key="1" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="10" rx="14" ry="4"/>
      <path d="M10 10 V18 C10 20 16 22 24 22 C32 22 38 20 38 18 V10"/>
      <path d="M10 18 V28 C10 30 16 32 24 32 C32 32 38 30 38 28 V18"/>
      <path d="M10 28 V38 C10 40 16 42 24 42 C32 42 38 40 38 38 V28"/>
      <line x1="20" y1="10" x2="20" y2="42" strokeWidth="0.8" opacity="0.4"/>
      <line x1="28" y1="10" x2="28" y2="42" strokeWidth="0.8" opacity="0.4"/>
    </svg>,
    // P.03 Technology — nodes + connections
    <svg key="2" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="4"/>
      <circle cx="38" cy="10" r="4"/>
      <circle cx="24" cy="24" r="5"/>
      <circle cx="10" cy="38" r="4"/>
      <circle cx="38" cy="38" r="4"/>
      <line x1="13" y1="12" x2="21" y2="21"/>
      <line x1="35" y1="12" x2="27" y2="21"/>
      <line x1="13" y1="36" x2="21" y2="27"/>
      <line x1="35" y1="36" x2="27" y2="27"/>
      <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none"/>
    </svg>,
    // P.04 Logistics — route with pin
    <svg key="3" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 38 Q 14 20, 22 28 T 42 14" strokeDasharray="2 3"/>
      <rect x="4" y="34" width="8" height="8"/>
      <path d="M42 10 C 46 10, 46 16, 42 20 C 38 16, 38 10, 42 10 Z" fill="currentColor" stroke="none" opacity="0.9"/>
      <circle cx="42" cy="14" r="2" fill="#0A1430" stroke="none"/>
      <circle cx="22" cy="28" r="2" fill="currentColor" stroke="none"/>
    </svg>,
    // P.05 Insurance — shield
    <svg key="4" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 4 L40 10 V24 C40 33 33 40 24 44 C15 40 8 33 8 24 V10 Z"/>
      <path d="M16 24 L22 30 L34 18" strokeWidth="1.8"/>
    </svg>,
    // P.06 Health — pulse with cross
    <svg key="5" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 24 H12 L16 14 L22 34 L28 20 L32 28 L36 24 H44"/>
      <rect x="30" y="4" width="14" height="14" rx="1" opacity="0.2" fill="currentColor" stroke="none"/>
      <line x1="37" y1="7" x2="37" y2="15"/>
      <line x1="33" y1="11" x2="41" y2="11"/>
    </svg>,
  ];
  return <span className="pillar-icon">{icons[idx] || icons[0]}</span>;
}

function Pillars({ t, lang }) {
  return (
    <section className="section pillars-section" id="pillars">
      <div className="container">
        <SectionHead
          eyebrow={t.pillars.eyebrow}
          titleRender={() => (
            <span>
              {lang === 'en' ? (
                <>Six verticals. One principle: <span className="serif">install and operate.</span></>
              ) : (
                <>Seis verticales. Un mismo principio: <span className="serif">instalar y operar.</span></>
              )}
            </span>
          )}
          sub={t.pillars.sub}
        />
        <div className="pillars-grid">
          {t.pillars.items.map((p, i) => (
            <div className={`pillar-card${p.featured ? ' featured' : ''}`} key={i}>
              <div className="pillar-head">
                <span className="pillar-code">{p.code}</span>
                <span className="pillar-kpi">{p.kpi}</span>
              </div>
              <PillarIcon idx={i} />
              <h3 className="pillar-t">{p.t}</h3>
              <p className="pillar-d">{p.d}</p>
              <div className="pillar-foot">
                <span>→</span>
                {p.featured && <span className="pillar-badge">{lang === 'en' ? 'OUR SPECIALTY' : 'NUESTRO FUERTE'}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats({ t }) {
  // Parse stat value; some have "%", "~12%", "408", "55%"
  const parseStat = (k) => {
    const s = String(k);
    const prefix = s.startsWith('~') ? '~' : '';
    const suffix = s.includes('%') ? '%' : '';
    const num = parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
    return { prefix, suffix, num };
  };
  return (
    <section className="stats-section">
      <div className="container">
        <SectionHead
          eyebrow={t.stats.title}
          title={t.stats.subtitle}
          sub={null}
        />
        <div className="stats-grid">
          {t.stats.items.map((s, i) => {
            const { prefix, suffix, num } = parseStat(s.k);
            return (
              <div className="stat-cell" key={i}>
                <div className="stat-num">
                  <CountUp value={num} prefix={prefix} suffix={suffix} duration={1800} />
                </div>
                <div className="stat-label">{s.l}</div>
                <div className="stat-src">{s.src}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Problem({ t, lang }) {
  return (
    <section className="section" id="problem">
      <div className="container">
        <span className="eyebrow">{t.problem.eyebrow}</span>
        <h2 style={{
          fontSize: 'clamp(32px, 4.4vw, 64px)',
          lineHeight: 1.02,
          letterSpacing: '-0.032em',
          fontWeight: 450,
          maxWidth: '22ch',
          marginTop: 28,
          marginBottom: 56,
        }}>
          {lang === 'en' ? (
            <>Leadership on intuition. Operation in silos. <span className="serif">Unpredictable</span> results.</>
          ) : (
            <>Dirección con intuición. Operación en silos. Resultados <span className="serif">impredecibles.</span></>
          )}
        </h2>
        <div className="problem-grid">
          {t.problem.symptoms.map((s, i) => (
            <div className="symptom" key={i}>
              <div className="symptom-x">✕</div>
              <div className="symptom-num">SYM.0{i+1}</div>
              <div className="symptom-t">{s.t}</div>
              <div className="symptom-d">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function How({ t, lang }) {
  const icons = [
    // 01 Diseño — blueprint/compass
    <svg key="a" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="48" height="48" rx="2" opacity="0.3"/>
      <circle cx="32" cy="32" r="12"/>
      <line x1="32" y1="20" x2="32" y2="16"/>
      <line x1="32" y1="48" x2="32" y2="44"/>
      <line x1="20" y1="32" x2="16" y2="32"/>
      <line x1="48" y1="32" x2="44" y2="32"/>
      <circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none"/>
      <path d="M8 22 H14 M8 36 H14 M8 50 H14 M22 8 V14 M36 8 V14 M50 8 V14" opacity="0.4"/>
    </svg>,
    // 02 Implementación — gear + wrench
    <svg key="b" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="10"/>
      <circle cx="32" cy="32" r="4" fill="currentColor" stroke="none"/>
      <path d="M32 8 V16 M32 48 V56 M8 32 H16 M48 32 H56 M15 15 L21 21 M43 43 L49 49 M49 15 L43 21 M21 43 L15 49"/>
    </svg>,
    // 03 Operación — signal bars + pulse
    <svg key="c" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="42" width="8" height="14"/>
      <rect x="20" y="34" width="8" height="22"/>
      <rect x="32" y="24" width="8" height="32"/>
      <rect x="44" y="14" width="8" height="42"/>
      <path d="M4 20 Q 12 8, 24 14 T 44 6 L56 6" opacity="0.6" strokeDasharray="2 2"/>
      <circle cx="56" cy="6" r="2.5" fill="currentColor" stroke="none"/>
    </svg>,
  ];
  return (
    <section className="section how-v2" id="how" style={{background: 'var(--bg-elev)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
      <div className="container">
        <SectionHead
          eyebrow={t.how.eyebrow}
          titleRender={() => (
            <span>
              {lang === 'en' ? (
                <>Three integrated layers. Six verticals. <span className="serif">One single system.</span></>
              ) : (
                <>Tres capas integradas. Seis verticales. <span className="serif">Un solo sistema.</span></>
              )}
            </span>
          )}
          sub={t.how.sub}
        />

        <div className="how-flow">
          {/* Progress rail across all 3 stages */}
          <div className="how-rail" aria-hidden="true">
            <div className="how-rail-line"></div>
            <div className="how-rail-pulse"></div>
            {[0, 50, 100].map((p, i) => (
              <div key={i} className="how-rail-node" style={{left: `${p}%`}}></div>
            ))}
          </div>

          <div className="how-stages">
            {t.how.layers.map((l, i) => (
              <div className="how-stage" key={i}>
                <div className="how-stage-head">
                  <span className="how-stage-n">{l.n}</span>
                  <span className="how-stage-icon">{icons[i]}</span>
                </div>
                <div className="how-stage-t">{l.t}</div>
                <div className="how-stage-d">{l.d.split('.')[0]}.</div>
                <div className="how-stage-tags">
                  {l.tags.slice(0, 4).map((tag, j) => <span className="how-tag" key={j}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* Foot band: outcome chips */}
          <div className="how-outcome">
            <div className="how-outcome-cell">
              <span className="how-outcome-l">{lang === 'en' ? 'Duration' : 'Duración'}</span>
              <span className="how-outcome-v serif">30 – 90d</span>
            </div>
            <div className="how-outcome-cell">
              <span className="how-outcome-l">{lang === 'en' ? 'Deliverable' : 'Entregable'}</span>
              <span className="how-outcome-v">{lang === 'en' ? 'A running system' : 'Un sistema corriendo'}</span>
            </div>
            <div className="how-outcome-cell">
              <span className="how-outcome-l">{lang === 'en' ? 'Billing model' : 'Modelo de cobro'}</span>
              <span className="how-outcome-v">{lang === 'en' ? 'Pay for operation, not reports' : 'Pago por operación, no reportes'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Diff({ t, lang }) {
  return (
    <section className="section-tight">
      <div className="container">
        <SectionHead
          eyebrow={t.diff.eyebrow}
          titleRender={() => (
            <span>
              {lang === 'en' ? (
                <>What others do. <span className="serif">What we install.</span></>
              ) : (
                <>Lo que otros hacen. <span className="serif">Lo que nosotros instalamos.</span></>
              )}
            </span>
          )}
          sub={null}
        />
        <table className="diff-table">
          <thead>
            <tr>
              <th>{lang === 'en' ? 'Category' : 'Categoría'}</th>
              <th>{lang === 'en' ? 'Their focus' : 'Su enfoque'}</th>
              <th>Vanar</th>
            </tr>
          </thead>
          <tbody>
            {t.diff.rows.map((r, i) => (
              <tr key={i}>
                <td className="col-a">{r.a}</td>
                <td className="col-b">{r.b}</td>
                <td className="col-c">{r.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Product({ t, lang }) {
  return (
    <section className="product-section" id="product">
      <div className="container">
        <div className="product-head">
          <div>
            <span className="eyebrow">{t.product.eyebrow}</span>
            <h2 style={{marginTop: 24}}>
              {lang === 'en' ? (
                <>Our <span className="serif">technology</span> layer<br/>for the commercial vertical.</>
              ) : (
                <>Nuestra capa <span className="serif">tecnológica</span><br/>para la vertical comercial.</>
              )}
            </h2>
            <div className="product-tagline">"{t.product.tagline}"</div>
          </div>
          <p className="product-desc">{t.product.desc}</p>
        </div>

        <div className="relationship">
          <div className="rel-card">
            <div className="rel-label">{lang === 'en' ? 'Parent company' : 'Compañía madre'}</div>
            <div className="rel-name">{t.product.relationship_a}</div>
            <div className="rel-desc">{t.product.relationship_a_d}</div>
          </div>
          <div className="rel-arrow">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 14 H24 M24 14 L18 8 M24 14 L18 20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="rel-card b">
            <div className="rel-label">{lang === 'en' ? 'Tech startup' : 'Startup tecnológica'}</div>
            <div className="rel-name">{t.product.relationship_b}</div>
            <div className="rel-desc">{t.product.relationship_b_d}</div>
          </div>
        </div>

        <RevenueOS lang={lang} />

        <div className="modules-block">
          <div className="modules-header">
            <span>{lang === 'en' ? 'Platform modules' : 'Módulos de plataforma'}</span>
            <span>7 / 7 {lang === 'en' ? 'operable' : 'operables'}</span>
          </div>
          <div className="modules-grid">
            {t.product.modules.map((m, i) => (
              <div className="module-chip" key={i}>
                <span className="module-chip-code">M.0{i+1}</span>
                <span className="module-chip-name">{m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="product-cta">
          <div className="product-cta-left">
            <div className="rel-label">{lang === 'en' ? 'Try the product' : 'Conoce el producto'}</div>
            <h4>{lang === 'en' ? 'Start with Predictable.ai — the operating system built from Vanar\'s field methodology.' : 'Empieza con Predictable.ai — el operating system construido desde la metodología de campo de Vanar.'}</h4>
          </div>
          <a href="https://predictableai.vanarsi.com" target="_blank" rel="noopener" className="btn btn-primary-inverse">
            {t.product.cta} <ArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProductDashboard({ lang }) {
  const rows = [
    { nm: lang === 'en' ? 'Acme Holdings · Enterprise' : 'Acme Holdings · Enterprise', val: '$240K', pill: 'ok', pillLabel: 'ON TRACK' },
    { nm: lang === 'en' ? 'Helvetia · Tender Q2' : 'Helvetia · Licitación Q2', val: '$1.8M', pill: 'warn', pillLabel: 'REVIEW' },
    { nm: lang === 'en' ? 'Nordia Bank · Expansion' : 'Nordia Bank · Expansión', val: '$85K', pill: 'ok', pillLabel: 'ON TRACK' },
    { nm: lang === 'en' ? 'Loma Tech · Renewal' : 'Loma Tech · Renovación', val: '$62K', pill: 'risk', pillLabel: 'AT RISK' },
    { nm: lang === 'en' ? 'Brioso Textil · Upsell' : 'Brioso Textil · Upsell', val: '$44K', pill: 'ok', pillLabel: 'ON TRACK' },
  ];
  const bars = [35, 48, 62, 55, 78, 72, 88, 94];
  return (
    <div className="dash">
      <div className="dash-chrome">
        <div className="dash-dot"></div><div className="dash-dot"></div><div className="dash-dot"></div>
        <span className="dash-url">predictableai.vanarsi.com / revenue-risk</span>
      </div>
      <div className="dash-body">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <span>{lang === 'en' ? 'Quarter attainment · probability' : 'Cumplimiento trimestre · probabilidad'}</span>
            <span>Q2 · 2026</span>
          </div>
          <div className="dash-big">94<span style={{fontSize: '0.45em', color: 'var(--ink-mute)'}}>%</span></div>
          <div className="dash-small-meta">▲ {lang === 'en' ? '+6 pts vs. last week · coverage 3.2×' : '+6 pts vs. semana pasada · cobertura 3.2×'}</div>
          <div className="dash-bars">
            {bars.map((h, i) => <div key={i} className="dash-bar" style={{height: `${h}%`}}></div>)}
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop: 10, fontFamily:'JetBrains Mono, monospace', fontSize: 10, color:'var(--ink-mute)', letterSpacing:'0.05em'}}>
            <span>W14</span><span>W15</span><span>W16</span><span>W17</span><span>W18</span><span>W19</span><span>W20</span><span>W21</span>
          </div>
        </div>
        <div className="dash-panel">
          <div className="dash-panel-head">
            <span>{lang === 'en' ? 'Revenue risk · open accounts' : 'Riesgo de revenue · cuentas abiertas'}</span>
            <span>LIVE</span>
          </div>
          <div className="dash-rows">
            {rows.map((r, i) => (
              <div className="dash-row" key={i}>
                <span className="nm">{r.nm}</span>
                <span className="val">{r.val}</span>
                <span className={`pill pill-${r.pill}`}>{r.pillLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Proof({ t, lang }) {
  return (
    <section className="section" id="proof">
      <div className="container">
        <SectionHead
          eyebrow={t.proof.eyebrow}
          titleRender={() => (
            <span>
              {lang === 'en' ? (
                <>We don't theorize. <span className="serif">We operate.</span></>
              ) : (
                <>No teorizamos. <span className="serif">Operamos.</span></>
              )}
            </span>
          )}
          sub={t.proof.sub}
        />
        <div className="proof-grid">
          {t.proof.items.map((p, i) => {
            const s = String(p.k);
            const prefix = s.startsWith('~') ? '~' : '';
            const suffix = /[%+×dx]/i.test(s) ? s.match(/[^0-9.]+$/)?.[0] || '' : '';
            const num = parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
            return (
              <div className="proof-cell" key={i}>
                <div className="proof-num"><CountUp value={num} prefix={prefix} suffix={suffix} duration={1800}/></div>
                <div className="proof-label">{p.l}</div>
              </div>
            );
          })}
        </div>
        <div className="pullquote">
          "{lang === 'en' ? (
            <>We don't promise corporate effort. <span className="hl">We build corporate capacity.</span></>
          ) : (
            <>No promete esfuerzo corporativo. <span className="hl">Construye capacidad corporativa.</span></>
          )}"
        </div>
        <div className="pullquote-by">{t.proof.quote_by}</div>
      </div>
    </section>
  );
}

function Contact({ t, lang }) {
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <span className="eyebrow">{t.contact.eyebrow}</span>
        <h2 className="contact-h">
          {lang === 'en' ? (
            <>See how Vanar can <span className="serif">operate</span> your company's critical areas.</>
          ) : (
            <>Conozca cómo Vanar puede <span className="serif">operar</span> las áreas críticas de su empresa.</>
          )}
        </h2>
        <p className="contact-sub">{t.contact.sub}</p>
        <div className="contact-actions">
          <a href="#" className="btn btn-primary">{t.contact.cta} <ArrowIcon /></a>
          <a href={`mailto:${t.contact.email}`} className="btn btn-ghost">{t.contact.alt} → {t.contact.email}</a>
        </div>
      </div>
    </section>
  );
}

function Footer({ t, lang }) {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="footer-tag">{t.footer.strap}</p>
          </div>
          <div className="footer-col">
            <h5>{t.footer.cols.company}</h5>
            <ul>
              <li><a href="#pillars">{t.nav.services}</a></li>
              <li><a href="#how">{t.nav.what}</a></li>
              <li><a href="#proof">{t.nav.proof}</a></li>
              <li><a href="#contact">{t.nav.contact}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.cols.product}</h5>
            <ul>
              <li><a href="https://predictableai.vanarsi.com" target="_blank" rel="noopener">Predictable.ai ↗</a></li>
              <li><a href="https://predictableai.vanarsi.com" target="_blank" rel="noopener">{lang === 'en' ? 'Modules' : 'Módulos'}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.cols.resources}</h5>
            <ul>
              <li><a href="#">{lang === 'en' ? 'Executive brief' : 'Informe ejecutivo'}</a></li>
              <li><a href="#">{lang === 'en' ? 'Field data' : 'Datos de campo'}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.cols.legal}</h5>
            <ul>
              <li><a href="#">{lang === 'en' ? 'Privacy' : 'Privacidad'}</a></li>
              <li><a href="#">{lang === 'en' ? 'Terms' : 'Términos'}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 VANAR SOLUCIONES INTEGRALES</span>
          <span>MAKE REVENUE PREDICTABLE.</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Logo, Nav, Hero, SectionHead, Pillars, Stats, Problem, How, Diff, Product, Proof, Contact, Footer, ArrowIcon });
