---
layout: page
title: Experience
subtitle: "Roles across data engineering, analytics, and operations-facing reporting, with the same basic job each time: make important workflows and numbers dependable."
kicker: Experience
permalink: /experience/
visual_variant: experience
visual_density: medium
hero_chips:
  - Data engineering
  - Analytics engineering
  - Product analytics
---
<article class="surface-card surface-card--summary" data-reveal>
  <p class="section-kicker">Fast read</p>
  <h2>The job has been similar in each role.</h2>
  <p>
    The starting point is usually some mix of messy inputs, unclear definitions, or brittle reporting. The work is to turn that into something another team can use without needing constant support.
  </p>
  <div class="outcome-rack">
    <article class="signal-panel">
      <div class="signal-panel__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="signal-panel__label">Data</p>
      <p class="signal-panel__text">shared source</p>
    </article>
    <article class="signal-panel">
      <div class="signal-panel__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="signal-panel__label">Workflow</p>
      <p class="signal-panel__text">clean handoffs</p>
    </article>
    <article class="signal-panel">
      <div class="signal-panel__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="signal-panel__label">Use</p>
      <p class="signal-panel__text">clear reporting view</p>
    </article>
  </div>
</article>

{% if site.data.experience and site.data.experience.size > 0 %}
  <div class="experience-grid">
    {% for role in site.data.experience %}
      {% include role-card.html role=role %}
    {% endfor %}
  </div>
{% else %}
  <article class="frame-card" data-reveal>
    <h2>Experience details are being refreshed.</h2>
    <p>The timeline will return once the underlying data file is repopulated.</p>
  </article>
{% endif %}
