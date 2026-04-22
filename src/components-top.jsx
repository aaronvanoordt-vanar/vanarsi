/* global React */
const { useState, useEffect, useRef } = React;

function Logo() {
  return (
    <div className="logo">
      <div className="logo-mark">
        <svg viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="4" height="16" fill="currentColor"/>
          <rect x="10" y="4" width="4" height="16" fill="currentColor" opacity="0.55"/>
          <rect x="18" y="4" width="4" height="16" fill="currentColor" opacity="0.25"/>
        </svg>
      </div>
      <span>Vanar</span>
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
          <a href="#how">{t.nav.what}</a>
          <a href="#services">{t.nav.services}</a>
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
      <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Hero({ t }) {
  return (
    <section className="hero">
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
            {typeof Globe !== 'undefined' ? <Globe /> : null}
          </div>
        </div>
        <HeroVisual lang={t.nav.what === 'What we do' ? 'en' : 'es'} />
      </div>
    </section>
  );
}

function HeroVisual({ lang }) {
  const stagesEs = [
    { n: "01", name: "Target & ICP" },
    { n: "02", name: "Hunting" },
    { n: "03", name: "Qualification" },
    { n: "04", name: "Closing" },
    { n: "05", name: "Retention" },
    { n: "06", name: "Expansion" },
  ];
  const stagesEn = stagesEs;
  const stages = lang === 'en' ? stagesEn : stagesEs;
  return (
    <div className="hero-visual reveal">
      <div className="hero-visual-header">
        <span className="hero-visual-title">{lang === 'en' ? 'Commercial execution — live system map' : 'Ejecución comercial — mapa de sistema en vivo'}</span>
        <span>{lang === 'en' ? 'REV.OS / v2.6' : 'REV.OS / v2.6'}</span>
      </div>
      <div className="funnel">
        {stages.map((s, i) => (
          <div className="funnel-stage" key={i}>
            <div className="funnel-stage-num">{s.n}</div>
            <div className="funnel-stage-name">{s.name}</div>
            <div className="funnel-stage-bar" style={{'--i': i}}></div>
          </div>
        ))}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:16, fontFamily:'JetBrains Mono, monospace', fontSize:11, color:'var(--ink-mute)', letterSpacing: '0.05em'}}>
        <span>◆ {lang === 'en' ? 'Coverage 3.2x' : 'Cobertura 3.2×'}</span>
        <span>◆ {lang === 'en' ? 'Forecast accuracy 94%' : 'Precisión de forecast 94%'}</span>
        <span>◆ {lang === 'en' ? 'Win rate +28%' : 'Win rate +28%'}</span>
        <span>◆ {lang === 'en' ? 'Cycle −22%' : 'Ciclo −22%'}</span>
      </div>
    </div>
  );
}

Object.assign(window, { Logo, Nav, Hero, ArrowIcon });
