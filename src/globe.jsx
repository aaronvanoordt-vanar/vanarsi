/* global React */
const { useState: useStateG, useEffect: useEffectG, useRef: useRefG } = React;

// Countries where Vanar operates (approximate capitals/main city)
const VANAR_COUNTRIES = [
  { n: "Perú", lat: -12.04, lon: -77.03 },
  { n: "Colombia", lat: 4.71, lon: -74.07 },
  { n: "México", lat: 19.43, lon: -99.13 },
  { n: "Chile", lat: -33.45, lon: -70.67 },
  { n: "Argentina", lat: -34.60, lon: -58.38 },
  { n: "Ecuador", lat: -0.18, lon: -78.47 },
  { n: "España", lat: 40.42, lon: -3.70 },
  { n: "Estados Unidos", lat: 25.76, lon: -80.19 },
  { n: "Brasil", lat: -23.55, lon: -46.63 },
  { n: "Uruguay", lat: -34.90, lon: -56.16 },
];

// Country outlines as lat/lon polygons (very simplified silhouettes)
// Source: decimated coastline; good enough for a schematic globe
function latLonToXYZ(lat, lon, r) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

function rotateY([x, y, z], a) {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}
function rotateX([x, y, z], a) {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}

function Globe() {
  const ref = useRefG(null);
  const [rot, setRot] = useStateG(0);
  const [hovered, setHovered] = useStateG(null);
  const [paused, setPaused] = useStateG(false);
  const draggingRef = useRefG({ active: false, x: 0, rot0: 0, tilt0: 0 });
  const [tilt, setTilt] = useStateG(-0.35); // slight northward tilt

  useEffectG(() => {
    let rafId;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused && !draggingRef.current.active) {
        setRot(r => r + dt * 0.12);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [paused]);

  const R = 160;
  const cx = 200, cy = 200;

  const dotGrid = [];
  // Generate lat/lon sphere point cloud with land-like distribution via hash
  const LAND = getLandMask();
  const latStep = 6, lonStep = 6;
  for (let lat = -80; lat <= 80; lat += latStep) {
    const lonSpan = Math.max(1, Math.round(360 / lonStep * Math.cos(lat * Math.PI / 180)));
    for (let i = 0; i < lonSpan; i++) {
      const lon = -180 + (360 / lonSpan) * i;
      if (isLand(lat, lon, LAND)) dotGrid.push([lat, lon]);
    }
  }

  // Render country markers
  const markers = VANAR_COUNTRIES.map(c => {
    let p = latLonToXYZ(c.lat, c.lon, R);
    p = rotateY(p, rot);
    p = rotateX(p, tilt);
    const visible = p[2] > -4;
    return { ...c, px: cx + p[0], py: cy - p[1], z: p[2], visible };
  });

  // Render land dots
  const dots = dotGrid.map(([lat, lon]) => {
    let p = latLonToXYZ(lat, lon, R);
    p = rotateY(p, rot);
    p = rotateX(p, tilt);
    return { px: cx + p[0], py: cy - p[1], z: p[2] };
  }).filter(d => d.z > -2);

  // Drag handlers
  const onDown = (e) => {
    draggingRef.current = { active: true, x: e.clientX || (e.touches && e.touches[0].clientX), rot0: rot, tilt0: tilt, y: e.clientY || (e.touches && e.touches[0].clientY) };
  };
  const onMove = (e) => {
    if (!draggingRef.current.active) return;
    const cx = e.clientX || (e.touches && e.touches[0].clientX);
    const cyE = e.clientY || (e.touches && e.touches[0].clientY);
    const dx = cx - draggingRef.current.x;
    const dy = cyE - draggingRef.current.y;
    setRot(draggingRef.current.rot0 + dx * 0.008);
    setTilt(Math.max(-1.2, Math.min(1.2, draggingRef.current.tilt0 - dy * 0.008)));
  };
  const onUp = () => { draggingRef.current.active = false; };

  useEffectG(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  });

  return (
    <div className="globe-wrap" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <svg viewBox="0 0 400 400" className="globe-svg"
        onMouseDown={onDown} onTouchStart={onDown} ref={ref}
      >
        <defs>
          <radialGradient id="g-sphere" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#1F3A7A" stopOpacity="0.6"/>
            <stop offset="55%" stopColor="#0E1F4A" stopOpacity="0.55"/>
            <stop offset="100%" stopColor="#050A1C" stopOpacity="1"/>
          </radialGradient>
          <radialGradient id="g-rim" cx="50%" cy="50%">
            <stop offset="88%" stopColor="transparent"/>
            <stop offset="92%" stopColor="rgba(90,139,255,0.5)"/>
            <stop offset="100%" stopColor="rgba(90,139,255,0)"/>
          </radialGradient>
          <radialGradient id="g-glow">
            <stop offset="0%" stopColor="rgba(90,139,255,0.25)"/>
            <stop offset="60%" stopColor="rgba(90,139,255,0.06)"/>
            <stop offset="100%" stopColor="rgba(90,139,255,0)"/>
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={R + 40} fill="url(#g-glow)" />
        <circle cx={cx} cy={cy} r={R} fill="url(#g-sphere)" />
        {/* Meridians + parallels */}
        <g stroke="rgba(90,139,255,0.15)" strokeWidth="0.6" fill="none">
          {[0.3, 0.6, 0.85, 1].map((k, i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={R * k} ry={R} opacity="0.4"/>
          ))}
          {[0.3, 0.6, 0.85, 1].map((k, i) => (
            <ellipse key={`p-${i}`} cx={cx} cy={cy} rx={R} ry={R * k} opacity="0.4"/>
          ))}
        </g>
        {/* Land dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.px} cy={d.py}
            r={d.z > 0 ? 1.3 : 0.9}
            fill="#5A8BFF"
            opacity={d.z > 0 ? Math.min(0.7, 0.35 + d.z / R * 0.5) : 0.12}
          />
        ))}
        <circle cx={cx} cy={cy} r={R} fill="url(#g-rim)" pointerEvents="none"/>
        {/* Country markers + always-on labels */}
        {markers.map((m, i) => m.visible && (
          <g key={i} style={{cursor: 'pointer'}}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
          >
            <circle cx={m.px} cy={m.py} r="14" fill="#4BD39A" opacity="0.12">
              <animate attributeName="r" values="6;18;6" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.22}s`}/>
              <animate attributeName="opacity" values="0.28;0;0.28" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.22}s`}/>
            </circle>
            <circle cx={m.px} cy={m.py} r="3.5" fill="#4BD39A" stroke="#EDF2FF" strokeWidth="0.8"/>
            {/* Leader line + label */}
            <line
              x1={m.px} y1={m.py}
              x2={m.px + (m.px > cx ? 18 : -18)} y2={m.py - 10}
              stroke="rgba(75,211,154,0.55)" strokeWidth="0.8"
            />
            <g transform={`translate(${m.px + (m.px > cx ? 22 : -22)} ${m.py - 12})`}>
              <text
                textAnchor={m.px > cx ? 'start' : 'end'}
                fill="#EDF2FF"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                letterSpacing="0.1em"
                style={{paintOrder: 'stroke', stroke: 'rgba(5,10,28,0.85)', strokeWidth: 3, strokeLinejoin: 'round'}}
              >{m.n.toUpperCase()}</text>
            </g>
          </g>
        ))}
      </svg>
      <div className="globe-foot">
        <div className="globe-foot-l">
          <span className="globe-foot-n">{VANAR_COUNTRIES.length}</span>
          <span className="globe-foot-x">países · operaciones activas</span>
        </div>
        <div className="globe-foot-r">
          <span className="globe-dot-live"></span>
          <span>LIVE · drag to rotate</span>
        </div>
      </div>
    </div>
  );
}

