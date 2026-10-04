import { computed, shallowRef } from 'vue'
import { whatsappLink, serviceWhatsappMessage } from '@/data/contact.js'

// The service the visitor is looking at right now (the film open in the player, the /services
// row in view, or ?service= on /contact), so WhatsApp opens with a matching message.
export const whatsappService = shallowRef(null)

export const whatsappHref = computed(() => whatsappLink(serviceWhatsappMessage(whatsappService.value)))
