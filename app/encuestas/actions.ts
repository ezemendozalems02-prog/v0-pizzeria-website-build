'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const SESSION_COOKIE = 'survey_panel_session'
const SESSION_VALUE = 'authenticated'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

export async function loginSurveyPanel(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Fetch the user and verify password with pgcrypto crypt
    const { data, error } = await supabase
      .from('survey_panel_users')
      .select('id, username, password_hash')
      .eq('username', username)
      .single()

    if (error || !data) {
      return { success: false, error: 'Usuario o contraseña incorrectos.' }
    }

    // Verify password using pgcrypto
    const { data: verified, error: verifyError } = await supabase
      .rpc('verify_survey_password', {
        input_password: password,
        stored_hash: data.password_hash,
      })

    if (verifyError || !verified) {
      return { success: false, error: 'Usuario o contraseña incorrectos.' }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/encuestas',
    })

    return { success: true }
  } catch (err) {
    console.error('[survey] login error:', err)
    return { success: false, error: 'Error del servidor. Intentá de nuevo.' }
  }
}

export async function logoutSurveyPanel(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function checkSurveySession(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE
}

export async function clearSurveyData(): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify user is authenticated
    const isAuth = await checkSurveySession()
    if (!isAuth) {
      return { success: false, error: 'No autorizado.' }
    }

    const supabase = await createClient()

    // Delete all survey responses
    const { error } = await supabase
      .from('survey_responses')
      .delete()
      .neq('id', '') // Fake filter to delete all rows

    if (error) {
      console.error('[survey] clear data error:', error)
      return { success: false, error: 'Error al limpiar los datos.' }
    }

    return { success: true }
  } catch (err) {
    console.error('[survey] clear data error:', err)
    return { success: false, error: 'Error del servidor. Intentá de nuevo.' }
  }
}
