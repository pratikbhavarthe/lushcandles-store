/** Lush Candles mark: a candle flame inside a ring. Inherits colour via currentColor. */
export default function FlameMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M20 8.5c3.6 4.4 6.2 8 6.2 12.1A6.2 6.2 0 0 1 20 26.8a6.2 6.2 0 0 1-6.2-6.2c0-2.6 1.2-4.6 2.9-6.6.3 2 1.1 3.3 2.4 4-.4-3.3.2-6.4.9-9.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M20 26.8v4.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M15.5 31.5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
