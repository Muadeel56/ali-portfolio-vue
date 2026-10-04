<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import emailjs from '@emailjs/browser'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { track } from '@/composables/useAnalytics.js'
import { contactInfo, socials, budgetRanges, emailjsConfig, emailjsReady, EMAIL, whatsappLink, serviceWhatsappMessage } from '@/data/contact.js'
import { services, findService } from '@/data/services.js'
import Rule from '../ui/Rule.vue'
import AvailabilityBadge from '../ui/AvailabilityBadge.vue'

useScrollReveal('.contact-section .reveal')

const OTHER = { value: 'other', label: 'Something else' }
const serviceOptions = [...services.map((sv) => ({ value: sv.id, label: sv.title })), OTHER]
const serviceLabel = (value) => serviceOptions.find((o) => o.value === value)?.label ?? ''

// Local YYYY-MM-DD (not UTC), the format <input type="date"> uses
const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const today = isoDate(new Date())
const formatDeadline = (value, flexible) =>
  flexible || !value
    ? 'Flexible'
    : new Date(`${value}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const blank = () => ({
  name: '',
  email: '',
  service: '',
  budget: '',
  deadline: '',
  flexible: false,
  footage: '',
  message: '',
  hp: '', // honeypot: people never see it, bots fill it in
})

const form = ref(blank())
const focusedField = ref(null)
const status = ref('idle') // idle | sending | success | error
const sent = ref(null) // summary shown on the success screen

// Pre-fill from /contact?service=<id> (Enquire links). Unknown ids are ignored.
// Watched, not just read on mount, so it also works when already on /contact.
const route = useRoute()
watch(
  () => route.query.service,
  (id) => {
    const service = findService(id)
    if (!service) return
    form.value.service = service.id
    if (!form.value.message) form.value.message = `I have footage for a ${service.title.toLowerCase()} project. `
  },
  { immediate: true },
)

// "Flexible" clears and disables the date
watch(
  () => form.value.flexible,
  (flexible) => {
    if (flexible) form.value.deadline = ''
  },
)

// ── Validation: on submit, then on blur for fields already touched ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/\S+\.\S+$/i

const errors = computed(() => {
  const f = form.value
  const e = {}
  if (!f.name.trim()) e.name = 'Please add your name.'
  if (!f.email.trim()) e.email = 'Please add your email so I can reply.'
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'That email doesn’t look right. Check for typos.'
  if (f.deadline && !f.flexible && f.deadline < today) e.deadline = 'Pick a date from today onwards, or tick Flexible.'
  if (f.footage.trim() && !URL_RE.test(f.footage.trim())) e.footage = 'Paste the full link, starting with https://'
  if (!f.message.trim()) e.message = 'Tell me a little about the project.'
  return e
})

const FIELD_ORDER = ['name', 'email', 'service', 'budget', 'deadline', 'footage', 'message']
const touched = reactive(new Set())
const attempted = ref(false)
const errorFor = (field) => ((attempted.value || touched.has(field)) && errors.value[field]) || ''

// aria-describedby: the error (when shown) plus any hint
const describedBy = (field, hint) => [errorFor(field) && `cs-${field}-error`, hint].filter(Boolean).join(' ') || undefined

const onFocus = (field) => {
  focusedField.value = field
}
const onBlur = (field) => {
  focusedField.value = null
  touched.add(field)
}
const isFocused = (field) => focusedField.value === field

// ── Fallbacks when sending fails ──
const briefText = computed(() => {
  const f = form.value
  return [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Service: ${serviceLabel(f.service) || '—'}`,
    `Budget: ${f.budget || '—'}`,
    `Deadline: ${formatDeadline(f.deadline, f.flexible)}`,
    `Footage: ${f.footage || '—'}`,
    '',
    f.message,
  ].join('\n')
})
const mailtoHref = computed(
  () =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(`Project brief — ${serviceLabel(form.value.service) || 'New project'}`)}&body=${encodeURIComponent(briefText.value)}`,
)
const whatsappHref = computed(() => whatsappLink(serviceWhatsappMessage(findService(form.value.service))))

// ── Submit ──
const successTitleRef = ref(null)

const showSuccess = (summary) => {
  sent.value = summary
  status.value = 'success'
  form.value = blank()
  touched.clear()
  attempted.value = false
  nextTick(() => successTitleRef.value?.focus())
}

const submit = async () => {
  if (status.value === 'sending') return
  const f = form.value
  const summary = [serviceLabel(f.service), f.budget, formatDeadline(f.deadline, f.flexible)].filter(Boolean).join(' · ')

  // A bot filled the honeypot: pretend it worked, send nothing
  if (f.hp) {
    if (import.meta.env.DEV) console.warn('ContactSection: honeypot field was filled, so nothing was sent.')
    showSuccess(summary)
    return
  }

  attempted.value = true
  const firstInvalid = FIELD_ORDER.find((field) => errors.value[field])
  if (firstInvalid) {
    status.value = 'idle'
    nextTick(() => document.getElementById(`cs-${firstInvalid}`)?.focus())
    return
  }

  if (!emailjsReady) {
    if (import.meta.env.DEV) console.warn('ContactSection: VITE_EMAILJS_* are not set (see .env.example), so the form cannot send.')
    status.value = 'error'
    return
  }

  status.value = 'sending'
  try {
    await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.templateId,
      {
        from_name: f.name.trim(),
        from_email: f.email.trim(),
        service: serviceLabel(f.service) || 'Not specified',
        budget: f.budget || 'Not specified',
        deadline: formatDeadline(f.deadline, f.flexible),
        footage_link: f.footage.trim() || 'None',
        message: f.message.trim(),
        page_url: window.location.href,
      },
      { publicKey: emailjsConfig.publicKey },
    )
    track('Form Submit', { service: f.service || 'none', budget: f.budget || 'none' })
    showSuccess(summary)
  } catch {
    status.value = 'error'
  }
}

const reset = () => {
  status.value = 'idle'
  sent.value = null
}
</script>

<template>
  <section id="contact" class="section section--after-hero contact-section" aria-label="Contact details and project brief">
    <div class="container">

      <div class="cs__grid grid-12">

        <!-- ── Left column ───────────────────────────── -->
        <div class="cs__left reveal">
          <p class="t-label cs__lead">Direct lines</p>

          <div class="cs__info">
            <div v-for="item in contactInfo" :key="item.label" class="cs__info-item">
              <span class="cs__info-lbl">{{ item.label }}</span>
              <a
                :href="item.href"
                class="cs__info-link"
                v-bind="item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                @click="item.label === 'WhatsApp' && track('WhatsApp Click', { from: 'contact' })"
              >{{ item.text }}</a>
            </div>
          </div>

          <Rule class="cs__socials-rule" />
          <div class="cs__socials" aria-label="Follow on social media">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              class="cs__social-link"
              target="_blank"
              rel="noopener noreferrer"
            >{{ social.label }}</a>
          </div>

          <AvailabilityBadge class="cs__status" />
        </div>

        <!-- ── Right column — form ───────────────────── -->
        <div class="cs__form-wrap reveal">
          <div class="cs__form-head">
            <h3 class="cs__form-title">Project Brief</h3>
            <span class="cs__form-meta"><b>Reply</b> within 24h</span>
          </div>
          <Rule class="cs__form-divider" />

          <!-- Success state (the live region exists before it fills, so it's announced) -->
          <div aria-live="polite">
            <Transition name="fade">
              <div v-if="status === 'success'" class="cs__success">
                <span class="cs__success-icon" aria-hidden="true">✓</span>
                <h4 ref="successTitleRef" class="cs__success-title" tabindex="-1">Brief received.</h4>
                <p v-if="sent" class="t-mono cs__success-summary">{{ sent }}</p>
                <p class="cs__success-body">
                  I'll reply within 24 hours with questions or a quote. Anything urgent?
                  <a :href="whatsappLink()" target="_blank" rel="noopener noreferrer" class="cs__inline-link" @click="track('WhatsApp Click', { from: 'contact-success' })">Message me on WhatsApp →</a>
                </p>
                <button type="button" class="cs__success-reset btn btn-outline" @click="reset">
                  Send another →
                </button>
              </div>
            </Transition>
          </div>

          <Transition name="fade">
            <form v-if="status !== 'success'" class="cs__form" novalidate @submit.prevent="submit">

              <!-- Honeypot: hidden from people and assistive tech. Its name and label match nothing
                   browser autofill knows (e.g. "website", "url", "company"), or autofill would fill it
                   and the real brief would be dropped. -->
              <div class="cs__hp" aria-hidden="true">
                <label for="cs-hp">Leave this empty</label>
                <input id="cs-hp" v-model="form.hp" type="text" name="cs_hp_field" tabindex="-1" autocomplete="off" data-lpignore="true" data-1p-ignore />
              </div>

              <!-- 01 Name -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('name'), 'is-invalid': errorFor('name') }">
                <span class="cs__field-num" aria-hidden="true">01</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-name">Name</label>
                  <span class="cs__opt" aria-hidden="true">Required</span>
                </div>
                <input
                  id="cs-name"
                  v-model="form.name"
                  type="text"
                  placeholder="Your Name"
                  required
                  autocomplete="name"
                  :aria-invalid="errorFor('name') ? 'true' : undefined"
                  :aria-describedby="describedBy('name')"
                  @focus="onFocus('name')"
                  @blur="onBlur('name')"
                />
                <p id="cs-name-error" class="cs__field-error">{{ errorFor('name') }}</p>
              </div>

              <!-- 02 Email -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('email'), 'is-invalid': errorFor('email') }">
                <span class="cs__field-num" aria-hidden="true">02</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-email">Email Address</label>
                  <span class="cs__opt" aria-hidden="true">Required</span>
                </div>
                <input
                  id="cs-email"
                  v-model="form.email"
                  type="email"
                  inputmode="email"
                  placeholder="Email Address"
                  required
                  autocomplete="email"
                  :aria-invalid="errorFor('email') ? 'true' : undefined"
                  :aria-describedby="describedBy('email')"
                  @focus="onFocus('email')"
                  @blur="onBlur('email')"
                />
                <p id="cs-email-error" class="cs__field-error">{{ errorFor('email') }}</p>
              </div>

              <!-- 03 Service -->
              <div class="cs__field cs__field--select" :class="{ 'is-focused': isFocused('service'), 'has-value': form.service }">
                <span class="cs__field-num" aria-hidden="true">03</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-service">Service</label>
                  <span class="cs__opt" aria-hidden="true">Optional</span>
                </div>
                <div class="cs__select">
                  <select id="cs-service" v-model="form.service" @focus="onFocus('service')" @blur="onBlur('service')">
                    <option value="">Select a Service</option>
                    <option v-for="o in serviceOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                  </select>
                  <span class="cs__select-arrow" aria-hidden="true" />
                </div>
              </div>

              <!-- 04 Budget -->
              <div class="cs__field cs__field--select" :class="{ 'is-focused': isFocused('budget'), 'has-value': form.budget }">
                <span class="cs__field-num" aria-hidden="true">04</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-budget">Budget</label>
                  <span class="cs__opt" aria-hidden="true">Optional</span>
                </div>
                <div class="cs__select">
                  <select id="cs-budget" v-model="form.budget" @focus="onFocus('budget')" @blur="onBlur('budget')">
                    <option value="">Select a Range</option>
                    <option v-for="range in budgetRanges" :key="range" :value="range">{{ range }}</option>
                  </select>
                  <span class="cs__select-arrow" aria-hidden="true" />
                </div>
              </div>

              <!-- 05 Deadline -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('deadline'), 'is-invalid': errorFor('deadline') }">
                <span class="cs__field-num" aria-hidden="true">05</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-deadline">Deadline</label>
                  <span class="cs__opt" aria-hidden="true">Optional</span>
                </div>
                <div class="cs__deadline">
                  <input
                    id="cs-deadline"
                    v-model="form.deadline"
                    type="date"
                    :min="today"
                    :disabled="form.flexible"
                    :aria-invalid="errorFor('deadline') ? 'true' : undefined"
                    :aria-describedby="describedBy('deadline')"
                    @focus="onFocus('deadline')"
                    @blur="onBlur('deadline')"
                  />
                  <label class="cs__check">
                    <input v-model="form.flexible" type="checkbox" />
                    <span>Flexible</span>
                  </label>
                </div>
                <p id="cs-deadline-error" class="cs__field-error">{{ errorFor('deadline') }}</p>
              </div>

              <!-- 06 Footage link -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('footage'), 'is-invalid': errorFor('footage') }">
                <span class="cs__field-num" aria-hidden="true">06</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-footage">Footage Link</label>
                  <span class="cs__opt" aria-hidden="true">Optional</span>
                </div>
                <input
                  id="cs-footage"
                  v-model="form.footage"
                  type="url"
                  inputmode="url"
                  placeholder="https://"
                  autocomplete="url"
                  :aria-invalid="errorFor('footage') ? 'true' : undefined"
                  :aria-describedby="describedBy('footage', 'cs-footage-hint')"
                  @focus="onFocus('footage')"
                  @blur="onBlur('footage')"
                />
                <p id="cs-footage-hint" class="cs__hint">Google Drive, WeTransfer or Dropbox link</p>
                <p id="cs-footage-error" class="cs__field-error">{{ errorFor('footage') }}</p>
              </div>

              <!-- 07 Message -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('message'), 'is-invalid': errorFor('message') }">
                <span class="cs__field-num" aria-hidden="true">07</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-message">Message</label>
                  <span class="cs__opt" aria-hidden="true">Required</span>
                </div>
                <textarea
                  id="cs-message"
                  v-model="form.message"
                  rows="4"
                  placeholder="Tell me about your project..."
                  required
                  :aria-invalid="errorFor('message') ? 'true' : undefined"
                  :aria-describedby="describedBy('message')"
                  @focus="onFocus('message')"
                  @blur="onBlur('message')"
                />
                <p id="cs-message-error" class="cs__field-error">{{ errorFor('message') }}</p>
              </div>

              <!-- Submit row -->
              <div class="cs__form-foot">
                <p class="cs__privacy">
                  <b>By sending</b> you agree to be contacted about your project. No spam, ever.
                </p>
                <button
                  type="submit"
                  class="btn btn-primary cs__submit"
                  :disabled="status === 'sending'"
                >
                  {{ status === 'sending' ? 'Sending…' : 'Send Brief' }}
                  <span v-if="status !== 'sending'" aria-hidden="true">→</span>
                </button>
              </div>

              <!-- Sending failed: the form stays filled in -->
              <Transition name="fade">
                <div v-if="status === 'error'" class="cs__error" role="alert">
                  <p><span aria-hidden="true">⚠</span> Your brief couldn't be sent. Nothing is lost: send it another way.</p>
                  <p class="cs__error-links">
                    <a :href="mailtoHref" class="cs__inline-link">Email the brief →</a>
                    <a
                      :href="whatsappHref"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="cs__inline-link"
                      @click="track('WhatsApp Click', { from: 'contact-error' })"
                    >WhatsApp →</a>
                  </p>
                </div>
              </Transition>

            </form>
          </Transition>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
/* ─── Fade transition ──────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-base) var(--ease-out-expo);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cs__grid {
  row-gap: var(--space-08);
  align-items: start;
}

/* ─── Left column ──────────────────────────────────────────── */
.cs__lead {
  margin: 0;
}

.cs__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-05);
  margin-top: var(--space-05);
}

.cs__info-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-02);
}

.cs__info-lbl {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.cs__info-link {
  font-size: var(--fs-body-lg);
  color: var(--text);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out-expo);
  word-break: break-word;
  /* 44px tall hit area */
  display: inline-flex;
  align-items: center;
  min-height: var(--tap);
}

.cs__info-link:hover {
  color: var(--gold);
}

.cs__socials {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-05);
  padding-top: var(--space-05);
}

.cs__socials-rule {
  margin-top: var(--space-07);
}

.cs__social-link {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  /* 44px tall hit area */
  display: inline-flex;
  align-items: center;
  min-height: var(--tap);
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.cs__social-link:hover {
  color: var(--gold);
  text-decoration: underline;
  text-underline-offset: 6px;
}

.cs__status {
  margin-top: var(--space-06);
}

/* ─── Form ─────────────────────────────────────────────────── */
.cs__form-wrap {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--rule);
  padding: var(--space-06) var(--space-05);
}

.cs__form-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-04);
}

.cs__form-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--text);
  margin: 0;
}

.cs__form-meta {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.cs__form-meta b {
  color: var(--text-dim);
  font-weight: 500;
}

.cs__form-divider {
  margin: var(--space-05) 0 var(--space-06);
}

.cs__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-04);
}

/* Honeypot: off-screen, not display:none (some bots skip hidden fields) */
.cs__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.cs__field {
  position: relative;
}

.cs__field-num {
  display: none;
  position: absolute;
  left: calc(-1 * var(--space-07));
  top: 0;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  color: var(--muted);
}

.cs__label-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-02);
}

.cs__field-lbl {
  font-weight: 500;
  font-size: var(--fs-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--text-dim);
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.cs__opt {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.cs__field input,
.cs__field select,
.cs__field textarea {
  width: 100%;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--rule);
  padding: var(--space-03) 0;
  font-family: var(--sans);
  /* 16px minimum: iOS Safari zooms into smaller inputs on focus */
  font-size: max(16px, var(--fs-body));
  color: var(--text);
  outline: none;
  transition: border-color var(--dur-fast) var(--ease-out-expo);
  border-radius: 0;
  appearance: none;
}

.cs__field input::placeholder,
.cs__field textarea::placeholder {
  color: var(--muted);
}

.cs__field select {
  min-height: var(--tap);
  color: var(--muted);
  cursor: pointer;
  padding-right: var(--space-05);
}

.cs__field.has-value select {
  color: var(--text);
}

.cs__field input[type='date'] {
  color-scheme: dark;
  min-height: var(--tap);
}

.cs__field input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cs__field select option {
  background: var(--surface);
  color: var(--text);
}

.cs__field textarea {
  resize: none;
  min-height: 110px;
}

.cs__select {
  position: relative;
}

.cs__select-arrow {
  position: absolute;
  right: var(--space-01);
  top: calc(50% - 6px);
  width: 8px;
  height: 8px;
  border-right: 1px solid var(--text-dim);
  border-bottom: 1px solid var(--text-dim);
  transform: rotate(45deg);
  pointer-events: none;
}

/* Focused field: gold label and underline, no glow */
.cs__field.is-focused .cs__field-lbl {
  color: var(--gold);
}

.cs__field.is-focused input,
.cs__field.is-focused select,
.cs__field.is-focused textarea {
  border-bottom-color: var(--gold);
}

.cs__field.is-invalid input,
.cs__field.is-invalid textarea {
  border-bottom-color: var(--gold-light);
}

/* Error line: space reserved so messages never push the form around (no CLS) */
.cs__field-error {
  min-height: calc(var(--fs-caption) * 1.6);
  margin: var(--space-02) 0 0;
  font-size: var(--fs-caption);
  line-height: 1.6;
  color: var(--gold-light);
}

.cs__hint {
  margin: var(--space-02) 0 0;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ─── Deadline: date + Flexible ─────────────────────────────── */
.cs__deadline {
  display: flex;
  align-items: flex-end;
  gap: var(--space-05);
}

.cs__deadline input[type='date'] {
  flex: 1;
  min-width: 0;
}

.cs__check {
  display: inline-flex;
  align-items: center;
  gap: var(--space-02);
  min-height: var(--tap);
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  cursor: pointer;
}

.cs__field .cs__check input {
  width: var(--space-04);
  height: var(--space-04);
  margin: 0;
  padding: 0;
  appearance: auto;
  accent-color: var(--gold);
  cursor: pointer;
}

.cs__inline-link {
  color: var(--gold);
  text-decoration: underline;
  text-decoration-color: var(--gold-dim);
  text-underline-offset: 4px;
  transition: text-decoration-color var(--dur-fast) var(--ease-out-expo);
}

.cs__inline-link:hover,
.cs__inline-link:focus-visible {
  text-decoration-color: var(--gold);
}

/* ─── Submit row ───────────────────────────────────────────── */
.cs__form-foot {
  display: flex;
  flex-direction: column;
  gap: var(--space-05);
}

.cs__privacy {
  font-size: var(--fs-caption);
  line-height: 1.6;
  color: var(--muted);
  margin: 0;
  max-width: 36ch;
}

.cs__privacy b {
  color: var(--text-dim);
  font-weight: 500;
}

.cs__submit {
  width: 100%;
}

.cs__submit:disabled {
  opacity: 0.6;
  cursor: wait;
}

.cs__error {
  font-size: var(--fs-body);
  color: var(--gold-light);
  margin: 0;
}

.cs__error p {
  margin: 0;
}

.cs__error-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-02) var(--space-05);
  margin-top: var(--space-03);
}

.cs__error-links a {
  display: inline-flex;
  align-items: center;
  min-height: var(--tap);
}

/* ─── Success ──────────────────────────────────────────────── */
.cs__success {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-03);
  padding-block: var(--space-07);
}

.cs__success-icon {
  font-size: var(--fs-h3);
  color: var(--gold);
  line-height: 1;
}

.cs__success-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  color: var(--text);
  margin: 0;
  outline: none;
}

.cs__success-summary {
  margin: 0;
}

.cs__success-body {
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--text-dim);
  margin: 0;
  max-width: 44ch;
}

.cs__success-reset {
  margin-top: var(--space-04);
}

/* ─── Responsive ───────────────────────────────────────────── */
@media (min-width: 640px) {
  .cs__form-foot {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .cs__submit {
    width: auto;
    flex-shrink: 0;
  }

  .cs__info {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-05) var(--space-08);
  }
}

/* Info 1–5, form 7–12 */
@media (min-width: 900px) {
  .cs__left {
    grid-column: 1 / 6;
  }

  .cs__form-wrap {
    grid-column: 7 / 13;
    padding: var(--space-08) var(--space-08) var(--space-08) calc(var(--space-08) + var(--space-04));
  }

  .cs__info {
    flex-direction: column;
    gap: var(--space-05);
  }

  .cs__field-num {
    display: block;
    left: calc(-1 * var(--space-06));
  }
}
</style>
