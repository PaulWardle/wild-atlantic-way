import { c, font } from '../theme'
import { useWeather, type WeatherSpot } from '../hooks/useWeather'
import { wxInfo, type DayForecast, type CurrentForecast } from '../lib/weather'
import { WeatherIcon } from './WeatherIcon'

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: font.mono, fontSize: 8.5, color: c.inkFaint, display: 'inline-flex', alignItems: 'center', gap: 3 }}>{children}</span>
  )
}

function Card({
  kicker,
  spot,
  day,
  current,
}: {
  kicker: string
  spot: WeatherSpot
  day: DayForecast | undefined
  current?: CurrentForecast
}) {
  const f = spot.forecast
  if (!f || !day) {
    return (
      <div style={cardStyle}>
        <div style={kickerStyle}>{kicker}</div>
        <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', color: c.ink, letterSpacing: '.01em', lineHeight: 1.1 }}>{spot.place}</div>
        <div style={{ fontFamily: font.serif, fontSize: 11.5, color: c.inkFainter, marginTop: 10 }}>No forecast yet.</div>
      </div>
    )
  }
  const info = wxInfo(current ? current.code : day.code)
  const bigTemp = current ? current.temp : day.tMax
  return (
    <div style={cardStyle}>
      <div style={kickerStyle}>{kicker}</div>
      <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', color: c.ink, letterSpacing: '.01em', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {spot.place}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <WeatherIcon icon={info.icon} size={34} />
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 28, color: c.ink, lineHeight: 1 }}>
            {bigTemp}
            <span style={{ fontSize: 15, color: c.inkFaint }}>°</span>
          </div>
        </div>
      </div>

      <div style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkBody2, marginTop: 5, lineHeight: 1.2 }}>{info.label}</div>

      <div style={{ display: 'flex', gap: 10, marginTop: 7, flexWrap: 'wrap' }}>
        <Meta>
          <span style={{ color: c.rust, fontWeight: 700 }}>H</span> {day.tMax}° &nbsp;
          <span style={{ color: c.teal, fontWeight: 700 }}>L</span> {day.tMin}°
        </Meta>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <Meta>
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={c.teal} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3 C12 3 5 11 5 15 a7 7 0 0 0 14 0 C19 11 12 3 12 3 Z" />
          </svg>
          {day.precip}%
        </Meta>
        <Meta>
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke={c.inkFaint} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 8 h11 a2.5 2.5 0 1 0 -2.5 -2.5" />
            <path d="M3 12 h15 a2.5 2.5 0 1 1 -2.5 2.5" />
            <path d="M3 16 h8 a2.5 2.5 0 1 1 -2.5 2.5" />
          </svg>
          {day.wind} mph
        </Meta>
      </div>

      {f.stale && (
        <div style={{ fontFamily: font.mono, fontSize: 7.5, letterSpacing: '.08em', color: c.inkFaintest, textTransform: 'uppercase', marginTop: 7 }}>Last known · offline</div>
      )}
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: `1.5px solid ${c.ink}`,
  borderRadius: 10,
  background: c.paper,
  padding: '11px 12px 12px',
}
const kickerStyle: React.CSSProperties = {
  fontFamily: font.mono,
  fontSize: 8,
  fontWeight: 700,
  letterSpacing: '.11em',
  color: c.rust,
  textTransform: 'uppercase',
  marginBottom: 4,
}

/** Two-card weather strip: today where you are, tomorrow where you're headed. */
export function WeatherStrip() {
  const { today, tomorrow, loading, tried } = useWeather()

  // Nothing to show until we have at least one spot resolved.
  if (!today && !tomorrow) {
    if (loading || !tried) return null
    return null
  }

  return (
    <div style={{ margin: '14px 14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
        <div style={{ fontFamily: font.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', color: c.inkFaint, textTransform: 'uppercase' }}>Weather</div>
        <div style={{ flex: 1, height: 1, background: c.lineSoft }} />
      </div>
      <div style={{ display: 'flex', gap: 9 }}>
        {today && <Card kicker="Today · here" spot={today} day={today.forecast?.days[0]} current={today.forecast?.current} />}
        {tomorrow && <Card kicker="Tomorrow" spot={tomorrow} day={tomorrow.forecast?.days[1]} />}
      </div>
    </div>
  )
}
