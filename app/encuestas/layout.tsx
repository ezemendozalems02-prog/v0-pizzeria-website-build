import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Encuestas — TOTORE',
  description: 'Panel de resultados de encuestas de satisfacción.',
  robots: { index: false, follow: false },
}

export default function SurveyPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5EFE8]">
      {children}
    </div>
  )
}
