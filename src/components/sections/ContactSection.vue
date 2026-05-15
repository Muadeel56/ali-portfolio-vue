<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import AppButton from '../ui/AppButton.vue'
</script>

<template>
  <section id="contact" class="section contact-section">
    <div class="container">
      <header class="section-header">
        <div>
          <p class="section-header__num"><span>06</span> / Contact</p>
          <SectionLabel text="— 06 / Enquire" />
        </div>
        <p class="t-body-small section-header__desc">
          Available for commissions. Replies within two business days.
        </p>
      </header>

      <div class="contact-section__grid">
        <div>
          <h2 class="t-display-h2">Let's make something <em>quiet.</em></h2>
          <p class="t-body-large contact-section__lead">
            Tell me about your project — format, timeline, and the feeling you're after.
          </p>
          <div class="contact-section__meta t-mono">
            <div><b>Status</b> · Available · Q3 26</div>
            <div><b>Based</b> · Karachi, PK</div>
          </div>
        </div>

        <form class="contact-section__form" @submit.prevent>
          <div class="input-field">
            <label class="input-field__label" for="name">Your Name</label>
            <input id="name" class="input" type="text" placeholder="e.g. Studio Beaufort" />
          </div>
          <div class="input-field">
            <label class="input-field__label" for="email">Email</label>
            <input id="email" class="input" type="email" placeholder="hello@example.com" />
          </div>
          <div class="input-field">
            <label class="input-field__label" for="message">Message</label>
            <input id="message" class="input" type="text" placeholder="Tell me about the project" />
          </div>
          <AppButton variant="primary" type="submit" show-arrow>Send Enquiry</AppButton>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section__grid {
  display: grid;
  gap: var(--space-09);
}

@media (min-width: 768px) {
  .contact-section__grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.contact-section__lead {
  margin-top: var(--space-05);
  max-width: 420px;
}

.contact-section__meta {
  margin-top: var(--space-06);
}

.contact-section__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-06);
  padding: var(--space-07);
  background: var(--surface);
  border: 1px solid var(--border);
}

.section-header__desc {
  margin: 0;
  max-width: 480px;
}
</style>
