'use client'

import { useEffect, useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logoutSurveyPanel } from './actions'
import {
  X, LogOut, BarChart2, List, Download, RefreshCw, Loader2,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────── */

type RatingValue = 'bad' | 'good' | 'excellent' | null
type OrderOrigin = 'delivery' | 'pickup' | 'local' | null
type TimeFilter  = 'today' | 'week' | 'all'
type SortOption  = 'recent' | 'best' | 'worst'
type ViewMode    = 'table' | 'charts'

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

/* ─── Helpers ────────────────────────────────────────────────── */

const RATING_SCORE: Record<string, number> = { bad: 1, good: 2, excellent: 3 }

function avgScore(r: SurveyResponse): number {
  const vals = [r.product_quality, r.delivery_time, r.service_attention]
    .filter(Boolean).map((v) => RATING_SCORE[v as string] ?? 0)
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

function avgLabel(v: number) {
  if (!v) return '—'
  if (v >= 2.5) return 'Muy buena'
  if (v >= 1.5) return 'Normal'
  return 'Mala'
}

const ORIGIN_LABELS: Record<string, string> = {
  delivery: 'Delivery', pickup: 'Retiro', local: 'En local',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

/* ─── Small UI atoms ─────────────────────────────────────────── */

function RatingBadge({ value }: { value: RatingValue }) {
  if (!value) return <span className="text-[#243329]/25 text-xs">—</span>
  const map: Record<string, { label: string; cls: string }> = {
    bad:       { label: 'Mala',      cls: 'bg-[#C4322B]/8 text-[#C4322B] border border-[#C4322B]/20' },
    good:      { label: 'Normal',    cls: 'bg-[#243329]/6 text-[#243329]/60 border border-[#243329]/15' },
    excellent: { label: 'Muy buena', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' },
  }
  const { label, cls } = map[value]
  return <span className={`inline-block text-[11px] font-medium px-2.5 py-[3px] rounded-full whitespace-nowrap ${cls}`}>{label}</span>
}

function OriginBadge({ value }: { value: OrderOrigin }) {
  if (!value) return <span className="text-[#243329]/25 text-xs">—</span>
  return (
    <span className="inline-block text-[11px] font-medium px-2.5 py-[3px] rounded-full whitespace-nowrap bg-[#F5EFE8] text-[#243329]/70 border border-[#243329]/15">
      {ORIGIN_LABELS[value] ?? value}
    </span>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-[#243329]/10 rounded-2xl px-6 py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40 mb-3">{label}</p>
      <p className="font-serif text-3xl font-bold text-[#243329] leading-none">{value}</p>
      {sub && <p className="text-xs text-[#243329]/40 mt-2">{sub}</p>}
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
        active
          ? 'bg-[#C4322B] text-white border-[#C4322B]'
          : 'bg-[#F5EFE8] text-[#243329]/60 border-[#243329]/15 hover:border-[#243329]/30 hover:text-[#243329]'
      }`}
    >{children}</button>
  )
}

function FSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[130px]">
      <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="h-9 px-3 pr-8 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] appearance-none focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23243329' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/* ─── Detail Modal ───────────────────────────────────────────── */

function DetailModal({ response, onClose }: { response: SurveyResponse; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#243329]/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 border border-[#243329]/8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40 mb-1">Respuesta</p>
            <p className="font-serif text-xl font-bold text-[#243329]">{response.customer_name || 'Anónimo'}</p>
            <p className="text-xs text-[#243329]/40 mt-0.5">{fmt(response.created_at)} · {fmtTime(response.created_at)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5EFE8] text-[#243329]/50 hover:text-[#243329] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="h-px bg-[#243329]/8 mb-6" />
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
              <p className="text-sm text-[#243329]/80 leading-relaxed bg-[#F5EFE8] rounded-xl px-4 py-3">&ldquo;{response.comment}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Bar chart (custom, no lib) ─────────────────────────────── */

function MiniBar({ label, bad, good, excellent, total }: {
  label: string; bad: number; good: number; excellent: number; total: number
}) {
  const pct = (n: number) => total ? Math.round((n / total) * 100) : 0
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-[#243329]/70">{label}</p>
      <div className="flex h-7 rounded-lg overflow-hidden bg-[#243329]/5 gap-px">
        {excellent > 0 && (
          <div style={{ width: `${pct(excellent)}%` }} className="bg-emerald-500 flex items-center justify-center">
            {pct(excellent) > 8 && <span className="text-[10px] font-bold text-white">{pct(excellent)}%</span>}
          </div>
        )}
        {good > 0 && (
          <div style={{ width: `${pct(good)}%` }} className="bg-[#243329]/30 flex items-center justify-center">
            {pct(good) > 8 && <span className="text-[10px] font-bold text-white">{pct(good)}%</span>}
          </div>
        )}
        {bad > 0 && (
          <div style={{ width: `${pct(bad)}%` }} className="bg-[#C4322B] flex items-center justify-center">
            {pct(bad) > 8 && <span className="text-[10px] font-bold text-white">{pct(bad)}%</span>}
          </div>
        )}
      </div>
      <div className="flex gap-4 text-[10px] text-[#243329]/40">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />Muy buena {excellent}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#243329]/30 inline-block" />Normal {good}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#C4322B] inline-block" />Mala {bad}</span>
      </div>
    </div>
  )
}

function count(responses: SurveyResponse[], key: keyof SurveyResponse, val: string) {
  return responses.filter((r) => r[key] === val).length
}

/* ─── CSV export ─────────────────────────────────────────────── */

function exportCSV(data: SurveyResponse[]) {
  const header = ['Fecha', 'Hora', 'Nombre', 'Origen', 'Calidad', 'Tiempo entrega', 'Atención', 'Comentario']
  const rows = data.map((r) => [
    fmt(r.created_at),
    fmtTime(r.created_at),
    r.customer_name ?? '',
    r.order_origin ? (ORIGIN_LABELS[r.order_origin] ?? r.order_origin) : '',
    r.product_quality ?? '',
    r.delivery_time ?? '',
    r.service_attention ?? '',
    (r.comment ?? '').replace(/,/g, ';'),
  ])
  const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = `encuestas_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ─── Main Dashboard ─────────────────────────────────────────── */

export function SurveyDashboard() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<SurveyResponse | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [filterOrigin,    setFilterOrigin]    = useState('all')
  const [filterQuality,   setFilterQuality]   = useState('all')
  const [filterTime,      setFilterTime]      = useState('all')
  const [filterAttention, setFilterAttention] = useState('all')
  const [filterComment,   setFilterComment]   = useState('')
  const [dateExact,       setDateExact]       = useState('')
  const [sortBy,          setSortBy]          = useState<SortOption>('recent')

  const load = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('survey_responses')
      .select('id, product_quality, delivery_time, service_attention, order_origin, comment, customer_name, created_at')
      .order('created_at', { ascending: false })
    setResponses((data as SurveyResponse[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

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

  const stats = useMemo(() => ({
    total:   timeFiltered.length,
    delivery: timeFiltered.filter((r) => r.order_origin === 'delivery').length,
    pickup:   timeFiltered.filter((r) => r.order_origin === 'pickup' || r.order_origin === 'local').length,
    avgGeneral: timeFiltered.length
      ? timeFiltered.reduce((acc, r) => acc + avgScore(r), 0) / timeFiltered.length
      : 0,
  }), [timeFiltered])

  const filtered = useMemo(() => {
    let list = [...timeFiltered]
    if (filterOrigin    !== 'all') list = list.filter((r) => r.order_origin      === filterOrigin)
    if (filterQuality   !== 'all') list = list.filter((r) => r.product_quality   === filterQuality)
    if (filterTime      !== 'all') list = list.filter((r) => r.delivery_time     === filterTime)
    if (filterAttention !== 'all') list = list.filter((r) => r.service_attention === filterAttention)
    if (filterComment) list = list.filter((r) => r.comment?.toLowerCase().includes(filterComment.toLowerCase()))
    if (dateExact) list = list.filter((r) => fmt(r.created_at) === fmt(dateExact + 'T00:00:00'))
    if (sortBy === 'best')  list.sort((a, b) => avgScore(b) - avgScore(a))
    if (sortBy === 'worst') list.sort((a, b) => avgScore(a) - avgScore(b))
    return list
  }, [timeFiltered, filterOrigin, filterQuality, filterTime, filterAttention, filterComment, dateExact, sortBy])

  const hasFilters = filterOrigin !== 'all' || filterQuality !== 'all' || filterTime !== 'all' ||
    filterAttention !== 'all' || filterComment || dateExact || sortBy !== 'recent'

  const RATING_OPTIONS = [
    { value: 'all', label: 'Todas' },
    { value: 'bad', label: 'Mala' },
    { value: 'good', label: 'Normal' },
    { value: 'excellent', label: 'Muy buena' },
  ]

  function handleLogout() {
    startTransition(async () => {
      await logoutSurveyPanel()
      router.push('/encuestas/login')
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-[#F5EFE8]">

      {/* ── Topbar ── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#243329]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <div className="flex-1">
            <span className="font-serif text-base font-bold text-[#243329] tracking-wide">TOTORE</span>
            <span className="text-[#243329]/30 mx-2 text-xs">·</span>
            <span className="text-xs font-medium text-[#243329]/50">Encuestas</span>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-[#F5EFE8] rounded-lg p-1 border border-[#243329]/10">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-white shadow-sm text-[#243329]' : 'text-[#243329]/50 hover:text-[#243329]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Tabla
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'charts' ? 'bg-white shadow-sm text-[#243329]' : 'text-[#243329]/50 hover:text-[#243329]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Gráficos
            </button>
          </div>

          {/* Actions */}
          <button
            onClick={load}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#243329]/40 hover:text-[#243329] hover:bg-[#F5EFE8] transition-colors"
            title="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium text-[#243329]/60 hover:text-[#243329] hover:bg-[#F5EFE8] border border-[#243329]/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium text-[#243329]/60 hover:text-[#C4322B] border border-[#243329]/15 hover:border-[#C4322B]/30 transition-colors"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            Salir
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#243329]/35 mb-1.5">Panel interno</p>
          <h1 className="font-serif text-3xl font-bold text-[#243329]">Encuesta de satisfacción</h1>
        </div>

        {/* Time filters */}
        <div className="flex gap-2">
          <Pill active={timeFilter === 'today'} onClick={() => setTimeFilter('today')}>Hoy</Pill>
          <Pill active={timeFilter === 'week'}  onClick={() => setTimeFilter('week')}>Últimos 7 días</Pill>
          <Pill active={timeFilter === 'all'}   onClick={() => setTimeFilter('all')}>Todo</Pill>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total respuestas"  value={loading ? '—' : stats.total} />
          <StatCard label="Delivery"           value={loading ? '—' : stats.delivery} />
          <StatCard label="Local / Retiro"     value={loading ? '—' : stats.pickup} />
          <StatCard label="Promedio general"   value={loading ? '—' : avgLabel(stats.avgGeneral)} />
        </div>

        {/* Filters bar */}
        <div className="bg-white border border-[#243329]/10 rounded-2xl px-6 py-5">
          <div className="flex flex-wrap gap-4 items-end">
            <FSelect label="Origen" value={filterOrigin} onChange={setFilterOrigin} options={[
              { value: 'all', label: 'Todos' }, { value: 'delivery', label: 'Delivery' },
              { value: 'local', label: 'En el local' }, { value: 'pickup', label: 'Retiro' },
            ]} />
            <FSelect label="Calidad"        value={filterQuality}   onChange={setFilterQuality}   options={RATING_OPTIONS} />
            <FSelect label="Tiempo entrega" value={filterTime}      onChange={setFilterTime}      options={RATING_OPTIONS} />
            <FSelect label="Atención"       value={filterAttention} onChange={setFilterAttention} options={RATING_OPTIONS} />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">Fecha exacta</label>
              <input type="date" value={dateExact} onChange={(e) => setDateExact(e.target.value)}
                className="h-9 px-3 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
              <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">Comentario</label>
              <input type="text" value={filterComment} onChange={(e) => setFilterComment(e.target.value)}
                placeholder="Buscar..."
                className="h-9 px-3 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] placeholder:text-[#243329]/30 focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">Ordenar</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 px-3 pr-8 text-sm border border-[#243329]/15 rounded-xl bg-[#F5EFE8]/60 text-[#243329] appearance-none focus:outline-none focus:ring-1 focus:ring-[#C4322B]/30 transition-all"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23243329' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                <option value="recent">Recientes</option>
                <option value="best">Mejor calificación</option>
                <option value="worst">Peor calificación</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40 invisible">.</label>
              <div className="flex items-center gap-2 h-9">
                <span className="text-xs text-[#243329]/50">{filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}</span>
                {hasFilters && (
                  <button onClick={() => { setFilterOrigin('all'); setFilterQuality('all'); setFilterTime('all'); setFilterAttention('all'); setFilterComment(''); setDateExact(''); setSortBy('recent') }}
                    className="flex items-center gap-1 text-xs text-[#243329]/50 hover:text-[#C4322B] transition-colors"
                  >
                    <X className="w-3 h-3" /> Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── CHARTS VIEW ── */}
        {viewMode === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#243329]/10 rounded-2xl p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40 mb-6">Distribución por categoría</p>
              <div className="space-y-6">
                <MiniBar
                  label="Calidad del producto"
                  bad={count(filtered, 'product_quality', 'bad')}
                  good={count(filtered, 'product_quality', 'good')}
                  excellent={count(filtered, 'product_quality', 'excellent')}
                  total={filtered.filter((r) => r.product_quality).length}
                />
                <MiniBar
                  label="Tiempo de entrega"
                  bad={count(filtered, 'delivery_time', 'bad')}
                  good={count(filtered, 'delivery_time', 'good')}
                  excellent={count(filtered, 'delivery_time', 'excellent')}
                  total={filtered.filter((r) => r.delivery_time).length}
                />
                <MiniBar
                  label="Atención al cliente"
                  bad={count(filtered, 'service_attention', 'bad')}
                  good={count(filtered, 'service_attention', 'good')}
                  excellent={count(filtered, 'service_attention', 'excellent')}
                  total={filtered.filter((r) => r.service_attention).length}
                />
              </div>
            </div>

            <div className="bg-white border border-[#243329]/10 rounded-2xl p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40 mb-6">Origen de pedidos</p>
              <div className="space-y-3">
                {(['delivery', 'pickup', 'local'] as const).map((origin) => {
                  const n = filtered.filter((r) => r.order_origin === origin).length
                  const pct = filtered.length ? Math.round((n / filtered.length) * 100) : 0
                  return (
                    <div key={origin} className="flex items-center gap-4">
                      <span className="text-xs text-[#243329]/60 w-20 shrink-0">{ORIGIN_LABELS[origin]}</span>
                      <div className="flex-1 h-6 bg-[#F5EFE8] rounded-lg overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-full bg-[#C4322B]/70 rounded-lg transition-all duration-500" />
                      </div>
                      <span className="text-xs font-mono text-[#243329]/40 w-10 text-right">{n}</span>
                    </div>
                  )
                })}
              </div>

              {/* Recent comments */}
              <div className="mt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#243329]/40 mb-4">Últimos comentarios</p>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {filtered.filter((r) => r.comment).slice(0, 8).map((r) => (
                    <div key={r.id} className="bg-[#F5EFE8] rounded-xl px-4 py-3">
                      <p className="text-xs text-[#243329]/70 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
                      <p className="text-[10px] text-[#243329]/35 mt-1.5">{r.customer_name ?? 'Anónimo'} · {fmt(r.created_at)}</p>
                    </div>
                  ))}
                  {filtered.filter((r) => r.comment).length === 0 && (
                    <p className="text-xs text-[#243329]/30 text-center py-4">Sin comentarios</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {viewMode === 'table' && (
          loading ? (
            <div className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 border-b border-[#243329]/6 last:border-0 animate-pulse bg-[#F5EFE8]/40" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-[#243329]/10 rounded-2xl px-6 py-20 text-center">
              <p className="font-serif text-lg text-[#243329]/40">Sin resultados</p>
              <p className="text-xs text-[#243329]/30 mt-1">
                {hasFilters ? 'No hay respuestas para los filtros seleccionados.' : 'Todavía no se recibieron encuestas.'}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#243329]/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-[#243329]/8 bg-[#F5EFE8]/70">
                      {['Fecha', 'Hora', 'Origen', 'Calidad', 'Tiempo', 'Atención', 'Comentario'].map((col) => (
                        <th key={col} className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#243329]/40">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={r.id} onClick={() => setSelected(r)}
                        className={`border-b border-[#243329]/6 last:border-0 cursor-pointer transition-colors hover:bg-[#F5EFE8]/50 ${i % 2 !== 0 ? 'bg-[#243329]/[0.015]' : ''}`}
                      >
                        <td className="px-5 py-3.5 text-xs text-[#243329]/50 whitespace-nowrap font-mono">{fmt(r.created_at)}</td>
                        <td className="px-5 py-3.5 text-xs text-[#243329]/50 whitespace-nowrap font-mono">{fmtTime(r.created_at)}</td>
                        <td className="px-5 py-3.5"><OriginBadge value={r.order_origin} /></td>
                        <td className="px-5 py-3.5"><RatingBadge value={r.product_quality} /></td>
                        <td className="px-5 py-3.5"><RatingBadge value={r.delivery_time} /></td>
                        <td className="px-5 py-3.5"><RatingBadge value={r.service_attention} /></td>
                        <td className="px-5 py-3.5 max-w-[200px]">
                          {r.comment
                            ? <span className="text-xs text-[#243329]/70 line-clamp-1">{r.comment}</span>
                            : <span className="text-[#243329]/20 text-xs">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>

      {selected && <DetailModal response={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
