---
layout: page
title: Experience
subtitle: Work experience presented as systems, decision loops, and operational proof instead of a resume pasted onto the web.
kicker: Experience
permalink: /experience/
---
<div class="section-heading" data-reveal>
  <h2>Roles that connect engineering execution with measurable business decisions.</h2>
  <p>
    The page is intentionally structured around what was built, what kind of workflow it improved, and why the work mattered. The goal is to make the experience legible as evidence, not just chronology.
  </p>
</div>

<div class="home-editorial">
  <article class="lede-block" data-reveal>
    <p class="section-kicker">Current framing</p>
    <h2>Balanced range, strongest proof in reliable systems.</h2>
    <p>
      The roles span data engineering, analytics engineering, operational reporting, and product measurement. The common thread is reliability under ambiguity: making complex workflows measurable and usable for the people who depend on them.
    </p>
  </article>

  <aside class="brief-panel" data-reveal>
    <p class="section-kicker">Reading guide</p>
    <div class="brief-panel__list">
      <p><span class="brief-panel__value">Primary proof</span> EnvoyX and UPS Data Analyst show the clearest current fit for engineering and analytics-heavy roles.</p>
      <p><span class="brief-panel__value">Why the older roles matter</span> They make the messy-inputs-to-trustworthy-systems narrative believable.</p>
    </div>
  </aside>
</div>

<div class="experience-grid">
  {% for role in site.data.experience %}
    {% include role-card.html role=role %}
  {% endfor %}
</div>

<article class="frame-card" data-reveal>
  <p class="section-kicker">Why the page is organized this way</p>
  <h2>Role titles matter less than the system patterns they reveal.</h2>
  <p>
    The earlier site leaned too much on isolated project references. This version uses the work history to show a stronger progression: from operational inputs and document-heavy workflows, to KPI systems, to GTM warehouse modeling and more mature reliability patterns.
  </p>
</article>
