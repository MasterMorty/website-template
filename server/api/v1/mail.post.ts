import { Resend } from 'resend'
import env from '~~/lib/env'
import { buildContactMailHtml } from '../../utils/contactMailTemplate'

const resend = new Resend(env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !message) {
        throw createError({ statusCode: 400, message: 'name, email, and message are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw createError({ statusCode: 400, message: 'Invalid email address' })
    }

    if (name.length > 200 || email.length > 254 || message.length > 5000) {
        throw createError({ statusCode: 400, message: 'Input exceeds maximum allowed length' })
    }

    const html = buildContactMailHtml({ title: name, body: message, replyTo: email })

    const { error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: env.RESEND_TO_EMAIL,
        replyTo: email,
        subject: `Neue Kundenanfrage von ${name}`,
        html,
    })

    if (error) {
        throw createError({ statusCode: 502, message: 'Failed to send email' })
    }

    return { success: true }
})
