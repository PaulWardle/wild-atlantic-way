/* Design tokens for the Wild Atlantic Way app.
 *
 * The original build used 100% inline styles with hard-coded hex values. To make
 * the rebuild maintainable, the palette and type stack are centralised here. The
 * warm-paper / dark-ink / rust-red look is the brand — change it in one place.
 */

export const c = {
  // paper / surfaces
  paper: '#f1e8d0', // primary card cream
  paperDeep: '#e8dcbf', // phone body / appbar
  paperMuted: '#e2d3ac', // recessed panels, day roundels
  paperMap: '#d8c8a3', // map card body
  paperMapFill: '#efe4c8', // Ireland landmass fill
  inputBg: '#fbf4e0', // input / dropdown surface
  amberPanel: '#f3ecd7', // amber-tinted panels
  amberPanelDeep: '#f4e4d9', // warn banner background
  greenPanel: '#eef0e0', // green-tinted panels
  tealPanel: '#e6ecec', // teal-tinted panels

  // ink
  ink: '#26201a', // primary dark ink
  inkSoft: '#3f3729',
  inkBody: '#544a39', // body copy
  inkBody2: '#4a4132',
  inkMuted: '#6b5f49',
  inkFaint: '#7a6d54',
  inkFainter: '#6f6349',
  inkFaintest: '#746849',

  // accents
  rust: '#a8412a', // primary accent
  amber: '#b0812c', // warnings / "maybe"
  amberGold: '#7d5c17',
  green: '#55643a', // camp / "keep"
  greenLine: '#4a7a3a', // completed-route line
  teal: '#305a68', // biker roads
  wawGreen: '#3f7a5c', // WAW point
  cream: '#f6ecd6', // light text on dark/rust
  gold: '#c9a35f', // muted gold on dark

  // hairlines
  line: '#c3b48e',
  lineSoft: '#d3c39c',
  lineFaint: '#ece0c2',

  // map-specific
  landmark: '#8f3341',
  townDot: '#8a7c5f',
  leadIn: '#c98f6f',
} as const

export const font = {
  display: "'Oswald',sans-serif", // display / labels
  serif: "'Spectral',Georgia,serif", // body serif
  mono: "'Space Mono',monospace", // micro-labels / tags
} as const

/** Phase → label + colour (lead-in / official WAW / ferry home). */
export function phaseInfo(p: string): { label: string; color: string } {
  if (p === 'lead') return { label: 'Lead-in', color: c.inkFainter }
  if (p === 'home') return { label: 'Ferry home', color: c.inkFainter }
  return { label: 'Official WAW', color: c.rust }
}
