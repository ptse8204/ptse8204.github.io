---
layout: page
title: Experience
subtitle: "Roles across data engineering, analytics engineering, and operations-facing reporting. The common thread is dependable data, clear definitions, and workflows another team can keep using."
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
  <p class="section-kicker">Recruiter read</p>
  <h2>I work best where analytics and operations meet.</h2>
  <p>
    The roles below are different on paper, but the work has a consistent shape: clean up the source, make the logic inspectable, and turn the result into a reporting or workflow surface people can trust.
  </p>
  <div class="outcome-rack">
    <article class="signal-panel">
      <div class="signal-panel__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="signal-panel__label">Strength</p>
      <p class="signal-panel__text">modeling messy inputs</p>
    </article>
    <article class="signal-panel">
      <div class="signal-panel__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="signal-panel__label">Proof</p>
      <p class="signal-panel__text">tests, lineage, ownership</p>
    </article>
    <article class="signal-panel">
      <div class="signal-panel__chrome" aria-hidden="true"><span></span><span></span><span></span></div>
      <p class="signal-panel__label">Outcome</p>
      <p class="signal-panel__text">clearer team decisions</p>
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
