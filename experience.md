---
layout: page
title: Experience
subtitle: "Recent roles."
kicker: Experience
permalink: /experience/
visual_variant: experience
visual_density: low
---
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
