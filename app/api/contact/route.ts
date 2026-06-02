import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_TO = 'crumbsrhh@gmail.com'
const EMAIL_FROM = 'Totore <contacto@totore.com.ar>'

export async function POST(req: NextRequest) {
  try {
    const { nombre, email, telefono, asunto, mensaje } = await req.json()

    // Validación server-side
    if (!nombre?.trim() || !email?.trim() || !asunto?.trim() || !mensaje?.trim()) {
      return NextResponse.json(
        { error: 'Nombre, email, asunto y mensaje son obligatorios.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El email no tiene un formato válido.' },
        { status: 400 }
      )
    }

    await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      replyTo: email.trim(),
      subject: `[Totore] ${asunto.trim()} — ${nombre.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f7f4; padding: 32px; border-radius: 12px;">
          <div style="background: #243329; padding: 20px 28px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #f0e9de; margin: 0; font-size: 22px; letter-spacing: 1px;">TOTORE</h1>
            <p style="color: #a8b5a2; margin: 4px 0 0 0; font-size: 13px;">Nuevo mensaje del formulario de contacto</p>
          </div>

          <div style="background: #ffffff; border: 1px solid #e8e2da; border-top: none; border-radius: 0 0 8px 8px; padding: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3; width: 120px;">
                  <strong style="color: #6b5a4e; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3; color: #243329; font-size: 15px;">
                  ${nombre.trim()}
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <strong style="color: #6b5a4e; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <a href="mailto:${email.trim()}" style="color: #C4322B; text-decoration: none; font-size: 15px;">${email.trim()}</a>
                </td>
              </tr>
              ${telefono?.trim() ? `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <strong style="color: #6b5a4e; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Teléfono</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3; color: #243329; font-size: 15px;">
                  ${telefono.trim()}
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3;">
                  <strong style="color: #6b5a4e; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Asunto</strong>
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0ebe3; color: #243329; font-size: 15px;">
                  ${asunto.trim()}
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 16px 0 4px 0;">
                  <strong style="color: #6b5a4e; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje</strong>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 4px 0 0 0;">
                  <div style="background: #f9f7f4; border-left: 3px solid #C4322B; padding: 14px 16px; border-radius: 0 6px 6px 0; color: #243329; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">
                    ${mensaje.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                  </div>
                </td>
              </tr>
            </table>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0ebe3;">
              <a href="mailto:${email.trim()}" style="display: inline-block; background: #C4322B; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: bold;">
                Responder a ${nombre.trim()}
              </a>
            </div>
          </div>

          <p style="margin-top: 16px; color: #999; font-size: 12px; text-align: center;">
            Mensaje enviado desde el formulario de contacto de totore.com.ar
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Contact API] Error:', error)
    return NextResponse.json(
      { error: 'No se pudo enviar el mensaje. Intentá de nuevo más tarde.' },
      { status: 500 }
    )
  }
}
