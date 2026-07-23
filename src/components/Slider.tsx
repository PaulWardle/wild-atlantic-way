import type { ReactNode } from 'react'
import { c } from '../theme'

function Dots({ n, active, onDot }: { n: number; active: number; onDot?: (i: number) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, padding: '2px 12px 11px' }}>
      {Array.from({ length: n }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot?.(i)}
          aria-label="Show slide"
          style={{
            width: i === active ? 16 : 6,
            height: 6,
            borderRadius: 3,
            background: i === active ? c.rust : '#c9ba94',
            border: 0,
            padding: 0,
            transition: 'width .3s ease, background .3s ease',
          }}
        />
      ))}
    </div>
  )
}

/**
 * A horizontal auto/manual carousel. `idx` may grow unbounded (swipe/auto-advance);
 * it is clamped modulo the slide count for both the transform and the dots.
 */
export function Slider({
  slides,
  idx,
  onDot,
  onSwipeStart,
  onSwipeEnd,
}: {
  slides: ReactNode[]
  idx: number
  onDot?: (i: number) => void
  onSwipeStart?: (e: React.TouchEvent | React.MouseEvent) => void
  onSwipeEnd?: (e: React.TouchEvent | React.MouseEvent) => void
}) {
  const n = slides.length
  const step = n > 0 ? 100 / n : 100
  const active = n > 0 ? (((idx % n) + n) % n) : 0
  return (
    <>
      <div
        style={{ overflow: 'hidden', touchAction: 'pan-y', cursor: onSwipeStart ? 'grab' : undefined }}
        onTouchStart={onSwipeStart}
        onTouchEnd={onSwipeEnd}
      >
        <div
          style={{
            display: 'flex',
            width: n * 100 + '%',
            transform: `translateX(-${(active * step).toFixed(4)}%)`,
            transition: 'transform .55s cubic-bezier(.4,0,.2,1)',
          }}
        >
          {slides.map((sl, i) => (
            <div key={i} style={{ flex: `0 0 ${step.toFixed(4)}%`, boxSizing: 'border-box' }}>
              {sl}
            </div>
          ))}
        </div>
      </div>
      {n > 1 && <Dots n={n} active={active} onDot={onDot} />}
      {n === 1 && <div style={{ height: 11 }} />}
    </>
  )
}
