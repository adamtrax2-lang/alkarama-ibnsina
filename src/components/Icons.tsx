type P = { className?: string };

export const Icon = {
  bed: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M3 7v11M3 12h18M21 18V11a2 2 0 0 0-2-2H7M3 9h2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="11.5" r="1.5" />
    </svg>
  ),
  kaaba: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" strokeLinejoin="round" />
      <path d="M4 7l8 4 8-4M12 11v10" strokeLinejoin="round" />
      <path d="M8 9.5h2" strokeLinecap="round" />
    </svg>
  ),
  passport: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M9.5 17h5" strokeLinecap="round" />
    </svg>
  ),
  plane: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M10.5 13.5L3 11l1-2 8 1 4.5-5a2 2 0 0 1 3 3l-5 4.5 1 8-2 1-2.5-7.5L6 17l-1 3-1.5-.5.5-3.5z" strokeLinejoin="round" />
    </svg>
  ),
  ferry: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M4 13l8-3 8 3M5 13V9h14v4M9 9V6h6v3M3 18c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  shield: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M12 3l7 3v6c0 4-3 6.5-7 9-4-2.5-7-5-7-9V6l7-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  star: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 20.5l1.4-6.8L2.2 9l6.9-.7L12 2z" />
    </svg>
  ),
  handshake: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M3 12l3-3 5 4 2-2 4 3 4-3M8 13l2.5 2.5M11 14l2 2M14 15l1.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  clock: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  globe: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  heart: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M12 20s-7-4.3-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.7 12 20 12 20z" strokeLinejoin="round" />
    </svg>
  ),
  phone: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
    </svg>
  ),
  pin: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  facebook: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </svg>
  ),
  instagram: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M16.5 3c.3 2.2 1.6 3.7 3.8 3.9v2.5c-1.3.1-2.5-.3-3.8-1v5.9c0 4-3.3 6.6-6.9 5.6-2.4-.7-3.9-2.9-3.7-5.4.2-2.7 2.6-4.7 5.3-4.5.3 0 .5.1.8.1v2.7c-.3-.1-.6-.2-.9-.2-1.2-.1-2.3.7-2.5 1.8-.2 1.2.5 2.3 1.7 2.6 1.3.3 2.6-.6 2.6-2V3h2.6z" />
    </svg>
  ),
  youtube: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M22 12c0-1.7-.1-3-.3-3.9-.2-.9-.9-1.6-1.8-1.8C18.3 6 12 6 12 6s-6.3 0-7.9.3c-.9.2-1.6.9-1.8 1.8C2.1 9 2 10.3 2 12s.1 3 .3 3.9c.2.9.9 1.6 1.8 1.8C5.7 18 12 18 12 18s6.3 0 7.9-.3c.9-.2 1.6-.9 1.8-1.8.2-.9.3-2.2.3-3.9zM10 15V9l5.2 3L10 15z" />
    </svg>
  ),
  x: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M17.5 3h3l-6.6 7.6L21.8 21h-6l-4.7-6.1L5.7 21H2.6l7-8.1L2.5 3h6.1l4.2 5.6L17.5 3zm-1.1 16h1.7L7.7 4.8H5.9L16.4 19z" />
    </svg>
  ),
  whatsapp: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.3-.2-2.8.8.8-2.7-.2-.3A8 8 0 0 1 12 4zm-3 4.3c-.2 0-.5 0-.7.4-.2.4-.9 1-.9 2.3s1 2.7 1.1 2.9c.1.2 1.9 3 4.7 4 .7.3 1.2.5 1.6.3.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.5-.2-.3 0-.4.1-.6l.4-.5c.1-.2 0-.4 0-.5l-.7-1.7c-.2-.5-.4-.4-.6-.4z" />
    </svg>
  ),
  arrow: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={p.className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  ),
  check: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={p.className}>
      <path d="M5 12l4 4 10-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export type IconName = keyof typeof Icon;
