---
layout: page
title: Experience
subtitle: Experience in data engineering, product analytics, and reporting systems that support confident decisions.
kicker: Experience
permalink: /experience/
---
<div class="section-heading" data-reveal>
  <h2>I build warehouse models, KPI systems, and reporting workflows that teams can rely on.</h2>
  <p>
    Across these roles, I have usually been responsible for taking fragmented operational data and turning it into outputs a team can trust, explain, and use.
  </p>
</div>

<div class="experience-grid">
  {% for role in site.data.experience %}
    {% include role-card.html role=role %}
  {% endfor %}
</div>
