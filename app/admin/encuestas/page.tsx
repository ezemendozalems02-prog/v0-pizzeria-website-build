'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, ChevronDown, X, Clock } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────── */

type RatingValue = 'bad' | 'ok' | 'good' | null
type OrderOrigin = 'delivery' | 'local' | 'retiro' | null

interface SurveyResponse {
  id: string
  quality: RatingValue
  time: RatingValue
  attention: RatingValue
  experience: OrderOrigin
  comment: string | null
  name: string | null
  created_at: string
}

type SortOption = 'recent' | 'best' | 'worst'

/* ─── Helpers ────────────────────────────────────────── */

const RATING_SCORE: Record<string, number> = { bad: 1, ok: 2, good: 3 }

function avgScore(r: SurveyResponse): number {
  const vals = [r.quality, r.time, r.attention]
    .filter(Boolean)
    .map((v) => RATING_SCORE[v as string] ?? 0)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function avgLabel(value: number): string {
  if (value >= 2.5) return 'Muy buena'
  if (value >= 1.5) return 'Normal'
  return 'Mala'
}

function timeAgo(date: string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (diff < 60) return 'hace menos de un minuto'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hs`
  return `hace ${Math.floor(diff / 86400)} días`
}

const ORIGIN_LABELS: Record<string, string> = {
  delivery: 'Delivery',
  local: 'En el local',
  retiro: 'Retiro',
}

/* ─── Sub-components ─────────────────────────────────── */

function RatingBadge({ value }: { value: RatingValue }) {
  if (!value) return <span className="text-admin-muted text-xs">—</span>

  const styles: Record<string, string> = {
    bad: 'bg-red-50 text-red-600 border border-red-200',
    ok: 'bg-gray-100 text-gray-600 border border-gray-200',
    good: 'bg-green-50 text-green-700 border border-green-200',
  }
  const labels: Record<string, string> = {
    bad: 'Mala',
    ok: 'Normal',
    good: 'Muy buena',
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${styles[value]}`}>
      {labels[value]}
    </span>
  )
}

