'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────── */

// DB CHECK values: 'bad' | 'good' | 'excellent'
type RatingValue = 'bad' | 'good' | 'excellent' | null
// DB CHECK values: 'delivery' | 'pickup' | 'local'
type OrderOrigin = 'delivery' | 'pickup' | 'local' | null
type TimeFilter = 'today' | 'week' | 'all'
type SortOption = 'recent' | 'best' | 'worst'

interface SurveyResponse {
  id: string
  product_quality: RatingValue
  delivery_time: RatingValue
  service_attention: RatingValue
  order_origin: OrderOrigin
  comment: string | null
  customer_name: string | null
  created_at: string
}

/* ─── Helpers ────────────────────────────────────────── */

const RATING_SCORE: Record<string, number> = { bad: 1, good: 2, excellent: 3 }

function avgScore(r: SurveyResponse): number {
  const vals = [r.product_quality, r.delivery_time, r.service_attention]
    .filter(Boolean)
    .map((v) => RATING_SCORE[v as string] ?? 0)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function avgLabel(value: number): string {
  if (!value) return '—'
  if (value >= 2.5) return 'Muy buena'
  if (value >= 1.5) return 'Normal'
  return 'Mala'
}

function avgNum(responses: SurveyResponse[], key: keyof SurveyResponse): number {
  const vals = responses
    .map((r) => RATING_SCORE[(r[key] as string) ?? ''] ?? 0)
    .filter(Boolean)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

const ORIGIN_LABELS: Record<string, string> = {
  delivery: 'Delivery',
  local: 'En el local',
  pickup: 'Retiro',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ─── Badges ─────────────────────────────────────────── */

function RatingBadge({ value }: { value: RatingValue }) {
  if (!value) return <span className="text-[#243329]/25 text-xs">—</span>
  const map: Record<string, { label: string; cls: string }> = {
    bad:       { label: 'Mala',      cls: 'bg-[#C4322B]/8 text-[#C4322B] border border-[#C4322B]/20' },
    good:      { label: 'Normal',    cls: 'bg-[#243329]/6 text-[#243329]/60 border border-[#243329]/15' },
    excellent: { label: 'Muy buena', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' },
  }
  const { label, cls } = map[value]
  return (
    <span className={`inline-block text-[11px] font-medium px-2.5 py-[3px] rounded-full whitespace-nowrap ${cls}`}>
      {label}
    </span>
  )
}

function OriginBadge({ value }: { value: OrderOrigin }) {
  if (!value) return <span className="text-[#243329]/25 text-xs">—</span>
  const map: Record<string, string> = {
    delivery: 'bg-[#F5EFE8] text-[#243329]/70 border border-[#243329]/15',
    local:    'bg-[#F5EFE8] text-[#243329]/70 border border-[#243329]/15',
    pickup:   'bg-[#F5EFE8] text-[#243329]/70 border border-[#243329]/15',
  }
  return (
    <span className={`inline-block text-[11px] font-medium px-2.5 py-[3px] rounded-full whitespace-nowrap ${map[value]}`}>
      {ORIGIN_LABELS[value]}
    </span>
  )
}

/* ─── Stat Card ──────────────────────────────────────── */

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-[#243329]/10 rounded-2xl px-6 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40 mb-3">{label}</p>
      <p className="font-serif text-3xl font-bold text-[#243329] leading-none">{value}</p>
      {sub && <p className="text-xs text-[#243329]/40 mt-2">{sub}</p>}
    </div>
  )
}

/* ─── Filter Pill ────────────────────────────────────── */

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
        active
          ? 'bg-[#C4322B] text-white border-[#C4322B]'
          : 'bg-[#F5EFE8] text-[#243329]/60 border-[#243329]/15 hover:border-[#243329]/30 hover:text-[#243329]'
      }`}
    >
      {children}
    </button>
  )
}

/* ─── Filter Select ──────────────────────────────────── */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[130px]">
      <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 px-3 pr-8 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] appearance-none focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23243329' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

/* ─── Detail Modal ───────────────────────────────────── */

function DetailModal({ response, onClose }: { response: SurveyResponse; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#243329]/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 border border-[#243329]/8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40 mb-1">Respuesta</p>
            <p className="font-serif text-xl font-bold text-[#243329]">
              {response.customer_name || 'Anónimo'}
            </p>
            <p className="text-xs text-[#243329]/40 mt-0.5">
              {formatDate(response.created_at)} · {formatTime(response.created_at)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5EFE8] text-[#243329]/50 hover:text-[#243329] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#243329]/8 mb-6" />

        {/* Fields */}
        <div className="space-y-4">
          {[
            { label: 'Origen',              content: <OriginBadge value={response.order_origin} /> },
            { label: 'Calidad del producto', content: <RatingBadge value={response.product_quality} /> },
            { label: 'Tiempo de entrega',   content: <RatingBadge value={response.delivery_time} /> },
            { label: 'Atención al cliente', content: <RatingBadge value={response.service_attention} /> },
          ].map(({ label, content }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-[#243329]/50">{label}</span>
              {content}
            </div>
          ))}

          {response.comment && (
            <div className="mt-4 pt-4 border-t border-[#243329]/8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40 mb-2">Comentario</p>
              <p className="text-sm text-[#243329]/80 leading-relaxed bg-[#F5EFE8] rounded-xl px-4 py-3">
                &ldquo;{response.comment}&rdquo;
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

  // Quick time filter
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')

  // Advanced filters
  const [filterOrigin, setFilterOrigin] = useState('all')
  const [filterQuality, setFilterQuality] = useState('all')
  const [filterTime, setFilterTime] = useState('all')
  const [filterAttention, setFilterAttention] = useState('all')
  const [filterComment, setFilterComment] = useState('')
  const [dateExact, setDateExact] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('survey_responses')
        .select('id, product_quality, delivery_time, service_attention, order_origin, comment, customer_name, created_at')
        .order('created_at', { ascending: false })
      setResponses((data as SurveyResponse[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Apply time filter first
  const timeFiltered = useMemo(() => {
    const now = new Date()
    if (timeFilter === 'today') {
      const today = now.toDateString()
      return responses.filter((r) => new Date(r.created_at).toDateString() === today)
    }
    if (timeFilter === 'week') {
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return responses.filter((r) => new Date(r.created_at) >= cutoff)
    }
    return responses
  }, [responses, timeFilter])

  // Stats from time-filtered
  const stats = useMemo(() => ({
    total: timeFiltered.length,
    delivery: timeFiltered.filter((r) => r.order_origin === 'delivery').length,
    local: timeFiltered.filter((r) => r.order_origin === 'local' || r.order_origin === 'retiro').length,
    avgGeneral: timeFiltered.length
      ? timeFiltered.reduce((acc, r) => acc + avgScore(r), 0) / timeFiltered.length
      : 0,
  }), [timeFiltered])

  // Apply advanced filters
  const filtered = useMemo(() => {
    let list = [...timeFiltered]
    if (filterOrigin !== 'all') list = list.filter((r) => r.order_origin === filterOrigin)
    if (filterQuality !== 'all') list = list.filter((r) => r.product_quality === filterQuality)
    if (filterTime !== 'all') list = list.filter((r) => r.delivery_time === filterTime)
    if (filterAttention !== 'all') list = list.filter((r) => r.service_attention === filterAttention)
    if (filterComment) list = list.filter((r) => r.comment?.toLowerCase().includes(filterComment.toLowerCase()))
    if (dateExact) list = list.filter((r) => formatDate(r.created_at) === formatDate(dateExact + 'T00:00:00'))
    if (sortBy === 'best') list.sort((a, b) => avgScore(b) - avgScore(a))
    else if (sortBy === 'worst') list.sort((a, b) => avgScore(a) - avgScore(b))
    return list
  }, [timeFiltered, filterOrigin, filterQuality, filterTime, filterAttention, filterComment, dateExact, sortBy])

  const hasActiveFilters = filterOrigin !== 'all' || filterQuality !== 'all' || filterTime !== 'all' ||
    filterAttention !== 'all' || filterComment || dateExact || sortBy !== 'recent'

  const RATING_OPTIONS = [
    { value: 'all',       label: 'Todas' },
    { value: 'bad',       label: 'Mala' },
    { value: 'good',      label: 'Normal' },
    { value: 'excellent', label: 'Muy buena' },
  ]

  const TABLE_COLS = ['Fecha', 'Hora', 'Origen', 'Calidad', 'Tiempo', 'Atención', 'Comentario']

  return (
    <>
      <div className="max-w-7xl space-y-8">

        {/* ── Header ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#243329]/35 mb-2">
            Panel interno
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#243329] leading-tight">
            Encuesta de satisfacción
          </h1>
        </div>

        {/* ── Quick time filters ── */}
        <div className="flex gap-2">
          <FilterPill active={timeFilter === 'today'} onClick={() => setTimeFilter('today')}>Hoy</FilterPill>
          <FilterPill active={timeFilter === 'week'} onClick={() => setTimeFilter('week')}>Últimos 7 días</FilterPill>
          <FilterPill active={timeFilter === 'all'} onClick={() => setTimeFilter('all')}>Todo</FilterPill>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total respuestas" value={loading ? '—' : stats.total} />
          <StatCard label="Delivery" value={loading ? '—' : stats.delivery} />
          <StatCard
            label="Local / Retiro"
            value={loading ? '—' : stats.local}
          />
          <StatCard
            label="Promedio general"
            value={loading ? '—' : avgLabel(stats.avgGeneral)}
          />
        </div>

        {/* ── Advanced Filters ── */}
        <div className="bg-white border border-[#243329]/10 rounded-2xl px-6 py-5">
          <div className="flex flex-wrap gap-4 items-end">
            <FilterSelect
              label="Origen"
              value={filterOrigin}
              onChange={setFilterOrigin}
              options={[
                { value: 'all',      label: 'Todos' },
                { value: 'delivery', label: 'Delivery' },
                { value: 'local',    label: 'En el local' },
                { value: 'pickup',   label: 'Retiro' },
              ]}
            />
            <FilterSelect label="Calidad" value={filterQuality} onChange={setFilterQuality} options={RATING_OPTIONS} />
            <FilterSelect label="Tiempo entrega" value={filterTime} onChange={setFilterTime} options={RATING_OPTIONS} />
            <FilterSelect label="Atención" value={filterAttention} onChange={setFilterAttention} options={RATING_OPTIONS} />

            {/* Date exact */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">Fecha exacta</label>
              <input
                type="date"
                value={dateExact}
                onChange={(e) => setDateExact(e.target.value)}
                className="h-9 px-3 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
              />
            </div>

            {/* Comment search */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
              <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">Comentario</label>
              <input
                type="text"
                value={filterComment}
                onChange={(e) => setFilterComment(e.target.value)}
                placeholder="Buscar..."
                className="h-9 px-3 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
              />
            </div>

            {/* Result count + clear */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40 invisible">.</label>
              <div className="flex items-center gap-2 h-9">
                <span className="text-xs text-[#243329]/50">
                  {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setFilterOrigin('all')
                      setFilterQuality('all')
                      setFilterTime('all')
                      setFilterAttention('all')
                      setFilterComment('')
                      setDateExact('')
                      setSortBy('recent')
                    }}
                    className="flex items-center gap-1 text-xs text-[#243329]/50 hover:text-[#C4322B] transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 border-b border-[#243329]/6 last:border-0 animate-pulse bg-[#F5EFE8]/40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#243329]/10 rounded-2xl px-6 py-20 text-center">
            <p className="font-serif text-lg text-[#243329]/40">Sin resultados</p>
            <p className="text-xs text-[#243329]/30 mt-1">
              {hasActiveFilters
                ? 'No hay respuestas para los filtros seleccionados.'
                : 'Todavía no se recibieron encuestas.'}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#243329]/8 bg-[#F5EFE8]/70">
                    {TABLE_COLS.map((col) => (
                      <th
                        key={col}
                        className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className={`border-b border-[#243329]/6 last:border-0 cursor-pointer transition-colors hover:bg-[#F5EFE8]/50 ${
                        i % 2 === 0 ? '' : 'bg-[#243329]/[0.015]'
                      }`}
                    >
                      <td className="px-5 py-3.5 text-xs text-[#243329]/50 whitespace-nowrap font-mono">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#243329]/50 whitespace-nowrap font-mono">
                        {formatTime(r.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <OriginBadge value={r.order_origin} />
                      </td>
                      <td className="px-5 py-3.5">
                        <RatingBadge value={r.product_quality} />
                      </td>
                      <td className="px-5 py-3.5">
                        <RatingBadge value={r.delivery_time} />
                      </td>
                      <td className="px-5 py-3.5">
                        <RatingBadge value={r.service_attention} />
                      </td>
                      <td className="px-5 py-3.5 max-w-[200px]">
                        {r.comment ? (
                          <span className="text-xs text-[#243329]/70 line-clamp-1">
                            {r.comment}
                          </span>
                        ) : (
                          <span className="text-[#243329]/20 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selected && <DetailModal response={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
