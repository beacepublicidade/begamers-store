'use client'

const PATHS: Record<string, React.ReactNode> = {
  search:    <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  cart:      <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.3a2 2 0 0 0 2 1.7h8a2 2 0 0 0 2-1.7L22 7H6" /></>,
  user:      <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  heart:     <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />,
  menu:      <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
  chevR:     <path d="m9 6 6 6-6 6" />,
  chevD:     <path d="m6 9 6 6 6-6" />,
  chevU:     <path d="m6 15 6-6 6 6" />,
  chevL:     <path d="m15 6-6 6 6 6" />,
  x:         <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  plus:      <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus:     <path d="M5 12h14" />,
  refresh:   <><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></>,
  star:      <path d="m12 2 3 7 7.5.6-5.7 5 1.7 7.3L12 18l-6.5 3.9 1.7-7.3-5.7-5L9 9z" />,
  trash:     <><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></>,
  truck:     <><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7" /><circle cx="6" cy="19" r="2" /><circle cx="19" cy="19" r="2" /></>,
  shield:    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" />,
  bolt:      <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  pkg:       <><path d="m21 8-9-6-9 6 9 6 9-6z" /><path d="M3 8v8l9 6 9-6V8" /><path d="m12 14 0 8" /></>,
  filter:    <path d="M3 5h18l-7 9v6l-4-2v-4z" />,
  grid:      <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  rows:      <><rect x="3" y="4" width="18" height="4" /><rect x="3" y="10" width="18" height="4" /><rect x="3" y="16" width="18" height="4" /></>,
  eye:       <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  fire:      <path d="M8 14a4 4 0 1 0 8 0c0-3-4-5-3-10C8 6 5 9 5 14a7 7 0 0 0 14 0c0-2-2-4-4-5" />,
  check:     <path d="m5 12 5 5L20 7" />,
  lock:      <><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V8a4 4 0 1 1 8 0v3" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="4" /></>,
  twitch:    <><path d="M4 4h16v10l-4 4h-4l-3 3v-3H4z" /><path d="M11 8v5" /><path d="M15 8v5" /></>,
  youtube:   <><rect x="2" y="6" width="20" height="12" rx="3" /></>,
  discord:   <><path d="M8 9c4-1 4-1 8 0" /><path d="M7 19c-2-1-3-4-3-9 1-2 3-3 5-3l1 2c2-1 4-1 6 0l1-2c2 0 4 1 5 3 0 5-1 8-3 9l-1-2c-3 1-7 1-10 0z" /></>,
  twitter:   <path d="M22 4c-1 .5-2 1-3 1 1-1 1.5-2 2-3-1 .5-2 1-3 1.5C16.5 2 13 3 12 6c0 .5 0 1 .5 1.5C9 7 6 5 4 3c-.5 1-1 2-1 3 0 1.5 1 3 2.5 3.5-1 0-2 0-2.5-.5 0 2 1.5 3.5 3.5 4-1 0-2 0-2.5 0 .5 2 2 3 4 3-1.5 1.5-4 2.5-6.5 2C3 19.5 5.5 20.5 8 20.5 16 20.5 20 14 20 8c0 0 0-.5 0-.5 1-.5 2-1 2-2z" />,
  headset:   <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3" y="14" width="5" height="7" rx="1" /><rect x="16" y="14" width="5" height="7" rx="1" /></>,
  monitor:   <><rect x="2" y="3" width="20" height="13" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></>,
  edit:      <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  save:      <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  upload:    <><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></>,
  settings:  <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  tag:       <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
  package2:  <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
  users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
  chart:     <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
  home:      <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
  logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
}

interface IconProps {
  name: string
  size?: number
  color?: string
  stroke?: number
  style?: React.CSSProperties
}

export default function Icon({ name, size = 20, color = 'currentColor', stroke = 1.7, style }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {PATHS[name] || null}
    </svg>
  )
}
