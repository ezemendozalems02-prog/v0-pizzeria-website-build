'use client'

interface MapEmbedProps {
  embedUrl: string
  title?: string
}

export function MapEmbed({ embedUrl, title = 'Ubicación' }: MapEmbedProps) {
  return (
    <div className="w-full">
      <iframe
        src={embedUrl}
        width="100%"
        height="450"
        style={{ border: 0, borderRadius: '12px' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    </div>
  )
}
