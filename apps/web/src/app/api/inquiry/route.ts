import { NextRequest, NextResponse } from 'next/server'

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'office@example.com'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

interface InquiryData {
  name: string
  email: string
  phone: string
  message?: string
  productId?: number
  productTitle?: string
}

export async function POST(req: NextRequest) {
  try {
    const data: InquiryData = await req.json()

    // Validare
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate.' },
        { status: 400 }
      )
    }

    // 1. Salvează cererea în CMS
    const cmsResponse = await fetch(`${CMS_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || '',
        product: data.productId || null,
      }),
    })

    if (!cmsResponse.ok) {
      console.error('CMS error:', await cmsResponse.text())
      return NextResponse.json(
        { error: 'Eroare la salvarea cererii.' },
        { status: 500 }
      )
    }

    // 2. Trimite email-uri (doar dacă Resend e configurat)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        // Email notificare către echipă
        await resend.emails.send({
          from: 'Haier România <noreply@haier.ro>',
          to: CONTACT_EMAIL,
          subject: `Cerere ofertă nouă${data.productTitle ? ` - ${data.productTitle}` : ''}`,
          html: `
            <h2>Cerere ofertă nouă</h2>
            <p><strong>Nume:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Telefon:</strong> ${escapeHtml(data.phone)}</p>
            ${data.productTitle ? `<p><strong>Produs:</strong> ${escapeHtml(data.productTitle)}</p>` : ''}
            ${data.message ? `<p><strong>Mesaj:</strong></p><p>${escapeHtml(data.message)}</p>` : ''}
            <hr>
            <p><small>Această cerere a fost trimisă prin site-ul Haier România.</small></p>
          `,
        })

        // Email confirmare către client
        await resend.emails.send({
          from: 'Haier România <noreply@haier.ro>',
          to: data.email,
          subject: 'Confirmare cerere ofertă — Haier România',
          html: `
            <h2>Îți mulțumim pentru cererea ta!</h2>
            <p>Dragă ${escapeHtml(data.name)},</p>
            <p>Am primit cererea ta de ofertă${data.productTitle ? ` pentru <strong>${escapeHtml(data.productTitle)}</strong>` : ''} și echipa noastră o va analiza în cel mai scurt timp.</p>
            <p>Un consultant Haier te va contacta pentru a-ți oferi cea mai bună soluție.</p>
            <br>
            <p><strong>Detaliile cererii tale:</strong></p>
            <p>Nume: ${escapeHtml(data.name)}</p>
            <p>Telefon: ${escapeHtml(data.phone)}</p>
            ${data.productTitle ? `<p>Produs solicitat: ${escapeHtml(data.productTitle)}</p>` : ''}
            ${data.message ? `<p>Mesajul tău: ${escapeHtml(data.message)}</p>` : ''}
            <br>
            <p>Cu stimă,<br>Echipa Haier România</p>
          `,
        })
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Email error:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare. Te rugăm să încerci din nou.' },
      { status: 500 }
    )
  }
}
