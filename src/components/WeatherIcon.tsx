import type { WxIcon } from '../lib/weather'
import { c } from '../theme'

/** A small hand-drawn weather glyph in the app's ink/rust/gold palette. */
export function WeatherIcon({ icon, size = 30 }: { icon: WxIcon; size?: number }) {
  const sun = c.amberGold
  const cloud = c.inkFaint
  const rain = c.teal
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const, 'aria-hidden': true, focusable: 'false' as const }

  switch (icon) {
    case 'sun':
      return (
        <svg {...p}>
          <circle cx={12} cy={12} r={4.2} fill={sun} />
          <g stroke={sun} strokeWidth={1.7} strokeLinecap="round">
            <line x1={12} y1={2.5} x2={12} y2={5} />
            <line x1={12} y1={19} x2={12} y2={21.5} />
            <line x1={2.5} y1={12} x2={5} y2={12} />
            <line x1={19} y1={12} x2={21.5} y2={12} />
            <line x1={5.2} y1={5.2} x2={7} y2={7} />
            <line x1={17} y1={17} x2={18.8} y2={18.8} />
            <line x1={18.8} y1={5.2} x2={17} y2={7} />
            <line x1={7} y1={17} x2={5.2} y2={18.8} />
          </g>
        </svg>
      )
    case 'partly':
      return (
        <svg {...p}>
          <circle cx={9} cy={9} r={3.4} fill={sun} />
          <g stroke={sun} strokeWidth={1.5} strokeLinecap="round">
            <line x1={9} y1={2.6} x2={9} y2={4.4} />
            <line x1={2.6} y1={9} x2={4.4} y2={9} />
            <line x1={4.6} y1={4.6} x2={5.9} y2={5.9} />
          </g>
          <path d="M8 18 a4 4 0 0 1 0.4 -7.9 a5 5 0 0 1 9.4 1.6 a3.4 3.4 0 0 1 -0.8 6.3 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      )
    case 'cloud':
      return (
        <svg {...p}>
          <path d="M7 18 a4.2 4.2 0 0 1 0.4 -8.4 a5.3 5.3 0 0 1 10 1.7 a3.6 3.6 0 0 1 -0.9 6.7 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.7} strokeLinejoin="round" />
        </svg>
      )
    case 'fog':
      return (
        <svg {...p}>
          <path d="M7 14 a4 4 0 0 1 0.4 -8 a5.1 5.1 0 0 1 9.6 1.6 a3.4 3.4 0 0 1 -0.8 6.4 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.6} strokeLinejoin="round" />
          <g stroke={cloud} strokeWidth={1.7} strokeLinecap="round">
            <line x1={5} y1={18} x2={19} y2={18} />
            <line x1={7} y1={21} x2={17} y2={21} />
          </g>
        </svg>
      )
    case 'drizzle':
      return (
        <svg {...p}>
          <path d="M7 14 a4 4 0 0 1 0.4 -8 a5.1 5.1 0 0 1 9.6 1.6 a3.4 3.4 0 0 1 -0.8 6.4 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.6} strokeLinejoin="round" />
          <g stroke={rain} strokeWidth={1.8} strokeLinecap="round">
            <line x1={9} y1={17} x2={8} y2={19.5} />
            <line x1={15} y1={17} x2={14} y2={19.5} />
          </g>
        </svg>
      )
    case 'rain':
      return (
        <svg {...p}>
          <path d="M7 13 a4 4 0 0 1 0.4 -8 a5.1 5.1 0 0 1 9.6 1.6 a3.4 3.4 0 0 1 -0.8 6.4 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.6} strokeLinejoin="round" />
          <g stroke={rain} strokeWidth={1.9} strokeLinecap="round">
            <line x1={8} y1={16} x2={6.7} y2={20.5} />
            <line x1={12} y1={16} x2={10.7} y2={20.5} />
            <line x1={16} y1={16} x2={14.7} y2={20.5} />
          </g>
        </svg>
      )
    case 'showers':
      return (
        <svg {...p}>
          <circle cx={16.5} cy={7} r={2.6} fill={sun} />
          <path d="M6 14 a4 4 0 0 1 0.4 -8 a5.1 5.1 0 0 1 9.3 1 a3.4 3.4 0 0 1 -0.3 6.9 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.6} strokeLinejoin="round" />
          <g stroke={rain} strokeWidth={1.9} strokeLinecap="round">
            <line x1={8} y1={16} x2={6.7} y2={20} />
            <line x1={13} y1={16} x2={11.7} y2={20} />
          </g>
        </svg>
      )
    case 'snow':
      return (
        <svg {...p}>
          <path d="M7 13 a4 4 0 0 1 0.4 -8 a5.1 5.1 0 0 1 9.6 1.6 a3.4 3.4 0 0 1 -0.8 6.4 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.6} strokeLinejoin="round" />
          <g fill={cloud}>
            <circle cx={8.5} cy={18} r={1.1} />
            <circle cx={12} cy={20} r={1.1} />
            <circle cx={15.5} cy={18} r={1.1} />
          </g>
        </svg>
      )
    case 'thunder':
      return (
        <svg {...p}>
          <path d="M7 13 a4 4 0 0 1 0.4 -8 a5.1 5.1 0 0 1 9.6 1.6 a3.4 3.4 0 0 1 -0.8 6.4 Z" fill={c.paperMuted} stroke={cloud} strokeWidth={1.6} strokeLinejoin="round" />
          <path d="M12 15 L9.5 19 H12 L10.5 22.5 L15 17.5 H12 Z" fill={c.rust} />
        </svg>
      )
  }
}
