import { redirect } from 'next/navigation'
import { checkSurveySession } from './actions'
import { SurveyDashboard } from './survey-dashboard'

export default async function SurveyPanelPage() {
  const authed = await checkSurveySession()
  if (!authed) redirect('/encuestas/login')
  return <SurveyDashboard />
}