// --- Land mask: hash-based but tuned to resemble continents
function getLandMask() {
  // Approximate continent bounding rectangles
  return [
    // North America
    { lat: [15, 72], lon: [-170, -52], density: 0.85 },
    // Central America
    { lat: [7, 25], lon: [-110, -77], density: 0.95 },
    // South America
    { lat: [-56, 12], lon: [-82, -34], density: 0.9 },
    // Europe
    { lat: [36, 71], lon: [-10, 40], density: 0.9 },
    // Africa
    { lat: [-35, 37], lon: [-18, 52], density: 0.92 },
    // Middle East
    { lat: [12, 42], lon: [25, 60], density: 0.85 },
    // Asia
    { lat: [5, 75], lon: [60, 145], density: 0.88 },
    // Southeast Asia / Indonesia
    { lat: [-10, 8], lon: [95, 140], density: 0.55 },
    // Australia
    { lat: [-39, -10], lon: [113, 154], density: 0.85 },
    // Greenland
    { lat: [60, 82], lon: [-55, -18], density: 0.7 },
    // Japan
    { lat: [30, 45], lon: [130, 145], density: 0.7 },
    // UK
    { lat: [50, 59], lon: [-8, 2], density: 0.8 },
    // NZ
    { lat: [-47, -34], lon: [166, 178], density: 0.65 },
  ];
}
function hash(x, y) {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
}
function isLand(lat, lon, mask) {
  for (const m of mask) {
    if (lat >= m.lat[0] && lat <= m.lat[1] && lon >= m.lon[0] && lon <= m.lon[1]) {
      if (hash(lat, lon) < m.density) return true;
    }
  }
  return false;
}

Object.assign(window, { Globe });
