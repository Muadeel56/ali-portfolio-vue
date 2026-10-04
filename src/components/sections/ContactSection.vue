<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import emailjs from '@emailjs/browser'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { contactInfo, socials } from '@/data/contact.js'
import { services, findService } from '@/data/services.js'
import { site } from '@/data/site.js'
import Rule from '../ui/Rule.vue'

useScrollReveal('.contact-section .reveal')

// ── EmailJS credentials — replace with real values from emailjs.com ──
const EMAILJS_SERVICE_ID  = 'service_1paayws'
const EMAILJS_TEMPLATE_ID = 'template_biy5qcs'
const EMAILJS_PUBLIC_KEY  = 'TIMsqqL9WtG6PtJZG'

const OTHER = { value: 'other', label: 'Something else' }
const serviceOptions = [...services.map((sv) => ({ value: sv.id, label: sv.title })), OTHER]
const serviceLabel = (value) => serviceOptions.find((o) => o.value === value)?.label ?? ''

const form = ref({ name: '', email: '', service: '', message: '' })
const focusedField = ref(null)
const status = ref('idle') // idle | sending | success | error

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

const onFocus  = (field) => { focusedField.value = field }
const onBlur   = ()      => { focusedField.value = null  }
const isFocused = (field) => focusedField.value === field

const submit = async () => {
  if (status.value === 'sending') return
  status.value = 'sending'

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name:    form.value.name,
        from_email:   form.value.email,
        service:      serviceLabel(form.value.service),
        message:      form.value.message,
      },
      EMAILJS_PUBLIC_KEY,
    )
    status.value = 'success'
    form.value = { name: '', email: '', service: '', message: '' }
  } catch {
    status.value = 'error'
  }
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
              <a :href="item.href" class="cs__info-link">{{ item.text }}</a>
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

          <p class="cs__status">
            <span class="cs__dot" aria-hidden="true" />
            <b>Available</b> · {{ site.availability }}
          </p>
        </div>

        <!-- ── Right column — form ───────────────────── -->
        <div class="cs__form-wrap reveal">
          <div class="cs__form-head">
            <h3 class="cs__form-title">Project Brief</h3>
            <span class="cs__form-meta"><b>Reply</b> within 24h</span>
          </div>
          <Rule class="cs__form-divider" />

          <!-- Success state -->
          <Transition name="fade">
            <div v-if="status === 'success'" class="cs__success">
              <span class="cs__success-icon" aria-hidden="true">✓</span>
              <h4 class="cs__success-title">Message sent.</h4>
              <p class="cs__success-body">I'll be in touch within 24 hours.</p>
              <button class="cs__success-reset btn btn-outline" @click="status = 'idle'">
                Send another →
              </button>
            </div>
          </Transition>

          <Transition name="fade">
            <form v-if="status !== 'success'" class="cs__form" novalidate @submit.prevent="submit">

              <!-- Name -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('name') }">
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
                  @focus="onFocus('name')"
                  @blur="onBlur"
                />
              </div>

              <!-- Email -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('email') }">
                <span class="cs__field-num" aria-hidden="true">02</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-email">Email Address</label>
                  <span class="cs__opt" aria-hidden="true">Required</span>
                </div>
                <input
                  id="cs-email"
                  v-model="form.email"
                  type="email"
                  placeholder="Email Address"
                  required
                  autocomplete="email"
                  @focus="onFocus('email')"
                  @blur="onBlur"
                />
              </div>

              <!-- Service -->
              <div class="cs__field cs__field--select" :class="{ 'is-focused': isFocused('service') }">
                <span class="cs__field-num" aria-hidden="true">03</span>
                <div class="cs__label-row">
                  <label class="cs__field-lbl" for="cs-service">Service</label>
                  <span class="cs__opt" aria-hidden="true">Optional</span>
                </div>
                <select
                  id="cs-service"
                  v-model="form.service"
                  @focus="onFocus('service')"
                  @blur="onBlur"
                >
                  <option value="" disabled>Select a Service</option>
                  <option v-for="o in serviceOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                </select>
                <span class="cs__select-arrow" aria-hidden="true" />
              </div>

              <!-- Message -->
              <div class="cs__field" :class="{ 'is-focused': isFocused('message') }">
                <span class="cs__field-num" aria-hidden="true">04</span>
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
                  @focus="onFocus('message')"
                  @blur="onBlur"
                />
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
                  {{ status === 'sending' ? 'Sending…' : 'Send Message' }}
                  <span v-if="status !== 'sending'" aria-hidden="true">→</span>
                </button>
              </div>

              <!-- Inline error -->
              <Transition name="fade">
                <p v-if="status === 'error'" class="cs__error" role="alert">
                  <span aria-hidden="true">⚠</span> Something went wrong — please try again or email directly.
                </p>
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
  border-bottom: 1px solid transparent;
  padding-bottom: 3px;
  transition:
    color var(--dur-fast) var(--ease-out-expo),
    border-color var(--dur-fast) var(--ease-out-expo);
}

.cs__social-link:hover {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

.cs__status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-03);
  margin: var(--space-06) 0 0;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.cs__status b {
  color: var(--text-dim);
  font-weight: 500;
}

.cs__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  flex-shrink: 0;
  animation: cs-blink var(--dur-loop) var(--ease-in-out) infinite;
}

@keyframes cs-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
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
  gap: var(--space-06);
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
  font-size: var(--fs-body);
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
  color: var(--muted);
  cursor: pointer;
}

.cs__field select option {
  background: var(--surface);
  color: var(--text);
}

.cs__field textarea {
  resize: none;
  min-height: 110px;
}

.cs__field--select {
  position: relative;
}

.cs__select-arrow {
  position: absolute;
  right: 0;
  bottom: 18px;
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
}

.cs__success-body {
  font-size: var(--fs-body);
  color: var(--text-dim);
  margin: 0;
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