function OriginBadge({ value }: { value: OrderOrigin }) {
  if (!value) return <span className="text-admin-muted text-xs">—</span>
  const styles: Record<string, string> = {
    delivery: 'bg-blue-50 text-blue-700 border border-blue-200',
    local: 'bg-amber-50 text-amber-700 border border-amber-200',
    retiro: 'bg-purple-50 text-purple-700 border border-purple-200',
  }
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${styles[value]}`}>
      {ORIGIN_LABELS[value] ?? value}
    </span>
  )
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub?: string
}) {
  return (
    <div className="bg-white border border-admin-border rounded-xl p-5">
      <p className="text-xs text-admin-muted uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold text-admin-text">{value}</p>
      {sub && <p className="text-xs text-admin-muted mt-1">{sub}</p>}
    </div>
  )
}

function ResponseModal({
  response,
  onClose,
}: {
  response: SurveyResponse
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-semibold text-admin-text text-lg">
              {response.name || 'Anónimo'}
            </p>
            <p className="text-xs text-admin-muted mt-0.5">
              {new Date(response.created_at).toLocaleString('es-AR', {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-admin-muted hover:text-admin-text transition-colors p-1 rounded-lg hover:bg-admin-bg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-admin-border">
            <span className="text-sm text-admin-muted">Experiencia</span>
            <OriginBadge value={response.experience} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-admin-border">
            <span className="text-sm text-admin-muted">Calidad</span>
            <RatingBadge value={response.quality} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-admin-border">
            <span className="text-sm text-admin-muted">Tiempo</span>
            <RatingBadge value={response.time} />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-admin-border">
            <span className="text-sm text-admin-muted">Atención</span>
            <RatingBadge value={response.attention} />
          </div>
          {response.comment && (
            <div className="pt-2">
              <p className="text-xs text-admin-muted uppercase tracking-wide mb-2">Comentario</p>
              <p className="text-sm text-admin-text leading-relaxed bg-admin-bg rounded-xl p-4">
                "{response.comment}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────── */

export default function EncuestasAdminPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<SurveyResponse | null>(null)
  const [expandedComment, setExpandedComment] = useState<string | null>(null)

  // Filters
  const [filterOrigin, setFilterOrigin] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const supabase = await createClient()
      const { data } = await supabase
        .from('survey_responses')
        .select('id, quality, time, attention, experience, comment, name, created_at')
        .order('created_at', { ascending: false })
      setResponses((data as SurveyResponse[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  // Stats
  const stats = useMemo(() => {
    if (!responses.length) return { total: 0, avgQuality: 0, avgTime: 0, avgAttention: 0 }
    const avg = (key: keyof SurveyResponse) => {
      const vals = responses
        .map((r) => RATING_SCORE[(r[key] as string) ?? ''] ?? 0)
        .filter(Boolean)
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    }
    return {
      total: responses.length,
      avgQuality: avg('quality'),
      avgTime: avg('time'),
      avgAttention: avg('attention'),
    }
  }, [responses])

  const lastResponse = responses[0]

  // Filtered & sorted
  const filtered = useMemo(() => {
    let list = [...responses]
    if (filterOrigin !== 'all') list = list.filter((r) => r.experience === filterOrigin)
    if (dateFrom) list = list.filter((r) => new Date(r.created_at) >= new Date(dateFrom))
    if (dateTo) list = list.filter((r) => new Date(r.created_at) <= new Date(dateTo + 'T23:59:59'))
    if (sortBy === 'best') list.sort((a, b) => avgScore(b) - avgScore(a))
    else if (sortBy === 'worst') list.sort((a, b) => avgScore(a) - avgScore(b))
    return list
  }, [responses, filterOrigin, sortBy, dateFrom, dateTo])

  return (
    <>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-admin-text mb-1">Encuestas de satisfacción</h1>
          <p className="text-sm text-admin-muted">Visualizá el feedback de tus clientes en tiempo real</p>
        </div>

        {/* Last response banner */}
        {lastResponse && (
          <div className="flex items-center gap-2 text-sm text-admin-muted bg-white border border-admin-border rounded-xl px-4 py-3 mb-6">
            <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
            Última respuesta recibida{' '}
            <span className="font-medium text-admin-text">{timeAgo(lastResponse.created_at)}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total respuestas" value={stats.total} />
          <StatCard
            label="Calidad promedio"
            value={stats.total ? avgLabel(stats.avgQuality) : '—'}
          />
          <StatCard
            label="Tiempo promedio"
            value={stats.total ? avgLabel(stats.avgTime) : '—'}
          />
          <StatCard
            label="Atención promedio"
            value={stats.total ? avgLabel(stats.avgAttention) : '—'}
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-admin-border rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end">
          {/* Origin filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-admin-muted uppercase tracking-wide">Experiencia</label>
            <div className="relative">
              <select
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
                className="h-9 pl-3 pr-8 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="all">Todas</option>
                <option value="delivery">Delivery</option>
                <option value="local">En el local</option>
                <option value="retiro">Retiro</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-admin-muted pointer-events-none" />
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-admin-muted uppercase tracking-wide">Ordenar por</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 pl-3 pr-8 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text appearance-none focus:outline-none focus:ring-1 focus:ring-primary/40"
              >
                <option value="recent">Más recientes</option>
                <option value="best">Mejor puntuación</option>
                <option value="worst">Peor puntuación</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-admin-muted pointer-events-none" />
            </div>
          </div>

          {/* Date range */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-admin-muted uppercase tracking-wide">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-9 px-3 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-admin-muted uppercase tracking-wide">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-9 px-3 text-sm border border-admin-border rounded-lg bg-admin-bg text-admin-text focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>

          {/* Clear filters */}
          {(filterOrigin !== 'all' || sortBy !== 'recent' || dateFrom || dateTo) && (
            <button
              onClick={() => {
                setFilterOrigin('all')
                setSortBy('recent')
                setDateFrom('')
                setDateTo('')
              }}
              className="h-9 px-3 text-sm text-admin-muted hover:text-admin-text flex items-center gap-1 border border-admin-border rounded-lg hover:bg-admin-bg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 border-b border-admin-border animate-pulse bg-admin-bg/50 last:border-0" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-admin-border rounded-xl p-16 text-center">
            <MessageSquare className="w-10 h-10 text-admin-muted/30 mx-auto mb-4" />
            <p className="text-admin-text font-medium mb-1">Todavía no hay respuestas</p>
            <p className="text-sm text-admin-muted">
              Las encuestas completadas por tus clientes aparecerán acá.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-admin-border bg-admin-bg">
                    {['Fecha', 'Experiencia', 'Calidad', 'Tiempo', 'Atención', 'Comentario', 'Nombre'].map(
                      (col) => (
                        <th
                          key={col}
                          className="text-left px-4 py-3 text-xs font-semibold text-admin-muted uppercase tracking-wide"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="border-b border-admin-border last:border-0 hover:bg-admin-bg/60 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-admin-muted whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <OriginBadge value={r.experience} />
                      </td>
                      <td className="px-4 py-3">
                        <RatingBadge value={r.quality} />
                      </td>
                      <td className="px-4 py-3">
                        <RatingBadge value={r.time} />
                      </td>
                      <td className="px-4 py-3">
                        <RatingBadge value={r.attention} />
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        {r.comment ? (
                          <span className="text-sm text-admin-text">
                            {expandedComment === r.id ? (
                              <>
                                {r.comment}{' '}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedComment(null)
                                  }}
                                  className="text-primary text-xs underline"
                                >
                                  ver menos
                                </button>
                              </>
                            ) : r.comment.length > 40 ? (
                              <>
                                {r.comment.slice(0, 40)}...{' '}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setExpandedComment(r.id)
                                  }}
                                  className="text-primary text-xs underline"
                                >
                                  ver más
                                </button>
                              </>
                            ) : (
                              r.comment
                            )}
                          </span>
                        ) : (
                          <span className="text-admin-muted text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-admin-text whitespace-nowrap">
                        {r.name || <span className="text-admin-muted text-xs">Anónimo</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Count */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-admin-muted mt-3 text-right">
            {filtered.length} {filtered.length === 1 ? 'respuesta' : 'respuestas'}
          </p>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <ResponseModal response={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
