'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, MessageSquare, Loader2 } from 'lucide-react'

interface SurveyResponse {
  id: string
  name: string
  email: string
  rating: number
  experience: string
  order_origin: string
  comments: string
  submitted_at: string
}

const experienceLabels: Record<string, string> = {
  quality: 'Calidad de la comida',
  service: 'Atención al cliente',
  atmosphere: 'Ambiente del local',
  delivery: 'Velocidad de entrega',
  price: 'Relación precio-calidad',
}

const originLabels: Record<string, string> = {
  local: 'Visitaron el local',
  delivery: 'Pedido por delivery',
  takeaway: 'Retiraron en el local',
}

export default function SurveyResponsesPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    topExperience: '',
  })

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const supabase = await createClient()

        const { data, error } = await supabase
          .from('survey_responses')
          .select('*')
          .order('submitted_at', { ascending: false })

        if (error) throw error

        setResponses(data || [])

        // Calculate stats
        if (data && data.length > 0) {
          const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length
          const experienceCounts: Record<string, number> = {}
          data.forEach((r) => {
            experienceCounts[r.experience] = (experienceCounts[r.experience] || 0) + 1
          })
          const topExperience = Object.entries(experienceCounts).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0]

          setStats({
            total: data.length,
            avgRating: Math.round(avgRating * 10) / 10,
            topExperience: topExperience || '',
          })
        }
      } catch (error) {
        console.error('Error fetching responses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResponses()
  }, [])

  if (loading) {
    return (
      <div className="max-w-5xl">
        <h1 className="text-3xl font-serif font-bold text-admin-text mb-8">Respuestas de Encuestas</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-serif font-bold text-admin-text mb-8">Respuestas de Encuestas</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-admin-border bg-admin-card">
          <p className="text-sm text-admin-muted mb-2">Total de respuestas</p>
          <p className="text-4xl font-bold text-primary">{stats.total}</p>
        </Card>

        <Card className="p-6 border-admin-border bg-admin-card">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
            <p className="text-sm text-admin-muted">Calificación promedio</p>
          </div>
          <p className="text-4xl font-bold text-primary">{stats.avgRating}</p>
        </Card>

        <Card className="p-6 border-admin-border bg-admin-card">
          <p className="text-sm text-admin-muted mb-2">Aspecto más valorado</p>
          <p className="text-lg font-medium text-admin-text">
            {experienceLabels[stats.topExperience] || 'N/A'}
          </p>
        </Card>
      </div>

      {/* Responses List */}
      {responses.length === 0 ? (
        <Card className="p-12 border-admin-border bg-admin-card text-center">
          <MessageSquare className="w-12 h-12 text-admin-muted/30 mx-auto mb-4" />
          <p className="text-admin-muted">Aún no hay respuestas de encuestas</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => (
            <Card
              key={response.id}
              className="p-6 border-admin-border bg-admin-card hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="font-medium text-admin-text">{response.name}</p>
                    <p className="text-sm text-admin-muted">{response.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < response.rating ? '#C4322B' : 'none'}
                        color={i < response.rating ? '#C4322B' : '#ddd'}
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-admin-muted mb-1">Tipo de experiencia</p>
                    <p className="text-admin-text font-medium">
                      {originLabels[response.order_origin] || response.order_origin}
                    </p>
                  </div>
                  <div>
                    <p className="text-admin-muted mb-1">Aspecto valorado</p>
                    <p className="text-admin-text font-medium">
                      {experienceLabels[response.experience] || response.experience}
                    </p>
                  </div>
                  <div>
                    <p className="text-admin-muted mb-1">Fecha</p>
                    <p className="text-admin-text font-medium">
                      {new Date(response.submitted_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>

                {/* Comments */}
                {response.comments && (
                  <div className="pt-4 border-t border-admin-border">
                    <p className="text-sm text-admin-muted mb-2">Comentarios</p>
                    <p className="text-admin-text text-sm leading-relaxed italic">
                      "{response.comments}"
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
