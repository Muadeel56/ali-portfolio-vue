import { site } from './site.js'

const WHATSAPP_NUMBER = '923320599106'
export const EMAIL = 'ah3781830@gmail.com'

// The only place that builds wa.me links.
export const whatsappLink = (message = site.whatsappMessage) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

// "Hi Ali, I'd like to talk about a wedding film edit."
export const serviceWhatsappMessage = (service) =>
  service ? `Hi Ali, I'd like to talk about a ${service.title.toLowerCase()}.` : site.whatsappMessage

export const contactInfo = [
  { label: 'Email', href: `mailto:${EMAIL}`, text: EMAIL },
  { label: 'WhatsApp', href: whatsappLink(), text: '+92 332 0599106' },
  { label: 'Instagram', href: 'https://instagram.com/malikali.legacy', text: '@malikali.legacy' },
]

export const socials = [
  { label: 'Instagram', href: 'https://instagram.com/malikali.legacy' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-hassan-0a978821b/' },
]

// Project brief form. TODO: from Ali — confirm ranges and currency.
export const budgetRanges = ['Under $250', '$250–500', '$500–1,000', '$1,000+', 'Not sure yet']

// EmailJS ids come from .env (see .env.example). The public key ships to the browser by design:
// restrict it to the site's domain in the EmailJS dashboard (Account → Security → allowed origins).
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}

export const emailjsReady = Boolean(emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey)
