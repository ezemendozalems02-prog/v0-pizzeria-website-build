import { Resend } from 'resend'
import { type NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_TO = process.env.CONTACT_EMAIL || ''
const EMAIL_FROM = 'Totore <contacto@totore.com.ar>'

export async function POST(req: NextRequest) {
  try {
    if (!EMAIL_TO) {
      return NextResponse.json(
        { error: 'Error de configuración del servidor.' },
        { status: 500 }
      )
    }
    const formData = await req.formData()

    const nombre  = formData.get('nombre')?.toString().trim() ?? ''
    const telefono = formData.get('telefono')?.toString().trim() ?? ''
    const email   = formData.get('email')?.toString().trim() ?? ''
    const puesto  = formData.get('puesto')?.toString().trim() ?? ''
    const mensaje = formData.get('mensaje')?.toString().trim() ?? ''
    const cvFile  = formData.get('cv') as File | null

    if (!nombre) return NextResponse.json({ error: 'El nombre es requerido.' }, { status: 400 })
    if (!telefono) return NextResponse.json({ error: 'El teléfono es requerido.' }, { status: 400 })
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'El email no es válido.' }, { status: 400 })
    }
    if (!puesto) return NextResponse.json({ error: 'El puesto de interés es requerido.' }, { status: 400 })
    if (!cvFile || cvFile.size === 0) return NextResponse.json({ error: 'El CV es requerido.' }, { status: 400 })
    if (cvFile.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'El CV no puede superar 5 MB.' }, { status: 400 })

    const cvBuffer = Buffer.from(await cvFile.arrayBuffer())
    const cvBase64 = cvBuffer.toString('base64')

    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: email,
      subject: `[Totore] Postulación: ${puesto} — ${nombre}`,
      attachments: [{ filename: cvFile.name || 'cv.pdf', content: cvBase64 }],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f7f4; padding: 32px; border-radius: 12px;">
          <div style="background: #2C1810; padding: 20px 28px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #f0e9de; margin: 0; font-size: 22px; letter-spacing: 1px;">TOTORE</h1>
            <p style="color: #c9b09a; margin: 4px 0 0 0; font-size: 13px;">Nueva postulación — Trabaja con nosotros</p>
          </div>
          <div style="background: #ffffff; border: 1px solid #e8e2da; border-top: none; border-radius: 0 0 8px 8px; padding: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3; width: 140px;">
                  <strong style="color: #6b5a4e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3; color: #1a1a1a; font-size: 15px;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <strong style="color: #6b5a4e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Teléfono</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3; color: #1a1a1a; font-size: 15px;">${telefono}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <strong style="color: #6b5a4e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <a href="mailto:${email}" style="color: #C4322B; text-decoration: none; font-size: 15px;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <strong style="color: #6b5a4e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Puesto</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <span style="background: #fff0f0; color: #C4322B; padding: 3px 10px; border-radius: 999px; font-size: 13px; font-weight: 600;">${puesto}</span>
                </td>
              </tr>
              ${mensaje ? `
              <tr>
                <td style="padding: 14px 0 4px 0;" colspan="2">
                  <strong style="color: #6b5a4e; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje adicional</strong>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 4px 0 0 0;">
                  <div style="background: #f9f7f4; border-left: 3px solid #C4322B; padding: 12px 16px; border-radius: 0 6px 6px 0; color: #1a1a1a; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${mensaje.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                </td>
              </tr>` : ''}
            </table>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0ebe3;">
              <p style="margin: 0 0 12px 0; color: #555; font-size: 13px;">El CV se encuentra adjunto a este email.</p>
              <a href="mailto:${email}" style="display: inline-block; background: #C4322B; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold;">
                Responder a ${nombre}
              </a>
            </div>
          </div>
          <p style="margin-top: 16px; color: #999; font-size: 12px; text-align: center;">
            Postulación recibida desde totore.com.ar
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json({ error: 'No se pudo enviar la postulación. Intentá de nuevo más tarde.' }, { status: 500 })
  }
}
