/* global React */
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

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

function Stats({ t }) {
  return (
    <section className="stats-section">
      <div className="container">
        <SectionHead
          eyebrow={t.stats.title}
          title={null}
          titleRender={() => (
            <span>
              {t.stats.subtitle.split('.').map((part, i, arr) => i < arr.length - 1 ? (
                <span key={i}>{part}<span className="serif" style={{fontStyle:'italic', color:'var(--accent-soft)'}}>.</span>{' '}</span>
              ) : part)}
            </span>
          )}
          sub={null}
        />
        <div className="stats-grid">
          {t.stats.items.map((s, i) => (
            <div className="stat-cell" key={i}>
              <div className="stat-num">{s.k}</div>
              <div className="stat-label">{s.l}</div>
              <div className="stat-src">{s.src}</div>
            </div>
          ))}
        </div>
        <div className="conv">
          <div>
            <div className="conv-title">{t.stats.conv_title}</div>
            <div className="conv-bars">
              <div className="conv-bar">
                <span className="conv-label">{t.stats.conv_none}</span>
                <div className="conv-track"><div className="conv-fill" style={{'--w': '18%', animationDelay: '0.1s', width: 0}}></div></div>
                <span className="conv-val">1–3%</span>
              </div>
              <div className="conv-bar">
                <span className="conv-label">{t.stats.conv_sys}</span>
                <div className="conv-track"><div className="conv-fill ok" style={{'--w': '78%', animationDelay: '0.4s', width: 0}}></div></div>
                <span className="conv-val">5–10%</span>
              </div>
            </div>
          </div>
          <div className="conv-impact">
            <div className="conv-impact-small">— impact</div>
            <div className="conv-impact-big serif">{t.stats.conv_impact}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Problem({ t }) {
  return (
    <section className="section" id="problem">
      <div className="container">
        <span className="eyebrow">{t.problem.eyebrow}</span>
        <h2 style={{
          fontSize: 'clamp(36px, 4.8vw, 68px)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          fontWeight: 450,
          maxWidth: '22ch',
          marginTop: 28,
        }}>
          {t.problem.title.split(' ').map((word, i) => {
            const emphasize = ['sistema', 'system', 'produzca.', 'produces'].includes(word);
            return (
              <span key={i}>
                {emphasize ? <span className="serif" style={{fontStyle:'italic'}}>{word}</span> : word}{' '}
              </span>
            );
          })}
        </h2>
        <p className="problem-lead">{t.problem.lead}</p>
        <div className="problem-grid">
          {t.problem.symptoms.map((s, i) => (
            <div className="symptom" key={i}>
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

function How({ t }) {
  return (
    <section className="section" id="how" style={{background: 'var(--bg-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)'}}>
      <div className="container">
        <SectionHead
          eyebrow={t.how.eyebrow}
          titleRender={() => (
            <span>
              {t.how.title.split('. ').map((part, i, arr) => (
                <span key={i}>
                  {i === 0 ? part : <span className="serif" style={{fontStyle:'italic'}}>{part}</span>}
                  {i < arr.length - 1 ? '. ' : ''}
                </span>
              ))}
            </span>
          )}
          sub={t.how.sub}
        />
        <div className="layers">
          {t.how.layers.map((l, i) => (
            <div className="layer" key={i}>
              <div className="layer-n">/ {l.n}</div>
              <div className="layer-t">{l.t}</div>
              <div className="layer-d">{l.d}</div>
              <div className="layer-tags">
                {l.tags.map((tag, j) => <span className="tag" key={j}>{tag}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ t }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHead
          eyebrow={t.services.eyebrow}
          titleRender={() => (
            <span>
              {t.services.title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="serif" style={{fontStyle:'italic'}}>{t.services.title.split(' ').slice(-1)[0]}</span>
            </span>
          )}
          sub={t.services.sub}
        />
        <div className="services-grid">
          {t.services.items.map((s, i) => (
            <div className="service" key={i}>
              <div className="service-head">
                <span className="service-code">{s.code}</span>
                <span className="service-kpi">{s.kpi}</span>
              </div>
              <h3 className="service-t">{s.t}</h3>
              <p className="service-d">{s.d}</p>
              <div className="service-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Diff({ t, lang }) {
  return (
    <section className="section-tight" style={{paddingTop: 60, paddingBottom: 120}}>
      <div className="container">
        <SectionHead
          eyebrow={t.diff.eyebrow}
          titleRender={() => (
            <span>
              {lang === 'en' ? (
                <>What others <span className="serif" style={{fontStyle:'italic'}}>do.</span> What we <span className="serif" style={{fontStyle:'italic'}}>install.</span></>
              ) : (
                <>Lo que otros <span className="serif" style={{fontStyle:'italic'}}>hacen.</span> Lo que nosotros <span className="serif" style={{fontStyle:'italic'}}>instalamos.</span></>
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

Object.assign(window, { SectionHead, Stats, Problem, How, Services, Diff });
