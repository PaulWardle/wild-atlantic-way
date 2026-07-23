import type { MapGeometry } from '../lib/geo'
import { c } from '../theme'

/**
 * The hand-authored Ireland map: coastline, the WAW route (rust), the lead-in
 * (dashed), the ferry hops, landmarks, cities, the live "we are here" pin and the
 * green completed-route line. Shared by the home card, the landing gate and the
 * full-screen map.
 */
export function MapSVG({ geo, maxWidth }: { geo: MapGeometry; maxWidth?: number }) {
  return (
    <svg
      viewBox={`0 0 ${geo.eMapW} ${geo.eMapH}`}
      style={{ width: '100%', height: 'auto', display: 'block', maxWidth: maxWidth ? maxWidth : undefined }}
    >
      <path d={geo.eIreland} fill={c.paperMapFill} stroke={c.ink} strokeWidth={1.4} strokeLinejoin="round" />

      <text
        x={geo.eWawX}
        y={geo.eWawTheY}
        textAnchor="middle"
        fontFamily="'Oswald',sans-serif"
        fontWeight={500}
        fontSize={9}
        letterSpacing={4}
        fill={c.rust}
      >
        THE
      </text>
      <text
        x={geo.eWawX}
        y={geo.eWawWayY}
        textAnchor="middle"
        fontFamily="'Oswald',sans-serif"
        fontWeight={700}
        fontSize={19}
        letterSpacing={0.5}
        fill="#5a4f3b"
      >
        WILD ATLANTIC WAY
      </text>

      {geo.eCities.map((p, i) => (
        <circle key={`c${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.fill} stroke={c.paperMapFill} strokeWidth={1} />
      ))}

      <path d={geo.eFerryIn} fill="none" stroke={c.inkFainter} strokeWidth={1.3} strokeDasharray="3 4" strokeLinecap="round" />
      <path d={geo.eHome} fill="none" stroke={c.inkFainter} strokeWidth={1.3} strokeDasharray="3 4" strokeLinecap="round" />

      {/* Thin solid route that hugs the coast; lead-in kept dashed to set it apart. */}
      <path d={geo.eLead} fill="none" stroke={c.leadIn} strokeWidth={1.5} strokeDasharray="5 4" strokeLinejoin="round" strokeLinecap="round" />
      <path d={geo.eOff} fill="none" stroke={c.rust} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
      {geo.eLiveActive && (
        <path d={geo.eDone} fill="none" stroke={c.greenLine} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round" />
      )}

      {geo.eLandmarks.map((p, i) => (
        <circle key={`l${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.fill} stroke={c.paperMapFill} strokeWidth={1} />
      ))}

      {geo.eLabels.map((l, i) => (
        <text
          key={`t${i}`}
          x={l.x}
          y={l.y}
          textAnchor={l.a}
          fontFamily="'Oswald',sans-serif"
          fontWeight={l.w}
          fontSize={10.5}
          fill={l.f}
        >
          {l.t}
        </text>
      ))}

      <g>
        <circle cx={geo.eInX} cy={geo.eInY} r={5.5} fill="#f4ecd6" stroke={c.ink} strokeWidth={1.5} />
        <circle cx={geo.eInX} cy={geo.eInY} r={2} fill={c.ink} />
      </g>
      <g>
        <circle cx={geo.eHomeX} cy={geo.eHomeY} r={5.5} fill="#f4ecd6" stroke={c.ink} strokeWidth={1.5} />
        <circle cx={geo.eHomeX} cy={geo.eHomeY} r={2} fill={c.ink} />
      </g>

      <text x={geo.eEdgeX} y={geo.eFerryInLabelY} textAnchor="end" fontFamily="'Space Mono',monospace" fontSize={8.5} fill={c.inkFainter}>
        ← FERRY IN
      </text>
      <text x={geo.eEdgeX} y={geo.eFerryHomeLabelY} textAnchor="end" fontFamily="'Space Mono',monospace" fontSize={8.5} fill={c.inkFainter}>
        FERRY HOME →
      </text>

      {geo.eLiveActive && (
        <g transform={`translate(${geo.eLiveX} ${geo.eLiveY})`}>
          <circle
            r={8}
            fill="none"
            stroke={c.rust}
            strokeWidth={1.8}
            style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'waw-ping 2s ease-out infinite' }}
          />
          <circle r={5.5} fill={c.rust} stroke={c.cream} strokeWidth={1.8} />
        </g>
      )}
    </svg>
  )
}

/** The shared map legend row. */
export function MapLegend({ style }: { style?: React.CSSProperties }) {
  const item: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontFamily: "'Space Mono',monospace",
    fontSize: 8.5,
    letterSpacing: '.03em',
    color: '#5a4f3b',
  }
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '9px 14px',
        padding: '9px 13px 11px',
        borderTop: `1.5px solid ${c.ink}`,
        background: c.paperMuted,
        ...style,
      }}
    >
      <span style={item}>
        <span style={{ width: 15, height: 2.6, background: c.rust, display: 'inline-block', borderRadius: 2 }} />
        Official WAW
      </span>
      <span style={item}>
        <span style={{ width: 15, height: 0, borderTop: `2px dashed ${c.leadIn}`, display: 'inline-block' }} />
        Lead-in
      </span>
      <span style={item}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.landmark, display: 'inline-block' }} />
        Landmark
      </span>
      <span style={item}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.townDot, display: 'inline-block' }} />
        Town
      </span>
    </div>
  )
}
