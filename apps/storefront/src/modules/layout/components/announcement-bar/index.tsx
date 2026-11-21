/** Thin bar above the header. Rendered only when a region announcement is set in Medusa Admin. */
export default function AnnouncementBar({ text }: { text: string | null }) {
  if (!text) return null
  return (
    <div className="bg-lush-ink px-4 py-2.5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-lush-ivory">
      {text}
    </div>
  )
}
