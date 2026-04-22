/* global React */

function Product({ t, lang }) {
  return (
    <section className="product-section" id="product">
      <div className="container">
        <div className="product-head">
          <div>
            <span className="eyebrow">{t.product.eyebrow}</span>
            <h2 style={{marginTop: 24}}>
              {lang === 'en' ? (
                <>Vanar's <span className="serif" style={{fontStyle:'italic'}}>technology</span> layer.</>
              ) : (
                <>La capa <span className="serif" style={{fontStyle:'italic'}}>tecnológica</span> de Vanar.</>
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
              <path d="M4 14 H24 M24 14 L18 8 M24 14 L18 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="rel-card b">
            <div className="rel-label">{lang === 'en' ? 'Tech startup' : 'Startup tecnológica'}</div>
            <div className="rel-name">{t.product.relationship_b}</div>
            <div className="rel-desc">{t.product.relationship_b_d}</div>
          </div>
        </div>

        <ProductDashboard lang={lang} />

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
        <div className="dash-dot"></div>
        <div className="dash-dot"></div>
        <div className="dash-dot"></div>
        <span className="dash-url">predictableai.vanarsi.com / revenue-risk</span>
      </div>
      <div className="dash-body">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <span>{lang === 'en' ? 'Quarter attainment · probability' : 'Cumplimiento trimestre · probabilidad'}</span>
            <span>Q2 · 2026</span>
          </div>
          <div className="dash-big">94<span style={{fontSize: '0.45em', color: 'rgba(246,243,236,0.4)'}}>%</span></div>
          <div className="dash-small-meta">▲ {lang === 'en' ? '+6 pts vs. last week · coverage 3.2×' : '+6 pts vs. semana pasada · cobertura 3.2×'}</div>
          <div className="dash-bars">
            {bars.map((h, i) => <div key={i} className="dash-bar" style={{height: `${h}%`}}></div>)}
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop: 10, fontFamily:'JetBrains Mono, monospace', fontSize: 10, color:'rgba(246,243,236,0.4)', letterSpacing:'0.05em'}}>
            <span>W14</span><span>W15</span><span>W16</span><span>W17</span><span>W18</span><span>W19</span><span>W20</span><span>W21</span>
          </div>
        </div>
        <div className="dash-panel">
          <div className="dash-panel-head">
            <span>{lang === 'en' ? 'Revenue risk · open accounts' : 'Riesgo de revenue · cuentas abiertas'}</span>
            <span>{lang === 'en' ? 'LIVE' : 'LIVE'}</span>
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
                <>We don't theorize. <span className="serif" style={{fontStyle:'italic'}}>We operate.</span></>
              ) : (
                <>No teorizamos. <span className="serif" style={{fontStyle:'italic'}}>Operamos.</span></>
              )}
            </span>
          )}
          sub={t.proof.sub}
        />
        <div className="proof-grid">
          {t.proof.items.map((p, i) => (
            <div className="proof-cell" key={i}>
              <div className="proof-num">{p.k}</div>
              <div className="proof-label">{p.l}</div>
            </div>
          ))}
        </div>
        <div className="pullquote">"{t.proof.quote}"</div>
        <div className="pullquote-by">{t.proof.quote_by}</div>
      </div>
    </section>
  );
}

function Corp({ t }) {
  return (
    <section className="section-tight" style={{paddingTop: 80, paddingBottom: 120, background: 'var(--bg-2)', borderTop: '1px solid var(--line)'}}>
      <div className="container">
        <SectionHead
          eyebrow={t.corp.eyebrow}
          title={t.corp.title}
          sub={t.corp.sub}
        />
        <div className="corp-grid">
          {t.corp.items.map((c, i) => (
            <div className="corp-cell" key={i}>
              <div className="symptom-num" style={{color: 'var(--ink-mute)'}}>CORP.0{i+1}</div>
              <div className="corp-t" style={{marginTop: 14}}>{c.t}</div>
              <div className="corp-d">{c.d}</div>
            </div>
          ))}
        </div>
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
            <>See how Vanar can make your company's revenue <span className="serif">predictable.</span></>
          ) : (
            <>Conozca cómo Vanar puede volver <span className="serif">predecible</span> el revenue de su empresa.</>
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
              <li><a href="#how">{t.nav.what}</a></li>
              <li><a href="#services">{t.nav.services}</a></li>
              <li><a href="#proof">{t.nav.proof}</a></li>
              <li><a href="#contact">{t.nav.contact}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.cols.product}</h5>
            <ul>
              <li><a href="https://predictableai.vanarsi.com" target="_blank" rel="noopener">Predictable.ai ↗</a></li>
              <li><a href="https://predictableai.vanarsi.com" target="_blank" rel="noopener">{lang === 'en' ? 'Modules' : 'Módulos'}</a></li>
              <li><a href="https://predictableai.vanarsi.com" target="_blank" rel="noopener">{lang === 'en' ? 'Pricing' : 'Precios'}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.cols.resources}</h5>
            <ul>
              <li><a href="#">{lang === 'en' ? 'Executive brief' : 'Informe ejecutivo'}</a></li>
              <li><a href="#">{lang === 'en' ? 'Field data' : 'Datos de campo'}</a></li>
              <li><a href="#">{lang === 'en' ? 'Press' : 'Prensa'}</a></li>
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
          <span>© 2026 VANAR SOLUCIONES INTEGRALES · {lang === 'en' ? 'ALL RIGHTS RESERVED' : 'TODOS LOS DERECHOS RESERVADOS'}</span>
          <span>{lang === 'en' ? 'MAKE REVENUE PREDICTABLE.' : 'MAKE REVENUE PREDICTABLE.'}</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Product, ProductDashboard, Proof, Corp, Contact, Footer });
