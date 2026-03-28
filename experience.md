---
layout: page
title: Experience
subtitle: Experience in data engineering, product analytics, and reporting systems that support confident decisions.
kicker: Experience
permalink: /experience/
visual_variant: experience
visual_density: medium
---
<div class="section-heading section-heading--split" data-reveal>
  <h2>I build warehouse models, KPI systems, and reporting workflows that teams can rely on.</h2>
  <p>
    Across these roles, I have usually taken fragmented operational data and turned it into outputs a team can trust, explain, and use.
  </p>
</div>

<div class="experience-grid">
  {% for role in site.data.experience %}
    {% include role-card.html role=role %}
  {% endfor %}
</div>
