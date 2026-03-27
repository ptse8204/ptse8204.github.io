---
layout: page
title: Experience
subtitle: I build analytics and data systems that make messy workflows measurable, reliable, and easier to act on.
kicker: Experience
permalink: /experience/
---
<div class="section-heading" data-reveal>
  <h2>My strongest recent work is in warehouse modeling, KPI systems, and decision-ready reporting.</h2>
  <p>
    Across these roles, I have usually been responsible for taking fragmented operational data and turning it into something a team can trust, explain, and use.
  </p>
</div>

<div class="experience-grid">
  {% for role in site.data.experience %}
    {% include role-card.html role=role %}
  {% endfor %}
</div>
